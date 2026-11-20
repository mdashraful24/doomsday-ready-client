import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
import { toast } from "sonner";
import { getErrorMessage, moviesApi } from "../api";
import { bookingsApi, cinemasApi } from "../api";
import type { Booking, Cinema, Movie, RewatchOrder } from "../types";

type LoadOptions = { silent?: boolean };

type OrderUpdater =
	| RewatchOrder
	| null
	| ((current: RewatchOrder | null) => RewatchOrder | null);

type AppDataContextValue = {
	movies: Movie[];
	cinemas: Cinema[];
	bookings: Booking[];
	orders: Record<string, RewatchOrder>;
	loadingMovies: boolean;
	loadingCinemas: boolean;
	loadingBookings: boolean;
	loadingOrders: Record<string, boolean>;
	loadedMovies: boolean;
	loadedCinemas: boolean;
	loadedBookings: boolean;
	loadedOrders: Record<string, boolean>;
	loadMovies: (options?: LoadOptions) => Promise<void>;
	loadCinemas: (options?: LoadOptions) => Promise<void>;
	loadBookings: (options?: LoadOptions) => Promise<void>;
	loadOrder: (id: string, options?: LoadOptions) => Promise<void>;
	setMovies: Dispatch<SetStateAction<Movie[]>>;
	setCinemas: Dispatch<SetStateAction<Cinema[]>>;
	setBookings: Dispatch<SetStateAction<Booking[]>>;
	setOrder: (id: string, order: OrderUpdater) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export const getTargetMovieId = (movies: Movie[]) =>
	(movies.find((movie) => movie.title === "Avengers: Doomsday") ?? movies[0])
		?.id ?? "";

export const useAppData = () => {
	const value = useContext(AppDataContext);
	if (!value) throw new Error("useAppData must be used inside AppDataProvider");
	return value;
};

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [orders, setOrders] = useState<Record<string, RewatchOrder>>({});

	const [loadingMovies, setLoadingMovies] = useState(true);
	const [loadingCinemas, setLoadingCinemas] = useState(true);
	const [loadingBookings, setLoadingBookings] = useState(true);
	const [loadingOrders, setLoadingOrders] = useState<Record<string, boolean>>(
		{},
	);

	const [loadedMovies, setLoadedMovies] = useState(false);
	const [loadedCinemas, setLoadedCinemas] = useState(false);
	const [loadedBookings, setLoadedBookings] = useState(false);
	const [loadedOrders, setLoadedOrders] = useState<Record<string, boolean>>({});

	const movieRequest = useRef<Promise<void> | null>(null);
	const cinemaRequest = useRef<Promise<void> | null>(null);
	const bookingRequest = useRef<Promise<void> | null>(null);
	const orderRequests = useRef<Record<string, Promise<void> | undefined>>({});
	const loadedMoviesRef = useRef(loadedMovies);
	const loadedCinemasRef = useRef(loadedCinemas);
	const loadedBookingsRef = useRef(loadedBookings);
	const loadedOrdersRef = useRef(loadedOrders);

	const loadMovies = useCallback(
		async ({ silent = false }: LoadOptions = {}) => {
			if (movieRequest.current) return movieRequest.current;
			if (!silent && !loadedMoviesRef.current) setLoadingMovies(true);

			const request = moviesApi
				.list()
				.then((data) => {
					setMovies(data);
					loadedMoviesRef.current = true;
					setLoadedMovies(true);
				})
				.catch((error) => {
					toast.error("Could not load movies", {
						description: getErrorMessage(error),
					});
				})
				.finally(() => {
					setLoadingMovies(false);
					movieRequest.current = null;
				});

			movieRequest.current = request;
			return request;
		},
		[],
	);

	const loadCinemas = useCallback(
		async ({ silent = false }: LoadOptions = {}) => {
			if (cinemaRequest.current) return cinemaRequest.current;
			if (!silent && !loadedCinemasRef.current) setLoadingCinemas(true);

			const request = cinemasApi
				.list()
				.then((data) => {
					setCinemas(data);
					loadedCinemasRef.current = true;
					setLoadedCinemas(true);
				})
				.catch((error) => {
					toast.error("Could not load cinemas", {
						description: getErrorMessage(error),
					});
				})
				.finally(() => {
					setLoadingCinemas(false);
					cinemaRequest.current = null;
				});

			cinemaRequest.current = request;
			return request;
		},
		[],
	);

	const loadBookings = useCallback(
		async ({ silent = false }: LoadOptions = {}) => {
			if (bookingRequest.current) return bookingRequest.current;
			if (!silent && !loadedBookingsRef.current) setLoadingBookings(true);

			const request = bookingsApi
				.list()
				.then((data) => {
					setBookings(data);
					loadedBookingsRef.current = true;
					setLoadedBookings(true);
				})
				.catch((error) => {
					toast.error("Could not load bookings", {
						description: getErrorMessage(error),
					});
				})
				.finally(() => {
					setLoadingBookings(false);
					bookingRequest.current = null;
				});

			bookingRequest.current = request;
			return request;
		},
		[],
	);

	const loadOrder = useCallback(
		async (id: string, { silent = false }: LoadOptions = {}) => {
			if (!id) return;
			if (orderRequests.current[id]) return orderRequests.current[id];
			if (!silent && !loadedOrdersRef.current[id]) {
				setLoadingOrders((current) => ({ ...current, [id]: true }));
			}

			const request = moviesApi
				.getRewatchOrder(id)
				.then((data) => {
					setOrders((current) => ({ ...current, [id]: data }));
					loadedOrdersRef.current = {
						...loadedOrdersRef.current,
						[id]: true,
					};
					setLoadedOrders((current) => ({ ...current, [id]: true }));
				})
				.catch((error) => {
					loadedOrdersRef.current = {
						...loadedOrdersRef.current,
						[id]: true,
					};
					setLoadedOrders((current) => ({ ...current, [id]: true }));
					toast.error("Could not load rewatch order", {
						description: getErrorMessage(error),
					});
				})
				.finally(() => {
					setLoadingOrders((current) => ({ ...current, [id]: false }));
					delete orderRequests.current[id];
				});

			orderRequests.current[id] = request;
			return request;
		},
		[],
	);

	const setOrder = useCallback((id: string, order: OrderUpdater) => {
		setOrders((current) => {
			const next =
				typeof order === "function" ? order(current[id] ?? null) : order;
			if (!next) return current;
			return { ...current, [id]: next };
		});
		loadedOrdersRef.current = { ...loadedOrdersRef.current, [id]: true };
		setLoadedOrders((current) => ({ ...current, [id]: true }));
	}, []);

	const value = useMemo<AppDataContextValue>(
		() => ({
			movies,
			cinemas,
			bookings,
			orders,
			loadingMovies,
			loadingCinemas,
			loadingBookings,
			loadingOrders,
			loadedMovies,
			loadedCinemas,
			loadedBookings,
			loadedOrders,
			loadMovies,
			loadCinemas,
			loadBookings,
			loadOrder,
			setMovies,
			setCinemas,
			setBookings,
			setOrder,
		}),
		[
			movies,
			cinemas,
			bookings,
			orders,
			loadingMovies,
			loadingCinemas,
			loadingBookings,
			loadingOrders,
			loadedMovies,
			loadedCinemas,
			loadedBookings,
			loadedOrders,
			loadMovies,
			loadCinemas,
			loadBookings,
			loadOrder,
			setOrder,
		],
	);

	return (
		<AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
	);
};
