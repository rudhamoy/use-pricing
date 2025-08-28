"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package2,
  PanelLeft,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/useSidebar";

export default function CollapsibleSidebar({
  isOpen,
}: {
  isOpen: boolean;
}) {
  const pathname = usePathname();
  const links = useSidebar();

  return (
    <div
      className={`relative ${
        isOpen ? "sm:w-64" : "sm:w-16"
      } sm:bg-gray-100/40 sm:dark:bg-gray-800/40 transition-all duration-300`}
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="default" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-2.5 ${
                  link.isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="hidden sm:flex sm:flex-col sm:h-full sm:border-r sm:bg-gray-100/40 sm:dark:bg-gray-800/40">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link
            href="#"
            className="flex items-center gap-2 font-semibold"
          >
            <Package2 className="h-6 w-6" />
            {isOpen && <span className="">Acme Inc</span>}
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  link.isActive
                    ? "text-primary bg-green-200"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {isOpen && link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}