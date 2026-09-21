"use client";

import { createContext, useContext, useMemo } from "react";
import { createPersistentStore, usePersistentStore } from "@/lib/persistentStore";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image?: string;
  priceCents: number | null;
  currency: "USD";
  options: string;
  cartUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
};

const MAX_QUANTITY = 99;
const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Partial<CartItem>;
  return typeof candidate.id === "string"
    && typeof candidate.cartUrl === "string"
    && typeof candidate.quantity === "number"
    && candidate.quantity > 0;
}

const cartStore = createPersistentStore<CartItem[]>({
  key: "nyes-neck-cart-v1",
  fallback: [],
  parse: (value) => (Array.isArray(value) ? value.filter(isCartItem) : undefined),
});

function clampQuantity(quantity: number) {
  return Math.min(Math.max(Math.round(quantity), 0), MAX_QUANTITY);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = usePersistentStore(cartStore);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem: (item, quantity = 1) => {
      const existing = items.find((entry) => entry.id === item.id);
      cartStore.set(existing
        ? items.map((entry) => entry.id === item.id
          ? { ...entry, ...item, quantity: clampQuantity(entry.quantity + quantity) }
          : entry)
        : [...items, { ...item, quantity: clampQuantity(quantity) || 1 }]);
    },
    updateQuantity: (id, quantity) => {
      const next = clampQuantity(quantity);
      cartStore.set(next > 0
        ? items.map((item) => item.id === id ? { ...item, quantity: next } : item)
        : items.filter((item) => item.id !== id));
    },
    removeItem: (id) => cartStore.set(items.filter((item) => item.id !== id)),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used within CartProvider");
  return cart;
}
