import { createContext } from "react";

export type ConfirmOptions = {
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
};

export type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmFunction | null>(null);
