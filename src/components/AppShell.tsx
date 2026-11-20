import { Link, NavLink, Outlet } from "react-router-dom";
import { FilmIcon, RouteIcon, SparkIcon, TicketIcon } from "./Icons";
import { Toaster } from "./Toaster";
import { eyebrowClass } from "../ui";

const navigation = [
	{ to: "/movies", label: "Movies", icon: FilmIcon },
	{ to: "/rewatch", label: "Rewatch Plan", icon: RouteIcon },
	{ to: "/booking", label: "Booking", icon: TicketIcon },
];

export const AppShell = () => {
	return (
		<div className="relative min-h-screen overflow-x-clip">
			<div className="texture-grid pointer-events-none fixed inset-0 opacity-70" />
			<div className="pointer-events-none fixed inset-x-0 -top-40 mx-auto size-168 rounded-full bg-indigo-500/20 blur-[140px]" />
			<div className="animate-float-slow pointer-events-none fixed -right-40 top-1/3 size-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
			<div className="animate-float-slow pointer-events-none fixed -left-40 top-2/3 size-80 rounded-full bg-violet-500/10 blur-3xl" />

			<header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
					<Link className="group flex items-center gap-3" to="/movies">
						<span className="grid size-11 place-items-center rounded-2xl bg-linear-to-br from-indigo-400 via-violet-400 to-fuchsia-400 text-slate-950 shadow-lg shadow-indigo-500/25 transition duration-200 group-hover:-translate-y-0.5">
							<FilmIcon className="size-6" title="CineQuest" />
						</span>
						<span>
							<span className="block text-md font-black tracking-[0.24em] text-white uppercase">
								CineQuest
							</span>
							<span className="block text-sm text-slate-400">
								Your movie marathon command center
							</span>
						</span>
					</Link>
					<nav className="flex flex-wrap items-center gap-2">
						{navigation.map(({ to, label, icon: Icon }) => (
							<NavLink
								className={({ isActive }) =>
									`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold tracking-wide transition duration-200 uppercase ${
										isActive
											? "border-indigo-300/30 bg-indigo-400/15 text-indigo-100 shadow-lg shadow-indigo-500/10"
											: "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
									}`
								}
								key={to}
								to={to}
							>
								<Icon className="size-4" title={label} />
								{label}
							</NavLink>
						))}
					</nav>
				</div>
			</header>

			<main className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 lg:px-8">
				<section className="mb-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
					<div className="max-w-2xl">
						<div className="mb-3 flex items-center gap-2">
							<SparkIcon className="size-4 text-fuchsia-300" title="Featured" />
							<p className={eyebrowClass}>Rewatch intelligence, simplified</p>
						</div>
						<h1 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
							Plan Your Rewatch.
							<br />
							<span className="bg-linear-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
								Book Your Premiere.
							</span>
						</h1>
						<p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
							Build prerequisite-ready watch orders, track every step, and turn
							the final film into a group outing your friends will remember.
						</p>
					</div>
					<div className="hidden gap-3 lg:flex">
						<div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
							<p className="text-2xl font-black text-white">01</p>
							<p className="text-[0.625rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
								Build the library
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
							<p className="text-2xl font-black text-white">02</p>
							<p className="text-[0.625rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
								Follow the order
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
							<p className="text-2xl font-black text-white">03</p>
							<p className="text-[0.625rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
								Book the night
							</p>
						</div>
					</div>
				</section>

				<Outlet />
			</main>

			<footer className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 px-4 pb-8 text-xs text-slate-500 sm:px-6 lg:px-8">
				<p>CineQuest · Plan the path, then own the premiere.</p>
				<p>&copy; 2023 CineQuest. All rights reserved.</p>
			</footer>
			<Toaster />
		</div>
	);
};
