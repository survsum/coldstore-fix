# Database Migration Instructions

After updating to this schema, run:

```bash
# Option 1 - Development (resets DB and re-seeds)
npm run db:push
npm run db:seed

# Option 2 - If you want to preserve existing data
npx prisma migrate dev --name add_tracking_fields
```

The new fields added to Order model:
- `trackingId` (optional) - courier tracking number
- `courier` (optional) - courier name
- `shippedAt` (optional) - timestamp when shipped
- `deliveredAt` (optional) - timestamp when delivered  
- `updatedAt` - auto-updated timestamp
