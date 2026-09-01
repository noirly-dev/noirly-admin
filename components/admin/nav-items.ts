import type { ComponentType } from "react";
import {
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  Palette,
  UserRound,
  Wrench,
} from "lucide-react";

type NavIcon = ComponentType<{ size?: number | string; className?: string }>;

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/skills", label: "Skills", icon: Wrench },
  { href: "/dashboard/theme", label: "Theme", icon: Palette },
];

export function isNavItemActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}
