import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { generateToken } from "@/lib/utils";
import { Resend } from "resend";

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventName = payload.meta?.event_name;

  if (eventName !== "order_created") {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();
  const attributes = payload.data?.attributes ?? {};
  const meta = payload.meta?.custom_data ?? {};

  const buyerEmail: string = attributes.user_email ?? meta.buyer_email ?? "";
  const lsOrderId: string = String(payload.data?.id ?? "");
  const total: number = (attributes.total ?? 0) / 100;

  // Custom fields come back as strings from LS — split back into arrays.
  // Tolerate both string (current format) and array (legacy) shapes.
  const photoIds: string[] = Array.isArray(meta.photo_ids)
    ? meta.photo_ids
    : typeof meta.photo_ids === "string"
    ? meta.photo_ids.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];
  const licenses: string[] = Array.isArray(meta.licenses)
    ? meta.licenses
    : typeof meta.licenses === "string"
    ? meta.licenses.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  // Lookup buyer
  const { data: buyerUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", buyerEmail)
    .single();

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
    console.error("Order creation failed", orderError);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }

  // Create order items
  for (let i = 0; i < photoIds.length; i++) {
    const photoId = photoIds[i];
    const license = licenses[i] ?? "personal";

    const { data: photo } = await supabase
      .from("photos")
      .select("*, galleries(photographer_id, photographer_profiles(commission_rate))")
      .eq("id", photoId)
      .single();

    if (!photo) continue;

    const price =
      license === "commercial"
        ? photo.price_commercial
        : license === "extended"
        ? photo.price_extended
        : photo.price_personal;

    const photoData = photo as typeof photo & {
      galleries?: { photographer_profiles?: { commission_rate?: number } };
    };
    const commissionRate =
      photoData.galleries?.photographer_profiles?.commission_rate ?? 0.8;
    const photographerAmount = price * commissionRate;
    const platformAmount = price - photographerAmount;

    await supabase.from("order_items").insert({
      order_id: order.id,
      photo_id: photoId,
      license,
      price,
      photographer_amount: photographerAmount,
      platform_amount: platformAmount,
      download_token: generateToken(48),
      download_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    });
  }

  // Send buyer email
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  await resend.emails.send({
    from: "Photonia <noreply@photonia.mk>",
    to: buyerEmail,
    subject: "Твоите фотографии се подготвени за преземање",
    html: `
      <h2>Благодарам за нарачката!</h2>
      <p>Твоите фотографии се подготвени. Оди на <a href="${siteUrl}/account/downloads">Мои преземања</a> за да ги преземеш.</p>
      <p>Линковите за преземање важат 48 часа и можат да се употребат максимум 3 пати.</p>
    `,
  });

  return NextResponse.json({ received: true });
}
