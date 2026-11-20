import { Toaster as SonnerToaster } from "sonner";

export const Toaster = () => (
	<SonnerToaster
		theme="dark"
		position="top-right"
		richColors
		// closeButton
		toastOptions={{
			style: {
				background: "rgba(2, 6, 23, 0.95)",
				border: "1px solid rgba(255, 255, 255, 0.12)",
				color: "#f1f5f9",
				boxShadow: "0 20px 50px -20px rgba(0, 0, 0, 0.9)",
				borderRadius: "16px",
			},
		}}
	/>
);
