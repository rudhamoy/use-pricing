import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">
              Pricing Plan SaaS
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-grow p-8">{children}</main>
      </div>
    </div>
  );
}