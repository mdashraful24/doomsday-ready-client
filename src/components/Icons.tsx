type IconProps = {
	className?: string;
	title?: string;
};

const iconBase = "size-5 shrink-0";

const iconAttributes = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.7,
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
	role: "img",
};

export const FilmIcon = ({
	className = iconBase,
	title = "Film",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
	</svg>
);

export const RouteIcon = ({
	className = iconBase,
	title = "Route",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<circle cx="6" cy="18" r="2" />
		<circle cx="18" cy="6" r="2" />
		<path d="M8 18h5a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3M6 16V8a2 2 0 0 1 2-2h4" />
	</svg>
);

export const TicketIcon = ({
	className = iconBase,
	title = "Ticket",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7Z" />
		<path d="M14 5v14" strokeDasharray="3 3" />
	</svg>
);

export const ClockIcon = ({
	className = iconBase,
	title = "Clock",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 7v5l3 2" />
	</svg>
);

export const UsersIcon = ({
	className = iconBase,
	title = "Guests",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
		<circle cx="10" cy="8" r="3" />
		<path d="M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M16 5.2a3 3 0 0 1 0 5.6" />
	</svg>
);

export const TrashIcon = ({
	className = iconBase,
	title = "Delete",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />
	</svg>
);

export const CheckIcon = ({
	className = iconBase,
	title = "Check",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="m5 12 4 4L19 6" />
	</svg>
);

export const SparkIcon = ({
	className = iconBase,
	title = "Spark",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
		<path d="M19 16l0.8 2.2L22 19l-2.2 0.8L19 22l-0.8-2.2L16 19l2.2-0.8L19 16Z" />
	</svg>
);

export const PlusIcon = ({
	className = iconBase,
	title = "Add",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="M12 5v14M5 12h14" />
	</svg>
);

export const ArrowRightIcon = ({
	className = iconBase,
	title = "Continue",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="M5 12h14M13 6l6 6-6 6" />
	</svg>
);

export const ChevronDownIcon = ({
	className = iconBase,
	title = "Expand",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="m6 9 6 6 6-6" />
	</svg>
);

export const SearchIcon = ({
	className = iconBase,
	title = "Search",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" />
	</svg>
);

export const CloseIcon = ({
	className = iconBase,
	title = "Close",
}: IconProps) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		aria-label={title}
		{...iconAttributes}
	>
		<title>{title}</title>
		<path d="M6 6l12 12M18 6 6 18" />
	</svg>
);
