import { useCallback, useEffect, useState } from "react";
import { bookingsApi, cinemasApi, getErrorMessage, moviesApi } from "../api";
import type { Booking, BookingQuote, Cinema } from "../types";
import {
	cardClass,
	dangerButtonClass,
	errorMessageClass,
	inputClass,
	labelClass,
	mutedClass,
	primaryButtonClass,
	secondaryButtonClass,
	successMessageClass,
} from "../ui";
import { formatBundleSummary, formatRuntime } from "../utils";

type RewatchSummary = {
	targetTitle: string;
	watchedCount: number;
	totalCount: number;
	remainingMinutes: number;
};

const BookingView = () => {
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [selectedCinemaId, setSelectedCinemaId] = useState("");
	const [groupSize, setGroupSize] = useState("6");
	const [quote, setQuote] = useState<BookingQuote | null>(null);
	const [rewatchSummary, setRewatchSummary] = useState<RewatchSummary | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [checking, setChecking] = useState(false);
	const [creating, setCreating] = useState(false);
	const [busyId, setBusyId] = useState("");
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");

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
			setSelectedCinemaId(cinemaList[0]?.id ?? "");
			await Promise.all([loadBookings(), loadRewatchSummary()]);
		} catch (loadError) {
			setError(getErrorMessage(loadError));
		} finally {
			setLoading(false);
		}
	}, [loadBookings, loadRewatchSummary]);

	useEffect(() => {
		void load();
	}, [load]);

	const handleCheckQuote = async () => {
		setChecking(true);
		setError("");
		setNotice("");
		setQuote(null);

		try {
			setQuote(
				await cinemasApi.getBookingQuote(selectedCinemaId, Number(groupSize)),
			);
		} catch (checkError) {
			setError(getErrorMessage(checkError));
		} finally {
			setChecking(false);
		}
	};

	const handleCreateBooking = async () => {
		if (!quote?.possible) return;

		setCreating(true);
		setError("");
		setNotice("");

		try {
			await cinemasApi.createBooking(quote.cinemaId, {
				groupSize: quote.groupSize,
			});
			setNotice("Booking confirmed.");
			await loadBookings();
		} catch (createError) {
			setError(getErrorMessage(createError));
		} finally {
			setCreating(false);
		}
	};

	const handleCancelBooking = async (booking: Booking) => {
		setBusyId(booking.id);
		setError("");
		setNotice("");

		try {
			await bookingsApi.cancel(booking.id);
			setNotice("Booking cancelled.");
			await loadBookings();
		} catch (cancelError) {
			setError(getErrorMessage(cancelError));
		} finally {
			setBusyId("");
		}
	};

	const handleDeleteBooking = async (booking: Booking) => {
		if (!window.confirm(`Delete the booking for ${booking.groupSize}?`)) {
			return;
		}

		setBusyId(booking.id);
		setError("");
		setNotice("");

		try {
			await bookingsApi.remove(booking.id);
			setNotice("Booking deleted.");
			await loadBookings();
		} catch (deleteError) {
			setError(getErrorMessage(deleteError));
		} finally {
			setBusyId("");
		}
	};

	const handleDeleteCinema = async (cinema: Cinema) => {
		if (!window.confirm(`Delete "${cinema.name}" and its bookings?`)) {
			return;
		}

		setBusyId(cinema.id);
		setError("");
		setNotice("");

		try {
			await cinemasApi.remove(cinema.id);
			setQuote(null);
			setNotice("Cinema deleted.");
			await load();
		} catch (deleteError) {
			setError(getErrorMessage(deleteError));
		} finally {
			setBusyId("");
		}
	};

	const selectedCinema = cinemas.find(
		(cinema) => cinema.id === selectedCinemaId,
	);
	const parsedGroupSize = Number(groupSize);
	const validGroupSize =
		Number.isInteger(parsedGroupSize) &&
		parsedGroupSize >= 1 &&
		parsedGroupSize <= 10000;

	if (loading) {
		return <p className={mutedClass}>Loading booking data...</p>;
	}

	return (
		<>
			{error && <p className={errorMessageClass}>{error}</p>}
			{notice && <p className={successMessageClass}>{notice}</p>}

			<div className="grid gap-5 xl:grid-cols-2">
				<div className="grid gap-5">
					<section className={cardClass}>
						<h2 className="text-lg font-semibold">Rewatch remaining</h2>
						{rewatchSummary ? (
							<div className="mt-4 grid gap-2">
								<p className="text-sm text-slate-300">
									{rewatchSummary.targetTitle}
								</p>
								<p className="text-2xl font-semibold text-indigo-200">
									{formatRuntime(rewatchSummary.remainingMinutes)}
								</p>
								<p className={mutedClass}>
									{rewatchSummary.watchedCount} of {rewatchSummary.totalCount}{" "}
									prerequisites watched
								</p>
							</div>
						) : (
							<p className={mutedClass}>No movies available.</p>
						)}
					</section>

					<section className={cardClass}>
						<h2 className="text-lg font-semibold">Group booking</h2>
						<div className="mt-4 grid gap-3.5">
							<label className={labelClass}>
								Cinema
								<select
									className={inputClass}
									value={selectedCinemaId}
									disabled={cinemas.length === 0}
									onChange={(event) => {
										setSelectedCinemaId(event.target.value);
										setQuote(null);
									}}
								>
									{cinemas.map((cinema) => (
										<option key={cinema.id} value={cinema.id}>
											{cinema.name}
										</option>
									))}
								</select>
							</label>
							{selectedCinema && (
								<p className="text-xs text-slate-400">
									Bundle sizes: {selectedCinema.bundleSizes.join(", ")}
								</p>
							)}
							<label className={labelClass}>
								Group size
								<input
									required
									type="number"
									min={1}
									max={10000}
									className={inputClass}
									value={groupSize}
									onChange={(event) => {
										setGroupSize(event.target.value);
										setQuote(null);
									}}
								/>
							</label>
							{groupSize && !validGroupSize && (
								<p className="text-xs text-red-200">
									Enter a whole number from 1 to 10,000.
								</p>
							)}
							<button
								type="button"
								className={primaryButtonClass}
								disabled={!selectedCinemaId || !validGroupSize || checking}
								onClick={() => void handleCheckQuote()}
							>
								{checking ? "Checking..." : "Check bundles"}
							</button>

							{quote && (
								<div
									className={`grid gap-3 rounded-xl border p-4 ${
										quote.possible
											? "border-emerald-400/30 bg-emerald-400/5"
											: "border-red-400/30 bg-red-400/5"
									}`}
								>
									<h3 className="text-base font-semibold">
										{quote.possible ? "Bundles to buy" : "Not possible"}
									</h3>
									{quote.possible ? (
										<>
											<div className="flex flex-wrap gap-2">
												{quote.bundles.map((bundle) => (
													<span
														key={bundle.size}
														className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-200"
													>
														{bundle.quantity} × {bundle.size}-seat
													</span>
												))}
											</div>
											<p className="text-sm text-slate-300">
												{quote.totalBundles} bundle(s) for {quote.groupSize}{" "}
												people.
											</p>
											<button
												type="button"
												className={primaryButtonClass}
												disabled={creating}
												onClick={() => void handleCreateBooking()}
											>
												{creating ? "Confirming..." : "Confirm booking"}
											</button>
										</>
									) : (
										<p className="text-sm text-red-200">
											{quote.message ??
												"No exact bundle combination is possible for this group size."}
										</p>
									)}
								</div>
							)}
						</div>
					</section>
				</div>

				<div className="grid gap-5">
					<section className={cardClass}>
						<h2 className="text-lg font-semibold">Cinemas</h2>
						<div className="mt-4 grid gap-3">
							{cinemas.map((cinema) => (
								<article
									key={cinema.id}
									className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-950/60 p-4"
								>
									<div className="grid gap-0.5">
										<strong className="text-sm font-semibold">
											{cinema.name}
										</strong>
										<span className="text-xs text-slate-400">
											{cinema.bundleSizes.join(", ")} seats
										</span>
									</div>
									<button
										type="button"
										className={dangerButtonClass}
										disabled={busyId === cinema.id}
										onClick={() => void handleDeleteCinema(cinema)}
									>
										Delete
									</button>
								</article>
							))}
							{cinemas.length === 0 && (
								<p className="text-sm text-slate-400">No cinemas available.</p>
							)}
						</div>
					</section>

					<section className={cardClass}>
						<h2 className="text-lg font-semibold">Bookings</h2>
						<div className="mt-4 grid gap-3">
							{bookings.map((booking) => (
								<article
									key={booking.id}
									className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-950/60 p-4"
								>
									<div className="grid flex-1 gap-1">
										<strong className="text-sm font-semibold">
											{booking.cinemaName} · {booking.groupSize} people
										</strong>
										<span className="text-xs text-slate-400">
											{formatBundleSummary(booking.bundles)}
										</span>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<span
											className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
												booking.status === "CONFIRMED"
													? "bg-emerald-400/15 text-emerald-200"
													: "bg-slate-700 text-slate-300"
											}`}
										>
											{booking.status.toLowerCase()}
										</span>
										{booking.status === "CONFIRMED" && (
											<button
												type="button"
												className={secondaryButtonClass}
												disabled={busyId === booking.id}
												onClick={() => void handleCancelBooking(booking)}
											>
												Cancel
											</button>
										)}
										<button
											type="button"
											className={dangerButtonClass}
											disabled={busyId === booking.id}
											onClick={() => void handleDeleteBooking(booking)}
										>
											Delete
										</button>
									</div>
								</article>
							))}
							{bookings.length === 0 && (
								<p className="text-sm text-slate-400">No bookings yet.</p>
							)}
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default BookingView;
