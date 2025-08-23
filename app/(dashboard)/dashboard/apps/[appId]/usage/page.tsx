import prisma from "@/lib/prisma";

export default async function UsagePage({
  params,
}: {
  params: { appId: string };
}) {
  const app = await prisma.clientApp.findUnique({
    where: { id: params.appId },
    include: {
      users: {
        include: {
          usage: true,
        },
      },
    },
  });

  if (!app) {
    return <div>App not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usage for {app.name}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Unit Type</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {app.users.map((user) =>
              user.usage.map((record) => (
                <tr key={record.id}>
                  <td className="py-2 px-4 border-b">{user.externalId}</td>
                  <td className="py-2 px-4 border-b">{record.unitType}</td>
                  <td className="py-2 px-4 border-b">{record.amount}</td>
                  <td className="py-2 px-4 border-b">
                    {record.recordedAt.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}