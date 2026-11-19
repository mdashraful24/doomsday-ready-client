import { useMemo } from "react";
import { rowClass } from "../../ui";
import { Skeleton } from "./Skeleton";

type SkeletonListProps = {
	rows?: number;
	compact?: boolean;
};

export const SkeletonList = ({
	rows = 3,
	compact = false,
}: SkeletonListProps) => {
	const keys = useMemo(
		() => Array.from({ length: rows }, () => crypto.randomUUID()),
		[rows],
	);

	return (
		<div className="grid gap-3" role="status" aria-label="Loading data">
			<span className="sr-only">Loading data...</span>
			{keys.map((key) => (
				<div
					key={key}
					className={
						compact
							? "rounded-2xl border border-white/10 bg-slate-950/50 p-3"
							: rowClass
					}
				>
					<div className="flex items-start justify-between gap-4">
						<div className="grid flex-1 gap-2">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-3 w-1/2" />
						</div>
						<Skeleton className="h-8 w-20 shrink-0" />
					</div>
					<Skeleton className="mt-4 h-14 w-full" />
				</div>
			))}
		</div>
	);
};
