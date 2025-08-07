"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartQty, setCartQty] = useState(0);
  useEffect(() => {
    const update = () => {
      const raw = localStorage.getItem("cart");
      const items: any[] = raw ? JSON.parse(raw) : [];
      setCartQty(items.reduce((sum, i) => sum + i.quantity, 0));
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  return (
    <>
      <Link href="/"><strong>Threadly</strong></Link>
      <div className="flex">
        <Link href="/cart">Cart ({cartQty})</Link>
        <Link href="/admin/products">Admin</Link>
      </div>
    </>
  );
}
