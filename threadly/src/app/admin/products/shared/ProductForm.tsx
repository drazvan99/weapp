"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    priceCents: product?.priceCents?.toString() || "0",
    currency: product?.currency || "USD",
    sizes: product?.sizes?.join(",") || "S,M,L,XL",
    colors: product?.colors?.join(",") || "Black,White",
    images: (product?.images || [{ url: "", alt: "" }]).map((i: any) => ({ url: i.url, alt: i.alt || "" }))
  });

  const save = async () => {
    const payload = {
      ...form,
      priceCents: parseInt(form.priceCents),
      sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map(s => s.trim()).filter(Boolean),
      images: form.images.filter(i => i.url.trim())
    };
    const method = product ? "PUT" : "POST";
    const url = product ? `/api/products/${product.id}` : `/api/products`;
    const res = await fetch(url, {
      method,
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    if (res.ok) router.push("/admin/products");
    else alert("Failed to save");
  };

  const remove = async () => {
    if (!product) return;
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/products");
    else alert("Failed to delete");
  };

  return (
    <div className="stack" style={{ maxWidth: 680 }}>
      <label>Name <input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/></label>
      <label>Slug <input className="input" value={form.slug} onChange={(e)=>setForm({...form, slug:e.target.value})}/></label>
      <label>Description <textarea className="input" rows={5} value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/></label>
      <div className="flex">
        <label style={{ flex: 1 }}>Price (cents) <input className="input" type="number" value={form.priceCents} onChange={(e)=>setForm({...form, priceCents:e.target.value})}/></label>
        <label style={{ width: 160 }}>Currency <input className="input" value={form.currency} onChange={(e)=>setForm({...form, currency:e.target.value})}/></label>
      </div>
      <label>Sizes (comma-separated) <input className="input" value={form.sizes} onChange={(e)=>setForm({...form, sizes:e.target.value})}/></label>
      <label>Colors (comma-separated) <input className="input" value={form.colors} onChange={(e)=>setForm({...form, colors:e.target.value})}/></label>

      <div>
        <div style={{ marginBottom: 8 }}><strong>Images</strong></div>
        {form.images.map((img, idx) => (
          <div key={idx} className="flex">
            <input className="input" placeholder="Image URL" value={img.url} onChange={(e)=> {
              const next = [...form.images]; next[idx].url = e.target.value; setForm({...form, images: next});
            }}/>
            <input className="input" placeholder="Alt text" value={img.alt} onChange={(e)=> {
              const next = [...form.images]; next[idx].alt = e.target.value; setForm({...form, images: next});
            }}/>
            <button className="btn secondary" onClick={()=> {
              const next = form.images.filter((_,i)=>i!==idx);
              setForm({...form, images: next});
            }}>Remove</button>
          </div>
        ))}
        <button className="btn secondary" onClick={()=> setForm({...form, images: [...form.images, { url:"", alt:""}]})}>Add image</button>
      </div>

      <div className="flex" style={{ justifyContent: "space-between" }}>
        {product ? <button className="btn secondary" onClick={remove}>Delete</button> : <span />}
        <button className="btn" onClick={save}>{product ? "Save changes" : "Create product"}</button>
      </div>
    </div>
  );
}
