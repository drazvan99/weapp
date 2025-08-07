import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  priceCents: z.number().int().positive(),
  currency: z.string().default("USD").optional(),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).default([])
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const checkoutSchema = z.object({
  email: z.string().email(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    size: z.string().optional(),
    color: z.string().optional()
  })).min(1)
});