import { useContext } from "react";
import { ConfirmContext } from "../providers/confirm-context";

export const useConfirm = () => {
	const confirm = useContext(ConfirmContext);

	if (!confirm) {
		throw new Error("useConfirm must be used inside ConfirmProvider");
	}

	return confirm;
};
