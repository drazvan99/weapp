import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  const price = (product.priceCents / 100).toFixed(2) + " " + (product.currency || "USD");
  const img = product.images?.[0]?.url;
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        {img && <img src={img} alt={product.images?.[0]?.alt || product.name} />}
      </Link>
      <div style={{ padding: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{product.name}</div>
          <div className="price">{price}</div>
        </div>
        <div style={{ marginTop: "0.6rem" }}>
          <Link href={`/product/${product.slug}`} className="btn">View</Link>
        </div>
      </div>
    </div>
  );
}
