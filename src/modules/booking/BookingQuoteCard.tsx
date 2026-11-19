import type { BookingQuote } from "../../types";
import {
	bundleChipClass,
	primaryButtonClass,
	successChipClass,
	warningChipClass,
} from "../../ui";
import { CheckIcon } from "../../components/Icons";

type BookingQuoteCardProps = {
	quote: BookingQuote;
	creating: boolean;
	onConfirm: () => void;
};

export const BookingQuoteCard = ({
	quote,
	creating,
	onConfirm,
}: BookingQuoteCardProps) => (
	<div
		className={`rounded-2xl border p-4 ${
			quote.possible
				? "border-emerald-300/20 bg-emerald-400/10"
				: "border-rose-300/20 bg-rose-500/10"
		}`}
	>
		<span className={quote.possible ? successChipClass : warningChipClass}>
			{quote.possible && <CheckIcon className="size-3" />}
			{quote.possible ? "Bundle plan ready" : "Not possible"}
		</span>

		{quote.possible ? (
			<div className="mt-4 grid gap-4">
				<div className="flex flex-wrap gap-2">
					{quote.bundles.map((bundle) => (
						<span key={bundle.size} className={bundleChipClass}>
							{bundle.quantity} × {bundle.size}-seat
						</span>
					))}
				</div>
				<p className="text-sm text-slate-300">
					{quote.totalBundles} bundle(s) for {quote.groupSize} guests.
				</p>
				<button
					type="button"
					className={primaryButtonClass}
					disabled={creating}
					onClick={onConfirm}
				>
					{creating ? "Confirming..." : "Confirm booking"}
				</button>
			</div>
		) : (
			<p className="mt-3 text-sm text-rose-100">
				{quote.message ??
					"No exact bundle combination is possible for this group size."}
			</p>
		)}
	</div>
);
