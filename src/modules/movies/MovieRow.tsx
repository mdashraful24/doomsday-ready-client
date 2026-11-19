import { useEffect, useState } from "react";
import { Field } from "../../components/Field";
import { CheckIcon, TrashIcon } from "../../components/Icons";
import { MultiSelect } from "../../components/MultiSelect";
import type { Movie } from "../../types";
import {
	checkboxClass,
	checkboxInputClass,
	dangerButtonClass,
	nestedPanelClass,
	rowClass,
	secondaryButtonClass,
	successChipClass,
	warningChipClass,
} from "../../ui";
import { formatRuntime } from "../../utils";

type MovieRowProps = {
	movie: Movie;
	movies: Movie[];
	deleting: boolean;
	onWatched: (movie: Movie) => void;
	onPrerequisites: (movie: Movie, prerequisiteIds: string[]) => void;
	onDelete: (movie: Movie) => void;
};

export const MovieRow = ({
	movie,
	movies,
	deleting,
	onWatched,
	onPrerequisites,
	onDelete,
}: MovieRowProps) => {
	const [selectedIds, setSelectedIds] = useState(movie.prerequisiteIds);

	useEffect(() => {
		setSelectedIds(movie.prerequisiteIds);
	}, [movie.prerequisiteIds]);

	const candidates = movies.filter((candidate) => candidate.id !== movie.id);
	const options = candidates.map((candidate) => ({
		value: candidate.id,
		label: candidate.title,
		description: `${candidate.releaseYear} · ${candidate.runtimeMinutes} min`,
	}));
	const hasChanges =
		selectedIds.length !== movie.prerequisiteIds.length ||
		selectedIds.some((id) => !movie.prerequisiteIds.includes(id));

	return (
		<article className={`${rowClass} border-l-2 border-l-indigo-400/30`}>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="text-base font-semibold text-white">
							{movie.title}
						</h3>
						<span
							className={movie.watched ? successChipClass : warningChipClass}
						>
							<CheckIcon className="size-3" />
							{movie.watched ? "Watched" : "Up next"}
						</span>
					</div>
					<p className="mt-1.5 text-sm text-slate-400">
						{movie.releaseYear} · {formatRuntime(movie.runtimeMinutes)} ·{" "}
						{movie.prerequisiteIds.length} prerequisite
						{movie.prerequisiteIds.length === 1 ? "" : "s"}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<label className={checkboxClass}>
						<input
							type="checkbox"
							className={checkboxInputClass}
							checked={movie.watched}
							onChange={() => onWatched(movie)}
						/>
						Watched
					</label>
					<button
						type="button"
						className={dangerButtonClass}
						disabled={deleting}
						aria-label={`Delete ${movie.title}`}
						onClick={() => onDelete(movie)}
					>
						<TrashIcon className="size-4" />
						{deleting ? "Deleting" : "Delete"}
					</button>
				</div>
			</div>

			<div className={`mt-4 ${nestedPanelClass}`}>
				<Field
					label="Prerequisites"
					htmlFor={`prerequisites-${movie.id}`}
					hint="Search and adjust the films that come before this one."
				>
					<div className="grid items-start gap-3 sm:grid-cols-[1fr_auto]">
						<MultiSelect
							id={`prerequisites-${movie.id}`}
							options={options}
							value={selectedIds}
							onValueChange={setSelectedIds}
							placeholder="Select prerequisite movies"
							emptyMessage="No other movies available"
						/>
						<button
							type="button"
							className={secondaryButtonClass}
							disabled={!hasChanges}
							onClick={() => onPrerequisites(movie, selectedIds)}
						>
							Save changes
						</button>
					</div>
				</Field>
			</div>
		</article>
	);
};
