import { usePageTitle } from "../hooks/usePageTitle";
import RewatchPlanView from "../views/RewatchPlanView";

const RewatchPlanPage = () => {
	usePageTitle("Rewatch Plan");

	return <RewatchPlanView />;
};

export default RewatchPlanPage;
