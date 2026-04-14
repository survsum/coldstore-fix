// Realistic mock data for all admin sections

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export const revenueData = [
  { month:'Jan', revenue:142000, orders:38, profit:51000 },
  { month:'Feb', revenue:168000, orders:44, profit:62000 },
  { month:'Mar', revenue:195000, orders:52, profit:74000 },
  { month:'Apr', revenue:182000, orders:48, profit:67000 },
  { month:'May', revenue:231000, orders:61, profit:88000 },
  { month:'Jun', revenue:274000, orders:72, profit:106000 },
  { month:'Jul', revenue:312000, orders:83, profit:121000 },
  { month:'Aug', revenue:298000, orders:79, profit:115000 },
  { month:'Sep', revenue:341000, orders:91, profit:134000 },
  { month:'Oct', revenue:389000, orders:104, profit:152000 },
  { month:'Nov', revenue:467000, orders:125, profit:183000 },
  { month:'Dec', revenue:524000, orders:141, profit:207000 },
];

export const weeklyRevenue = [
  { day:'Mon', revenue:18400, orders:5 },
  { day:'Tue', revenue:22100, orders:6 },
  { day:'Wed', revenue:19800, orders:5 },
  { day:'Thu', revenue:31200, orders:8 },
  { day:'Fri', revenue:41500, orders:11 },
  { day:'Sat', revenue:52800, orders:14 },
  { day:'Sun', revenue:38700, orders:10 },
];

export const categoryData = [
  { name:'Electronics', value:42, revenue:219000, color:'#e63030' },
  { name:'Home',        value:28, revenue:146000, color:'#1456b0' },
  { name:'Accessories', value:19, revenue: 99000, color:'#16a34a' },
  { name:'Clothing',    value:11, revenue: 57000, color:'#d97706' },
];

export const topProducts = [
  { name:'Obsidian Headphones',  sales:89,  revenue:221111, views:1840, cart:24.3, conv:9.2,  stock:14 },
  { name:'Luminary Watch',       sales:64,  revenue:239936, views:1420, cart:19.8, conv:7.1,  stock:8  },
  { name:'Pro Mechanical Keyboard', sales:71, revenue:112129, views:2210, cart:31.2, conv:6.8, stock:22 },
  { name:'Smart Home Hub',       sales:48,  revenue: 96000, views:980,  cart:16.4, conv:8.2,  stock:31 },
  { name:'Minimalist Desk Lamp', sales:102, revenue: 66300, views:3100, cart:42.1, conv:5.9,  stock:45 },
  { name:'Wireless Charger Pad', sales:138, revenue: 69000, views:4200, cart:51.3, conv:4.8,  stock:67 },
];

export const orderStatusData = [
  { status:'Delivered', count:312, pct:58, color:'#16a34a' },
  { status:'Shipped',   count:98,  pct:18, color:'#1456b0' },
  { status:'Paid',      count:82,  pct:15, color:'#d97706' },
  { status:'Pending',   count:48,  pct:9,  color:'#6b7280' },
];

export const trafficData = [
  { source:'Google Ads',  visitors:4820, conv:3.8, cpa:380,  roas:3.2, color:'#e63030' },
  { source:'Instagram',   visitors:3210, conv:2.9, cpa:520,  roas:2.1, color:'#d97706' },
  { source:'Direct',      visitors:2180, conv:5.1, cpa:0,    roas:null, color:'#16a34a' },
  { source:'Organic',     visitors:1890, conv:4.2, cpa:0,    roas:null, color:'#1456b0' },
  { source:'WhatsApp',    visitors: 940, conv:6.8, cpa:0,    roas:null, color:'#7c3aed' },
];

export const topCustomers = [
  { name:'Rahul Sharma',    orders:12, ltv:84200,  city:'Mumbai'   },
  { name:'Priya Nair',      orders:9,  ltv:67800,  city:'Bangalore'},
  { name:'Amit Verma',      orders:8,  ltv:52400,  city:'Delhi'    },
  { name:'Sneha Patel',     orders:7,  ltv:48900,  city:'Surat'    },
  { name:'Karthik Reddy',   orders:6,  ltv:41200,  city:'Hyderabad'},
];

export const shippingData = [
  { courier:'Shiprocket',  orders:148, avgDays:2.8, onTime:94, failed:3  },
  { courier:'Delhivery',   orders:112, avgDays:3.2, onTime:91, failed:5  },
  { courier:'BlueDart',    orders:84,  avgDays:2.1, onTime:97, failed:1  },
  { courier:'DTDC',        orders:56,  avgDays:3.8, onTime:86, failed:8  },
  { courier:'Ecom Express',orders:40,  avgDays:3.5, onTime:88, failed:4  },
];

export const profitBreakdown = [
  { month:'Sep', revenue:341000, cogs:170500, shipping:27280, ads:34100, profit:109120 },
  { month:'Oct', revenue:389000, cogs:194500, shipping:31120, ads:38900, profit:124480 },
  { month:'Nov', revenue:467000, cogs:233500, shipping:37360, ads:46700, profit:149440 },
  { month:'Dec', revenue:524000, cogs:262000, shipping:41920, ads:52400, profit:167680 },
];

export const abandonedData = [
  { day:'Mon', carts:28, recovered:6  },
  { day:'Tue', carts:34, recovered:8  },
  { day:'Wed', carts:22, recovered:5  },
  { day:'Thu', carts:41, recovered:11 },
  { day:'Fri', carts:58, recovered:16 },
  { day:'Sat', carts:72, recovered:21 },
  { day:'Sun', carts:49, recovered:13 },
];
