"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, LicenseType, Photo, Gallery } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (photo: Photo, gallery?: Gallery, license?: LicenseType) => void;
  removeItem: (photoId: string) => void;
  updateLicense: (photoId: string, license: LicenseType) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "photonia_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = useCallback((photo: Photo, gallery?: Gallery, license: LicenseType = "personal") => {
    setItems((prev) => {
      if (prev.some((i) => i.photo.id === photo.id)) return prev;
      return [...prev, { photo, license, gallery }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((photoId: string) => {
    setItems((prev) => prev.filter((i) => i.photo.id !== photoId));
  }, []);

  const updateLicense = useCallback((photoId: string, license: LicenseType) => {
    setItems((prev) =>
      prev.map((i) => (i.photo.id === photoId ? { ...i, license } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const total = items.reduce((sum, item) => {
    const price =
      item.license === "personal"
        ? item.photo.price_personal
        : item.photo.price_commercial;
    return sum + price;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateLicense,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
