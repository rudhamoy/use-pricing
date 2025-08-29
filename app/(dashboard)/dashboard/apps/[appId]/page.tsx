import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Activity,
  CreditCard,
} from "lucide-react";

export default async function AppDetailsPage({
  params,
}: {
  params: { appId: string };
}) {
  const app = await prisma.clientApp.findUnique({
    where: { id: params.appId },
    include: {
      users: {
        include: {
          subscriptions: true,
          usage: true,
        },
      },
    },
  });

  if (!app) {
    return <div>App not found</div>;
  }

  const totalUsers = app.users.length;
  const activeSubscriptions = app.users.reduce(
    (acc, user) =>
      acc + user.subscriptions.filter((s) => s.status === "active").length,
    0
  );
  const mrr = app.users.reduce((acc, user) => {
    const activeSubscription = user.subscriptions.find(
      (s) => s.status === "active"
    );
    if (activeSubscription) {
      // This is a simplified MRR calculation. A real-world implementation
      // would need to be more sophisticated.
      // @ts-ignore
      return acc + (activeSubscription.plan?.baseFee || 0);
    }
    return acc;
  }, 0);

  const recentUsage = app.users
    .flatMap((user) => user.usage)
    .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())
    .slice(0, 5);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeSubscriptions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Recurring Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${mrr.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Usage</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {recentUsage.reduce((acc, r) => acc + r.amount, 0)}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            A log of the most recent usage events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Unit Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsage.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {
                      app.users.find((u) =>
                        u.usage.some((r) => r.id === record.id)
                      )?.externalId
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.unitType}</Badge>
                  </TableCell>
                  <TableCell>{record.amount}</TableCell>
                  <TableCell>
                    {record.recordedAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Perform common actions quickly and easily.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Link href={`/dashboard/apps/${params.appId}/plans`}>
            <Button className="w-full">Create New Plan</Button>
          </Link>
          <Link href={`/dashboard/apps/${params.appId}/features`}>
            <Button className="w-full">Create New Feature</Button>
          </Link>
          <Link href={`/dashboard/apps/${params.appId}/api-keys`}>
            <Button className="w-full">View API Keys</Button>
          </Link>
          <Link href="/api-docs">
            <Button className="w-full">View Documentation</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}