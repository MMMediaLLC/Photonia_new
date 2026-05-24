"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type ToastEvent = CustomEvent<Omit<Toast, "id">>;

export function toast(message: string, type: Toast["type"] = "info") {
  window.dispatchEvent(
    new CustomEvent("photonia-toast", { detail: { message, type } })
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as ToastEvent).detail;
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    window.addEventListener("photonia-toast", handler);
    return () => window.removeEventListener("photonia-toast", handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-card text-sm font-medium shadow-xl pointer-events-auto",
            t.type === "success" && "bg-[#4caf7d] text-white",
            t.type === "error" && "bg-[#e05555] text-white",
            t.type === "info" && "bg-[#141414] text-[#f0f0f0] border border-white/10"
          )}
        >
          <span>{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="opacity-70 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
