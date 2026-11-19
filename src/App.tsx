import { useState } from "react";
import BookingView from "./views/BookingView";
import MoviesView from "./views/MoviesView";
import RewatchPlanView from "./views/RewatchPlanView";

type View = "movies" | "rewatch" | "booking";

const tabs: { id: View; label: string }[] = [
	{ id: "movies", label: "Movies" },
	{ id: "rewatch", label: "Rewatch Plan" },
	{ id: "booking", label: "Booking" },
];

const titles: Record<View, string> = {
	movies: "Movies",
	rewatch: "Rewatch Plan",
	booking: "Booking",
};

const tabClass = "rounded-lg px-3 py-2 text-sm font-semibold transition";

const App = () => {
	const [view, setView] = useState<View>("movies");

	const renderView = () => {
		if (view === "movies") return <MoviesView />;
		if (view === "rewatch") return <RewatchPlanView />;

		return <BookingView />;
	};

	return (
		<main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
			<header className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
				<div>
					<p className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
						CineQuest
					</p>
					<h1 className="text-3xl font-semibold">{titles[view]}</h1>
					<p className="mt-1.5 text-sm text-slate-400">
						Plan Your Rewatch. Book Your Premiere.
					</p>
				</div>
				<nav className="flex flex-wrap gap-2" aria-label="Views">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							type="button"
							className={`${tabClass} ${
								view === tab.id
									? "bg-indigo-400 text-slate-950 hover:bg-indigo-300"
									: "bg-slate-800 text-slate-300 hover:bg-slate-700"
							}`}
							onClick={() => setView(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</header>

			{renderView()}
		</main>
	);
};

export default App;
