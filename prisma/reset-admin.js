// Run this if you can't log into admin: node prisma/reset-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@store.com' },
    update: { password: hashedPassword },
    create: { email: 'admin@store.com', password: hashedPassword },
  });

  console.log('✅ Admin account ready');
  console.log('📧 Email:   admin@store.com');
  console.log('🔑 Password: admin123');
  console.log('🌐 Login at: http://localhost:3000/admin/login');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
