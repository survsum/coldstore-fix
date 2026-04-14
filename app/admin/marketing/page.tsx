'use client';
import { BarChart,Bar,Cell,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { Megaphone, Target, TrendingUp, Eye } from 'lucide-react';
import { trafficData } from '@/lib/admin/mockData';

const TS={background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,fontSize:12,color:'var(--text-primary)'};

export default function MarketingPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)',letterSpacing:'-0.03em'}}>Marketing & Traffic</h1>
        <p className="text-[13px] mt-0.5" style={{color:'var(--text-muted)'}}>Track ad performance and traffic sources</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Total Visitors" value="13,040" trend={14} icon={Eye} iconColor="var(--cold-blue)" />
        <StatCard label="Avg Conv. Rate" value="3.8%" trend={4} icon={Target} iconColor="var(--success)" delay={0.06} />
        <StatCard label="Total Ad Spend" value="₹73,600" sub="This month" icon={Megaphone} iconColor="var(--warning)" delay={0.12} />
        <StatCard label="Avg. ROAS" value="2.65x" trend={11} icon={TrendingUp} iconColor="var(--accent)" delay={0.18} />
      </div>

      <ChartCard title="Traffic Sources" sub="Visitors, conversion rate, CPA by channel" className="mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{borderBottom:'1px solid var(--border)'}}>
                {['Source','Visitors','Conv %','CPA','ROAS','Action'].map(h=>(
                  <th key={h} className="py-2 px-3 text-left font-bold uppercase tracking-wider" style={{color:'var(--text-muted)',fontSize:10}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trafficData.map((t,i)=>(
                <tr key={t.source} style={{borderBottom:'1px solid var(--border)'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-secondary)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:t.color}}/>
                      <span className="font-bold" style={{color:'var(--text-primary)'}}>{t.source}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold" style={{color:'var(--text-secondary)'}}>{t.visitors.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{background:t.conv>4?'var(--success-light)':'var(--warning-light)',color:t.conv>4?'var(--success)':'var(--warning)'}}>
                      {t.conv}%
                    </span>
                  </td>
                  <td className="py-3 px-3" style={{color:t.cpa===0?'var(--success)':'var(--text-secondary)',fontWeight:t.cpa===0?700:400}}>
                    {t.cpa===0?'Organic':`₹${t.cpa}`}
                  </td>
                  <td className="py-3 px-3" style={{color:t.roas&&t.roas>2.5?'var(--success)':'var(--text-muted)',fontWeight:600}}>
                    {t.roas?`${t.roas}x`:'—'}
                  </td>
                  <td className="py-3 px-3">
                    {t.cpa>0&&(
                      <button className="text-[11px] font-bold px-2 py-0.5 rounded-lg" style={{background:'var(--cold-blue-light)',color:'var(--cold-blue)'}}>Scale</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <ChartCard title="Visitors by Source" sub="Share of total traffic">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trafficData} margin={{top:4,right:4,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="source" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TS}/>
              <Bar dataKey="visitors" radius={[6,6,0,0]} name="Visitors">
                {trafficData.map((e,i)=><rect key={i} fill={e.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CPA vs Conversion" sub="Higher conv % = lower CPA = better ads">
          <div className="space-y-3 mt-2">
            {trafficData.filter(t=>t.cpa>0).map(t=>(
              <div key={t.source}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-semibold" style={{color:'var(--text-primary)'}}>{t.source}</span>
                  <span className="text-[11px] font-bold" style={{color:t.roas&&t.roas>2.5?'var(--success)':'var(--warning)'}}>ROAS {t.roas}x · CPA ₹{t.cpa}</span>
                </div>
                <div className="h-2 rounded-full" style={{background:'var(--bg-secondary)'}}>
                  <div className="h-full rounded-full" style={{width:`${Math.min(t.conv*15,100)}%`,background:t.color}}/>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
