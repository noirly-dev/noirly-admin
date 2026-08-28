import { AdminSidebar } from "@/components/admin/sidebar";

const shellClass = "mx-auto w-full max-w-6xl px-6 sm:px-8";

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
            <div className="py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Portfolio CMS
              </p>
              <h1 className="font-display mt-1 text-xl font-semibold tracking-tight">
                Content Studio
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto py-8">
          <div className={shellClass}>{children}</div>
        </main>
      </div>
    </div>
  );
}
