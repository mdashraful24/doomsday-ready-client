import { useMemo } from "react";
import { Skeleton } from "./Skeleton";

export const SkeletonStats = ({ cards = 3 }: { cards?: number }) => {
	const keys = useMemo(
		() => Array.from({ length: cards }, () => crypto.randomUUID()),
		[cards],
	);

	return (
		<div
			className={`grid gap-3 ${cards <= 2 ? "" : ""}`}
			role="status"
			aria-label="Loading summary"
		>
			<span className="sr-only">Loading summary...</span>
			{keys.map((key) => (
				<div
					key={key}
					className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
				>
					<Skeleton className="h-3 w-2/3" />
					<Skeleton className="mt-3 h-7 w-1/2" />
				</div>
			))}
		</div>
	);
};
