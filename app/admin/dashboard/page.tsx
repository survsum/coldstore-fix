import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic'; // always fetch fresh data, no caching

export default async function AdminDashboardPage() {
  const [products, orders, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.user.count().catch(() => 0),
  ]);

  // ── Real revenue metrics ──
  const now    = new Date();
  const day7   = new Date(now); day7.setDate(now.getDate() - 7);
  const day30  = new Date(now); day30.setDate(now.getDate() - 30);
  const day90  = new Date(now); day90.setDate(now.getDate() - 90);

  const ordersLast7  = orders.filter(o => new Date(o.createdAt) >= day7);
  const ordersLast30 = orders.filter(o => new Date(o.createdAt) >= day30);
  const ordersLast90 = orders.filter(o => new Date(o.createdAt) >= day90);

  const rev7  = ordersLast7.reduce((s,o)=>s+o.total, 0);
  const rev30 = ordersLast30.reduce((s,o)=>s+o.total, 0);
  const rev90 = ordersLast90.reduce((s,o)=>s+o.total, 0);
  const revAll = orders.reduce((s,o)=>s+o.total, 0);

  // ── Order status counts ──
  const statusCounts = {
    pending:   orders.filter(o=>o.status==='pending').length,
    paid:      orders.filter(o=>o.status==='paid').length,
    shipped:   orders.filter(o=>o.status==='shipped').length,
    delivered: orders.filter(o=>o.status==='delivered').length,
  };

  // ── Monthly revenue (last 12 months) ──
  const monthlyMap: Record<string, { revenue: number; orders: number; profit: number }> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(now.getMonth() - i);
    const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthlyMap[key] = { revenue: 0, orders: 0, profit: 0 };
  }
  orders.forEach(o => {
    const d   = new Date(o.createdAt);
    const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    if (monthlyMap[key]) {
      monthlyMap[key].revenue += o.total;
      monthlyMap[key].orders  += 1;
      monthlyMap[key].profit  += o.total * 0.38; // ~38% margin estimate
    }
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

  // ── Weekly orders (last 7 days) ──
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const weeklyMap: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const key = DAYS[d.getDay()];
    weeklyMap[key] = { revenue: 0, orders: 0 };
  }
  ordersLast7.forEach(o => {
    const key = DAYS[new Date(o.createdAt).getDay()];
    if (weeklyMap[key]) { weeklyMap[key].revenue += o.total; weeklyMap[key].orders += 1; }
  });
  const weeklyData = Object.entries(weeklyMap).map(([day, v]) => ({ day, ...v }));

  // ── Category breakdown (from orders items JSON) ──
  const catMap: Record<string, number> = {};
  orders.forEach(o => {
    try {
      const items = JSON.parse(o.items);
      items.forEach((item: any) => {
        if (item.category) {
          catMap[item.category] = (catMap[item.category] || 0) + (item.price * item.quantity);
        }
      });
    } catch {}
  });
  const COLORS = ['#e63030','#1456b0','#16a34a','#d97706','#7c3aed'];
  const categoryData = Object.entries(catMap)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5)
    .map(([name,revenue], i) => ({
      name, revenue,
      value: Math.round((revenue / (revAll || 1)) * 100),
      color: COLORS[i % COLORS.length],
    }));

  // ── Real order status for chart ──
  const total = orders.length || 1;
  const orderStatusData = [
    { status:'Delivered', count:statusCounts.delivered, pct:Math.round(statusCounts.delivered/total*100), color:'#16a34a' },
    { status:'Shipped',   count:statusCounts.shipped,   pct:Math.round(statusCounts.shipped/total*100),   color:'#1456b0' },
    { status:'Paid',      count:statusCounts.paid,      pct:Math.round(statusCounts.paid/total*100),      color:'#d97706' },
    { status:'Pending',   count:statusCounts.pending,   pct:Math.round(statusCounts.pending/total*100),   color:'#6b7280' },
  ];

  // ── Top products from order items ──
  const productMap: Record<string, { name: string; sales: number; revenue: number; image: string }> = {};
  orders.forEach(o => {
    try {
      const items = JSON.parse(o.items);
      items.forEach((item: any) => {
        if (!productMap[item.id]) productMap[item.id] = { name: item.name, sales: 0, revenue: 0, image: item.image || '' };
        productMap[item.id].sales   += item.quantity || 1;
        productMap[item.id].revenue += (item.price || 0) * (item.quantity || 1);
      });
    } catch {}
  });
  const topProducts = Object.values(productMap)
    .sort((a,b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <AdminDashboardClient
      stats={{ products, orders: orders.length, revenue: revAll, customers: userCount }}
      recentOrders={orders.slice(0, 8)}
      realData={{
        monthlyData, weeklyData, categoryData, orderStatusData,
        topProducts,
        rev7, rev30, rev90, revAll,
        orders7: ordersLast7.length, orders30: ordersLast30.length,
        statusCounts,
        aov: orders.length > 0 ? revAll / orders.length : 0,
      }}
    />
  );
}
