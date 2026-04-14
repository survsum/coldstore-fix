'use client';
import { LineChart,Line,BarChart,Bar,Cell,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend,AreaChart,Area } from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { TrendingUp, Package, RotateCcw, BarChart2 } from 'lucide-react';

const TS={background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,fontSize:12,color:'var(--text-primary)'};
function fmt(n:number){return n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`;}

export default function AnalyticsClient({monthlyData,categoryData,topProducts,refundCount,refundValue,totalOrders}:any) {
  const totalRev = monthlyData.reduce((s:number,d:any)=>s+d.revenue,0);

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)',letterSpacing:'-0.03em'}}>Analytics</h1>
        <p className="text-[13px] mt-0.5" style={{color:'var(--text-muted)'}}>Real data from your store</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Revenue" value={fmt(totalRev)} icon={TrendingUp} iconColor="var(--accent)"/>
        <StatCard label="Total Orders" value={totalOrders} icon={BarChart2} iconColor="var(--cold-blue)" delay={0.06}/>
        <StatCard label="Products Sold" value={topProducts.reduce((s:number,p:any)=>s+p.sales,0)} icon={Package} iconColor="var(--success)" delay={0.12}/>
        <StatCard label="Refunds" value={refundCount} icon={RotateCcw} iconColor="var(--warning)" delay={0.18}/>
      </div>

      <ChartCard title="Revenue Over Time" sub="Monthly — last 12 months" className="mb-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyData} margin={{top:4,right:4,left:0,bottom:0}}>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.18}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>fmt(v)} tick={{fontSize:9,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} width={50}/>
            <Tooltip contentStyle={TS} formatter={(v:any)=>fmt(v)}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11}}/>
            <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2.5} fill="url(#ag)" name="Revenue"/>
            <Area type="monotone" dataKey="profit"  stroke="var(--success)" strokeWidth={2} fill="none" name="Profit" strokeDasharray="5 3"/>
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <ChartCard title="Revenue by Category" sub="Based on actual orders">
          {categoryData.length>0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical" margin={{top:0,right:12,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
                <XAxis type="number" tickFormatter={v=>fmt(v)} tick={{fontSize:9,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false} width={80}/>
                <Tooltip contentStyle={TS} formatter={(v:any)=>fmt(v)}/>
                <Bar dataKey="revenue" radius={[0,6,6,0]} name="Revenue">
                  {categoryData.map((e:any,i:number)=><Cell key={i} fill={e.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-[12px]" style={{color:'var(--text-muted)'}}>No category data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Top Products" sub="By revenue from orders">
          {topProducts.length>0 ? (
            <div className="space-y-3">
              {topProducts.slice(0,6).map((p:any,i:number)=>(
                <div key={p.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] font-semibold truncate" style={{color:'var(--text-primary)',maxWidth:'60%'}}>{p.name}</span>
                    <span className="text-[11px] font-bold" style={{color:'var(--cold-blue)'}}>{fmt(p.revenue)} · {p.sales} sold</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{background:'var(--bg-secondary)'}}>
                    <div className="h-full rounded-full" style={{
                      width:`${Math.min((p.revenue/(topProducts[0]?.revenue||1))*100,100)}%`,
                      background:`hsl(${200+i*20},70%,50%)`,transition:'width 1s ease',
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-[12px]" style={{color:'var(--text-muted)'}}>No order data yet</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
