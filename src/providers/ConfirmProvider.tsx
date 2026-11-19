import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
	ConfirmContext,
	type ConfirmFunction,
	type ConfirmOptions,
} from "./confirm-context";

type ConfirmState = ConfirmOptions & {
	resolve: (value: boolean) => void;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useState<ConfirmState | null>(null);

	const confirm = useCallback<ConfirmFunction>(
		(options) =>
			new Promise<boolean>((resolve) => {
				setState({ ...options, resolve });
			}),
		[],
	);

	const close = useCallback(
		(result: boolean) => {
			if (!state) return;
			state.resolve(result);
			setState(null);
		},
		[state],
	);

	const value = useMemo(() => confirm, [confirm]);

	return (
		<ConfirmContext.Provider value={value}>
			{children}
			{state && (
				<ConfirmDialog
					title={state.title}
					description={state.description}
					confirmLabel={state.confirmLabel}
					cancelLabel={state.cancelLabel}
					onConfirm={() => close(true)}
					onCancel={() => close(false)}
				/>
			)}
		</ConfirmContext.Provider>
	);
};
