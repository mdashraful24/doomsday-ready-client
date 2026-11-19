import { skeletonClass } from "../../ui";

type SkeletonProps = {
	className?: string;
};

export const Skeleton = ({ className = "" }: SkeletonProps) => (
	<div className={`${skeletonClass} ${className}`} aria-hidden="true" />
);
