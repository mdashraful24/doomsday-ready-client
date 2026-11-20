import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage, moviesApi } from "../../api";
import type { CreateMoviePayload, Movie } from "../../types";
import { useAppData } from "../../providers/AppDataProvider";
import { emptyMovieForm, type MovieFormValues } from "./types";

const toMoviePayload = (form: MovieFormValues): CreateMoviePayload => ({
	title: form.title.trim(),
	releaseYear: Number(form.releaseYear),
	runtimeMinutes: Number(form.runtimeMinutes),
	watched: form.watched,
	prerequisiteIds: form.prerequisiteIds,
});

export const useMovies = () => {
	const { movies, loadingMovies, loadedMovies, loadMovies, setMovies } =
		useAppData();
	const [form, setForm] = useState<MovieFormValues>(emptyMovieForm);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState("");
	const initialLoad = useRef(loadedMovies);

	useEffect(() => {
		void loadMovies({ silent: initialLoad.current });
	}, [loadMovies]);

	const createMovie = async () => {
		setSaving(true);

		try {
			const created = await moviesApi.create(toMoviePayload(form));
			setMovies((current) => [created, ...current]);
			setForm(emptyMovieForm);
			toast.success("Movie added", {
				description: `${created.title} is now in the library.`,
			});
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
				current.map((item) => (item.id === updated.id ? updated : item)),
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
		setMovies((current) =>
			current.map((item) =>
				item.id === movie.id ? { ...item, prerequisiteIds } : item,
			),
		);

		try {
			const updated = await moviesApi.update(movie.id, { prerequisiteIds });
			setMovies((current) =>
				current.map((item) => (item.id === updated.id ? updated : item)),
			);
			toast.success("Prerequisites updated", {
				description: `${movie.title} now has ${prerequisiteIds.length} prerequisite${prerequisiteIds.length === 1 ? "" : "s"}.`,
			});
		} catch (error) {
			setMovies((current) =>
				current.map((item) =>
					item.id === movie.id
						? { ...item, prerequisiteIds: movie.prerequisiteIds }
						: item,
				),
			);
			toast.error("Could not update prerequisites", {
				description: getErrorMessage(error),
			});
		}
	};

	const removeMovie = async (movie: Movie) => {
		setDeletingId(movie.id);

		try {
			await moviesApi.remove(movie.id);
			setMovies((current) => current.filter((item) => item.id !== movie.id));
			setForm((current) => ({
				...current,
				prerequisiteIds: current.prerequisiteIds.filter(
					(id) => id !== movie.id,
				),
			}));
			toast.success("Movie deleted", {
				description: `${movie.title} was removed.`,
			});
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
		loading: loadingMovies,
		saving,
		deletingId,
		createMovie,
		updateWatched,
		updatePrerequisites,
		removeMovie,
	};
};
