import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronLeft, Users, Receipt, Package, DollarSign, Calendar, AlertTriangle, CheckCircle2, Building2, Phone, Mail, X, ChevronDown, ChevronRight, Bell, Settings, Edit2, CreditCard, Banknote, Building, Wallet } from 'lucide-react';

const DEFAULT_PHASES = ["Pre-Construction", "Permits", "Site Prep", "Foundation", "Framing", "Exterior", "Rough-Ins", "Pre-Insulation", "Insulation", "Drywall", "Finishes", "Final"];

const DEFAULT_TASKS = [
  { id: 1, phase: "Pre-Construction", task: "Research zoning, sqft, easements - check with city", contractor: "", daysEstimate: 3, notes: "Do BEFORE purchasing the lot", conditionalType: "" },
  { id: 2, phase: "Pre-Construction", task: "Buy lot", contractor: "", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 3, phase: "Pre-Construction", task: "Get survey", contractor: "Surveyor", daysEstimate: 5, notes: "", conditionalType: "" },
  { id: 4, phase: "Pre-Construction", task: "Take setbacks to architect", contractor: "Architect", daysEstimate: 1, notes: "City requirements for setbacks", conditionalType: "" },
  { id: 5, phase: "Pre-Construction", task: "Get plans drawn", contractor: "Architect", daysEstimate: 21, notes: "", conditionalType: "" },
  { id: 6, phase: "Permits", task: "Submit plans / pull permit", contractor: "", daysEstimate: 2, notes: "Price based on sqft; 1-2 days to review", conditionalType: "" },
  { id: 7, phase: "Permits", task: "Permit issued; payment made", contractor: "", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 8, phase: "Permits", task: "Builders risk insurance", contractor: "Insurance", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 9, phase: "Site Prep", task: "Electrician sets temp pole", contractor: "Electrician", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 10, phase: "Site Prep", task: "Clear the lot", contractor: "Excavation", daysEstimate: 3, notes: "May need excavation company or tree guy", conditionalType: "" },
  { id: 11, phase: "Site Prep", task: "Order dumpster and potty", contractor: "", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 12, phase: "Foundation", task: "Foundation does markings", contractor: "Foundation", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 13, phase: "Foundation", task: "Confirm markings", contractor: "", daysEstimate: 1, notes: "Builder responsibility", conditionalType: "" },
  { id: 14, phase: "Foundation", task: "Foundation does footings", contractor: "Foundation", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 15, phase: "Foundation", task: "⚠️ INSPECTION: Footings", contractor: "Inspector", daysEstimate: 1, notes: "Must pass before continuing", isInspection: true, conditionalType: "" },
  { id: 16, phase: "Foundation", task: "Order blocks, sand, mortar", contractor: "", daysEstimate: 1, notes: "Confirm quantity with block layer", conditionalType: "" },
  { id: 17, phase: "Foundation", task: "Pour footings", contractor: "Concrete", daysEstimate: 1, notes: "Needs to cure 7 days minimum", conditionalType: "" },
  { id: 18, phase: "Foundation", task: "Let footings cure", contractor: "", daysEstimate: 7, notes: "Do not proceed until cured", conditionalType: "" },
  { id: 19, phase: "Foundation", task: "Confirm rebar + who calls concrete", contractor: "", daysEstimate: 1, notes: "Builder responsibility; lead time may be days/weeks", conditionalType: "" },
  { id: 20, phase: "Foundation", task: "Lay concrete blocks", contractor: "Block Layer", daysEstimate: 3, notes: "Should set for 7 days", conditionalType: "" },
  { id: 21, phase: "Foundation", task: "Let blocks cure", contractor: "", daysEstimate: 7, notes: "", conditionalType: "" },
  { id: 22, phase: "Foundation", task: "Concrete guy backfills", contractor: "Concrete", daysEstimate: 1, notes: "Confirm who orders the dirt", conditionalType: "" },
  { id: 23, phase: "Foundation", task: "Plumber does rough-ins", contractor: "Plumber", daysEstimate: 2, notes: "Will know fixtures needed from plans", conditionalType: "" },
  { id: 24, phase: "Foundation", task: "⚡ Floor outlets (if applicable)", contractor: "Electrician", daysEstimate: 1, notes: "MUST be done BEFORE concrete pour!", conditionalType: "floor_outlets" },
  { id: 25, phase: "Foundation", task: "⚠️ INSPECTION: Plumbing rough-in", contractor: "Inspector", daysEstimate: 1, notes: "Plumber calls this in", isInspection: true, conditionalType: "" },
  { id: 26, phase: "Foundation", task: "Tamp dirt + lay plastic and wiremesh", contractor: "Concrete", daysEstimate: 1, notes: "Builder orders plastic and wiremesh", conditionalType: "" },
  { id: 27, phase: "Foundation", task: "⚠️ INSPECTION: Pre-pour concrete", contractor: "Inspector", daysEstimate: 1, notes: "", isInspection: true, conditionalType: "" },
  { id: 28, phase: "Foundation", task: "Pour slab and finish", contractor: "Concrete", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 29, phase: "Foundation", task: "Let concrete cure", contractor: "", daysEstimate: 7, notes: "Do not proceed until cured", conditionalType: "" },
  { id: 30, phase: "Framing", task: "Framing (framer orders materials)", contractor: "Framer", daysEstimate: 14, notes: "", conditionalType: "" },
  { id: 31, phase: "Framing", task: "Install doors and windows", contractor: "Framer", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 32, phase: "Framing", task: "⚠️ INSPECTION: Framing", contractor: "Inspector", daysEstimate: 1, notes: "", isInspection: true, conditionalType: "" },
  { id: 33, phase: "Exterior", task: "Measure for brick/siding + get quote", contractor: "", daysEstimate: 1, notes: "Builder orders materials after quote", conditionalType: "" },
  { id: 34, phase: "Exterior", task: "Brickman comes out", contractor: "Brick Layer", daysEstimate: 5, notes: "", conditionalType: "" },
  { id: 35, phase: "Exterior", task: "Roofer measures + builder orders materials", contractor: "Roofer", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 36, phase: "Exterior", task: "Roofing installed", contractor: "Roofer", daysEstimate: 3, notes: "", conditionalType: "" },
  { id: 37, phase: "Rough-Ins", task: "HVAC rough-ins", contractor: "HVAC", daysEstimate: 3, notes: "", conditionalType: "" },
  { id: 38, phase: "Rough-Ins", task: "⚠️ INSPECTION: HVAC rough-in", contractor: "Inspector", daysEstimate: 1, notes: "", isInspection: true, conditionalType: "" },
  { id: 39, phase: "Rough-Ins", task: "Plumbing top outs + install tubs/faucets", contractor: "Plumber", daysEstimate: 2, notes: "Need to order tubs/faucets ahead of time", conditionalType: "" },
  { id: 40, phase: "Rough-Ins", task: "⚠️ INSPECTION: Plumbing top out", contractor: "Inspector", daysEstimate: 1, notes: "", isInspection: true, conditionalType: "" },
  { id: 41, phase: "Rough-Ins", task: "Electrical rough-ins", contractor: "Electrician", daysEstimate: 3, notes: "", conditionalType: "" },
  { id: 42, phase: "Rough-Ins", task: "⚠️ INSPECTION: Electrical rough-in", contractor: "Inspector", daysEstimate: 1, notes: "", isInspection: true, conditionalType: "" },
  { id: 43, phase: "Pre-Insulation", task: "🎨 Stain concrete (if applicable)", contractor: "Concrete Stainer", daysEstimate: 2, notes: "Concrete must cure 28 days before staining. Do BEFORE insulation.", conditionalType: "stained_concrete" },
  { id: 44, phase: "Insulation", task: "Insulation sprayed", contractor: "Insulation", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 45, phase: "Drywall", task: "Drywall guy measures and gives quantity", contractor: "Drywall", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 46, phase: "Drywall", task: "Order drywall", contractor: "", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 47, phase: "Drywall", task: "Hang drywall", contractor: "Drywall", daysEstimate: 5, notes: "", conditionalType: "" },
  { id: 48, phase: "Drywall", task: "Finish drywall (mud, tape, sand)", contractor: "Drywall Finisher", daysEstimate: 5, notes: "He supplies his own mud, tape, etc.", conditionalType: "" },
  { id: 49, phase: "Finishes", task: "Flooring installed", contractor: "Flooring", daysEstimate: 3, notes: "", conditionalType: "" },
  { id: 50, phase: "Finishes", task: "Painters quote + paint", contractor: "Painter", daysEstimate: 6, notes: "", conditionalType: "" },
  { id: 51, phase: "Finishes", task: "HVAC top outs", contractor: "HVAC", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 52, phase: "Finishes", task: "Electrical final (fixtures, switches, etc.)", contractor: "Electrician", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 53, phase: "Finishes", task: "Trim quote + order", contractor: "Trim Carpenter", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 54, phase: "Finishes", task: "Trim installed", contractor: "Trim Carpenter", daysEstimate: 3, notes: "", conditionalType: "" },
  { id: 55, phase: "Finishes", task: "Cabinets quote", contractor: "Cabinet Installer", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 56, phase: "Finishes", task: "Cabinets installed", contractor: "Cabinet Installer", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 57, phase: "Finishes", task: "Countertops quote + install", contractor: "Countertops", daysEstimate: 7, notes: "Template after cabinets are in", conditionalType: "" },
  { id: 58, phase: "Finishes", task: "Plumber installs fixtures + tie in water/sewer", contractor: "Plumber", daysEstimate: 2, notes: "Toilets, sinks, faucets - order ahead", conditionalType: "" },
  { id: 59, phase: "Finishes", task: "Painter comes back for trim/touchups", contractor: "Painter", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 60, phase: "Final", task: "Mailbox (bricklayer)", contractor: "Brick Layer", daysEstimate: 1, notes: "Can do when laying bricks", conditionalType: "" },
  { id: 61, phase: "Final", task: "Driveway poured", contractor: "Concrete", daysEstimate: 2, notes: "At end of project", conditionalType: "" },
  { id: 62, phase: "Final", task: "Garage door installed", contractor: "Garage Door", daysEstimate: 1, notes: "", conditionalType: "" },
  { id: 63, phase: "Final", task: "Appliances installed", contractor: "", daysEstimate: 1, notes: "Stove, dishwasher, ventahood, fridge, etc.", conditionalType: "" },
  { id: 64, phase: "Final", task: "Sodding", contractor: "Landscaper", daysEstimate: 2, notes: "", conditionalType: "" },
  { id: 65, phase: "Final", task: "⚠️ Final Inspection", contractor: "Inspector", daysEstimate: 1, notes: "", isInspection: true, conditionalType: "" },
  { id: 66, phase: "Final", task: "Certificate of Occupancy", contractor: "City", daysEstimate: 3, notes: "Cannot legally occupy without this", conditionalType: "" },
];

const CONDITIONAL_OPTIONS = [
  { id: 'floor_outlets', label: 'Floor Outlets', description: 'Electrical outlets flush with ground level' },
  { id: 'stained_concrete', label: 'Stained Concrete', description: 'Concrete floors will be stained (not covered)' },
  { id: 'basement', label: 'Has Basement', description: 'Property includes a basement' },
  { id: 'two_story', label: 'Two Story', description: 'Multi-story construction' },
];

const RECEIPT_CATEGORIES = ['Materials - Lumber', 'Materials - Concrete', 'Materials - Electrical', 'Materials - Plumbing', 'Materials - HVAC', 'Materials - Roofing', 'Materials - Drywall', 'Materials - Flooring', 'Materials - Paint', 'Materials - Other', 'Labor', 'Permits & Fees', 'Insurance', 'Equipment Rental', 'Utilities', 'Other'];

const PAYMENT_METHODS = [
  { id: 'check', label: 'Check', icon: Banknote },
  { id: 'cash', label: 'Cash', icon: Wallet },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'transfer', label: 'Bank Transfer', icon: Building },
  { id: 'zelle', label: 'Zelle', icon: Wallet },
  { id: 'venmo', label: 'Venmo', icon: Wallet },
];

export default function ConstructionDashboard() {
  const [projects, setProjects] = useState([
    {
      id: 1, name: "123 Main St Build", address: "123 Main St, Dallas, TX", status: "active",
      startDate: "2025-02-01", expectedEndDate: "2025-08-01", lotCost: 45000, expectedSalePrice: 285000,
      phases: [...DEFAULT_PHASES],
      tasks: DEFAULT_TASKS.map(t => ({ ...t, status: 'pending', startDate: '', actualCost: 0 })),
      contractors: [
        { id: 1, name: "Mike's Foundation", trade: "Foundation", phone: "214-555-0101", email: "mike@foundation.com", quote: 8500, payments: [] },
        { id: 2, name: "ABC Framing", trade: "Framer", phone: "214-555-0102", email: "abc@framing.com", quote: 12000, payments: [] },
        { id: 3, name: "Pro Electric", trade: "Electrician", phone: "214-555-0103", email: "pro@electric.com", quote: 6500, payments: [] },
      ],
      receipts: [], 
      materials: [
        { id: 1, item: "Lumber Package", quantity: 1, unit: "lot", estimatedCost: 15000, actualCost: 0, ordered: false, received: false },
        { id: 2, item: "Concrete", quantity: 45, unit: "yards", estimatedCost: 6750, actualCost: 0, ordered: false, received: false },
      ],
      conditions: ['floor_outlets'], 
      notes: ""
    }
  ]);
  
  const [currentView, setCurrentView] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [draggedTask, setDraggedTask] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(null);
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [showEditContractor, setShowEditContractor] = useState(null);
  const [showAddReceipt, setShowAddReceipt] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(null);
  const [showAddPhase, setShowAddPhase] = useState(false);
  
  const [newTask, setNewTask] = useState({ phase: '', task: '', contractor: '', daysEstimate: 1, notes: '', conditionalType: '' });
  const [editTaskData, setEditTaskData] = useState(null);
  const [newContractor, setNewContractor] = useState({ name: '', trade: '', phone: '', email: '', quote: 0 });
  const [newReceipt, setNewReceipt] = useState({ description: '', amount: 0, category: '', date: '', vendor: '' });
  const [newMaterial, setNewMaterial] = useState({ item: '', quantity: 1, unit: '', estimatedCost: 0 });
  const [newProject, setNewProject] = useState({ name: '', address: '', startDate: '', expectedEndDate: '', lotCost: 0, expectedSalePrice: 0 });
  const [newPayment, setNewPayment] = useState({ amount: 0, date: '', method: 'check', note: '' });
  const [newPhase, setNewPhase] = useState('');

  const project = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  const getTasksByPhase = (tasks, phases) => {
    const result = {};
    phases.forEach(phase => { result[phase] = []; });
    tasks.forEach(task => {
      if (result[task.phase]) result[task.phase].push(task);
      else if (phases.length > 0) result[phases[0]].push(task);
    });
    return result;
  };

  const calculateFinancials = (proj) => {
    const totalContractorQuotes = proj.contractors.reduce((sum, c) => sum + (c.quote || 0), 0);
    const totalContractorPaid = proj.contractors.reduce((sum, c) => sum + (c.payments?.reduce((s, p) => s + p.amount, 0) || 0), 0);
    const totalReceiptsAmount = proj.receipts.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalMaterialsEstimate = proj.materials.reduce((sum, m) => sum + (m.estimatedCost || 0), 0);
    const totalMaterialsActual = proj.materials.reduce((sum, m) => sum + (m.actualCost || 0), 0);
    const totalEstimatedCost = proj.lotCost + totalContractorQuotes + totalMaterialsEstimate;
    const totalActualSpent = proj.lotCost + totalContractorPaid + totalReceiptsAmount + totalMaterialsActual;
    const expectedProfit = proj.expectedSalePrice - totalEstimatedCost;
    return { totalContractorQuotes, totalContractorPaid, totalReceiptsAmount, totalMaterialsEstimate, totalMaterialsActual, totalEstimatedCost, totalActualSpent, expectedProfit };
  };

  const getAllPayments = (proj) => {
    const payments = [];
    proj.contractors.forEach(c => {
      (c.payments || []).forEach(p => {
        payments.push({ ...p, contractorName: c.name, contractorTrade: c.trade, type: 'contractor' });
      });
    });
    proj.receipts.forEach(r => {
      payments.push({ amount: r.amount, date: r.date, method: '-', note: r.description, vendor: r.vendor, category: r.category, type: 'receipt' });
    });
    return payments.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getActiveAlerts = (proj) => {
    return proj.tasks.filter(t => t.conditionalType && proj.conditions.includes(t.conditionalType)).map(t => ({
      task: t.task, condition: CONDITIONAL_OPTIONS.find(c => c.id === t.conditionalType)?.label, notes: t.notes, phase: t.phase
    }));
  };

  const handleDragStart = (e, task) => { setDraggedTask(task); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === targetTask.id) return;
    setProjects(projects.map(p => {
      if (p.id !== selectedProject) return p;
      const tasks = [...p.tasks];
      const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
      const targetIndex = tasks.findIndex(t => t.id === targetTask.id);
      const [removed] = tasks.splice(draggedIndex, 1);
      removed.phase = targetTask.phase;
      tasks.splice(targetIndex, 0, removed);
      return { ...p, tasks };
    }));
    setDraggedTask(null);
  };

  const updateProject = (projectId, updates) => setProjects(projects.map(p => p.id === projectId ? { ...p, ...updates } : p));
  
  const updateTask = (taskId, updates) => setProjects(projects.map(p => p.id !== selectedProject ? p : { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) }));
  
  const deleteTask = (taskId) => setProjects(projects.map(p => p.id !== selectedProject ? p : { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }));
  
  const addTask = () => {
    if (!newTask.task || !newTask.phase) return;
    setProjects(projects.map(p => {
      if (p.id !== selectedProject) return p;
      return { ...p, tasks: [...p.tasks, { ...newTask, id: Math.max(...p.tasks.map(t => t.id), 0) + 1, status: 'pending', startDate: '', actualCost: 0 }] };
    }));
    setNewTask({ phase: '', task: '', contractor: '', daysEstimate: 1, notes: '', conditionalType: '' });
    setShowAddTask(false);
  };

  const saveEditTask = () => {
    if (!editTaskData) return;
    updateTask(editTaskData.id, editTaskData);
    setShowEditTask(null);
    setEditTaskData(null);
  };

  const addContractor = () => {
    if (!newContractor.name) return;
    setProjects(projects.map(p => {
      if (p.id !== selectedProject) return p;
      return { ...p, contractors: [...p.contractors, { ...newContractor, id: Math.max(...p.contractors.map(c => c.id), 0) + 1, payments: [] }] };
    }));
    setNewContractor({ name: '', trade: '', phone: '', email: '', quote: 0 });
    setShowAddContractor(false);
  };

  const updateContractor = (contractorId, updates) => {
    setProjects(projects.map(p => p.id !== selectedProject ? p : { ...p, contractors: p.contractors.map(c => c.id === contractorId ? { ...c, ...updates } : c) }));
  };

  const deleteContractor = (contractorId) => {
    setProjects(projects.map(p => p.id !== selectedProject ? p : { ...p, contractors: p.contractors.filter(c => c.id !== contractorId) }));
  };

  const addPaymentToContractor = (contractorId) => {
    if (!newPayment.amount || !newPayment.date) return;
    setProjects(projects.map(p => {
      if (p.id !== selectedProject) return p;
      return {
        ...p,
        contractors: p.contractors.map(c => {
          if (c.id !== contractorId) return c;
          return { ...c, payments: [...(c.payments || []), { ...newPayment, id: Date.now() }] };
        })
      };
    }));
    setNewPayment({ amount: 0, date: '', method: 'check', note: '' });
    setShowAddPayment(null);
  };

  const addReceipt = () => {
    if (!newReceipt.description) return;
    setProjects(projects.map(p => {
      if (p.id !== selectedProject) return p;
      return { ...p, receipts: [...p.receipts, { ...newReceipt, id: Math.max(...p.receipts.map(r => r.id), 0) + 1 }] };
    }));
    setNewReceipt({ description: '', amount: 0, category: '', date: '', vendor: '' });
    setShowAddReceipt(false);
  };

  const addMaterial = () => {
    if (!newMaterial.item) return;
    setProjects(projects.map(p => {
      if (p.id !== selectedProject) return p;
      return { ...p, materials: [...p.materials, { ...newMaterial, id: Math.max(...p.materials.map(m => m.id), 0) + 1, actualCost: 0, ordered: false, received: false }] };
    }));
    setNewMaterial({ item: '', quantity: 1, unit: '', estimatedCost: 0 });
    setShowAddMaterial(false);
  };

  const addProject = () => {
    if (!newProject.name) return;
    setProjects([...projects, { ...newProject, id: Math.max(...projects.map(p => p.id), 0) + 1, status: 'active',
      phases: [...DEFAULT_PHASES],
      tasks: DEFAULT_TASKS.map(t => ({ ...t, status: 'pending', startDate: '', actualCost: 0 })),
      contractors: [], receipts: [], materials: [], conditions: [], notes: "" }]);
    setNewProject({ name: '', address: '', startDate: '', expectedEndDate: '', lotCost: 0, expectedSalePrice: 0 });
    setShowAddProject(false);
  };

  const addPhase = () => {
    if (!newPhase.trim()) return;
    updateProject(project.id, { phases: [...project.phases, newPhase.trim()] });
    setNewPhase('');
    setShowAddPhase(false);
  };

  const removePhase = (phaseToRemove) => {
    const tasksInPhase = project.tasks.filter(t => t.phase === phaseToRemove);
    if (tasksInPhase.length > 0) {
      alert(`Cannot delete "${phaseToRemove}" - it has ${tasksInPhase.length} task(s). Move or delete tasks first.`);
      return;
    }
    updateProject(project.id, { phases: project.phases.filter(p => p !== phaseToRemove) });
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amt || 0);
  const getStatusColor = (status) => ({ complete: 'bg-green-100 text-green-800', in_progress: 'bg-blue-100 text-blue-800', blocked: 'bg-red-100 text-red-800' }[status] || 'bg-gray-100 text-gray-600');
  const getProgressStats = (tasks) => {
    const total = tasks.length, complete = tasks.filter(t => t.status === 'complete').length;
    return { total, complete, percent: total > 0 ? Math.round((complete / total) * 100) : 0 };
  };

  // PROJECT LIST VIEW
  if (currentView === 'projects') {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-600" />
            <h1 className="text-xl font-bold">Construction Dashboard</h1>
          </div>
          <button onClick={() => setShowAddProject(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map(proj => {
              const stats = getProgressStats(proj.tasks);
              const financials = calculateFinancials(proj);
              const alerts = getActiveAlerts(proj);
              return (
                <div key={proj.id} onClick={() => { setSelectedProject(proj.id); setCurrentView('project'); }}
                  className="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{proj.name}</h3>
                      <p className="text-sm text-gray-500">{proj.address}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 h-fit">{proj.status}</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{stats.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.percent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.complete} of {stats.total} tasks</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-gray-500 text-xs">Est. Profit</p>
                      <p className={`font-semibold ${financials.expectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(financials.expectedProfit)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-gray-500 text-xs">Total Spent</p>
                      <p className="font-semibold">{formatCurrency(financials.totalActualSpent)}</p>
                    </div>
                  </div>
                  {alerts.length > 0 && <div className="mt-3 flex items-center gap-1 text-amber-600 text-xs"><AlertTriangle className="w-4 h-4" />{alerts.length} alert{alerts.length > 1 ? 's' : ''}</div>}
                </div>
              );
            })}
          </div>
        </main>

        {showAddProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between mb-4"><h3 className="text-lg font-semibold">New Project</h3><button onClick={() => setShowAddProject(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-500 font-medium">Project Name *</label><input type="text" placeholder="e.g., 456 Oak St Build" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Address</label><input type="text" placeholder="Full property address" value={newProject.address} onChange={e => setNewProject({ ...newProject, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">Start Date</label><input type="date" value={newProject.startDate} onChange={e => setNewProject({ ...newProject, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Expected End Date</label><input type="date" value={newProject.expectedEndDate} onChange={e => setNewProject({ ...newProject, expectedEndDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">Lot Cost ($)</label><input type="number" placeholder="0" value={newProject.lotCost} onChange={e => setNewProject({ ...newProject, lotCost: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Expected Sale Price ($)</label><input type="number" placeholder="0" value={newProject.expectedSalePrice} onChange={e => setNewProject({ ...newProject, expectedSalePrice: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddProject(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addProject} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PROJECT DETAIL VIEW
  if (currentView === 'project' && project) {
    const tasksByPhase = getTasksByPhase(project.tasks, project.phases);
    const financials = calculateFinancials(project);
    const alerts = getActiveAlerts(project);
    const stats = getProgressStats(project.tasks);
    const allPayments = getAllPayments(project);

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => { setCurrentView('projects'); setSelectedProject(null); }} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">{project.name}</h1>
              <p className="text-sm text-gray-500 truncate">{project.address}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{project.startDate || '—'} → {project.expectedEndDate || '—'}</span>
            </div>
          </div>
        </header>

        <div className="bg-white border-b px-4 py-2 flex items-center gap-4 text-sm overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-20 bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.percent}%` }} /></div>
            <span className="font-medium">{stats.percent}%</span>
          </div>
          <div className="flex items-center gap-1 shrink-0"><CheckCircle2 className="w-4 h-4 text-green-500" />{stats.complete}</div>
          <div className="ml-auto shrink-0 text-gray-500">Profit: <span className={`font-semibold ${financials.expectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(financials.expectedProfit)}</span></div>
        </div>

        <div className="bg-white border-b px-4 overflow-x-auto">
          <div className="flex gap-4">
            {[
              { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
              { id: 'contractors', label: 'Contractors', icon: Users },
              { id: 'ledger', label: 'All Payments', icon: Banknote },
              { id: 'receipts', label: 'Receipts', icon: Receipt },
              { id: 'materials', label: 'Materials', icon: Package },
              { id: 'financials', label: 'Financials', icon: DollarSign },
              { id: 'alerts', label: 'Alerts', icon: Bell, count: alerts.length },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 py-3 border-b-2 text-sm whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}{tab.count > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-1.5 rounded-full">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <main className="p-4">
          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold">Tasks</h2>
                <button onClick={() => setShowAddTask(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"><Plus className="w-4 h-4" />Add Task</button>
              </div>
              <div className="space-y-3">
                {project.phases.map(phase => (
                  <div key={phase} className="bg-white rounded-xl border overflow-hidden">
                    <button onClick={() => setExpandedPhases(p => ({ ...p, [phase]: p[phase] === false ? true : p[phase] === true ? false : false }))} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100">
                      <div className="flex items-center gap-2">
                        {expandedPhases[phase] === false ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span className="font-medium">{phase}</span>
                        <span className="text-xs text-gray-500">({tasksByPhase[phase]?.length || 0})</span>
                      </div>
                      <span className="text-xs text-green-600">{tasksByPhase[phase]?.filter(t => t.status === 'complete').length || 0} done</span>
                    </button>
                    {expandedPhases[phase] !== false && (
                      <div className="divide-y">
                        {(tasksByPhase[phase] || []).map(task => (
                          <div key={task.id} draggable onDragStart={e => handleDragStart(e, task)} onDragOver={handleDragOver} onDrop={e => handleDrop(e, task)}
                            className={`flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 cursor-move ${task.isInspection ? 'bg-red-50' : ''} ${task.conditionalType && project.conditions.includes(task.conditionalType) ? 'bg-amber-50' : ''}`}>
                            <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                            <select value={task.status} onChange={e => updateTask(task.id, { status: e.target.value })} className={`text-xs px-2 py-1 rounded-full border-0 shrink-0 ${getStatusColor(task.status)}`}>
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="complete">Complete</option>
                              <option value="blocked">Blocked</option>
                            </select>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${task.status === 'complete' ? 'line-through text-gray-400' : ''}`}>{task.task}</p>
                              {task.notes && <p className="text-xs text-gray-500 truncate">{task.notes}</p>}
                            </div>
                            {task.contractor && <span className="text-xs text-blue-600 shrink-0">{task.contractor}</span>}
                            <span className="text-xs text-gray-400 shrink-0">{task.daysEstimate}d</span>
                            <button onClick={() => { setEditTaskData({ ...task }); setShowEditTask(task.id); }} className="text-gray-400 hover:text-blue-500 shrink-0"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        {(!tasksByPhase[phase] || tasksByPhase[phase].length === 0) && (
                          <div className="px-4 py-3 text-sm text-gray-400 italic">No tasks in this phase</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTRACTORS TAB */}
          {activeTab === 'contractors' && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold">Contractors</h2>
                <button onClick={() => setShowAddContractor(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"><Plus className="w-4 h-4" />Add</button>
              </div>
              <div className="grid gap-4">
                {project.contractors.map(c => {
                  const totalPaid = c.payments?.reduce((s, p) => s + p.amount, 0) || 0;
                  const remaining = (c.quote || 0) - totalPaid;
                  return (
                    <div key={c.id} className="bg-white rounded-xl border p-4">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{c.name}</h3>
                          <span className="text-sm text-blue-600">{c.trade}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setShowEditContractor(c.id); }} className="p-1.5 hover:bg-gray-100 rounded"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                          <button onClick={() => deleteContractor(c.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-gray-400" /></button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        {c.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{c.phone}</div>}
                        {c.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{c.email}</div>}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg mb-3">
                        <div><p className="text-xs text-gray-500">Quote</p><p className="font-semibold">{formatCurrency(c.quote)}</p></div>
                        <div><p className="text-xs text-gray-500">Paid</p><p className="font-semibold text-green-600">{formatCurrency(totalPaid)}</p></div>
                        <div><p className="text-xs text-gray-500">Remaining</p><p className={`font-semibold ${remaining > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{formatCurrency(remaining)}</p></div>
                      </div>

                      <button onClick={() => { setShowAddPayment(c.id); setNewPayment({ amount: 0, date: new Date().toISOString().split('T')[0], method: 'check', note: '' }); }} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 mb-3">
                        <DollarSign className="w-4 h-4" /> Record Payment
                      </button>

                      {c.payments && c.payments.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-2">Payment History</p>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {c.payments.map((p, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <div>
                                  <span className="font-medium">{formatCurrency(p.amount)}</span>
                                  <span className="text-gray-400 ml-2">via {p.method}</span>
                                  {p.note && <p className="text-xs text-gray-500">{p.note}</p>}
                                </div>
                                <span className="text-xs text-gray-400">{p.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {project.contractors.length === 0 && <div className="text-center py-8 text-gray-500">No contractors added yet</div>}
              </div>
            </div>
          )}

          {/* ALL PAYMENTS / LEDGER TAB */}
          {activeTab === 'ledger' && (
            <div>
              <h2 className="font-semibold mb-3">All Payments & Expenses</h2>
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2">Date</th>
                        <th className="text-left px-3 py-2">Type</th>
                        <th className="text-left px-3 py-2">To / Description</th>
                        <th className="text-left px-3 py-2">Method</th>
                        <th className="text-right px-3 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {allPayments.map((p, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">{p.date}</td>
                          <td className="px-3 py-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${p.type === 'contractor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              {p.type === 'contractor' ? 'Contractor' : 'Receipt'}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {p.type === 'contractor' ? (
                              <div>
                                <span className="font-medium">{p.contractorName}</span>
                                <span className="text-gray-400 ml-1">({p.contractorTrade})</span>
                                {p.note && <p className="text-xs text-gray-500">{p.note}</p>}
                              </div>
                            ) : (
                              <div>
                                <span className="font-medium">{p.note}</span>
                                {p.vendor && <span className="text-gray-400 ml-1">- {p.vendor}</span>}
                                {p.category && <p className="text-xs text-gray-500">{p.category}</p>}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-500">{p.method}</td>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(p.amount)}</td>
                        </tr>
                      ))}
                      {allPayments.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">No payments recorded yet</td></tr>}
                    </tbody>
                    {allPayments.length > 0 && (
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={4} className="px-3 py-2 text-right font-medium">Total:</td>
                          <td className="px-3 py-2 text-right font-bold">{formatCurrency(allPayments.reduce((s, p) => s + p.amount, 0))}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RECEIPTS TAB */}
          {activeTab === 'receipts' && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold">Receipts & Expenses</h2>
                <button onClick={() => setShowAddReceipt(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"><Plus className="w-4 h-4" />Add</button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left px-3 py-2">Date</th><th className="text-left px-3 py-2">Description</th><th className="text-left px-3 py-2">Vendor</th><th className="text-left px-3 py-2">Category</th><th className="text-right px-3 py-2">Amount</th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {project.receipts.map(r => (
                        <tr key={r.id}><td className="px-3 py-2">{r.date}</td><td className="px-3 py-2 font-medium">{r.description}</td><td className="px-3 py-2 text-gray-500">{r.vendor}</td><td className="px-3 py-2"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{r.category}</span></td><td className="px-3 py-2 text-right font-medium">{formatCurrency(r.amount)}</td></tr>
                      ))}
                      {project.receipts.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">No receipts yet</td></tr>}
                    </tbody>
                    {project.receipts.length > 0 && <tfoot className="bg-slate-50"><tr><td colSpan={4} className="px-3 py-2 text-right font-medium">Total:</td><td className="px-3 py-2 text-right font-bold">{formatCurrency(financials.totalReceiptsAmount)}</td></tr></tfoot>}
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MATERIALS TAB */}
          {activeTab === 'materials' && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold">Materials</h2>
                <button onClick={() => setShowAddMaterial(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"><Plus className="w-4 h-4" />Add</button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left px-3 py-2">Item</th><th className="text-left px-3 py-2">Qty</th><th className="text-right px-3 py-2">Est.</th><th className="text-right px-3 py-2">Actual</th><th className="text-center px-3 py-2">Ord</th><th className="text-center px-3 py-2">Rcv</th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {project.materials.map(m => (
                        <tr key={m.id}>
                          <td className="px-3 py-2 font-medium">{m.item}</td>
                          <td className="px-3 py-2">{m.quantity} {m.unit}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(m.estimatedCost)}</td>
                          <td className="px-3 py-2 text-right"><input type="number" value={m.actualCost} onChange={e => setProjects(projects.map(p => p.id !== selectedProject ? p : { ...p, materials: p.materials.map(mat => mat.id === m.id ? { ...mat, actualCost: parseFloat(e.target.value) || 0 } : mat) }))} className="w-20 border rounded px-2 py-1 text-right" /></td>
                          <td className="px-3 py-2 text-center"><input type="checkbox" checked={m.ordered} onChange={e => setProjects(projects.map(p => p.id !== selectedProject ? p : { ...p, materials: p.materials.map(mat => mat.id === m.id ? { ...mat, ordered: e.target.checked } : mat) }))} /></td>
                          <td className="px-3 py-2 text-center"><input type="checkbox" checked={m.received} onChange={e => setProjects(projects.map(p => p.id !== selectedProject ? p : { ...p, materials: p.materials.map(mat => mat.id === m.id ? { ...mat, received: e.target.checked } : mat) }))} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FINANCIALS TAB */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500">Sale Price</p><p className="text-xl font-bold">{formatCurrency(project.expectedSalePrice)}</p></div>
                <div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500">Est. Cost</p><p className="text-xl font-bold">{formatCurrency(financials.totalEstimatedCost)}</p></div>
                <div className={`rounded-xl border p-4 ${financials.expectedProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}><p className="text-xs text-gray-500">Est. Profit</p><p className={`text-xl font-bold ${financials.expectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(financials.expectedProfit)}</p></div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-3">Cost Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b"><span>Lot Cost</span><span className="font-medium">{formatCurrency(project.lotCost)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span>Contractor Quotes</span><span className="font-medium">{formatCurrency(financials.totalContractorQuotes)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span>Materials (Est.)</span><span className="font-medium">{formatCurrency(financials.totalMaterialsEstimate)}</span></div>
                  <div className="flex justify-between py-2 font-bold"><span>Total Estimated</span><span>{formatCurrency(financials.totalEstimatedCost)}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-3">Actual Spending</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b"><span>Lot Paid</span><span className="font-medium">{formatCurrency(project.lotCost)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span>Contractors Paid</span><span className="font-medium">{formatCurrency(financials.totalContractorPaid)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span>Materials (Actual)</span><span className="font-medium">{formatCurrency(financials.totalMaterialsActual)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span>Receipts</span><span className="font-medium">{formatCurrency(financials.totalReceiptsAmount)}</span></div>
                  <div className="flex justify-between py-2 font-bold"><span>Total Spent</span><span>{formatCurrency(financials.totalActualSpent)}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div>
              <h2 className="font-semibold mb-3">Conditional Alerts</h2>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((a, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">{a.task}</p>
                          <p className="text-sm text-amber-700"><span className="font-medium">Condition:</span> {a.condition}</p>
                          {a.notes && <p className="text-sm text-amber-600 mt-1">{a.notes}</p>}
                          <p className="text-xs text-amber-500 mt-1">Phase: {a.phase}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-8 text-center text-gray-500">
                  <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>No active alerts</p>
                  <p className="text-sm">Set conditions in Settings</p>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Phase Management */}
              <div className="bg-white rounded-xl border p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Manage Phases</h3>
                  <button onClick={() => setShowAddPhase(true)} className="flex items-center gap-1 text-blue-600 text-sm font-medium"><Plus className="w-4 h-4" />Add Phase</button>
                </div>
                <p className="text-sm text-gray-500 mb-3">Add, remove, or reorder construction phases. Tasks are grouped by these phases.</p>
                <div className="space-y-2">
                  {project.phases.map((phase, idx) => (
                    <div key={phase} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                        <span className="font-medium">{phase}</span>
                        <span className="text-xs text-gray-400">({tasksByPhase[phase]?.length || 0} tasks)</span>
                      </div>
                      <button onClick={() => removePhase(phase)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-3">Project Conditions</h3>
                <p className="text-sm text-gray-500 mb-3">Select conditions that apply to this build. Tasks with matching conditions will show alerts.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CONDITIONAL_OPTIONS.map(opt => (
                    <label key={opt.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={project.conditions.includes(opt.id)} onChange={e => updateProject(project.id, { conditions: e.target.checked ? [...project.conditions, opt.id] : project.conditions.filter(c => c !== opt.id) })} className="w-4 h-4" />
                      <div><p className="font-medium text-sm">{opt.label}</p><p className="text-xs text-gray-500">{opt.description}</p></div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-3">Project Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">Project Name</label><input type="text" value={project.name} onChange={e => updateProject(project.id, { name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Address</label><input type="text" value={project.address} onChange={e => updateProject(project.id, { address: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Lot Cost ($)</label><input type="number" value={project.lotCost} onChange={e => updateProject(project.id, { lotCost: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Expected Sale Price ($)</label><input type="number" value={project.expectedSalePrice} onChange={e => updateProject(project.id, { expectedSalePrice: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                <button onClick={() => { setProjects(projects.filter(p => p.id !== project.id)); setCurrentView('projects'); setSelectedProject(null); }} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">Delete Project</button>
              </div>
            </div>
          )}
        </main>

        {/* ADD TASK MODAL */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between mb-4"><h3 className="font-semibold">Add New Task</h3><button onClick={() => setShowAddTask(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Phase *</label>
                  <select value={newTask.phase} onChange={e => setNewTask({ ...newTask, phase: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1">
                    <option value="">Select a phase...</option>
                    {project.phases.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Task Name *</label>
                  <input type="text" placeholder="e.g., Pour concrete slab" value={newTask.task} onChange={e => setNewTask({ ...newTask, task: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Notes / Description</label>
                  <input type="text" placeholder="Additional details or reminders" value={newTask.notes} onChange={e => setNewTask({ ...newTask, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Contractor</label>
                    <input type="text" placeholder="e.g., Plumber" value={newTask.contractor} onChange={e => setNewTask({ ...newTask, contractor: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Est. Days</label>
                    <input type="number" placeholder="1" value={newTask.daysEstimate} onChange={e => setNewTask({ ...newTask, daysEstimate: parseInt(e.target.value) || 1 })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Conditional Alert (optional)</label>
                  <select value={newTask.conditionalType} onChange={e => setNewTask({ ...newTask, conditionalType: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1">
                    <option value="">None - always show this task</option>
                    {CONDITIONAL_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label} - {opt.description}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddTask(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addTask} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Add Task</button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT TASK MODAL */}
        {showEditTask && editTaskData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between mb-4"><h3 className="font-semibold">Edit Task</h3><button onClick={() => { setShowEditTask(null); setEditTaskData(null); }}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Phase *</label>
                  <select value={editTaskData.phase} onChange={e => setEditTaskData({ ...editTaskData, phase: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1">
                    {project.phases.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Task Name *</label>
                  <input type="text" value={editTaskData.task} onChange={e => setEditTaskData({ ...editTaskData, task: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Notes / Description</label>
                  <input type="text" value={editTaskData.notes || ''} onChange={e => setEditTaskData({ ...editTaskData, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Contractor</label>
                    <input type="text" value={editTaskData.contractor || ''} onChange={e => setEditTaskData({ ...editTaskData, contractor: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Est. Days</label>
                    <input type="number" value={editTaskData.daysEstimate} onChange={e => setEditTaskData({ ...editTaskData, daysEstimate: parseInt(e.target.value) || 1 })} className="w-full border rounded-lg px-3 py-2 mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Status</label>
                  <select value={editTaskData.status} onChange={e => setEditTaskData({ ...editTaskData, status: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="complete">Complete</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Conditional Alert</label>
                  <select value={editTaskData.conditionalType || ''} onChange={e => setEditTaskData({ ...editTaskData, conditionalType: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1">
                    <option value="">None</option>
                    {CONDITIONAL_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setShowEditTask(null); setEditTaskData(null); }} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={saveEditTask} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD CONTRACTOR MODAL */}
        {showAddContractor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-md">
              <div className="flex justify-between mb-4"><h3 className="font-semibold">Add Contractor</h3><button onClick={() => setShowAddContractor(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-500 font-medium">Company / Name *</label><input type="text" placeholder="e.g., Mike's Plumbing" value={newContractor.name} onChange={e => setNewContractor({ ...newContractor, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Trade</label><input type="text" placeholder="e.g., Plumber, Electrician, HVAC" value={newContractor.trade} onChange={e => setNewContractor({ ...newContractor, trade: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Phone</label><input type="tel" placeholder="214-555-0100" value={newContractor.phone} onChange={e => setNewContractor({ ...newContractor, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Email</label><input type="email" placeholder="contractor@email.com" value={newContractor.email} onChange={e => setNewContractor({ ...newContractor, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Quote Amount ($)</label><input type="number" placeholder="0" value={newContractor.quote} onChange={e => setNewContractor({ ...newContractor, quote: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddContractor(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addContractor} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD PAYMENT MODAL */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-md">
              <div className="flex justify-between mb-4"><h3 className="font-semibold">Record Payment</h3><button onClick={() => setShowAddPayment(null)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-500 font-medium">Amount ($) *</label><input type="number" placeholder="0" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Date *</label><input type="date" value={newPayment.date} onChange={e => setNewPayment({ ...newPayment, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Payment Method</label>
                  <select value={newPayment.method} onChange={e => setNewPayment({ ...newPayment, method: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1">
                    {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-gray-500 font-medium">Note (optional)</label><input type="text" placeholder="e.g., Check #1234, 50% deposit" value={newPayment.note} onChange={e => setNewPayment({ ...newPayment, note: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddPayment(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={() => addPaymentToContractor(showAddPayment)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg">Record Payment</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD PHASE MODAL */}
        {showAddPhase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-sm">
              <div className="flex justify-between mb-4"><h3 className="font-semibold">Add Phase</h3><button onClick={() => setShowAddPhase(false)}><X className="w-5 h-5" /></button></div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Phase Name *</label>
                <input type="text" placeholder="e.g., Landscaping" value={newPhase} onChange={e => setNewPhase(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddPhase(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addPhase} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Add Phase</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD RECEIPT MODAL */}
        {showAddReceipt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-md">
              <div className="flex justify-between mb-4"><h3 className="font-semibold">Add Receipt</h3><button onClick={() => setShowAddReceipt(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-500 font-medium">Date *</label><input type="date" value={newReceipt.date} onChange={e => setNewReceipt({ ...newReceipt, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Description *</label><input type="text" placeholder="What was purchased" value={newReceipt.description} onChange={e => setNewReceipt({ ...newReceipt, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Vendor</label><input type="text" placeholder="e.g., Home Depot, Lowe's" value={newReceipt.vendor} onChange={e => setNewReceipt({ ...newReceipt, vendor: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Category</label><select value={newReceipt.category} onChange={e => setNewReceipt({ ...newReceipt, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1"><option value="">Select category...</option>{RECEIPT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="text-xs text-gray-500 font-medium">Amount ($) *</label><input type="number" placeholder="0" value={newReceipt.amount} onChange={e => setNewReceipt({ ...newReceipt, amount: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddReceipt(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addReceipt} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD MATERIAL MODAL */}
        {showAddMaterial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-md">
              <div className="flex justify-between mb-4"><h3 className="font-semibold">Add Material</h3><button onClick={() => setShowAddMaterial(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-500 font-medium">Item Name *</label><input type="text" placeholder="e.g., 2x4 Lumber" value={newMaterial.item} onChange={e => setNewMaterial({ ...newMaterial, item: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">Quantity</label><input type="number" placeholder="1" value={newMaterial.quantity} onChange={e => setNewMaterial({ ...newMaterial, quantity: parseFloat(e.target.value) || 1 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Unit</label><input type="text" placeholder="e.g., yards, pcs, lot" value={newMaterial.unit} onChange={e => setNewMaterial({ ...newMaterial, unit: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
                </div>
                <div><label className="text-xs text-gray-500 font-medium">Estimated Cost ($)</label><input type="number" placeholder="0" value={newMaterial.estimatedCost} onChange={e => setNewMaterial({ ...newMaterial, estimatedCost: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddMaterial(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={addMaterial} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
}
