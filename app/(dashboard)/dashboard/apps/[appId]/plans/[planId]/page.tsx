import prisma from "@/lib/prisma";
import { addFeatureToPlan, updateFeatureConfig } from "./actions";
import FeatureSelect from "../components/FeatureSelect";
import AssociatedFeatures from "../components/AssociatedFeatures";

export default async function PlanDetailsPage({
  params,
}: {
  params: { appId: string; planId: string };
}) {
  const addFeatureToPlanWithPlanId = addFeatureToPlan.bind(null, params.planId);
  const plan = await prisma.plan.findUnique({
    where: { id: params.planId },
    include: { features: { include: { feature: true } } },
  });

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{plan.name}</h1>
      <p className="text-gray-500 mb-8">{plan.description}</p>

      <div className="mb-8">
        <form action={addFeatureToPlanWithPlanId}>
          <FeatureSelect appId={params.appId} plan={plan} />
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          >
            Save Changes
          </button>
        </form>
      </div>

      <AssociatedFeatures plan={plan} />
    </div>
  );
}