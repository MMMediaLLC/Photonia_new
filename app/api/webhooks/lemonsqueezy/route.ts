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

  // Resolve buyer_id — prefer explicit user_id, fallback to auth email lookup
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
      console.error("[LS webhook] No auth user found for email:", buyerEmail);
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

  // Fetch photos
  let photos: Array<{
    id: string;
    gallery_id: string;
    price_personal: number;
    price_commercial: number;
  }> = [];
  if (photoIds.length) {
    const { data, error } = await supabase
      .from("photos")
      .select("id, gallery_id, price_personal, price_commercial")
      .in("id", photoIds);
    if (error) console.error("[LS webhook] Photos fetch failed:", error);
    photos = data ?? [];
  }

  // Fetch gallery → photographer mapping
  const galleryIds = Array.from(new Set(photos.map((p) => p.gallery_id)));
  const { data: galleries } = galleryIds.length
    ? await supabase.from("galleries").select("id, photographer_id").in("id", galleryIds)
    : { data: [] as { id: string; photographer_id: string }[] };

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

  // Send simple order confirmation email (no magic link — buyer is already logged in)
  const resendKey = process.env.RESEND_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://photonia.mk";

  if (resendKey && resendKey !== "your_resend_api_key" && buyerEmail) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const fromAddress = process.env.RESEND_FROM ?? "Photonia <onboarding@resend.dev>";

      await resend.emails.send({
        from: fromAddress,
        to: buyerEmail,
        subject: "Нарачката е успешна — Твоите фотографии те чекаат",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff;color:#222;">
            <h2 style="color:#0a0a0a;">Благодарам за нарачката! 🎉</h2>
            <p>Твоите фотографии се подготвени за преземање и се достапни во твојот профил.</p>
            <p style="margin:28px 0;">
              <a href="${siteUrl}/account/downloads"
                 style="display:inline-block;background:#e8c97e;color:#0a0a0a;font-weight:bold;padding:14px 28px;border-radius:8px;text-decoration:none;">
                📥 Преземи ги фотографиите
              </a>
            </p>
            <p style="color:#666;font-size:13px;line-height:1.5;">
              Фотографиите се <strong>постојано достапни</strong> во твојот профил на Photonia.
              HD резолуција, без watermark.
            </p>
            <hr style="border:0;border-top:1px solid #eee;margin:32px 0 16px;" />
            <p style="color:#999;font-size:12px;">
              Photonia — Македонски Фото Пазар<br/>
              Ако имаш прашања, контактирај не на info@photonia.mk
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.error("[LS webhook] Email send failed (non-fatal):", err);
    }
  } else {
    console.log("[LS webhook] Resend not configured, skipping email");
  }

  return NextResponse.json({ received: true, order_id: order.id, items: items.length });
}
