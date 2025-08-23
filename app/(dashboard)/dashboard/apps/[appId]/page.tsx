import prisma from "@/lib/prisma";
import { createFeature } from "./actions";
import Link from "next/link";

export default async function AppDetailsPage({
  params,
}: {
  params: { appId: string };
}) {
  const createFeatureWithAppId = createFeature.bind(null, params.appId);
  const app = await prisma.clientApp.findUnique({
    where: { id: params.appId },
    include: { features: true },
  });

  if (!app) {
    return <div>App not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{app.name}</h1>
      <p className="text-gray-500 mb-8">{app.apiKey}</p>

      <div className="mb-8">
        <Link
          href={`/dashboard/apps/${app.id}/plans`}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Manage Plans
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Feature</h2>
        <form action={createFeatureWithAppId} className="flex flex-col gap-4 max-w-sm">
          <input
            type="text"
            name="name"
            placeholder="Feature Name"
            className="p-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            placeholder="Feature Description"
            className="p-2 border rounded-md"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
            Create Feature
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {app.features.map((feature) => (
          <div key={feature.id} className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold">{feature.name}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}