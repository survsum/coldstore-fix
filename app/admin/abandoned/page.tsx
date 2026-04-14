'use client';
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { ShoppingBag, TrendingUp, AlertTriangle, Percent } from 'lucide-react';
import { abandonedData } from '@/lib/admin/mockData';

const TS={background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,fontSize:12,color:'var(--text-primary)'};
const reasons=[{reason:'Just browsing',pct:38},{reason:'High shipping cost',pct:24},{reason:'Price too high',pct:19},{reason:'Payment issues',pct:11},{reason:'Changed mind',pct:8}];

export default function AbandonedPage() {
  const totalCarts=abandonedData.reduce((s,d)=>s+d.carts,0);
  const recovered=abandonedData.reduce((s,d)=>s+d.recovered,0);
  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)',letterSpacing:'-0.03em'}}>Abandoned Carts</h1>
        <p className="text-[13px] mt-0.5" style={{color:'var(--text-muted)'}}>Recover lost revenue</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Total Abandoned" value={totalCarts} icon={ShoppingBag} iconColor="var(--accent)" trend={-8}/>
        <StatCard label="Recovered" value={recovered} trend={15} icon={TrendingUp} iconColor="var(--success)" delay={0.06}/>
        <StatCard label="Recovery Rate" value={`${Math.round(recovered/totalCarts*100)}%`} trend={12} icon={Percent} iconColor="var(--cold-blue)" delay={0.12}/>
        <StatCard label="Lost Revenue Est." value="₹2.18L" sub="This week" icon={AlertTriangle} iconColor="var(--warning)" delay={0.18}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <ChartCard title="Abandoned vs Recovered" sub="This week by day">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={abandonedData} margin={{top:4,right:4,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TS}/>
              <Bar dataKey="carts" fill="var(--accent)" radius={[4,4,0,0]} name="Abandoned" opacity={0.6}/>
              <Bar dataKey="recovered" fill="var(--success)" radius={[4,4,0,0]} name="Recovered"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Abandonment Reasons" sub="Why customers leave without buying">
          <div className="space-y-3 mt-2">
            {reasons.map(r=>(
              <div key={r.reason}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-semibold" style={{color:'var(--text-primary)'}}>{r.reason}</span>
                  <span className="text-[11px] font-bold" style={{color:'var(--text-muted)'}}>{r.pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{background:'var(--bg-secondary)'}}>
                  <div className="h-full rounded-full" style={{width:`${r.pct}%`,background:'var(--accent)',opacity:0.7+r.pct/100}}/>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
