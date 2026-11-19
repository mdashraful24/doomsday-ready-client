import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getErrorMessage, moviesApi } from "../api";
import type { CreateMoviePayload, Movie } from "../types";
import {
	cardClass,
	checkboxClass,
	checkboxInputClass,
	dangerButtonClass,
	errorMessageClass,
	inputClass,
	labelClass,
	mutedClass,
	multiSelectClass,
	primaryButtonClass,
	secondaryButtonClass,
	successMessageClass,
} from "../ui";

type MovieForm = {
	title: string;
	releaseYear: string;
	runtimeMinutes: string;
	prerequisiteIds: string[];
	watched: boolean;
};

const emptyForm: MovieForm = {
	title: "",
	releaseYear: "",
	runtimeMinutes: "",
	prerequisiteIds: [],
	watched: false,
};

type MovieRowProps = {
	movie: Movie;
	movies: Movie[];
	deleting: boolean;
	onWatched: (movie: Movie) => void;
	onPrerequisites: (movie: Movie, prerequisiteIds: string[]) => void;
	onDelete: (movie: Movie) => void;
};

const MovieRow = ({
	movie,
	movies,
	deleting,
	onWatched,
	onPrerequisites,
	onDelete,
}: MovieRowProps) => {
	const [selectedIds, setSelectedIds] = useState(movie.prerequisiteIds);

	useEffect(() => {
		setSelectedIds(movie.prerequisiteIds);
	}, [movie.prerequisiteIds]);

	const candidates = movies.filter((candidate) => candidate.id !== movie.id);
	const hasChanges =
		selectedIds.length !== movie.prerequisiteIds.length ||
		selectedIds.some((id) => !movie.prerequisiteIds.includes(id));

	return (
		<article className="grid gap-3.5 rounded-xl border border-slate-700/50 bg-slate-950/60 p-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h3 className="text-base font-semibold">{movie.title}</h3>
					<p className={mutedClass}>
						{movie.releaseYear} · {movie.runtimeMinutes} min
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<label className={checkboxClass}>
						<input
							type="checkbox"
							className={checkboxInputClass}
							checked={movie.watched}
							onChange={() => onWatched(movie)}
						/>
						Watched
					</label>
					<button
						type="button"
						className={dangerButtonClass}
						disabled={deleting}
						onClick={() => onDelete(movie)}
					>
						{deleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>

			<div className="grid gap-1.5">
				<label className={labelClass} htmlFor={`prerequisites-${movie.id}`}>
					Prerequisites
				</label>
				<div className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
					<select
						id={`prerequisites-${movie.id}`}
						multiple
						className={multiSelectClass}
						value={selectedIds}
						onChange={(event) =>
							setSelectedIds(
								Array.from(event.target.selectedOptions).map(
									(option) => option.value,
								),
							)
						}
					>
						{candidates.map((candidate) => (
							<option key={candidate.id} value={candidate.id}>
								{candidate.title}
							</option>
						))}
					</select>
					<button
						type="button"
						className={secondaryButtonClass}
						disabled={!hasChanges}
						onClick={() => onPrerequisites(movie, selectedIds)}
					>
						Save
					</button>
				</div>
			</div>
		</article>
	);
};

const MoviesView = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [form, setForm] = useState<MovieForm>(emptyForm);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState("");

	const loadMovies = useCallback(async () => {
		try {
			setMovies(await moviesApi.list());
		} catch (loadError) {
			setError(getErrorMessage(loadError));
		}
	}, []);

	useEffect(() => {
		void loadMovies();
	}, [loadMovies]);

	const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setNotice("");

		try {
			const payload: CreateMoviePayload = {
				title: form.title,
				releaseYear: Number(form.releaseYear),
				runtimeMinutes: Number(form.runtimeMinutes),
				watched: form.watched,
				prerequisiteIds: form.prerequisiteIds,
			};

			await moviesApi.create(payload);
			setForm(emptyForm);
			setNotice("Movie added.");
			await loadMovies();
		} catch (createError) {
			setError(getErrorMessage(createError));
		} finally {
			setSaving(false);
		}
	};

	const handleWatched = async (movie: Movie) => {
		setError("");
		setNotice("");

		try {
			await moviesApi.update(movie.id, { watched: !movie.watched });
			setNotice("Watched status updated.");
			await loadMovies();
		} catch (updateError) {
			setError(getErrorMessage(updateError));
		}
	};

	const handlePrerequisites = async (
		movie: Movie,
		prerequisiteIds: string[],
	) => {
		setError("");
		setNotice("");

		try {
			await moviesApi.update(movie.id, { prerequisiteIds });
			setNotice("Prerequisites updated.");
			await loadMovies();
		} catch (updateError) {
			setError(getErrorMessage(updateError));
		}
	};

	const handleDelete = async (movie: Movie) => {
		if (!window.confirm(`Delete "${movie.title}"?`)) return;

		setDeletingId(movie.id);
		setError("");
		setNotice("");

		try {
			await moviesApi.remove(movie.id);
			setForm((current) => ({
				...current,
				prerequisiteIds: current.prerequisiteIds.filter(
					(id) => id !== movie.id,
				),
			}));
			setNotice("Movie deleted.");
			await loadMovies();
		} catch (deleteError) {
			setError(getErrorMessage(deleteError));
		} finally {
			setDeletingId("");
		}
	};

	return (
		<>
			{error && <p className={errorMessageClass}>{error}</p>}
			{notice && <p className={successMessageClass}>{notice}</p>}

			<div className="grid gap-5 lg:grid-cols-[0.9fr_1.3fr]">
				<section className={cardClass}>
					<h2 className="text-lg font-semibold">Add a movie</h2>
					<form className="mt-4 grid gap-3.5" onSubmit={handleCreate}>
						<label className={labelClass}>
							Title
							<input
								required
								maxLength={200}
								className={inputClass}
								value={form.title}
								onChange={(event) =>
									setForm({ ...form, title: event.target.value })
								}
							/>
						</label>

						<div className="grid gap-3 sm:grid-cols-2">
							<label className={labelClass}>
								Release year
								<input
									required
									type="number"
									min={1888}
									max={2100}
									className={inputClass}
									value={form.releaseYear}
									onChange={(event) =>
										setForm({ ...form, releaseYear: event.target.value })
									}
								/>
							</label>
							<label className={labelClass}>
								Runtime (minutes)
								<input
									required
									type="number"
									min={1}
									max={300}
									className={inputClass}
									value={form.runtimeMinutes}
									onChange={(event) =>
										setForm({ ...form, runtimeMinutes: event.target.value })
									}
								/>
							</label>
						</div>

						<label className={labelClass}>
							Prerequisites
							<select
								multiple
								className={multiSelectClass}
								value={form.prerequisiteIds}
								onChange={(event) =>
									setForm({
										...form,
										prerequisiteIds: Array.from(
											event.target.selectedOptions,
										).map((option) => option.value),
									})
								}
							>
								{movies.map((movie) => (
									<option key={movie.id} value={movie.id}>
										{movie.title}
									</option>
								))}
							</select>
						</label>

						<label className={checkboxClass}>
							<input
								type="checkbox"
								className={checkboxInputClass}
								checked={form.watched}
								onChange={(event) =>
									setForm({ ...form, watched: event.target.checked })
								}
							/>
							Already watched
						</label>

						<button
							type="submit"
							className={primaryButtonClass}
							disabled={saving}
						>
							{saving ? "Adding..." : "Add movie"}
						</button>
					</form>
				</section>

				<section className={cardClass}>
					<h2 className="text-lg font-semibold">Movie library</h2>
					<div className="mt-4 grid gap-3">
						{movies.map((movie) => (
							<MovieRow
								key={movie.id}
								movie={movie}
								movies={movies}
								deleting={deletingId === movie.id}
								onWatched={(target) => void handleWatched(target)}
								onPrerequisites={(target, prerequisiteIds) =>
									void handlePrerequisites(target, prerequisiteIds)
								}
								onDelete={(target) => void handleDelete(target)}
							/>
						))}
						{movies.length === 0 && (
							<p className="text-sm text-slate-400">
								No movies yet. Add the first one.
							</p>
						)}
					</div>
				</section>
			</div>
		</>
	);
};

export default MoviesView;
