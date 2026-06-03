import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { generateToken } from "@/lib/utils";

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(body).digest("hex");
    // Normalise to lowercase so uppercase hex from LS doesn't cause a mismatch
    const sigBuf = Buffer.from(signature.toLowerCase());
    const digestBuf = Buffer.from(digest);
    if (sigBuf.length !== digestBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, digestBuf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifySignature(body, signature)) {
    console.error("[LS webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const meta = (payload.meta as Record<string, unknown>) ?? {};
  const eventName = meta.event_name as string | undefined;
  if (eventName !== "order_created") {
    return NextResponse.json({ received: true, skipped: eventName });
  }

  const supabase = createAdminClient();
  const dataObj = (payload.data as Record<string, unknown>) ?? {};
  const attributes = (dataObj.attributes as Record<string, unknown>) ?? {};
  const customData = (meta.custom_data as Record<string, unknown>) ?? {};

  const buyerEmail = String(attributes.user_email ?? customData.buyer_email ?? "");
  const lsOrderId = String(dataObj.id ?? "");
  const total = Number(attributes.total ?? 0) / 100;

  // user_id is passed from /api/checkout — buyer was logged in at checkout
  const userId = customData.user_id as string | undefined;

  const parseList = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(String).filter(Boolean);
    if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  };
  const photoIds = parseList(customData.photo_ids);
  const licenses = parseList(customData.licenses);

  console.log("[LS webhook]", { lsOrderId, buyerEmail, userId, total, photoIds, licenses });

  // Resolve buyer_id — prefer explicit user_id, fallback to auth email lookup,
  // and finally AUTO-CREATE the auth user so guest checkouts get a real account.
  let buyerId: string | null = userId ?? null;
  if (!buyerId && buyerEmail) {
    console.warn("[LS webhook] No user_id in custom_data, trying auth email lookup for:", buyerEmail);
    try {
      const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const found = authUsers.find((u) => u.email === buyerEmail);
      buyerId = found?.id ?? null;
    } catch (err) {
      console.error("[LS webhook] Auth user lookup failed:", err);
    }

    if (!buyerId) {
      console.log("[LS webhook] No existing auth user — auto-creating for:", buyerEmail);
      try {
        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email: buyerEmail,
          email_confirm: true, // skip confirmation — buyer has already paid
          user_metadata: { role: "buyer", auto_created: true },
        });
        if (createErr) {
          console.error("[LS webhook] Auto-create user failed:", createErr.message);
        } else if (created?.user?.id) {
          buyerId = created.user.id;
          console.log("[LS webhook] Auto-created buyer:", buyerId);
        }
      } catch (err) {
        console.error("[LS webhook] Auto-create user threw:", err);
      }
    }
  }

  // Upsert order
  let order: { id: string } | null = null;
  {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        buyer_id: buyerId,
        buyer_email: buyerEmail,
        ls_order_id: lsOrderId,
        status: "paid",
        total,
      })
      .select("id")
      .single();

    if (data) {
      order = data;
    } else if (error) {
      if (error.code === "23505") {
        console.log("[LS webhook] Order already exists, fetching:", lsOrderId);
        const { data: existing } = await supabase
          .from("orders")
          .select("id")
          .eq("ls_order_id", lsOrderId)
          .maybeSingle();
        order = existing;
      } else {
        console.error("[LS webhook] Order insert failed:", error);
        return NextResponse.json(
          { error: "Order creation failed", details: error.message, code: error.code },
          { status: 500 }
        );
      }
    }
  }

  if (!order) {
    console.error("[LS webhook] Could not insert or fetch order:", lsOrderId);
    return NextResponse.json({ error: "Order not available" }, { status: 500 });
  }

  // Idempotency check
  const { data: existingItems } = await supabase
    .from("order_items")
    .select("id")
    .eq("order_id", order.id)
    .limit(1);

  if (existingItems && existingItems.length > 0) {
    console.log("[LS webhook] Items already created, skipping:", order.id);
    return NextResponse.json({ received: true, duplicate: true, order_id: order.id });
  }

  // Fetch photos (including title for the email rendering)
  let photos: Array<{
    id: string;
    gallery_id: string;
    title: string | null;
    price_personal: number;
    price_commercial: number;
  }> = [];
  if (photoIds.length) {
    const { data, error } = await supabase
      .from("photos")
      .select("id, gallery_id, title, price_personal, price_commercial")
      .in("id", photoIds);
    if (error) console.error("[LS webhook] Photos fetch failed:", error);
    photos = data ?? [];
  }

  // Fetch gallery → photographer mapping + gallery title for the email
  const galleryIds = Array.from(new Set(photos.map((p) => p.gallery_id)));
  const { data: galleries } = galleryIds.length
    ? await supabase
        .from("galleries")
        .select("id, title, photographer_id")
        .in("id", galleryIds)
    : { data: [] as { id: string; title: string; photographer_id: string }[] };

  // Fetch commission rates
  const photographerIds = Array.from(new Set((galleries ?? []).map((g) => g.photographer_id)));
  const { data: profiles } = photographerIds.length
    ? await supabase
        .from("photographer_profiles")
        .select("user_id, commission_rate")
        .in("user_id", photographerIds)
    : { data: [] as { user_id: string; commission_rate: number }[] };

  function commissionForPhoto(photoId: string): number {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return 0.8;
    const gallery = (galleries ?? []).find((g) => g.id === photo.gallery_id);
    if (!gallery) return 0.8;
    const profile = (profiles ?? []).find((p) => p.user_id === gallery.photographer_id);
    return profile?.commission_rate ?? 0.8;
  }

  // Build order_items
  type OrderItemInsert = {
    order_id: string;
    photo_id: string;
    license: string;
    price: number;
    photographer_amount: number;
    platform_amount: number;
    download_token: string;
    download_expires_at: string;
  };

  const items: OrderItemInsert[] = [];
  for (let i = 0; i < photoIds.length; i++) {
    const photoId = photoIds[i];
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) continue;
    const license = licenses[i] ?? "personal";
    const price = license === "commercial" ? photo.price_commercial : photo.price_personal;
    const rate = commissionForPhoto(photoId);
    items.push({
      order_id: order.id,
      photo_id: photoId,
      license,
      price,
      photographer_amount: price * rate,
      platform_amount: price * (1 - rate),
      download_token: generateToken(48),
      // Downloads do not expire — buyer always has access in their profile
      download_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  if (items.length) {
    const { error: itemsError } = await supabase.from("order_items").insert(items);
    if (itemsError) {
      console.error("[LS webhook] order_items insert failed:", itemsError);
      return NextResponse.json(
        { error: "Items insert failed", details: itemsError.message },
        { status: 500 }
      );
    }
    console.log(`[LS webhook] Created ${items.length} order_items for order ${order.id}`);
  }

  // Send buyer email with direct download links per photo.
  // Primary access path — buyer can download without ever logging in.
  const resendKey = process.env.RESEND_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://photonia.mk";

  if (resendKey && resendKey !== "your_resend_api_key" && buyerEmail && items.length) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const fromAddress = process.env.RESEND_FROM ?? "Photonia <onboarding@resend.dev>";

      // Build per-item rows with photo title + gallery title when available.
      const escape = (s: string) =>
        s.replace(/[&<>"']/g, (c) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
        );

      const downloadRows = items
        .map((item, idx) => {
          const photo = photos.find((p) => p.id === item.photo_id);
          const gallery = (galleries ?? []).find((g) => g.id === photo?.gallery_id);
          const photoTitle = photo?.title?.trim() || `Фотографија ${idx + 1}`;
          const galleryTitle = gallery?.title?.trim() ?? "";
          const licenseLabel = item.license === "commercial" ? "Комерцијална" : "Лична";
          const url = `${siteUrl}/api/downloads/${item.download_token}`;

          return `
            <tr>
              <td style="padding:14px 0;border-bottom:1px solid #eee;font-size:14px;color:#222;">
                <div style="font-weight:600;color:#0a0a0a;">📷 ${escape(photoTitle)}</div>
                ${
                  galleryTitle
                    ? `<div style="color:#888;font-size:12px;margin-top:2px;">${escape(galleryTitle)} · ${licenseLabel} лиценца</div>`
                    : `<div style="color:#888;font-size:12px;margin-top:2px;">${licenseLabel} лиценца</div>`
                }
              </td>
              <td style="padding:14px 0;border-bottom:1px solid #eee;text-align:right;vertical-align:middle;">
                <a href="${url}"
                   style="display:inline-block;background:#e8c97e;color:#0a0a0a;font-weight:600;padding:9px 18px;border-radius:6px;text-decoration:none;font-size:13px;">
                  Преземи
                </a>
              </td>
            </tr>
          `;
        })
        .join("");

      const purchaseDate = new Date().toLocaleString("mk-MK", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const orderRef = lsOrderId || order.id.slice(0, 8);

      await resend.emails.send({
        from: fromAddress,
        to: buyerEmail,
        subject: "Твоите фотографии се подготвени за преземање",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;color:#222;">
            <h2 style="color:#0a0a0a;margin:0 0 6px;">Благодариме за нарачката! 🎉</h2>
            <p style="margin:0 0 18px;color:#888;font-size:13px;">
              Нарачка <strong style="color:#444;">#${escape(orderRef)}</strong> · ${escape(purchaseDate)}
            </p>

            <p style="margin:0 0 20px;color:#444;line-height:1.6;">
              Твоите фотографии се подготвени за преземање. Линковите важат
              <strong>една година</strong> и можеш да ги отвораш до <strong>два пати</strong>
              по фотографија.
            </p>

            <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;">
              ${downloadRows}
            </table>

            <div style="background:#fffbe8;border:1px solid #f5dd6c;border-radius:8px;padding:14px;margin:24px 0 8px;font-size:13px;color:#665100;line-height:1.5;">
              💡 <strong>Совет:</strong> Зачувај го мејлот или преземи ги фотографиите веднаш.
              Лимитот е <strong>2 преземања</strong> по фотографија.
            </div>

            <hr style="border:0;border-top:1px solid #eee;margin:24px 0 16px;" />
            <p style="color:#999;font-size:12px;line-height:1.7;">
              <strong>Photonia</strong> — Платформа за дигитални фотографии<br/>
              За технички проблем или повторно преземање:
              <a href="mailto:support@photonia.mk" style="color:#888;">support@photonia.mk</a><br/>
              Реф. бр. за поддршка: <strong>#${escape(orderRef)}</strong>
            </p>
          </div>
        `,
      });
      console.log(`[LS webhook] Sent download email to ${buyerEmail} (${items.length} items, order #${orderRef})`);
    } catch (err) {
      console.error("[LS webhook] Email send failed (non-fatal):", err);
    }
  } else {
    console.log("[LS webhook] Resend not configured or no items — skipping email");
  }

  return NextResponse.json({ received: true, order_id: order.id, items: items.length });
}
