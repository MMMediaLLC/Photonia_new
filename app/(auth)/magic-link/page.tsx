// Magic link as a standalone auth method is disabled.
// Password reset is handled via the "Заборавена лозинка?" flow on /login.
// This redirect keeps old links from breaking.
import { redirect } from "next/navigation";
export default function MagicLinkPage() {
  redirect("/login");
}
