import { headers } from "next/headers";
import { isAdminFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductForm from "../shared/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const admin = isAdminFromCookie(headers().get("cookie"));
  if (!admin) return <div>Unauthorized.</div>;
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true }});
  if (!product) return <div>Not found</div>;
  return (
    <div>
      <h1>Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}
