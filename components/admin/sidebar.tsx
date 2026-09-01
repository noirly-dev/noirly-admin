"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { AdminLogo } from "@/components/admin/admin-logo";
import { isNavItemActive, NAV_ITEMS } from "@/components/admin/nav-items";
import { cn } from "@/lib/utils";

export function SidebarBrand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] p-1 text-[var(--accent)] sm:h-16 sm:w-16">
        <AdminLogo />
      </div>
      <div>
        <p className="font-display text-sm font-semibold">Noirly Admin</p>
        <p className="text-xs text-[var(--muted-foreground)]">Portfolio CMS</p>
      </div>
    </div>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
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
    <aside className="sticky top-0 hidden h-dvh min-h-dvh w-[260px] shrink-0 flex-col border-r border-[var(--hairline)] bg-[var(--surface)]/80 backdrop-blur-xl lg:flex">
      <div className="border-b border-[var(--hairline)] p-6">
        <SidebarBrand />
      </div>

      <SidebarNav />

      <div className="mt-auto p-4">
        <SignOutButton />
      </div>
    </aside>
  );
}
