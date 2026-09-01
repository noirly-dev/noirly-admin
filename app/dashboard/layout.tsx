import { MobileNav } from "@/components/admin/mobile-nav";
import { AdminSidebar } from "@/components/admin/sidebar";
import { PageContainer, SHELL_GUTTER_CLASS } from "@noirly-dev/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--hairline)] bg-[var(--bg)]/80 backdrop-blur-xl lg:hidden">
          <div className={SHELL_GUTTER_CLASS}>
            <div className="flex items-center gap-3 py-4">
              <MobileNav />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
