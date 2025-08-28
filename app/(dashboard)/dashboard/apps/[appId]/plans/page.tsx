import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PlansPage({
  params,
}: {
  params: { appId: string };
}) {
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