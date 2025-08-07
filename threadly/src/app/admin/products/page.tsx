import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { isAdminFromCookie } from "@/lib/auth";

export default async function AdminProductsPage() {
  const admin = isAdminFromCookie(headers().get("cookie"));
  if (!admin) return <div>Unauthorized. <Link href="/admin/login">Login</Link></div>;

  const products = await prisma.product.findMany({ include: { images: true }, orderBy: { createdAt: "desc" }});
  return (
    <div>
      <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Products</h1>
        <div className="flex" style={{ gap: 8 }}>
          <Link className="btn secondary" href="/api/auth/logout">Logout</Link>
          <Link className="btn" href="/admin/products/new">New product</Link>
        </div>
      </div>
      <table className="table" style={{ marginTop: "1rem" }}>
        <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Slug</th><th></th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.images[0]?.url ? <img src={p.images[0].url} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} /> : "-"}</td>
              <td>{p.name}</td>
              <td>{(p.priceCents/100).toFixed(2)} {p.currency}</td>
              <td>{p.slug}</td>
              <td><Link className="btn secondary" href={`/admin/products/${p.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
