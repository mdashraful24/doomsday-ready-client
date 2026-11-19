import type { ReactNode } from "react";
import {
	Navigate,
	NavLink,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import { FilmIcon, RouteIcon, SparkIcon, TicketIcon } from "./components/Icons";
import { Toaster } from "./components/Toaster";
import BookingPage from "./pages/BookingPage";
import MoviesPage from "./pages/MoviesPage";
import RewatchPlanPage from "./pages/RewatchPlanPage";
import { ConfirmProvider } from "./providers/ConfirmProvider";

type NavigationItem = {
	to: string;
	label: string;
	icon: ReactNode;
	title: string;
	description: string;
};

const navigation: NavigationItem[] = [
	{
		to: "/movies",
		label: "Movies",
		icon: <FilmIcon className="size-4" />,
		title: "Movies",
		description:
			"Build your watch library, connect prerequisites, and keep every watched state in sync.",
	},
	{
		to: "/rewatch",
		label: "Rewatch Plan",
		icon: <RouteIcon className="size-4" />,
		title: "Rewatch Plan",
		description:
			"Follow the exact path to Avengers: Doomsday and track what still needs watching.",
	},
	{
		to: "/booking",
		label: "Booking",
		icon: <TicketIcon className="size-4" />,
		title: "Booking",
		description:
			"Turn your group size into the fewest exact bundles, or know instantly when it is not possible.",
	},
];

const tabClass =
	"inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition duration-200";

const AppShell = () => {
	const location = useLocation();
	const active =
		navigation.find((item) => item.to === location.pathname) ?? navigation[0];

	return (
		<div className="relative min-h-screen overflow-hidden bg-[#070b18] text-slate-100">
			<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
				<div className="animate-float-slow absolute -top-44 -left-40 size-[34rem] rounded-full bg-indigo-500/20 blur-[130px]" />
				<div className="absolute top-1/3 -right-48 size-[32rem] rounded-full bg-fuchsia-500/10 blur-[130px]" />
				<div className="absolute -bottom-52 left-1/3 size-[32rem] rounded-full bg-amber-400/10 blur-[130px]" />
				<div className="texture-grid absolute inset-0" aria-hidden="true" />
			</div>

			<header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 via-violet-500 to-fuchsia-500 text-slate-950 shadow-lg shadow-indigo-500/25">
							<FilmIcon className="size-5" />
						</div>
						<div>
							<p className="text-sm font-bold tracking-[0.16em] text-white">
								CINEQUEST
							</p>
							<p className="text-xs text-slate-500">
								Plan Your Rewatch. Book Your Premiere.
							</p>
						</div>
					</div>

					<nav
						className="flex flex-wrap items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
						aria-label="Views"
					>
						{navigation.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									`${tabClass} ${
										isActive
											? "bg-white/10 text-white shadow-lg shadow-black/20 ring-1 ring-white/10"
											: "text-slate-400 hover:bg-white/5 hover:text-slate-200"
									}`
								}
							>
								{item.icon}
								{item.label}
							</NavLink>
						))}
					</nav>
				</div>
			</header>

			<section className="mx-auto max-w-7xl px-4 pb-8 pt-9 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/90 via-indigo-950/50 to-slate-950/80 p-6 shadow-[0_30px_100px_-45px_rgba(99,102,241,0.65)] sm:p-8">
					<div
						className="pointer-events-none absolute inset-0"
						aria-hidden="true"
					>
						<div className="animate-float-slow absolute -top-24 right-10 size-64 rounded-full bg-indigo-500/20 blur-3xl" />
						<div className="absolute -bottom-28 left-1/3 size-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
					</div>

					<div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
						<div>
							<span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
								<SparkIcon className="size-3.5" />
								Curated for opening night
							</span>
							<h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
								{active.title}
							</h1>
							<p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
								{active.description}
							</p>
						</div>

						<div className="flex gap-3">
							<div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
								<p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-slate-500">
									Modules
								</p>
								<p className="mt-1 text-lg font-semibold text-white">03</p>
							</div>
							<div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
								<p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-slate-500">
									Workflow
								</p>
								<p className="mt-1 text-sm font-semibold text-slate-200">
									Plan → Book
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
				<Routes>
					<Route path="/" element={<Navigate to="/movies" replace />} />
					<Route path="/movies" element={<MoviesPage />} />
					<Route path="/rewatch" element={<RewatchPlanPage />} />
					<Route path="/booking" element={<BookingPage />} />
					<Route path="*" element={<Navigate to="/movies" replace />} />
				</Routes>
			</main>

			<footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-slate-600 sm:px-6 lg:px-8">
				CineQuest · Plan the path, then own the premiere.
			</footer>
			<Toaster />
		</div>
	);
};

const App = () => (
	<ConfirmProvider>
		<AppShell />
	</ConfirmProvider>
);

export default App;
