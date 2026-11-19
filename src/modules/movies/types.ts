export type MovieFormValues = {
	title: string;
	releaseYear: string;
	runtimeMinutes: string;
	prerequisiteIds: string[];
	watched: boolean;
};

export const emptyMovieForm: MovieFormValues = {
	title: "",
	releaseYear: "",
	runtimeMinutes: "",
	prerequisiteIds: [],
	watched: false,
};
