import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold">
            Pricing Plan SaaS
          </Link>
          <Link href="/pricing" className="text-sm">
            Pricing
          </Link>
          <Link href="/analytics" className="text-sm">
            Analytics
          </Link>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}