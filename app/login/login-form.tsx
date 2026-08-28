"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminLogo } from "@/components/admin/admin-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Invalid password");
      return;
    }

    router.push(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aura -left-20 top-20 h-[28rem] w-[28rem]" />
        <div className="aura right-[-10%] bottom-0 h-[24rem] w-[24rem]" />
      </div>

      <Card className="relative z-10 w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-soft)] p-1.5 text-[var(--accent)]">
            <AdminLogo variant="full" />
          </div>
          <CardTitle className="text-2xl">Noirly Admin</CardTitle>
          <CardDescription>
            Manage your portfolio content, projects, and media.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoFocus
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
