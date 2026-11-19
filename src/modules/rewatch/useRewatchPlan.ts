import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage, moviesApi } from "../../api";
import type { Movie, RewatchOrder } from "../../types";

type OrderMovie = RewatchOrder["movies"][number];

const withWatchedState = (
	order: RewatchOrder | null,
	movie: OrderMovie,
	watched: boolean,
) => {
	if (!order) return order;

	const current = order.movies.find((item) => item.id === movie.id);
	if (!current || current.watched === watched) return order;

	const delta = watched ? 1 : -1;

	return {
		...order,
		watchedCount: order.watchedCount + delta,
		unwatchedTotalRuntimeMinutes: Math.max(
			0,
			order.unwatchedTotalRuntimeMinutes - delta * movie.runtimeMinutes,
		),
		movies: order.movies.map((item) =>
			item.id === movie.id ? { ...item, watched } : item,
		),
	};
};

export const useRewatchPlan = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [selectedId, setSelectedId] = useState("");
	const [order, setOrder] = useState<RewatchOrder | null>(null);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState("");

	const loadOrder = useCallback(async (id: string) => {
		if (!id) {
			setOrder(null);
			setLoading(false);
			return;
		}

		setLoading(true);

		try {
			setOrder(await moviesApi.getRewatchOrder(id));
		} catch (error) {
			setOrder(null);
			toast.error("Could not load rewatch order", {
				description: getErrorMessage(error),
			});
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const load = async () => {
			try {
				const list = await moviesApi.list();
				const target =
					list.find((movie) => movie.title === "Avengers: Doomsday") ?? list[0];

				setMovies(list);
				setSelectedId(target?.id ?? "");
				await loadOrder(target?.id ?? "");
			} catch (error) {
				setMovies([]);
				setLoading(false);
				toast.error("Could not load movies", {
					description: getErrorMessage(error),
				});
			}
		};

		void load();
	}, [loadOrder]);

	const selectTarget = (id: string) => {
		setSelectedId(id);
		void loadOrder(id);
	};

	const toggleWatched = async (movie: OrderMovie) => {
		const watched = !movie.watched;

		setUpdatingId(movie.id);
		setMovies((current) =>
			current.map((item) =>
				item.id === movie.id ? { ...item, watched } : item,
			),
		);
		setOrder((current) => withWatchedState(current, movie, watched));

		try {
			await moviesApi.update(movie.id, { watched });
		} catch (error) {
			setMovies((current) =>
				current.map((item) =>
					item.id === movie.id ? { ...item, watched: movie.watched } : item,
				),
			);
			setOrder((current) => withWatchedState(current, movie, movie.watched));
			toast.error("Could not update watched status", {
				description: getErrorMessage(error),
			});
		} finally {
			setUpdatingId("");
		}
	};

	return {
		movies,
		selectedId,
		order,
		loading,
		updatingId,
		selectTarget,
		toggleWatched,
	};
};
