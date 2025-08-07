import { headers } from "next/headers";
import { isAdminFromCookie } from "@/lib/auth";
import ProductForm from "../shared/ProductForm";

export default async function NewProductPage() {
  const admin = isAdminFromCookie(headers().get("cookie"));
  if (!admin) return <div>Unauthorized.</div>;
  return (
    <div>
      <h1>New product</h1>
      <ProductForm />
    </div>
  );
}
