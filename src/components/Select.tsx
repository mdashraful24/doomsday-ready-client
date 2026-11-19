import { useEffect, useRef, useState } from "react";
import { useScrollbarHidden } from "../hooks/useScrollbarHidden";
import { dropdownOptionClass, dropdownPanelClass, inputClass } from "../ui";
import { CheckIcon, ChevronDownIcon } from "./Icons";

export type SelectOption<T extends string = string> = {
	value: T;
	label: string;
	description?: string;
};

type SelectProps<T extends string> = {
	options: SelectOption<T>[];
	value: T | "";
	onValueChange: (value: T) => void;
	placeholder?: string;
	id?: string;
	disabled?: boolean;
	emptyMessage?: string;
};

export const Select = <T extends string>({
	options,
	value,
	onValueChange,
	placeholder = "Select an option",
	id,
	disabled = false,
	emptyMessage = "No options available",
}: SelectProps<T>) => {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const selected = options.find((option) => option.value === value);

	useScrollbarHidden(open);

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

	return (
		<div className="relative" ref={rootRef}>
			<button
				id={id}
				type="button"
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={id ? `${id}-listbox` : undefined}
				className={`${inputClass} flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50`}
				onClick={() => setOpen((current) => !current)}
			>
				<span className={selected ? "truncate" : "truncate text-slate-500"}>
					{selected?.label ?? placeholder}
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
					className={dropdownPanelClass}
				>
					<div className="scrollbar-none max-h-64 overflow-y-auto">
						{options.length === 0 ? (
							<p className="px-3 py-4 text-sm text-slate-500">{emptyMessage}</p>
						) : (
							options.map((option) => (
								<button
									key={option.value}
									type="button"
									role="option"
									aria-selected={option.value === value}
									className={`${dropdownOptionClass} ${
										option.value === value ? "bg-indigo-400/10 text-white" : ""
									}`}
									onClick={() => {
										onValueChange(option.value);
										setOpen(false);
									}}
								>
									<span className="grid flex-1 gap-0.5">
										<span className="truncate">{option.label}</span>
										{option.description && (
											<span className="truncate text-xs text-slate-500">
												{option.description}
											</span>
										)}
									</span>
									{option.value === value && (
										<CheckIcon
											className="size-4 text-indigo-300"
											title="Selected"
										/>
									)}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};
