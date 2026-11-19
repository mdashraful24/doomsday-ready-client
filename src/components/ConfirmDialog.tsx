import { useEffect, useRef } from "react";
import { TrashIcon } from "./Icons";
import type { ConfirmOptions } from "../providers/confirm-context";
import {
	destructiveButtonClass,
	eyebrowClass,
	modalBackdropClass,
	modalPanelClass,
	secondaryButtonClass,
	sectionTitleClass,
} from "../ui";

type ConfirmDialogProps = ConfirmOptions & {
	onConfirm: () => void;
	onCancel: () => void;
};

export const ConfirmDialog = ({
	title,
	description,
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	onConfirm,
	onCancel,
}: ConfirmDialogProps) => {
	const confirmRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		confirmRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onCancel();
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onCancel]);

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, []);

	return (
		<div className={modalBackdropClass}>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-description"
				className={modalPanelClass}
			>
				<div className="flex gap-4">
					<div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-rose-300/20 bg-rose-500/10 text-rose-200">
						<TrashIcon className="size-5" />
					</div>
					<div>
						<p className={eyebrowClass}>Confirm action</p>
						<h2 id="confirm-dialog-title" className={sectionTitleClass}>
							{title}
						</h2>
						<p
							id="confirm-dialog-description"
							className="mt-2 text-sm leading-6 text-slate-400"
						>
							{description}
						</p>
					</div>
				</div>

				<div className="mt-6 flex justify-end gap-2">
					<button
						type="button"
						className={secondaryButtonClass}
						onClick={onCancel}
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						className={destructiveButtonClass}
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};
