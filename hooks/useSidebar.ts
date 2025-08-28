import {
  Home,
  Package2,
  Settings,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { usePathname } from "next/navigation";

const mainLinks = [
  { href: "/dashboard", label: "Apps", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

const appLinks = [
  { href: "", label: "Overview", icon: Home },
  { href: "/features", label: "Features", icon: Package2 },
  { href: "/plans", label: "Plans", icon: FileText },
  { href: "/configure", label: "Configure", icon: Settings },
];

export function useSidebar() {
  const pathname = usePathname();

  if (pathname.includes("/apps/")) {
    const appId = pathname.split("/")[3];
    return appLinks.map((link) => ({
      ...link,
      href: `/dashboard/apps/${appId}${link.href}`,
      isActive: pathname === `/dashboard/apps/${appId}${link.href}`,
    }));
  }

  return mainLinks.map((link) => ({
    ...link,
    isActive: pathname === link.href,
  }));
}