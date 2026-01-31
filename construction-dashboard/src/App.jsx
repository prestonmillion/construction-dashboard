import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Users, DollarSign, CheckCircle2, Building2, Phone, Mail, X, ChevronDown, Settings, Edit2, CreditCard, Banknote, Building, Wallet, Home, FolderKanban, Clock, Search, Moon, Sun, User, UserPlus, Briefcase, MapPin, Landmark, Globe, Eye } from 'lucide-react';

const TRADES = ['General', 'Foundation', 'Concrete', 'Framing', 'Roofing', 'Electrical', 'Plumbing', 'HVAC', 'Insulation', 'Drywall', 'Painting', 'Flooring', 'Cabinets', 'Countertops', 'Landscaping', 'Excavation', 'Surveyor', 'Architect', 'Other'];
const METHODS = [
  { id: 'check', label: 'Check', icon: Banknote, needsRef: true, refLabel: 'Check Number' },
  { id: 'cash', label: 'Cash', icon: Wallet, needsRef: false },
  { id: 'card', label: 'Credit/Debit', icon: CreditCard, needsRef: true, refLabel: 'Last 4 Digits' },
  { id: 'ach', label: 'ACH Transfer', icon: Building, needsRef: true, refLabel: 'Reference #' },
  { id: 'zelle', label: 'Zelle', icon: Wallet, needsRef: false },
  { id: 'wire', label: 'Wire', icon: Globe, needsRef: true, refLabel: 'Confirmation #' },
];
const ACCOUNTS = ['Business Checking', 'Business Savings', 'Construction Loan', 'Personal', 'Line of Credit', 'Other'];
const PHASES = ["Pre-Construction", "Permits", "Site Prep", "Foundation", "Framing", "Exterior", "Rough-Ins", "Insulation", "Drywall", "Finishes", "Final"];
const TASKS = [
  { phase: "Pre-Construction", task: "Research zoning & easements", days: 3 },
  { phase: "Pre-Construction", task: "Buy lot", days: 1 },
  { phase: "Pre-Construction", task: "Get survey", days: 5 },
  { phase: "Pre-Construction", task: "Get plans drawn", days: 21 },
  { phase: "Permits", task: "Submit plans / pull permit", days: 2 },
  { phase: "Permits", task: "Builders risk insurance", days: 2 },
  { phase: "Site Prep", task: "Set temp pole", days: 2 },
  { phase: "Site Prep", task: "Clear lot", days: 3 },
  { phase: "Foundation", task: "Foundation markings", days: 1 },
  { phase: "Foundation", task: "Footings", days: 2 },
  { phase: "Foundation", task: "⚠️ Footings inspection", days: 1, inspection: true },
  { phase: "Foundation", task: "Pour footings", days: 8 },
  { phase: "Foundation", task: "Lay blocks", days: 10 },
  { phase: "Foundation", task: "Plumber rough-ins", days: 2 },
  { phase: "Foundation", task: "⚠️ Plumbing inspection", days: 1, inspection: true },
  { phase: "Foundation", task: "Pour slab", days: 8 },
  { phase: "Framing", task: "Framing", days: 14 },
  { phase: "Framing", task: "Doors & windows", days: 2 },
  { phase: "Framing", task: "⚠️ Framing inspection", days: 1, inspection: true },
  { phase: "Exterior", task: "Brick/siding", days: 5 },
  { phase: "Exterior", task: "Roofing", days: 3 },
  { phase: "Rough-Ins", task: "HVAC rough-ins", days: 3 },
  { phase: "Rough-Ins", task: "Plumbing top outs", days: 2 },
  { phase: "Rough-Ins", task: "Electrical rough-ins", days: 3 },
  { phase: "Rough-Ins", task: "⚠️ Rough-in inspections", days: 1, inspection: true },
  { phase: "Insulation", task: "Insulation", days: 1 },
  { phase: "Drywall", task: "Hang drywall", days: 5 },
  { phase: "Drywall", task: "Finish drywall", days: 5 },
  { phase: "Finishes", task: "Flooring", days: 3 },
  { phase: "Finishes", task: "Paint", days: 6 },
  { phase: "Finishes", task: "Trim", days: 3 },
  { phase: "Finishes", task: "Cabinets", days: 2 },
  { phase: "Finishes", task: "Countertops", days: 7 },
  { phase: "Finishes", task: "Plumbing fixtures", days: 2 },
  { phase: "Final", task: "Driveway", days: 2 },
  { phase: "Final", task: "Landscaping", days: 2 },
  { phase: "Final", task: "⚠️ Final inspection", days: 1, inspection: true },
  { phase: "Final", task: "Certificate of Occupancy", days: 3 },
];

const fmt = n => n == null || n === '' ? '' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

export default function App() {
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState('dashboard');
  const [projId, setProjId] = useState(null);
  const [tab, setTab] = useState('tasks');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [form, setForm] = useState({});
  const [sel, setSel] = useState(null);

  const [user] = useState({ id: 1, name: 'Preston', role: 'admin', avatar: 'P', color: 'bg-blue-600' });
  const [team, setTeam] = useState([
    { id: 1, name: 'Preston', email: 'preston@example.com', role: 'admin', avatar: 'P', color: 'bg-blue-600' },
    { id: 2, name: 'Partner', email: 'partner@example.com', role: 'partner', avatar: 'PA', color: 'bg-emerald-600' },
  ]);
  const [contractors, setContractors] = useState([
    { id: 1, name: "Mike's Foundation", trade: "Foundation", phone: "(870) 555-0101", email: "mike@foundation.com", address: "Jonesboro, AR", license: "AR-12345", notes: "Reliable" },
    { id: 2, name: "ABC Framing", trade: "Framing", phone: "(870) 555-0102", email: "", address: "Jonesboro, AR" },
    { id: 3, name: "Pro Electric", trade: "Electrical", phone: "(870) 555-0103", email: "pro@electric.com", license: "AR-34567" },
  ]);
  const [counties, setCounties] = useState([{
    id: 1, name: 'Craighead County', state: 'AR',
    contacts: [
      { id: 1, title: 'Building Inspector', name: 'John Smith', phone: '(870) 933-4340', email: 'inspector@craigheadcounty.gov', address: '511 S Main St, Jonesboro, AR' },
      { id: 2, title: 'Permit Office', name: 'Jane Doe', phone: '(870) 933-4341', email: 'permits@craigheadcounty.gov', address: '511 S Main St, Jonesboro, AR' },
    ]
  }]);
  const [projects, setProjects] = useState([{
    id: 1, name: "123 Main St", address: "123 Main St, Jonesboro, AR", status: "active", county: "Craighead County",
    lotCost: 45000, salePrice: 285000, loanAmount: 200000,
    phases: [...PHASES],
    tasks: TASKS.map((t, i) => ({ ...t, id: i + 1, status: i < 5 ? 'complete' : i < 10 ? 'in_progress' : 'pending', assignedTo: i % 2 === 0 ? 1 : 2 })),
    contractors: [{ id: 1, gid: 1, quote: 8500, payments: [] }, { id: 2, gid: 2, quote: 12000, payments: [] }],
    draws: [
      { id: 1, name: 'Foundation', pct: 15, status: 'received' },
      { id: 2, name: 'Framing', pct: 20, status: 'pending' },
      { id: 3, name: 'Rough-Ins', pct: 15, status: 'pending' },
      { id: 4, name: 'Finishes', pct: 35, status: 'pending' },
      { id: 5, name: 'Final', pct: 15, status: 'pending' },
    ],
  }]);

  const proj = projId ? projects.find(p => p.id === projId) : null;
  const th = {
    bg: dark ? 'bg-slate-900' : 'bg-slate-50',
    card: dark ? 'bg-slate-800' : 'bg-white',
    text: dark ? 'text-slate-100' : 'text-slate-900',
    muted: dark ? 'text-slate-400' : 'text-slate-500',
    border: dark ? 'border-slate-700' : 'border-slate-200',
    input: dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900',
    hover: dark ? 'hover:bg-slate-700' : 'hover:bg-slate-50',
  };

  const calcFin = p => {
    const pcs = p.contractors.map(pc => ({ ...pc, ...contractors.find(c => c.id === pc.gid) }));
    const quotes = pcs.reduce((s, c) => s + (c.quote || 0), 0);
    const paid = p.contractors.reduce((s, c) => s + (c.payments?.reduce((ss, pay) => ss + (parseFloat(pay.amount) || 0), 0) || 0), 0);
    return { quotes, paid, cost: p.lotCost + quotes, profit: p.salePrice - p.lotCost - quotes };
  };
  const getStats = tasks => { const t = tasks.length, c = tasks.filter(x => x.status === 'complete').length; return { total: t, complete: c, pct: t > 0 ? Math.round(c / t * 100) : 0 }; };

  const open = (m, item = null) => { setSel(item); setModal(m); };
  const close = () => { setModal(null); setSel(null); setForm({}); };
  const updateProj = (id, upd) => setProjects(projects.map(p => p.id === id ? { ...p, ...upd } : p));

  // ===== UI =====
  const Card = ({ children, className = '' }) => <div className={`${th.card} rounded-xl border ${th.border} shadow-sm ${className}`}>{children}</div>;
  const Btn = ({ children, v = 'primary', className = '', ...props }) => {
    const vars = { primary: 'bg-blue-600 hover:bg-blue-700 text-white', secondary: `${th.card} border ${th.border} ${th.text} ${th.hover}`, danger: 'bg-red-600 hover:bg-red-700 text-white', success: 'bg-emerald-600 hover:bg-emerald-700 text-white' };
    return <button className={`px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition ${vars[v]} ${className}`} {...props}>{children}</button>;
  };
  const Input = ({ label, ...props }) => <div><label className={`block text-sm font-medium ${th.muted} mb-1`}>{label}</label><input className={`w-full px-4 py-2.5 rounded-lg border ${th.input} focus:ring-2 focus:ring-blue-500`} {...props} /></div>;
  const Sel = ({ label, children, ...props }) => <div><label className={`block text-sm font-medium ${th.muted} mb-1`}>{label}</label><select className={`w-full px-4 py-2.5 rounded-lg border ${th.input}`} {...props}>{children}</select></div>;
  const Badge = ({ color = 'gray', children }) => {
    const c = { gray: 'bg-slate-100 text-slate-600', blue: 'bg-blue-100 text-blue-700', green: 'bg-emerald-100 text-emerald-700', red: 'bg-red-100 text-red-700', amber: 'bg-amber-100 text-amber-700' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c[color]}`}>{children}</span>;
  };
  const Modal = ({ show, title, size = 'md', children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={close}>
        <div className={`${th.card} rounded-2xl shadow-2xl w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
          <div className={`flex justify-between items-center px-6 py-4 border-b ${th.border}`}><h3 className={`text-lg font-semibold ${th.text}`}>{title}</h3><button onClick={close}><X className="w-5 h-5" /></button></div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
        </div>
      </div>
    );
  };

  // ===== Sidebar =====
  const Sidebar = () => (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col shrink-0 transition-all`}>
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-700/50`}>
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><Building2 className="w-5 h-5" /></div>{!collapsed && <span className="font-bold">BuildTrack</span>}</div>
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-800 rounded-lg hidden md:block">{collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}</button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {[{ id: 'dashboard', icon: Home, label: 'Dashboard' }, { id: 'projects', icon: FolderKanban, label: 'Projects' }, { id: 'contractors', icon: Briefcase, label: 'Contractors' }, { id: 'jurisdictions', icon: Landmark, label: 'Jurisdictions' }, { id: 'team', icon: Users, label: 'Team' }].map(i => (
          <button key={i.id} onClick={() => { setView(i.id); setProjId(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${view === i.id && !projId ? 'bg-blue-600' : 'text-slate-300 hover:bg-slate-800'}`}>
            <i.icon className="w-5 h-5 shrink-0" />{!collapsed && <span className="font-medium">{i.label}</span>}
          </button>
        ))}
        {!collapsed && <>
          <div className="pt-6 pb-2 px-3 text-xs text-slate-500 uppercase font-semibold">Projects</div>
          {projects.map(p => (
            <button key={p.id} onClick={() => { setProjId(p.id); setView('project'); setTab('tasks'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${projId === p.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="truncate">{p.name}</span>
            </button>
          ))}
          <button onClick={() => open('addProject')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-800 text-sm"><Plus className="w-4 h-4" />New Project</button>
        </>}
      </nav>
      <div className="p-3 border-t border-slate-700/50">
        <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800">{dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}{!collapsed && <span>{dark ? 'Light' : 'Dark'}</span>}</button>
        <div className={`flex items-center gap-3 px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}><div className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center text-sm font-medium`}>{user.avatar}</div>{!collapsed && <div><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-slate-500">{user.role}</p></div>}</div>
      </div>
    </aside>
  );

  // ===== Views =====
  const Dashboard = () => (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center"><div><h1 className={`text-2xl font-bold ${th.text}`}>Dashboard</h1><p className={th.muted}>Welcome back, {user.name}</p></div><Btn onClick={() => open('addProject')}><Plus className="w-4 h-4" />New Project</Btn></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5"><p className={`text-sm ${th.muted}`}>Active Projects</p><p className={`text-2xl font-bold ${th.text}`}>{projects.length}</p></Card>
        <Card className="p-5"><p className={`text-sm ${th.muted}`}>Total Contractors</p><p className={`text-2xl font-bold ${th.text}`}>{contractors.length}</p></Card>
        <Card className="p-5"><p className={`text-sm ${th.muted}`}>Team Members</p><p className={`text-2xl font-bold ${th.text}`}>{team.length}</p></Card>
      </div>
      <Card className="p-5">
        <h3 className={`font-semibold mb-4 ${th.text}`}>Projects</h3>
        <div className="space-y-3">
          {projects.map(p => {
            const s = getStats(p.tasks), f = calcFin(p);
            return (
              <div key={p.id} onClick={() => { setProjId(p.id); setView('project'); }} className={`p-4 rounded-xl border ${th.border} ${th.hover} cursor-pointer`}>
                <div className="flex justify-between mb-2"><div><p className={`font-medium ${th.text}`}>{p.name}</p><p className={`text-sm ${th.muted}`}>{p.address}</p></div><span className={`font-semibold ${f.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(f.profit)}</span></div>
                <div className="flex items-center gap-3"><div className={`flex-1 h-2 rounded-full ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${s.pct}%` }} /></div><span className={`text-sm ${th.text}`}>{s.pct}%</span></div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const ContractorsView = () => (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center"><div><h1 className={`text-2xl font-bold ${th.text}`}>Contractors</h1><p className={th.muted}>Your contractor directory</p></div><Btn onClick={() => { setForm({ trade: 'General' }); open('addContractor'); }}><Plus className="w-4 h-4" />Add</Btn></div>
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map(c => (
            <div key={c.id} className={`p-4 rounded-xl border ${th.border} group`}>
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">{c.name.substring(0, 2).toUpperCase()}</div><div><h4 className={`font-semibold ${th.text}`}>{c.name}</h4><Badge color="blue">{c.trade}</Badge></div></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => { setForm(c); open('editContractor', c); }} className={`p-2 rounded-lg ${th.hover}`}><Edit2 className="w-4 h-4 text-slate-400" /></button>
                  <button onClick={() => setContractors(contractors.filter(x => x.id !== c.id))} className="p-2 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className={`text-sm ${th.muted} space-y-1`}>
                {c.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><a href={`tel:${c.phone}`} className="hover:text-blue-600">{c.phone}</a></div>}
                {c.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{c.email}</div>}
                {c.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{c.address}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const JurisdictionsView = () => (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center"><div><h1 className={`text-2xl font-bold ${th.text}`}>Jurisdictions</h1><p className={th.muted}>County contacts for permits & inspections</p></div><Btn onClick={() => { setForm({ state: 'AR' }); open('addCounty'); }}><Plus className="w-4 h-4" />Add County</Btn></div>
      {counties.map(county => (
        <Card key={county.id}>
          <div className={`p-5 border-b ${th.border} flex justify-between items-center`}>
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center text-white"><Landmark className="w-5 h-5" /></div><div><h3 className={`font-semibold ${th.text}`}>{county.name}</h3><p className={th.muted}>{county.state}</p></div></div>
            <div className="flex gap-2"><Btn v="secondary" onClick={() => { setForm({}); open('addContact', county); }}><Plus className="w-4 h-4" />Add Contact</Btn><button onClick={() => setCounties(counties.filter(c => c.id !== county.id))} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button></div>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {county.contacts.map(con => (
              <div key={con.id} className={`p-4 rounded-xl border ${th.border} group`}>
                <div className="flex justify-between mb-2"><div><p className={`font-semibold ${th.text}`}>{con.title}</p><p className={`text-sm ${th.muted}`}>{con.name}</p></div><button onClick={() => setCounties(counties.map(c => c.id === county.id ? { ...c, contacts: c.contacts.filter(x => x.id !== con.id) } : c))} className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 text-red-500" /></button></div>
                <div className={`text-sm ${th.muted} space-y-1`}>
                  {con.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><a href={`tel:${con.phone}`} className="hover:text-blue-600 font-medium">{con.phone}</a></div>}
                  {con.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{con.email}</div>}
                  {con.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /><span className="text-xs">{con.address}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const TeamView = () => (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center"><div><h1 className={`text-2xl font-bold ${th.text}`}>Team</h1></div><Btn onClick={() => { setForm({ role: 'partner' }); open('addTeam'); }}><UserPlus className="w-4 h-4" />Add</Btn></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map(m => (
          <Card key={m.id} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${m.color} flex items-center justify-center text-white font-bold text-xl`}>{m.avatar}</div>
              <div className="flex-1"><div className="flex items-center gap-2 mb-1"><h3 className={`font-semibold ${th.text}`}>{m.name}</h3><Badge color={m.role === 'admin' ? 'blue' : 'gray'}>{m.role}</Badge></div><p className={`text-sm ${th.muted}`}>{m.email}</p></div>
              {m.id !== user.id && <button onClick={() => setTeam(team.filter(t => t.id !== m.id))} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const ProjectsList = () => (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center"><h1 className={`text-2xl font-bold ${th.text}`}>Projects</h1><Btn onClick={() => open('addProject')}><Plus className="w-4 h-4" />New</Btn></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(p => {
          const s = getStats(p.tasks), f = calcFin(p);
          return (
            <Card key={p.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => { setProjId(p.id); setView('project'); }}>
              <div className="p-5">
                <div className="flex justify-between mb-3"><div><h3 className={`font-semibold ${th.text}`}>{p.name}</h3><p className={`text-sm ${th.muted}`}>{p.address}</p></div><Badge color="green">{p.status}</Badge></div>
                <div className="mb-3"><div className="flex justify-between text-sm mb-1"><span className={th.muted}>Progress</span><span className={th.text}>{s.pct}%</span></div><div className={`h-2 rounded-full ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${s.pct}%` }} /></div></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700/50' : 'bg-slate-50'}`}><p className={`text-xs ${th.muted}`}>Profit</p><p className={`font-bold ${f.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(f.profit)}</p></div>
                  <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700/50' : 'bg-slate-50'}`}><p className={`text-xs ${th.muted}`}>Spent</p><p className={`font-bold ${th.text}`}>{fmt(f.paid)}</p></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // ===== Project Detail =====
  const ProjectDetail = () => {
    if (!proj) return null;
    const fin = calcFin(proj);
    const stats = getStats(proj.tasks);
    const pcs = proj.contractors.map(pc => ({ ...pc, ...contractors.find(c => c.id === pc.gid) }));
    const county = counties.find(c => c.name === proj.county);
    const tasksByPhase = {};
    proj.phases.forEach(ph => tasksByPhase[ph] = []);
    proj.tasks.filter(t => !search || t.task.toLowerCase().includes(search.toLowerCase())).forEach(t => { if (tasksByPhase[t.phase]) tasksByPhase[t.phase].push(t); });

    return (
      <div className={`flex-1 flex flex-col overflow-hidden ${th.bg}`}>
        <header className={`${th.card} border-b ${th.border} px-6 py-4 shrink-0`}>
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={() => { setView('projects'); setProjId(null); }} className={`p-2 rounded-lg ${th.hover}`}><ChevronLeft className="w-5 h-5" /></button>
              <div><h1 className={`text-xl font-bold ${th.text}`}>{proj.name}</h1><p className={`text-sm ${th.muted}`}>{proj.address}</p></div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2"><div className={`w-20 h-2 rounded-full ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.pct}%` }} /></div><span className={`text-sm font-semibold ${th.text}`}>{stats.pct}%</span></div>
              <span className={`font-bold ${fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(fin.profit)}</span>
            </div>
          </div>
        </header>

        <div className={`${th.card} border-b ${th.border} px-6 shrink-0`}>
          <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
            {['tasks', 'contractors', 'draws', 'financials', 'contacts', 'settings'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 border-b-2 text-sm font-medium capitalize ${tab === t ? 'border-blue-600 text-blue-600' : `border-transparent ${th.muted}`}`}>{t}</button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {tab === 'tasks' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-48 relative"><Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${th.muted}`} /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${th.input}`} /></div>
                  <Btn onClick={() => { setForm({ phase: proj.phases[0], days: 1 }); open('addTask'); }}><Plus className="w-4 h-4" />Add Task</Btn>
                </div>
                <div className="space-y-3">
                  {proj.phases.map(phase => (
                    <Card key={phase}>
                      <button onClick={() => setExpanded(p => ({ ...p, [phase]: p[phase] === false }))} className={`w-full flex justify-between items-center px-5 py-3 ${dark ? 'bg-slate-750' : 'bg-slate-50'} rounded-t-xl`}>
                        <div className="flex items-center gap-3">{expanded[phase] === false ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}<span className={`font-semibold ${th.text}`}>{phase}</span><Badge color="gray">{tasksByPhase[phase]?.length || 0}</Badge></div>
                        <span className="text-sm text-emerald-600">{tasksByPhase[phase]?.filter(t => t.status === 'complete').length || 0} done</span>
                      </button>
                      {expanded[phase] !== false && (
                        <div className={`divide-y ${th.border}`}>
                          {(tasksByPhase[phase] || []).map(task => (
                            <div key={task.id} className={`flex items-center gap-3 px-5 py-3 ${th.hover} group ${task.inspection ? (dark ? 'bg-red-900/20' : 'bg-red-50') : ''}`}>
                              <select value={task.status} onChange={e => updateProj(projId, { tasks: proj.tasks.map(t => t.id === task.id ? { ...t, status: e.target.value } : t) })} className={`text-xs px-2 py-1 rounded-full font-medium ${task.status === 'complete' ? 'bg-emerald-100 text-emerald-700' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="complete">Complete</option>
                              </select>
                              <div className="flex-1 min-w-0"><p className={`text-sm font-medium truncate ${task.status === 'complete' ? 'line-through text-slate-400' : th.text}`}>{task.task}</p></div>
                              {task.assignedTo && <div className={`w-6 h-6 rounded-full ${team.find(m => m.id === task.assignedTo)?.color || 'bg-slate-400'} text-white text-xs flex items-center justify-center`}>{team.find(m => m.id === task.assignedTo)?.avatar?.[0]}</div>}
                              <span className={`text-xs ${th.muted}`}>{task.days}d</span>
                              <button onClick={() => { setForm(task); open('editTask', task); }} className={`p-1 rounded ${th.hover} opacity-0 group-hover:opacity-100`}><Edit2 className="w-4 h-4 text-slate-400" /></button>
                              <button onClick={() => updateProj(projId, { tasks: proj.tasks.filter(t => t.id !== task.id) })} className="p-1 rounded hover:bg-red-100 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {tab === 'contractors' && (
              <div className="space-y-6">
                <div className="flex justify-between"><h3 className={`font-semibold ${th.text}`}>Project Contractors</h3><Btn onClick={() => open('addProjectContractor')}><Plus className="w-4 h-4" />Add from Directory</Btn></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {pcs.map(c => {
                    const paid = c.payments?.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) || 0;
                    return (
                      <Card key={c.id}>
                        <div className="p-5">
                          <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">{c.name?.substring(0, 2).toUpperCase()}</div><div><h4 className={`font-semibold ${th.text}`}>{c.name}</h4><Badge color="blue">{c.trade}</Badge></div></div>
                            <button onClick={() => updateProj(projId, { contractors: proj.contractors.filter(pc => pc.id !== c.id) })} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                          </div>
                          <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl mb-4 ${dark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div><p className={`text-xs ${th.muted}`}>Quote</p><p className={`font-bold ${th.text}`}>{fmt(c.quote)}</p></div>
                            <div><p className={`text-xs ${th.muted}`}>Paid</p><p className="font-bold text-emerald-600">{fmt(paid)}</p></div>
                            <div><p className={`text-xs ${th.muted}`}>Remaining</p><p className={`font-bold ${(c.quote || 0) - paid > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{fmt((c.quote || 0) - paid)}</p></div>
                          </div>
                          <div className={`text-sm ${th.muted} space-y-1 mb-4`}>{c.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><a href={`tel:${c.phone}`} className="hover:text-blue-600">{c.phone}</a></div>}{c.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{c.email}</div>}</div>
                          <div className="flex gap-2">
                            <Btn v="success" className="flex-1" onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], method: 'check', account: 'Business Checking', paidBy: user.name, amount: '' }); open('addPayment', c); }}><DollarSign className="w-4 h-4" />Record Payment</Btn>
                            <Btn v="secondary" onClick={() => { const q = prompt('Enter quote:', c.quote); if (q) updateProj(projId, { contractors: proj.contractors.map(pc => pc.id === c.id ? { ...pc, quote: parseFloat(q) || 0 } : pc) }); }}><Edit2 className="w-4 h-4" /></Btn>
                          </div>
                        </div>
                        {c.payments && c.payments.length > 0 && (
                          <div className={`px-5 py-4 border-t ${th.border}`}>
                            <h5 className={`text-sm font-semibold mb-3 ${th.text}`}>Payment History</h5>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {c.payments.map(p => (
                                <div key={p.id} onClick={() => { setSel({ ...p, contractor: c }); open('viewPayment'); }} className={`flex justify-between items-center p-3 rounded-lg ${dark ? 'bg-slate-700/50' : 'bg-slate-50'} cursor-pointer ${th.hover} group`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${dark ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center`}>{METHODS.find(m => m.id === p.method)?.icon && React.createElement(METHODS.find(m => m.id === p.method).icon, { className: 'w-4 h-4 text-slate-500' })}</div>
                                    <div><p className={`text-sm font-semibold ${th.text}`}>{fmt(p.amount)}</p><p className={`text-xs ${th.muted}`}>{METHODS.find(m => m.id === p.method)?.label}{p.refNumber && ` #${p.refNumber}`}</p></div>
                                  </div>
                                  <div className="text-right flex items-center gap-2">
                                    <span className={`text-xs ${th.muted}`}>{p.date}</span>
                                    <button onClick={e => { e.stopPropagation(); if (confirm('Delete payment?')) updateProj(projId, { contractors: proj.contractors.map(pc => pc.id === c.id ? { ...pc, payments: pc.payments.filter(x => x.id !== p.id) } : pc) }); }} className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-red-500" /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
                {pcs.length === 0 && <Card className="p-8 text-center"><Briefcase className={`w-12 h-12 mx-auto mb-3 ${th.muted} opacity-30`} /><p className={th.muted}>No contractors added</p></Card>}
              </div>
            )}

            {tab === 'draws' && (
              <Card>
                <div className={`p-5 border-b ${th.border}`}><h3 className={`font-semibold ${th.text}`}>Construction Draw Schedule</h3><p className={th.muted}>Loan: {fmt(proj.loanAmount)}</p></div>
                <table className="w-full">
                  <thead><tr className={`${dark ? 'bg-slate-750' : 'bg-slate-50'} ${th.muted}`}><th className="text-left px-5 py-3">Draw</th><th className="text-right px-5 py-3">%</th><th className="text-right px-5 py-3">Amount</th><th className="text-center px-5 py-3">Status</th></tr></thead>
                  <tbody>
                    {proj.draws.map(d => (
                      <tr key={d.id} className={`border-t ${th.border}`}>
                        <td className={`px-5 py-4 font-medium ${th.text}`}>{d.name}</td>
                        <td className={`px-5 py-4 text-right ${th.text}`}>{d.pct}%</td>
                        <td className={`px-5 py-4 text-right font-semibold ${th.text}`}>{fmt(proj.loanAmount * d.pct / 100)}</td>
                        <td className="px-5 py-4 text-center">
                          <select value={d.status} onChange={e => updateProj(projId, { draws: proj.draws.map(dr => dr.id === d.id ? { ...dr, status: e.target.value } : dr) })} className={`text-xs px-3 py-1.5 rounded-full font-medium ${d.status === 'received' ? 'bg-emerald-100 text-emerald-700' : d.status === 'requested' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            <option value="pending">Pending</option><option value="requested">Requested</option><option value="received">Received</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {tab === 'financials' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5"><p className={`text-sm ${th.muted}`}>Sale Price</p><p className={`text-2xl font-bold ${th.text}`}>{fmt(proj.salePrice)}</p></Card>
                <Card className="p-5"><p className={`text-sm ${th.muted}`}>Est. Cost</p><p className={`text-2xl font-bold ${th.text}`}>{fmt(fin.cost)}</p></Card>
                <Card className="p-5"><p className={`text-sm ${th.muted}`}>Est. Profit</p><p className={`text-2xl font-bold ${fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(fin.profit)}</p></Card>
              </div>
            )}

            {tab === 'contacts' && county && (
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Landmark className="w-6 h-6 text-purple-600" /><div><h3 className={`font-semibold ${th.text}`}>{county.name}</h3><p className={th.muted}>Jurisdiction contacts</p></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {county.contacts.map(c => (
                    <Card key={c.id} className="p-5">
                      <p className={`font-semibold ${th.text}`}>{c.title}</p>
                      <p className={`text-sm ${th.muted} mb-2`}>{c.name}</p>
                      <div className={`text-sm ${th.muted} space-y-1`}>
                        {c.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><a href={`tel:${c.phone}`} className="hover:text-blue-600 font-medium">{c.phone}</a></div>}
                        {c.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{c.email}</div>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <Card className="p-5">
                  <h4 className={`font-semibold mb-4 ${th.text}`}>Project Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Name" value={proj.name} onChange={e => updateProj(projId, { name: e.target.value })} />
                    <Input label="Address" value={proj.address} onChange={e => updateProj(projId, { address: e.target.value })} />
                    <Input label="Lot Cost" type="number" value={proj.lotCost} onChange={e => updateProj(projId, { lotCost: parseFloat(e.target.value) || 0 })} />
                    <Input label="Sale Price" type="number" value={proj.salePrice} onChange={e => updateProj(projId, { salePrice: parseFloat(e.target.value) || 0 })} />
                    <Input label="Loan Amount" type="number" value={proj.loanAmount} onChange={e => updateProj(projId, { loanAmount: parseFloat(e.target.value) || 0 })} />
                    <Sel label="County" value={proj.county} onChange={e => updateProj(projId, { county: e.target.value })}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</Sel>
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="flex justify-between items-center mb-4"><h4 className={`font-semibold ${th.text}`}>Phases</h4><Btn v="secondary" onClick={() => { const n = prompt('Phase name:'); if (n) updateProj(projId, { phases: [...proj.phases, n] }); }}><Plus className="w-4 h-4" />Add</Btn></div>
                  <div className="space-y-2">
                    {proj.phases.map((ph, i) => {
                      const cnt = proj.tasks.filter(t => t.phase === ph).length;
                      return (
                        <div key={ph} className={`flex items-center justify-between p-3 rounded-lg ${dark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                          <div className="flex items-center gap-3"><span className={th.muted}>{i + 1}.</span><span className={`font-medium ${th.text}`}>{ph}</span><Badge color="gray">{cnt} tasks</Badge></div>
                          <div className="flex gap-2">
                            <button onClick={() => open('viewPhase', ph)} className="text-sm text-blue-600">View</button>
                            <button onClick={() => { if (cnt > 0) return alert('Move tasks first'); updateProj(projId, { phases: proj.phases.filter(p => p !== ph) }); }} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <Card className="p-5 border-red-300">
                  <h4 className="font-semibold text-red-600 mb-3">Danger Zone</h4>
                  <Btn v="danger" onClick={() => { if (confirm('Delete project?')) { setProjects(projects.filter(p => p.id !== projId)); setView('projects'); setProjId(null); } }}>Delete Project</Btn>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  // ===== Render =====
  return (
    <div className={`h-screen flex overflow-hidden ${th.bg}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'dashboard' && <Dashboard />}
        {view === 'projects' && <ProjectsList />}
        {view === 'contractors' && <ContractorsView />}
        {view === 'jurisdictions' && <JurisdictionsView />}
        {view === 'team' && <TeamView />}
        {view === 'project' && <ProjectDetail />}
      </div>

      {/* MODALS */}
      <Modal show={modal === 'addPayment'} title="Record Payment">
        <div className={`p-4 rounded-xl mb-4 ${dark ? 'bg-slate-700' : 'bg-slate-50'}`}><p className={`text-sm ${th.muted}`}>Recording payment to:</p><p className={`font-semibold ${th.text}`}>{sel?.name}</p></div>
        <div className="space-y-4">
          <Input label="Amount *" type="text" placeholder="0.00" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value.replace(/[^0-9.]/g, '') })} />
          <Input label="Date *" type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Sel label="Payment Method" value={form.method || 'check'} onChange={e => setForm({ ...form, method: e.target.value })}>{METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</Sel>
          {METHODS.find(m => m.id === form.method)?.needsRef && <Input label={METHODS.find(m => m.id === form.method)?.refLabel} value={form.refNumber || ''} onChange={e => setForm({ ...form, refNumber: e.target.value })} />}
          <Sel label="Paid From Account" value={form.account || ''} onChange={e => setForm({ ...form, account: e.target.value })}>{ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}</Sel>
          <Input label="Paid By" value={form.paidBy || ''} onChange={e => setForm({ ...form, paidBy: e.target.value })} />
          <Input label="Memo / Notes" value={form.memo || ''} onChange={e => setForm({ ...form, memo: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn v="success" className="flex-1" onClick={() => { if (!form.amount || !form.date) return; updateProj(projId, { contractors: proj.contractors.map(c => c.id === sel.id ? { ...c, payments: [...(c.payments || []), { ...form, id: Date.now(), amount: parseFloat(form.amount) || 0 }] } : c) }); close(); }}>Record Payment</Btn></div>
      </Modal>

      <Modal show={modal === 'viewPayment'} title="Payment Details">
        {sel && (
          <div className="space-y-4">
            <div className={`p-6 rounded-xl ${dark ? 'bg-slate-700' : 'bg-slate-50'} text-center`}><p className={`text-3xl font-bold ${th.text}`}>{fmt(sel.amount)}</p><p className={th.muted}>to {sel.contractor?.name}</p></div>
            <div className="space-y-3">
              {[{ l: 'Date', v: sel.date }, { l: 'Method', v: METHODS.find(m => m.id === sel.method)?.label }, { l: 'Reference #', v: sel.refNumber }, { l: 'Account', v: sel.account }, { l: 'Paid By', v: sel.paidBy }, { l: 'Memo', v: sel.memo }].filter(x => x.v).map(x => (
                <div key={x.l} className={`flex justify-between py-2 border-b ${th.border}`}><span className={th.muted}>{x.l}</span><span className={`font-medium ${th.text}`}>{x.v}</span></div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Btn v="secondary" className="flex-1" onClick={() => { setForm(sel); close(); open('editPayment', sel); }}><Edit2 className="w-4 h-4" />Edit</Btn>
              <Btn v="danger" className="flex-1" onClick={() => { if (confirm('Delete?')) { updateProj(projId, { contractors: proj.contractors.map(c => c.id === sel.contractor?.id ? { ...c, payments: c.payments.filter(p => p.id !== sel.id) } : c) }); close(); } }}><Trash2 className="w-4 h-4" />Delete</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal show={modal === 'editPayment'} title="Edit Payment">
        <div className="space-y-4">
          <Input label="Amount" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value.replace(/[^0-9.]/g, '') })} />
          <Input label="Date" type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Sel label="Method" value={form.method || 'check'} onChange={e => setForm({ ...form, method: e.target.value })}>{METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</Sel>
          {METHODS.find(m => m.id === form.method)?.needsRef && <Input label="Reference #" value={form.refNumber || ''} onChange={e => setForm({ ...form, refNumber: e.target.value })} />}
          <Sel label="Account" value={form.account || ''} onChange={e => setForm({ ...form, account: e.target.value })}>{ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}</Sel>
          <Input label="Paid By" value={form.paidBy || ''} onChange={e => setForm({ ...form, paidBy: e.target.value })} />
          <Input label="Memo" value={form.memo || ''} onChange={e => setForm({ ...form, memo: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { updateProj(projId, { contractors: proj.contractors.map(c => c.id === sel.contractor?.id ? { ...c, payments: c.payments.map(p => p.id === sel.id ? { ...form, id: sel.id, amount: parseFloat(form.amount) || 0 } : p) } : c) }); close(); }}>Save</Btn></div>
      </Modal>

      <Modal show={modal === 'addContractor'} title="Add Contractor">
        <div className="space-y-4">
          <Input label="Company / Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Sel label="Trade" value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</Sel>
          <div className="grid grid-cols-2 gap-4"><Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /><Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <Input label="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
          <Input label="License #" value={form.license || ''} onChange={e => setForm({ ...form, license: e.target.value })} />
          <Input label="Notes" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name) return; setContractors([...contractors, { ...form, id: Date.now() }]); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'editContractor'} title="Edit Contractor">
        <div className="space-y-4">
          <Input label="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Sel label="Trade" value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</Sel>
          <div className="grid grid-cols-2 gap-4"><Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /><Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <Input label="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
          <Input label="License #" value={form.license || ''} onChange={e => setForm({ ...form, license: e.target.value })} />
          <Input label="Notes" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { setContractors(contractors.map(c => c.id === sel.id ? { ...form, id: sel.id } : c)); close(); }}>Save</Btn></div>
      </Modal>

      <Modal show={modal === 'addProjectContractor'} title="Add Contractor to Project" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {contractors.map(c => {
            const added = proj?.contractors.find(pc => pc.gid === c.id);
            return (
              <div key={c.id} className={`p-4 rounded-xl border ${th.border} ${added ? 'opacity-50' : `${th.hover} cursor-pointer`}`} onClick={() => { if (!added) { updateProj(projId, { contractors: [...proj.contractors, { id: Date.now(), gid: c.id, quote: 0, payments: [] }] }); } }}>
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">{c.name.substring(0, 2).toUpperCase()}</div><div><p className={`font-medium ${th.text}`}>{c.name}</p><p className={`text-sm ${th.muted}`}>{c.trade}</p></div>{added ? <Badge color="green">Added</Badge> : <Plus className="ml-auto w-5 h-5 text-blue-600" />}</div>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal show={modal === 'addCounty'} title="Add County">
        <div className="space-y-4">
          <Input label="County Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="State" value={form.state || 'AR'} onChange={e => setForm({ ...form, state: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name) return; setCounties([...counties, { ...form, id: Date.now(), contacts: [] }]); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'addContact'} title="Add Contact">
        <div className="space-y-4">
          <Input label="Title *" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Building Inspector" />
          <Input label="Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4"><Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /><Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <Input label="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.title) return; setCounties(counties.map(c => c.id === sel.id ? { ...c, contacts: [...c.contacts, { ...form, id: Date.now() }] } : c)); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'addTask'} title="Add Task">
        <div className="space-y-4">
          <Sel label="Phase *" value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</Sel>
          <Input label="Task Name *" value={form.task || ''} onChange={e => setForm({ ...form, task: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Est. Days" type="number" value={form.days || 1} onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 1 })} />
            <Sel label="Assign To" value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })}><option value="">Unassigned</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</Sel>
          </div>
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.task || !form.phase) return; updateProj(projId, { tasks: [...proj.tasks, { ...form, id: Date.now(), status: 'pending' }] }); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'editTask'} title="Edit Task">
        <div className="space-y-4">
          <Sel label="Phase" value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</Sel>
          <Input label="Task Name" value={form.task || ''} onChange={e => setForm({ ...form, task: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Sel label="Status" value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="complete">Complete</option></Sel>
            <Input label="Est. Days" type="number" value={form.days || 1} onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 1 })} />
          </div>
          <Sel label="Assign To" value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })}><option value="">Unassigned</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</Sel>
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { updateProj(projId, { tasks: proj.tasks.map(t => t.id === sel.id ? { ...form, id: sel.id } : t) }); close(); }}>Save</Btn></div>
      </Modal>

      <Modal show={modal === 'viewPhase'} title={`Phase: ${sel}`} size="lg">
        {sel && proj && (
          <div className="space-y-4">
            <div className="flex justify-between"><p className={th.muted}>{proj.tasks.filter(t => t.phase === sel).length} tasks</p><Btn onClick={() => { close(); setForm({ phase: sel, days: 1 }); open('addTask'); }}><Plus className="w-4 h-4" />Add Task</Btn></div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {proj.tasks.filter(t => t.phase === sel).map(task => (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border ${th.border} ${th.hover}`}>
                  <div className={`w-3 h-3 rounded-full ${task.status === 'complete' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                  <div className="flex-1"><p className={`font-medium ${th.text}`}>{task.task}</p></div>
                  <Badge color={task.status === 'complete' ? 'green' : task.status === 'in_progress' ? 'blue' : 'gray'}>{task.status.replace('_', ' ')}</Badge>
                  <button onClick={() => { setForm(task); close(); open('editTask', task); }} className={`p-1 rounded ${th.hover}`}><Edit2 className="w-4 h-4 text-slate-400" /></button>
                  <button onClick={() => updateProj(projId, { tasks: proj.tasks.filter(t => t.id !== task.id) })} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal show={modal === 'addProject'} title="New Project">
        <div className="space-y-4">
          <Input label="Project Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="123 Main St" />
          <Input label="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Lot Cost" type="number" value={form.lotCost || ''} onChange={e => setForm({ ...form, lotCost: e.target.value })} />
            <Input label="Sale Price" type="number" value={form.salePrice || ''} onChange={e => setForm({ ...form, salePrice: e.target.value })} />
          </div>
          <Input label="Loan Amount" type="number" value={form.loanAmount || ''} onChange={e => setForm({ ...form, loanAmount: e.target.value })} />
          <Sel label="County" value={form.county || counties[0]?.name} onChange={e => setForm({ ...form, county: e.target.value })}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</Sel>
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name) return; setProjects([...projects, { ...form, id: Date.now(), status: 'active', phases: [...PHASES], lotCost: parseFloat(form.lotCost) || 0, salePrice: parseFloat(form.salePrice) || 0, loanAmount: parseFloat(form.loanAmount) || 0, tasks: TASKS.map((t, i) => ({ ...t, id: Date.now() + i, status: 'pending', assignedTo: null })), contractors: [], draws: [{ id: 1, name: 'Foundation', pct: 15, status: 'pending' }, { id: 2, name: 'Framing', pct: 20, status: 'pending' }, { id: 3, name: 'Rough-Ins', pct: 15, status: 'pending' }, { id: 4, name: 'Finishes', pct: 35, status: 'pending' }, { id: 5, name: 'Final', pct: 15, status: 'pending' }] }]); close(); }}>Create</Btn></div>
      </Modal>

      <Modal show={modal === 'addTeam'} title="Add Team Member">
        <div className="space-y-4">
          <Input label="Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email *" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Sel label="Role" value={form.role || 'partner'} onChange={e => setForm({ ...form, role: e.target.value })}><option value="admin">Admin</option><option value="partner">Partner</option><option value="viewer">Viewer</option></Sel>
        </div>
        <div className="flex gap-3 mt-6"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name || !form.email) return; setTeam([...team, { ...form, id: Date.now(), avatar: form.name.substring(0, 2).toUpperCase(), color: ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-orange-600'][team.length % 4] }]); close(); }}>Add</Btn></div>
      </Modal>
    </div>
  );
}
