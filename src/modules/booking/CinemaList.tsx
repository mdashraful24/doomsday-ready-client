import { EmptyState } from "../../components/EmptyState";
import { FilmIcon, TrashIcon } from "../../components/Icons";
import { Pagination } from "../../components/Pagination";
import { SectionCard } from "../../components/SectionCard";
import { SkeletonList } from "../../components/Skeleton";
import { usePagination } from "../../hooks/usePagination";
import type { Cinema } from "../../types";
import { chipClass, dangerButtonClass, rowClass } from "../../ui";

const PAGE_SIZE = 4;

type CinemaListProps = {
	cinemas: Cinema[];
	loading: boolean;
	busyId: string;
	onDelete: (cinema: Cinema) => void;
};

export const CinemaList = ({
	cinemas,
	loading,
	busyId,
	onDelete,
}: CinemaListProps) => {
	const { page, pageCount, startIndex, setPage } = usePagination(
		cinemas.length,
		PAGE_SIZE,
	);
	const visibleCinemas = cinemas.slice(startIndex, startIndex + PAGE_SIZE);

	return (
		<SectionCard
			eyebrow="Venues"
			title="Cinemas"
			description="Available bundle sizes for each venue."
			icon={<FilmIcon />}
			action={<span className={chipClass}>{cinemas.length}</span>}
		>
			{loading ? (
				<SkeletonList rows={PAGE_SIZE} compact />
			) : (
				<>
					<div className="grid gap-3">
						{visibleCinemas.map((cinema) => (
							<article key={cinema.id} className={rowClass}>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<h3 className="text-sm font-semibold text-white">
											{cinema.name}
										</h3>
										<div className="mt-2 flex flex-wrap gap-2">
											{cinema.bundleSizes.map((size) => (
												<span key={size} className={chipClass}>
													{size}-seat
												</span>
											))}
										</div>
									</div>
									<button
										type="button"
										className={dangerButtonClass}
										disabled={busyId === cinema.id}
										onClick={() => onDelete(cinema)}
									>
										<TrashIcon className="size-4" />
										Delete
									</button>
								</div>
							</article>
						))}
						{cinemas.length === 0 && (
							<EmptyState
								title="No cinemas available"
								description="Seed the API to restore the venue list."
								icon={<FilmIcon />}
							/>
						)}
					</div>
					{cinemas.length > 0 && (
						<Pagination
							page={page}
							pageCount={pageCount}
							pageSize={PAGE_SIZE}
							total={cinemas.length}
							onPageChange={setPage}
						/>
					)}
				</>
			)}
		</SectionCard>
	);
};
