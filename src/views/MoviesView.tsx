import { MovieForm } from "../modules/movies/MovieForm";
import { MovieLibrary } from "../modules/movies/MovieLibrary";
import { useMovies } from "../modules/movies/useMovies";

const MoviesView = () => {
	const {
		movies,
		form,
		setForm,
		loading,
		saving,
		deletingId,
		createMovie,
		updateWatched,
		updatePrerequisites,
		removeMovie,
	} = useMovies();

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.4fr)]">
			<MovieForm
				form={form}
				movies={movies}
				saving={saving}
				onFormChange={setForm}
				onSubmit={() => void createMovie()}
			/>
			<MovieLibrary
				movies={movies}
				loading={loading}
				deletingId={deletingId}
				onWatched={(movie) => void updateWatched(movie)}
				onPrerequisites={(movie, prerequisiteIds) =>
					void updatePrerequisites(movie, prerequisiteIds)
				}
				onDelete={(movie) => void removeMovie(movie)}
			/>
		</div>
	);
};

export default MoviesView;
