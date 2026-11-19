type PaginationProps = {
	page: number;
	pageCount: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
};

type PageItem =
	| { type: "page"; value: number; id: string }
	| { type: "ellipsis"; id: string };

const pageButtonClass =
	"grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 transition duration-200 hover:border-white/20 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/10 disabled:pointer-events-none disabled:opacity-40";

const getPageItems = (page: number, pageCount: number): PageItem[] => {
	const pageItem = (value: number): PageItem => ({
		type: "page",
		value,
		id: `page-${value}`,
	});

	if (pageCount <= 5) {
		return Array.from({ length: pageCount }, (_, index) => pageItem(index + 1));
	}

	const items: PageItem[] = [pageItem(1)];
	const start = Math.max(2, page - 1);
	const end = Math.min(pageCount - 1, page + 1);

	if (start > 2) items.push({ type: "ellipsis", id: "ellipsis-start" });
	for (let index = start; index <= end; index += 1) items.push(pageItem(index));
	if (end < pageCount - 1) items.push({ type: "ellipsis", id: "ellipsis-end" });
	items.push(pageItem(pageCount));

	return items;
};

export const Pagination = ({
	page,
	pageCount,
	pageSize,
	total,
	onPageChange,
}: PaginationProps) => {
	const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
	const last = Math.min(total, page * pageSize);

	return (
		<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
			<p className="text-xs text-slate-500">
				Showing {first}-{last} of {total}
			</p>
			<div className="flex items-center gap-1">
				<button
					type="button"
					className={pageButtonClass}
					disabled={page <= 1}
					aria-label="Previous page"
					onClick={() => onPageChange(page - 1)}
				>
					‹
				</button>
				{getPageItems(page, pageCount).map((item) =>
					item.type === "ellipsis" ? (
						<span
							key={item.id}
							className="grid size-8 place-items-center text-xs text-slate-600"
						>
							…
						</span>
					) : (
						<button
							key={item.id}
							type="button"
							className={`${pageButtonClass} ${
								item.value === page
									? "border-indigo-300/40 bg-indigo-400/20 text-white"
									: ""
							}`}
							aria-label={`Page ${item.value}`}
							aria-current={item.value === page ? "page" : undefined}
							onClick={() => onPageChange(item.value)}
						>
							{item.value}
						</button>
					),
				)}
				<button
					type="button"
					className={pageButtonClass}
					disabled={page >= pageCount}
					aria-label="Next page"
					onClick={() => onPageChange(page + 1)}
				>
					›
				</button>
			</div>
		</div>
	);
};
