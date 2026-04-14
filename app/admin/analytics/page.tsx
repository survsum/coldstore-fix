import { prisma } from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  const now = new Date();
  // Monthly data
  const monthlyMap: Record<string, { revenue: number; orders: number; profit: number }> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now); d.setMonth(now.getMonth() - i);
    const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthlyMap[key] = { revenue: 0, orders: 0, profit: 0 };
  }
  orders.forEach(o => {
    const key = new Date(o.createdAt).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    if (monthlyMap[key]) {
      monthlyMap[key].revenue += o.total;
      monthlyMap[key].orders  += 1;
      monthlyMap[key].profit  += o.total * 0.38;
    }
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

  // Category from items
  const catMap: Record<string, number> = {};
  const revAll = orders.reduce((s,o)=>s+o.total, 0);
  orders.forEach(o => {
    try {
      JSON.parse(o.items).forEach((item: any) => {
        if (item.category) catMap[item.category] = (catMap[item.category]||0) + item.price*item.quantity;
      });
    } catch {}
  });
  const COLORS = ['#e63030','#1456b0','#16a34a','#d97706','#7c3aed'];
  const categoryData = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,revenue],i)=>({
    name, revenue, value: Math.round((revenue/(revAll||1))*100), color: COLORS[i%COLORS.length],
  }));

  // Product performance
  const productMap: Record<string,{name:string;sales:number;revenue:number}> = {};
  orders.forEach(o=>{
    try {
      JSON.parse(o.items).forEach((item:any)=>{
        if(!productMap[item.id]) productMap[item.id]={name:item.name,sales:0,revenue:0};
        productMap[item.id].sales+=item.quantity||1;
        productMap[item.id].revenue+=(item.price||0)*(item.quantity||1);
      });
    } catch {}
  });
  const topProducts = Object.values(productMap).sort((a,b)=>b.revenue-a.revenue).slice(0,8);

  const refundCount = 0; // extend later
  const refundValue = 0;

  return <AnalyticsClient monthlyData={monthlyData} categoryData={categoryData} topProducts={topProducts} refundCount={refundCount} refundValue={refundValue} totalOrders={orders.length} />;
}
