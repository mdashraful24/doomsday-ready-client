import type { MovieFormValues } from "./types";

export type MovieFormErrors = {
	title?: string;
	releaseYear?: string;
	runtimeMinutes?: string;
};

export const validateMovieForm = (form: MovieFormValues): MovieFormErrors => {
	const errors: MovieFormErrors = {};
	const title = form.title.trim();
	const releaseYear = form.releaseYear.trim();
	const runtimeMinutes = form.runtimeMinutes.trim();

	if (title.length === 0) {
		errors.title = "Title is required.";
	} else if (title.length > 200) {
		errors.title = "Title must be at most 200 characters.";
	}

	const year = Number(releaseYear);

	if (releaseYear.length === 0) {
		errors.releaseYear = "Release year is required.";
	} else if (!Number.isInteger(year) || year < 1888 || year > 2100) {
		errors.releaseYear = "Enter a year between 1888 and 2100.";
	}

	const runtime = Number(runtimeMinutes);

	if (runtimeMinutes.length === 0) {
		errors.runtimeMinutes = "Runtime is required.";
	} else if (!Number.isInteger(runtime) || runtime < 1 || runtime > 300) {
		errors.runtimeMinutes = "Enter a runtime between 1 and 300 minutes.";
	}

	return errors;
};
