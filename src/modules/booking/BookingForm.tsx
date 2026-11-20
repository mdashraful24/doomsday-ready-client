import type { FormEvent } from "react";
import { Field } from "../../components/Field";
import { ArrowRightIcon, TicketIcon } from "../../components/Icons";
import { Select } from "../../components/Select";
import { SectionCard } from "../../components/SectionCard";
import { Skeleton } from "../../components/skeletons";
import type { BookingQuote, Cinema } from "../../types";
import {
	chipClass,
	fieldLabelClass,
	inputClass,
	nestedPanelClass,
	primaryButtonClass,
} from "../../ui";
import { BookingQuoteCard } from "./BookingQuoteCard";

type BookingFormProps = {
	cinemas: Cinema[];
	selectedCinema: Cinema | undefined;
	selectedCinemaId: string;
	groupSize: string;
	quote: BookingQuote | null;
	loading: boolean;
	checking: boolean;
	creating: boolean;
	validGroupSize: boolean;
	onCinemaChange: (id: string) => void;
	onGroupSizeChange: (value: string) => void;
	onCheckQuote: () => void;
	onConfirmBooking: () => void;
};

export const BookingForm = ({
	cinemas,
	selectedCinema,
	selectedCinemaId,
	groupSize,
	quote,
	loading,
	checking,
	creating,
	validGroupSize,
	onCinemaChange,
	onGroupSizeChange,
	onCheckQuote,
	onConfirmBooking,
}: BookingFormProps) => {
	const options = cinemas.map((cinema) => ({
		value: cinema.id,
		label: cinema.name,
		description: `${cinema.bundleSizes.join(", ")} seats`,
	}));
	const isValid = Boolean(selectedCinemaId && validGroupSize);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isValid) onCheckQuote();
	};

	return (
		<SectionCard
			eyebrow="Opening night"
			title="Group booking"
			description="Choose a cinema and group size to calculate the fewest exact bundles."
			icon={<TicketIcon />}
		>
			<form className="grid gap-4" noValidate onSubmit={handleSubmit}>
				{loading ? (
					<div
						className="grid gap-4"
						role="status"
						aria-label="Loading booking form"
					>
						<span className="sr-only">Loading booking form...</span>
						<Skeleton className="h-11 w-full" />
						<Skeleton className="h-11 w-full" />
						<Skeleton className="h-11 w-full" />
					</div>
				) : (
					<div className="grid gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Cinema" htmlFor="booking-cinema">
								<Select
									id="booking-cinema"
									options={options}
									value={selectedCinemaId}
									onValueChange={onCinemaChange}
									disabled={cinemas.length === 0}
									placeholder="Select a cinema"
									emptyMessage="No cinemas available"
								/>
							</Field>

							<Field
								label="Group size (1 to 10,000 guests)"
								htmlFor="booking-size"
							>
								<input
									id="booking-size"
									type="number"
									className={inputClass}
									value={groupSize}
									onChange={(event) => onGroupSizeChange(event.target.value)}
									placeholder="Enter group size"
								/>
							</Field>
						</div>

						{selectedCinema && (
							<div className={nestedPanelClass}>
								<p className={fieldLabelClass}>Available bundles</p>
								<div className="mt-2 flex flex-wrap gap-2">
									{selectedCinema.bundleSizes.map((size) => (
										<span key={size} className={chipClass}>
											{size}-seat
										</span>
									))}
								</div>
							</div>
						)}

						{!quote && (
							<button
								type="submit"
								className={primaryButtonClass}
								disabled={!isValid || checking}
							>
								{checking ? "Checking..." : "Check bundles"}
								<ArrowRightIcon className="size-4" />
							</button>
						)}

						{quote && (
							<BookingQuoteCard
								quote={quote}
								creating={creating}
								onConfirm={onConfirmBooking}
							/>
						)}
					</div>
				)}
			</form>
		</SectionCard>
	);
};
