import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/lib/validations";
import { isAdminFromCookie } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string }}) {
  const p = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true }});
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
  const admin = isAdminFromCookie(req.headers.get("cookie"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = productInputSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { name, slug, description, priceCents, currency, sizes, colors, images } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: params.id }});
    const p = await tx.product.update({
      where: { id: params.id },
      data: { name, slug, description, priceCents, currency: currency || "USD", sizes, colors, images: { create: images }}
    });
    return p;
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const admin = isAdminFromCookie(req.headers.get("cookie"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id }});
  return NextResponse.json({ ok: true });
}
