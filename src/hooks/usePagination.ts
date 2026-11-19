import { useEffect, useState } from "react";

export const usePagination = (totalItems: number, pageSize: number) => {
	const [page, setPage] = useState(1);
	const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

	useEffect(() => {
		if (page > pageCount) setPage(pageCount);
	}, [page, pageCount]);

	const startIndex = (Math.min(page, pageCount) - 1) * pageSize;

	return {
		page: Math.min(page, pageCount),
		pageCount,
		startIndex,
		setPage,
	};
};
