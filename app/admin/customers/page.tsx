'use client';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { Users, TrendingUp, Award, MapPin } from 'lucide-react';
import { topCustomers } from '@/lib/admin/mockData';

const TS = {background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,fontSize:12,color:'var(--text-primary)'};
const newVsReturn=[{name:'New',value:66,color:'var(--cold-blue)'},{name:'Returning',value:34,color:'var(--accent)'}];
const geoData=[{city:'Mumbai',customers:62},{city:'Delhi',customers:54},{city:'Bangalore',customers:48},{city:'Hyderabad',customers:31},{city:'Surat',customers:24},{city:'Pune',customers:18}];
function fmt(n:number){return n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`;}

export default function CustomersPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)',letterSpacing:'-0.03em'}}>Customers</h1>
        <p className="text-[13px] mt-0.5" style={{color:'var(--text-muted)'}}>Understand your audience</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Total Customers" value="1,248" trend={22} icon={Users} iconColor="var(--cold-blue)" />
        <StatCard label="New This Month" value="164" trend={18} icon={TrendingUp} iconColor="var(--success)" delay={0.06} />
        <StatCard label="Avg. LTV" value="₹6,840" sub="Per customer" trend={9} icon={Award} iconColor="var(--warning)" delay={0.12} />
        <StatCard label="Repeat Rate" value="34%" trend={7} icon={MapPin} iconColor="var(--accent)" delay={0.18} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <ChartCard title="New vs Returning" sub="Customer type split">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={newVsReturn} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                {newVsReturn.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={TS} formatter={(v:any)=>`${v}%`}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {newVsReturn.map(e=>(
              <div key={e.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{background:e.color}}/>
                <span className="text-[11px] font-semibold" style={{color:'var(--text-muted)'}}>{e.name}: <span style={{color:'var(--text-primary)'}}>{e.value}%</span></span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Geographic Distribution" sub="Top cities" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={geoData} layout="vertical" margin={{top:0,right:12,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="city" tick={{fontSize:11,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false} width={72}/>
              <Tooltip contentStyle={TS}/>
              <Bar dataKey="customers" fill="var(--cold-blue)" radius={[0,6,6,0]} name="Customers"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top Customers" sub="By lifetime value">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{borderBottom:'1px solid var(--border)'}}>
              {['Customer','City','Orders','Lifetime Value','Status'].map(h=>(
                <th key={h} className="py-2 px-3 text-left font-bold uppercase tracking-wider" style={{color:'var(--text-muted)',fontSize:10}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((c,i)=>(
              <tr key={c.name} style={{borderBottom:'1px solid var(--border)'}}
                onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-secondary)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{background:`hsl(${i*50+200},60%,45%)`}}>
                      {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <span className="font-semibold" style={{color:'var(--text-primary)'}}>{c.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3" style={{color:'var(--text-muted)'}}>{c.city}</td>
                <td className="py-3 px-3 font-semibold" style={{color:'var(--text-primary)'}}>{c.orders}</td>
                <td className="py-3 px-3 font-bold" style={{color:'var(--cold-blue)'}}>{fmt(c.ltv)}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:'var(--success-light)',color:'var(--success)'}}>VIP</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartCard>
    </div>
  );
}
