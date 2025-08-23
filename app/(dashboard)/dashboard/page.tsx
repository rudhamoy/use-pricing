import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  const client = await prisma.client.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    include: { apps: true },
  });

  // if (!client) {
  //   return <div>Client not found</div>;
  // }

  if (!client) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No Applications Found</h1>
        <p className="mb-4">
          You haven't created any applications yet. Get started by creating your
          first one.
        </p>
        <Link
          href="/onboarding"
          className="px-4 py-2 bg-blue-500 text-blue-50 rounded-md"
        >
          Create Application
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {client.apps.map((app) => (
          <Link
            href={`/dashboard/apps/${app.id}`}
            key={app.id}
            className="p-4 border rounded-md hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{app.name}</h2>
            <p className="text-gray-500">{app.apiKey}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}