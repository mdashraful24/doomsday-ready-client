import { BookingForm } from "../modules/booking/BookingForm";
import { BookingList } from "../modules/booking/BookingList";
import { CinemaList } from "../modules/booking/CinemaList";
import { RewatchRecap } from "../modules/booking/RewatchRecap";
import { useBooking } from "../modules/booking/useBooking";

const BookingView = () => {
	const {
		cinemas,
		bookings,
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
		cancelBooking,
		deleteBooking,
		deleteCinema,
		updateCinema,
		updateGroupSize,
	} = useBooking();

	return (
		<div className="grid gap-6 xl:grid-cols-2">
			<div className="grid gap-6">
				<RewatchRecap summary={rewatchSummary} loading={loading} />
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

			<div className="grid gap-6">
				<CinemaList
					cinemas={cinemas}
					loading={loading}
					busyId={busyId}
					onDelete={(cinema) => void deleteCinema(cinema)}
				/>
				<BookingList
					bookings={bookings}
					loading={loading}
					busyId={busyId}
					onCancel={(booking) => void cancelBooking(booking)}
					onDelete={(booking) => void deleteBooking(booking)}
				/>
			</div>
		</div>
	);
};

export default BookingView;
