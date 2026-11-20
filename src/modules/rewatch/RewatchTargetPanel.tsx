import { EmptyState } from "../../components/EmptyState";
import { Field } from "../../components/Field";
import { ClockIcon, RouteIcon } from "../../components/Icons";
import { Select } from "../../components/Select";
import { SectionCard } from "../../components/SectionCard";
import { Skeleton } from "../../components/skeletons";
import type { Movie, RewatchOrder } from "../../types";
import {
	chipClass,
	statCardClass,
	statLabelClass,
	statValueClass,
} from "../../ui";
import { formatRuntime } from "../../utils";

type RewatchTargetPanelProps = {
	movies: Movie[];
	selectedId: string;
	order: RewatchOrder | null;
	loading: boolean;
	onSelect: (id: string) => void;
};

export const RewatchTargetPanel = ({
	movies,
	selectedId,
	order,
	loading,
	onSelect,
}: RewatchTargetPanelProps) => {
	const progress =
		order && order.totalCount > 0
			? Math.round((order.watchedCount / order.totalCount) * 100)
			: 0;
	const options = movies.map((movie) => ({
		value: movie.id,
		label: movie.title,
		description: `${movie.releaseYear} · ${movie.runtimeMinutes} min`,
	}));

	return (
		<SectionCard
			eyebrow="Target selection"
			title="Rewatch plan"
			description="Pick a finale and see the exact prerequisite path, including what is still unwatched."
			icon={<RouteIcon />}
		>
			<Field label="Target movie" htmlFor="rewatch-target">
				<Select
					id="rewatch-target"
					options={options}
					value={selectedId}
					onValueChange={onSelect}
					placeholder="Select a movie"
					emptyMessage="Add movies to the library first"
				/>
			</Field>

			{loading && (
				<div
					className="mt-5 grid gap-3"
					role="status"
					aria-label="Loading plan"
				>
					<span className="sr-only">Loading rewatch order...</span>
					<Skeleton className="h-32 w-full rounded-2xl" />
					<Skeleton className="h-20 w-full rounded-2xl" />
				</div>
			)}

			{!loading && order && (
				<div className="mt-5 grid gap-3">
					<div className="relative overflow-hidden rounded-2xl border border-indigo-300/20 bg-linear-to-br from-indigo-500/15 to-violet-500/5 p-5">
						<div
							className="pointer-events-none absolute -top-16 -right-12 size-44 rounded-full bg-indigo-400/10 blur-3xl"
							aria-hidden="true"
						/>
						<div className="relative">
							<p className={statLabelClass}>Completion</p>
							<div className="mt-2 flex items-end justify-between gap-3">
								<p className={statValueClass}>{progress}%</p>
								<span className={chipClass}>
									{order.watchedCount}/{order.totalCount}
								</span>
							</div>
							<div
								className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950"
								role="progressbar"
								aria-label="Rewatch progress"
								aria-valuenow={progress}
								aria-valuemin={0}
								aria-valuemax={100}
							>
								<div
									className="h-full rounded-full bg-linear-to-r from-indigo-300 via-violet-300 to-fuchsia-300 transition-[width] duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className={statCardClass}>
							<p className={statLabelClass}>Watched</p>
							<p className={`${statValueClass} mt-1`}>{order.watchedCount}</p>
						</div>
						<div className={statCardClass}>
							<p className={statLabelClass}>Still to watch</p>
							<p className={`${statValueClass} mt-1`}>
								{formatRuntime(order.unwatchedTotalRuntimeMinutes)}
							</p>
						</div>
					</div>
				</div>
			)}

			{!loading && !order && (
				<div className="mt-5">
					<EmptyState
						title="No plan selected"
						description="Pick a target movie to calculate the rewatch order."
						icon={<ClockIcon />}
					/>
				</div>
			)}
		</SectionCard>
	);
};
