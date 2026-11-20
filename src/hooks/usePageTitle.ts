import { useEffect } from "react";

const appName = "CineQuest";

export const usePageTitle = (page?: string) => {
	useEffect(() => {
		document.title = page ? `${page} | ${appName}` : appName;
	}, [page]);
};
