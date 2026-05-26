import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateToken } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: userRow } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (userRow?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email e задолжителен" }, { status: 400 });

  const token = generateToken(32);
  const admin = createAdminClient();

  const { data: invite, error } = await admin
    .from("photographer_invites")
    .insert({ email, token })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${token}`;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "Photonia <onboarding@resend.dev>",
      to: email,
      subject: "Покана за фотограф на Photonia",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2>Добредојдовте во Photonia!</h2>
          <p>Поканети сте да се придружите како фотограф на платформата Photonia.mk.</p>
          <p>Кликнете на копчето подолу за да го активирате вашиот профил:</p>
          <a href="${inviteUrl}" style="display:inline-block;background:#e8c97e;color:#0a0a0a;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
            Активирај профил
          </a>
          <p style="color:#888;font-size:13px;">Или копирајте го овој линк: ${inviteUrl}</p>
          <p style="color:#888;font-size:12px;">Поканата важи 7 дена.</p>
        </div>
      `,
    });
  } catch {
    // email sending is best-effort
  }

  return NextResponse.json({ invite });
}
