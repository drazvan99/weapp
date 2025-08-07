"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  unitPriceCents: number;
  currency: string;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  const total = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const currency = items[0]?.currency || "USD";

  const updateQty = (idx: number, qty: number) => {
    const next = [...items];
    if (qty < 1) qty = 1;
    next[idx].quantity = qty;
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage"));
  };

  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage"));
  };

  if (items.length === 0) {
    return (
      <div>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link className="btn" href="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Your cart</h1>
      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Item</th><th>Options</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, idx) => (
            <tr key={idx}>
              <td>
                <div className="flex" style={{ alignItems: "center" }}>
                  {i.image && <img src={i.image} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }} />}
                  <div>{i.name}</div>
                </div>
              </td>
              <td>{[i.size, i.color].filter(Boolean).join(" / ")}</td>
              <td>{(i.unitPriceCents / 100).toFixed(2)} {i.currency}</td>
              <td>
                <input className="input" type="number" min={1} value={i.quantity} onChange={(e) => updateQty(idx, parseInt(e.target.value || "1"))}/>
              </td>
              <td>{((i.unitPriceCents * i.quantity) / 100).toFixed(2)} {i.currency}</td>
              <td><button className="btn secondary" onClick={() => removeItem(idx)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <Link className="btn secondary" href="/">Continue shopping</Link>
        <div>
          <div style={{ marginBottom: 8, textAlign: "right" }}><strong>Total:</strong> {(total / 100).toFixed(2)} {currency}</div>
          <Link className="btn" href="/checkout">Checkout</Link>
        </div>
      </div>
    </div>
  );
}
