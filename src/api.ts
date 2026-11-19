import type {
	ApiResponse,
	CreateMoviePayload,
	Movie,
	UpdateMoviePayload,
} from "./types";

const baseUrl = (
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api"
).replace(/\/+$/, "");

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
	const response = await fetch(`${baseUrl}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});

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
};
