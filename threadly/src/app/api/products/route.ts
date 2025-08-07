import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/lib/validations";
import { isAdminFromCookie } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({ include: { images: true }});
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const admin = isAdminFromCookie(req.headers.get("cookie"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = productInputSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { name, slug, description, priceCents, currency, sizes, colors, images } = parsed.data;
  const created = await prisma.product.create({
    data: { name, slug, description, priceCents, currency: currency || "USD", sizes, colors, images: { create: images }}
  });
  return NextResponse.json(created);
}
