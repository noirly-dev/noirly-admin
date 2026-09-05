"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  AppSidebar,
  SidebarBrand as UISidebarBrand,
  type AppNavItem,
  cn,
} from "@noirly-dev/ui";
import { AdminLogo } from "@/components/admin/admin-logo";
import { isNavItemActive, NAV_ITEMS } from "@/components/admin/nav-items";
import { ThemeControls } from "@/components/ThemeControls";

const SIDEBAR_ITEMS: AppNavItem[] = NAV_ITEMS.map(({ href, label, icon }) => ({
  href,
  label,
  icon: icon as AppNavItem["icon"],
  match: href === "/dashboard" ? "exact" : "prefix",
}));

export function AdminSidebarBrand({ className }: { className?: string }) {
  return (
    <UISidebarBrand
      className={className}
      logo={<AdminLogo />}
      title="Noirly Admin"
      subtitle="Portfolio CMS"
    />
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isNavItemActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors sm:py-2.5",
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]",
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] sm:py-2.5",
        className,
      )}
    >
      <LogOut size={16} />
      Sign out
    </button>
  );
}

export function AdminSidebar() {
  return (
    <AppSidebar
      className="sticky top-0 hidden lg:flex"
      brand={<AdminSidebarBrand />}
      items={SIDEBAR_ITEMS}
      footer={
        <div className="space-y-3">
          <ThemeControls size="sm" />
          <SignOutButton />
        </div>
      }
    />
  );
}
