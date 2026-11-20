import { useEffect } from "react";

const appName = "Doomsday Ready";

export const usePageTitle = (page?: string) => {
	useEffect(() => {
		document.title = page ? `${page} | ${appName}` : appName;
	}, [page]);
};
