import type { FormEvent } from "react";
import { Field } from "../../components/Field";
import { PlusIcon } from "../../components/Icons";
import { MultiSelect } from "../../components/MultiSelect";
import { SectionCard } from "../../components/SectionCard";
import type { Movie } from "../../types";
import {
	checkboxClass,
	checkboxInputClass,
	inputClass,
	primaryButtonClass,
} from "../../ui";
import type { MovieFormValues } from "./types";
import { validateMovieForm } from "./validation";

type MovieFormProps = {
	form: MovieFormValues;
	movies: Movie[];
	saving: boolean;
	onFormChange: (form: MovieFormValues) => void;
	onSubmit: () => void;
};

export const MovieForm = ({
	form,
	movies,
	saving,
	onFormChange,
	onSubmit,
}: MovieFormProps) => {
	const isValid = Object.keys(validateMovieForm(form)).length === 0;

	const options = movies.map((movie) => ({
		value: movie.id,
		label: movie.title,
		description: `${movie.releaseYear} · ${movie.runtimeMinutes} min`,
	}));

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isValid) onSubmit();
	};

	return (
		<SectionCard
			eyebrow="Library setup"
			title="Add a movie"
			description="Give each title a runtime and connect the films that must be watched first."
			icon={<PlusIcon />}
		>
			<form className="grid gap-4" noValidate onSubmit={handleSubmit}>
				<Field label="Title" htmlFor="movie-title">
					<input
						id="movie-title"
						className={inputClass}
						placeholder="Avengers: Doomsday"
						value={form.title}
						onChange={(event) =>
							onFormChange({ ...form, title: event.target.value })
						}
					/>
				</Field>

				<div className="grid gap-4 sm:grid-cols-2">
					<Field label="Release year" htmlFor="movie-year">
						<input
							id="movie-year"
							type="number"
							className={inputClass}
							placeholder="2026"
							value={form.releaseYear}
							onChange={(event) =>
								onFormChange({ ...form, releaseYear: event.target.value })
							}
						/>
					</Field>
					<Field label="Runtime (minutes)" htmlFor="movie-runtime">
						<input
							id="movie-runtime"
							type="number"
							className={inputClass}
							placeholder="160"
							value={form.runtimeMinutes}
							onChange={(event) =>
								onFormChange({ ...form, runtimeMinutes: event.target.value })
							}
						/>
					</Field>
				</div>

				<Field
					label="Prerequisites"
					htmlFor="movie-prerequisites"
					hint="Search and pick the films that come before this one."
				>
					<MultiSelect
						id="movie-prerequisites"
						options={options}
						value={form.prerequisiteIds}
						onValueChange={(prerequisiteIds) =>
							onFormChange({ ...form, prerequisiteIds })
						}
						placeholder="Select prerequisite movies"
						emptyMessage="No movies available yet"
					/>
				</Field>

				<label className={checkboxClass}>
					<input
						type="checkbox"
						className={checkboxInputClass}
						checked={form.watched}
						onChange={(event) =>
							onFormChange({ ...form, watched: event.target.checked })
						}
					/>
					Already watched
				</label>

				<button
					type="submit"
					className={primaryButtonClass}
					disabled={saving || !isValid}
				>
					<PlusIcon className="size-4" />
					{saving ? "Adding..." : "Add movie"}
				</button>
			</form>
		</SectionCard>
	);
};
