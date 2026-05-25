import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { items, buyerEmail } = body as {
    items: { photoId: string; license: string; price: number }[];
    buyerEmail: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const email = user?.email ?? buyerEmail;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!storeId || !apiKey) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }

  // Get a variant ID from env (one product handles all photos via custom data)
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  if (!variantId) {
    return NextResponse.json({ error: "LS variant not configured" }, { status: 500 });
  }

  const total = items.reduce((s, i) => s + i.price, 0);
  // LemonSqueezy expects custom_price in the smallest currency unit (cents/deni)
  // 1 MKD = 100 deni, so 1500 MKD → 150000
  const totalInCents = Math.round(total * 100);

  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        store_id: Number(storeId),
        variant_id: Number(variantId),
        custom_price: totalInCents,
        product_options: {
          enabled_variants: [Number(variantId)],
        },
        checkout_data: {
          email,
          custom: {
            photo_ids: items.map((i) => i.photoId),
            licenses: items.map((i) => i.license),
            buyer_email: email,
          },
        },
        checkout_options: {
          button_color: "#e8c97e",
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
  const checkoutUrl = data?.data?.attributes?.url;

  if (!checkoutUrl) {
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }

  return NextResponse.json({ url: checkoutUrl });
}
