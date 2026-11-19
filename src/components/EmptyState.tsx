import type { ReactNode } from "react";
import { mutedClass } from "../ui";

type EmptyStateProps = {
	title: string;
	description?: string;
	icon?: ReactNode;
};

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => (
	<div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
		{icon && (
			<div className="mb-3 grid size-11 place-items-center rounded-2xl bg-white/5 text-slate-400">
				{icon}
			</div>
		)}
		<p className="text-sm font-semibold text-slate-200">{title}</p>
		{description && (
			<p className={`${mutedClass} text-center`}>{description}</p>
		)}
	</div>
);
