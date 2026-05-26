"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

/**
 * Handles both PKCE (?code=xxx) and implicit (#access_token=xxx) flows.
 * - PKCE: used by regular magic links sent via client SDK
 * - Implicit: used by admin.generateLink() in webhook
 */
function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Најавување...");

  useEffect(() => {
    const supabase = createClient();
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/account/downloads";
    const errorParam = searchParams.get("error");

    async function handleAuth() {
      // If there's an explicit error in URL params
      if (errorParam) {
        setStatus("Линкот не е валиден. Пренасочување...");
        setTimeout(() => router.replace("/login?error=invalid_link"), 1500);
        return;
      }

      // PKCE flow: exchange code for session
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("[auth/callback] PKCE exchange failed:", error.message);
          router.replace(`/login?error=${encodeURIComponent(error.message)}`);
          return;
        }
        router.replace(next);
        return;
      }

      // Implicit flow: Supabase client auto-reads #access_token from hash
      // Small delay to let the client parse the hash
      await new Promise((r) => setTimeout(r, 300));
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace(next);
      } else {
        // No session — maybe hash expired, redirect to login
        router.replace("/login?error=session_expired");
      }
    }

    handleAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#888]">
      <Loader2 size={32} className="animate-spin text-[#e8c97e]" />
      <p className="text-sm">{status}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#888]">
          <Loader2 size={32} className="animate-spin text-[#e8c97e]" />
          <p className="text-sm">Најавување...</p>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
