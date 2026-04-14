# Issues Found:
1. SQLite (file:./dev.db) - NOT supported on Vercel (read-only filesystem)
2. fs/writeFile in /api/upload - Vercel has NO writable filesystem
3. SQLite in prisma/schema.prisma - must switch to PostgreSQL
4. Razorpay instantiated at module level (breaks if env missing at build)
5. next-auth unused/conflicting with custom JWT auth
6. multer, iron-session, stripe in package.json but not used
7. NEXTAUTH_URL hardcoded to localhost
8. Image uploads to public/uploads/ - ephemeral on Vercel, need cloud storage
