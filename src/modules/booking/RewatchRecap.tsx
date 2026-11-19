import { EmptyState } from "../../components/EmptyState";
import { ClockIcon } from "../../components/Icons";
import { SectionCard } from "../../components/SectionCard";
import { Skeleton, SkeletonStats } from "../../components/Skeleton";
import type { RewatchSummary } from "./types";
import { statLabelClass } from "../../ui";
import { formatRuntime } from "../../utils";

type RewatchRecapProps = {
	summary: RewatchSummary | null;
	loading: boolean;
};

export const RewatchRecap = ({ summary, loading }: RewatchRecapProps) => (
	<SectionCard
		eyebrow="Pre-show recap"
		title="Rewatch remaining"
		description="A quick snapshot of the unwatched runtime before the premiere."
		icon={<ClockIcon />}
	>
		{loading ? (
			<div className="grid gap-3" role="status" aria-label="Loading recap">
				<span className="sr-only">Loading rewatch recap...</span>
				<Skeleton className="h-32 w-full rounded-2xl" />
				<SkeletonStats cards={2} />
			</div>
		) : summary ? (
			<div className="grid gap-3">
				<div className="relative overflow-hidden rounded-2xl border border-indigo-300/20 bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/5 p-5">
					<div
						className="pointer-events-none absolute -top-16 -right-12 size-44 rounded-full bg-indigo-400/10 blur-3xl"
						aria-hidden="true"
					/>
					<div className="relative">
						<p className={statLabelClass}>{summary.targetTitle}</p>
						<p className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
							{formatRuntime(summary.remainingMinutes)}
						</p>
						<p className="mt-1 text-xs text-slate-400">
							left before the premiere
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-lg shadow-black/10">
						<p className={statLabelClass}>Watched</p>
						<p className="mt-1 text-2xl font-semibold tracking-tight text-white">
							{summary.watchedCount}
						</p>
					</div>
					<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-lg shadow-black/10">
						<p className={statLabelClass}>Total path</p>
						<p className="mt-1 text-2xl font-semibold tracking-tight text-white">
							{summary.totalCount}
						</p>
					</div>
				</div>
			</div>
		) : (
			<EmptyState
				title="No rewatch data"
				description="Add a movie in the library to generate the recap."
				icon={<ClockIcon />}
			/>
		)}
	</SectionCard>
);
