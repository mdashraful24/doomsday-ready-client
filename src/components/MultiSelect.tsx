import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollbarHidden } from "../hooks/useScrollbarHidden";
import {
	chipClass,
	dropdownOptionClass,
	dropdownPanelClass,
	iconButtonClass,
	inputClass,
} from "../ui";
import { CheckIcon, ChevronDownIcon, CloseIcon, SearchIcon } from "./Icons";
import type { SelectOption } from "./Select";

type MultiSelectProps = {
	options: SelectOption[];
	value: string[];
	onValueChange: (value: string[]) => void;
	placeholder?: string;
	id?: string;
	disabled?: boolean;
	emptyMessage?: string;
};

export const MultiSelect = ({
	options,
	value,
	onValueChange,
	placeholder = "Select options",
	id,
	disabled = false,
	emptyMessage = "No options available",
}: MultiSelectProps) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const rootRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);

	useScrollbarHidden(open);

	const selected = useMemo(
		() => options.filter((option) => value.includes(option.value)),
		[options, value],
	);
	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return options;

		return options.filter((option) =>
			option.label.toLowerCase().includes(normalized),
		);
	}, [options, query]);

	useEffect(() => {
		if (open) searchRef.current?.focus();
		else setQuery("");
	}, [open]);

	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (event: PointerEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	const toggleOption = (optionValue: string) => {
		onValueChange(
			value.includes(optionValue)
				? value.filter((item) => item !== optionValue)
				: [...value, optionValue],
		);
	};

	return (
		<div className="relative" ref={rootRef}>
			<button
				id={id}
				type="button"
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={id ? `${id}-listbox` : undefined}
				className={`${inputClass} flex min-h-11 items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50`}
				onClick={() => setOpen((current) => !current)}
			>
				<span className="flex min-w-0 flex-wrap gap-1.5">
					{selected.length === 0 ? (
						<span className="text-slate-500">{placeholder}</span>
					) : (
						<>
							{selected.slice(0, 2).map((option) => (
								<span key={option.value} className={chipClass}>
									{option.label}
								</span>
							))}
							{selected.length > 2 && (
								<span className={chipClass}>+{selected.length - 2} more</span>
							)}
						</>
					)}
				</span>
				<ChevronDownIcon
					className={`size-4 text-slate-500 transition-transform duration-200 ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>

			{open && (
				<div
					id={id ? `${id}-listbox` : undefined}
					role="listbox"
					aria-multiselectable="true"
					className={dropdownPanelClass}
				>
					<div className="flex items-center gap-2 px-1 pb-2 pt-1">
						<div className="relative flex-1">
							<SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
							<input
								ref={searchRef}
								type="search"
								className={`${inputClass} pl-9`}
								placeholder="Search movies..."
								value={query}
								onChange={(event) => setQuery(event.target.value)}
							/>
						</div>
						<button
							type="button"
							className={iconButtonClass}
							aria-label="Clear selection"
							disabled={value.length === 0}
							onClick={() => onValueChange([])}
						>
							<CloseIcon className="size-4" />
						</button>
					</div>

					<div className="scrollbar-none max-h-60 overflow-y-auto">
						{filtered.length === 0 ? (
							<p className="px-3 py-4 text-sm text-slate-500">{emptyMessage}</p>
						) : (
							filtered.map((option) => {
								const isSelected = value.includes(option.value);
								return (
									<button
										key={option.value}
										type="button"
										role="option"
										aria-selected={isSelected}
										className={`${dropdownOptionClass} ${
											isSelected ? "text-white" : ""
										}`}
										onClick={() => toggleOption(option.value)}
									>
										<span
											className={`grid size-4 shrink-0 place-items-center rounded border ${
												isSelected
													? "border-indigo-300 bg-indigo-400 text-slate-950"
													: "border-white/20"
											}`}
										>
											{isSelected && (
												<CheckIcon className="size-3" title="Selected" />
											)}
										</span>
										<span className="flex-1 truncate">{option.label}</span>
									</button>
								);
							})
						)}
					</div>
				</div>
			)}
		</div>
	);
};
