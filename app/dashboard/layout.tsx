import { MobileNav } from "@/components/admin/mobile-nav";
import { AdminSidebar } from "@/components/admin/sidebar";

const shellClass = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--hairline)] bg-[var(--bg)]/80 backdrop-blur-xl">
          <div className={shellClass}>
            <div className="flex items-center gap-3 py-4 sm:py-5">
              <MobileNav />
              <div className="min-w-0">
                <p className="hidden text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] lg:block">
                  Portfolio CMS
                </p>
                <h1 className="font-display truncate text-lg font-semibold tracking-tight lg:mt-1 lg:text-xl">
                  Content Studio
                </h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto py-6 sm:py-8">
          <div className={shellClass}>{children}</div>
        </main>
      </div>
    </div>
  );
}
