import type {
	ApiResponse,
	Booking,
	BookingQuote,
	Cinema,
	CreateBookingPayload,
	CreateMoviePayload,
	Movie,
	RewatchOrder,
	UpdateCinemaPayload,
	UpdateMoviePayload,
} from "./types";

const baseUrl = (
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api"
).replace(/\/+$/, "");

const readResponse = async <T>(response: Response): Promise<T> => {
	const body = (await response
		.json()
		.catch(() => null)) as ApiResponse<T> | null;

	if (!response.ok || !body?.success) {
		throw new Error(
			body?.message ?? `Request failed with status ${response.status}.`,
		);
	}

	if (body.data === undefined) {
		throw new Error("Response did not include data.");
	}

	return body.data;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
	const response = await fetch(`${baseUrl}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});

	return readResponse<T>(response);
};

const requestFormData = async <T>(
	path: string,
	formData: FormData,
	init?: RequestInit,
): Promise<T> => {
	const response = await fetch(`${baseUrl}${path}`, {
		...init,
		body: formData,
	});

	return readResponse<T>(response);
};

export const getErrorMessage = (error: unknown) =>
	error instanceof Error ? error.message : "Something went wrong.";

export const moviesApi = {
	list: () => request<Movie[]>("/movies?limit=100"),
	create: (payload: CreateMoviePayload) =>
		request<Movie>("/movies", {
			method: "POST",
			body: JSON.stringify(payload),
		}),
	update: (id: string, payload: UpdateMoviePayload) =>
		request<Movie>(`/movies/${encodeURIComponent(id)}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		}),
	remove: (id: string) =>
		request<{ id: string }>(`/movies/${encodeURIComponent(id)}`, {
			method: "DELETE",
		}),
	getRewatchOrder: (id: string) =>
		request<RewatchOrder>(`/movies/${encodeURIComponent(id)}/rewatch-order`),
};

export const cinemasApi = {
	list: () => request<Cinema[]>("/cinemas"),
	update: (id: string, payload: UpdateCinemaPayload) => {
		const formData = new FormData();

		if (payload.name !== undefined) {
			formData.append("name", payload.name);
		}

		if (payload.bundleSizes !== undefined) {
			formData.append("bundleSizes", payload.bundleSizes.join(","));
		}

		if (payload.image) {
			formData.append("image", payload.image);
		}

		return requestFormData<Cinema>(
			`/cinemas/${encodeURIComponent(id)}`,
			formData,
			{
				method: "PATCH",
			},
		);
	},
	remove: (id: string) =>
		request<{ id: string }>(`/cinemas/${encodeURIComponent(id)}`, {
			method: "DELETE",
		}),
	getBookingQuote: (id: string, groupSize: number) =>
		request<BookingQuote>(
			`/cinemas/${encodeURIComponent(id)}/booking?groupSize=${groupSize}`,
		),
	createBooking: (id: string, payload: CreateBookingPayload) =>
		request<Booking>(`/cinemas/${encodeURIComponent(id)}/booking`, {
			method: "POST",
			body: JSON.stringify(payload),
		}),
};

export const bookingsApi = {
	list: () => request<Booking[]>("/bookings"),
	cancel: (id: string) =>
		request<Booking>(`/bookings/${encodeURIComponent(id)}/cancel`, {
			method: "PATCH",
		}),
	remove: (id: string) =>
		request<{ id: string }>(`/bookings/${encodeURIComponent(id)}`, {
			method: "DELETE",
		}),
};
