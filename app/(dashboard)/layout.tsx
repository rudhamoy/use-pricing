import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Pricing Plan SaaS</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}