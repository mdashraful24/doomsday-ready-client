import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import MoviesPage from "./pages/MoviesPage";
import NotFoundPage from "./pages/NotFoundPage";
import RewatchPlanPage from "./pages/RewatchPlanPage";
import { AppDataProvider } from "./providers/AppDataProvider";
import { ConfirmProvider } from "./providers/ConfirmProvider";

const App = () => {
	return (
		<AppDataProvider>
			<ConfirmProvider>
				<Routes>
					<Route element={<AppShell />} path="/">
						<Route element={<Navigate replace to="/movies" />} index />
						<Route element={<MoviesPage />} path="movies" />
						<Route element={<RewatchPlanPage />} path="rewatch" />
						<Route element={<BookingPage />} path="booking" />
						<Route element={<BookingsPage />} path="booking/list" />
						<Route element={<NotFoundPage />} path="*" />
					</Route>
				</Routes>
			</ConfirmProvider>
		</AppDataProvider>
	);
};

export default App;
