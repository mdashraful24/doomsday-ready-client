import type { ReactNode } from "react";
import { fieldHintClass, fieldLabelClass } from "../ui";

type FieldProps = {
	label: string;
	children: ReactNode;
	htmlFor?: string;
	hint?: string;
};

export const Field = ({ label, children, htmlFor, hint }: FieldProps) => (
	<label className="grid gap-2" htmlFor={htmlFor}>
		<span className={fieldLabelClass}>{label}</span>
		{children}
		{hint && <span className={fieldHintClass}>{hint}</span>}
	</label>
);
