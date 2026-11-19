import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getErrorMessage, moviesApi } from "./api";
import type { CreateMoviePayload, Movie } from "./types";

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
		<article className="movie-row">
			<div className="movie-heading">
				<div>
					<h3>{movie.title}</h3>
					<p className="muted">
						{movie.releaseYear} · {movie.runtimeMinutes} min
					</p>
				</div>
				<div className="row-actions">
					<label className="inline-checkbox">
						<input
							type="checkbox"
							checked={movie.watched}
							onChange={() => onWatched(movie)}
						/>
						Watched
					</label>
					<button
						type="button"
						className="danger"
						disabled={deleting}
						onClick={() => onDelete(movie)}
					>
						{deleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>

			<div className="prerequisites">
				<label htmlFor={`prerequisites-${movie.id}`}>Prerequisites</label>
				<div className="inline-controls">
					<select
						id={`prerequisites-${movie.id}`}
						multiple
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
						className="secondary"
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

const App = () => {
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
		<main className="app">
			<header className="app-header">
				<p className="eyebrow">CineQuest</p>
				<h1>Movies</h1>
				<p className="muted">Plan Your Rewatch. Book Your Premiere.</p>
			</header>

			{error && <p className="message message-error">{error}</p>}
			{notice && <p className="message message-success">{notice}</p>}

			<div className="layout">
				<section className="card">
					<h2>Add a movie</h2>
					<form className="form" onSubmit={handleCreate}>
						<label>
							Title
							<input
								required
								maxLength={200}
								value={form.title}
								onChange={(event) =>
									setForm({ ...form, title: event.target.value })
								}
							/>
						</label>

						<div className="form-row">
							<label>
								Release year
								<input
									required
									type="number"
									min={1888}
									max={2100}
									value={form.releaseYear}
									onChange={(event) =>
										setForm({ ...form, releaseYear: event.target.value })
									}
								/>
							</label>
							<label>
								Runtime (minutes)
								<input
									required
									type="number"
									min={1}
									max={300}
									value={form.runtimeMinutes}
									onChange={(event) =>
										setForm({ ...form, runtimeMinutes: event.target.value })
									}
								/>
							</label>
						</div>

						<label>
							Prerequisites
							<select
								multiple
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

						<label className="inline-checkbox">
							<input
								type="checkbox"
								checked={form.watched}
								onChange={(event) =>
									setForm({ ...form, watched: event.target.checked })
								}
							/>
							Already watched
						</label>

						<button type="submit" disabled={saving}>
							{saving ? "Adding..." : "Add movie"}
						</button>
					</form>
				</section>

				<section className="card">
					<h2>Movie library</h2>
					<div className="movie-list">
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
							<p className="muted">No movies yet. Add the first one.</p>
						)}
					</div>
				</section>
			</div>
		</main>
	);
};

export default App;
