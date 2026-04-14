'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, ShoppingCart, Truck, Package,
  CheckCircle2, ExternalLink, Send, AlertCircle, Copy
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface OrderItem { id: string; name: string; price: number; quantity: number; image: string; }
interface Order {
  id: string; customerName: string; email: string; address: string;
  total: number; status: string; trackingId: string | null; courier: string | null;
  createdAt: Date | string; shippedAt?: Date | string | null;
  deliveredAt?: Date | string | null; parsedItems: OrderItem[];
}

const STATUS: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  pending:   { label:'Pending',   color:'var(--warning)',  bg:'var(--warning-light)',  border:'rgba(217,119,6,0.2)',   icon:Package      },
  paid:      { label:'Paid',      color:'var(--cold-blue)',bg:'var(--cold-blue-light)',border:'rgba(20,86,176,0.2)',   icon:Package      },
  shipped:   { label:'Shipped',   color:'var(--cold-blue)',bg:'var(--cold-blue-light)',border:'rgba(20,86,176,0.2)',   icon:Truck        },
  delivered: { label:'Delivered', color:'var(--success)',  bg:'var(--success-light)',  border:'rgba(22,163,74,0.2)',   icon:CheckCircle2 },
};
const NEXT_STATUS: Record<string, string | null> = { pending:'paid', paid:'shipped', shipped:'delivered', delivered:null };
const COURIERS = ['Shiprocket','Delhivery','BlueDart','DTDC','Ecom Express','XpressBees','FedEx','DHL'];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS[status] || STATUS.pending;
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}` }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

function OrderUpdatePanel({ order, onUpdated }: { order: Order; onUpdated: (u: Order) => void }) {
  const nextStatus = NEXT_STATUS[order.status];
  const [trackingId, setTrackingId] = useState(order.trackingId || '');
  const [courier, setCourier]       = useState(order.courier || '');
  const [loading, setLoading]       = useState(false);

  const handleUpdate = async (status?: string) => {
    setLoading(true);
    try {
      const body: any = { orderId: order.id };
      if (status)     body.status     = status;
      if (trackingId) body.trackingId = trackingId;
      if (courier)    body.courier    = courier;
      const res  = await fetch('/api/orders/update', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onUpdated({ ...order, ...data.order, parsedItems: order.parsedItems });
      toast.success(status ? `Marked as ${status}` : 'Tracking saved');
    } catch (err: any) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="mt-4 pt-4 space-y-4" style={{ borderTop:'1px solid var(--border)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text-muted)' }}>Tracking ID</label>
          <input value={trackingId} onChange={e=>setTrackingId(e.target.value)} placeholder="e.g. 4345678901234"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all font-mono"
            style={{ background:'var(--bg-hover)', border:'1px solid var(--border)', color:'var(--text-primary)' }}
            onFocus={e=>(e.target.style.borderColor='var(--cold-blue)')}
            onBlur={e=>(e.target.style.borderColor='var(--border)')} />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text-muted)' }}>Courier</label>
          <select value={courier} onChange={e=>setCourier(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background:'var(--bg-hover)', border:'1px solid var(--border)', color:'var(--text-primary)' }}>
            <option value="">Select courier…</option>
            {COURIERS.map(c=><option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {(trackingId || courier) && (
          <button onClick={()=>handleUpdate()} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
            style={{ background:'var(--bg-hover)', border:'1px solid var(--border)', color:'var(--text-secondary)' }}>
            <Send size={12}/> Save Info
          </button>
        )}
        {nextStatus && (
          <button onClick={()=>handleUpdate(nextStatus)}
            disabled={loading||(nextStatus==='shipped'&&!trackingId&&!order.trackingId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all text-white disabled:opacity-40"
            style={{ background: nextStatus==='delivered'?'var(--success)': nextStatus==='shipped'?'var(--cold-blue)':'var(--warning)' }}>
            {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : null}
            Mark as {nextStatus.charAt(0).toUpperCase()+nextStatus.slice(1)}
          </button>
        )}
        <a href={`/track/${order.id}`} target="_blank"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ml-auto"
          style={{ background:'var(--bg-hover)', border:'1px solid var(--border)', color:'var(--text-muted)' }}>
          <ExternalLink size={11}/> Tracking Page
        </a>
      </div>

      {nextStatus==='shipped'&&!trackingId&&!order.trackingId&&(
        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
          style={{ color:'var(--warning)', background:'var(--warning-light)', border:'1px solid rgba(217,119,6,0.2)' }}>
          <AlertCircle size={12}/> Add a Tracking ID before marking as shipped
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersClient({ orders: initial }: { orders: Order[] }) {
  const [orders, setOrders]       = useState(initial);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);
  const handleUpdated = (updated: Order) => setOrders(prev => prev.map(o => o.id===updated.id ? updated : o));
  const totalRevenue = orders.reduce((s,o)=>s+o.total, 0);
  const filtered = statusFilter==='all' ? orders : orders.filter(o=>o.status===statusFilter);
  const copyId = (id: string) => { navigator.clipboard.writeText(id); toast.success('Copied'); };

  const filterTabs = ['all','pending','paid','shipped','delivered'];

  return (
    <div className="p-4 sm:p-8 min-h-screen" style={{ background:'var(--bg-primary)', color:'var(--text-primary)' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)', fontFamily:'var(--font-display)', letterSpacing:'-0.02em' }}>Orders</h1>
        <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>
          {orders.length} orders · {formatPrice(totalRevenue)} total revenue
        </p>
      </div>

      {/* Filter tabs — scrollable on mobile */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth:'none' }}>
        {filterTabs.map(s=>(
          <button key={s} onClick={()=>setStatusFilter(s)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize"
            style={{
              background: statusFilter===s ? 'var(--accent)' : 'var(--bg-secondary)',
              color: statusFilter===s ? 'white' : 'var(--text-muted)',
              border: `1px solid ${statusFilter===s ? 'transparent' : 'var(--border)'}`,
            }}>
            {s==='all' ? `All (${orders.length})` : `${s} (${orders.filter(o=>o.status===s).length})`}
          </button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div className="py-20 flex flex-col items-center text-center gap-3 rounded-2xl"
          style={{ border:'1px solid var(--border)', background:'var(--bg-secondary)' }}>
          <ShoppingCart size={36} style={{ color:'var(--text-muted)' }}/>
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>No orders here.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((order, i) => (
            <motion.div key={order.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.03 }}
              className="rounded-2xl overflow-hidden"
              style={{ background:'var(--bg-card)', border:'1px solid var(--border)' }}>

              {/* Order row */}
              <button onClick={()=>toggle(order.id)}
                className="w-full flex flex-wrap items-center gap-3 px-4 py-3.5 text-left transition-colors"
                style={{ background:'transparent' }}
                onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-hover)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>{order.customerName}</span>
                    <StatusBadge status={order.status}/>
                    {order.trackingId&&(
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                        style={{ background:'var(--cold-blue-light)', color:'var(--cold-blue)' }}>
                        {order.trackingId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color:'var(--text-muted)' }}>{order.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-bold" style={{ color:'var(--text-primary)', fontFamily:'var(--font-display)' }}>
                    {formatPrice(order.total)}
                  </div>
                  <div className="text-[11px]" style={{ color:'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={e=>{e.stopPropagation();copyId(order.id);}}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ color:'var(--text-muted)' }}
                    onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-hover)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <Copy size={11}/>
                  </button>
                  {expandedId===order.id ? <ChevronUp size={14} style={{ color:'var(--text-muted)' }}/> : <ChevronDown size={14} style={{ color:'var(--text-muted)' }}/>}
                </div>
              </button>

              {/* Expanded panel */}
              <AnimatePresence>
                {expandedId===order.id&&(
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }} className="overflow-hidden">
                    <div className="px-4 pb-5 pt-2" style={{ borderTop:'1px solid var(--border)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-2.5" style={{ color:'var(--text-muted)' }}>Order Items</p>
                      <div className="space-y-2.5 mb-4">
                        {order.parsedItems.map(item=>(
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ background:'var(--bg-secondary)' }}>
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color:'var(--text-primary)' }}>{item.name}</p>
                              <p className="text-xs" style={{ color:'var(--text-muted)' }}>{formatPrice(item.price)} × {item.quantity}</p>
                            </div>
                            <span className="text-sm font-bold flex-shrink-0" style={{ color:'var(--text-primary)' }}>
                              {formatPrice(item.price*item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs mb-1" style={{ color:'var(--text-muted)' }}>
                        <span>📍 {order.address}</span>
                        <span className="font-bold" style={{ color:'var(--text-primary)' }}>Total: {formatPrice(order.total)}</span>
                      </div>
                      <OrderUpdatePanel order={order} onUpdated={handleUpdated}/>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
