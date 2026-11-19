import type { ReactNode } from "react";
import {
	cardClass,
	cardGlowClass,
	eyebrowClass,
	sectionTitleClass,
} from "../ui";

type SectionCardProps = {
	title: string;
	eyebrow?: string;
	description?: string;
	icon?: ReactNode;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
};

export const SectionCard = ({
	title,
	eyebrow,
	description,
	icon,
	action,
	children,
	className = "",
}: SectionCardProps) => (
	<section className={`${cardClass} ${className}`}>
		<div
			className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]"
			aria-hidden="true"
		>
			<div className={cardGlowClass} />
		</div>
		<div className="relative mb-5 flex items-start justify-between gap-4">
			<div className="flex items-start gap-3.5">
				{icon && (
					<div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-indigo-200 shadow-lg shadow-indigo-500/10">
						{icon}
					</div>
				)}
				<div>
					{eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
					<h2 className={sectionTitleClass}>{title}</h2>
					{description && (
						<p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-400">
							{description}
						</p>
					)}
				</div>
			</div>
			{action && <div className="shrink-0">{action}</div>}
		</div>
		<div className="relative">{children}</div>
	</section>
);
