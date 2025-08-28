"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { SheetTrigger, Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { SidebarProvider, useSidebarContext } from "@/components/SidebarProvider";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarContext();

  return (
    <div className="min-h-screen flex">
      <CollapsibleSidebar isOpen={isSidebarOpen} />
      <div className="flex-grow flex flex-col">
        <header className="bg-gray-100 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="default"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-grow p-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}