import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    const client = await prisma.client.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    });

    if (client) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Pricing Plan SaaS</h1>
      <p className="text-lg mb-8">
        Create and manage your pricing plans with ease.
      </p>
      <div className="flex gap-4">
        <Link href="/sign-in" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Sign In
        </Link>
        <Link href="/sign-up" className="px-4 py-2 bg-green-500 text-white rounded-md">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
