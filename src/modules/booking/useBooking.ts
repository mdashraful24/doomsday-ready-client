import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { bookingsApi, cinemasApi, getErrorMessage } from "../../api";
import { useConfirm } from "../../hooks/useConfirm";
import { getTargetMovieId, useAppData } from "../../providers/AppDataProvider";
import type {
	Booking,
	BookingQuote,
	Cinema,
	UpdateCinemaPayload,
} from "../../types";
import type { RewatchSummary } from "./types";

export const useBooking = () => {
	const confirm = useConfirm();
	const {
		movies,
		cinemas,
		bookings,
		orders,
		loadingMovies,
		loadingCinemas,
		loadingBookings,
		loadedMovies,
		loadedCinemas,
		loadedBookings,
		loadingOrders,
		loadedOrders,
		loadMovies,
		loadCinemas,
		loadBookings,
		loadOrder,
		setCinemas,
		setBookings,
	} = useAppData();
	const [selectedCinemaId, setSelectedCinemaId] = useState("");
	const [groupSize, setGroupSize] = useState("");
	const [quote, setQuote] = useState<BookingQuote | null>(null);
	const [checking, setChecking] = useState(false);
	const [creating, setCreating] = useState(false);
	const [busyId, setBusyId] = useState("");
	const initialMoviesLoad = useRef(loadedMovies);
	const initialCinemasLoad = useRef(loadedCinemas);
	const initialBookingsLoad = useRef(loadedBookings);
	const requestedOrderIds = useRef(new Set<string>());

	useEffect(() => {
		void loadMovies({ silent: initialMoviesLoad.current });
		void loadCinemas({ silent: initialCinemasLoad.current });
		void loadBookings({ silent: initialBookingsLoad.current });
	}, [loadMovies, loadCinemas, loadBookings]);

	useEffect(() => {
		if (
			selectedCinemaId &&
			!cinemas.some((cinema) => cinema.id === selectedCinemaId)
		) {
			setSelectedCinemaId("");
		}
	}, [cinemas, selectedCinemaId]);

	const targetId = getTargetMovieId(movies);

	useEffect(() => {
		if (!targetId) return;

		const silent = requestedOrderIds.current.has(targetId);
		requestedOrderIds.current.add(targetId);
		void loadOrder(targetId, { silent });
	}, [targetId, loadOrder]);

	const targetOrder = targetId ? (orders[targetId] ?? null) : null;
	const rewatchSummary: RewatchSummary | null = targetOrder
		? {
				targetTitle: targetOrder.target.title,
				watchedCount: targetOrder.watchedCount,
				totalCount: targetOrder.totalCount,
				remainingMinutes: targetOrder.unwatchedTotalRuntimeMinutes,
			}
		: null;
	const targetOrderLoading = Boolean(loadingOrders[targetId]);
	const loading =
		loadingMovies ||
		loadingCinemas ||
		loadingBookings ||
		(Boolean(targetId) && (targetOrderLoading || !loadedOrders[targetId]));

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
			const created = await cinemasApi.createBooking(quote.cinemaId, {
				groupSize: quote.groupSize,
			});
			setBookings((current) => [created, ...current]);
			toast.success("Booking confirmed");
			setGroupSize("");
			setSelectedCinemaId("");
			setQuote(null);
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
			const updated = await bookingsApi.cancel(booking.id);
			setBookings((current) =>
				current.map((item) => (item.id === updated.id ? updated : item)),
			);
			toast.success("Booking cancelled");
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
			setBookings((current) =>
				current.filter((item) => item.id !== booking.id),
			);
			toast.success("Booking deleted");
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
			setCinemas((current) => current.filter((item) => item.id !== cinema.id));
			setBookings((current) =>
				current.filter((item) => item.cinemaId !== cinema.id),
			);
			setQuote(null);
			toast.success("Cinema deleted");
		} catch (error) {
			toast.error("Could not delete cinema", {
				description: getErrorMessage(error),
			});
		} finally {
			setBusyId("");
		}
	};

	const editCinema = async (id: string, payload: UpdateCinemaPayload) => {
		setBusyId(id);

		try {
			const updated = await cinemasApi.update(id, payload);

			setCinemas((current) =>
				current.map((cinema) => (cinema.id === id ? updated : cinema)),
			);
			setQuote(null);
			toast.success("Cinema updated");
			void loadBookings({ silent: true });

			return true;
		} catch (error) {
			toast.error("Could not update cinema", {
				description: getErrorMessage(error),
			});
			return false;
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
		editCinema,
		updateCinema,
		updateGroupSize,
	};
};
