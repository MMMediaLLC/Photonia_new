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
    const sigBuf = Buffer.from(signature);
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

  const buyerEmail = String(
    attributes.user_email ?? customData.buyer_email ?? ""
  );
  const lsOrderId = String(dataObj.id ?? "");
  const total = Number(attributes.total ?? 0) / 100;

  // Parse custom fields (always strings now, but tolerate arrays)
  const parseList = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(String).filter(Boolean);
    if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  };
  const photoIds = parseList(customData.photo_ids);
  const licenses = parseList(customData.licenses);

  console.log("[LS webhook]", { lsOrderId, buyerEmail, total, photoIds, licenses });

  // Idempotency — if we've already processed this LS order, return OK
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("ls_order_id", lsOrderId)
    .maybeSingle();

  if (existing) {
    console.log("[LS webhook] Order already processed:", lsOrderId);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Lookup buyer (optional — may not have account)
  const { data: buyerUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", buyerEmail)
    .maybeSingle();

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: buyerUser?.id ?? null,
      buyer_email: buyerEmail,
      ls_order_id: lsOrderId,
      status: "paid",
      total,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("[LS webhook] Order insert failed:", orderError);
    return NextResponse.json(
      { error: "Order creation failed", details: orderError?.message },
      { status: 500 }
    );
  }

  // Fetch photos + their galleries in batch (no embedded profiles join!)
  let photos: Array<{
    id: string;
    gallery_id: string;
    price_personal: number;
    price_commercial: number;
    price_extended: number;
  }> = [];

  if (photoIds.length) {
    const { data, error } = await supabase
      .from("photos")
      .select("id, gallery_id, price_personal, price_commercial, price_extended")
      .in("id", photoIds);
    if (error) {
      console.error("[LS webhook] Photos fetch failed:", error);
    }
    photos = data ?? [];
  }

  // Fetch gallery → photographer mapping
  const galleryIds = [...new Set(photos.map((p) => p.gallery_id))];
  const { data: galleries } = galleryIds.length
    ? await supabase
        .from("galleries")
        .select("id, photographer_id")
        .in("id", galleryIds)
    : { data: [] as { id: string; photographer_id: string }[] };

  // Fetch commission rates per photographer (separate query — no embed)
  const photographerIds = [...new Set((galleries ?? []).map((g) => g.photographer_id))];
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
  const items = photoIds
    .map((photoId, i) => {
      const photo = photos.find((p) => p.id === photoId);
      if (!photo) return null;
      const license = licenses[i] ?? "personal";
      const price =
        license === "commercial"
          ? photo.price_commercial
          : license === "extended"
          ? photo.price_extended
          : photo.price_personal;
      const rate = commissionForPhoto(photoId);
      const photographerAmount = price * rate;
      const platformAmount = price - photographerAmount;
      return {
        order_id: order.id,
        photo_id: photoId,
        license,
        price,
        photographer_amount: photographerAmount,
        platform_amount: platformAmount,
        download_token: generateToken(48),
        download_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      };
    })
    .filter(Boolean);

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
  } else {
    console.warn("[LS webhook] No items to create for order", order.id);
  }

  // Send buyer email — only if Resend is configured. Best-effort, never fail webhook.
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey !== "your_resend_api_key" && buyerEmail) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://photonia-new.vercel.app";
      // Use Resend's default sender until photonia.mk is verified in Resend → Domains
      const fromAddress = process.env.RESEND_FROM ?? "Photonia <onboarding@resend.dev>";
      await resend.emails.send({
        from: fromAddress,
        to: buyerEmail,
        subject: "Твоите фотографии се подготвени за преземање",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
            <h2 style="color:#e8c97e;">Благодарам за нарачката! 🎉</h2>
            <p>Твоите фотографии се подготвени за преземање.</p>
            <p style="margin:24px 0;">
              <a href="${siteUrl}/account/downloads"
                 style="display:inline-block;background:#e8c97e;color:#0a0a0a;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;">
                Оди на Мои преземања
              </a>
            </p>
            <p style="color:#666;font-size:13px;">Линковите за преземање важат <strong>48 часа</strong> и можат да се употребат <strong>максимум 3 пати</strong>.</p>
            <p style="color:#999;font-size:12px;margin-top:32px;">Photonia — Македонски Фото Пазар</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("[LS webhook] Email send failed (non-fatal):", err);
    }
  } else {
    console.log("[LS webhook] Resend not configured, skipping email");
  }

  return NextResponse.json({
    received: true,
    order_id: order.id,
    items: items.length,
  });
}
