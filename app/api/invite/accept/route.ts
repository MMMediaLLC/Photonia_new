import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateToken } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { token, name, password } = await req.json();
  if (!token || !name || !password) {
    return NextResponse.json({ error: "Недостасуваат полиња" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: invite } = await supabase
    .from("photographer_invites")
    .select("*")
    .eq("token", token)
    .eq("used", false)
    .single();

  if (!invite) {
    return NextResponse.json({ error: "Поканата не е валидна или е веќе искористена" }, { status: 404 });
  }

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
    user_metadata: { name, role: "photographer" },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  await supabase.from("users").upsert({
    id: authUser.user.id,
    email: invite.email,
    name,
    role: "photographer",
    slug: `${name.toLowerCase().replace(/\s+/g, "-")}-${generateToken(4)}`,
  });

  await supabase.from("photographer_invites").update({ used: true }).eq("id", invite.id);

  return NextResponse.json({ ok: true });
}
