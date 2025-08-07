import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Classic Tee",
      slug: "classic-tee",
      description: "A soft, durable t-shirt for everyday wear.",
      priceCents: 2500,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Navy"],
      images: {
        create: [
          { url: "https://images.pexels.com/photos/1002649/pexels-photo-1002649.jpeg", alt: "Classic Tee - Black" }
        ]
      }
    },
    {
      name: "Vintage Hoodie",
      slug: "vintage-hoodie",
      description: "Cozy hoodie with vintage wash and roomy pockets.",
      priceCents: 5900,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Charcoal", "Olive"],
      images: {
        create: [
          { url: "https://images.pexels.com/photos/6311391/pexels-photo-6311391.jpeg", alt: "Vintage Hoodie" }
        ]
      }
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p }
    });
  }

  console.log("Seeded products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });   