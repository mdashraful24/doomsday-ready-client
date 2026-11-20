import { usePageTitle } from "../hooks/usePageTitle";
import BookingView from "../views/BookingView";

const BookingPage = () => {
	usePageTitle("Booking");

	return <BookingView />;
};

export default BookingPage;
