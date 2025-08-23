import prisma from "@/lib/prisma";
import { addFeatureToPlan, updateFeatureConfig } from "./actions";

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

  const features = await prisma.feature.findMany({
    where: { clientAppId: params.appId },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{plan.name}</h1>
      <p className="text-gray-500 mb-8">{plan.description}</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Feature to Plan</h2>
        <form action={addFeatureToPlanWithPlanId} className="flex items-center gap-4">
          <select name="featureId" className="p-2 border rounded-md">
            {features.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {feature.name}
              </option>
            ))}
          </select>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
            Add Feature
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Associated Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.features.map((planFeature) => (
          <div key={planFeature.id} className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold">
              {planFeature.feature.name}
            </h3>
            <p className="text-gray-600">
              {planFeature.feature.description}
            </p>
            <form
              action={updateFeatureConfig.bind(null, planFeature.id)}
              className="mt-4"
            >
              <textarea
                name="config"
                placeholder="Feature Config (JSON)"
                className="p-2 border rounded-md w-full"
                defaultValue={JSON.stringify(planFeature.config, null, 2)}
              />
              <button
                type="submit"
                className="mt-2 p-2 bg-blue-500 text-white rounded-md"
              >
                Save Config
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}