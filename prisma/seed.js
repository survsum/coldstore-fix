// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: { email: 'admin@store.com', password: hashedPassword },
  });

  // Sample products (INR prices)
  const products = [
    { name: 'Obsidian Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 40-hour battery life. Crafted for audiophiles who demand both performance and style.', price: 24999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', category: 'Electronics', stock: 50 },
    { name: 'Luminary Smart Watch', description: 'Ultra-thin smartwatch with AMOLED display, health tracking, and 7-day battery. Perfect fusion of luxury and technology.', price: 37499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', category: 'Electronics', stock: 35 },
    { name: 'Ceramic Pour-Over Set', description: 'Handcrafted ceramic pour-over coffee set for the discerning coffee enthusiast. Food-safe materials with optimal heat retention.', price: 7499, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', category: 'Home', stock: 80 },
    { name: 'Minimal Leather Wallet', description: 'Slim genuine leather wallet with RFID blocking. Holds 8 cards with quick-access cash slot.', price: 6699, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', category: 'Accessories', stock: 120 },
    { name: 'Frosted Glass Desk Lamp', description: 'Architect-inspired desk lamp with adjustable color temperature and brightness. Perfect for late-night work sessions.', price: 13299, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', category: 'Home', stock: 45 },
    { name: 'Titanium Sunglasses', description: 'Featherlight titanium frame with polarized lenses. UV400 protection and scratch-resistant coating.', price: 16699, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', category: 'Accessories', stock: 60 },
    { name: 'Merino Wool Throw', description: 'Ethically sourced 100% merino wool blanket. Temperature-regulating, hypoallergenic, and incredibly soft.', price: 10799, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', category: 'Home', stock: 90 },
    { name: 'Pro Mechanical Keyboard', description: 'Compact 75% layout with tactile switches, per-key RGB, aluminum frame, and wireless/wired dual mode.', price: 15799, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', category: 'Electronics', stock: 40 },
  ];

  // Only seed products if none exist
  const existing = await prisma.product.count();
  if (existing === 0) {
    for (const product of products) {
      await prisma.product.create({ data: product });
    }
    console.log('✅ Products seeded');
  } else {
    console.log(`ℹ️  ${existing} products already exist — skipping`);
  }

  console.log('✅ Database seeded successfully');
  console.log('📧 Admin: admin@store.com / admin123');
  console.log('🔑 Admin panel: http://localhost:3000/admin-login');
}

main().catch(console.error).finally(() => prisma.$disconnect());
