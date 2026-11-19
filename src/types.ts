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
