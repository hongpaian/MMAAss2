import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, qty }]

  const add = (product, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product._id === product._id);
      if (found) return prev.map((i) => (i.product._id === product._id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { product, qty }];
    });

  const setQty = (id, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.product._id !== id) : prev.map((i) => (i.product._id === id ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  const { total, count } = useMemo(
    () => ({
      total: items.reduce((s, i) => s + i.product.price * i.qty, 0),
      count: items.reduce((s, i) => s + i.qty, 0),
    }),
    [items]
  );

  return <CartContext.Provider value={{ items, add, setQty, clear, total, count }}>{children}</CartContext.Provider>;
}
