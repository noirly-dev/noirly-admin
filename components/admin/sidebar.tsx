"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Palette,
  UserRound,
  Wrench,
} from "lucide-react";
import { AdminLogo } from "@/components/admin/admin-logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/skills", label: "Skills", icon: Wrench },
  { href: "/dashboard/theme", label: "Theme", icon: Palette },
];

export function AdminSidebar() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/login";
  }

  return (
    <aside className="sticky top-0 flex h-dvh min-h-dvh w-[260px] shrink-0 flex-col border-r border-[var(--hairline)] bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="border-b border-[var(--hairline)] p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] p-1 text-[var(--accent)]">
            <AdminLogo />
          </div>
          <div>
            <p className="font-display text-sm font-semibold">Noirly Admin</p>
            <p className="text-xs text-[var(--muted-foreground)]">Portfolio CMS</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
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

      <div className="mt-auto p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
