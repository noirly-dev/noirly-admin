import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  createSession,
  setSessionCookie,
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid credentials", 400);
    }

    if (!verifyPassword(parsed.data.password)) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = await createSession();
    await setSessionCookie(token);
    return jsonResponse({ ok: true });
  } catch {
    return errorResponse("Login failed", 500);
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return jsonResponse({ ok: true });
}
