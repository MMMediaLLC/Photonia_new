import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { items, buyerEmail } = body as {
    items: { photoId: string; license: string; price: number }[];
    buyerEmail?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const email = user?.email ?? buyerEmail;
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
  // LemonSqueezy expects custom_price in the smallest currency unit
  // 1 MKD = 100 deni → 500 MKD becomes 50000
  const totalInCents = Math.round(total * 100);

  // Build a valid HTTPS redirect URL from the actual request origin
  const origin = req.headers.get("origin") || req.nextUrl.origin;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const isValidHttps = /^https:\/\//.test(siteUrl);
  const redirectUrl = isValidHttps ? `${siteUrl}/checkout/success` : undefined;

  // LemonSqueezy JSON:API format — store/variant go in `relationships`, not `attributes`
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
            // LS requires custom values to be strings — join arrays with commas
            photo_ids: items.map((i) => i.photoId).join(","),
            licenses: items.map((i) => i.license).join(","),
            buyer_email: email ?? "",
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
