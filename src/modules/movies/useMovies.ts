import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage, moviesApi } from "../../api";
import { useConfirm } from "../../hooks/useConfirm";
import type { CreateMoviePayload, Movie } from "../../types";
import { emptyMovieForm, type MovieFormValues } from "./types";

export const useMovies = () => {
	const confirm = useConfirm();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [form, setForm] = useState<MovieFormValues>(emptyMovieForm);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState("");

	const loadMovies = useCallback(async () => {
		try {
			setMovies(await moviesApi.list());
		} catch (error) {
			toast.error("Could not load movies", {
				description: getErrorMessage(error),
			});
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadMovies();
	}, [loadMovies]);

	const createMovie = async () => {
		setSaving(true);

		try {
			const payload: CreateMoviePayload = {
				title: form.title,
				releaseYear: Number(form.releaseYear),
				runtimeMinutes: Number(form.runtimeMinutes),
				watched: form.watched,
				prerequisiteIds: form.prerequisiteIds,
			};

			await moviesApi.create(payload);
			setForm(emptyMovieForm);
			toast.success("Movie added to the library");
			await loadMovies();
		} catch (error) {
			toast.error("Could not add movie", {
				description: getErrorMessage(error),
			});
		} finally {
			setSaving(false);
		}
	};

	const updateWatched = async (movie: Movie) => {
		const watched = !movie.watched;

		setMovies((current) =>
			current.map((item) =>
				item.id === movie.id ? { ...item, watched } : item,
			),
		);

		try {
			const updated = await moviesApi.update(movie.id, { watched });
			setMovies((current) =>
				current.map((item) => (item.id === movie.id ? updated : item)),
			);
		} catch (error) {
			setMovies((current) =>
				current.map((item) =>
					item.id === movie.id ? { ...item, watched: movie.watched } : item,
				),
			);
			toast.error("Could not update watched status", {
				description: getErrorMessage(error),
			});
		}
	};

	const updatePrerequisites = async (
		movie: Movie,
		prerequisiteIds: string[],
	) => {
		try {
			await moviesApi.update(movie.id, { prerequisiteIds });
			toast.success("Prerequisites updated");
			await loadMovies();
		} catch (error) {
			toast.error("Could not update prerequisites", {
				description: getErrorMessage(error),
			});
		}
	};

	const removeMovie = async (movie: Movie) => {
		const accepted = await confirm({
			title: "Delete this movie?",
			description: `"${movie.title}" will be removed from your library and its prerequisite links. This action cannot be undone.`,
			confirmLabel: "Delete movie",
		});

		if (!accepted) return;

		setDeletingId(movie.id);

		try {
			await moviesApi.remove(movie.id);
			setForm((current) => ({
				...current,
				prerequisiteIds: current.prerequisiteIds.filter(
					(id) => id !== movie.id,
				),
			}));
			toast.success("Movie deleted");
			await loadMovies();
		} catch (error) {
			toast.error("Could not delete movie", {
				description: getErrorMessage(error),
			});
		} finally {
			setDeletingId("");
		}
	};

	return {
		movies,
		form,
		setForm,
		loading,
		saving,
		deletingId,
		createMovie,
		updateWatched,
		updatePrerequisites,
		removeMovie,
	};
};
