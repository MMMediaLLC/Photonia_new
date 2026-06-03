import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Checkout endpoint — guest-friendly.
 * Auth is NOT required. Buyer either:
 *   1) is already logged in → we use the session email + user_id
 *   2) submits an `email` field as a guest → the webhook auto-creates the user
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { items, email: bodyEmail } = body as {
    items: { photoId: string; license: string; price: number }[];
    email?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  // Resolve buyer email — session takes precedence, else require it from body
  const email = (user?.email || bodyEmail || "").trim().toLowerCase();
  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json(
      { error: "Внеси валидна е-пошта за да продолжиш." },
      { status: 400 }
    );
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!storeId || !apiKey || !variantId) {
    return NextResponse.json(
      { error: "Payment not configured: missing LS env vars" },
      { status: 500 }
    );
  }

  const total = items.reduce((s, i) => s + i.price, 0);
  // LemonSqueezy expects custom_price in the smallest currency unit (deni)
  const totalInCents = Math.round(total * 100);

  const origin = req.headers.get("origin") || req.nextUrl.origin;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const isValidHttps = /^https:\/\//.test(siteUrl);
  const redirectUrl = isValidHttps ? `${siteUrl}/checkout/success` : undefined;

  const productOptions: Record<string, unknown> = {
    enabled_variants: [Number(variantId)],
  };
  if (redirectUrl) productOptions.redirect_url = redirectUrl;

  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        custom_price: totalInCents,
        product_options: productOptions,
        checkout_options: {
          button_color: "#e8c97e",
          embed: false,
        },
        checkout_data: {
          email,
          custom: {
            // LS requires every custom value to be a non-empty string.
            // user_id is sent only when a session exists — webhook auto-creates otherwise.
            ...(user?.id ? { user_id: user.id } : {}),
            photo_ids: items.map((i) => i.photoId).join(","),
            licenses: items.map((i) => i.license).join(","),
            buyer_email: email,
          },
        },
      },
      relationships: {
        store: {
          data: { type: "stores", id: String(storeId) },
        },
        variant: {
          data: { type: "variants", id: String(variantId) },
        },
      },
    },
  };

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("LemonSqueezy checkout error:", JSON.stringify(data, null, 2));
    const lsError =
      data?.errors?.[0]?.detail ||
      data?.errors?.[0]?.title ||
      data?.message ||
      "LemonSqueezy rejected the request";
    return NextResponse.json(
      { error: `LS: ${lsError}`, details: data },
      { status: 500 }
    );
  }

  const checkoutUrl = data?.data?.attributes?.url;
  if (!checkoutUrl) {
    console.error("LS response had no checkout URL:", JSON.stringify(data, null, 2));
    return NextResponse.json(
      { error: "LS response missing checkout URL", details: data },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: checkoutUrl });
}
