'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface Props {
  label: string; value: string | number; sub?: string;
  trend?: number; icon: LucideIcon; iconColor?: string; delay?: number;
}
export default function StatCard({ label, value, sub, trend, icon: Icon, iconColor='var(--accent)', delay=0 }: Props) {
  const up = (trend??0) >= 0;
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay,duration:0.45,ease:[0.22,1,0.36,1]}}
      className="rounded-2xl p-5 flex flex-col gap-3" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${iconColor}18`}}>
          <Icon size={18} style={{color:iconColor}} />
        </div>
        {trend!==undefined&&(
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full`}
            style={{color:up?'var(--success)':'var(--accent)',background:up?'var(--success-light)':'var(--accent-light)'}}>
            {up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{color:'var(--text-muted)'}}>{label}</p>
        <p className="text-[24px] font-bold leading-tight mt-0.5" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)'}}>{value}</p>
        {sub&&<p className="text-[11px] mt-1" style={{color:'var(--text-muted)'}}>{sub}</p>}
      </div>
    </motion.div>
  );
}
