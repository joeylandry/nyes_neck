"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

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

const STORAGE_KEY = "nyes-neck-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is CartItem => Boolean(item && typeof item === "object" && "id" in item && "cartUrl" in item)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem: (item, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.id === item.id);
        if (existing) return current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry);
        return [...current, { ...item, quantity }];
      });
    },
    updateQuantity: (id, quantity) => {
      setItems((current) => quantity > 0
        ? current.map((item) => item.id === id ? { ...item, quantity } : item)
        : current.filter((item) => item.id !== id));
    },
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used within CartProvider");
  return cart;
}
