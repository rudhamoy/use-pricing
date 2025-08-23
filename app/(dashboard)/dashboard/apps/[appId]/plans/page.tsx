import prisma from "@/lib/prisma";
import Link from "next/link";
import { createPlan } from "./actions";

export default async function PlansPage({
  params,
}: {
  params: { appId: string };
}) {
  const createPlanWithAppId = createPlan.bind(null, params.appId);
  const app = await prisma.clientApp.findUnique({
    where: { id: params.appId },
    include: { plans: true },
  });

  if (!app) {
    return <div>App not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Plans for {app.name}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Plan</h2>
        <form action={createPlanWithAppId} className="flex flex-col gap-4 max-w-sm">
          <input
            type="text"
            name="name"
            placeholder="Plan Name"
            className="p-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            placeholder="Plan Description"
            className="p-2 border rounded-md"
          />
          <input
            type="number"
            name="baseFee"
            placeholder="Base Fee"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="billingCycle"
            placeholder="Billing Cycle (e.g., monthly, yearly)"
            className="p-2 border rounded-md"
            required
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
            Create Plan
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {app.plans.map((plan) => (
          <Link
            href={`/dashboard/apps/${app.id}/plans/${plan.id}`}
            key={plan.id}
            className="p-4 border rounded-md hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-gray-500">{plan.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}