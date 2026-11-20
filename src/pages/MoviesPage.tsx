import { usePageTitle } from "../hooks/usePageTitle";
import MoviesView from "../views/MoviesView";

const MoviesPage = () => {
	usePageTitle("Movies");

	return <MoviesView />;
};

export default MoviesPage;
