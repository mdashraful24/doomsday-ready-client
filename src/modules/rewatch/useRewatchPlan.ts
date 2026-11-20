import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage, moviesApi } from "../../api";
import type { RewatchOrder } from "../../types";
import { getTargetMovieId, useAppData } from "../../providers/AppDataProvider";

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
	const {
		movies,
		loadingMovies,
		loadedMovies,
		orders,
		loadingOrders,
		loadedOrders,
		loadMovies,
		loadOrder,
		setMovies,
		setOrder,
	} = useAppData();
	const [selectedId, setSelectedId] = useState(() => getTargetMovieId(movies));
	const [updatingId, setUpdatingId] = useState("");
	const initialLoad = useRef(loadedMovies);
	const requestedOrderIds = useRef(new Set<string>());

	useEffect(() => {
		void loadMovies({ silent: initialLoad.current });
	}, [loadMovies]);

	useEffect(() => {
		if (movies.length > 0 && !movies.some((movie) => movie.id === selectedId)) {
			setSelectedId(getTargetMovieId(movies));
		}
	}, [movies, selectedId]);

	useEffect(() => {
		if (!selectedId || requestedOrderIds.current.has(selectedId)) return;

		requestedOrderIds.current.add(selectedId);
		void loadOrder(selectedId, { silent: Boolean(loadedOrders[selectedId]) });
	}, [selectedId, loadOrder, loadedOrders]);

	const order = selectedId ? (orders[selectedId] ?? null) : null;
	const orderLoading = Boolean(loadingOrders[selectedId]);
	const loading =
		loadingMovies ||
		(Boolean(selectedId) && (orderLoading || !loadedOrders[selectedId]));

	const selectTarget = (id: string) => {
		setSelectedId(id);
		requestedOrderIds.current.add(id);
		void loadOrder(id, { silent: Boolean(loadedOrders[id]) });
	};

	const toggleWatched = async (movie: OrderMovie) => {
		const watched = !movie.watched;

		setUpdatingId(movie.id);
		setMovies((current) =>
			current.map((item) =>
				item.id === movie.id ? { ...item, watched } : item,
			),
		);
		setOrder(selectedId, (current) =>
			withWatchedState(current, movie, watched),
		);

		try {
			await moviesApi.update(movie.id, { watched });
		} catch (error) {
			setMovies((current) =>
				current.map((item) =>
					item.id === movie.id ? { ...item, watched: movie.watched } : item,
				),
			);
			setOrder(selectedId, (current) =>
				withWatchedState(current, movie, movie.watched),
			);
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
