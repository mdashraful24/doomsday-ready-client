import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import type { Cinema, UpdateCinemaPayload } from "../../types";
import {
	eyebrowClass,
	fieldHintClass,
	fieldLabelClass,
	inputClass,
	labelClass,
	modalBackdropClass,
	modalPanelClass,
	primaryButtonClass,
	secondaryButtonClass,
	sectionTitleClass,
} from "../../ui";

type CinemaEditDialogProps = {
	cinema: Cinema;
	saving: boolean;
	onSave: (id: string, payload: UpdateCinemaPayload) => Promise<boolean>;
	onClose: () => void;
};

const parseBundleSizes = (value: string) => {
	const sizes = value
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean)
		.map(Number);

	if (sizes.length === 0) {
		return { error: "Add at least one bundle size." };
	}

	if (sizes.some((size) => !Number.isInteger(size))) {
		return { error: "Bundle sizes must be whole numbers." };
	}

	if (sizes.some((size) => size < 1 || size > 500)) {
		return { error: "Bundle sizes must be between 1 and 500." };
	}

	if (new Set(sizes).size !== sizes.length) {
		return { error: "Bundle sizes must be unique." };
	}

	if (sizes.length > 10) {
		return { error: "At most 10 bundle sizes are allowed." };
	}

	return { sizes };
};

export const CinemaEditDialog = ({
	cinema,
	saving,
	onSave,
	onClose,
}: CinemaEditDialogProps) => {
	const initialBundleSizes = cinema.bundleSizes.join(", ");
	const [name, setName] = useState(cinema.name);
	const [bundleSizes, setBundleSizes] = useState(initialBundleSizes);
	const [image, setImage] = useState<File>();
	const nameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		nameRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !saving) onClose();
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose, saving]);

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, []);

	const trimmedName = name.trim();
	const bundleResult = parseBundleSizes(bundleSizes);
	const isValid =
		trimmedName.length > 0 &&
		trimmedName.length <= 200 &&
		"sizes" in bundleResult;
	const isDirty =
		trimmedName !== cinema.name ||
		bundleSizes
			.split(",")
			.map((part) => part.trim())
			.filter(Boolean)
			.join(", ") !== initialBundleSizes ||
		Boolean(image);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!isValid || !("sizes" in bundleResult)) return;

		const saved = await onSave(cinema.id, {
			name: trimmedName,
			bundleSizes: bundleResult.sizes,
			...(image ? { image } : {}),
		});

		if (saved) onClose();
	};

	return createPortal(
		<div className={modalBackdropClass}>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={`cinema-edit-title-${cinema.id}`}
				className={modalPanelClass}
			>
				<p className={eyebrowClass}>Venue settings</p>
				<h2
					id={`cinema-edit-title-${cinema.id}`}
					className={`${sectionTitleClass} mt-1`}
				>
					Edit cinema
				</h2>
				<p className={fieldHintClass}>
					Update this venue and its bundle sizes.
				</p>

				<form className="mt-6 grid gap-4" noValidate onSubmit={handleSubmit}>
					<label className={labelClass}>
						<span className={fieldLabelClass}>Name</span>
						<input
							ref={nameRef}
							className={inputClass}
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</label>

					<label className={labelClass}>
						<span className={fieldLabelClass}>Bundle sizes</span>
						<input
							className={inputClass}
							value={bundleSizes}
							placeholder="4, 6, 8"
							onChange={(event) => setBundleSizes(event.target.value)}
						/>
						<span className={fieldHintClass}>
							Comma-separated whole numbers between 1 and 500.
						</span>
					</label>

					<label className={labelClass}>
						<span className={fieldLabelClass}>Replacement image</span>
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif"
							className={inputClass}
							onChange={(event) => setImage(event.target.files?.[0])}
						/>
						<span className={fieldHintClass}>
							Optional. Leave empty to keep the current image.
						</span>
					</label>

					<div className="mt-2 flex justify-end gap-2">
						<button
							type="button"
							className={secondaryButtonClass}
							disabled={saving}
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={primaryButtonClass}
							disabled={saving || !isDirty || !isValid}
						>
							{saving ? "Saving..." : "Save changes"}
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body,
	);
};
