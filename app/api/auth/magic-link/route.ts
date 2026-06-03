import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Sends a magic link to the given email. Used when a buyer requests
 * to resend their access link (e.g. lost original email).
 *
 * Body: { email: string, next?: string }
 */
export async function POST(req: NextRequest) {
  const { email, next } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email е задолжителен" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Check if user with this email exists in our users table
  const { data: userRow } = await admin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!userRow) {
    // Don't reveal whether the email is in our system (security best practice)
    return NextResponse.json({ ok: true });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : new URL(req.url).origin;

  // Generate a magic link, but DON'T use the returned action_link — it routes
  // through Supabase's verify endpoint which redirects with an implicit
  // (#access_token) fragment that the server can't read. Instead we take the
  // hashed_token and build our own link to /auth/callback, where the server
  // calls verifyOtp({ token_hash }) and sets cookies. This is the
  // @supabase/ssr-recommended pattern for custom email templates.
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  const hashedToken = linkData?.properties?.hashed_token;
  if (linkError || !hashedToken) {
    console.error("[magic-link] generate failed:", linkError?.message);
    return NextResponse.json({ error: "Не може да се генерира линк" }, { status: 500 });
  }

  const nextPath = next ?? "/account/downloads";
  const actionLink =
    `${siteUrl}/auth/callback` +
    `?token_hash=${encodeURIComponent(hashedToken)}` +
    `&type=magiclink` +
    `&next=${encodeURIComponent(nextPath)}`;

  // Send via Resend if available
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey !== "your_resend_api_key") {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const fromAddress = process.env.RESEND_FROM ?? "Photonia <onboarding@resend.dev>";
      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "Твојот линк за пристап на Photonia",
        html: magicLinkEmailHtml(actionLink),
      });
    } catch (err) {
      console.error("[magic-link] email send failed:", err);
      return NextResponse.json({ error: "Email испраќањето падна" }, { status: 500 });
    }
  } else {
    console.warn("[magic-link] Resend not configured — link not sent");
  }

  return NextResponse.json({ ok: true });
}

function magicLinkEmailHtml(actionLink: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff;color:#222;">
      <h2 style="color:#0a0a0a;">Линк за пристап на Photonia</h2>
      <p>Кликни на копчето подолу за автоматска најава.</p>
      <p style="margin:24px 0;">
        <a href="${actionLink}"
           style="display:inline-block;background:#e8c97e;color:#0a0a0a;font-weight:bold;padding:14px 28px;border-radius:8px;text-decoration:none;">
          🔑 Најави се
        </a>
      </p>
      <p style="color:#666;font-size:13px;">Линкот важи 1 час. Ако не си побарал најава, игнорирај го овој email.</p>
      <p style="color:#999;font-size:12px;margin-top:32px;">Photonia — Македонски Фото Пазар</p>
    </div>
  `;
}
