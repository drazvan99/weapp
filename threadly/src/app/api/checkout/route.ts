import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { email, items } = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } }
  });

  const lineItems = items.map(i => {
    const p = products.find(pp => pp.id === i.productId);
    if (!p) throw new Error("Product not found");
    return {
      price_data: {
        currency: p.currency || "USD",
        product_data: { name: p.name },
        unit_amount: p.priceCents
      },
      quantity: i.quantity
    };
  });

  const orderTotalCents = products.reduce((sum, p) => {
    const qty = items.find(i => i.productId === p.id)?.quantity || 0;
    return sum + p.priceCents * qty;
  }, 0);

  const order = await prisma.order.create({
    data: {
      email,
      totalCents: orderTotalCents,
      currency: products[0]?.currency || "USD",
      items: {
        create: items.map(i => {
          const p = products.find(pp => pp.id === i.productId)!;
          return {
            productId: p.id,
            name: p.name,
            unitPriceCents: p.priceCents,
            quantity: i.quantity,
            size: i.size,
            color: i.color
          };
        })
      }
    }
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${req.nextUrl.origin}/?success=true`,
    cancel_url: `${req.nextUrl.origin}/cart`,
    customer_email: email,
    line_items: lineItems,
    metadata: { orderId: order.id }
  });

  await prisma.order.update({ where: { id: order.id }, data: { stripeId: session.id } });

  return NextResponse.json({ url: session.url });
}
