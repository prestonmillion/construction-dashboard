import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Users, DollarSign, Building2, Phone, Mail, X, ChevronDown, Edit2, CreditCard, Banknote, Building, Wallet, Home, FolderKanban, Search, Moon, Sun, UserPlus, Briefcase, Landmark, Globe, FileText, MessageSquare, GripVertical, User, Clock, CheckCircle, XCircle, AlertCircle, Percent, Calendar, Hash, TrendingUp, TrendingDown, Package, MapPin, Truck, Menu } from 'lucide-react';

// Hide scrollbar utility
const scrollbarHide = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
if (typeof document !== 'undefined' && !document.getElementById('scrollbar-hide-style')) {
  const style = document.createElement('style');
  style.id = 'scrollbar-hide-style';
  style.textContent = scrollbarHide;
  document.head.appendChild(style);
}

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
const RECEIPT_CATEGORIES = ['Materials', 'Labor', 'Permits', 'Utilities', 'Insurance', 'Equipment', 'Subcontractor', 'Inspection', 'Other'];
const FILE_CATEGORIES = ['Contracts', 'Insurance', 'Plans', 'Survey', 'Permits', 'Invoices', 'Lien Waivers', 'Inspections', 'Closing', 'Other'];
const PHOTO_TAGS = ['Progress', 'Before', 'After', 'Issue', 'Inspection', 'Foundation', 'Framing', 'Electrical', 'Plumbing', 'HVAC', 'Drywall', 'Exterior', 'Interior', 'Final'];
const MATERIAL_CATEGORIES = ['Lumber', 'Concrete', 'Roofing', 'Siding', 'Windows/Doors', 'Electrical', 'Plumbing', 'HVAC', 'Insulation', 'Drywall', 'Flooring', 'Cabinets', 'Fixtures', 'Hardware', 'Paint', 'Appliances', 'Other'];
const ORDER_STATUSES = ['pending', 'ordered', 'shipped', 'delivered', 'installed'];

// Phone number formatting: 323-326-6079
const formatPhone = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// Currency formatting for display: $1,234.56
const formatCurrency = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Parse currency back to number
const parseCurrency = (value) => {
  if (!value) return 0;
  return parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
};

// Number input formatting (with commas, no decimals forced)
const formatNumber = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
};

// Percentage formatting
const formatPercent = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '';
  return num.toString();
};

const PHASES = ["Pre-Construction", "Permits", "Site Prep", "Foundation", "Framing", "Exterior", "Rough-Ins", "Insulation", "Drywall", "Finishes", "Final"];
const TASKS = [
  { phase: "Pre-Construction", task: "Research zoning & easements", days: 3, trade: null },
  { phase: "Pre-Construction", task: "Buy lot", days: 1, trade: null },
  { phase: "Pre-Construction", task: "Get survey", days: 5, trade: 'Surveyor' },
  { phase: "Pre-Construction", task: "Get plans drawn", days: 21, trade: 'Architect' },
  { phase: "Permits", task: "Submit plans / pull permit", days: 2, trade: null },
  { phase: "Permits", task: "Builders risk insurance", days: 2, trade: null },
  { phase: "Site Prep", task: "Set temp pole", days: 2, trade: 'Electrical' },
  { phase: "Site Prep", task: "Clear lot", days: 3, trade: 'Excavation' },
  { phase: "Foundation", task: "Foundation markings", days: 1, trade: 'Surveyor' },
  { phase: "Foundation", task: "Footings", days: 2, trade: 'Foundation' },
  { phase: "Foundation", task: "⚠️ Footings inspection", days: 1, inspection: true, trade: null },
  { phase: "Foundation", task: "Pour footings", days: 8, trade: 'Concrete' },
  { phase: "Foundation", task: "Lay blocks", days: 10, trade: 'Foundation' },
  { phase: "Foundation", task: "Plumber rough-ins", days: 2, trade: 'Plumbing' },
  { phase: "Foundation", task: "⚠️ Plumbing inspection", days: 1, inspection: true, trade: null },
  { phase: "Foundation", task: "Pour slab", days: 8, trade: 'Concrete' },
  { phase: "Framing", task: "Framing", days: 14, trade: 'Framing' },
  { phase: "Framing", task: "Doors & windows", days: 2, trade: 'Framing' },
  { phase: "Framing", task: "⚠️ Framing inspection", days: 1, inspection: true, trade: null },
  { phase: "Exterior", task: "Brick/siding", days: 5, trade: 'General' },
  { phase: "Exterior", task: "Roofing", days: 3, trade: 'Roofing' },
  { phase: "Rough-Ins", task: "HVAC rough-ins", days: 3, trade: 'HVAC' },
  { phase: "Rough-Ins", task: "Plumbing top outs", days: 2, trade: 'Plumbing' },
  { phase: "Rough-Ins", task: "Electrical rough-ins", days: 3, trade: 'Electrical' },
  { phase: "Rough-Ins", task: "⚠️ Rough-in inspections", days: 1, inspection: true, trade: null },
  { phase: "Insulation", task: "Insulation", days: 1, trade: 'Insulation' },
  { phase: "Drywall", task: "Hang drywall", days: 5, trade: 'Drywall' },
  { phase: "Drywall", task: "Finish drywall", days: 5, trade: 'Drywall' },
  { phase: "Finishes", task: "Flooring", days: 3, trade: 'Flooring' },
  { phase: "Finishes", task: "Paint", days: 6, trade: 'Painting' },
  { phase: "Finishes", task: "Trim", days: 3, trade: 'Framing' },
  { phase: "Finishes", task: "Cabinets", days: 2, trade: 'Cabinets' },
  { phase: "Finishes", task: "Countertops", days: 7, trade: 'Countertops' },
  { phase: "Finishes", task: "Plumbing fixtures", days: 2, trade: 'Plumbing' },
  { phase: "Final", task: "Driveway", days: 2, trade: 'Concrete' },
  { phase: "Final", task: "Landscaping", days: 2, trade: 'Landscaping' },
  { phase: "Final", task: "⚠️ Final inspection", days: 1, inspection: true, trade: null },
  { phase: "Final", task: "Certificate of Occupancy", days: 3, trade: null },
];

const fmt = n => n == null || n === '' ? '' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString() : '';
const fmtPct = n => n != null ? `${n}%` : '';

export default function App() {
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView] = useState('dashboard');
  const [projId, setProjId] = useState(null);
  const [tab, setTab] = useState('tasks');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [form, setForm] = useState({});
  const [sel, setSel] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tradeFilter, setTradeFilter] = useState('all');
  const [contractorSearch, setContractorSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierCategoryFilter, setSupplierCategoryFilter] = useState('all');
  const [supplierCityFilter, setSupplierCityFilter] = useState('all');
  const [photoFilter, setPhotoFilter] = useState('all');
  const [photoTagFilter, setPhotoTagFilter] = useState('all');
  const [fileFilter, setFileFilter] = useState('all');
  const [fileSearch, setFileSearch] = useState('');
  const [fileSort, setFileSort] = useState('date-desc');
  const [matFilter, setMatFilter] = useState('all');
  const [matStatusFilter, setMatStatusFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');
  const [projectContractorSearch, setProjectContractorSearch] = useState('');
  const [projectContractorTradeFilter, setProjectContractorTradeFilter] = useState('all');
  const [tradeFilters, setTradeFilters] = useState([]); // Multi-select for contractors
  const [supplierCategoryFilters, setSupplierCategoryFilters] = useState([]); // Multi-select for suppliers

  const [user] = useState({ id: 1, name: 'Preston', role: 'admin', avatar: 'P', color: 'bg-blue-600' });
  const [team, setTeam] = useState([
    { id: 1, name: 'Preston', email: 'preston@example.com', phone: '870-555-0001', role: 'admin', avatar: 'P', color: 'bg-blue-600' },
    { id: 2, name: 'Partner', email: 'partner@example.com', phone: '870-555-0002', role: 'partner', avatar: 'PA', color: 'bg-emerald-600' },
  ]);
  const [contractors, setContractors] = useState([
    { id: 1, name: "Mike's Foundation", contact: "Mike Johnson", trade: "Foundation", phone: "(870) 555-0101", email: "mike@foundation.com", city: "Jonesboro", state: "AR", address: "123 Industrial Dr", license: "AR-12345", notes: "Reliable, 15 years experience" },
    { id: 2, name: "ABC Framing", contact: "John Davis", trade: "Framing", phone: "(870) 555-0102", email: "john@abcframing.com", city: "Jonesboro", state: "AR", address: "456 Builder Blvd", license: "AR-23456", notes: "" },
    { id: 3, name: "Pro Electric", contact: "Steve Wilson", trade: "Electrical", phone: "(870) 555-0103", email: "pro@electric.com", city: "Paragould", state: "AR", address: "789 Volt Ave", license: "AR-34567", notes: "Licensed master electrician" },
    { id: 4, name: "Quality Plumbing", contact: "Bob Martinez", trade: "Plumbing", phone: "(870) 555-0104", email: "quality@plumbing.com", city: "Jonesboro", state: "AR", address: "321 Pipe St", license: "AR-45678", notes: "" },
    { id: 5, name: "Cool Air HVAC", contact: "Tom Brown", trade: "HVAC", phone: "(870) 555-0105", email: "tom@coolair.com", city: "Trumann", state: "AR", address: "555 Climate Rd", license: "AR-56789", notes: "Specializes in heat pumps" },
    { id: 6, name: "Delta Drywall", contact: "James Lee", trade: "Drywall", phone: "(870) 555-0106", email: "james@deltadrywall.com", city: "Trumann", state: "AR", address: "777 Sheet Ln", license: "AR-67890", notes: "" },
    { id: 7, name: "NEA Surveying", contact: "Mark Thompson", trade: "Surveyor", phone: "(870) 555-0107", email: "mark@neasurvey.com", city: "Jonesboro", state: "AR", address: "100 Survey Ln", license: "PLS-1234", notes: "Fast turnaround" },
    { id: 8, name: "Clear Cut Excavation", contact: "Randy White", trade: "Excavation", phone: "(870) 555-0108", email: "randy@clearcutex.com", city: "Jonesboro", state: "AR", address: "200 Dirt Rd", license: "AR-78901", notes: "Has bobcat and mini excavator" },
    { id: 9, name: "Solid Rock Concrete", contact: "Carlos Garcia", trade: "Concrete", phone: "(870) 555-0109", email: "carlos@solidrock.com", city: "Paragould", state: "AR", address: "300 Cement Dr", license: "AR-89012", notes: "Slabs, driveways, flatwork" },
    { id: 10, name: "Top Notch Roofing", contact: "Kevin Harris", trade: "Roofing", phone: "(870) 555-0110", email: "kevin@topnotchroofing.com", city: "Jonesboro", state: "AR", address: "400 Shingle Way", license: "AR-90123", notes: "GAF certified installer" },
    { id: 11, name: "Comfort Insulation", contact: "Danny Mills", trade: "Insulation", phone: "(870) 555-0111", email: "danny@comfortins.com", city: "Jonesboro", state: "AR", address: "500 Thermal Ave", license: "AR-01234", notes: "Spray foam and batt" },
    { id: 12, name: "Perfect Floors", contact: "Lisa Chen", trade: "Flooring", phone: "(870) 555-0112", email: "lisa@perfectfloors.com", city: "Jonesboro", state: "AR", address: "600 Hardwood Ln", license: "AR-11111", notes: "LVP, hardwood, tile" },
    { id: 13, name: "Premier Painting", contact: "Alex Turner", trade: "Painting", phone: "(870) 555-0113", email: "alex@premierpaint.com", city: "Jonesboro", state: "AR", address: "700 Color St", license: "AR-22222", notes: "Interior and exterior" },
    { id: 14, name: "Custom Cabinets Plus", contact: "Wayne Brooks", trade: "Cabinets", phone: "(870) 555-0114", email: "wayne@customcabinets.com", city: "Paragould", state: "AR", address: "800 Cabinet Dr", license: "AR-33333", notes: "Kitchen and bath specialist" },
    { id: 15, name: "Stone Surface Co", contact: "Maria Santos", trade: "Countertops", phone: "(870) 555-0115", email: "maria@stonesurface.com", city: "Jonesboro", state: "AR", address: "900 Granite Blvd", license: "AR-44444", notes: "Granite, quartz, marble" },
    { id: 16, name: "Green Thumb Landscaping", contact: "Eric Palmer", trade: "Landscaping", phone: "(870) 555-0116", email: "eric@greenthumbland.com", city: "Jonesboro", state: "AR", address: "1000 Garden Way", license: "AR-55555", notes: "Sod, trees, irrigation" },
  ]);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Barton's Lumber", contact: "Bill Barton", category: "Lumber", phone: "(870) 555-1001", email: "orders@bartonslumber.com", city: "Jonesboro", state: "AR", address: "1000 Timber Rd", website: "bartonslumber.com", accountNum: "ACCT-001", notes: "Best prices on framing lumber" },
    { id: 2, name: "ABC Supply", contact: "Sales Desk", category: "Roofing", phone: "(870) 555-1002", email: "sales@abcsupply.com", city: "Jonesboro", state: "AR", address: "2000 Supply Dr", website: "abcsupply.com", accountNum: "ACCT-002", notes: "Roofing and siding" },
    { id: 3, name: "Ferguson Plumbing", contact: "Counter Sales", category: "Plumbing", phone: "(870) 555-1003", email: "jonesboro@ferguson.com", city: "Jonesboro", state: "AR", address: "3000 Pipe Blvd", website: "ferguson.com", accountNum: "FERG-123", notes: "Commercial account" },
    { id: 4, name: "Home Depot Pro", contact: "Pro Desk", category: "Other", phone: "(870) 555-1004", email: "pro@homedepot.com", city: "Jonesboro", state: "AR", address: "4000 Commerce Dr", website: "homedepot.com", accountNum: "HD-PRO-456", notes: "General supplies" },
    { id: 5, name: "Lowe's Pro", contact: "Pro Services", category: "Other", phone: "(870) 555-1005", email: "pro@lowes.com", city: "Paragould", state: "AR", address: "5000 Retail Way", website: "lowes.com", accountNum: "LP-789", notes: "" },
  ]);
  const [counties, setCounties] = useState([{
    id: 1, name: 'Craighead County', state: 'AR',
    contacts: [
      { id: 1, title: 'Building Inspector', name: 'John Smith', phone: '(870) 933-4340', email: 'inspector@craigheadcounty.gov', address: '511 S Main St, Jonesboro, AR' },
      { id: 2, title: 'Permit Office', name: 'Jane Doe', phone: '(870) 933-4341', email: 'permits@craigheadcounty.gov', address: '511 S Main St, Jonesboro, AR' },
    ]
  }]);
  const [globalPhases, setGlobalPhases] = useState([...PHASES]);
  const [phaseTemplates, setPhaseTemplates] = useState([
    { id: 1, name: 'Standard Build', description: 'Default phases for standard construction', phases: [...PHASES], tasks: [...TASKS] },
    { id: 2, name: 'Concrete Floors', description: 'For builds with polished concrete floors', phases: [...PHASES], tasks: TASKS.filter(t => t.task !== 'Flooring') },
    { id: 3, name: 'Brick Exterior', description: 'For brick/masonry exterior builds', phases: [...PHASES.slice(0, 6), 'Masonry', ...PHASES.slice(6)], tasks: [...TASKS, { phase: 'Masonry', task: 'Brick veneer install', days: 10, trade: 'Other' }] },
  ]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [draggedPhase, setDraggedPhase] = useState(null);
  const [projects, setProjects] = useState([{
    id: 1, name: "123 Main St", address: "123 Main St, Jonesboro, AR", status: "active", county: "Craighead County",
    templateId: 1, // Which phase template this project uses
    taskCounter: TASKS.length, // Counter for generating sequential task IDs
    // Financials
    salePrice: 285000,
    costs: {
      lot: 45000,
      permits: 1500,
      titleClosing: 3500,
      lendingFees: 4000,
      utilities: 800,
      insurance: 1200,
      contingency: 5000,
    },
    // Financing
    financing: {
      type: 'loan', // 'cash' or 'loan'
      lender: 'First National Bank',
      loanNumber: 'CL-2025-0042',
      loanAmount: 200000,
      interestRate: 8.5,
      term: 12, // months
      expirationDate: '2026-01-15',
      points: 1.5,
      originationFee: 1500,
    },
    client: {
      name: "John & Jane Smith",
      phone: "(870) 555-1234",
      email: "smithfamily@email.com",
      address: "456 Oak Ave, Jonesboro, AR 72401",
      notes: "First-time home buyers. Prefer communication via text."
    },
    startDate: '2025-01-06', // Project start date
    phases: [...PHASES],
    tasks: TASKS.map((t, i) => {
      // Calculate sample dates - tasks are sequential, each starts after previous ends
      const baseDate = new Date('2025-01-06');
      let dayOffset = 0;
      for (let j = 0; j < i; j++) dayOffset += TASKS[j].days;
      const startDate = new Date(baseDate);
      startDate.setDate(startDate.getDate() + dayOffset);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + t.days - 1);
      
      const isComplete = i < 5;
      const isInProgress = i >= 5 && i < 10;
      
      return { 
        ...t, 
        id: i + 1, 
        status: isComplete ? 'complete' : isInProgress ? 'in_progress' : 'pending', 
        assignedTo: i % 2 === 0 ? 1 : 2,
        contractorId: t.trade === 'Surveyor' ? 7 : t.trade === 'Excavation' ? 8 : t.trade === 'Foundation' ? 1 : t.trade === 'Concrete' ? 9 : t.trade === 'Framing' ? 2 : t.trade === 'Roofing' ? 10 : t.trade === 'Electrical' ? 3 : t.trade === 'Plumbing' ? 4 : t.trade === 'HVAC' ? 5 : t.trade === 'Insulation' ? 11 : t.trade === 'Drywall' ? 6 : t.trade === 'Flooring' ? 12 : t.trade === 'Painting' ? 13 : t.trade === 'Cabinets' ? 14 : t.trade === 'Countertops' ? 15 : t.trade === 'Landscaping' ? 16 : null,
        notes: '',
        priority: t.inspection ? 'high' : 'normal',
        // Date fields
        scheduledStart: startDate.toISOString().split('T')[0],
        scheduledEnd: endDate.toISOString().split('T')[0],
        actualStart: isComplete || isInProgress ? startDate.toISOString().split('T')[0] : null,
        actualEnd: isComplete ? endDate.toISOString().split('T')[0] : null,
        completedDate: isComplete ? endDate.toISOString().split('T')[0] : null,
      };
    }),
    contractors: [
      { id: 1, gid: 1, quote: 8500, payments: [
        { id: 101, amount: 2500, date: '2025-01-15', method: 'check', refNumber: '1001', account: 'Business Checking', paidBy: 'Preston', memo: 'Deposit' },
        { id: 102, amount: 3000, date: '2025-01-20', method: 'check', refNumber: '1002', account: 'Business Checking', paidBy: 'Preston', memo: 'Progress payment' }
      ]},
      { id: 2, gid: 2, quote: 12000, payments: [] }
    ],
    bids: [
      { id: 1, contractorId: 4, trade: 'Plumbing', description: 'Full rough-in and fixtures', amount: 9500, date: '2025-01-10', status: 'pending', notes: 'Includes all fixtures' },
      { id: 2, contractorId: null, trade: 'HVAC', description: '3-ton system install', amount: 8200, date: '2025-01-08', status: 'pending', notes: 'From HVAC Solutions', vendorName: 'HVAC Solutions' },
    ],
    changeRequests: [
      { id: 1, title: 'Upgrade to granite countertops', description: 'Client wants granite instead of laminate in kitchen', status: 'approved', cost: 2500, submittedAt: '2025-01-18', respondedAt: '2025-01-19', notes: 'Approved - will add to final invoice' },
      { id: 2, title: 'Add outlet in garage', description: 'Need 220V outlet for electric car charger', status: 'pending', cost: null, submittedAt: '2025-01-25', respondedAt: null, notes: '' },
    ],
    partners: [
      { id: 1, odId: 1, percentage: 70, role: 'Managing Partner' },
      { id: 2, odId: 2, percentage: 30, role: 'Investor' },
    ],
    receipts: [
      { id: 1, date: '2025-01-12', vendor: 'Home Depot', amount: 1250, category: 'Materials', description: 'Framing lumber', fileName: 'receipt-001.pdf' },
      { id: 2, date: '2025-01-18', vendor: 'City of Jonesboro', amount: 450, category: 'Permits', description: 'Building permit fee', fileName: 'permit-receipt.pdf' },
    ],
    photos: [
      { id: 1, date: '2025-01-05', caption: 'Lot before clearing', phase: 'Pre-Construction', tags: ['Before'], fileName: 'lot-before.jpg', fileData: null },
      { id: 2, date: '2025-01-12', caption: 'Foundation forms set', phase: 'Foundation', tags: ['Progress', 'Foundation'], fileName: 'foundation-forms.jpg', fileData: null },
      { id: 3, date: '2025-01-20', caption: 'Foundation poured', phase: 'Foundation', tags: ['Progress', 'Inspection'], fileName: 'foundation-complete.jpg', fileData: null },
    ],
    files: [
      { id: 1, name: 'Building Permit', fileName: 'permit-2025-001.pdf', category: 'Permits', uploadedAt: '2025-01-08', tags: ['Required', 'City'], notes: 'Valid for 12 months', fileData: null },
      { id: 2, name: 'House Plans', fileName: 'plans-123main.pdf', category: 'Plans', uploadedAt: '2025-01-02', tags: ['Approved'], notes: '3BR/2BA 1850 sqft', fileData: null },
      { id: 3, name: 'Property Survey', fileName: 'survey-123main.pdf', category: 'Survey', uploadedAt: '2025-01-03', tags: ['Required'], notes: 'Includes setbacks', fileData: null },
      { id: 4, name: 'Builder Risk Insurance', fileName: 'insurance-policy.pdf', category: 'Insurance', uploadedAt: '2025-01-05', tags: ['Required', 'Active'], notes: 'Expires 2026-01-05', fileData: null },
      { id: 5, name: 'Foundation Contract', fileName: 'contract-foundation.pdf', category: 'Contracts', uploadedAt: '2025-01-10', tags: ['Signed'], notes: "Mike's Foundation - $8,500", fileData: null },
    ],
    materials: [
      { id: 1, supplierId: 1, category: 'Lumber', item: 'Framing Lumber Package', description: '2x4, 2x6, 2x10 studs and joists', quantity: 1, unit: 'lot', unitPrice: 8500, status: 'delivered', orderDate: '2025-01-08', expectedDate: '2025-01-12', deliveredDate: '2025-01-11', poNumber: 'PO-001', notes: 'Delivered on time' },
      { id: 2, supplierId: 1, category: 'Lumber', item: 'OSB Sheathing', description: '7/16" OSB 4x8 sheets', quantity: 85, unit: 'sheets', unitPrice: 18.50, status: 'delivered', orderDate: '2025-01-08', expectedDate: '2025-01-12', deliveredDate: '2025-01-11', poNumber: 'PO-001', notes: '' },
      { id: 3, supplierId: 2, category: 'Roofing', item: 'Architectural Shingles', description: 'GAF Timberline HDZ Charcoal', quantity: 35, unit: 'squares', unitPrice: 125, status: 'ordered', orderDate: '2025-01-20', expectedDate: '2025-01-28', deliveredDate: null, poNumber: 'PO-002', notes: '30-year warranty' },
      { id: 4, supplierId: 3, category: 'Plumbing', item: 'Rough-in Package', description: 'PEX, fittings, drain lines', quantity: 1, unit: 'lot', unitPrice: 2200, status: 'pending', orderDate: null, expectedDate: null, deliveredDate: null, poNumber: '', notes: 'Need measurements first' },
      { id: 5, supplierId: 4, category: 'Electrical', item: 'Electrical Rough-in', description: 'Wire, boxes, panel, breakers', quantity: 1, unit: 'lot', unitPrice: 3500, status: 'pending', orderDate: null, expectedDate: null, deliveredDate: null, poNumber: '', notes: '' },
    ],
    draws: [
      { id: 1, name: 'Foundation', pct: 15, status: 'received', requestedDate: '2025-01-10', receivedDate: '2025-01-15', amount: 30000, notes: 'Foundation complete' },
      { id: 2, name: 'Framing', pct: 20, status: 'requested', requestedDate: '2025-01-25', receivedDate: null, amount: 40000, notes: 'Awaiting inspection' },
      { id: 3, name: 'Rough-Ins', pct: 15, status: 'pending', requestedDate: null, receivedDate: null, amount: 30000, notes: '' },
      { id: 4, name: 'Finishes', pct: 35, status: 'pending', requestedDate: null, receivedDate: null, amount: 70000, notes: '' },
      { id: 5, name: 'Final', pct: 15, status: 'pending', requestedDate: null, receivedDate: null, amount: 30000, notes: '' },
    ],
  }]);

  const proj = projId ? projects.find(p => p.id === projId) : null;
  
  // Theme
  const bg = dark ? 'bg-slate-900' : 'bg-gray-100';
  const card = dark ? 'bg-slate-800' : 'bg-white';
  const text = dark ? 'text-white' : 'text-gray-900';
  const muted = dark ? 'text-slate-400' : 'text-gray-500';
  const border = dark ? 'border-slate-700' : 'border-gray-200';
  const inputCls = `w-full px-3 py-2.5 rounded-lg border ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const hover = dark ? 'hover:bg-slate-700' : 'hover:bg-gray-50';

  // Financial calculations
  const calcFin = p => {
    const constructionCost = p.contractors.reduce((s, c) => s + (c.quote || 0), 0);
    const softCosts = (p.costs?.permits || 0) + (p.costs?.titleClosing || 0) + (p.costs?.lendingFees || 0) + (p.costs?.utilities || 0) + (p.costs?.insurance || 0) + (p.costs?.contingency || 0);
    const totalCost = (p.costs?.lot || 0) + constructionCost + softCosts;
    const paid = p.contractors.reduce((s, c) => s + (c.payments?.reduce((ss, pay) => ss + (parseFloat(pay.amount) || 0), 0) || 0), 0);
    const profit = (p.salePrice || 0) - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost * 100).toFixed(1) : 0;
    return { constructionCost, softCosts, totalCost, paid, profit, roi };
  };
  
  const getStats = tasks => { 
    const t = tasks.length, c = tasks.filter(x => x.status === 'complete').length; 
    return { total: t, complete: c, pct: t > 0 ? Math.round(c / t * 100) : 0 }; 
  };

  const openProject = (id) => { setProjId(id); setView('project'); setTab('tasks'); };
  const closeModal = () => { setModal(null); setSel(null); setForm({}); };
  const updateProj = (id, upd) => setProjects(projects.map(p => p.id === id ? { ...p, ...upd } : p));

  // Drag handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id.toString());
  };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e, targetTask, phase) => {
    e.preventDefault(); e.stopPropagation();
    if (!draggedTask || draggedTask.id === targetTask.id) { setDraggedTask(null); return; }
    const newTasks = [...proj.tasks];
    const dragIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    if (dragIndex === -1) { setDraggedTask(null); return; }
    const [draggedItem] = newTasks.splice(dragIndex, 1);
    draggedItem.phase = phase;
    const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);
    newTasks.splice(targetIndex, 0, draggedItem);
    updateProj(projId, { tasks: newTasks });
    setDraggedTask(null);
  };
  const handleDropOnPhase = (e, phase) => {
    e.preventDefault(); e.stopPropagation();
    if (!draggedTask) return;
    const newTasks = [...proj.tasks];
    const dragIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    if (dragIndex === -1) { setDraggedTask(null); return; }
    newTasks[dragIndex] = { ...newTasks[dragIndex], phase };
    updateProj(projId, { tasks: newTasks });
    setDraggedTask(null);
  };
  const handleDragEnd = () => { setDraggedTask(null); };

  const statusColors = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
    approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    completed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
    accepted: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  };

  return (
    <div className={`h-screen flex overflow-hidden ${bg}`}>
      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-40 ${dark ? 'bg-slate-800' : 'bg-white'} border-b ${border} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className={`p-2 rounded-lg ${hover}`}><Menu className={`w-5 h-5 ${text}`} /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Building2 className="w-4 h-4 text-white" /></div>
            <span className={`font-semibold ${text}`}>BuildTrack</span>
          </div>
        </div>
        <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg ${hover}`}>{dark ? <Sun className={`w-5 h-5 ${text}`} /> : <Moon className={`w-5 h-5 ${text}`} />}</button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${collapsed ? 'md:w-16' : 'md:w-56'} w-64 bg-slate-900 text-white flex flex-col shrink-0 transition-all fixed md:relative inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className={`p-3 flex items-center ${collapsed ? 'md:justify-center' : 'justify-between'} border-b border-slate-800`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
            {!collapsed && <span className="font-semibold text-sm">BuildTrack</span>}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1 hover:bg-slate-800 rounded"><X className="w-4 h-4" /></button>
          {!collapsed && <button onClick={() => setCollapsed(true)} className="hidden md:block p-1 hover:bg-slate-800 rounded"><ChevronLeft className="w-4 h-4" /></button>}
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {[{ id: 'dashboard', icon: Home, label: 'Dashboard' }, { id: 'projects', icon: FolderKanban, label: 'Projects' }, { id: 'contractors', icon: Briefcase, label: 'Contractors' }, { id: 'suppliers', icon: Package, label: 'Suppliers' }, { id: 'jurisdictions', icon: Landmark, label: 'Jurisdictions' }, { id: 'phases', icon: FileText, label: 'Phases' }, { id: 'team', icon: Users, label: 'Team' }].map(i => (
            <button key={i.id} onClick={() => { setView(i.id); setProjId(null); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition ${view === i.id && !projId ? 'bg-blue-600' : 'text-slate-300 hover:bg-slate-800'}`}>
              <i.icon className="w-4 h-4 shrink-0" />{(!collapsed || mobileMenuOpen) && <span>{i.label}</span>}
            </button>
          ))}
          {(!collapsed || mobileMenuOpen) && (
            <>
              <div className="pt-4 pb-1 px-2 text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Projects</div>
              {projects.map(p => (
                <button key={p.id} onClick={() => { openProject(p.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${projId === p.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="truncate">{p.name}</span>
                </button>
              ))}
              <button onClick={() => { setForm({ financing: { type: 'loan' }, costs: {} }); setModal('addProject'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-800"><Plus className="w-3 h-3" />New Project</button>
            </>
          )}
        </nav>
        <div className="p-2 border-t border-slate-800">
          <button onClick={() => setDark(!dark)} className="hidden md:flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{!collapsed && <span>{dark ? 'Light' : 'Dark'}</span>}</button>
          <div className={`flex items-center gap-2 px-2.5 py-2 ${collapsed ? 'md:justify-center' : ''}`}>
            <div className={`w-7 h-7 rounded-full ${user.color} flex items-center justify-center text-xs font-medium`}>{user.avatar}</div>
            {(!collapsed || mobileMenuOpen) && <div><p className="text-xs font-medium">{user.name}</p><p className="text-[10px] text-slate-500">{user.role}</p></div>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        
        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div><h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Dashboard</h1><p className={muted}>Welcome back, {user.name}</p></div>
              <button onClick={() => { setForm({ financing: { type: 'loan' }, costs: {} }); setModal('addProject'); }} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" />New Project</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6">
              {[
                { label: 'Active Projects', value: projects.length, icon: FolderKanban, color: 'bg-blue-50', iconColor: 'text-blue-600' },
                { label: 'Contractors', value: contractors.length, icon: Briefcase, color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
                { label: 'Pending Bids', value: projects.reduce((s, p) => s + (p.bids?.filter(b => b.status === 'pending').length || 0), 0), icon: FileText, color: 'bg-amber-50', iconColor: 'text-amber-600' },
                { label: 'Total Profit', value: fmt(projects.reduce((s, p) => s + calcFin(p).profit, 0)), icon: DollarSign, color: 'bg-emerald-50', iconColor: 'text-emerald-600', isProfit: true },
              ].map((s, i) => (
                <div key={i} className={`${card} rounded-xl border ${border} p-3 sm:p-4 md:p-5`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`text-[10px] sm:text-xs md:text-sm ${muted} truncate`}>{s.label}</p>
                      <p className={`text-lg sm:text-xl md:text-3xl font-bold mt-0.5 ${s.isProfit ? (projects.reduce((sum, p) => sum + calcFin(p).profit, 0) >= 0 ? 'text-emerald-600' : 'text-red-600') : text}`}>{s.value}</p>
                    </div>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg shrink-0 ${dark ? 'bg-slate-700' : s.color} flex items-center justify-center`}><s.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${s.iconColor}`} /></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`${card} rounded-xl border ${border}`}>
              <div className={`px-4 lg:px-6 py-3 lg:py-4 border-b ${border}`}><h3 className={`font-semibold ${text}`}>Your Projects</h3></div>
              <div className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                {projects.map(p => {
                  const s = getStats(p.tasks), f = calcFin(p);
                  return (
                    <div key={p.id} onClick={() => openProject(p.id)} className={`px-4 lg:px-6 py-4 lg:py-5 ${hover} cursor-pointer transition`}>
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="min-w-0">
                          <p className={`font-semibold text-base lg:text-lg ${text} truncate`}>{p.name}</p>
                          <p className={`${muted} text-sm truncate`}>{p.client?.name && `${p.client.name} • `}{p.financing?.type === 'loan' ? p.financing.lender : 'Cash'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-base lg:text-xl font-bold ${f.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(f.profit)}</p>
                          <span className="inline-flex items-center px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`flex-1 h-2 lg:h-2.5 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-600 h-full rounded-full" style={{ width: `${s.pct}%` }} /></div>
                        <span className={`text-sm font-semibold ${text}`}>{s.pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS LIST */}
        {view === 'projects' && (() => {
          const filteredProjects = projects.filter(p => {
            const matchesSearch = !projectSearch || 
              p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
              p.address?.toLowerCase().includes(projectSearch.toLowerCase()) ||
              p.client?.name?.toLowerCase().includes(projectSearch.toLowerCase());
            const matchesStatus = projectStatusFilter === 'all' || p.status === projectStatusFilter;
            return matchesSearch && matchesStatus;
          });
          return (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Projects</h1>
              <button onClick={() => { setForm({ financing: { type: 'loan' }, costs: {}, templateId: phaseTemplates[0]?.id }); setModal('addProject'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />New Project</button>
            </div>
            
            {/* Search & Filter Bar */}
            <div className={`${card} rounded-xl border ${border} p-3 mb-4 flex flex-col lg:flex-row gap-3`}>
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                <input type="text" placeholder="Search projects..." value={projectSearch} onChange={e => setProjectSearch(e.target.value)} className={`${inputCls} pl-9 py-2`} />
              </div>
              <div className="flex gap-2">
                <select value={projectStatusFilter} onChange={e => setProjectStatusFilter(e.target.value)} className={`${inputCls} flex-1 lg:w-40 py-2`}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredProjects.map(p => {
                const s = getStats(p.tasks), f = calcFin(p);
                return (
                  <div key={p.id} onClick={() => openProject(p.id)} className={`${card} rounded-xl border ${border} p-4 ${hover} cursor-pointer`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className={`font-semibold ${text}`}>{p.name}</p>
                        <p className={`text-xs ${muted}`}>{p.address || 'No address'}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : p.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{p.status || 'active'}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`flex-1 h-2 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${s.pct}%` }} /></div>
                      <span className={`text-xs font-medium ${text}`}>{s.pct}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><p className={`text-xs ${muted}`}>Cost</p><p className={`text-sm font-semibold ${text}`}>{fmt(f.totalCost)}</p></div>
                      <div><p className={`text-xs ${muted}`}>Profit</p><p className={`text-sm font-semibold ${f.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(f.profit)}</p></div>
                      <div><p className={`text-xs ${muted}`}>Client</p><p className={`text-sm font-medium ${text} truncate`}>{p.client?.name || '-'}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                    <th className="text-left px-4 py-3 font-medium">Project</th>
                    <th className="text-left px-4 py-3 font-medium">Client</th>
                    <th className="text-center px-4 py-3 font-medium">Progress</th>
                    <th className="text-right px-4 py-3 font-medium">Cost</th>
                    <th className="text-right px-4 py-3 font-medium">Profit</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map(p => {
                    const s = getStats(p.tasks), f = calcFin(p);
                    return (
                      <tr key={p.id} onClick={() => openProject(p.id)} className={`border-t ${border} ${hover} cursor-pointer`}>
                        <td className={`px-4 py-3 ${text}`}>
                          <p className="font-medium">{p.name}</p>
                          <p className={`text-xs ${muted}`}>{p.address || 'No address'}</p>
                        </td>
                        <td className={`px-4 py-3 ${text}`}>{p.client?.name || <span className={muted}>-</span>}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-center">
                            <div className={`w-16 h-1.5 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${s.pct}%` }} /></div>
                            <span className={`text-xs font-medium ${text}`}>{s.pct}%</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${text}`}>{fmt(f.totalCost)}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${f.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(f.profit)}</td>
                        <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : p.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{p.status || 'active'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredProjects.length === 0 && <div className="p-8 text-center"><FolderKanban className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{projects.length === 0 ? 'No projects yet' : 'No projects match filters'}</p></div>}
            </div>
          </div>
        );})()}

        {/* CONTRACTORS */}
        {view === 'contractors' && (() => {
          const trades = [...new Set(contractors.map(c => c.trade))];
          const cities = [...new Set(contractors.map(c => c.city).filter(Boolean))];
          const filtered = contractors.filter(c => {
            const matchesTrade = tradeFilters.length === 0 || tradeFilters.includes(c.trade);
            const matchesCity = cityFilter === 'all' || c.city === cityFilter;
            const matchesSearch = !contractorSearch || 
              c.name.toLowerCase().includes(contractorSearch.toLowerCase()) ||
              c.contact?.toLowerCase().includes(contractorSearch.toLowerCase()) ||
              c.trade.toLowerCase().includes(contractorSearch.toLowerCase()) ||
              c.city?.toLowerCase().includes(contractorSearch.toLowerCase());
            return matchesTrade && matchesCity && matchesSearch;
          });
          return (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div><h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Contractors</h1><p className={muted}>{filtered.length} of {contractors.length} contractors</p></div>
              <button onClick={() => { setForm({ trade: 'General', state: 'AR' }); setModal('addContractor'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Contractor</button>
            </div>
            
            {/* Search & Filter Bar */}
            <div className={`${card} rounded-xl border ${border} p-3 mb-4 flex flex-col lg:flex-row gap-3`}>
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                <input type="text" placeholder="Search contractors..." value={contractorSearch} onChange={e => setContractorSearch(e.target.value)} className={`${inputCls} pl-9 py-2`} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Multi-select Trade Dropdown */}
                <div className="relative">
                  <button onClick={() => setModal(modal === 'tradeFilter' ? null : 'tradeFilter')} className={`${inputCls} py-2 px-3 flex items-center gap-2 min-w-[140px]`}>
                    <span className="text-sm">{tradeFilters.length === 0 ? 'All Trades' : `${tradeFilters.length} selected`}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </button>
                  {modal === 'tradeFilter' && (
                    <div className={`absolute z-50 mt-1 w-56 ${card} rounded-lg border ${border} shadow-lg max-h-64 overflow-y-auto`}>
                      <div className="p-2 border-b ${border}">
                        <button onClick={() => setTradeFilters([])} className={`text-xs ${muted} hover:text-blue-600`}>Clear all</button>
                      </div>
                      {TRADES.map(t => (
                        <label key={t} className={`flex items-center gap-2 px-3 py-2 ${hover} cursor-pointer`}>
                          <input type="checkbox" checked={tradeFilters.includes(t)} onChange={e => setTradeFilters(e.target.checked ? [...tradeFilters, t] : tradeFilters.filter(x => x !== t))} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className={`text-sm ${text}`}>{t}</span>
                          <span className={`text-xs ${muted} ml-auto`}>{contractors.filter(c => c.trade === t).length}</span>
                        </label>
                      ))}
                      <div className="p-2 border-t ${border}">
                        <button onClick={() => setModal(null)} className="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium">Apply</button>
                      </div>
                    </div>
                  )}
                </div>
                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className={`${inputCls} flex-1 lg:w-40 py-2`}>
                  <option value="all">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {tradeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tradeFilters.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {t}
                    <button onClick={() => setTradeFilters(tradeFilters.filter(x => x !== t))} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <button onClick={() => setTradeFilters([])} className={`text-xs ${muted} hover:text-blue-600 underline`}>Clear all</button>
              </div>
            )}

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filtered.map(c => (
                <div key={c.id} className={`${card} rounded-xl border ${border} p-4`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{c.name.substring(0, 2).toUpperCase()}</div>
                      <div>
                        <p className={`font-semibold ${text}`}>{c.name}</p>
                        <p className={`text-sm ${muted}`}>{c.contact || 'No contact'}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setForm(c); setSel(c); setModal('editContractor'); }} className={`p-2 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{c.trade}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text} flex items-center gap-1`}><MapPin className="w-3 h-3" />{c.city}, {c.state}</span>
                  </div>
                  <div className="flex gap-4">
                    {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-sm text-blue-600"><Phone className="w-4 h-4" />{c.phone}</a>}
                    {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-sm text-blue-600 truncate"><Mail className="w-4 h-4" /><span className="truncate">{c.email}</span></a>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className={`${card} rounded-xl border ${border} p-8 text-center`}><Briefcase className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>No contractors found</p></div>}
            </div>

            {/* Desktop Table View */}
            <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                    <th className="text-left px-4 py-3 font-medium">Company</th>
                    <th className="text-left px-4 py-3 font-medium">Contact</th>
                    <th className="text-left px-4 py-3 font-medium">Trade</th>
                    <th className="text-left px-4 py-3 font-medium">City</th>
                    <th className="text-left px-4 py-3 font-medium">Phone</th>
                    <th className="text-center px-4 py-3 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => {
                    const isExpanded = expanded[`gc-${c.id}`];
                    return (
                      <React.Fragment key={c.id}>
                        <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`gc-${c.id}`]: !e[`gc-${c.id}`] }))}>
                          <td className={`px-4 py-3 ${text}`}>
                            <div className="flex items-center gap-2">
                              <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{c.name.substring(0, 2).toUpperCase()}</div>
                              <span className="font-medium">{c.name}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 ${text}`}>{c.contact || <span className={muted}>-</span>}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{c.trade}</span></td>
                          <td className={`px-4 py-3 ${text}`}><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.city || '-'}, {c.state || ''}</span></td>
                          <td className={`px-4 py-3 ${text}`}>{c.phone ? <a href={`tel:${c.phone}`} className="hover:text-blue-600" onClick={e => e.stopPropagation()}>{c.phone}</a> : <span className={muted}>-</span>}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={e => { e.stopPropagation(); setForm(c); setSel(c); setModal('editContractor'); }} className={`p-1.5 ${hover} rounded`} title="Edit"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                              <button onClick={e => { e.stopPropagation(); if (confirm('Delete contractor?')) setContractors(contractors.filter(x => x.id !== c.id)); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                            <td colSpan="6" className="px-4 py-4">
                              <div className="grid grid-cols-5 gap-6">
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>EMAIL</p>
                                  <p className={`text-sm ${text}`}>{c.email ? <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">{c.email}</a> : '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>ADDRESS</p>
                                  <p className={`text-sm ${text}`}>{c.address || '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>LICENSE</p>
                                  <p className={`text-sm ${text}`}>{c.license || '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>NOTES</p>
                                  <p className={`text-sm ${text}`}>{c.notes || '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>PROJECTS</p>
                                  <p className={`text-sm ${text}`}>{projects.filter(p => p.contractors.some(pc => pc.gid === c.id)).length} active</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="p-8 text-center"><Briefcase className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{contractorSearch || tradeFilter !== 'all' || cityFilter !== 'all' ? 'No contractors match filters' : 'No contractors yet'}</p></div>}
            </div>
          </div>
        );
        })()}

        {/* SUPPLIERS */}
        {view === 'suppliers' && (() => {
          const categories = [...new Set(suppliers.map(s => s.category).filter(Boolean))];
          const cities = [...new Set(suppliers.map(s => s.city).filter(Boolean))];
          const filtered = suppliers.filter(s => {
            const matchesCat = supplierCategoryFilters.length === 0 || supplierCategoryFilters.includes(s.category);
            const matchesCity = supplierCityFilter === 'all' || s.city === supplierCityFilter;
            const matchesSearch = !supplierSearch || 
              s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
              s.contact?.toLowerCase().includes(supplierSearch.toLowerCase()) ||
              s.category?.toLowerCase().includes(supplierSearch.toLowerCase()) ||
              s.city?.toLowerCase().includes(supplierSearch.toLowerCase());
            return matchesCat && matchesCity && matchesSearch;
          });
          return (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div><h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Suppliers</h1><p className={muted}>{filtered.length} of {suppliers.length} suppliers</p></div>
              <button onClick={() => { setForm({ category: 'Lumber', state: 'AR' }); setModal('addSupplier'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Supplier</button>
            </div>
            
            {/* Search & Filter Bar */}
            <div className={`${card} rounded-xl border ${border} p-3 mb-4 flex flex-col lg:flex-row gap-3`}>
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                <input type="text" placeholder="Search suppliers..." value={supplierSearch} onChange={e => setSupplierSearch(e.target.value)} className={`${inputCls} pl-9 py-2`} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Multi-select Category Dropdown */}
                <div className="relative">
                  <button onClick={() => setModal(modal === 'supplierCatFilter' ? null : 'supplierCatFilter')} className={`${inputCls} py-2 px-3 flex items-center gap-2 min-w-[140px]`}>
                    <span className="text-sm">{supplierCategoryFilters.length === 0 ? 'All Categories' : `${supplierCategoryFilters.length} selected`}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </button>
                  {modal === 'supplierCatFilter' && (
                    <div className={`absolute z-50 mt-1 w-56 ${card} rounded-lg border ${border} shadow-lg max-h-64 overflow-y-auto`}>
                      <div className={`p-2 border-b ${border}`}>
                        <button onClick={() => setSupplierCategoryFilters([])} className={`text-xs ${muted} hover:text-purple-600`}>Clear all</button>
                      </div>
                      {MATERIAL_CATEGORIES.map(c => (
                        <label key={c} className={`flex items-center gap-2 px-3 py-2 ${hover} cursor-pointer`}>
                          <input type="checkbox" checked={supplierCategoryFilters.includes(c)} onChange={e => setSupplierCategoryFilters(e.target.checked ? [...supplierCategoryFilters, c] : supplierCategoryFilters.filter(x => x !== c))} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                          <span className={`text-sm ${text}`}>{c}</span>
                          <span className={`text-xs ${muted} ml-auto`}>{suppliers.filter(s => s.category === c).length}</span>
                        </label>
                      ))}
                      <div className={`p-2 border-t ${border}`}>
                        <button onClick={() => setModal(null)} className="w-full px-3 py-1.5 bg-purple-600 text-white rounded text-sm font-medium">Apply</button>
                      </div>
                    </div>
                  )}
                </div>
                <select value={supplierCityFilter} onChange={e => setSupplierCityFilter(e.target.value)} className={`${inputCls} flex-1 lg:w-40 py-2`}>
                  <option value="all">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {supplierCategoryFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {supplierCategoryFilters.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {c}
                    <button onClick={() => setSupplierCategoryFilters(supplierCategoryFilters.filter(x => x !== c))} className="hover:bg-purple-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <button onClick={() => setSupplierCategoryFilters([])} className={`text-xs ${muted} hover:text-purple-600 underline`}>Clear all</button>
              </div>
            )}

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filtered.map(s => (
                <div key={s.id} className={`${card} rounded-xl border ${border} p-4`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white text-sm font-bold">{s.name.substring(0, 2).toUpperCase()}</div>
                      <div>
                        <p className={`font-semibold ${text}`}>{s.name}</p>
                        <p className={`text-sm ${muted}`}>{s.contact || 'No contact'}</p>
                      </div>
                    </div>
                    <button onClick={() => { setForm(s); setSel(s); setModal('editSupplier'); }} className={`p-2 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">{s.category}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text} flex items-center gap-1`}><MapPin className="w-3 h-3" />{s.city}, {s.state}</span>
                  </div>
                  <div className="flex gap-4">
                    {s.phone && <a href={`tel:${s.phone}`} className="flex items-center gap-1 text-sm text-blue-600"><Phone className="w-4 h-4" />{s.phone}</a>}
                    {s.email && <a href={`mailto:${s.email}`} className="flex items-center gap-1 text-sm text-blue-600 truncate"><Mail className="w-4 h-4" /><span className="truncate">{s.email}</span></a>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className={`${card} rounded-xl border ${border} p-8 text-center`}><Package className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>No suppliers found</p></div>}
            </div>

            {/* Desktop Table View */}
            <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                    <th className="text-left px-4 py-3 font-medium">Supplier</th>
                    <th className="text-left px-4 py-3 font-medium">Contact</th>
                    <th className="text-left px-4 py-3 font-medium">Category</th>
                    <th className="text-left px-4 py-3 font-medium">City</th>
                    <th className="text-left px-4 py-3 font-medium">Phone</th>
                    <th className="text-center px-4 py-3 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const isExpanded = expanded[`sup-${s.id}`];
                    return (
                      <React.Fragment key={s.id}>
                        <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`sup-${s.id}`]: !e[`sup-${s.id}`] }))}>
                          <td className={`px-4 py-3 ${text}`}>
                            <div className="flex items-center gap-2">
                              <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs font-bold">{s.name.substring(0, 2).toUpperCase()}</div>
                              <span className="font-medium">{s.name}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 ${text}`}>{s.contact || <span className={muted}>-</span>}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">{s.category}</span></td>
                          <td className={`px-4 py-3 ${text}`}><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.city || '-'}, {s.state || ''}</span></td>
                          <td className={`px-4 py-3 ${text}`}>{s.phone ? <a href={`tel:${s.phone}`} className="hover:text-blue-600" onClick={e => e.stopPropagation()}>{s.phone}</a> : <span className={muted}>-</span>}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={e => { e.stopPropagation(); setForm(s); setSel(s); setModal('editSupplier'); }} className={`p-1.5 ${hover} rounded`} title="Edit"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                              <button onClick={e => { e.stopPropagation(); if (confirm('Delete supplier?')) setSuppliers(suppliers.filter(x => x.id !== s.id)); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                            <td colSpan="6" className="px-4 py-4">
                              <div className="grid grid-cols-5 gap-6">
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>EMAIL</p>
                                  <p className={`text-sm ${text}`}>{s.email ? <a href={`mailto:${s.email}`} className="text-blue-600 hover:underline">{s.email}</a> : '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>ADDRESS</p>
                                  <p className={`text-sm ${text}`}>{s.address || '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>WEBSITE</p>
                                  <p className={`text-sm ${text}`}>{s.website || '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>ACCOUNT #</p>
                                  <p className={`text-sm ${text}`}>{s.accountNum || '-'}</p>
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${muted} mb-1`}>NOTES</p>
                                  <p className={`text-sm ${text}`}>{s.notes || '-'}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="p-8 text-center"><Package className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{supplierSearch || supplierCategoryFilter !== 'all' || supplierCityFilter !== 'all' ? 'No suppliers match filters' : 'No suppliers yet'}</p></div>}
            </div>
          </div>
        );
        })()}

        {/* JURISDICTIONS */}
        {view === 'jurisdictions' && (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div><h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Jurisdictions</h1><p className={muted}>County contacts for permits</p></div>
              <button onClick={() => { setForm({ state: 'AR' }); setModal('addCounty'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add County</button>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {counties.map(county => (
                <div key={county.id} className={`${card} rounded-xl border ${border} p-4`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white"><Landmark className="w-5 h-5" /></div>
                      <div>
                        <p className={`font-semibold ${text}`}>{county.name}</p>
                        <p className={`text-sm ${muted}`}>{county.state} • {county.contacts.length} contacts</p>
                      </div>
                    </div>
                    <button onClick={() => { setForm({}); setSel(county); setModal('addContact'); }} className="p-2 hover:bg-blue-50 rounded text-blue-600"><Plus className="w-4 h-4" /></button>
                  </div>
                  {county.contacts.length > 0 && (
                    <div className="space-y-2">
                      {county.contacts.map(con => (
                        <div key={con.id} className={`p-2 rounded ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <p className={`text-sm font-medium ${text}`}>{con.name}</p>
                          <p className={`text-xs ${muted}`}>{con.title}</p>
                          {con.phone && <a href={`tel:${con.phone}`} className="text-xs text-blue-600">{con.phone}</a>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                    <th className="text-left px-4 py-3 font-medium">County</th>
                    <th className="text-left px-4 py-3 font-medium">State</th>
                    <th className="text-center px-4 py-3 font-medium">Contacts</th>
                    <th className="text-center px-4 py-3 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {counties.map(county => {
                    const isExpanded = expanded[`county-${county.id}`];
                    return (
                      <React.Fragment key={county.id}>
                        <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`county-${county.id}`]: !e[`county-${county.id}`] }))}>
                          <td className={`px-4 py-3 ${text}`}>
                            <div className="flex items-center gap-2">
                              <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white"><Landmark className="w-4 h-4" /></div>
                              <span className="font-medium">{county.name}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 ${text}`}>{county.state}</td>
                          <td className={`px-4 py-3 text-center ${text}`}>{county.contacts.length}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={e => { e.stopPropagation(); setForm({}); setSel(county); setModal('addContact'); }} className={`p-1.5 hover:bg-blue-50 rounded text-blue-600`} title="Add Contact"><Plus className="w-4 h-4" /></button>
                              <button onClick={e => { e.stopPropagation(); if (confirm('Delete county?')) setCounties(counties.filter(c => c.id !== county.id)); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                            <td colSpan="4" className="px-4 py-4">
                              {county.contacts.length > 0 ? (
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className={`text-xs ${muted} uppercase`}>
                                      <th className="text-left pb-2 font-medium">Title</th>
                                      <th className="text-left pb-2 font-medium">Name</th>
                                      <th className="text-left pb-2 font-medium">Phone</th>
                                      <th className="text-left pb-2 font-medium">Email</th>
                                      <th className="w-10"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {county.contacts.map(con => (
                                      <tr key={con.id} className="group">
                                        <td className={`py-1.5 font-medium ${text}`}>{con.title}</td>
                                        <td className={`py-1.5 ${text}`}>{con.name || '-'}</td>
                                        <td className={`py-1.5 ${text}`}>{con.phone ? <a href={`tel:${con.phone}`} className="text-blue-600 hover:underline">{con.phone}</a> : '-'}</td>
                                        <td className={`py-1.5 ${text}`}>{con.email || '-'}</td>
                                        <td className="py-1.5"><button onClick={() => setCounties(counties.map(c => c.id === county.id ? { ...c, contacts: c.contacts.filter(x => x.id !== con.id) } : c))} className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-red-500" /></button></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className={`text-sm ${muted}`}>No contacts added yet</p>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {counties.length === 0 && <div className="p-8 text-center"><Landmark className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>No counties yet</p></div>}
            </div>
          </div>
        )}

        {/* TEAM */}
        {view === 'team' && (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Team</h1>
                <button onClick={() => { setForm({ role: 'partner' }); setModal('addTeam'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><UserPlus className="w-4 h-4" />Add Member</button>
              </div>
              
              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {team.map(m => (
                  <div key={m.id} onClick={() => { setForm(m); setSel(m); setModal('editTeam'); }} className={`${card} rounded-xl border ${border} p-4 ${hover} cursor-pointer`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center text-white font-bold`}>{m.avatar}</div>
                        <div>
                          <p className={`font-semibold ${text}`}>{m.name}</p>
                          <p className={`text-sm ${muted}`}>{m.email}</p>
                          {m.phone && <p className={`text-sm ${muted}`}>{m.phone}</p>}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${m.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{m.role}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
                <table className="w-full">
                  <thead>
                    <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                      <th className="text-left px-4 py-3 font-medium">Member</th>
                      <th className="text-left px-4 py-3 font-medium">Email</th>
                      <th className="text-left px-4 py-3 font-medium">Phone</th>
                      <th className="text-center px-4 py-3 font-medium">Role</th>
                      <th className="text-center px-4 py-3 font-medium">Projects</th>
                      <th className="text-center px-4 py-3 font-medium w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map(m => (
                      <tr key={m.id} className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => { setForm(m); setSel(m); setModal('editTeam'); }}>
                        <td className={`px-4 py-3 ${text}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-white text-xs font-bold`}>{m.avatar}</div>
                            <span className="font-medium">{m.name}</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 ${muted}`}>{m.email}</td>
                        <td className={`px-4 py-3 ${muted}`}>{m.phone || '-'}</td>
                        <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs font-medium ${m.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{m.role}</span></td>
                        <td className={`px-4 py-3 text-center ${text}`}>{projects.filter(p => p.partners?.some(pt => pt.odId === m.id)).length}</td>
                        <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => { setForm(m); setSel(m); setModal('editTeam'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                            {m.id !== user.id && <button onClick={() => setTeam(team.filter(t => t.id !== m.id))} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PHASE TEMPLATES */}
        {view === 'phases' && (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Phase Templates</h1>
                  <p className={`text-sm ${muted}`}>Templates define phases and default tasks for new projects</p>
                </div>
                <button onClick={() => { setForm({ name: '', description: '', phases: [...PHASES], tasks: [] }); setModal('addTemplate'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />New Template</button>
              </div>
              
              <div className="space-y-4">
                {phaseTemplates.map(template => (
                  <div key={template.id} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                    <div className={`px-4 py-3 border-b ${border} flex items-center justify-between`}>
                      <div>
                        <h3 className={`font-semibold ${text}`}>{template.name}</h3>
                        <p className={`text-sm ${muted}`}>{template.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${muted}`}>{template.phases.length} phases</span>
                        <span className={`px-2 py-1 rounded text-xs ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${muted}`}>{template.tasks.length} tasks</span>
                        <button onClick={() => { setForm(template); setSel(template); setSelectedTemplateId(template.id); setModal('editTemplate'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                        {phaseTemplates.length > 1 && <button onClick={() => { if (confirm(`Delete "${template.name}" template?`)) setPhaseTemplates(phaseTemplates.filter(t => t.id !== template.id)); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className={`text-xs font-medium ${muted} mb-2`}>PHASES</p>
                      <div className="flex flex-wrap gap-1">
                        {template.phases.map((phase, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded text-xs ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}>{idx + 1}. {phase}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROJECT DETAIL */}
        {view === 'project' && proj && (() => {
          const fin = calcFin(proj);
          const stats = getStats(proj.tasks);
          const pcs = proj.contractors.map(pc => ({ ...pc, ...contractors.find(c => c.id === pc.gid) }));
          const county = counties.find(c => c.name === proj.county);
          const tasksByPhase = {};
          proj.phases.forEach(ph => tasksByPhase[ph] = []);
          proj.tasks.filter(t => !search || t.task.toLowerCase().includes(search.toLowerCase())).forEach(t => { if (tasksByPhase[t.phase]) tasksByPhase[t.phase].push(t); });

          return (
            <>
              <header className={`${card} border-b ${border} px-4 lg:px-6 py-3 lg:py-4 shrink-0`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 lg:gap-4 min-w-0">
                    <button onClick={() => { setView('projects'); setProjId(null); }} className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg shrink-0"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="min-w-0"><h1 className={`text-base lg:text-xl font-bold ${text} truncate`}>{proj.name}</h1><p className={`${muted} text-xs lg:text-sm truncate`}>{proj.client?.name && `${proj.client.name} • `}{proj.financing?.type === 'loan' ? proj.financing.lender : 'Cash'}</p></div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-6 shrink-0">
                    <div className="hidden sm:flex items-center gap-3">
                      <div className={`w-20 lg:w-32 h-2 lg:h-2.5 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}><div className="bg-blue-600 h-full rounded-full" style={{ width: `${stats.pct}%` }} /></div>
                      <span className={`font-semibold text-sm ${text}`}>{stats.pct}%</span>
                    </div>
                    <span className={`text-sm lg:text-xl font-bold ${fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(fin.profit)}</span>
                  </div>
                </div>
              </header>

              <div className={`${card} border-b ${border} px-2 lg:px-6 shrink-0`}>
                <div className="flex gap-0.5 lg:gap-1 overflow-x-auto scrollbar-hide">
                  {['tasks', 'contractors', 'bids', 'client', 'financials', 'draws', 'materials', 'photos', 'files', 'settings'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-2.5 lg:px-4 py-2.5 lg:py-3 border-b-2 text-xs lg:text-sm font-medium capitalize whitespace-nowrap transition ${tab === t ? 'border-blue-600 text-blue-600' : `border-transparent ${muted} hover:text-gray-900`}`}>{t}</button>
                  ))}
                </div>
              </div>

              <main className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
                
                {/* TASKS TAB */}
                {tab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                        <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
                      </div>
                      <button onClick={() => { setForm({ phase: proj.phases[0], days: 1, priority: 'normal' }); setModal('addTask'); }} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" />Add Task</button>
                    </div>
                    <p className={`text-xs md:text-sm ${muted}`}>💡 Tap a task to see details, dates & contractor info. Drag to reorder.</p>
                    
                    {proj.phases.map(phase => (
                      <div key={phase} className={`${card} rounded-xl border ${border} overflow-hidden`} onDragOver={handleDragOver} onDrop={e => handleDropOnPhase(e, phase)}>
                        <button onClick={() => setExpanded(p => ({ ...p, [phase]: p[phase] === false }))} className={`w-full flex justify-between items-center px-3 md:px-4 py-2.5 md:py-3 ${dark ? 'bg-slate-750' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            {expanded[phase] === false ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            <span className={`font-semibold text-sm md:text-base ${text}`}>{phase}</span>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">{tasksByPhase[phase]?.length || 0}</span>
                          </div>
                          <span className="text-xs md:text-sm text-emerald-600 font-medium">{tasksByPhase[phase]?.filter(t => t.status === 'complete').length || 0} done</span>
                        </button>
                        {expanded[phase] !== false && (
                          <div className={`divide-y ${border}`}>
                            {(tasksByPhase[phase] || []).map(task => {
                              const taskContractor = task.contractorId ? contractors.find(c => c.id === task.contractorId) : null;
                              const taskExpanded = expanded[`task-${task.id}`];
                              const isOverdue = task.scheduledEnd && new Date(task.scheduledEnd) < new Date() && task.status !== 'complete';
                              return (
                                <div key={task.id}>
                                  <div 
                                    draggable 
                                    onDragStart={e => handleDragStart(e, task)} 
                                    onDragOver={handleDragOver} 
                                    onDrop={e => handleDrop(e, task, phase)} 
                                    onDragEnd={handleDragEnd} 
                                    onClick={() => setExpanded(e => ({ ...e, [`task-${task.id}`]: !e[`task-${task.id}`] }))}
                                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 ${hover} group cursor-pointer ${task.inspection ? (dark ? 'bg-red-900/20' : 'bg-red-50') : ''} ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                                  >
                                    <ChevronRight className={`w-4 h-4 ${muted} transition-transform shrink-0 ${taskExpanded ? 'rotate-90' : ''}`} />
                                    <GripVertical className={`w-4 h-4 ${muted} hidden md:block opacity-0 group-hover:opacity-100 cursor-grab shrink-0`} />
                                    <select value={task.status} onClick={e => e.stopPropagation()} onChange={e => { 
                                      e.stopPropagation(); 
                                      const newStatus = e.target.value;
                                      const today = new Date().toISOString().split('T')[0];
                                      const updates = { status: newStatus };
                                      // Auto-set dates based on status change
                                      if (newStatus === 'complete' && !task.completedDate) {
                                        updates.completedDate = today;
                                        updates.actualEnd = today;
                                      }
                                      if (newStatus === 'in_progress' && !task.actualStart) {
                                        updates.actualStart = today;
                                      }
                                      if (newStatus === 'pending') {
                                        updates.completedDate = null;
                                        updates.actualEnd = null;
                                      }
                                      updateProj(projId, { tasks: proj.tasks.map(t => t.id === task.id ? { ...t, ...updates } : t) }); 
                                    }} className={`text-xs px-1.5 md:px-2 py-1 rounded font-medium border-0 cursor-pointer shrink-0 ${task.status === 'complete' ? 'bg-emerald-100 text-emerald-700' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`} style={{paddingRight: '1.25rem'}}>
                                      <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="complete">Complete</option>
                                    </select>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs ${muted} font-mono`}>#{task.id}</span>
                                        <p className={`text-xs md:text-sm font-medium truncate ${task.status === 'complete' ? 'line-through text-gray-400' : text}`}>{task.task}</p>
                                      </div>
                                      <p className={`text-xs ${task.status === 'complete' ? 'text-emerald-600' : isOverdue ? 'text-red-500' : muted} truncate`}>
                                        {task.status === 'complete' && task.completedDate ? (
                                          <>✓ Completed {fmtDate(task.completedDate)}</>
                                        ) : task.scheduledStart && task.scheduledEnd ? (
                                          <>{fmtDate(task.scheduledStart)} → {fmtDate(task.scheduledEnd)}{isOverdue && ' (Overdue)'}</>
                                        ) : (
                                          taskContractor?.name || 'No dates set'
                                        )}
                                      </p>
                                    </div>
                                    {task.priority === 'high' && <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600 shrink-0">!</span>}
                                    {isOverdue && task.status !== 'complete' && <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600 shrink-0">Late</span>}
                                    {task.assignedTo && <div className={`w-5 md:w-6 h-5 md:h-6 rounded-full ${team.find(m => m.id === task.assignedTo)?.color || 'bg-gray-400'} text-white text-xs flex items-center justify-center shrink-0 hidden sm:flex`}>{team.find(m => m.id === task.assignedTo)?.avatar?.[0]}</div>}
                                    <span className={`text-xs ${muted} shrink-0 hidden sm:block`}>{task.days}d</span>
                                    <button onClick={e => { e.stopPropagation(); setForm(task); setSel(task); setModal('editTask'); }} className={`p-1 rounded ${hover} opacity-0 group-hover:opacity-100 shrink-0`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                    <button onClick={e => { e.stopPropagation(); updateProj(projId, { tasks: proj.tasks.filter(t => t.id !== task.id) }); }} className="p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 shrink-0"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                  </div>
                                  {/* Expanded Task Details */}
                                  {taskExpanded && (
                                    <div className={`px-4 md:px-6 py-4 ${dark ? 'bg-slate-800/50' : 'bg-gray-50'} border-t ${border}`}>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Timeline/Dates */}
                                        <div className={`${card} rounded-lg border ${border} p-3`}>
                                          <p className={`text-xs font-semibold ${muted} mb-2 uppercase`}>Timeline</p>
                                          <div className="space-y-2">
                                            <div className="flex justify-between">
                                              <span className={`text-sm ${muted}`}>Scheduled</span>
                                              <span className={`text-sm font-medium ${text}`}>
                                                {task.scheduledStart ? `${fmtDate(task.scheduledStart)} - ${fmtDate(task.scheduledEnd)}` : 'Not scheduled'}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className={`text-sm ${muted}`}>Duration</span>
                                              <span className={`text-sm font-medium ${text}`}>{task.days} day{task.days !== 1 ? 's' : ''}</span>
                                            </div>
                                            {task.actualStart && (
                                              <div className="flex justify-between">
                                                <span className={`text-sm ${muted}`}>Started</span>
                                                <span className={`text-sm font-medium text-blue-600`}>{fmtDate(task.actualStart)}</span>
                                              </div>
                                            )}
                                            {task.status === 'complete' && task.completedDate && (
                                              <div className="flex justify-between">
                                                <span className={`text-sm ${muted}`}>Completed</span>
                                                <span className={`text-sm font-medium text-emerald-600`}>{fmtDate(task.completedDate)}</span>
                                              </div>
                                            )}
                                            {task.status === 'complete' && task.actualStart && task.completedDate && (
                                              <div className="flex justify-between border-t pt-2 mt-2">
                                                <span className={`text-sm ${muted}`}>Actual Duration</span>
                                                <span className={`text-sm font-medium ${text}`}>
                                                  {Math.ceil((new Date(task.completedDate) - new Date(task.actualStart)) / (1000 * 60 * 60 * 24)) + 1} days
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Contractor Info */}
                                        <div className={`${card} rounded-lg border ${border} p-3`}>
                                          <p className={`text-xs font-semibold ${muted} mb-2 uppercase`}>Contractor</p>
                                          {taskContractor ? (
                                            <div>
                                              <p className={`font-semibold ${text}`}>{taskContractor.name}</p>
                                              <p className={`text-sm ${muted}`}>{taskContractor.contact || 'No contact name'}</p>
                                              <div className="flex flex-wrap gap-2 mt-2">
                                                {taskContractor.phone && (
                                                  <a href={`tel:${taskContractor.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                                    <Phone className="w-3 h-3" />{taskContractor.phone}
                                                  </a>
                                                )}
                                              </div>
                                              {taskContractor.email && (
                                                <a href={`mailto:${taskContractor.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                                                  <Mail className="w-3 h-3" />{taskContractor.email}
                                                </a>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="text-center py-2">
                                              <p className={`text-sm ${muted}`}>No contractor assigned</p>
                                              {task.trade && <p className={`text-xs ${muted} mt-1`}>Trade: <span className="font-medium">{task.trade}</span></p>}
                                              <button onClick={e => { e.stopPropagation(); setForm(task); setSel(task); setModal('editTask'); }} className="mt-2 text-sm text-blue-600 hover:underline">Assign Contractor</button>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Task Details */}
                                        <div className={`${card} rounded-lg border ${border} p-3`}>
                                          <p className={`text-xs font-semibold ${muted} mb-2 uppercase`}>Details</p>
                                          <div className="space-y-2">
                                            <div className="flex justify-between">
                                              <span className={`text-sm ${muted}`}>Status</span>
                                              <span className={`text-sm font-medium ${task.status === 'complete' ? 'text-emerald-600' : task.status === 'in_progress' ? 'text-blue-600' : text}`}>
                                                {task.status === 'complete' ? 'Complete' : task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className={`text-sm ${muted}`}>Priority</span>
                                              <span className={`text-sm font-medium ${task.priority === 'high' ? 'text-red-600' : task.priority === 'low' ? 'text-gray-400' : text}`}>{(task.priority || 'normal').charAt(0).toUpperCase() + (task.priority || 'normal').slice(1)}</span>
                                            </div>
                                            {task.assignedTo && (
                                              <div className="flex justify-between items-center">
                                                <span className={`text-sm ${muted}`}>Assigned To</span>
                                                <span className={`text-sm font-medium ${text}`}>{team.find(m => m.id === task.assignedTo)?.name || '-'}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Notes */}
                                      {task.notes && (
                                        <div className={`mt-3 ${card} rounded-lg border ${border} p-3`}>
                                          <p className={`text-xs font-semibold ${muted} mb-1 uppercase`}>Notes</p>
                                          <p className={`text-sm ${text}`}>{task.notes}</p>
                                        </div>
                                      )}
                                      
                                      {/* Quick Actions */}
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        <button onClick={e => { e.stopPropagation(); setForm(task); setSel(task); setModal('editTask'); }} className={`px-3 py-1.5 text-sm font-medium ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text} rounded-lg hover:opacity-80`}>
                                          <Edit2 className="w-3 h-3 inline mr-1" />Edit Task
                                        </button>
                                        {taskContractor && taskContractor.phone && (
                                          <a href={`tel:${taskContractor.phone}`} className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            <Phone className="w-3 h-3 inline mr-1" />Call
                                          </a>
                                        )}
                                        {task.status !== 'complete' && (
                                          <button onClick={e => { 
                                            e.stopPropagation(); 
                                            const today = new Date().toISOString().split('T')[0];
                                            updateProj(projId, { tasks: proj.tasks.map(t => t.id === task.id ? { ...t, status: 'complete', completedDate: today, actualEnd: today, actualStart: t.actualStart || today } : t) }); 
                                          }} className="px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                            <CheckCircle className="w-3 h-3 inline mr-1" />Mark Complete
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* CONTRACTORS TAB */}
                {tab === 'contractors' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <h3 className={`font-semibold ${text}`}>Project Contractors</h3>
                      <button onClick={() => setModal('addProjectContractor')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Contractor</button>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {pcs.map(c => {
                        const paid = c.payments?.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) || 0;
                        const balance = (c.quote || 0) - paid;
                        return (
                          <div key={c.id} className={`${card} rounded-xl border ${border} p-4`}>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className={`font-semibold ${text}`}>{c.name}</p>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{c.trade}</span>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], method: 'check', account: 'Business Checking', paidBy: user.name, amount: '' }); setSel(c); setModal('addPayment'); }} className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600"><DollarSign className="w-4 h-4" /></button>
                                <button onClick={() => { if (confirm('Remove?')) updateProj(projId, { contractors: proj.contractors.filter(pc => pc.id !== c.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div><p className={`text-xs ${muted}`}>Quote</p><p className={`text-sm font-bold ${text}`}>{fmt(c.quote)}</p></div>
                              <div><p className={`text-xs ${muted}`}>Paid</p><p className="text-sm font-bold text-emerald-600">{fmt(paid)}</p></div>
                              <div><p className={`text-xs ${muted}`}>Balance</p><p className={`text-sm font-bold ${balance > 0 ? 'text-amber-600' : muted}`}>{fmt(balance)}</p></div>
                            </div>
                            {(c.phone || c.email) && (
                              <div className={`mt-3 pt-3 border-t ${border} flex flex-wrap gap-3`}>
                                {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-sm text-blue-600"><Phone className="w-3 h-3" />{c.phone}</a>}
                                {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-sm text-blue-600"><Mail className="w-3 h-3" />{c.email}</a>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {pcs.length === 0 && <div className="p-8 text-center"><Briefcase className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>No contractors added</p></div>}
                    </div>

                    {/* Desktop Table View */}
                    <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
                      <table className="w-full">
                        <thead>
                          <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                            <th className="text-left px-4 py-3 font-medium">Contractor</th>
                            <th className="text-left px-4 py-3 font-medium">Trade</th>
                            <th className="text-right px-4 py-3 font-medium">Quote</th>
                            <th className="text-right px-4 py-3 font-medium">Paid</th>
                            <th className="text-right px-4 py-3 font-medium">Balance</th>
                            <th className="text-center px-4 py-3 font-medium w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pcs.map(c => {
                            const paid = c.payments?.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) || 0;
                            const balance = (c.quote || 0) - paid;
                            const isExpanded = expanded[`c-${c.id}`];
                            return (
                              <React.Fragment key={c.id}>
                                <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`c-${c.id}`]: !e[`c-${c.id}`] }))}>
                                  <td className={`px-4 py-3 ${text}`}>
                                    <div className="flex items-center gap-2">
                                      <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                      <span className="font-medium">{c.name}</span>
                                    </div>
                                  </td>
                                  <td className={`px-4 py-3`}><span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{c.trade}</span></td>
                                  <td className={`px-4 py-3 text-right font-medium ${text}`}>{fmt(c.quote)}</td>
                                  <td className="px-4 py-3 text-right font-medium text-emerald-600">{fmt(paid)}</td>
                                  <td className={`px-4 py-3 text-right font-medium ${balance > 0 ? 'text-amber-600' : muted}`}>{fmt(balance)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button onClick={e => { e.stopPropagation(); setForm({ date: new Date().toISOString().split('T')[0], method: 'check', account: 'Business Checking', paidBy: user.name, amount: '' }); setSel(c); setModal('addPayment'); }} className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600" title="Add Payment"><DollarSign className="w-4 h-4" /></button>
                                      <button onClick={e => { e.stopPropagation(); const q = prompt('Enter quote:', c.quote); if (q) updateProj(projId, { contractors: proj.contractors.map(pc => pc.id === c.id ? { ...pc, quote: parseFloat(q) || 0 } : pc) }); }} className={`p-1.5 ${hover} rounded`} title="Edit Quote"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                      <button onClick={e => { e.stopPropagation(); if (confirm('Remove?')) updateProj(projId, { contractors: proj.contractors.filter(pc => pc.id !== c.id) }); }} className="p-1.5 hover:bg-red-50 rounded" title="Remove"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <td colSpan="6" className="px-4 py-4">
                                      <div className="grid grid-cols-3 gap-6">
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-2`}>CONTACT</p>
                                          {c.phone && <p className={`text-sm ${text} flex items-center gap-2`}><Phone className="w-3 h-3" /><a href={`tel:${c.phone}`} className="hover:text-blue-600">{c.phone}</a></p>}
                                          {c.email && <p className={`text-sm ${text} flex items-center gap-2 mt-1`}><Mail className="w-3 h-3" />{c.email}</p>}
                                          {!c.phone && !c.email && <p className={`text-sm ${muted}`}>No contact info</p>}
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-2`}>BIDS</p>
                                          {(proj.bids?.filter(b => b.contractorId === c.gid) || []).map(bid => (
                                            <div key={bid.id} className={`text-sm flex justify-between ${text}`}>
                                              <span>{bid.description}</span>
                                              <span className="font-medium">{fmt(bid.amount)}</span>
                                            </div>
                                          ))}
                                          {!proj.bids?.filter(b => b.contractorId === c.gid).length && <p className={`text-sm ${muted}`}>No bids</p>}
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-2`}>PAYMENTS ({c.payments?.length || 0})</p>
                                          <div className="max-h-32 overflow-y-auto space-y-1">
                                            {(c.payments || []).map(p => (
                                              <div key={p.id} onClick={e => { e.stopPropagation(); setSel({ ...p, contractorId: c.id, contractorName: c.name }); setModal('viewPayment'); }} className={`text-sm flex justify-between ${text} cursor-pointer hover:text-blue-600`}>
                                                <span>{p.date} • {METHODS.find(m => m.id === p.method)?.label}</span>
                                                <span className="font-medium">{fmt(p.amount)}</span>
                                              </div>
                                            ))}
                                            {!c.payments?.length && <p className={`text-sm ${muted}`}>No payments yet</p>}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                      {pcs.length === 0 && <div className="p-8 text-center"><Briefcase className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>No contractors added</p></div>}
                    </div>

                    {/* Summary Footer */}
                    {pcs.length > 0 && (
                      <div className={`${card} rounded-xl border ${border} p-3 sm:p-4`}>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                          <div><p className={`text-xs ${muted}`}>Total Quotes</p><p className={`text-base sm:text-lg font-bold ${text}`}>{fmt(pcs.reduce((s, c) => s + (c.quote || 0), 0))}</p></div>
                          <div><p className={`text-xs ${muted}`}>Total Paid</p><p className="text-base sm:text-lg font-bold text-emerald-600">{fmt(pcs.reduce((s, c) => s + (c.payments?.reduce((ss, p) => ss + (parseFloat(p.amount) || 0), 0) || 0), 0))}</p></div>
                          <div><p className={`text-xs ${muted}`}>Remaining</p><p className="text-base sm:text-lg font-bold text-amber-600">{fmt(pcs.reduce((s, c) => s + (c.quote || 0) - (c.payments?.reduce((ss, p) => ss + (parseFloat(p.amount) || 0), 0) || 0), 0))}</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* BIDS TAB */}
                {tab === 'bids' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <h3 className={`font-semibold ${text}`}>Bids</h3>
                      <button onClick={() => { setForm({ status: 'pending', date: new Date().toISOString().split('T')[0] }); setModal('addBid'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Bid</button>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {(proj.bids || []).map(bid => {
                        const contractor = contractors.find(c => c.id === bid.contractorId);
                        return (
                          <div key={bid.id} className={`${card} rounded-xl border ${border} p-4`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className={`font-semibold ${text}`}>{contractor?.name || bid.vendorName || 'Unknown'}</p>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{bid.trade}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[bid.status]?.bg} ${statusColors[bid.status]?.text}`}>{bid.status}</span>
                            </div>
                            <p className={`text-sm ${muted} mb-2`}>{bid.description}</p>
                            <div className="flex justify-between items-center">
                              <p className={`text-lg font-bold ${text}`}>{fmt(bid.amount)}</p>
                              <div className="flex gap-1">
                                {bid.status === 'pending' && (
                                  <>
                                    <button onClick={() => updateProj(projId, { bids: proj.bids.map(b => b.id === bid.id ? { ...b, status: 'accepted' } : b) })} className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600"><CheckCircle className="w-4 h-4" /></button>
                                    <button onClick={() => updateProj(projId, { bids: proj.bids.map(b => b.id === bid.id ? { ...b, status: 'rejected' } : b) })} className="p-1.5 hover:bg-red-50 rounded text-red-500"><XCircle className="w-4 h-4" /></button>
                                  </>
                                )}
                                <button onClick={() => { setForm(bid); setSel(bid); setModal('editBid'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                <button onClick={() => { if (confirm('Delete?')) updateProj(projId, { bids: proj.bids.filter(b => b.id !== bid.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                              </div>
                            </div>
                            {contractor && (contractor.phone || contractor.email) && (
                              <div className={`mt-3 pt-3 border-t ${border} flex flex-wrap gap-3`}>
                                {contractor.phone && <a href={`tel:${contractor.phone}`} className="flex items-center gap-1 text-sm text-blue-600"><Phone className="w-3 h-3" />{contractor.phone}</a>}
                                {contractor.email && <a href={`mailto:${contractor.email}`} className="flex items-center gap-1 text-sm text-blue-600"><Mail className="w-3 h-3" />{contractor.email}</a>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {(!proj.bids || proj.bids.length === 0) && <div className="p-8 text-center"><FileText className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>No bids yet</p></div>}
                    </div>

                    {/* Desktop Table View */}
                    <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
                      <table className="w-full">
                        <thead>
                          <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                            <th className="text-left px-4 py-3 font-medium">Vendor</th>
                            <th className="text-left px-4 py-3 font-medium">Trade</th>
                            <th className="text-left px-4 py-3 font-medium">Description</th>
                            <th className="text-right px-4 py-3 font-medium">Amount</th>
                            <th className="text-center px-4 py-3 font-medium">Status</th>
                            <th className="text-center px-4 py-3 font-medium w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(proj.bids || []).map(bid => {
                            const contractor = contractors.find(c => c.id === bid.contractorId);
                            const isExpanded = expanded[`b-${bid.id}`];
                            return (
                              <React.Fragment key={bid.id}>
                                <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`b-${bid.id}`]: !e[`b-${bid.id}`] }))}>
                                  <td className={`px-4 py-3 ${text}`}>
                                    <div className="flex items-center gap-2">
                                      <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                      <span className="font-medium">{contractor?.name || bid.vendorName || 'Unknown'}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{bid.trade}</span></td>
                                  <td className={`px-4 py-3 ${text} truncate max-w-48`}>{bid.description}</td>
                                  <td className={`px-4 py-3 text-right font-semibold ${text}`}>{fmt(bid.amount)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[bid.status]?.bg} ${statusColors[bid.status]?.text}`}>{bid.status}</span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      {bid.status === 'pending' && (
                                        <>
                                          <button onClick={e => { e.stopPropagation(); updateProj(projId, { bids: proj.bids.map(b => b.id === bid.id ? { ...b, status: 'accepted' } : b) }); }} className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                                          <button onClick={e => { e.stopPropagation(); updateProj(projId, { bids: proj.bids.map(b => b.id === bid.id ? { ...b, status: 'rejected' } : b) }); }} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Reject"><XCircle className="w-4 h-4" /></button>
                                        </>
                                      )}
                                      <button onClick={e => { e.stopPropagation(); setForm(bid); setSel(bid); setModal('editBid'); }} className={`p-1.5 ${hover} rounded`} title="Edit"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                      <button onClick={e => { e.stopPropagation(); if (confirm('Delete?')) updateProj(projId, { bids: proj.bids.filter(b => b.id !== bid.id) }); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <td colSpan="6" className="px-4 py-4">
                                      <div className="grid grid-cols-4 gap-6">
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>DATE</p>
                                          <p className={`text-sm ${text}`}>{fmtDate(bid.date) || '-'}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>CONTACT</p>
                                          {contractor ? (
                                            <div className={`text-sm ${text}`}>
                                              {contractor.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{contractor.phone}</p>}
                                              {contractor.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{contractor.email}</p>}
                                            </div>
                                          ) : (
                                            <p className={`text-sm ${muted}`}>Not in directory</p>
                                          )}
                                        </div>
                                        <div className="col-span-2">
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>NOTES</p>
                                          <p className={`text-sm ${text}`}>{bid.notes || 'No notes'}</p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                      {(!proj.bids || proj.bids.length === 0) && <div className="p-8 text-center"><FileText className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>No bids yet</p></div>}
                    </div>

                    {/* Summary Footer */}
                    {proj.bids && proj.bids.length > 0 && (
                      <div className={`${card} rounded-xl border ${border} p-3 sm:p-4`}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
                          <div><p className={`text-xs ${muted}`}>Total Bids</p><p className={`text-base sm:text-lg font-bold ${text}`}>{proj.bids.length}</p></div>
                          <div><p className={`text-xs ${muted}`}>Pending</p><p className="text-base sm:text-lg font-bold text-amber-600">{proj.bids.filter(b => b.status === 'pending').length}</p></div>
                          <div><p className={`text-xs ${muted}`}>Accepted</p><p className="text-base sm:text-lg font-bold text-emerald-600">{proj.bids.filter(b => b.status === 'accepted').length}</p></div>
                          <div><p className={`text-xs ${muted}`}>Accepted Value</p><p className={`text-base sm:text-lg font-bold ${text}`}>{fmt(proj.bids.filter(b => b.status === 'accepted').reduce((s, b) => s + (b.amount || 0), 0))}</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CLIENT TAB */}
                {tab === 'client' && (
                  <div className="max-w-4xl space-y-4">
                    {/* Client Info */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-4 sm:px-5 py-3 border-b ${border} flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0"><User className="w-5 h-5" /></div>
                          <div className="min-w-0">
                            <h3 className={`font-semibold ${text} truncate`}>{proj.client?.name || 'No client assigned'}</h3>
                            <p className={`text-xs ${muted}`}>Client Details</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {proj.client?.phone && (
                            <>
                              <a href={`tel:${proj.client.phone}`} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="Call"><Phone className="w-4 h-4" /></a>
                              <a href={`mailto:${proj.client.email}`} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="Email"><Mail className="w-4 h-4" /></a>
                            </>
                          )}
                          <button onClick={() => setEditMode(!editMode)} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${editMode ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                            <Edit2 className="w-3 h-3" />{editMode ? 'Done' : 'Edit'}
                          </button>
                        </div>
                      </div>
                      
                      {editMode ? (
                        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><label className={`block text-sm ${muted} mb-1`}>Name</label><input value={proj.client?.name || ''} onChange={e => updateProj(projId, { client: { ...proj.client, name: e.target.value } })} className={inputCls} /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input value={formatPhone(proj.client?.phone) || ''} onChange={e => updateProj(projId, { client: { ...proj.client, phone: formatPhone(e.target.value) } })} className={inputCls} placeholder="123-456-7890" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Email</label><input value={proj.client?.email || ''} onChange={e => updateProj(projId, { client: { ...proj.client, email: e.target.value } })} className={inputCls} /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Address</label><input value={proj.client?.address || ''} onChange={e => updateProj(projId, { client: { ...proj.client, address: e.target.value } })} className={inputCls} /></div>
                          <div className="sm:col-span-2"><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={proj.client?.notes || ''} onChange={e => updateProj(projId, { client: { ...proj.client, notes: e.target.value } })} className={`${inputCls} h-20`} /></div>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-0">
                          {/* Mobile stacked view */}
                          <div className="sm:hidden space-y-3">
                            <div><p className={`text-xs ${muted}`}>Name</p><p className={`font-medium ${text}`}>{proj.client?.name || '-'}</p></div>
                            <div><p className={`text-xs ${muted}`}>Phone</p><p className={`font-medium ${text}`}>{proj.client?.phone ? <a href={`tel:${proj.client.phone}`} className="text-blue-600">{proj.client.phone}</a> : '-'}</p></div>
                            <div><p className={`text-xs ${muted}`}>Email</p><p className={`font-medium ${text}`}>{proj.client?.email ? <a href={`mailto:${proj.client.email}`} className="text-blue-600">{proj.client.email}</a> : '-'}</p></div>
                            <div><p className={`text-xs ${muted}`}>Address</p><p className={`font-medium ${text}`}>{proj.client?.address || '-'}</p></div>
                            {proj.client?.notes && <div><p className={`text-xs ${muted}`}>Notes</p><p className={`text-sm ${text}`}>{proj.client.notes}</p></div>}
                          </div>
                          {/* Desktop table view */}
                          <table className="hidden sm:table w-full text-sm">
                            <tbody>
                              <tr className={`border-b ${border}`}>
                                <td className={`px-5 py-2.5 ${muted} w-32`}>Name</td>
                                <td className={`px-5 py-2.5 font-medium ${text}`}>{proj.client?.name || '-'}</td>
                              </tr>
                              <tr className={`border-b ${border}`}>
                                <td className={`px-5 py-2.5 ${muted}`}>Phone</td>
                                <td className={`px-5 py-2.5 font-medium ${text}`}>{proj.client?.phone ? <a href={`tel:${proj.client.phone}`} className="text-blue-600 hover:underline">{proj.client.phone}</a> : '-'}</td>
                              </tr>
                              <tr className={`border-b ${border}`}>
                                <td className={`px-5 py-2.5 ${muted}`}>Email</td>
                                <td className={`px-5 py-2.5 font-medium ${text}`}>{proj.client?.email ? <a href={`mailto:${proj.client.email}`} className="text-blue-600 hover:underline">{proj.client.email}</a> : '-'}</td>
                              </tr>
                              <tr className={`border-b ${border}`}>
                                <td className={`px-5 py-2.5 ${muted}`}>Address</td>
                                <td className={`px-5 py-2.5 font-medium ${text}`}>{proj.client?.address || '-'}</td>
                              </tr>
                              <tr>
                                <td className={`px-5 py-2.5 ${muted} align-top`}>Notes</td>
                                <td className={`px-5 py-2.5 ${text}`}>{proj.client?.notes || <span className={muted}>-</span>}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Change Requests */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-4 sm:px-5 py-3 border-b ${border} flex justify-between items-center`}>
                        <div>
                          <h4 className={`font-semibold ${text}`}>Change Requests</h4>
                          <p className={`text-xs ${muted}`}>{proj.changeRequests?.length || 0} requests</p>
                        </div>
                        <button onClick={() => { setForm({ status: 'pending' }); setModal('addRequest'); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1 text-sm"><Plus className="w-3 h-3" />Add</button>
                      </div>
                      
                      {proj.changeRequests && proj.changeRequests.length > 0 ? (
                        <>
                          {/* Mobile card view */}
                          <div className="sm:hidden p-3 space-y-3">
                            {proj.changeRequests.map(req => (
                              <div key={req.id} className={`${dark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-3`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div className="min-w-0 flex-1 mr-2">
                                    <p className={`font-medium ${text} truncate`}>{req.title}</p>
                                    <p className={`text-xs ${muted} line-clamp-2`}>{req.description}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${statusColors[req.status]?.bg} ${statusColors[req.status]?.text}`}>{req.status}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className={`font-semibold ${text}`}>{req.cost ? fmt(req.cost) : 'No cost'}</p>
                                  <div className="flex gap-1">
                                    {req.status === 'pending' && (
                                      <button onClick={() => { setForm({ ...req, cost: req.cost || '' }); setSel(req); setModal('respondRequest'); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><MessageSquare className="w-4 h-4" /></button>
                                    )}
                                    <button onClick={() => updateProj(projId, { changeRequests: proj.changeRequests.filter(r => r.id !== req.id) })} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Desktop table view */}
                          <table className="hidden sm:table w-full text-sm">
                            <thead>
                              <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                                <th className="text-left px-4 py-2.5 font-medium">Request</th>
                                <th className="text-right px-4 py-2.5 font-medium">Cost</th>
                                <th className="text-center px-4 py-2.5 font-medium">Status</th>
                                <th className="text-center px-4 py-2.5 font-medium w-24">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {proj.changeRequests.map(req => (
                                <tr key={req.id} className={`border-t ${border} ${hover}`}>
                                  <td className={`px-4 py-2.5 ${text}`}>
                                    <p className="font-medium">{req.title}</p>
                                    <p className={`text-xs ${muted} truncate max-w-xs`}>{req.description}</p>
                                  </td>
                                  <td className={`px-4 py-2.5 text-right font-medium ${text}`}>{req.cost ? fmt(req.cost) : '-'}</td>
                                  <td className="px-4 py-2.5 text-center">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[req.status]?.bg} ${statusColors[req.status]?.text}`}>{req.status}</span>
                                  </td>
                                  <td className="px-4 py-2.5 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      {req.status === 'pending' && (
                                        <button onClick={() => { setForm({ ...req, cost: req.cost || '' }); setSel(req); setModal('respondRequest'); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Respond"><MessageSquare className="w-4 h-4" /></button>
                                      )}
                                      <button onClick={() => updateProj(projId, { changeRequests: proj.changeRequests.filter(r => r.id !== req.id) })} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <div className="p-6 text-center"><MessageSquare className={`w-8 h-8 mx-auto mb-2 ${muted} opacity-30`} /><p className={`text-sm ${muted}`}>No change requests</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* FINANCIALS TAB */}
                {tab === 'financials' && (
                  <div className="max-w-4xl space-y-4">
                    {/* Summary Row */}
                    <div className={`${card} rounded-xl border ${border} p-3 sm:p-4`}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        <div className="text-center p-2 sm:p-0">
                          <p className={`text-[10px] sm:text-xs ${muted}`}>Sale Price</p>
                          <p className={`text-base sm:text-lg md:text-xl font-bold ${text}`}>{fmt(proj.salePrice)}</p>
                        </div>
                        <div className="text-center p-2 sm:p-0">
                          <p className={`text-[10px] sm:text-xs ${muted}`}>Total Cost</p>
                          <p className={`text-base sm:text-lg md:text-xl font-bold ${text}`}>{fmt(fin.totalCost)}</p>
                        </div>
                        <div className="text-center p-2 sm:p-0">
                          <p className={`text-[10px] sm:text-xs ${muted}`}>Profit</p>
                          <p className={`text-base sm:text-lg md:text-xl font-bold ${fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(fin.profit)}</p>
                        </div>
                        <div className="text-center p-2 sm:p-0">
                          <p className={`text-[10px] sm:text-xs ${muted}`}>ROI</p>
                          <p className={`text-base sm:text-lg md:text-xl font-bold ${text}`}>{fin.roi}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown Table */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-3 lg:px-4 py-3 border-b ${border} flex justify-between items-center`}>
                        <h4 className={`font-semibold text-sm lg:text-base ${text}`}>Cost Breakdown</h4>
                        <button onClick={() => setEditMode(!editMode)} className={`px-2 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium flex items-center gap-1 ${editMode ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                          <Edit2 className="w-3 h-3" />{editMode ? 'Done' : 'Edit'}
                        </button>
                      </div>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Lot / Land</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>
                              {editMode ? <input type="text" value={formatCurrency(proj.costs?.lot)} onChange={e => updateProj(projId, { costs: { ...proj.costs, lot: parseCurrency(e.target.value) } })} className={`${inputCls} w-24 lg:w-32 text-right py-1 text-sm`} placeholder="0.00" /> : fmt(proj.costs?.lot || 0)}
                            </td>
                          </tr>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Construction</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>{fmt(fin.constructionCost)}</td>
                          </tr>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Permits</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>
                              {editMode ? <input type="text" value={formatCurrency(proj.costs?.permits)} onChange={e => updateProj(projId, { costs: { ...proj.costs, permits: parseCurrency(e.target.value) } })} className={`${inputCls} w-24 lg:w-32 text-right py-1 text-sm`} placeholder="0.00" /> : fmt(proj.costs?.permits || 0)}
                            </td>
                          </tr>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Title & Closing</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>
                              {editMode ? <input type="text" value={formatCurrency(proj.costs?.titleClosing)} onChange={e => updateProj(projId, { costs: { ...proj.costs, titleClosing: parseCurrency(e.target.value) } })} className={`${inputCls} w-24 lg:w-32 text-right py-1 text-sm`} placeholder="0.00" /> : fmt(proj.costs?.titleClosing || 0)}
                            </td>
                          </tr>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Lending Fees</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>
                              {editMode ? <input type="text" value={formatCurrency(proj.costs?.lendingFees)} onChange={e => updateProj(projId, { costs: { ...proj.costs, lendingFees: parseCurrency(e.target.value) } })} className={`${inputCls} w-24 lg:w-32 text-right py-1 text-sm`} placeholder="0.00" /> : fmt(proj.costs?.lendingFees || 0)}
                            </td>
                          </tr>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Utilities</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>
                              {editMode ? <input type="text" value={formatCurrency(proj.costs?.utilities)} onChange={e => updateProj(projId, { costs: { ...proj.costs, utilities: parseCurrency(e.target.value) } })} className={`${inputCls} w-24 lg:w-32 text-right py-1 text-sm`} placeholder="0.00" /> : fmt(proj.costs?.utilities || 0)}
                            </td>
                          </tr>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Insurance</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>
                              {editMode ? <input type="text" value={formatCurrency(proj.costs?.insurance)} onChange={e => updateProj(projId, { costs: { ...proj.costs, insurance: parseCurrency(e.target.value) } })} className={`${inputCls} w-24 lg:w-32 text-right py-1 text-sm`} placeholder="0.00" /> : fmt(proj.costs?.insurance || 0)}
                            </td>
                          </tr>
                          <tr className={`border-b ${border}`}>
                            <td className={`px-3 lg:px-4 py-2.5 ${muted} text-xs lg:text-sm`}>Contingency</td>
                            <td className={`px-3 lg:px-4 py-2.5 text-right font-medium ${text}`}>
                              {editMode ? <input type="text" value={formatCurrency(proj.costs?.contingency)} onChange={e => updateProj(projId, { costs: { ...proj.costs, contingency: parseCurrency(e.target.value) } })} className={`${inputCls} w-24 lg:w-32 text-right py-1 text-sm`} placeholder="0.00" /> : fmt(proj.costs?.contingency || 0)}
                            </td>
                          </tr>
                          <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <td className={`px-4 py-2.5 font-semibold ${text}`}>Total Cost</td>
                            <td className={`px-4 py-2.5 text-right font-bold ${text}`}>{fmt(fin.totalCost)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Financing & Revenue Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Financing */}
                      <div className={`${card} rounded-xl border ${border}`}>
                        <div className={`px-4 py-3 border-b ${border} flex justify-between items-center`}>
                          <h4 className={`font-semibold ${text}`}>Financing</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${proj.financing?.type === 'loan' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{proj.financing?.type === 'loan' ? 'Loan' : 'Cash'}</span>
                        </div>
                        {proj.financing?.type === 'loan' ? (
                          <div className="p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className={muted}>Lender</span><span className={`font-medium ${text}`}>{proj.financing.lender || '-'}</span></div>
                            <div className="flex justify-between"><span className={muted}>Loan #</span><span className={`font-medium ${text}`}>{proj.financing.loanNumber || '-'}</span></div>
                            <div className="flex justify-between"><span className={muted}>Amount</span><span className={`font-medium ${text}`}>{fmt(proj.financing.loanAmount)}</span></div>
                            <div className="flex justify-between"><span className={muted}>Rate</span><span className={`font-medium ${text}`}>{proj.financing.interestRate}%</span></div>
                            <div className="flex justify-between"><span className={muted}>Term</span><span className={`font-medium ${text}`}>{proj.financing.term} months</span></div>
                            <div className="flex justify-between"><span className={muted}>Expires</span><span className={`font-medium ${text}`}>{fmtDate(proj.financing.expirationDate) || '-'}</span></div>
                            {editMode && <button onClick={() => setModal('editFinancing')} className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Edit Loan Details</button>}
                          </div>
                        ) : (
                          <div className="p-4 text-center">
                            <Wallet className={`w-8 h-8 mx-auto mb-2 ${muted}`} />
                            <p className={muted}>Cash Purchase</p>
                            {editMode && <button onClick={() => updateProj(projId, { financing: { ...proj.financing, type: 'loan' } })} className="mt-2 px-3 py-1.5 text-sm text-blue-600 hover:underline">Switch to Loan</button>}
                          </div>
                        )}
                      </div>

                      {/* Revenue */}
                      <div className={`${card} rounded-xl border ${border}`}>
                        <div className={`px-4 py-3 border-b ${border}`}><h4 className={`font-semibold ${text}`}>Revenue</h4></div>
                        <div className="p-4">
                          <div className="flex justify-between items-center text-sm mb-4">
                            <span className={muted}>Sale Price</span>
                            {editMode ? <input type="text" value={formatCurrency(proj.salePrice)} onChange={e => updateProj(projId, { salePrice: parseCurrency(e.target.value) })} className={`${inputCls} w-32 text-right py-1`} placeholder="0.00" /> : <span className={`text-xl font-bold ${text}`}>{fmt(proj.salePrice)}</span>}
                          </div>
                          <div className={`p-3 rounded-lg ${fin.profit >= 0 ? (dark ? 'bg-emerald-900/30' : 'bg-emerald-50') : (dark ? 'bg-red-900/30' : 'bg-red-50')}`}>
                            <div className="flex justify-between items-center">
                              <span className={fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>Net Profit</span>
                              <span className={`text-xl font-bold ${fin.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(fin.profit)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Receipts Section */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-4 py-3 border-b ${border} flex justify-between items-center`}>
                        <div>
                          <h4 className={`font-semibold ${text}`}>Receipts</h4>
                          <p className={`text-xs ${muted}`}>{proj.receipts?.length || 0} receipts • {fmt((proj.receipts || []).reduce((s, r) => s + (r.amount || 0), 0))} total</p>
                        </div>
                        <button onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], category: 'Materials' }); setModal('addReceipt'); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1 text-sm"><Plus className="w-3 h-3" />Add</button>
                      </div>
                      {proj.receipts && proj.receipts.length > 0 ? (
                        <>
                          {/* Mobile Card View */}
                          <div className="md:hidden p-3 space-y-3">
                            {proj.receipts.map(r => (
                              <div key={r.id} className={`${dark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-3`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div className="min-w-0 flex-1 mr-2">
                                    <p className={`font-medium ${text} truncate`}>{r.vendor}</p>
                                    <p className={`text-xs ${muted}`}>{fmtDate(r.date)}</p>
                                  </div>
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{r.category}</span>
                                </div>
                                {r.description && <p className={`text-xs ${muted} mb-2 line-clamp-2`}>{r.description}</p>}
                                <div className="flex justify-between items-center">
                                  <p className={`font-semibold ${text}`}>{fmt(r.amount)}</p>
                                  <div className="flex gap-1">
                                    {r.fileData && <button onClick={() => { const link = document.createElement('a'); link.href = r.fileData; link.download = r.fileName || 'receipt'; link.click(); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><FileText className="w-4 h-4" /></button>}
                                    <button onClick={() => { setForm(r); setSel(r); setModal('editReceipt'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                    <button onClick={() => { if (confirm('Delete?')) updateProj(projId, { receipts: proj.receipts.filter(x => x.id !== r.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className={`${dark ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 flex justify-between items-center`}>
                              <span className={`font-semibold ${text}`}>Total</span>
                              <span className={`font-bold ${text}`}>{fmt((proj.receipts || []).reduce((s, r) => s + (r.amount || 0), 0))}</span>
                            </div>
                          </div>
                          {/* Desktop Table View */}
                          <table className="hidden md:table w-full text-sm">
                            <thead>
                              <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                                <th className="text-left px-4 py-2.5 font-medium">Date</th>
                                <th className="text-left px-4 py-2.5 font-medium">Vendor</th>
                                <th className="text-left px-4 py-2.5 font-medium">Category</th>
                                <th className="text-left px-4 py-2.5 font-medium">Description</th>
                                <th className="text-right px-4 py-2.5 font-medium">Amount</th>
                                <th className="text-center px-4 py-2.5 font-medium w-24">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {proj.receipts.map(r => (
                                <tr key={r.id} className={`border-t ${border} ${hover}`}>
                                  <td className={`px-4 py-2.5 ${text}`}>{fmtDate(r.date)}</td>
                                  <td className={`px-4 py-2.5 font-medium ${text}`}>{r.vendor}</td>
                                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{r.category}</span></td>
                                  <td className={`px-4 py-2.5 ${muted} truncate max-w-48`}>{r.description || '-'}</td>
                                  <td className={`px-4 py-2.5 text-right font-semibold ${text}`}>{fmt(r.amount)}</td>
                                  <td className="px-4 py-2.5 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      {r.fileData && <button onClick={() => { const link = document.createElement('a'); link.href = r.fileData; link.download = r.fileName || 'receipt'; link.click(); }} className={`p-1.5 hover:bg-blue-50 rounded text-blue-600`} title="Download"><FileText className="w-4 h-4" /></button>}
                                      <button onClick={() => { setForm(r); setSel(r); setModal('editReceipt'); }} className={`p-1.5 ${hover} rounded`} title="Edit"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                      <button onClick={() => { if (confirm('Delete receipt?')) updateProj(projId, { receipts: proj.receipts.filter(x => x.id !== r.id) }); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              <tr className={`border-t ${border} ${dark ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                                <td colSpan="4" className={`px-4 py-2.5 font-semibold ${text}`}>Total</td>
                                <td className={`px-4 py-2.5 text-right font-bold ${text}`}>{fmt((proj.receipts || []).reduce((s, r) => s + (r.amount || 0), 0))}</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <div className="p-6 text-center"><FileText className={`w-8 h-8 mx-auto mb-2 ${muted} opacity-30`} /><p className={`text-sm ${muted}`}>No receipts uploaded</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* DRAWS TAB */}
                {tab === 'draws' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <h3 className={`font-semibold ${text}`}>Draw Schedule</h3>
                        <p className={`text-xs sm:text-sm ${muted}`}>Loan: {fmt(proj.financing?.loanAmount || 0)} • {proj.draws?.filter(d => d.status === 'received').length || 0}/{proj.draws?.length || 0} received</p>
                      </div>
                      <button onClick={() => { setForm({ status: 'pending', pct: 10 }); setModal('addDraw'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Draw</button>
                    </div>
                    
                    {/* Summary */}
                    <div className={`${card} rounded-xl border ${border} p-3 sm:p-4`}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
                        <div className="p-2 sm:p-0"><p className={`text-[10px] sm:text-xs ${muted}`}>Total Loan</p><p className={`text-sm sm:text-base md:text-lg font-bold ${text}`}>{fmt(proj.financing?.loanAmount || 0)}</p></div>
                        <div className="p-2 sm:p-0"><p className={`text-[10px] sm:text-xs ${muted}`}>Received</p><p className="text-sm sm:text-base md:text-lg font-bold text-emerald-600">{fmt(proj.draws?.filter(d => d.status === 'received').reduce((s, d) => s + ((proj.financing?.loanAmount || 0) * d.pct / 100), 0) || 0)}</p></div>
                        <div className="p-2 sm:p-0"><p className={`text-[10px] sm:text-xs ${muted}`}>Requested</p><p className="text-sm sm:text-base md:text-lg font-bold text-amber-600">{fmt(proj.draws?.filter(d => d.status === 'requested').reduce((s, d) => s + ((proj.financing?.loanAmount || 0) * d.pct / 100), 0) || 0)}</p></div>
                        <div className="p-2 sm:p-0"><p className={`text-[10px] sm:text-xs ${muted}`}>Remaining</p><p className={`text-sm sm:text-base md:text-lg font-bold ${text}`}>{fmt(proj.draws?.filter(d => d.status === 'pending').reduce((s, d) => s + ((proj.financing?.loanAmount || 0) * d.pct / 100), 0) || 0)}</p></div>
                      </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {(proj.draws || []).map(d => {
                        const amount = (proj.financing?.loanAmount || 0) * d.pct / 100;
                        return (
                          <div key={d.id} className={`${card} rounded-xl border ${border} p-4`}>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className={`font-semibold ${text}`}>{d.name}</p>
                                <p className={`text-lg font-bold ${text}`}>{fmt(amount)} <span className={`text-sm font-normal ${muted}`}>({d.pct}%)</span></p>
                              </div>
                              <select value={d.status} onChange={e => updateProj(projId, { draws: proj.draws.map(dr => dr.id === d.id ? { ...dr, status: e.target.value, requestedDate: e.target.value !== 'pending' && !dr.requestedDate ? new Date().toISOString().split('T')[0] : dr.requestedDate, receivedDate: e.target.value === 'received' && !dr.receivedDate ? new Date().toISOString().split('T')[0] : dr.receivedDate } : dr) })} className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${d.status === 'received' ? 'bg-emerald-100 text-emerald-700' : d.status === 'requested' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                <option value="pending">Pending</option><option value="requested">Requested</option><option value="received">Received</option>
                              </select>
                            </div>
                            {(d.requestedDate || d.receivedDate) && (
                              <div className={`text-xs ${muted} space-y-1`}>
                                {d.requestedDate && <p>Requested: {fmtDate(d.requestedDate)}</p>}
                                {d.receivedDate && <p>Received: {fmtDate(d.receivedDate)}</p>}
                              </div>
                            )}
                            <div className="flex justify-end gap-2 mt-2">
                              <button onClick={() => { setForm(d); setSel(d); setModal('editDraw'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                              <button onClick={() => { if (confirm('Delete draw?')) updateProj(projId, { draws: proj.draws.filter(dr => dr.id !== d.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Table View */}
                    <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
                      <table className="w-full">
                        <thead>
                          <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                            <th className="text-left px-4 py-3 font-medium">Draw</th>
                            <th className="text-right px-4 py-3 font-medium">%</th>
                            <th className="text-right px-4 py-3 font-medium">Amount</th>
                            <th className="text-center px-4 py-3 font-medium">Status</th>
                            <th className="text-center px-4 py-3 font-medium">Requested</th>
                            <th className="text-center px-4 py-3 font-medium">Received</th>
                            <th className="text-center px-4 py-3 font-medium w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(proj.draws || []).map(d => {
                            const isExpanded = expanded[`draw-${d.id}`];
                            const amount = (proj.financing?.loanAmount || 0) * d.pct / 100;
                            return (
                              <React.Fragment key={d.id}>
                                <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`draw-${d.id}`]: !e[`draw-${d.id}`] }))}>
                                  <td className={`px-4 py-3 ${text}`}>
                                    <div className="flex items-center gap-2">
                                      <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                      <span className="font-medium">{d.name}</span>
                                    </div>
                                  </td>
                                  <td className={`px-4 py-3 text-right ${text}`}>{d.pct}%</td>
                                  <td className={`px-4 py-3 text-right font-medium ${text}`}>{fmt(amount)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <select value={d.status} onChange={e => { e.stopPropagation(); updateProj(projId, { draws: proj.draws.map(dr => dr.id === d.id ? { ...dr, status: e.target.value, requestedDate: e.target.value !== 'pending' && !dr.requestedDate ? new Date().toISOString().split('T')[0] : dr.requestedDate, receivedDate: e.target.value === 'received' && !dr.receivedDate ? new Date().toISOString().split('T')[0] : dr.receivedDate } : dr) }); }} onClick={e => e.stopPropagation()} className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${d.status === 'received' ? 'bg-emerald-100 text-emerald-700' : d.status === 'requested' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`} style={{paddingRight: '1.25rem'}}>
                                      <option value="pending">Pending</option><option value="requested">Requested</option><option value="received">Received</option>
                                    </select>
                                  </td>
                                  <td className={`px-4 py-3 text-center text-sm ${muted}`}>{d.requestedDate ? fmtDate(d.requestedDate) : '-'}</td>
                                  <td className={`px-4 py-3 text-center text-sm ${muted}`}>{d.receivedDate ? fmtDate(d.receivedDate) : '-'}</td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button onClick={e => { e.stopPropagation(); setForm(d); setSel(d); setModal('editDraw'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                      <button onClick={e => { e.stopPropagation(); if (confirm('Delete draw?')) updateProj(projId, { draws: proj.draws.filter(dr => dr.id !== d.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <td colSpan="7" className="px-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>NOTES</p>
                                          <p className={`text-sm ${text}`}>{d.notes || 'No notes'}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>TIMELINE</p>
                                          <div className={`text-sm ${text}`}>
                                            {d.requestedDate && <p>Requested: {fmtDate(d.requestedDate)}</p>}
                                            {d.receivedDate && <p>Received: {fmtDate(d.receivedDate)}</p>}
                                            {d.requestedDate && d.receivedDate && <p className={muted}>Processing: {Math.round((new Date(d.receivedDate) - new Date(d.requestedDate)) / (1000 * 60 * 60 * 24))} days</p>}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                          <tr className={`border-t ${border} ${dark ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                            <td className={`px-4 py-3 font-semibold ${text}`}>Total</td>
                            <td className={`px-4 py-3 text-right font-semibold ${proj.draws?.reduce((s, d) => s + d.pct, 0) === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{proj.draws?.reduce((s, d) => s + d.pct, 0) || 0}%</td>
                            <td className={`px-4 py-3 text-right font-semibold ${text}`}>{fmt(proj.financing?.loanAmount || 0)}</td>
                            <td colSpan="4"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* MATERIALS TAB */}
                {tab === 'materials' && (() => {
                  const filteredMats = (proj.materials || []).filter(m => {
                    const matchesCat = matFilter === 'all' || m.category === matFilter;
                    const matchesStatus = matStatusFilter === 'all' || m.status === matStatusFilter;
                    return matchesCat && matchesStatus;
                  });
                  const totalCost = filteredMats.reduce((s, m) => s + ((m.quantity || 0) * (m.unitPrice || 0)), 0);
                  const deliveredCost = filteredMats.filter(m => m.status === 'delivered' || m.status === 'installed').reduce((s, m) => s + ((m.quantity || 0) * (m.unitPrice || 0)), 0);
                  
                  return (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <h3 className={`font-semibold ${text}`}>Materials</h3>
                        <p className={`text-sm ${muted}`}>{proj.materials?.length || 0} items • {fmt(totalCost)} total</p>
                      </div>
                      <button onClick={() => { setForm({ category: 'Lumber', status: 'pending', quantity: 1, unit: 'each' }); setModal('addMaterial'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Material</button>
                    </div>

                    {/* Summary */}
                    <div className={`${card} rounded-xl border ${border} p-3 sm:p-4`}>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
                        <div><p className={`text-xs ${muted}`}>Total Items</p><p className={`text-base sm:text-lg font-bold ${text}`}>{proj.materials?.length || 0}</p></div>
                        <div><p className={`text-xs ${muted}`}>Total Cost</p><p className={`text-base sm:text-lg font-bold ${text}`}>{fmt(totalCost)}</p></div>
                        <div><p className={`text-xs ${muted}`}>Delivered</p><p className="text-base sm:text-lg font-bold text-emerald-600">{fmt(deliveredCost)}</p></div>
                        <div><p className={`text-xs ${muted}`}>Pending</p><p className="text-base sm:text-lg font-bold text-amber-600">{fmt(totalCost - deliveredCost)}</p></div>
                        <div className="col-span-2 sm:col-span-1"><p className={`text-xs ${muted}`}>On Order</p><p className={`text-base sm:text-lg font-bold text-blue-600`}>{(proj.materials || []).filter(m => m.status === 'ordered' || m.status === 'shipped').length}</p></div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className={`${card} rounded-xl border ${border} p-3 flex flex-col sm:flex-row gap-3`}>
                      <select value={matFilter} onChange={e => setMatFilter(e.target.value)} className={`${inputCls} w-full sm:w-40 py-2`}>
                        <option value="all">All Categories</option>
                        {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select value={matStatusFilter} onChange={e => setMatStatusFilter(e.target.value)} className={`${inputCls} w-full sm:w-40 py-2`}>
                        <option value="all">All Statuses</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {filteredMats.map(m => {
                        const supplier = suppliers.find(s => s.id === m.supplierId);
                        const total = (m.quantity || 0) * (m.unitPrice || 0);
                        return (
                          <div key={m.id} className={`${card} rounded-xl border ${border} p-4`}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1 min-w-0 mr-2">
                                <p className={`font-semibold ${text} truncate`}>{m.item}</p>
                                <p className={`text-xs ${muted} truncate`}>{m.description}</p>
                              </div>
                              <select value={m.status} onChange={e => updateProj(projId, { materials: proj.materials.map(x => x.id === m.id ? { ...x, status: e.target.value } : x) })} className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${m.status === 'delivered' || m.status === 'installed' ? 'bg-emerald-100 text-emerald-700' : m.status === 'ordered' || m.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                              </select>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div><p className={`text-xs ${muted}`}>Qty</p><p className={`text-sm font-medium ${text}`}>{m.quantity} {m.unit}</p></div>
                              <div><p className={`text-xs ${muted}`}>Unit Price</p><p className={`text-sm font-medium ${text}`}>{fmt(m.unitPrice)}</p></div>
                              <div><p className={`text-xs ${muted}`}>Total</p><p className={`text-sm font-bold ${text}`}>{fmt(total)}</p></div>
                            </div>
                            {supplier && <p className={`text-xs ${muted} mb-2`}>Supplier: {supplier.name}</p>}
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">{m.category}</span>
                              <div className="flex gap-1">
                                <button onClick={() => { setForm(m); setSel(m); setModal('editMaterial'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                <button onClick={() => { if (confirm('Delete?')) updateProj(projId, { materials: proj.materials.filter(x => x.id !== m.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredMats.length === 0 && <div className="p-8 text-center"><Package className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{matFilter !== 'all' || matStatusFilter !== 'all' ? 'No materials match filters' : 'No materials yet'}</p></div>}
                    </div>

                    {/* Desktop Table View */}
                    <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
                      <table className="w-full">
                        <thead>
                          <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                            <th className="text-left px-4 py-3 font-medium">Item</th>
                            <th className="text-left px-4 py-3 font-medium">Supplier</th>
                            <th className="text-left px-4 py-3 font-medium">Category</th>
                            <th className="text-right px-4 py-3 font-medium">Qty</th>
                            <th className="text-right px-4 py-3 font-medium">Total</th>
                            <th className="text-center px-4 py-3 font-medium">Status</th>
                            <th className="text-center px-4 py-3 font-medium w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMats.map(m => {
                            const supplier = suppliers.find(s => s.id === m.supplierId);
                            const isExpanded = expanded[`mat-${m.id}`];
                            const total = (m.quantity || 0) * (m.unitPrice || 0);
                            return (
                              <React.Fragment key={m.id}>
                                <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`mat-${m.id}`]: !e[`mat-${m.id}`] }))}>
                                  <td className={`px-4 py-3 ${text}`}>
                                    <div className="flex items-center gap-2">
                                      <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                      <div>
                                        <p className="font-medium">{m.item}</p>
                                        <p className={`text-xs ${muted}`}>{m.description}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={`px-4 py-3 ${text}`}>{supplier?.name || <span className={muted}>-</span>}</td>
                                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">{m.category}</span></td>
                                  <td className={`px-4 py-3 text-right ${text}`}>{m.quantity} {m.unit}</td>
                                  <td className={`px-4 py-3 text-right font-semibold ${text}`}>{fmt(total)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <select value={m.status} onChange={e => { e.stopPropagation(); updateProj(projId, { materials: proj.materials.map(x => x.id === m.id ? { ...x, status: e.target.value, deliveredDate: e.target.value === 'delivered' && !x.deliveredDate ? new Date().toISOString().split('T')[0] : x.deliveredDate } : x) }); }} onClick={e => e.stopPropagation()} className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${m.status === 'delivered' || m.status === 'installed' ? 'bg-emerald-100 text-emerald-700' : m.status === 'ordered' || m.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`} style={{paddingRight: '1.25rem'}}>
                                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button onClick={e => { e.stopPropagation(); setForm(m); setSel(m); setModal('editMaterial'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                      <button onClick={e => { e.stopPropagation(); if (confirm('Delete material?')) updateProj(projId, { materials: proj.materials.filter(x => x.id !== m.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <td colSpan="7" className="px-4 py-4">
                                      <div className="grid grid-cols-6 gap-4">
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>UNIT PRICE</p>
                                          <p className={`text-sm ${text}`}>{fmt(m.unitPrice)}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>PO NUMBER</p>
                                          <p className={`text-sm ${text}`}>{m.poNumber || '-'}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>ORDER DATE</p>
                                          <p className={`text-sm ${text}`}>{m.orderDate ? fmtDate(m.orderDate) : '-'}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>EXPECTED</p>
                                          <p className={`text-sm ${text}`}>{m.expectedDate ? fmtDate(m.expectedDate) : '-'}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>DELIVERED</p>
                                          <p className={`text-sm ${text}`}>{m.deliveredDate ? fmtDate(m.deliveredDate) : '-'}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>NOTES</p>
                                          <p className={`text-sm ${text}`}>{m.notes || '-'}</p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                          {filteredMats.length > 0 && (
                            <tr className={`border-t ${border} ${dark ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                              <td colSpan="4" className={`px-4 py-3 font-semibold ${text}`}>Total</td>
                              <td className={`px-4 py-3 text-right font-bold ${text}`}>{fmt(totalCost)}</td>
                              <td colSpan="2"></td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {filteredMats.length === 0 && <div className="p-8 text-center"><Package className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{matFilter !== 'all' || matStatusFilter !== 'all' ? 'No materials match filters' : 'No materials yet'}</p></div>}
                    </div>
                  </div>
                );
                })()}

                {/* PHOTOS TAB */}
                {tab === 'photos' && (() => {
                  const allTags = [...new Set((proj.photos || []).flatMap(p => p.tags || []))];
                  const filteredPhotos = (proj.photos || []).filter(p => {
                    const matchesPhase = photoFilter === 'all' || p.phase === photoFilter;
                    const matchesTag = photoTagFilter === 'all' || (p.tags || []).includes(photoTagFilter);
                    return matchesPhase && matchesTag;
                  });
                  return (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <h3 className={`font-semibold ${text}`}>Progress Photos</h3>
                        <p className={`text-sm ${muted}`}>{proj.photos?.length || 0} photos</p>
                      </div>
                      <button onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], phase: proj.phases[0] || 'Pre-Construction', tags: [] }); setModal('addPhoto'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Photo</button>
                    </div>

                    {/* Filters */}
                    <div className={`${card} rounded-xl border ${border} p-3 flex flex-col sm:flex-row gap-3`}>
                      <select value={photoFilter} onChange={e => setPhotoFilter(e.target.value)} className={`${inputCls} w-full sm:w-40 py-2`}>
                        <option value="all">All Phases</option>
                        {proj.phases.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select value={photoTagFilter} onChange={e => setPhotoTagFilter(e.target.value)} className={`${inputCls} w-full sm:w-40 py-2`}>
                        <option value="all">All Tags</option>
                        {PHOTO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {(photoFilter !== 'all' || photoTagFilter !== 'all') && (
                        <button onClick={() => { setPhotoFilter('all'); setPhotoTagFilter('all'); }} className={`px-3 py-2 text-sm ${muted} hover:text-red-500`}>Clear</button>
                      )}
                    </div>

                    {/* Photo Grid */}
                    {filteredPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {filteredPhotos.map(photo => (
                          <div key={photo.id} className={`${card} rounded-xl border ${border} overflow-hidden group`}>
                            <div className={`aspect-video ${dark ? 'bg-slate-700' : 'bg-gray-100'} flex items-center justify-center relative`}>
                              {photo.fileData ? (
                                <img src={photo.fileData} alt={photo.caption} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-4">
                                  <FileText className={`w-8 h-8 mx-auto mb-1 ${muted}`} />
                                  <p className={`text-xs ${muted}`}>{photo.fileName || 'No image'}</p>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button onClick={() => { setForm(photo); setSel(photo); setModal('editPhoto'); }} className="p-2 bg-white rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => { if (confirm('Delete photo?')) updateProj(projId, { photos: proj.photos.filter(p => p.id !== photo.id) }); }} className="p-2 bg-white rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                              </div>
                            </div>
                            <div className="p-2 sm:p-3">
                              <p className={`font-medium text-xs sm:text-sm ${text} truncate`}>{photo.caption || 'Untitled'}</p>
                              <p className={`text-xs ${muted}`}>{fmtDate(photo.date)} • {photo.phase}</p>
                              {photo.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                                  {photo.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600">{tag}</span>
                                  ))}
                                  {photo.tags.length > 2 && <span className={`text-xs ${muted}`}>+{photo.tags.length - 2}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${card} rounded-xl border ${border} p-8 sm:p-12 text-center`}>
                        <FileText className={`w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 ${muted} opacity-30`} />
                        <p className={muted}>{photoFilter !== 'all' || photoTagFilter !== 'all' ? 'No photos match filters' : 'No photos yet'}</p>
                      </div>
                    )}
                  </div>
                );
                })()}

                {/* FILES TAB */}
                {tab === 'files' && (() => {
                  const allFileTags = [...new Set((proj.files || []).flatMap(f => f.tags || []))];
                  let filteredFiles = (proj.files || []).filter(f => {
                    const matchesCat = fileFilter === 'all' || f.category === fileFilter;
                    const matchesSearch = !fileSearch || 
                      f.name.toLowerCase().includes(fileSearch.toLowerCase()) ||
                      f.fileName?.toLowerCase().includes(fileSearch.toLowerCase()) ||
                      (f.tags || []).some(t => t.toLowerCase().includes(fileSearch.toLowerCase()));
                    return matchesCat && matchesSearch;
                  });
                  // Sort
                  if (fileSort === 'date-desc') filteredFiles = [...filteredFiles].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
                  else if (fileSort === 'date-asc') filteredFiles = [...filteredFiles].sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
                  else if (fileSort === 'name-asc') filteredFiles = [...filteredFiles].sort((a, b) => a.name.localeCompare(b.name));
                  else if (fileSort === 'name-desc') filteredFiles = [...filteredFiles].sort((a, b) => b.name.localeCompare(a.name));
                  
                  return (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <h3 className={`font-semibold ${text}`}>Project Files</h3>
                        <p className={`text-sm ${muted}`}>{proj.files?.length || 0} documents</p>
                      </div>
                      <button onClick={() => { setForm({ category: 'Other', uploadedAt: new Date().toISOString().split('T')[0], tags: [] }); setModal('addFile'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Upload File</button>
                    </div>

                    {/* Search, Filter, Sort */}
                    <div className={`${card} rounded-xl border ${border} p-3 flex flex-col sm:flex-row gap-3`}>
                      <div className="flex-1 relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                        <input type="text" placeholder="Search files..." value={fileSearch} onChange={e => setFileSearch(e.target.value)} className={`${inputCls} pl-9 py-2 w-full`} />
                      </div>
                      <div className="flex gap-3">
                        <select value={fileFilter} onChange={e => setFileFilter(e.target.value)} className={`${inputCls} flex-1 sm:w-40 py-2`}>
                          <option value="all">All Categories</option>
                          {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={fileSort} onChange={e => setFileSort(e.target.value)} className={`${inputCls} flex-1 sm:w-40 py-2`}>
                          <option value="date-desc">Newest</option>
                          <option value="date-asc">Oldest</option>
                          <option value="name-asc">A-Z</option>
                          <option value="name-desc">Z-A</option>
                        </select>
                      </div>
                    </div>

                    {/* Category Quick Filters */}
                    <div className="flex flex-wrap gap-2">
                      {['all', ...FILE_CATEGORIES].map(c => {
                        const count = c === 'all' ? proj.files?.length || 0 : (proj.files || []).filter(f => f.category === c).length;
                        if (c !== 'all' && count === 0) return null;
                        return (
                          <button key={c} onClick={() => setFileFilter(c)} className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition ${fileFilter === c ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                            {c === 'all' ? 'All' : c} ({count})
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {filteredFiles.map(f => (
                        <div key={f.id} className={`${card} rounded-xl border ${border} p-4`}>
                          <div className="flex items-start gap-3">
                            <FileText className="w-8 h-8 text-blue-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${text} truncate`}>{f.name}</p>
                              <p className={`text-xs ${muted} truncate`}>{f.fileName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">{f.category}</span>
                                <span className={`text-xs ${muted}`}>{fmtDate(f.uploadedAt)}</span>
                              </div>
                              {f.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {f.tags.slice(0, 3).map(tag => <span key={tag} className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600">{tag}</span>)}
                                  {f.tags.length > 3 && <span className={`text-xs ${muted}`}>+{f.tags.length - 3}</span>}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1 shrink-0">
                              {f.fileData && <button onClick={() => { const link = document.createElement('a'); link.href = f.fileData; link.download = f.fileName || f.name; link.click(); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><FileText className="w-4 h-4" /></button>}
                              <button onClick={() => { setForm({ ...f, tags: f.tags || [] }); setSel(f); setModal('editFile'); }} className={`p-1.5 ${hover} rounded`}><Edit2 className="w-4 h-4 text-gray-400" /></button>
                              <button onClick={() => { if (confirm('Delete?')) updateProj(projId, { files: proj.files.filter(x => x.id !== f.id) }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredFiles.length === 0 && <div className="p-8 text-center"><FileText className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{fileSearch || fileFilter !== 'all' ? 'No files match' : 'No files yet'}</p></div>}
                    </div>

                    {/* Desktop Table View */}
                    <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
                      <table className="w-full">
                        <thead>
                          <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                            <th className="text-left px-4 py-3 font-medium">Name</th>
                            <th className="text-left px-4 py-3 font-medium">Category</th>
                            <th className="text-left px-4 py-3 font-medium">Tags</th>
                            <th className="text-left px-4 py-3 font-medium">Uploaded</th>
                            <th className="text-center px-4 py-3 font-medium w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFiles.map(f => {
                            const isExpanded = expanded[`file-${f.id}`];
                            return (
                              <React.Fragment key={f.id}>
                                <tr className={`border-t ${border} ${hover} cursor-pointer`} onClick={() => setExpanded(e => ({ ...e, [`file-${f.id}`]: !e[`file-${f.id}`] }))}>
                                  <td className={`px-4 py-3 ${text}`}>
                                    <div className="flex items-center gap-2">
                                      <ChevronRight className={`w-4 h-4 ${muted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                      <FileText className="w-5 h-5 text-blue-500" />
                                      <div>
                                        <p className="font-medium">{f.name}</p>
                                        <p className={`text-xs ${muted}`}>{f.fileName}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">{f.category}</span></td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                      {(f.tags || []).slice(0, 2).map(tag => (
                                        <span key={tag} className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600">{tag}</span>
                                      ))}
                                      {(f.tags || []).length > 2 && <span className={`text-xs ${muted}`}>+{f.tags.length - 2}</span>}
                                    </div>
                                  </td>
                                  <td className={`px-4 py-3 text-sm ${muted}`}>{fmtDate(f.uploadedAt)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      {f.fileData && <button onClick={e => { e.stopPropagation(); const link = document.createElement('a'); link.href = f.fileData; link.download = f.fileName || f.name; link.click(); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Download"><FileText className="w-4 h-4" /></button>}
                                      <button onClick={e => { e.stopPropagation(); setForm({ ...f, tags: f.tags || [] }); setSel(f); setModal('editFile'); }} className={`p-1.5 ${hover} rounded`} title="Edit"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                      <button onClick={e => { e.stopPropagation(); if (confirm('Delete file?')) updateProj(projId, { files: proj.files.filter(x => x.id !== f.id) }); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className={`${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <td colSpan="5" className="px-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>NOTES</p>
                                          <p className={`text-sm ${text}`}>{f.notes || 'No notes'}</p>
                                        </div>
                                        <div>
                                          <p className={`text-xs font-semibold ${muted} mb-1`}>ALL TAGS</p>
                                          <div className="flex flex-wrap gap-1">
                                            {(f.tags || []).map(tag => (
                                              <span key={tag} className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-600">{tag}</span>
                                            ))}
                                            {(!f.tags || f.tags.length === 0) && <span className={`text-sm ${muted}`}>No tags</span>}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                      {filteredFiles.length === 0 && <div className="p-8 text-center"><FileText className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{fileSearch || fileFilter !== 'all' ? 'No files match filters' : 'No files yet'}</p></div>}
                    </div>
                  </div>
                );
                })()}

                {/* SETTINGS TAB */}
                {tab === 'settings' && (
                  <div className="max-w-4xl space-y-4">
                    {/* Project Details */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-4 py-3 border-b ${border} flex justify-between items-center`}>
                        <h4 className={`font-semibold ${text}`}>Project Details</h4>
                        <button onClick={() => setEditMode(!editMode)} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${editMode ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                          <Edit2 className="w-3 h-3" />{editMode ? 'Done' : 'Edit'}
                        </button>
                      </div>
                      {editMode ? (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><label className={`block text-sm ${muted} mb-1`}>Name</label><input value={proj.name} onChange={e => updateProj(projId, { name: e.target.value })} className={inputCls} /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Address</label><input value={proj.address} onChange={e => updateProj(projId, { address: e.target.value })} className={inputCls} /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>County</label><select value={proj.county || ''} onChange={e => updateProj(projId, { county: e.target.value })} className={inputCls}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Status</label><select value={proj.status} onChange={e => updateProj(projId, { status: e.target.value })} className={inputCls}><option value="active">Active</option><option value="on_hold">On Hold</option><option value="completed">Completed</option></select></div>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-0">
                          {/* Mobile stacked view */}
                          <div className="sm:hidden space-y-3">
                            <div><p className={`text-xs ${muted}`}>Name</p><p className={`font-medium ${text}`}>{proj.name}</p></div>
                            <div><p className={`text-xs ${muted}`}>Address</p><p className={`font-medium ${text}`}>{proj.address || '-'}</p></div>
                            <div><p className={`text-xs ${muted}`}>County</p><p className={`font-medium ${text}`}>{proj.county || '-'}</p></div>
                            <div>
                              <p className={`text-xs ${muted}`}>Status</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${proj.status === 'active' ? 'bg-emerald-100 text-emerald-700' : proj.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{proj.status || 'active'}</span>
                                {proj.status !== 'completed' && <button onClick={() => { if (confirm('Mark this project as completed?')) updateProj(projId, { status: 'completed' }); }} className="text-xs text-blue-600 hover:underline">Mark Complete</button>}
                              </div>
                            </div>
                          </div>
                          {/* Desktop table view */}
                          <table className="hidden sm:table w-full text-sm">
                            <tbody>
                              <tr className={`border-b ${border}`}><td className={`px-4 py-2.5 ${muted} w-32`}>Name</td><td className={`px-4 py-2.5 font-medium ${text}`}>{proj.name}</td></tr>
                              <tr className={`border-b ${border}`}><td className={`px-4 py-2.5 ${muted}`}>Address</td><td className={`px-4 py-2.5 font-medium ${text}`}>{proj.address || '-'}</td></tr>
                              <tr className={`border-b ${border}`}><td className={`px-4 py-2.5 ${muted}`}>County</td><td className={`px-4 py-2.5 font-medium ${text}`}>{proj.county || '-'}</td></tr>
                              <tr><td className={`px-4 py-2.5 ${muted}`}>Status</td><td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${proj.status === 'active' ? 'bg-emerald-100 text-emerald-700' : proj.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{proj.status || 'active'}</span>
                                  {proj.status !== 'completed' && <button onClick={() => { if (confirm('Mark this project as completed?')) updateProj(projId, { status: 'completed' }); }} className="text-xs text-blue-600 hover:underline">Mark Complete</button>}
                                </div>
                              </td></tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Partners */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-4 py-3 border-b ${border} flex justify-between items-center`}>
                        <div>
                          <h4 className={`font-semibold ${text}`}>Partners</h4>
                          <p className={`text-xs ${muted}`}>Team members involved</p>
                        </div>
                        <button onClick={() => { setForm({ percentage: 0, role: 'Investor' }); setModal('addPartner'); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1 text-sm"><Plus className="w-3 h-3" />Add</button>
                      </div>
                      
                      {/* Mobile Card View */}
                      <div className="sm:hidden p-3 space-y-3">
                        {(proj.partners || []).map(p => {
                          const member = team.find(t => t.id === p.odId);
                          const profitShare = (calcFin(proj).profit * (p.percentage / 100));
                          return (
                            <div key={p.id} className={`${dark ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-3`}>
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full ${member?.color || 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold`}>{member?.avatar?.[0] || '?'}</div>
                                  <div>
                                    <p className={`font-medium ${text}`}>{member?.name || 'Unknown'}</p>
                                    <p className={`text-xs ${muted}`}>{p.role}</p>
                                  </div>
                                </div>
                                <button onClick={() => updateProj(projId, { partners: proj.partners.filter(pt => pt.id !== p.id) })} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div><p className={`text-xs ${muted}`}>Ownership</p><p className={`font-semibold ${text}`}>{p.percentage}%</p></div>
                                <div><p className={`text-xs ${muted}`}>Profit Share</p><p className={`font-semibold ${profitShare >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(profitShare)}</p></div>
                              </div>
                            </div>
                          );
                        })}
                        {(proj.partners || []).length > 0 && (
                          <div className={`${dark ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div><p className={`text-xs ${muted}`}>Total Ownership</p><p className={`font-semibold ${(proj.partners?.reduce((s, p) => s + p.percentage, 0) || 0) === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{proj.partners?.reduce((s, p) => s + p.percentage, 0) || 0}%</p></div>
                              <div><p className={`text-xs ${muted}`}>Total Profit</p><p className={`font-semibold ${text}`}>{fmt(calcFin(proj).profit)}</p></div>
                            </div>
                          </div>
                        )}
                        {(!proj.partners || proj.partners.length === 0) && <div className="p-4 text-center"><Users className={`w-8 h-8 mx-auto mb-2 ${muted} opacity-30`} /><p className={`text-sm ${muted}`}>No partners assigned</p></div>}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden sm:block">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                              <th className="text-left px-4 py-2.5 font-medium">Partner</th>
                              <th className="text-left px-4 py-2.5 font-medium">Role</th>
                              <th className="text-right px-4 py-2.5 font-medium">Ownership</th>
                              <th className="text-right px-4 py-2.5 font-medium">Profit Share</th>
                              <th className="text-center px-4 py-2.5 font-medium w-20"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {(proj.partners || []).map(p => {
                              const member = team.find(t => t.id === p.odId);
                              const profitShare = (calcFin(proj).profit * (p.percentage / 100));
                              return (
                                <tr key={p.id} className={`border-t ${border}`}>
                                  <td className={`px-4 py-2.5 ${text}`}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-7 h-7 rounded-full ${member?.color || 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold`}>{member?.avatar?.[0] || '?'}</div>
                                      <span className="font-medium">{member?.name || 'Unknown'}</span>
                                    </div>
                                  </td>
                                  <td className={`px-4 py-2.5 ${muted}`}>{p.role}</td>
                                  <td className={`px-4 py-2.5 text-right font-semibold ${text}`}>{p.percentage}%</td>
                                  <td className={`px-4 py-2.5 text-right font-semibold ${profitShare >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(profitShare)}</td>
                                  <td className="px-4 py-2.5 text-center">
                                    <button onClick={() => updateProj(projId, { partners: proj.partners.filter(pt => pt.id !== p.id) })} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
                                  </td>
                                </tr>
                              );
                            })}
                            {(proj.partners || []).length > 0 && (
                              <tr className={`border-t ${border} ${dark ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                                <td colSpan="2" className={`px-4 py-2.5 font-semibold ${text}`}>Total</td>
                                <td className={`px-4 py-2.5 text-right font-semibold ${(proj.partners?.reduce((s, p) => s + p.percentage, 0) || 0) === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{proj.partners?.reduce((s, p) => s + p.percentage, 0) || 0}%</td>
                                <td className={`px-4 py-2.5 text-right font-semibold ${text}`}>{fmt(calcFin(proj).profit)}</td>
                                <td></td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        {(!proj.partners || proj.partners.length === 0) && <div className="p-6 text-center"><Users className={`w-8 h-8 mx-auto mb-2 ${muted} opacity-30`} /><p className={`text-sm ${muted}`}>No partners assigned</p></div>}
                      </div>
                    </div>

                    {/* Phase Template */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-4 py-3 border-b ${border}`}>
                        <div>
                          <h4 className={`font-semibold ${text}`}>Phase Template</h4>
                          <p className={`text-xs ${muted}`}>Select a template for project phases (tasks can be customized on Tasks tab)</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {phaseTemplates.map(template => {
                          const isSelected = proj.templateId === template.id;
                          return (
                            <div 
                              key={template.id} 
                              onClick={() => {
                                if (!isSelected && confirm(`Switch to "${template.name}" template? This will update the phases list.`)) {
                                  updateProj(projId, { templateId: template.id, phases: [...template.phases] });
                                }
                              }}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition ${isSelected ? 'border-blue-500 bg-blue-50' : `${border} ${hover}`}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-medium ${isSelected ? 'text-blue-700' : text}`}>{template.name}</span>
                                {isSelected && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">Active</span>}
                              </div>
                              <p className={`text-xs ${muted} mb-2`}>{template.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {template.phases.slice(0, 6).map((phase, idx) => (
                                  <span key={idx} className={`px-1.5 py-0.5 rounded text-xs ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${muted}`}>{phase}</span>
                                ))}
                                {template.phases.length > 6 && <span className={`text-xs ${muted}`}>+{template.phases.length - 6} more</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Custom Phase Override */}
                      <div className={`px-4 py-3 border-t ${border}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-xs font-medium ${muted}`}>CURRENT PHASES (can be customized)</p>
                          <button onClick={() => {
                            const name = prompt('Enter phase name:');
                            if (name && name.trim()) {
                              updateProj(projId, { phases: [...proj.phases, name.trim()] });
                            }
                          }} className={`text-xs text-blue-600 hover:underline flex items-center gap-1`}><Plus className="w-3 h-3" />Add Phase</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {proj.phases.map((phase, idx) => (
                            <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded ${dark ? 'bg-slate-700' : 'bg-gray-100'} group`}>
                              <span className={`text-xs ${text}`}>{phase}</span>
                              <button onClick={() => {
                                if (proj.tasks.some(t => t.phase === phase)) {
                                  alert('Cannot delete phase with tasks. Move or delete tasks first.');
                                } else if (confirm(`Delete "${phase}" phase?`)) {
                                  updateProj(projId, { phases: proj.phases.filter((_, i) => i !== idx) });
                                }
                              }} className="p-0.5 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-3 h-3 text-red-500" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className={`${card} rounded-xl border border-red-200 p-4`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-red-600">Delete Project</h4>
                          <p className={`text-sm ${muted}`}>This action cannot be undone</p>
                        </div>
                        <button onClick={() => { if (confirm('Delete this project? This cannot be undone.')) { setProjects(projects.filter(p => p.id !== projId)); setView('projects'); setProjId(null); } }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </>
          );
        })()}
      </div>

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className={`${card} rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className={`flex justify-between items-center px-5 py-4 border-b ${border}`}>
              <h3 className={`font-semibold text-lg ${text}`}>
                {modal === 'addPayment' && 'Record Payment'}
                {modal === 'viewPayment' && 'Payment Details'}
                {modal === 'addContractor' && 'Add Contractor'}
                {modal === 'editContractor' && 'Edit Contractor'}
                {modal === 'addProjectContractor' && 'Add to Project'}
                {modal === 'addCounty' && 'Add County'}
                {modal === 'addContact' && 'Add Contact'}
                {modal === 'addTask' && 'Add Task'}
                {modal === 'editTask' && 'Edit Task'}
                {modal === 'addProject' && 'New Project'}
                {modal === 'addTeam' && 'Add Team Member'}
                {modal === 'editTeam' && 'Edit Team Member'}
                {modal === 'addTemplate' && 'New Phase Template'}
                {modal === 'editTemplate' && 'Edit Phase Template'}
                {modal === 'editFinancing' && 'Edit Loan Details'}
                {modal === 'addPartner' && 'Add Partner'}
                {modal === 'addDraw' && 'Add Draw'}
                {modal === 'editDraw' && 'Edit Draw'}
                {modal === 'addReceipt' && 'Add Receipt'}
                {modal === 'editReceipt' && 'Edit Receipt'}
                {modal === 'addPhoto' && 'Add Photo'}
                {modal === 'editPhoto' && 'Edit Photo'}
                {modal === 'addFile' && 'Upload File'}
                {modal === 'editFile' && 'Edit File'}
                {modal === 'addSupplier' && 'Add Supplier'}
                {modal === 'editSupplier' && 'Edit Supplier'}
                {modal === 'addMaterial' && 'Add Material'}
                {modal === 'editMaterial' && 'Edit Material'}
                {modal === 'addBid' && 'Add Bid'}
                {modal === 'editBid' && 'Edit Bid'}
                {modal === 'addRequest' && 'Add Change Request'}
                {modal === 'respondRequest' && 'Respond to Request'}
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-70px)]">
              
              {/* ADD PROJECT */}
              {modal === 'addProject' && (
                <>
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-blue-50'} border ${dark ? 'border-slate-600' : 'border-blue-200'}`}>
                      <p className={`text-sm font-medium ${dark ? 'text-blue-300' : 'text-blue-800'}`}>Basic Info</p>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Project Name *</label><input type="text" placeholder="123 Main St" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Address</label><input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Client Name</label><input type="text" value={form.clientName || ''} onChange={e => setForm({ ...form, clientName: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>County</label><select value={form.county || counties[0]?.name} onChange={e => setForm({ ...form, county: e.target.value })} className={inputCls}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                    </div>

                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-blue-50'} border ${dark ? 'border-slate-600' : 'border-blue-200'} mt-6`}>
                      <p className={`text-sm font-medium ${dark ? 'text-blue-300' : 'text-blue-800'}`}>Financing</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setForm({ ...form, financing: { ...form.financing, type: 'cash' } })} className={`flex-1 py-2.5 rounded-lg font-medium ${form.financing?.type === 'cash' ? 'bg-blue-600 text-white' : `border ${border} ${text}`}`}>Cash</button>
                      <button type="button" onClick={() => setForm({ ...form, financing: { ...form.financing, type: 'loan' } })} className={`flex-1 py-2.5 rounded-lg font-medium ${form.financing?.type === 'loan' ? 'bg-blue-600 text-white' : `border ${border} ${text}`}`}>Loan</button>
                    </div>
                    
                    {form.financing?.type === 'loan' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Lender</label><input type="text" value={form.financing?.lender || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, lender: e.target.value } })} className={inputCls} placeholder="Bank name" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Loan Number</label><input type="text" value={form.financing?.loanNumber || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, loanNumber: e.target.value } })} className={inputCls} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Loan Amount</label><input type="text" value={formatCurrency(form.financing?.loanAmount)} onChange={e => setForm({ ...form, financing: { ...form.financing, loanAmount: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Interest Rate (%)</label><input type="text" value={form.financing?.interestRate || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, interestRate: e.target.value.replace(/[^0-9.]/g, '') } })} className={inputCls} placeholder="10.5" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Term (months)</label><input type="text" value={form.financing?.term || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, term: e.target.value.replace(/\D/g, '') } })} className={inputCls} placeholder="12" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Expiration Date</label><input type="date" value={form.financing?.expirationDate || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, expirationDate: e.target.value } })} className={inputCls} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Points (%)</label><input type="text" value={form.financing?.points || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, points: e.target.value.replace(/[^0-9.]/g, '') } })} className={inputCls} placeholder="1.5" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Origination Fee</label><input type="text" value={formatCurrency(form.financing?.originationFee)} onChange={e => setForm({ ...form, financing: { ...form.financing, originationFee: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                        </div>
                      </div>
                    )}

                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-blue-50'} border ${dark ? 'border-slate-600' : 'border-blue-200'} mt-6`}>
                      <p className={`text-sm font-medium ${dark ? 'text-blue-300' : 'text-blue-800'}`}>Initial Costs</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Lot Cost</label><input type="text" value={formatCurrency(form.costs?.lot)} onChange={e => setForm({ ...form, costs: { ...form.costs, lot: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Sale Price</label><input type="text" value={formatCurrency(form.salePrice)} onChange={e => setForm({ ...form, salePrice: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.name) return alert('Project name required');
                      const newProj = {
                        id: Date.now(),
                        name: form.name,
                        address: form.address || '',
                        status: 'active',
                        county: form.county || counties[0]?.name,
                        salePrice: parseFloat(form.salePrice) || 0,
                        costs: {
                          lot: parseFloat(form.costs?.lot) || 0,
                          permits: 0, titleClosing: 0, lendingFees: 0, utilities: 0, insurance: 0, contingency: 0
                        },
                        financing: {
                          type: form.financing?.type || 'loan',
                          lender: form.financing?.lender || '',
                          loanNumber: form.financing?.loanNumber || '',
                          loanAmount: parseFloat(form.financing?.loanAmount) || 0,
                          interestRate: parseFloat(form.financing?.interestRate) || 0,
                          term: parseInt(form.financing?.term) || 12,
                          expirationDate: form.financing?.expirationDate || '',
                          points: parseFloat(form.financing?.points) || 0,
                          originationFee: parseFloat(form.financing?.originationFee) || 0,
                        },
                        client: form.clientName ? { name: form.clientName } : null,
                        phases: [...globalPhases],
                        tasks: TASKS.map((t, i) => ({ ...t, id: Date.now() + i, status: 'pending', assignedTo: null })),
                        contractors: [],
                        bids: [],
                        changeRequests: [],
                        partners: [],
                        receipts: [],
                        photos: [],
                        files: [],
                        materials: [],
                        draws: [
                          { id: 1, name: 'Foundation', pct: 15, status: 'pending', requestedDate: null, receivedDate: null, notes: '' },
                          { id: 2, name: 'Framing', pct: 20, status: 'pending', requestedDate: null, receivedDate: null, notes: '' },
                          { id: 3, name: 'Rough-Ins', pct: 15, status: 'pending', requestedDate: null, receivedDate: null, notes: '' },
                          { id: 4, name: 'Finishes', pct: 35, status: 'pending', requestedDate: null, receivedDate: null, notes: '' },
                          { id: 5, name: 'Final', pct: 15, status: 'pending', requestedDate: null, receivedDate: null, notes: '' },
                        ],
                      };
                      setProjects([...projects, newProj]);
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Create</button>
                  </div>
                </>
              )}

              {/* ADD PAYMENT */}
              {modal === 'addPayment' && (
                <>
                  <div className={`p-3 rounded-lg mb-4 ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}><p className={`text-xs ${muted}`}>To:</p><p className={`font-semibold ${text}`}>{sel?.name}</p></div>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Amount *</label><input type="text" placeholder="1,234.56" value={formatCurrency(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Date *</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Method</label><select value={form.method || 'check'} onChange={e => setForm({ ...form, method: e.target.value })} className={inputCls}>{METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</select></div>
                    {METHODS.find(m => m.id === form.method)?.needsRef && <div><label className={`block text-sm ${muted} mb-1`}>{METHODS.find(m => m.id === form.method)?.refLabel}</label><input type="text" value={form.refNumber || ''} onChange={e => setForm({ ...form, refNumber: e.target.value })} className={inputCls} /></div>}
                    <div><label className={`block text-sm ${muted} mb-1`}>Account</label><select value={form.account || 'Business Checking'} onChange={e => setForm({ ...form, account: e.target.value })} className={inputCls}>{ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Paid By</label><input type="text" value={form.paidBy || ''} onChange={e => setForm({ ...form, paidBy: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Memo</label><input type="text" value={form.memo || ''} onChange={e => setForm({ ...form, memo: e.target.value })} className={inputCls} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.amount || !form.date) return alert('Amount and date required'); updateProj(projId, { contractors: proj.contractors.map(c => c.id === sel.id ? { ...c, payments: [...(c.payments || []), { ...form, id: Date.now(), amount: parseFloat(form.amount) || 0 }] } : c) }); closeModal(); }} className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* VIEW PAYMENT */}
              {modal === 'viewPayment' && sel && (
                <>
                  <div className={`p-6 rounded-xl mb-4 ${dark ? 'bg-slate-700' : 'bg-gray-100'} text-center`}>
                    <p className={`text-4xl font-bold ${text}`}>{fmt(sel.amount)}</p>
                    <p className={`${muted} mt-1`}>to {sel.contractorName}</p>
                  </div>
                  <div className="space-y-3">
                    {[{ label: 'Date', value: sel.date }, { label: 'Method', value: METHODS.find(m => m.id === sel.method)?.label }, { label: 'Reference #', value: sel.refNumber }, { label: 'Account', value: sel.account }, { label: 'Paid By', value: sel.paidBy }, { label: 'Memo', value: sel.memo }].filter(x => x.value).map(x => (
                      <div key={x.label} className={`flex justify-between py-2 border-b ${border}`}><span className={muted}>{x.label}</span><span className={`font-medium ${text}`}>{x.value}</span></div>
                    ))}
                  </div>
                  <button onClick={closeModal} className="w-full mt-5 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Close</button>
                </>
              )}

              {/* ADD BID */}
              {modal === 'addBid' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label><select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={inputCls}><option value="">-- Select or leave blank --</option>{contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    {!form.contractorId && <div><label className={`block text-sm ${muted} mb-1`}>Vendor Name</label><input type="text" value={form.vendorName || ''} onChange={e => setForm({ ...form, vendorName: e.target.value })} className={inputCls} placeholder="If not in directory" /></div>}
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade *</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={inputCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description *</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Amount *</label><input type="text" value={formatCurrency(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Date</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.description || !form.amount) return alert('Required'); updateProj(projId, { bids: [...(proj.bids || []), { ...form, id: Date.now(), amount: parseFloat(form.amount) || 0, status: 'pending' }] }); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* EDIT BID */}
              {modal === 'editBid' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label><select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={inputCls}><option value="">-- None --</option>{contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={inputCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Amount</label><input type="text" value={formatCurrency(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Status</label><select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { updateProj(projId, { bids: proj.bids.map(b => b.id === sel.id ? { ...form, id: sel.id, amount: parseFloat(form.amount) || 0 } : b) }); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD REQUEST */}
              {modal === 'addRequest' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Title *</label><input type="text" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description *</label><textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} h-24`} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Est. Cost</label><input type="text" value={formatCurrency(form.cost)} onChange={e => setForm({ ...form, cost: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.title || !form.description) return; updateProj(projId, { changeRequests: [...(proj.changeRequests || []), { ...form, id: Date.now(), cost: form.cost ? parseFloat(form.cost) : null, status: 'pending', submittedAt: new Date().toISOString().split('T')[0], respondedAt: null, notes: '' }] }); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* RESPOND REQUEST */}
              {modal === 'respondRequest' && (
                <>
                  <div className={`p-3 rounded-lg mb-4 ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}><p className={`font-semibold ${text}`}>{sel?.title}</p><p className={`text-sm ${muted}`}>{sel?.description}</p></div>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Decision</label><select value={form.status || 'approved'} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}><option value="approved">Approve</option><option value="rejected">Reject</option></select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Cost Impact</label><input type="text" value={formatCurrency(form.cost)} onChange={e => setForm({ ...form, cost: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { updateProj(projId, { changeRequests: proj.changeRequests.map(r => r.id === sel.id ? { ...r, status: form.status, cost: form.cost ? parseFloat(form.cost) : r.cost, notes: form.notes || r.notes, respondedAt: new Date().toISOString().split('T')[0] } : r) }); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Submit</button>
                  </div>
                </>
              )}

              {/* ADD CONTRACTOR */}
              {modal === 'addContractor' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Company Name *</label><input type="text" placeholder="Company name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Contact Person</label><input type="text" placeholder="Primary contact" value={form.contact || ''} onChange={e => setForm({ ...form, contact: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={inputCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="123-456-7890" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Email</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>City</label><input type="text" placeholder="Jonesboro" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>State</label><input type="text" placeholder="AR" maxLength={2} value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>License #</label><input type="text" value={form.license || ''} onChange={e => setForm({ ...form, license: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Address</label><input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.name) return; setContractors([...contractors, { ...form, id: Date.now() }]); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* EDIT CONTRACTOR */}
              {modal === 'editContractor' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Company Name</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Contact Person</label><input type="text" value={form.contact || ''} onChange={e => setForm({ ...form, contact: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={inputCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="123-456-7890" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Email</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>City</label><input type="text" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>State</label><input type="text" maxLength={2} value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>License #</label><input type="text" value={form.license || ''} onChange={e => setForm({ ...form, license: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Address</label><input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { setContractors(contractors.map(c => c.id === sel.id ? { ...form, id: sel.id } : c)); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD SUPPLIER */}
              {modal === 'addSupplier' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Supplier Name *</label><input type="text" placeholder="Company name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Contact</label><input type="text" placeholder="Contact person" value={form.contact || ''} onChange={e => setForm({ ...form, contact: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Category</label><select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>{MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="123-456-7890" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Email</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>City</label><input type="text" placeholder="Jonesboro" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>State</label><input type="text" placeholder="AR" maxLength={2} value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Account #</label><input type="text" value={form.accountNum || ''} onChange={e => setForm({ ...form, accountNum: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Address</label><input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Website</label><input type="text" value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.name) return; setSuppliers([...suppliers, { ...form, id: Date.now() }]); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* EDIT SUPPLIER */}
              {modal === 'editSupplier' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Supplier Name</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Contact</label><input type="text" value={form.contact || ''} onChange={e => setForm({ ...form, contact: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Category</label><select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>{MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="123-456-7890" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Email</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>City</label><input type="text" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>State</label><input type="text" maxLength={2} value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Account #</label><input type="text" value={form.accountNum || ''} onChange={e => setForm({ ...form, accountNum: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Address</label><input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Website</label><input type="text" value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { setSuppliers(suppliers.map(s => s.id === sel.id ? { ...form, id: sel.id } : s)); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD PROJECT CONTRACTOR */}
              {modal === 'addProjectContractor' && (() => {
                const filteredContractors = contractors.filter(c => {
                  const matchesSearch = !projectContractorSearch || 
                    c.name.toLowerCase().includes(projectContractorSearch.toLowerCase()) ||
                    c.contact?.toLowerCase().includes(projectContractorSearch.toLowerCase()) ||
                    c.trade.toLowerCase().includes(projectContractorSearch.toLowerCase());
                  const matchesTrade = projectContractorTradeFilter === 'all' || c.trade === projectContractorTradeFilter;
                  return matchesSearch && matchesTrade;
                });
                return (
                  <div className="space-y-3">
                    {/* Search & Filter */}
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                        <input type="text" placeholder="Search contractors..." value={projectContractorSearch} onChange={e => setProjectContractorSearch(e.target.value)} className={`${inputCls} pl-9 py-2`} />
                      </div>
                      <select value={projectContractorTradeFilter} onChange={e => setProjectContractorTradeFilter(e.target.value)} className={`${inputCls} w-32 py-2`}>
                        <option value="all">All Trades</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    {/* Contractor List */}
                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {filteredContractors.map(c => {
                        const added = proj?.contractors.find(pc => pc.gid === c.id);
                        return (
                          <div key={c.id} onClick={() => { if (!added) { updateProj(projId, { contractors: [...proj.contractors, { id: Date.now(), gid: c.id, quote: 0, payments: [] }] }); } }} className={`p-3 rounded-lg border ${border} ${added ? 'opacity-50' : `${hover} cursor-pointer`}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{c.name.substring(0, 2).toUpperCase()}</div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium ${text} truncate`}>{c.name}</p>
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600">{c.trade}</span>
                                  {c.city && <span className={`text-xs ${muted}`}>{c.city}</span>}
                                </div>
                              </div>
                              {added ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 shrink-0">Added</span> : <Plus className="w-5 h-5 text-blue-600 shrink-0" />}
                            </div>
                          </div>
                        );
                      })}
                      {filteredContractors.length === 0 && <div className={`p-4 text-center ${muted} text-sm`}>No contractors found</div>}
                    </div>
                  </div>
                );
              })()}

              {/* ADD COUNTY */}
              {modal === 'addCounty' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>County Name *</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>State</label><input type="text" value={form.state || 'AR'} onChange={e => setForm({ ...form, state: e.target.value })} className={inputCls} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.name) return; setCounties([...counties, { ...form, id: Date.now(), contacts: [] }]); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* ADD CONTACT */}
              {modal === 'addContact' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Title *</label><input type="text" placeholder="Building Inspector" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Name</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="123-456-7890" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Email</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.title) return; setCounties(counties.map(c => c.id === sel.id ? { ...c, contacts: [...c.contacts, { ...form, id: Date.now() }] } : c)); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* ADD TASK */}
              {modal === 'addTask' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Phase *</label><select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={inputCls}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Task Name *</label><input type="text" value={form.task || ''} onChange={e => setForm({ ...form, task: e.target.value })} className={inputCls} placeholder="e.g., Pour concrete slab" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Duration (days)</label><input type="text" value={form.days || 1} onChange={e => setForm({ ...form, days: parseInt(e.target.value.replace(/\D/g, '')) || 1 })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Start Date</label><input type="date" value={form.scheduledStart || ''} onChange={e => {
                        const start = e.target.value;
                        const end = start && form.days ? new Date(new Date(start).getTime() + (form.days - 1) * 86400000).toISOString().split('T')[0] : form.scheduledEnd;
                        setForm({ ...form, scheduledStart: start, scheduledEnd: end });
                      }} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>End Date</label><input type="date" value={form.scheduledEnd || ''} onChange={e => setForm({ ...form, scheduledEnd: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Priority</label><select value={form.priority || 'normal'} onChange={e => setForm({ ...form, priority: e.target.value })} className={inputCls}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Assign To (Team)</label><select value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })} className={inputCls}><option value="">-</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label>
                      <select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={inputCls}>
                        <option value="">-- Select Contractor --</option>
                        {contractors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.trade})</option>)}
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className={inputCls} placeholder="Any special instructions or details..." /></div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="addInspection" checked={form.inspection || false} onChange={e => setForm({ ...form, inspection: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="addInspection" className={`text-sm ${text}`}>⚠️ This is an inspection</label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.task || !form.phase) return; 
                      const nextId = (proj.taskCounter || proj.tasks.length) + 1;
                      updateProj(projId, { 
                        taskCounter: nextId,
                        tasks: [...proj.tasks, { ...form, id: nextId, status: 'pending' }] 
                      }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add Task</button>
                  </div>
                </>
              )}

              {/* EDIT TASK */}
              {modal === 'editTask' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Phase</label><select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={inputCls}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Task Name</label><input type="text" value={form.task || ''} onChange={e => setForm({ ...form, task: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label><select value={form.status || 'pending'} onChange={e => {
                        const newStatus = e.target.value;
                        const today = new Date().toISOString().split('T')[0];
                        const updates = { status: newStatus };
                        if (newStatus === 'complete' && !form.completedDate) {
                          updates.completedDate = today;
                          updates.actualEnd = today;
                        }
                        if (newStatus === 'in_progress' && !form.actualStart) {
                          updates.actualStart = today;
                        }
                        if (newStatus === 'pending') {
                          updates.completedDate = null;
                          updates.actualEnd = null;
                        }
                        setForm({ ...form, ...updates });
                      }} className={inputCls}><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="complete">Complete</option></select></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Priority</label><select value={form.priority || 'normal'} onChange={e => setForm({ ...form, priority: e.target.value })} className={inputCls}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></div>
                    </div>
                    
                    {/* Schedule Section */}
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-semibold ${muted} mb-2 uppercase`}>Schedule</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={`block text-xs ${muted} mb-1`}>Start Date</label><input type="date" value={form.scheduledStart || ''} onChange={e => setForm({ ...form, scheduledStart: e.target.value })} className={inputCls} /></div>
                        <div><label className={`block text-xs ${muted} mb-1`}>End Date</label><input type="date" value={form.scheduledEnd || ''} onChange={e => setForm({ ...form, scheduledEnd: e.target.value })} className={inputCls} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div><label className={`block text-xs ${muted} mb-1`}>Duration (days)</label><input type="text" value={form.days || 1} onChange={e => setForm({ ...form, days: parseInt(e.target.value.replace(/\D/g, '')) || 1 })} className={inputCls} /></div>
                        <div><label className={`block text-xs ${muted} mb-1`}>Actual Start</label><input type="date" value={form.actualStart || ''} onChange={e => setForm({ ...form, actualStart: e.target.value })} className={inputCls} /></div>
                      </div>
                      {form.status === 'complete' && (
                        <div className="mt-2">
                          <label className={`block text-xs ${muted} mb-1`}>Completed Date</label>
                          <input type="date" value={form.completedDate || ''} onChange={e => setForm({ ...form, completedDate: e.target.value, actualEnd: e.target.value })} className={`${inputCls} border-emerald-300`} />
                        </div>
                      )}
                    </div>

                    <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label>
                      <select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={inputCls}>
                        <option value="">-- No Contractor --</option>
                        {contractors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.trade})</option>)}
                      </select>
                      {form.contractorId && (() => {
                        const c = contractors.find(x => x.id === form.contractorId);
                        return c ? (
                          <div className={`mt-2 p-2 rounded-lg ${dark ? 'bg-slate-700' : 'bg-blue-50'} text-sm`}>
                            <p className={`font-medium ${text}`}>{c.name}</p>
                            <div className="flex gap-3 mt-1">
                              {c.phone && <span className={muted}><Phone className="w-3 h-3 inline mr-1" />{c.phone}</span>}
                              {c.email && <span className={muted}><Mail className="w-3 h-3 inline mr-1" />{c.email}</span>}
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Assign To (Team)</label><select value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })} className={inputCls}><option value="">-</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className={inputCls} placeholder="Any special instructions..." /></div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="editInspection" checked={form.inspection || false} onChange={e => setForm({ ...form, inspection: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="editInspection" className={`text-sm ${text}`}>⚠️ This is an inspection</label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { updateProj(projId, { tasks: proj.tasks.map(t => t.id === sel.id ? { ...form, id: sel.id } : t) }); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save Changes</button>
                  </div>
                </>
              )}

              {/* ADD TEAM */}
              {modal === 'addTeam' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Name *</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Email *</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="123-456-7890" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Role</label><select value={form.role || 'partner'} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls}><option value="admin">Admin</option><option value="partner">Partner</option><option value="viewer">Viewer</option></select></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.name || !form.email) return; setTeam([...team, { ...form, id: Date.now(), avatar: form.name.substring(0, 2).toUpperCase(), color: ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-orange-600'][team.length % 4] }]); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* EDIT TEAM MEMBER */}
              {modal === 'editTeam' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Name *</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Email *</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="123-456-7890" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Role</label><select value={form.role || 'partner'} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls}><option value="admin">Admin</option><option value="partner">Partner</option><option value="viewer">Viewer</option></select></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { if (!form.name || !form.email) return; setTeam(team.map(m => m.id === sel.id ? { ...m, ...form, avatar: form.name.substring(0, 2).toUpperCase() } : m)); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD TEMPLATE */}
              {modal === 'addTemplate' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Template Name *</label><input type="text" placeholder="e.g., Brick Exterior Build" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" placeholder="Brief description of when to use this template" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Phases</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(form.phases || PHASES).map((phase, idx) => (
                          <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded ${dark ? 'bg-slate-700' : 'bg-gray-100'} group`}>
                            <span className={`text-xs ${text}`}>{phase}</span>
                            <button onClick={() => setForm({ ...form, phases: (form.phases || PHASES).filter((_, i) => i !== idx) })} className="p-0.5 hover:bg-red-100 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => {
                        const name = prompt('Add phase name:');
                        if (name && name.trim()) setForm({ ...form, phases: [...(form.phases || PHASES), name.trim()] });
                      }} className={`text-sm text-blue-600 hover:underline flex items-center gap-1`}><Plus className="w-3 h-3" />Add Phase</button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.name) return alert('Name required'); 
                      setPhaseTemplates([...phaseTemplates, { id: Date.now(), name: form.name, description: form.description || '', phases: form.phases || PHASES, tasks: [] }]); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Create Template</button>
                  </div>
                </>
              )}

              {/* EDIT TEMPLATE */}
              {modal === 'editTemplate' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Template Name *</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Phases (drag to reorder)</label>
                      <div className="space-y-1 mb-2">
                        {(form.phases || []).map((phase, idx) => (
                          <div 
                            key={idx} 
                            draggable
                            onDragStart={() => setDraggedPhase(idx)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={() => {
                              if (draggedPhase === null || draggedPhase === idx) return;
                              const newPhases = [...form.phases];
                              const [removed] = newPhases.splice(draggedPhase, 1);
                              newPhases.splice(idx, 0, removed);
                              setForm({ ...form, phases: newPhases });
                              setDraggedPhase(null);
                            }}
                            onDragEnd={() => setDraggedPhase(null)}
                            className={`flex items-center gap-2 px-3 py-2 rounded ${dark ? 'bg-slate-700' : 'bg-gray-100'} cursor-grab ${draggedPhase === idx ? 'opacity-50' : ''}`}
                          >
                            <GripVertical className={`w-4 h-4 ${muted}`} />
                            <span className={`text-sm ${text} flex-1`}>{idx + 1}. {phase}</span>
                            <button onClick={() => {
                              const newName = prompt('Edit phase name:', phase);
                              if (newName && newName.trim()) setForm({ ...form, phases: form.phases.map((p, i) => i === idx ? newName.trim() : p) });
                            }} className={`p-1 ${hover} rounded`}><Edit2 className="w-3 h-3 text-gray-400" /></button>
                            <button onClick={() => setForm({ ...form, phases: form.phases.filter((_, i) => i !== idx) })} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => {
                        const name = prompt('Add phase name:');
                        if (name && name.trim()) setForm({ ...form, phases: [...form.phases, name.trim()] });
                      }} className={`text-sm text-blue-600 hover:underline flex items-center gap-1`}><Plus className="w-3 h-3" />Add Phase</button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.name) return alert('Name required'); 
                      setPhaseTemplates(phaseTemplates.map(t => t.id === sel.id ? { ...t, name: form.name, description: form.description, phases: form.phases } : t)); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save Changes</button>
                  </div>
                </>
              )}

              {/* EDIT FINANCING */}
              {modal === 'editFinancing' && proj && (
                <>
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <button type="button" onClick={() => updateProj(projId, { financing: { ...proj.financing, type: 'cash' } })} className={`flex-1 py-2.5 rounded-lg font-medium ${proj.financing?.type === 'cash' ? 'bg-blue-600 text-white' : `border ${border} ${text}`}`}>Cash</button>
                      <button type="button" onClick={() => updateProj(projId, { financing: { ...proj.financing, type: 'loan' } })} className={`flex-1 py-2.5 rounded-lg font-medium ${proj.financing?.type === 'loan' ? 'bg-blue-600 text-white' : `border ${border} ${text}`}`}>Loan</button>
                    </div>
                    {proj.financing?.type === 'loan' && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Lender</label><input value={proj.financing?.lender || ''} onChange={e => updateProj(projId, { financing: { ...proj.financing, lender: e.target.value } })} className={inputCls} /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Loan Number</label><input value={proj.financing?.loanNumber || ''} onChange={e => updateProj(projId, { financing: { ...proj.financing, loanNumber: e.target.value } })} className={inputCls} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Loan Amount</label><input type="text" value={formatCurrency(proj.financing?.loanAmount)} onChange={e => updateProj(projId, { financing: { ...proj.financing, loanAmount: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Interest Rate (%)</label><input type="text" value={proj.financing?.interestRate || ''} onChange={e => updateProj(projId, { financing: { ...proj.financing, interestRate: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 } })} className={inputCls} placeholder="10.5" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Term (months)</label><input type="text" value={proj.financing?.term || ''} onChange={e => updateProj(projId, { financing: { ...proj.financing, term: parseInt(e.target.value.replace(/\D/g, '')) || 0 } })} className={inputCls} placeholder="12" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Expiration Date</label><input type="date" value={proj.financing?.expirationDate || ''} onChange={e => updateProj(projId, { financing: { ...proj.financing, expirationDate: e.target.value } })} className={inputCls} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Points (%)</label><input type="text" value={proj.financing?.points || ''} onChange={e => updateProj(projId, { financing: { ...proj.financing, points: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 } })} className={inputCls} placeholder="1.5" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Origination Fee</label><input type="text" value={formatCurrency(proj.financing?.originationFee)} onChange={e => updateProj(projId, { financing: { ...proj.financing, originationFee: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Done</button>
                  </div>
                </>
              )}

              {/* ADD PARTNER */}
              {modal === 'addPartner' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Team Member *</label>
                      <select value={form.odId || ''} onChange={e => setForm({ ...form, odId: parseInt(e.target.value) })} className={inputCls}>
                        <option value="">-- Select --</option>
                        {team.filter(m => !proj?.partners?.some(p => p.odId === m.id)).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Role</label><input type="text" placeholder="e.g., Managing Partner, Investor" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Ownership %</label><input type="text" value={form.percentage || ''} onChange={e => setForm({ ...form, percentage: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })} className={inputCls} placeholder="25" /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.odId) return alert('Select a team member');
                      updateProj(projId, { partners: [...(proj.partners || []), { id: Date.now(), odId: form.odId, percentage: form.percentage || 0, role: form.role || 'Partner' }] }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* ADD DRAW */}
              {modal === 'addDraw' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Draw Name *</label><input type="text" placeholder="e.g., Foundation, Framing" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Percentage *</label><input type="text" value={form.pct || ''} onChange={e => setForm({ ...form, pct: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })} className={inputCls} placeholder="10" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                          <option value="pending">Pending</option><option value="requested">Requested</option><option value="received">Received</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Requested Date</label><input type="date" value={form.requestedDate || ''} onChange={e => setForm({ ...form, requestedDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Received Date</label><input type="date" value={form.receivedDate || ''} onChange={e => setForm({ ...form, receivedDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.name) return alert('Draw name required');
                      updateProj(projId, { draws: [...(proj.draws || []), { ...form, id: Date.now(), pct: form.pct || 0 }] }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
                  </div>
                </>
              )}

              {/* EDIT DRAW */}
              {modal === 'editDraw' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Draw Name</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Percentage</label><input type="text" value={form.pct || ''} onChange={e => setForm({ ...form, pct: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })} className={inputCls} placeholder="10" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                          <option value="pending">Pending</option><option value="requested">Requested</option><option value="received">Received</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Requested Date</label><input type="date" value={form.requestedDate || ''} onChange={e => setForm({ ...form, requestedDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Received Date</label><input type="date" value={form.receivedDate || ''} onChange={e => setForm({ ...form, receivedDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { draws: proj.draws.map(d => d.id === sel.id ? { ...form, id: sel.id } : d) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD RECEIPT */}
              {modal === 'addReceipt' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date *</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Amount *</label><input type="text" placeholder="1,234.56" value={formatCurrency(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Vendor *</label><input type="text" placeholder="Home Depot, Lowes, etc." value={form.vendor || ''} onChange={e => setForm({ ...form, vendor: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Materials'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                          {RECEIPT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" placeholder="What was purchased" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Receipt File (optional)</label>
                      <input type="file" accept="image/*,.pdf" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setForm({ ...form, fileName: file.name, fileData: ev.target.result });
                          reader.readAsDataURL(file);
                        }
                      }} className={`${inputCls} py-1.5`} />
                      {form.fileName && <p className={`text-xs ${muted} mt-1`}>📎 {form.fileName}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.vendor || !form.amount) return alert('Vendor and amount required');
                      updateProj(projId, { receipts: [...(proj.receipts || []), { ...form, id: Date.now() }] }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add Receipt</button>
                  </div>
                </>
              )}

              {/* EDIT RECEIPT */}
              {modal === 'editReceipt' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Amount</label><input type="text" value={formatCurrency(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Vendor</label><input type="text" value={form.vendor || ''} onChange={e => setForm({ ...form, vendor: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Materials'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                          {RECEIPT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Receipt File</label>
                      {form.fileName && <p className={`text-xs ${muted} mb-2`}>📎 Current: {form.fileName}</p>}
                      <input type="file" accept="image/*,.pdf" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setForm({ ...form, fileName: file.name, fileData: ev.target.result });
                          reader.readAsDataURL(file);
                        }
                      }} className={`${inputCls} py-1.5`} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { receipts: proj.receipts.map(r => r.id === sel.id ? { ...form, id: sel.id } : r) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD PHOTO */}
              {modal === 'addPhoto' && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Photo *</label>
                      <input type="file" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setForm({ ...form, fileName: file.name, fileData: ev.target.result });
                          reader.readAsDataURL(file);
                        }
                      }} className={`${inputCls} py-1.5`} />
                      {form.fileData && <img src={form.fileData} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Phase</label>
                        <select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={inputCls}>
                          {proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Caption</label><input type="text" placeholder="Describe this photo" value={form.caption || ''} onChange={e => setForm({ ...form, caption: e.target.value })} className={inputCls} /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {PHOTO_TAGS.map(tag => (
                          <button key={tag} type="button" onClick={() => {
                            const tags = form.tags || [];
                            if (tags.includes(tag)) setForm({ ...form, tags: tags.filter(t => t !== tag) });
                            else setForm({ ...form, tags: [...tags, tag] });
                          }} className={`px-2 py-1 rounded text-xs font-medium transition ${(form.tags || []).includes(tag) ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.fileData) return alert('Please select a photo');
                      updateProj(projId, { photos: [...(proj.photos || []), { ...form, id: Date.now() }] }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add Photo</button>
                  </div>
                </>
              )}

              {/* EDIT PHOTO */}
              {modal === 'editPhoto' && (
                <>
                  <div className="space-y-4">
                    {form.fileData && <img src={form.fileData} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Phase</label>
                        <select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={inputCls}>
                          {proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Caption</label><input type="text" value={form.caption || ''} onChange={e => setForm({ ...form, caption: e.target.value })} className={inputCls} /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {PHOTO_TAGS.map(tag => (
                          <button key={tag} type="button" onClick={() => {
                            const tags = form.tags || [];
                            if (tags.includes(tag)) setForm({ ...form, tags: tags.filter(t => t !== tag) });
                            else setForm({ ...form, tags: [...tags, tag] });
                          }} className={`px-2 py-1 rounded text-xs font-medium transition ${(form.tags || []).includes(tag) ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { photos: proj.photos.map(p => p.id === sel.id ? { ...form, id: sel.id } : p) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD FILE */}
              {modal === 'addFile' && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>File *</label>
                      <input type="file" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setForm({ ...form, fileName: file.name, fileData: ev.target.result });
                          reader.readAsDataURL(file);
                        }
                      }} className={`${inputCls} py-1.5`} />
                      {form.fileName && <p className={`text-xs ${muted} mt-1`}>📎 {form.fileName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Name *</label><input type="text" placeholder="Document name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                          {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} placeholder="Additional details about this file" /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {['Required', 'Signed', 'Active', 'Expired', 'Pending', 'Approved', 'City', 'County', 'Lender'].map(tag => (
                          <button key={tag} type="button" onClick={() => {
                            const tags = form.tags || [];
                            if (tags.includes(tag)) setForm({ ...form, tags: tags.filter(t => t !== tag) });
                            else setForm({ ...form, tags: [...tags, tag] });
                          }} className={`px-2 py-1 rounded text-xs font-medium transition ${(form.tags || []).includes(tag) ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                            {tag}
                          </button>
                        ))}
                      </div>
                      <input type="text" placeholder="Add custom tag and press Enter" onKeyDown={e => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          setForm({ ...form, tags: [...(form.tags || []), e.target.value.trim()] });
                          e.target.value = '';
                        }
                      }} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.name) return alert('File name required');
                      updateProj(projId, { files: [...(proj.files || []), { ...form, id: Date.now(), uploadedAt: form.uploadedAt || new Date().toISOString().split('T')[0] }] }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Upload</button>
                  </div>
                </>
              )}

              {/* EDIT FILE */}
              {modal === 'editFile' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Name</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                          {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} /></div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {['Required', 'Signed', 'Active', 'Expired', 'Pending', 'Approved', 'City', 'County', 'Lender'].map(tag => (
                          <button key={tag} type="button" onClick={() => {
                            const tags = form.tags || [];
                            if (tags.includes(tag)) setForm({ ...form, tags: tags.filter(t => t !== tag) });
                            else setForm({ ...form, tags: [...tags, tag] });
                          }} className={`px-2 py-1 rounded text-xs font-medium transition ${(form.tags || []).includes(tag) ? 'bg-blue-600 text-white' : `${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}`}>
                            {tag}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(form.tags || []).filter(t => !['Required', 'Signed', 'Active', 'Expired', 'Pending', 'Approved', 'City', 'County', 'Lender'].includes(t)).map(tag => (
                          <span key={tag} className="px-2 py-1 rounded text-xs bg-blue-600 text-white flex items-center gap-1">
                            {tag}
                            <button onClick={() => setForm({ ...form, tags: form.tags.filter(t => t !== tag) })} className="hover:text-red-200">×</button>
                          </span>
                        ))}
                      </div>
                      <input type="text" placeholder="Add custom tag and press Enter" onKeyDown={e => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          setForm({ ...form, tags: [...(form.tags || []), e.target.value.trim()] });
                          e.target.value = '';
                        }
                      }} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { files: proj.files.map(f => f.id === sel.id ? { ...form, id: sel.id } : f) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

              {/* ADD MATERIAL */}
              {modal === 'addMaterial' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Supplier</label>
                      <select value={form.supplierId || ''} onChange={e => setForm({ ...form, supplierId: parseInt(e.target.value) || null })} className={inputCls}>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} - {s.category}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Item Name *</label><input type="text" placeholder="e.g., Framing Lumber" value={form.item || ''} onChange={e => setForm({ ...form, item: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Lumber'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                          {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" placeholder="Specifications, sizes, etc." value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Quantity</label><input type="text" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit</label><input type="text" placeholder="each, lot, sqft" value={form.unit || ''} onChange={e => setForm({ ...form, unit: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit Price</label><input type="text" value={formatCurrency(form.unitPrice)} onChange={e => setForm({ ...form, unitPrice: parseCurrency(e.target.value) })} className={inputCls} placeholder="0.00" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Total</label><input type="text" readOnly value={fmt((form.quantity || 0) * (form.unitPrice || 0))} className={`${inputCls} bg-gray-100`} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>PO Number</label><input type="text" value={form.poNumber || ''} onChange={e => setForm({ ...form, poNumber: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Order Date</label><input type="date" value={form.orderDate || ''} onChange={e => setForm({ ...form, orderDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Expected Delivery</label><input type="date" value={form.expectedDate || ''} onChange={e => setForm({ ...form, expectedDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Delivered Date</label><input type="date" value={form.deliveredDate || ''} onChange={e => setForm({ ...form, deliveredDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} placeholder="Special instructions, notes..." /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      if (!form.item) return alert('Item name required');
                      updateProj(projId, { materials: [...(proj.materials || []), { ...form, id: Date.now() }] }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add Material</button>
                  </div>
                </>
              )}

              {/* EDIT MATERIAL */}
              {modal === 'editMaterial' && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Supplier</label>
                      <select value={form.supplierId || ''} onChange={e => setForm({ ...form, supplierId: parseInt(e.target.value) || null })} className={inputCls}>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} - {s.category}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Item Name</label><input type="text" value={form.item || ''} onChange={e => setForm({ ...form, item: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Lumber'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                          {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Quantity</label><input type="text" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit</label><input type="text" value={form.unit || ''} onChange={e => setForm({ ...form, unit: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit Price</label><input type="text" value={formatCurrency(form.unitPrice)} onChange={e => setForm({ ...form, unitPrice: parseCurrency(e.target.value) })} className={inputCls} placeholder="0.00" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Total</label><input type="text" readOnly value={fmt((form.quantity || 0) * (form.unitPrice || 0))} className={`${inputCls} bg-gray-100`} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>PO Number</label><input type="text" value={form.poNumber || ''} onChange={e => setForm({ ...form, poNumber: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Order Date</label><input type="date" value={form.orderDate || ''} onChange={e => setForm({ ...form, orderDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Expected Delivery</label><input type="date" value={form.expectedDate || ''} onChange={e => setForm({ ...form, expectedDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Delivered Date</label><input type="date" value={form.deliveredDate || ''} onChange={e => setForm({ ...form, deliveredDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { materials: proj.materials.map(m => m.id === sel.id ? { ...form, id: sel.id } : m) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
