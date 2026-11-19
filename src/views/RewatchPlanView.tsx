import { RewatchTargetPanel } from "../modules/rewatch/RewatchTargetPanel";
import { RewatchTimeline } from "../modules/rewatch/RewatchTimeline";
import { useRewatchPlan } from "../modules/rewatch/useRewatchPlan";

const RewatchPlanView = () => {
	const {
		movies,
		selectedId,
		order,
		loading,
		updatingId,
		selectTarget,
		toggleWatched,
	} = useRewatchPlan();

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
			<RewatchTargetPanel
				movies={movies}
				selectedId={selectedId}
				order={order}
				loading={loading}
				onSelect={selectTarget}
			/>
			<RewatchTimeline
				order={order}
				loading={loading}
				updatingId={updatingId}
				onToggle={(movie) => void toggleWatched(movie)}
			/>
		</div>
	);
};

export default RewatchPlanView;
