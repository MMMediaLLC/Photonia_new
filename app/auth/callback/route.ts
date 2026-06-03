import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Server-side auth callback. Establishes a cookie-backed session so the
 * @supabase/ssr middleware sees the user on the very next request.
 *
 * Two supported entry shapes, both server-readable (no URL fragment):
 *   1. Magic link   → ?token_hash=…&type=magiclink   → verifyOtp
 *   2. Google OAuth → ?code=…                         → exchangeCodeForSession
 *
 * The legacy implicit flow (#access_token in the fragment) is intentionally
 * NOT handled — fragments never reach the server, which is exactly why the
 * old client callback hung on "Најавување…".
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;
  const next = searchParams.get("next") || "/dashboard";

  // Build an absolute redirect target on our own origin.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : origin;
  const dest = (path: string) => new URL(path, siteUrl).toString();

  const supabase = createClient();

  // ── Magic link (token_hash) ─────────────────────────────────────────
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      console.error("[auth/callback] verifyOtp failed:", error.message);
      return NextResponse.redirect(dest("/login?error=link_invalid"));
    }
    return NextResponse.redirect(dest(next));
  }

  // ── OAuth / PKCE (code) ─────────────────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(dest("/login?error=link_invalid"));
    }
    return NextResponse.redirect(dest(next));
  }

  // Nothing usable in the query string.
  console.warn("[auth/callback] no code or token_hash in callback URL");
  return NextResponse.redirect(dest("/login?error=link_invalid"));
}
