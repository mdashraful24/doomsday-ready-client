import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../components/Icons";
import { secondaryButtonClass } from "../ui";
import { BookingForm } from "../modules/booking/BookingForm";
import { CinemaList } from "../modules/booking/CinemaList";
import { RewatchRecap } from "../modules/booking/RewatchRecap";
import { useBooking } from "../modules/booking/useBooking";

const BookingView = () => {
	const {
		cinemas,
		selectedCinemaId,
		selectedCinema,
		groupSize,
		quote,
		rewatchSummary,
		loading,
		checking,
		creating,
		busyId,
		validGroupSize,
		checkQuote,
		createBooking,
		deleteCinema,
		updateCinema,
		updateGroupSize,
	} = useBooking();

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<div className="grid items-start gap-6">
				<div className={loading ? "" : "lg:sticky lg:top-24 lg:z-20"}>
					<RewatchRecap summary={rewatchSummary} loading={loading} />
				</div>
				<div
					id="booking-form-card"
					className={`scroll-mt-28 ${
						loading
							? ""
							: "lg:sticky lg:top-24 lg:z-30 lg:rounded-[1.75rem] lg:bg-slate-950/95 lg:backdrop-blur-xl"
					}`}
				>
					<BookingForm
						cinemas={cinemas}
						selectedCinema={selectedCinema}
						selectedCinemaId={selectedCinemaId}
						groupSize={groupSize}
						quote={quote}
						loading={loading}
						checking={checking}
						creating={creating}
						validGroupSize={validGroupSize}
						onCinemaChange={updateCinema}
						onGroupSizeChange={updateGroupSize}
						onCheckQuote={() => void checkQuote()}
						onConfirmBooking={() => void createBooking()}
					/>
				</div>
			</div>

			<div className="grid items-start gap-6">
				{/* Large screen only */}
				<div className="hidden lg:block">
					<Link
						to="/booking/list"
						className={`${secondaryButtonClass} justify-center w-full`}
					>
						View booking list
						<ArrowRightIcon className="size-4" />
					</Link>
				</div>
				<CinemaList
					cinemas={cinemas}
					loading={loading}
					busyId={busyId}
					onDelete={(cinema) => void deleteCinema(cinema)}
				/>
			</div>
		</div>
	);
};

export default BookingView;
