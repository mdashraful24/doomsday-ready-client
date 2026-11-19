import { EmptyState } from "../../components/EmptyState";
import { CheckIcon, ClockIcon, RouteIcon } from "../../components/Icons";
import { Pagination } from "../../components/Pagination";
import { SectionCard } from "../../components/SectionCard";
import { SkeletonList } from "../../components/Skeleton";
import { usePagination } from "../../hooks/usePagination";
import type { RewatchOrder } from "../../types";
import {
	checkboxClass,
	checkboxInputClass,
	chipClass,
	rowClass,
	successChipClass,
	timelineClass,
} from "../../ui";
import { formatRuntime } from "../../utils";

const PAGE_SIZE = 5;

type RewatchTimelineProps = {
	order: RewatchOrder | null;
	loading: boolean;
	updatingId: string;
	onToggle: (movie: RewatchOrder["movies"][number]) => void;
};

export const RewatchTimeline = ({
	order,
	loading,
	updatingId,
	onToggle,
}: RewatchTimelineProps) => {
	const total = order?.movies.length ?? 0;
	const { page, pageCount, startIndex, setPage } = usePagination(
		total,
		PAGE_SIZE,
	);
	const visibleMovies = (order?.movies ?? []).slice(
		startIndex,
		startIndex + PAGE_SIZE,
	);

	return (
		<SectionCard
			eyebrow="Watch order"
			title="Prerequisite path"
			description="Work top to bottom. Toggle any title to keep the progress and booking recap in sync."
			icon={<ClockIcon />}
			action={order && <span className={chipClass}>{total} steps</span>}
		>
			{loading ? (
				<SkeletonList rows={PAGE_SIZE} compact />
			) : visibleMovies.length > 0 ? (
				<>
					<ol className={timelineClass}>
						{visibleMovies.map((movie, index) => (
							<li key={movie.id} className="relative">
								<span className="absolute -left-9 top-0 grid size-8 place-items-center rounded-full border border-indigo-300/20 bg-slate-950 text-xs font-bold text-indigo-200 shadow-lg shadow-black/30">
									{startIndex + index + 1}
								</span>
								<article
									className={`${rowClass} ${
										movie.watched ? "border-emerald-300/20" : ""
									}`}
								>
									<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-2">
												<h3 className="text-sm font-semibold text-white">
													{movie.title}
												</h3>
												{movie.watched && (
													<span className={successChipClass}>
														<CheckIcon className="size-3" />
														Watched
													</span>
												)}
											</div>
											<p className="mt-1 text-xs text-slate-400">
												{movie.releaseYear} ·{" "}
												{formatRuntime(movie.runtimeMinutes)}
											</p>
										</div>
										<label className={checkboxClass}>
											<input
												type="checkbox"
												className={checkboxInputClass}
												checked={movie.watched}
												disabled={updatingId === movie.id}
												onChange={() => onToggle(movie)}
											/>
											Watched
										</label>
									</div>
								</article>
							</li>
						))}
					</ol>
					<Pagination
						page={page}
						pageCount={pageCount}
						pageSize={PAGE_SIZE}
						total={total}
						onPageChange={setPage}
					/>
				</>
			) : (
				<EmptyState
					title={order ? "No prerequisites needed" : "No plan to display"}
					description={
						order
							? `${order.target.title} can be watched right away.`
							: "Choose a target movie to build the timeline."
					}
					icon={<RouteIcon />}
				/>
			)}
		</SectionCard>
	);
};
