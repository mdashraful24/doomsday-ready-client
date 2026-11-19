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
		<div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
			<div className="lg:sticky lg:top-24 lg:z-10 lg:self-start">
				<RewatchTargetPanel
					movies={movies}
					selectedId={selectedId}
					order={order}
					loading={loading}
					onSelect={selectTarget}
				/>
			</div>
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
