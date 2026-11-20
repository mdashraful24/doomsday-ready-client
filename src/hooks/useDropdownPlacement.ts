import { useEffect, useState } from "react";
import type { RefObject } from "react";

export type DropdownPlacement = "top" | "bottom";

export const useDropdownPlacement = (
	open: boolean,
	triggerRef: RefObject<HTMLElement | null>,
	desiredHeight = 320,
) => {
	const [placement, setPlacement] = useState<DropdownPlacement>("bottom");
	const [maxHeight, setMaxHeight] = useState(desiredHeight);

	useEffect(() => {
		if (!open) return;

		const update = () => {
			const trigger = triggerRef.current;
			if (!trigger) return;

			const rect = trigger.getBoundingClientRect();
			const gap = 8;
			const viewportPadding = 16;
			const spaceBelow =
				window.innerHeight - rect.bottom - gap - viewportPadding;
			const spaceAbove = rect.top - gap - viewportPadding;
			const nextPlacement =
				spaceBelow < desiredHeight && spaceAbove > spaceBelow
					? "top"
					: "bottom";
			const available = nextPlacement === "top" ? spaceAbove : spaceBelow;

			setPlacement(nextPlacement);
			setMaxHeight(Math.max(96, Math.min(desiredHeight, available)));
		};

		update();
		window.addEventListener("resize", update);
		window.addEventListener("scroll", update, true);

		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("scroll", update, true);
		};
	}, [open, triggerRef, desiredHeight]);

	return { placement, maxHeight };
};
