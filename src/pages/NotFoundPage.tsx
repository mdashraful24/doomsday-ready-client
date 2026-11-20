import { Link, useLocation } from "react-router-dom";
import { ArrowRightIcon, SparkIcon } from "../components/Icons";
import {
	cardClass,
	cardGlowClass,
	eyebrowClass,
	mutedClass,
	primaryButtonClass,
	secondaryButtonClass,
	sectionTitleClass,
} from "../ui";

const NotFoundPage = () => {
	const location = useLocation();

	return (
		<section className="grid place-items-center py-10">
			<div className={`${cardClass} w-full max-w-xl text-center`}>
				<div className={cardGlowClass} />
				<div className="relative">
					<div className="mx-auto grid size-16 place-items-center rounded-3xl border border-indigo-300/20 bg-indigo-400/10 text-lg font-bold text-indigo-200">
						404
					</div>
					<p className={`${eyebrowClass} mt-6 inline-flex items-center gap-2`}>
						<SparkIcon className="size-3.5" />
						Lost in the schedule?
					</p>
					<h1 className={`${sectionTitleClass} mt-2`}>
						This page never made the cut.
					</h1>
					<p className={`${mutedClass} mx-auto max-w-md`}>
						The screen you are looking for is not part of this premiere plan.
					</p>
					<p className="mt-4 truncate rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-xs text-slate-400">
						{location.pathname}
					</p>
					<div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
						<Link to="/movies" className={primaryButtonClass}>
							Back to movies
							<ArrowRightIcon className="size-4" />
						</Link>
						<Link to="/booking" className={secondaryButtonClass}>
							Go to booking
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default NotFoundPage;
