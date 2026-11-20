import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../components/Icons";
import { usePageTitle } from "../hooks/usePageTitle";
import { BookingList } from "../modules/booking/BookingList";
import { useBooking } from "../modules/booking/useBooking";
import { secondaryButtonClass } from "../ui";

const BookingsPage = () => {
	usePageTitle("Booking List");

	const { bookings, loading, busyId, cancelBooking, deleteBooking } =
		useBooking();

	return (
		<div className="grid gap-6">
			<div className="flex justify-end">
				<Link to="/booking" className={secondaryButtonClass}>
					<ArrowRightIcon className="size-4 rotate-180" />
					Back to booking
				</Link>
			</div>
			<BookingList
				bookings={bookings}
				loading={loading}
				busyId={busyId}
				onCancel={(booking) => void cancelBooking(booking)}
				onDelete={(booking) => void deleteBooking(booking)}
			/>
		</div>
	);
};

export default BookingsPage;
