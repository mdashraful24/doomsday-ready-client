import { useCallback, useEffect, useState } from "react";
import { getErrorMessage, moviesApi } from "../api";
import type { Movie, RewatchOrder } from "../types";
import {
	cardClass,
	checkboxClass,
	checkboxInputClass,
	errorMessageClass,
	inputClass,
	labelClass,
	mutedClass,
} from "../ui";

const formatRuntime = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const remainder = minutes % 60;

	if (hours === 0) return `${remainder}m`;
	if (remainder === 0) return `${hours}h`;

	return `${hours}h ${remainder}m`;
};

const RewatchPlanView = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [selectedId, setSelectedId] = useState("");
	const [order, setOrder] = useState<RewatchOrder | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [updatingId, setUpdatingId] = useState("");

	const loadOrder = useCallback(async (id: string) => {
		if (!id) {
			setOrder(null);
			return;
		}

		setLoading(true);

		try {
			setOrder(await moviesApi.getRewatchOrder(id));
			setError("");
		} catch (loadError) {
			setOrder(null);
			setError(getErrorMessage(loadError));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const loadMovies = async () => {
			try {
				const list = await moviesApi.list();
				const target =
					list.find((movie) => movie.title === "Avengers: Doomsday") ?? list[0];

				setMovies(list);
				setSelectedId(target?.id ?? "");
				await loadOrder(target?.id ?? "");
			} catch (loadError) {
				setError(getErrorMessage(loadError));
			}
		};

		void loadMovies();
	}, [loadOrder]);

	const handleTargetChange = (id: string) => {
		setSelectedId(id);
		void loadOrder(id);
	};

	const handleWatchedToggle = async (movie: RewatchOrder["movies"][number]) => {
		setUpdatingId(movie.id);

		try {
			await moviesApi.update(movie.id, { watched: !movie.watched });
			await loadOrder(selectedId);
		} catch (updateError) {
			setError(getErrorMessage(updateError));
		} finally {
			setUpdatingId("");
		}
	};

	const progress =
		order && order.totalCount > 0
			? Math.round((order.watchedCount / order.totalCount) * 100)
			: 0;

	return (
		<section className={`${cardClass} grid gap-4`}>
			<h2 className="text-lg font-semibold">Rewatch Plan</h2>

			<label className={labelClass}>
				Target movie
				<select
					className={inputClass}
					value={selectedId}
					onChange={(event) => handleTargetChange(event.target.value)}
				>
					<option value="">Select a movie</option>
					{movies.map((movie) => (
						<option key={movie.id} value={movie.id}>
							{movie.title}
						</option>
					))}
				</select>
			</label>

			{error && <p className={errorMessageClass}>{error}</p>}
			{loading && <p className={mutedClass}>Loading rewatch order...</p>}

			{!loading && order && (
				<div className="grid gap-3.5">
					<div className="flex flex-wrap justify-between gap-3 text-sm text-slate-300">
						<span>
							{order.watchedCount} of {order.totalCount} watched
						</span>
						<span>
							{formatRuntime(order.unwatchedTotalRuntimeMinutes)} remaining
						</span>
					</div>
					<div className="h-2 overflow-hidden rounded-full bg-slate-950">
						<div
							className="h-full rounded-full bg-indigo-400 transition-[width] duration-200"
							style={{ width: `${progress}%` }}
						/>
					</div>

					<ol className="grid gap-2">
						{order.movies.map((movie, index) => (
							<li
								className={`flex flex-wrap items-center gap-3 rounded-xl border bg-slate-950/60 p-3 ${
									movie.watched
										? "border-emerald-400/30"
										: "border-slate-700/50"
								}`}
								key={movie.id}
							>
								<span className="grid size-6 shrink-0 place-items-center rounded-full bg-indigo-400/15 text-xs font-bold text-indigo-200">
									{index + 1}
								</span>
								<div className="grid flex-1 gap-0.5">
									<strong className="text-sm font-semibold">
										{movie.title}
									</strong>
									<span className="text-xs text-slate-400">
										{movie.releaseYear} · {movie.runtimeMinutes} min
									</span>
								</div>
								<label className={checkboxClass}>
									<input
										type="checkbox"
										className={checkboxInputClass}
										checked={movie.watched}
										disabled={updatingId === movie.id}
										onChange={() => void handleWatchedToggle(movie)}
									/>
									Watched
								</label>
							</li>
						))}
					</ol>

					{order.movies.length === 0 && (
						<p className="text-sm text-slate-400">
							No prerequisites for {order.target.title}.
						</p>
					)}
				</div>
			)}

			{!loading && !order && !error && (
				<p className={mutedClass}>
					Pick a target movie to see its rewatch plan.
				</p>
			)}
		</section>
	);
};

export default RewatchPlanView;
