import { FilmIcon } from "../../components/Icons";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { SectionCard } from "../../components/SectionCard";
import { SkeletonList, SkeletonStats } from "../../components/Skeleton";
import { usePagination } from "../../hooks/usePagination";
import type { Movie } from "../../types";
import { chipClass, statLabelClass, statValueClass } from "../../ui";
import { formatRuntime } from "../../utils";
import { MovieRow } from "./MovieRow";

const PAGE_SIZE = 4;

type MovieLibraryProps = {
	movies: Movie[];
	loading: boolean;
	deletingId: string;
	onWatched: (movie: Movie) => void;
	onPrerequisites: (movie: Movie, prerequisiteIds: string[]) => void;
	onDelete: (movie: Movie) => void;
};

export const MovieLibrary = ({
	movies,
	loading,
	deletingId,
	onWatched,
	onPrerequisites,
	onDelete,
}: MovieLibraryProps) => {
	const { page, pageCount, startIndex, setPage } = usePagination(
		movies.length,
		PAGE_SIZE,
	);
	const visibleMovies = movies.slice(startIndex, startIndex + PAGE_SIZE);
	const watchedCount = movies.filter((movie) => movie.watched).length;
	const unwatchedRuntime = movies.reduce(
		(total, movie) => total + (movie.watched ? 0 : movie.runtimeMinutes),
		0,
	);

	return (
		<SectionCard
			eyebrow="Your watchlist"
			title="Movie library"
			description="Edit prerequisites or mark titles watched; every change feeds the rewatch plan and booking recap."
			icon={<FilmIcon />}
			action={<span className={chipClass}>{movies.length} titles</span>}
		>
			{loading ? (
				<>
					<SkeletonStats />
					<div className="mt-5">
						<SkeletonList rows={4} />
					</div>
				</>
			) : (
				<>
					<div className="grid gap-3 sm:grid-cols-3">
						<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-lg shadow-black/10">
							<p className={statLabelClass}>Library size</p>
							<p className={`${statValueClass} mt-1`}>{movies.length}</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-lg shadow-black/10">
							<p className={statLabelClass}>Watched</p>
							<p className={`${statValueClass} mt-1`}>{watchedCount}</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-lg shadow-black/10">
							<p className={statLabelClass}>Left to watch</p>
							<p className={`${statValueClass} mt-1`}>
								{formatRuntime(unwatchedRuntime)}
							</p>
						</div>
					</div>

					<div className="mt-5 grid gap-3">
						{visibleMovies.map((movie) => (
							<MovieRow
								key={movie.id}
								movie={movie}
								movies={movies}
								deleting={deletingId === movie.id}
								onWatched={onWatched}
								onPrerequisites={onPrerequisites}
								onDelete={onDelete}
							/>
						))}
						{movies.length === 0 && (
							<EmptyState
								title="Your library is empty"
								description="Add the first movie to start mapping the rewatch path."
								icon={<FilmIcon />}
							/>
						)}
					</div>

					{movies.length > 0 && (
						<Pagination
							page={page}
							pageCount={pageCount}
							pageSize={PAGE_SIZE}
							total={movies.length}
							onPageChange={setPage}
						/>
					)}
				</>
			)}
		</SectionCard>
	);
};
