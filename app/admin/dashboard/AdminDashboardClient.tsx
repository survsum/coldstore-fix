'use client';
import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { IndianRupee, ShoppingCart, Users, TrendingUp, Package, Percent, Activity, ArrowUpRight } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import ChartCard from '@/components/admin/ChartCard';
import { formatPrice } from '@/lib/utils';

const TS = { background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, fontSize:12, color:'var(--text-primary)' };
function fmt(n: number) { return n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`; }

const RANGES = ['7D','30D','3M','12M'] as const;
type Range = typeof RANGES[number];

interface RealData {
  monthlyData: any[]; weeklyData: any[]; categoryData: any[]; orderStatusData: any[];
  topProducts: any[];
  rev7: number; rev30: number; rev90: number; revAll: number;
  orders7: number; orders30: number; statusCounts: any; aov: number;
}

export default function AdminDashboardClient({
  stats, recentOrders, realData,
}: {
  stats: { products: number; orders: number; revenue: number; customers: number };
  recentOrders: any[];
  realData: RealData;
}) {
  const [range, setRange] = useState<Range>('12M');

  // Pick correct data for selected range
  const chartData = range === '7D'
    ? realData.weeklyData.map(d => ({ month: d.day, revenue: d.revenue, orders: d.orders, profit: Math.round(d.revenue * 0.38) }))
    : range === '30D'
    ? realData.monthlyData.slice(-2)
    : range === '3M'
    ? realData.monthlyData.slice(-3)
    : realData.monthlyData;

  const rangeRev    = range==='7D' ? realData.rev7 : range==='30D' ? realData.rev30 : range==='3M' ? realData.rev90 : realData.revAll;
  const rangeOrders = range==='7D' ? realData.orders7 : range==='30D' ? realData.orders30 : stats.orders;

  const STATUS_COLOR: Record<string,string> = {
    pending:'var(--text-muted)', paid:'var(--warning)', shipped:'var(--cold-blue)', delivered:'var(--success)',
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color:'var(--text-primary)', fontFamily:'var(--font-display)', letterSpacing:'-0.03em' }}>
            Overview
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color:'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-IN',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
          </p>
        </div>
        {/* Range tabs */}
        <div className="flex gap-1 p-1 rounded-xl flex-shrink-0" style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)' }}>
          {RANGES.map(r=>(
            <button key={r} onClick={()=>setRange(r)}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{
                background: range===r ? 'var(--bg-card)' : 'transparent',
                color: range===r ? 'var(--accent)' : 'var(--text-muted)',
                border: range===r ? '1px solid var(--border)' : '1px solid transparent',
              }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard label="Revenue" value={fmt(rangeRev)} sub="Selected period" trend={18} icon={IndianRupee} iconColor="var(--accent)" delay={0} />
        <StatCard label="Orders" value={rangeOrders} sub={realData.aov>0?`${fmt(realData.aov)} AOV`:''} trend={12} icon={ShoppingCart} iconColor="var(--cold-blue)" delay={0.05} />
        <StatCard label="Net Profit" value={fmt(Math.round(rangeRev*0.38))} sub="~38% margin" trend={9} icon={TrendingUp} iconColor="var(--success)" delay={0.1} />
        <StatCard label="Customers" value={stats.customers} trend={22} icon={Users} iconColor="#7c3aed" delay={0.15} />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <StatCard label="Products" value={stats.products} icon={Package} iconColor="var(--cold-blue)" delay={0.2} />
        <StatCard label="AOV" value={fmt(Math.round(realData.aov))} sub="Per order" icon={Activity} iconColor="var(--warning)" delay={0.25} />
        <StatCard label="Delivered" value={realData.statusCounts.delivered} icon={ArrowUpRight} iconColor="var(--success)" delay={0.3} />
        <StatCard label="Pending" value={realData.statusCounts.pending} icon={Percent} iconColor="var(--warning)" delay={0.35} />
      </div>

      {/* Revenue chart + category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <ChartCard title="Revenue & Profit" sub="Over selected period" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{top:4,right:4,left:0,bottom:0}}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v=>fmt(v)} tick={{fontSize:9,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} width={48}/>
              <Tooltip contentStyle={TS} formatter={(v:any)=>fmt(v)}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11}}/>
              <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2.5} fill="url(#rg)" name="Revenue"/>
              <Area type="monotone" dataKey="profit"  stroke="var(--success)" strokeWidth={2} fill="url(#pg)" name="Profit" strokeDasharray="5 3"/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales by Category" sub="Revenue share">
          {realData.categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={realData.categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {realData.categoryData.map((e:any,i:number)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={TS} formatter={(v:any)=>`${v}%`}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {realData.categoryData.map((c:any)=>(
                  <div key={c.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c.color}}/>
                    <span className="text-[10px] truncate" style={{color:'var(--text-muted)'}}>{c.name} <span style={{color:'var(--text-primary)',fontWeight:600}}>{c.value}%</span></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-[12px]" style={{color:'var(--text-muted)'}}>No data yet</div>
          )}
        </ChartCard>
      </div>

      {/* Weekly bar + order status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <ChartCard title="Daily Orders" sub="This week">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={realData.weeklyData} margin={{top:4,right:4,left:-24,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:9,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TS}/>
              <Bar dataKey="orders" fill="var(--cold-blue)" radius={[5,5,0,0]} name="Orders"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Order Status" sub="All time breakdown" className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {realData.orderStatusData.map((s:any)=>(
              <div key={s.status} className="p-3 rounded-xl text-center" style={{background:'var(--bg-secondary)'}}>
                <div className="text-xl font-bold" style={{color:s.color,fontFamily:'var(--font-display)'}}>{s.count}</div>
                <div className="text-[10px] font-bold tracking-wide mt-0.5" style={{color:'var(--text-muted)'}}>{s.status}</div>
                <div className="mt-2 h-1.5 rounded-full" style={{background:'var(--bg-hover)'}}>
                  <div className="h-full rounded-full" style={{width:`${s.pct}%`,background:s.color,transition:'width 0.8s ease'}}/>
                </div>
                <div className="text-[10px] mt-1" style={{color:'var(--text-muted)'}}>{s.pct}%</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Top products table */}
      {realData.topProducts.length > 0 && (
        <ChartCard title="Top Products" sub="By revenue from actual orders" className="mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]" style={{minWidth:400}}>
              <thead>
                <tr style={{borderBottom:'1px solid var(--border)'}}>
                  {['Product','Sales','Revenue'].map(h=>(
                    <th key={h} className="py-2 px-2 text-left font-bold uppercase tracking-wider" style={{color:'var(--text-muted)',fontSize:10}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {realData.topProducts.map((p:any,i:number)=>(
                  <tr key={p.name} style={{borderBottom:'1px solid var(--border)'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-secondary)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        {p.image && <img src={p.image} alt={p.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>}
                        <span className="font-semibold truncate max-w-[140px]" style={{color:'var(--text-primary)'}}>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-semibold" style={{color:'var(--text-secondary)'}}>{p.sales}</td>
                    <td className="py-2.5 px-2 font-bold" style={{color:'var(--cold-blue)'}}>{fmt(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <ChartCard title="Recent Orders" sub="Latest transactions">
          <div className="space-y-2">
            {recentOrders.slice(0,6).map((o:any)=>(
              <div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-xl transition-colors"
                style={{background:'var(--bg-secondary)'}}
                onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-hover)')}
                onMouseLeave={e=>(e.currentTarget.style.background='var(--bg-secondary)')}>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold truncate" style={{color:'var(--text-primary)'}}>{o.customerName}</p>
                  <p className="text-[11px] truncate" style={{color:'var(--text-muted)'}}>{o.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold capitalize"
                    style={{color:STATUS_COLOR[o.status]||'var(--text-muted)',background:'var(--bg-card)'}}>
                    {o.status}
                  </span>
                  <span className="text-[13px] font-bold" style={{color:'var(--text-primary)'}}>{formatPrice(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Empty state */}
      {stats.orders === 0 && (
        <div className="py-20 text-center rounded-2xl" style={{background:'var(--bg-secondary)',border:'1px solid var(--border)'}}>
          <ShoppingCart size={40} className="mx-auto mb-4" style={{color:'var(--text-muted)'}}/>
          <p className="text-[15px] font-bold mb-2" style={{color:'var(--text-primary)'}}>No orders yet</p>
          <p className="text-[13px]" style={{color:'var(--text-muted)'}}>Stats will appear here once customers start ordering.</p>
        </div>
      )}
    </div>
  );
}
