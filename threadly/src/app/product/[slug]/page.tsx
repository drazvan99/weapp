import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true }
  });
  if (!product) return <div>Not found</div>;
  const price = (product.priceCents / 100).toFixed(2) + " " + (product.currency || "USD");

  return (
    <div className="flex" style={{ alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        {product.images?.[0] && (
          <img src={product.images[0].url} alt={product.images[0].alt || product.name} style={{ width: "100%", borderRadius: 10 }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <h1>{product.name}</h1>
        <div className="price" style={{ margin: "0.5rem 0 1rem" }}>{price}</div>
        <p>{product.description}</p>

        <div className="stack" style={{ marginTop: "1rem", maxWidth: 320 }}>
          <label>
            <div style={{ marginBottom: 4 }}>Size</div>
            <select id="size">
              {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>
            <div style={{ marginBottom: 4 }}>Color</div>
            <select id="color">
              {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <AddToCartButton
            product={product}
            disabled={product.sizes.length === 0}
            size={undefined /* handled by client script below */}
            color={undefined}
          />
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                const btn = document.querySelector('button.btn');
                btn?.addEventListener('click', function(ev){
                  const size = (document.getElementById('size') as HTMLSelectElement)?.value;
                  const color = (document.getElementById('color') as HTMLSelectElement)?.value;
                  (btn as any).__size = size;
                  (btn as any).__color = color;
                }, {capture:true});
              })();
            `
          }}
        />
      </div>
    </div>
  );
}
