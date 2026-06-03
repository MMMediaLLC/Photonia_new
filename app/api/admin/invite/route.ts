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
      subject: "Покана за фотограф на Photonia.mk",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;color:#222;">
          <h2 style="color:#0a0a0a;margin:0 0 12px;">Добредојдовте во Photonia! 📷</h2>
          <p style="margin:0 0 18px;color:#444;line-height:1.6;">
            Поканети сте да се придружите како <strong>фотограф</strong> на
            <a href="https://photonia.mk" style="color:#a07b1f;">photonia.mk</a> —
            македонски пазар за фотографии од настани, спорт, култура и јавни случувања.
          </p>

          <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:16px;margin:0 0 18px;">
            <p style="margin:0 0 10px;font-weight:600;color:#0a0a0a;font-size:14px;">Што добивате</p>
            <ul style="margin:0;padding-left:18px;color:#444;font-size:13px;line-height:1.7;">
              <li>Сопствен профил со ваши галерии и продажби</li>
              <li><strong>80% од секоја продажба</strong> (платформата задржува 20%)</li>
              <li>Контрола на цените за Лична и Комерцијална лиценца</li>
              <li>Месечни исплати на крајот од секој месец</li>
              <li>Авторските права остануваат ваши</li>
            </ul>
          </div>

          <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:16px;margin:0 0 24px;">
            <p style="margin:0 0 10px;font-weight:600;color:#0a0a0a;font-size:14px;">Што се очекува</p>
            <ul style="margin:0;padding-left:18px;color:#444;font-size:13px;line-height:1.7;">
              <li>Оригинални фотографии во висока резолуција (мин. 4000 пиксели)</li>
              <li>Почитување на Editorial Only ознаката за препознатливи лица</li>
              <li>Согласност со Условите за користење и Лиценцните услови</li>
            </ul>
          </div>

          <p style="margin:0 0 14px;color:#444;">
            Активирајте го профилот со едно кликнување — поканата важи <strong>7 дена</strong>:
          </p>

          <p style="margin:0 0 16px;">
            <a href="${inviteUrl}"
               style="display:inline-block;background:#e8c97e;color:#0a0a0a;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">
              Активирај профил →
            </a>
          </p>

          <p style="color:#888;font-size:12px;line-height:1.6;margin:0 0 8px;">
            Ако копчето не работи, копирајте го овој линк во прелистувачот:<br/>
            <span style="word-break:break-all;color:#666;">${inviteUrl}</span>
          </p>

          <hr style="border:0;border-top:1px solid #eee;margin:24px 0 16px;" />
          <p style="color:#999;font-size:12px;line-height:1.7;">
            <strong>Photonia.mk</strong> — Платформа за дигитални фотографии<br/>
            Прашања: <a href="mailto:info@photonia.mk" style="color:#888;">info@photonia.mk</a><br/>
            Издавач: M&amp;M Media
          </p>
        </div>
      `,
    });
  } catch {
    // email sending is best-effort
  }

  return NextResponse.json({ invite });
}
