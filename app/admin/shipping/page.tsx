'use client';
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { Truck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { shippingData } from '@/lib/admin/mockData';

const TS={background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,fontSize:12,color:'var(--text-primary)'};

export default function ShippingPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)',letterSpacing:'-0.03em'}}>Shipping & Fulfillment</h1>
        <p className="text-[13px] mt-0.5" style={{color:'var(--text-muted)'}}>Courier performance and delivery metrics</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Avg Delivery Time" value="2.9 days" trend={-12} icon={Clock} iconColor="var(--cold-blue)"/>
        <StatCard label="On-Time Rate" value="92%" trend={3} icon={CheckCircle2} iconColor="var(--success)" delay={0.06}/>
        <StatCard label="Failed Deliveries" value="21" trend={-18} icon={AlertTriangle} iconColor="var(--accent)" delay={0.12}/>
        <StatCard label="Total Shipments" value="440" icon={Truck} iconColor="var(--warning)" delay={0.18}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <ChartCard title="On-Time Rate by Courier" sub="% deliveries on time">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={shippingData} margin={{top:4,right:4,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="courier" tick={{fontSize:9,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis domain={[80,100]} tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TS} formatter={(v:any)=>`${v}%`}/>
              <Bar dataKey="onTime" fill="var(--success)" radius={[6,6,0,0]} name="On-Time %"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Average Delivery Days" sub="Lower is better">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={shippingData} layout="vertical" margin={{top:0,right:12,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
              <XAxis type="number" domain={[0,5]} tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="courier" tick={{fontSize:11,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false} width={88}/>
              <Tooltip contentStyle={TS} formatter={(v:any)=>`${v} days`}/>
              <Bar dataKey="avgDays" fill="var(--cold-blue)" radius={[0,6,6,0]} name="Avg Days"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <ChartCard title="Courier Performance Summary">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{borderBottom:'1px solid var(--border)'}}>
                {['Courier','Orders','Avg Days','On-Time %','Failed','Rating'].map(h=>(
                  <th key={h} className="py-2 px-3 text-left font-bold uppercase tracking-wider" style={{color:'var(--text-muted)',fontSize:10}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shippingData.map((c,i)=>(
                <tr key={c.courier} style={{borderBottom:'1px solid var(--border)'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-secondary)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td className="py-3 px-3 font-bold" style={{color:'var(--text-primary)'}}>{c.courier}</td>
                  <td className="py-3 px-3" style={{color:'var(--text-secondary)'}}>{c.orders}</td>
                  <td className="py-3 px-3 font-semibold" style={{color:c.avgDays<3?'var(--success)':'var(--warning)'}}>{c.avgDays}d</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{background:c.onTime>93?'var(--success-light)':'var(--warning-light)',color:c.onTime>93?'var(--success)':'var(--warning)'}}>
                      {c.onTime}%
                    </span>
                  </td>
                  <td className="py-3 px-3" style={{color:c.failed>5?'var(--accent)':'var(--text-muted)',fontWeight:c.failed>5?700:400}}>{c.failed}</td>
                  <td className="py-3 px-3">
                    {'★'.repeat(Math.round(c.onTime/20))} <span style={{color:'var(--text-muted)'}}>{(c.onTime/20).toFixed(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
