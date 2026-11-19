export type ApiResponse<T> = {
	success: boolean;
	statusCode: number;
	message: string;
	data?: T;
};

export type Movie = {
	id: string;
	title: string;
	releaseYear: number;
	runtimeMinutes: number;
	watched: boolean;
	prerequisiteIds: string[];
};

export type CreateMoviePayload = {
	title: string;
	releaseYear: number;
	runtimeMinutes: number;
	watched: boolean;
	prerequisiteIds: string[];
};

export type UpdateMoviePayload = Partial<CreateMoviePayload>;

export type RewatchOrderMovie = Pick<
	Movie,
	"id" | "title" | "releaseYear" | "runtimeMinutes" | "watched"
>;

export type RewatchOrder = {
	target: Pick<Movie, "id" | "title">;
	movies: RewatchOrderMovie[];
	totalCount: number;
	watchedCount: number;
	unwatchedTotalRuntimeMinutes: number;
};

export type Cinema = {
	id: string;
	name: string;
	imageUrl: string | null;
	createdAt: string;
	updatedAt: string;
	bundleSizes: number[];
};

export type BundleSelection = {
	size: number;
	quantity: number;
};

export type BookingQuote = {
	cinemaId: string;
	cinemaName: string;
	possible: boolean;
	groupSize: number;
	totalBundles: number;
	bundles: BundleSelection[];
	message?: string;
};

export type CreateBookingPayload = {
	groupSize: number;
};

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export type Booking = {
	id: string;
	cinemaId: string;
	cinemaName: string;
	groupSize: number;
	totalBundles: number;
	bundles: BundleSelection[];
	status: BookingStatus;
	createdAt: string;
	updatedAt: string;
};
