"use client";
import { useState } from "react";

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

export default function AddToCartButton(props: {
  product: {
    id: string;
    name: string;
    priceCents: number;
    currency: string;
    images?: { url: string }[];
  };
  size?: string;
  color?: string;
  disabled?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  return (
    <button
      className="btn"
      disabled={adding || props.disabled}
      onClick={() => {
        setAdding(true);
        const raw = localStorage.getItem("cart");
        const items: CartItem[] = raw ? JSON.parse(raw) : [];
        const existingIdx = items.findIndex(
          i => i.productId === props.product.id && i.size === props.size && i.color === props.color
        );
        if (existingIdx >= 0) {
          items[existingIdx].quantity += 1;
        } else {
          items.push({
            productId: props.product.id,
            name: props.product.name,
            unitPriceCents: props.product.priceCents,
            currency: props.product.currency || "USD",
            quantity: 1,
            size: props.size,
            color: props.color,
            image: props.product.images?.[0]?.url
          });
        }
        localStorage.setItem("cart", JSON.stringify(items));
        window.dispatchEvent(new StorageEvent("storage")); // update navbar count
        setAdding(false);
      }}
    >
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
