import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Users, DollarSign, Building2, Phone, Mail, X, ChevronDown, Settings, Edit2, CreditCard, Banknote, Building, Wallet, Home, FolderKanban, Search, Moon, Sun, User, UserPlus, Briefcase, MapPin, Landmark, Globe } from 'lucide-react';

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

const fmt = n => n == null || n === '' ? '' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

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
    bg: dark ? 'bg-slate-900' : 'bg-gray-50',
    card: dark ? 'bg-slate-800' : 'bg-white',
    text: dark ? 'text-white' : 'text-gray-900',
    muted: dark ? 'text-slate-400' : 'text-gray-500',
    border: dark ? 'border-slate-700' : 'border-gray-200',
    input: dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    hover: dark ? 'hover:bg-slate-700' : 'hover:bg-gray-50',
  };

  const calcFin = p => {
    const pcs = p.contractors.map(pc => ({ ...pc, ...contractors.find(c => c.id === pc.gid) }));
    const quotes = pcs.reduce((s, c) => s + (c.quote || 0), 0);
    const paid = p.contractors.reduce((s, c) => s + (c.payments?.reduce((ss, pay) => ss + (parseFloat(pay.amount) || 0), 0) || 0), 0);
    return { quotes, paid, cost: p.lotCost + quotes, profit: p.salePrice - p.lotCost - quotes };
  };
  const getStats = tasks => { const t = tasks.length, c = tasks.filter(x => x.status === 'complete').length; return { total: t, complete: c, pct: t > 0 ? Math.round(c / t * 100) : 0 }; };

  const openProject = (id) => { setProjId(id); setView('project'); setTab('tasks'); };
  const open = (m, item = null) => { setSel(item); setModal(m); };
  const close = () => { setModal(null); setSel(null); setForm({}); };
  const updateProj = (id, upd) => setProjects(projects.map(p => p.id === id ? { ...p, ...upd } : p));

  // ===== UI Components =====
  const Input = ({ label, ...props }) => <div><label className={`block text-xs font-medium ${th.muted} mb-1`}>{label}</label><input className={`w-full px-3 py-2 rounded-lg border ${th.input} text-sm`} {...props} /></div>;
  const Sel = ({ label, children, ...props }) => <div><label className={`block text-xs font-medium ${th.muted} mb-1`}>{label}</label><select className={`w-full px-3 py-2 rounded-lg border ${th.input} text-sm`} {...props}>{children}</select></div>;
  
  const Badge = ({ color = 'gray', children }) => {
    const colors = { gray: 'bg-gray-100 text-gray-600', blue: 'bg-blue-50 text-blue-600', green: 'bg-emerald-50 text-emerald-600', red: 'bg-red-50 text-red-600', amber: 'bg-amber-50 text-amber-600' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>{children}</span>;
  };
  
  const Btn = ({ children, v = 'primary', size = 'md', className = '', ...props }) => {
    const vars = { primary: 'bg-blue-600 hover:bg-blue-700 text-white', secondary: `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`, danger: 'bg-red-600 hover:bg-red-700 text-white', success: 'bg-emerald-600 hover:bg-emerald-700 text-white' };
    const sizes = { sm: 'px-2.5 py-1.5 text-xs', md: 'px-3 py-2 text-sm' };
    return <button className={`rounded-lg font-medium flex items-center justify-center gap-1.5 transition ${vars[v]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
  };

  const Modal = ({ show, title, size = 'md', children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={close}>
        <div className={`${th.card} rounded-xl shadow-xl w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-md'} max-h-[85vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
          <div className={`flex justify-between items-center px-4 py-3 border-b ${th.border}`}><h3 className={`font-semibold ${th.text}`}>{title}</h3><button onClick={close} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button></div>
          <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">{children}</div>
        </div>
      </div>
    );
  };

  // ===== Sidebar =====
  const Sidebar = () => (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-slate-900 text-white flex flex-col shrink-0 transition-all`}>
      <div className={`p-3 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-800`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
          {!collapsed && <span className="font-semibold text-sm">BuildTrack</span>}
        </div>
        {!collapsed && <button onClick={() => setCollapsed(true)} className="p-1 hover:bg-slate-800 rounded"><ChevronLeft className="w-4 h-4" /></button>}
        {collapsed && <button onClick={() => setCollapsed(false)} className="p-1 hover:bg-slate-800 rounded absolute left-16 -ml-3 bg-slate-800 rounded-full"><ChevronRight className="w-3 h-3" /></button>}
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {[{ id: 'dashboard', icon: Home, label: 'Dashboard' }, { id: 'projects', icon: FolderKanban, label: 'Projects' }, { id: 'contractors', icon: Briefcase, label: 'Contractors' }, { id: 'jurisdictions', icon: Landmark, label: 'Jurisdictions' }, { id: 'team', icon: Users, label: 'Team' }].map(i => (
          <button key={i.id} onClick={() => { setView(i.id); setProjId(null); }} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition ${view === i.id && !projId ? 'bg-blue-600' : 'text-slate-300 hover:bg-slate-800'}`}>
            <i.icon className="w-4 h-4 shrink-0" />{!collapsed && <span>{i.label}</span>}
          </button>
        ))}
        {!collapsed && <>
          <div className="pt-4 pb-1 px-2 text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Projects</div>
          {projects.map(p => (
            <button key={p.id} onClick={() => openProject(p.id)} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${projId === p.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="truncate">{p.name}</span>
            </button>
          ))}
          <button onClick={() => open('addProject')} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-800"><Plus className="w-3 h-3" />New Project</button>
        </>}
      </nav>
      <div className="p-2 border-t border-slate-800">
        <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{!collapsed && <span>{dark ? 'Light' : 'Dark'}</span>}</button>
        <div className={`flex items-center gap-2 px-2.5 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className={`w-7 h-7 rounded-full ${user.color} flex items-center justify-center text-xs font-medium`}>{user.avatar}</div>
          {!collapsed && <div><p className="text-xs font-medium">{user.name}</p><p className="text-[10px] text-slate-500">{user.role}</p></div>}
        </div>
      </div>
    </aside>
  );

  // ===== Dashboard =====
  const Dashboard = () => (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <div><h1 className={`text-xl font-bold ${th.text}`}>Dashboard</h1><p className={`text-sm ${th.muted}`}>Welcome back, {user.name}</p></div>
        <Btn onClick={() => open('addProject')}><Plus className="w-4 h-4" />New Project</Btn>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className={`${th.card} rounded-lg border ${th.border} p-3`}><p className={`text-xs ${th.muted}`}>Active Projects</p><p className={`text-xl font-bold ${th.text}`}>{projects.length}</p></div>
        <div className={`${th.card} rounded-lg border ${th.border} p-3`}><p className={`text-xs ${th.muted}`}>Contractors</p><p className={`text-xl font-bold ${th.text}`}>{contractors.length}</p></div>
        <div className={`${th.card} rounded-lg border ${th.border} p-3`}><p className={`text-xs ${th.muted}`}>Team</p><p className={`text-xl font-bold ${th.text}`}>{team.length}</p></div>
      </div>
      <div className={`${th.card} rounded-lg border ${th.border} p-4`}>
        <h3 className={`font-semibold text-sm mb-3 ${th.text}`}>Projects</h3>
        <div className="space-y-2">
          {projects.map(p => {
            const s = getStats(p.tasks), f = calcFin(p);
            return (
              <div key={p.id} onClick={() => openProject(p.id)} className={`p-3 rounded-lg border ${th.border} ${th.hover} cursor-pointer transition`}>
                <div className="flex justify-between items-start mb-2">
                  <div><p className={`font-medium text-sm ${th.text}`}>{p.name}</p><p className={`text-xs ${th.muted}`}>{p.address}</p></div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${f.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(f.profit)}</span>
                    <Badge color="green">Active</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2"><div className={`flex-1 h-1.5 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${s.pct}%` }} /></div><span className={`text-xs font-medium ${th.text}`}>{s.pct}%</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ===== Contractors =====
  const ContractorsView = () => (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <div><h1 className={`text-xl font-bold ${th.text}`}>Contractors</h1><p className={`text-sm ${th.muted}`}>Your contractor directory</p></div>
        <Btn onClick={() => { setForm({ trade: 'General' }); open('addContractor'); }}><Plus className="w-4 h-4" />Add</Btn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {contractors.map(c => (
          <div key={c.id} className={`${th.card} rounded-lg border ${th.border} p-3 group`}>
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{c.name.substring(0, 2).toUpperCase()}</div>
                <div><h4 className={`font-medium text-sm ${th.text}`}>{c.name}</h4><Badge color="blue">{c.trade}</Badge></div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button onClick={() => { setForm(c); open('editContractor', c); }} className="p-1 hover:bg-gray-100 rounded"><Edit2 className="w-3 h-3 text-gray-400" /></button>
                <button onClick={() => setContractors(contractors.filter(x => x.id !== c.id))} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
              </div>
            </div>
            <div className={`text-xs ${th.muted} space-y-0.5`}>
              {c.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /><a href={`tel:${c.phone}`} className="hover:text-blue-600">{c.phone}</a></div>}
              {c.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{c.email}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== Jurisdictions =====
  const JurisdictionsView = () => (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <div><h1 className={`text-xl font-bold ${th.text}`}>Jurisdictions</h1><p className={`text-sm ${th.muted}`}>County contacts</p></div>
        <Btn onClick={() => { setForm({ state: 'AR' }); open('addCounty'); }}><Plus className="w-4 h-4" />Add County</Btn>
      </div>
      {counties.map(county => (
        <div key={county.id} className={`${th.card} rounded-lg border ${th.border}`}>
          <div className={`px-4 py-3 border-b ${th.border} flex justify-between items-center`}>
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white"><Landmark className="w-4 h-4" /></div><div><h3 className={`font-semibold text-sm ${th.text}`}>{county.name}</h3><p className={`text-xs ${th.muted}`}>{county.state}</p></div></div>
            <div className="flex gap-2"><Btn v="secondary" size="sm" onClick={() => { setForm({}); open('addContact', county); }}><Plus className="w-3 h-3" />Contact</Btn><button onClick={() => setCounties(counties.filter(c => c.id !== county.id))} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button></div>
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {county.contacts.map(con => (
              <div key={con.id} className={`p-3 rounded-lg border ${th.border} group`}>
                <div className="flex justify-between mb-1"><div><p className={`font-medium text-sm ${th.text}`}>{con.title}</p><p className={`text-xs ${th.muted}`}>{con.name}</p></div><button onClick={() => setCounties(counties.map(c => c.id === county.id ? { ...c, contacts: c.contacts.filter(x => x.id !== con.id) } : c))} className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-red-500" /></button></div>
                <div className={`text-xs ${th.muted} space-y-0.5`}>
                  {con.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /><a href={`tel:${con.phone}`} className="hover:text-blue-600 font-medium">{con.phone}</a></div>}
                  {con.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{con.email}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ===== Team =====
  const TeamView = () => (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center"><h1 className={`text-xl font-bold ${th.text}`}>Team</h1><Btn onClick={() => { setForm({ role: 'partner' }); open('addTeam'); }}><UserPlus className="w-4 h-4" />Add</Btn></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {team.map(m => (
          <div key={m.id} className={`${th.card} rounded-lg border ${th.border} p-3`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${m.color} flex items-center justify-center text-white font-bold`}>{m.avatar}</div>
              <div className="flex-1"><div className="flex items-center gap-2"><h3 className={`font-medium text-sm ${th.text}`}>{m.name}</h3><Badge color={m.role === 'admin' ? 'blue' : 'gray'}>{m.role}</Badge></div><p className={`text-xs ${th.muted}`}>{m.email}</p></div>
              {m.id !== user.id && <button onClick={() => setTeam(team.filter(t => t.id !== m.id))} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== Projects List =====
  const ProjectsList = () => (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center"><h1 className={`text-xl font-bold ${th.text}`}>Projects</h1><Btn onClick={() => open('addProject')}><Plus className="w-4 h-4" />New</Btn></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map(p => {
          const s = getStats(p.tasks), f = calcFin(p);
          return (
            <div key={p.id} onClick={() => openProject(p.id)} className={`${th.card} rounded-lg border ${th.border} p-3 cursor-pointer hover:shadow-md transition`}>
              <div className="flex justify-between items-start mb-2">
                <div><h3 className={`font-medium text-sm ${th.text}`}>{p.name}</h3><p className={`text-xs ${th.muted}`}>{p.address}</p></div>
                <Badge color="green">Active</Badge>
              </div>
              <div className="mb-2"><div className="flex justify-between text-xs mb-1"><span className={th.muted}>Progress</span><span className={th.text}>{s.pct}%</span></div><div className={`h-1.5 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${s.pct}%` }} /></div></div>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}><p className={`text-[10px] ${th.muted}`}>Profit</p><p className={`text-sm font-bold ${f.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(f.profit)}</p></div>
                <div className={`p-2 rounded ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}><p className={`text-[10px] ${th.muted}`}>Spent</p><p className={`text-sm font-bold ${th.text}`}>{fmt(f.paid)}</p></div>
              </div>
            </div>
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
        <header className={`${th.card} border-b ${th.border} px-4 py-3 shrink-0`}>
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={() => { setView('projects'); setProjId(null); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
              <div><h1 className={`text-lg font-bold ${th.text}`}>{proj.name}</h1><p className={`text-xs ${th.muted}`}>{proj.address}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2"><div className={`w-16 h-1.5 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${stats.pct}%` }} /></div><span className={`text-xs font-semibold ${th.text}`}>{stats.pct}%</span></div>
              <span className={`text-sm font-bold ${fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(fin.profit)}</span>
            </div>
          </div>
        </header>

        <div className={`${th.card} border-b ${th.border} px-4 shrink-0`}>
          <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto">
            {['tasks', 'contractors', 'draws', 'financials', 'contacts', 'settings'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 border-b-2 text-xs font-medium capitalize ${tab === t ? 'border-blue-600 text-blue-600' : `border-transparent ${th.muted}`}`}>{t}</button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-5xl mx-auto">
            {tab === 'tasks' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative"><Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${th.muted}`} /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full pl-8 pr-3 py-2 rounded-lg border ${th.input} text-sm`} /></div>
                  <Btn onClick={() => { setForm({ phase: proj.phases[0], days: 1 }); open('addTask'); }}><Plus className="w-4 h-4" />Add</Btn>
                </div>
                {proj.phases.map(phase => (
                  <div key={phase} className={`${th.card} rounded-lg border ${th.border} overflow-hidden`}>
                    <button onClick={() => setExpanded(p => ({ ...p, [phase]: p[phase] === false }))} className={`w-full flex justify-between items-center px-3 py-2 ${dark ? 'bg-slate-750' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">{expanded[phase] === false ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}<span className={`font-medium text-sm ${th.text}`}>{phase}</span><Badge color="gray">{tasksByPhase[phase]?.length || 0}</Badge></div>
                      <span className="text-xs text-emerald-600">{tasksByPhase[phase]?.filter(t => t.status === 'complete').length || 0} done</span>
                    </button>
                    {expanded[phase] !== false && (
                      <div className={`divide-y ${th.border}`}>
                        {(tasksByPhase[phase] || []).map(task => (
                          <div key={task.id} className={`flex items-center gap-2 px-3 py-2 ${th.hover} group ${task.inspection ? (dark ? 'bg-red-900/20' : 'bg-red-50') : ''}`}>
                            <select value={task.status} onChange={e => updateProj(projId, { tasks: proj.tasks.map(t => t.id === task.id ? { ...t, status: e.target.value } : t) })} className={`text-[10px] px-1.5 py-0.5 rounded font-medium border-0 ${task.status === 'complete' ? 'bg-emerald-100 text-emerald-700' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                              <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="complete">Complete</option>
                            </select>
                            <div className="flex-1 min-w-0"><p className={`text-xs font-medium truncate ${task.status === 'complete' ? 'line-through text-gray-400' : th.text}`}>{task.task}</p></div>
                            {task.assignedTo && <div className={`w-5 h-5 rounded-full ${team.find(m => m.id === task.assignedTo)?.color || 'bg-gray-400'} text-white text-[10px] flex items-center justify-center`}>{team.find(m => m.id === task.assignedTo)?.avatar?.[0]}</div>}
                            <span className={`text-[10px] ${th.muted}`}>{task.days}d</span>
                            <button onClick={() => { setForm(task); open('editTask', task); }} className={`p-1 rounded ${th.hover} opacity-0 group-hover:opacity-100`}><Edit2 className="w-3 h-3 text-gray-400" /></button>
                            <button onClick={() => updateProj(projId, { tasks: proj.tasks.filter(t => t.id !== task.id) })} className="p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-red-500" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === 'contractors' && (
              <div className="space-y-4">
                <div className="flex justify-between"><h3 className={`font-semibold text-sm ${th.text}`}>Project Contractors</h3><Btn onClick={() => open('addProjectContractor')}><Plus className="w-4 h-4" />Add</Btn></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {pcs.map(c => {
                    const paid = c.payments?.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) || 0;
                    return (
                      <div key={c.id} className={`${th.card} rounded-lg border ${th.border}`}>
                        <div className="p-3">
                          <div className="flex justify-between mb-3">
                            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{c.name?.substring(0, 2).toUpperCase()}</div><div><h4 className={`font-medium text-sm ${th.text}`}>{c.name}</h4><Badge color="blue">{c.trade}</Badge></div></div>
                            <button onClick={() => updateProj(projId, { contractors: proj.contractors.filter(pc => pc.id !== c.id) })} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
                          </div>
                          <div className={`grid grid-cols-3 gap-2 p-2 rounded-lg mb-3 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <div><p className={`text-[10px] ${th.muted}`}>Quote</p><p className={`text-sm font-bold ${th.text}`}>{fmt(c.quote)}</p></div>
                            <div><p className={`text-[10px] ${th.muted}`}>Paid</p><p className="text-sm font-bold text-emerald-600">{fmt(paid)}</p></div>
                            <div><p className={`text-[10px] ${th.muted}`}>Remaining</p><p className={`text-sm font-bold ${(c.quote || 0) - paid > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{fmt((c.quote || 0) - paid)}</p></div>
                          </div>
                          <div className={`text-xs ${th.muted} space-y-0.5 mb-3`}>{c.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /><a href={`tel:${c.phone}`} className="hover:text-blue-600">{c.phone}</a></div>}</div>
                          <div className="flex gap-2">
                            <Btn v="success" size="sm" className="flex-1" onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], method: 'check', account: 'Business Checking', paidBy: user.name, amount: '' }); open('addPayment', c); }}><DollarSign className="w-3 h-3" />Payment</Btn>
                            <Btn v="secondary" size="sm" onClick={() => { const q = prompt('Quote:', c.quote); if (q) updateProj(projId, { contractors: proj.contractors.map(pc => pc.id === c.id ? { ...pc, quote: parseFloat(q) || 0 } : pc) }); }}><Edit2 className="w-3 h-3" /></Btn>
                          </div>
                        </div>
                        {c.payments?.length > 0 && (
                          <div className={`px-3 py-2 border-t ${th.border}`}>
                            <p className={`text-xs font-medium mb-2 ${th.text}`}>Payments</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {c.payments.map(p => (
                                <div key={p.id} onClick={() => { setSel({ ...p, contractor: c }); open('viewPayment'); }} className={`flex justify-between items-center p-2 rounded ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} cursor-pointer ${th.hover} group`}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded ${dark ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center`}>{METHODS.find(m => m.id === p.method)?.icon && React.createElement(METHODS.find(m => m.id === p.method).icon, { className: 'w-3 h-3 text-gray-500' })}</div>
                                    <div><p className={`text-xs font-semibold ${th.text}`}>{fmt(p.amount)}</p><p className={`text-[10px] ${th.muted}`}>{METHODS.find(m => m.id === p.method)?.label}{p.refNumber && ` #${p.refNumber}`}</p></div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className={`text-[10px] ${th.muted}`}>{p.date}</span>
                                    <button onClick={e => { e.stopPropagation(); if (confirm('Delete?')) updateProj(projId, { contractors: proj.contractors.map(pc => pc.id === c.id ? { ...pc, payments: pc.payments.filter(x => x.id !== p.id) } : pc) }); }} className="p-0.5 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-red-500" /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {pcs.length === 0 && <div className={`${th.card} rounded-lg border ${th.border} p-6 text-center`}><Briefcase className={`w-8 h-8 mx-auto mb-2 ${th.muted} opacity-30`} /><p className={`text-sm ${th.muted}`}>No contractors</p></div>}
              </div>
            )}

            {tab === 'draws' && (
              <div className={`${th.card} rounded-lg border ${th.border}`}>
                <div className={`px-3 py-2 border-b ${th.border}`}><h3 className={`font-semibold text-sm ${th.text}`}>Draw Schedule</h3><p className={`text-xs ${th.muted}`}>Loan: {fmt(proj.loanAmount)}</p></div>
                <table className="w-full text-sm">
                  <thead><tr className={`${dark ? 'bg-slate-750' : 'bg-gray-50'} ${th.muted} text-xs`}><th className="text-left px-3 py-2">Draw</th><th className="text-right px-3 py-2">%</th><th className="text-right px-3 py-2">Amount</th><th className="text-center px-3 py-2">Status</th></tr></thead>
                  <tbody>
                    {proj.draws.map(d => (
                      <tr key={d.id} className={`border-t ${th.border}`}>
                        <td className={`px-3 py-2 font-medium ${th.text}`}>{d.name}</td>
                        <td className={`px-3 py-2 text-right ${th.text}`}>{d.pct}%</td>
                        <td className={`px-3 py-2 text-right font-semibold ${th.text}`}>{fmt(proj.loanAmount * d.pct / 100)}</td>
                        <td className="px-3 py-2 text-center">
                          <select value={d.status} onChange={e => updateProj(projId, { draws: proj.draws.map(dr => dr.id === d.id ? { ...dr, status: e.target.value } : dr) })} className={`text-[10px] px-2 py-1 rounded font-medium ${d.status === 'received' ? 'bg-emerald-100 text-emerald-700' : d.status === 'requested' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                            <option value="pending">Pending</option><option value="requested">Requested</option><option value="received">Received</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'financials' && (
              <div className="grid grid-cols-3 gap-3">
                <div className={`${th.card} rounded-lg border ${th.border} p-3`}><p className={`text-xs ${th.muted}`}>Sale Price</p><p className={`text-xl font-bold ${th.text}`}>{fmt(proj.salePrice)}</p></div>
                <div className={`${th.card} rounded-lg border ${th.border} p-3`}><p className={`text-xs ${th.muted}`}>Est. Cost</p><p className={`text-xl font-bold ${th.text}`}>{fmt(fin.cost)}</p></div>
                <div className={`${th.card} rounded-lg border ${th.border} p-3`}><p className={`text-xs ${th.muted}`}>Est. Profit</p><p className={`text-xl font-bold ${fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(fin.profit)}</p></div>
              </div>
            )}

            {tab === 'contacts' && county && (
              <div className="space-y-3">
                <div className="flex items-center gap-2"><Landmark className="w-5 h-5 text-purple-600" /><div><h3 className={`font-semibold text-sm ${th.text}`}>{county.name}</h3><p className={`text-xs ${th.muted}`}>Jurisdiction contacts</p></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {county.contacts.map(c => (
                    <div key={c.id} className={`${th.card} rounded-lg border ${th.border} p-3`}>
                      <p className={`font-medium text-sm ${th.text}`}>{c.title}</p>
                      <p className={`text-xs ${th.muted} mb-1`}>{c.name}</p>
                      <div className={`text-xs ${th.muted} space-y-0.5`}>
                        {c.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /><a href={`tel:${c.phone}`} className="hover:text-blue-600 font-medium">{c.phone}</a></div>}
                        {c.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div className="space-y-4 max-w-lg">
                <div className={`${th.card} rounded-lg border ${th.border} p-3`}>
                  <h4 className={`font-semibold text-sm mb-3 ${th.text}`}>Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Name" value={proj.name} onChange={e => updateProj(projId, { name: e.target.value })} />
                    <Input label="Address" value={proj.address} onChange={e => updateProj(projId, { address: e.target.value })} />
                    <Input label="Lot Cost" type="number" value={proj.lotCost} onChange={e => updateProj(projId, { lotCost: parseFloat(e.target.value) || 0 })} />
                    <Input label="Sale Price" type="number" value={proj.salePrice} onChange={e => updateProj(projId, { salePrice: parseFloat(e.target.value) || 0 })} />
                    <Input label="Loan Amount" type="number" value={proj.loanAmount} onChange={e => updateProj(projId, { loanAmount: parseFloat(e.target.value) || 0 })} />
                    <Sel label="County" value={proj.county} onChange={e => updateProj(projId, { county: e.target.value })}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</Sel>
                  </div>
                </div>
                <div className={`${th.card} rounded-lg border ${th.border} p-3`}>
                  <div className="flex justify-between items-center mb-2"><h4 className={`font-semibold text-sm ${th.text}`}>Phases</h4><Btn v="secondary" size="sm" onClick={() => { const n = prompt('Phase name:'); if (n) updateProj(projId, { phases: [...proj.phases, n] }); }}><Plus className="w-3 h-3" /></Btn></div>
                  <div className="space-y-1">
                    {proj.phases.map((ph, i) => (
                      <div key={ph} className={`flex items-center justify-between p-2 rounded ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2"><span className={`text-xs ${th.muted}`}>{i + 1}.</span><span className={`text-sm ${th.text}`}>{ph}</span><Badge color="gray">{proj.tasks.filter(t => t.phase === ph).length}</Badge></div>
                        <button onClick={() => { if (proj.tasks.filter(t => t.phase === ph).length > 0) return alert('Move tasks first'); updateProj(projId, { phases: proj.phases.filter(p => p !== ph) }); }} className="text-red-500 text-xs">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${th.card} rounded-lg border border-red-200 p-3`}>
                  <h4 className="font-semibold text-sm text-red-600 mb-2">Danger</h4>
                  <Btn v="danger" size="sm" onClick={() => { if (confirm('Delete project?')) { setProjects(projects.filter(p => p.id !== projId)); setView('projects'); setProjId(null); } }}>Delete Project</Btn>
                </div>
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

      {/* Modals */}
      <Modal show={modal === 'addPayment'} title="Record Payment">
        <div className={`p-3 rounded-lg mb-3 ${dark ? 'bg-slate-700' : 'bg-gray-50'}`}><p className={`text-xs ${th.muted}`}>To:</p><p className={`font-semibold text-sm ${th.text}`}>{sel?.name}</p></div>
        <div className="space-y-3">
          <Input label="Amount *" placeholder="0.00" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value.replace(/[^0-9.]/g, '') })} />
          <Input label="Date *" type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Sel label="Method" value={form.method || 'check'} onChange={e => setForm({ ...form, method: e.target.value })}>{METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</Sel>
          {METHODS.find(m => m.id === form.method)?.needsRef && <Input label={METHODS.find(m => m.id === form.method)?.refLabel} value={form.refNumber || ''} onChange={e => setForm({ ...form, refNumber: e.target.value })} />}
          <Sel label="Account" value={form.account || ''} onChange={e => setForm({ ...form, account: e.target.value })}>{ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}</Sel>
          <Input label="Paid By" value={form.paidBy || ''} onChange={e => setForm({ ...form, paidBy: e.target.value })} />
          <Input label="Memo" value={form.memo || ''} onChange={e => setForm({ ...form, memo: e.target.value })} />
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn v="success" className="flex-1" onClick={() => { if (!form.amount || !form.date) return; updateProj(projId, { contractors: proj.contractors.map(c => c.id === sel.id ? { ...c, payments: [...(c.payments || []), { ...form, id: Date.now(), amount: parseFloat(form.amount) || 0 }] } : c) }); close(); }}>Save</Btn></div>
      </Modal>

      <Modal show={modal === 'viewPayment'} title="Payment Details">
        {sel && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'} text-center`}><p className={`text-2xl font-bold ${th.text}`}>{fmt(sel.amount)}</p><p className={`text-xs ${th.muted}`}>to {sel.contractor?.name}</p></div>
            <div className="space-y-2">
              {[{ l: 'Date', v: sel.date }, { l: 'Method', v: METHODS.find(m => m.id === sel.method)?.label }, { l: 'Reference', v: sel.refNumber }, { l: 'Account', v: sel.account }, { l: 'Paid By', v: sel.paidBy }, { l: 'Memo', v: sel.memo }].filter(x => x.v).map(x => (
                <div key={x.l} className={`flex justify-between py-1.5 border-b ${th.border} text-sm`}><span className={th.muted}>{x.l}</span><span className={th.text}>{x.v}</span></div>
              ))}
            </div>
            <div className="flex gap-2"><Btn v="secondary" className="flex-1" onClick={() => { setForm(sel); close(); open('editPayment', sel); }}><Edit2 className="w-3 h-3" />Edit</Btn><Btn v="danger" className="flex-1" onClick={() => { if (confirm('Delete?')) { updateProj(projId, { contractors: proj.contractors.map(c => c.id === sel.contractor?.id ? { ...c, payments: c.payments.filter(p => p.id !== sel.id) } : c) }); close(); } }}><Trash2 className="w-3 h-3" />Delete</Btn></div>
          </div>
        )}
      </Modal>

      <Modal show={modal === 'editPayment'} title="Edit Payment">
        <div className="space-y-3">
          <Input label="Amount" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value.replace(/[^0-9.]/g, '') })} />
          <Input label="Date" type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Sel label="Method" value={form.method || 'check'} onChange={e => setForm({ ...form, method: e.target.value })}>{METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</Sel>
          {METHODS.find(m => m.id === form.method)?.needsRef && <Input label="Reference" value={form.refNumber || ''} onChange={e => setForm({ ...form, refNumber: e.target.value })} />}
          <Sel label="Account" value={form.account || ''} onChange={e => setForm({ ...form, account: e.target.value })}>{ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}</Sel>
          <Input label="Paid By" value={form.paidBy || ''} onChange={e => setForm({ ...form, paidBy: e.target.value })} />
          <Input label="Memo" value={form.memo || ''} onChange={e => setForm({ ...form, memo: e.target.value })} />
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { updateProj(projId, { contractors: proj.contractors.map(c => c.id === sel.contractor?.id ? { ...c, payments: c.payments.map(p => p.id === sel.id ? { ...form, id: sel.id, amount: parseFloat(form.amount) || 0 } : p) } : c) }); close(); }}>Save</Btn></div>
      </Modal>

      <Modal show={modal === 'addContractor'} title="Add Contractor">
        <div className="space-y-3">
          <Input label="Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Sel label="Trade" value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</Sel>
          <div className="grid grid-cols-2 gap-2"><Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /><Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <Input label="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name) return; setContractors([...contractors, { ...form, id: Date.now() }]); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'editContractor'} title="Edit Contractor">
        <div className="space-y-3">
          <Input label="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Sel label="Trade" value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</Sel>
          <div className="grid grid-cols-2 gap-2"><Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /><Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <Input label="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { setContractors(contractors.map(c => c.id === sel.id ? { ...form, id: sel.id } : c)); close(); }}>Save</Btn></div>
      </Modal>

      <Modal show={modal === 'addProjectContractor'} title="Add to Project" size="lg">
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {contractors.map(c => {
            const added = proj?.contractors.find(pc => pc.gid === c.id);
            return (
              <div key={c.id} onClick={() => { if (!added) { updateProj(projId, { contractors: [...proj.contractors, { id: Date.now(), gid: c.id, quote: 0, payments: [] }] }); } }} className={`p-2.5 rounded-lg border ${th.border} ${added ? 'opacity-50' : `${th.hover} cursor-pointer`}`}>
                <div className="flex items-center gap-2"><div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{c.name.substring(0, 2).toUpperCase()}</div><div><p className={`text-xs font-medium ${th.text}`}>{c.name}</p><p className={`text-[10px] ${th.muted}`}>{c.trade}</p></div>{added ? <Badge color="green">Added</Badge> : <Plus className="ml-auto w-4 h-4 text-blue-600" />}</div>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal show={modal === 'addCounty'} title="Add County">
        <div className="space-y-3"><Input label="Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /><Input label="State" value={form.state || 'AR'} onChange={e => setForm({ ...form, state: e.target.value })} /></div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name) return; setCounties([...counties, { ...form, id: Date.now(), contacts: [] }]); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'addContact'} title="Add Contact">
        <div className="space-y-3">
          <Input label="Title *" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Building Inspector" />
          <Input label="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-2"><Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /><Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.title) return; setCounties(counties.map(c => c.id === sel.id ? { ...c, contacts: [...c.contacts, { ...form, id: Date.now() }] } : c)); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'addTask'} title="Add Task">
        <div className="space-y-3">
          <Sel label="Phase *" value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</Sel>
          <Input label="Task *" value={form.task || ''} onChange={e => setForm({ ...form, task: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Days" type="number" value={form.days || 1} onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 1 })} />
            <Sel label="Assign" value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })}><option value="">-</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</Sel>
          </div>
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.task || !form.phase) return; updateProj(projId, { tasks: [...proj.tasks, { ...form, id: Date.now(), status: 'pending' }] }); close(); }}>Add</Btn></div>
      </Modal>

      <Modal show={modal === 'editTask'} title="Edit Task">
        <div className="space-y-3">
          <Sel label="Phase" value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</Sel>
          <Input label="Task" value={form.task || ''} onChange={e => setForm({ ...form, task: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Sel label="Status" value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="complete">Complete</option></Sel>
            <Input label="Days" type="number" value={form.days || 1} onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 1 })} />
          </div>
          <Sel label="Assign" value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })}><option value="">-</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</Sel>
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { updateProj(projId, { tasks: proj.tasks.map(t => t.id === sel.id ? { ...form, id: sel.id } : t) }); close(); }}>Save</Btn></div>
      </Modal>

      <Modal show={modal === 'addProject'} title="New Project">
        <div className="space-y-3">
          <Input label="Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="123 Main St" />
          <Input label="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-2"><Input label="Lot Cost" type="number" value={form.lotCost || ''} onChange={e => setForm({ ...form, lotCost: e.target.value })} /><Input label="Sale Price" type="number" value={form.salePrice || ''} onChange={e => setForm({ ...form, salePrice: e.target.value })} /></div>
          <Input label="Loan Amount" type="number" value={form.loanAmount || ''} onChange={e => setForm({ ...form, loanAmount: e.target.value })} />
          <Sel label="County" value={form.county || counties[0]?.name} onChange={e => setForm({ ...form, county: e.target.value })}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</Sel>
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name) return; setProjects([...projects, { ...form, id: Date.now(), status: 'active', phases: [...PHASES], lotCost: parseFloat(form.lotCost) || 0, salePrice: parseFloat(form.salePrice) || 0, loanAmount: parseFloat(form.loanAmount) || 0, tasks: TASKS.map((t, i) => ({ ...t, id: Date.now() + i, status: 'pending', assignedTo: null })), contractors: [], draws: [{ id: 1, name: 'Foundation', pct: 15, status: 'pending' }, { id: 2, name: 'Framing', pct: 20, status: 'pending' }, { id: 3, name: 'Rough-Ins', pct: 15, status: 'pending' }, { id: 4, name: 'Finishes', pct: 35, status: 'pending' }, { id: 5, name: 'Final', pct: 15, status: 'pending' }] }]); close(); }}>Create</Btn></div>
      </Modal>

      <Modal show={modal === 'addTeam'} title="Add Team Member">
        <div className="space-y-3">
          <Input label="Name *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email *" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Sel label="Role" value={form.role || 'partner'} onChange={e => setForm({ ...form, role: e.target.value })}><option value="admin">Admin</option><option value="partner">Partner</option><option value="viewer">Viewer</option></Sel>
        </div>
        <div className="flex gap-2 mt-4"><Btn v="secondary" className="flex-1" onClick={close}>Cancel</Btn><Btn className="flex-1" onClick={() => { if (!form.name || !form.email) return; setTeam([...team, { ...form, id: Date.now(), avatar: form.name.substring(0, 2).toUpperCase(), color: ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-orange-600'][team.length % 4] }]); close(); }}>Add</Btn></div>
      </Modal>
    </div>
  );
}
