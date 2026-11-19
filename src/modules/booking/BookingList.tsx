import { EmptyState } from "../../components/EmptyState";
import { CheckIcon, TicketIcon, TrashIcon } from "../../components/Icons";
import { Pagination } from "../../components/Pagination";
import { SectionCard } from "../../components/SectionCard";
import { SkeletonList } from "../../components/skeletons";
import { usePagination } from "../../hooks/usePagination";
import type { Booking } from "../../types";
import {
	chipClass,
	dangerButtonClass,
	rowClass,
	secondaryButtonClass,
	successChipClass,
} from "../../ui";
import { formatBundleSummary } from "../../utils";

const PAGE_SIZE = 4;

type BookingListProps = {
	bookings: Booking[];
	loading: boolean;
	busyId: string;
	onCancel: (booking: Booking) => void;
	onDelete: (booking: Booking) => void;
};

export const BookingList = ({
	bookings,
	loading,
	busyId,
	onCancel,
	onDelete,
}: BookingListProps) => {
	const { page, pageCount, startIndex, setPage } = usePagination(
		bookings.length,
		PAGE_SIZE,
	);
	const visibleBookings = bookings.slice(startIndex, startIndex + PAGE_SIZE);

	return (
		<SectionCard
			eyebrow="Reservations"
			title="Bookings"
			description="Confirmed group bookings and their exact bundle breakdown."
			icon={<TicketIcon />}
			action={<span className={chipClass}>{bookings.length}</span>}
		>
			{loading ? (
				<SkeletonList rows={PAGE_SIZE} compact />
			) : (
				<>
					<div className="grid gap-3">
						{visibleBookings.map((booking) => (
							<article key={booking.id} className={rowClass}>
								<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									<div className="grid gap-2">
										<div className="flex flex-wrap items-center gap-2">
											<h3 className="text-sm font-semibold text-white">
												{booking.cinemaName}
											</h3>
											<span
												className={
													booking.status === "CONFIRMED"
														? successChipClass
														: chipClass
												}
											>
												{booking.status === "CONFIRMED" && (
													<CheckIcon className="size-3" />
												)}
												{booking.status.toLowerCase()}
											</span>
										</div>
										<p className="text-sm text-slate-400">
											{booking.groupSize} guests ·{" "}
											{formatBundleSummary(booking.bundles)}
										</p>
									</div>

									<div className="flex flex-wrap gap-2">
										{booking.status === "CONFIRMED" && (
											<button
												type="button"
												className={secondaryButtonClass}
												disabled={busyId === booking.id}
												onClick={() => onCancel(booking)}
											>
												Cancel
											</button>
										)}
										<button
											type="button"
											className={dangerButtonClass}
											disabled={busyId === booking.id}
											onClick={() => onDelete(booking)}
										>
											<TrashIcon className="size-4" />
											Delete
										</button>
									</div>
								</div>
							</article>
						))}
						{bookings.length === 0 && (
							<EmptyState
								title="No bookings yet"
								description="Calculate a bundle plan to confirm your first booking."
								icon={<TicketIcon />}
							/>
						)}
					</div>
					{bookings.length > 0 && (
						<Pagination
							page={page}
							pageCount={pageCount}
							pageSize={PAGE_SIZE}
							total={bookings.length}
							onPageChange={setPage}
						/>
					)}
				</>
			)}
		</SectionCard>
	);
};
