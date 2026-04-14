'use client';
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,Legend } from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { IndianRupee, TrendingUp, Percent, Target } from 'lucide-react';
import { profitBreakdown } from '@/lib/admin/mockData';

const TS={background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,fontSize:12,color:'var(--text-primary)'};
function fmt(n:number){return n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`;}

const lastMonth = profitBreakdown[profitBreakdown.length-1];
const margin = Math.round(lastMonth.profit/lastMonth.revenue*100);

export default function ProfitPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)',letterSpacing:'-0.03em'}}>Profit Tracking</h1>
        <p className="text-[13px] mt-0.5" style={{color:'var(--text-muted)'}}>Revenue breakdown and net profit analysis</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Net Profit (Dec)" value={fmt(lastMonth.profit)} trend={12} icon={IndianRupee} iconColor="var(--success)"/>
        <StatCard label="Profit Margin" value={`${margin}%`} trend={2} icon={Percent} iconColor="var(--cold-blue)" delay={0.06}/>
        <StatCard label="Ad Spend" value={fmt(lastMonth.ads)} sub="10% of revenue" icon={Target} iconColor="var(--warning)" delay={0.12}/>
        <StatCard label="COGS" value={fmt(lastMonth.cogs)} sub="50% of revenue" icon={TrendingUp} iconColor="var(--accent)" delay={0.18}/>
      </div>

      <ChartCard title="Revenue Breakdown" sub="Where your money goes — last 4 months" className="mb-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={profitBreakdown} margin={{top:4,right:4,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>fmt(v)} tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} width={52}/>
            <Tooltip contentStyle={TS} formatter={(v:any)=>fmt(v)}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11}}/>
            <Bar dataKey="cogs" stackId="a" fill="var(--accent)" name="Cost of Goods" radius={[0,0,0,0]}/>
            <Bar dataKey="shipping" stackId="a" fill="var(--warning)" name="Shipping Cost"/>
            <Bar dataKey="ads" stackId="a" fill="#7c3aed" name="Ad Spend"/>
            <Bar dataKey="profit" stackId="a" fill="var(--success)" name="Net Profit" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Profit Per Order (Estimated)" sub="Based on avg order value of ₹3,714">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {label:'Avg Order Value',value:'₹3,714',color:'var(--text-primary)'},
            {label:'Product Cost (50%)',value:'-₹1,857',color:'var(--accent)'},
            {label:'Shipping + Ops',value:'-₹297',color:'var(--warning)'},
            {label:'Net Profit / Order',value:'₹1,190',color:'var(--success)'},
          ].map(item=>(
            <div key={item.label} className="p-4 rounded-xl text-center" style={{background:'var(--bg-secondary)'}}>
              <div className="text-[20px] font-bold" style={{color:item.color,fontFamily:'var(--font-display)'}}>{item.value}</div>
              <div className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{color:'var(--text-muted)'}}>{item.label}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
