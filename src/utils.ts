import type { BundleSelection } from "./types";

export const formatRuntime = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const remainder = minutes % 60;

	if (hours === 0) return `${remainder}m`;
	if (remainder === 0) return `${hours}h`;

	return `${hours}h ${remainder}m`;
};

export const formatBundleSummary = (bundles: BundleSelection[]) => {
	if (bundles.length === 0) return "No bundles";

	return bundles
		.map((bundle) => `${bundle.quantity} × ${bundle.size}-seat`)
		.join(", ");
};
