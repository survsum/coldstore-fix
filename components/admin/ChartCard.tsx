interface Props { title:string; sub?:string; children:React.ReactNode; className?:string; }
export default function ChartCard({title,sub,children,className=''}:Props) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
      <div className="mb-4">
        <h3 className="text-[13px] font-bold" style={{color:'var(--text-primary)',fontFamily:'var(--font-display)'}}>{title}</h3>
        {sub&&<p className="text-[11px] mt-0.5" style={{color:'var(--text-muted)'}}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
