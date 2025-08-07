"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ password })
    });
    setLoading(false);
    if (res.ok) window.location.href = "/admin/products";
    else alert("Invalid password");
  };
  return (
    <div style={{ maxWidth: 400 }}>
      <h1>Admin login</h1>
      <div className="stack">
        <input className="input" type="password" placeholder="Admin password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn" disabled={loading} onClick={onSubmit}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}
