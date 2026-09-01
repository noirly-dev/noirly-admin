"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import {
  AdminSidebarBrand,
  SidebarNav,
  SignOutButton,
} from "@/components/admin/sidebar";

/** Matches the `lg` breakpoint where the persistent sidebar takes over. */
const DESKTOP_QUERY = "(min-width: 1024px)";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close after navigating to another section — including via browser history,
  // where the link's own onClick never fires.
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    if (open) setOpen(false);
  }

  // The drawer is hidden at `lg`; close it there so the scroll lock is released too.
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open navigation"
        className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--hairline)] bg-[var(--surface)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
      >
        <Menu size={18} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(17rem,85vw)] flex-col border-r border-[var(--hairline)] bg-[var(--surface)] shadow-[var(--elev-2)] duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:hidden">
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Jump to a section of the Noirly content studio.
          </Dialog.Description>

          <div className="flex items-start justify-between gap-3 border-b border-[var(--hairline)] px-4 py-4">
            <AdminSidebarBrand />
            <Dialog.Close
              aria-label="Close navigation"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>

          <div className="border-t border-[var(--hairline)] px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <SignOutButton />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
