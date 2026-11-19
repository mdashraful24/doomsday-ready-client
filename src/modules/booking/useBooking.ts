import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { bookingsApi, cinemasApi, getErrorMessage, moviesApi } from "../../api";
import { useConfirm } from "../../hooks/useConfirm";
import type { Booking, BookingQuote, Cinema } from "../../types";
import type { RewatchSummary } from "./types";

export const useBooking = () => {
	const confirm = useConfirm();
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [selectedCinemaId, setSelectedCinemaId] = useState("");
	const [groupSize, setGroupSize] = useState("");
	const [quote, setQuote] = useState<BookingQuote | null>(null);
	const [rewatchSummary, setRewatchSummary] = useState<RewatchSummary | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [checking, setChecking] = useState(false);
	const [creating, setCreating] = useState(false);
	const [busyId, setBusyId] = useState("");

	const loadBookings = useCallback(async () => {
		setBookings(await bookingsApi.list());
	}, []);

	const loadRewatchSummary = useCallback(async () => {
		const movies = await moviesApi.list();
		const target =
			movies.find((movie) => movie.title === "Avengers: Doomsday") ?? movies[0];

		if (!target) {
			setRewatchSummary(null);
			return;
		}

		const order = await moviesApi.getRewatchOrder(target.id);

		setRewatchSummary({
			targetTitle: order.target.title,
			watchedCount: order.watchedCount,
			totalCount: order.totalCount,
			remainingMinutes: order.unwatchedTotalRuntimeMinutes,
		});
	}, []);

	const load = useCallback(async () => {
		setLoading(true);

		try {
			const cinemaList = await cinemasApi.list();

			setCinemas(cinemaList);
			setSelectedCinemaId("");
			await Promise.all([loadBookings(), loadRewatchSummary()]);
		} catch (error) {
			toast.error("Could not load booking data", {
				description: getErrorMessage(error),
			});
		} finally {
			setLoading(false);
		}
	}, [loadBookings, loadRewatchSummary]);

	useEffect(() => {
		void load();
	}, [load]);

	const checkQuote = async () => {
		setChecking(true);
		setQuote(null);

		try {
			const result = await cinemasApi.getBookingQuote(
				selectedCinemaId,
				Number(groupSize),
			);

			setQuote(result);
			requestAnimationFrame(() => {
				document
					.getElementById("booking-form-card")
					?.scrollIntoView({ behavior: "smooth", block: "start" });
			});
		} catch (error) {
			toast.error("Could not calculate bundles", {
				description: getErrorMessage(error),
			});
		} finally {
			setChecking(false);
		}
	};

	const createBooking = async () => {
		if (!quote?.possible) return;

		setCreating(true);

		try {
			await cinemasApi.createBooking(quote.cinemaId, {
				groupSize: quote.groupSize,
			});
			toast.success("Booking confirmed");
			setGroupSize("");
			setSelectedCinemaId("");
			setQuote(null);
			await loadBookings();
		} catch (error) {
			toast.error("Could not confirm booking", {
				description: getErrorMessage(error),
			});
		} finally {
			setCreating(false);
		}
	};

	const cancelBooking = async (booking: Booking) => {
		const accepted = await confirm({
			title: "Cancel this booking?",
			description: `The booking for ${booking.groupSize} guests will be marked as cancelled.`,
			confirmLabel: "Cancel booking",
			cancelLabel: "Keep booking",
		});

		if (!accepted) return;

		setBusyId(booking.id);

		try {
			await bookingsApi.cancel(booking.id);
			toast.success("Booking cancelled");
			await loadBookings();
		} catch (error) {
			toast.error("Could not cancel booking", {
				description: getErrorMessage(error),
			});
		} finally {
			setBusyId("");
		}
	};

	const deleteBooking = async (booking: Booking) => {
		const accepted = await confirm({
			title: "Delete this booking?",
			description: `The booking for ${booking.groupSize} guests will be permanently removed.`,
			confirmLabel: "Delete booking",
		});

		if (!accepted) return;

		setBusyId(booking.id);

		try {
			await bookingsApi.remove(booking.id);
			toast.success("Booking deleted");
			await loadBookings();
		} catch (error) {
			toast.error("Could not delete booking", {
				description: getErrorMessage(error),
			});
		} finally {
			setBusyId("");
		}
	};

	const deleteCinema = async (cinema: Cinema) => {
		const accepted = await confirm({
			title: "Delete this cinema?",
			description: `"${cinema.name}" and every booking linked to it will be permanently removed.`,
			confirmLabel: "Delete cinema",
		});

		if (!accepted) return;

		setBusyId(cinema.id);

		try {
			await cinemasApi.remove(cinema.id);
			setQuote(null);
			toast.success("Cinema deleted");
			await load();
		} catch (error) {
			toast.error("Could not delete cinema", {
				description: getErrorMessage(error),
			});
		} finally {
			setBusyId("");
		}
	};

	const updateCinema = (id: string) => {
		setSelectedCinemaId(id);
		setQuote(null);
	};

	const updateGroupSize = (value: string) => {
		setGroupSize(value);
		setQuote(null);
	};

	const parsedGroupSize = Number(groupSize);
	const validGroupSize =
		Number.isInteger(parsedGroupSize) &&
		parsedGroupSize >= 1 &&
		parsedGroupSize <= 10000;
	const selectedCinema = cinemas.find(
		(cinema) => cinema.id === selectedCinemaId,
	);

	return {
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
	};
};
