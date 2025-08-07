"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const raw = localStorage.getItem("cart");
    const items = raw ? JSON.parse(raw) : [];
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, items })
    });
    if (!res.ok) { setLoading(false); alert("Checkout failed"); return; }
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h1>Checkout</h1>
      <p>Use Stripe test card 4242 4242 4242 4242, any future expiry, any CVC.</p>
      <div className="stack" style={{ marginTop: "1rem" }}>
        <input className="input" placeholder="Email address" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <button className="btn" disabled={loading} onClick={handleCheckout}>
          {loading ? "Redirecting..." : "Proceed to payment"}
        </button>
      </div>
    </div>
  );
}
