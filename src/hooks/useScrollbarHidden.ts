import { useEffect } from "react";

let activeCount = 0;

export const useScrollbarHidden = (active: boolean) => {
	useEffect(() => {
		if (!active) return;

		activeCount += 1;
		document.body.classList.add("scrollbar-none");

		return () => {
			activeCount = Math.max(0, activeCount - 1);

			if (activeCount === 0) {
				document.body.classList.remove("scrollbar-none");
			}
		};
	}, [active]);
};
