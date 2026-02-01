import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Users, DollarSign, Building2, Phone, Mail, X, ChevronDown, Edit2, CreditCard, Banknote, Building, Wallet, Home, FolderKanban, Search, Moon, Sun, UserPlus, Briefcase, Landmark, Globe, FileText, MessageSquare, GripVertical, User, Clock, CheckCircle, XCircle, AlertCircle, Percent, Calendar, Hash, TrendingUp, TrendingDown, Package, MapPin, Truck, Menu, Cloud, Check, Star } from 'lucide-react';

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
const SELECTION_CATEGORIES = ['Flooring', 'Cabinets', 'Countertops', 'Lighting', 'Plumbing Fixtures', 'Paint Colors', 'Appliances', 'Tile', 'Hardware', 'Windows/Doors', 'Exterior', 'Landscaping', 'Other'];
const ROOMS = ['Kitchen', 'Living Room', 'Dining Room', 'Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Master Bathroom', 'Hall Bathroom', 'Powder Room', 'Laundry', 'Garage', 'Exterior', 'Interior', 'Other'];
const WEATHER_OPTIONS = ['sunny', 'cloudy', 'partly-cloudy', 'rainy', 'stormy', 'snowy', 'windy'];
const RFI_STATUSES = ['draft', 'open', 'answered', 'closed'];
const SUBMITTAL_STATUSES = ['draft', 'pending', 'approved', 'revise', 'rejected'];
const PUNCH_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

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

// Format with commas as you type (no forced decimals)
const formatWithCommas = (value) => {
  if (!value && value !== 0) return '';
  const str = String(value).replace(/[^0-9.]/g, '');
  if (!str) return '';
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
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
  // Pre-Construction
  { phase: "Pre-Construction", task: "Research zoning, sqft, easements", days: 3, trade: null },
  { phase: "Pre-Construction", task: "Buy lot", days: 1, trade: null },
  { phase: "Pre-Construction", task: "Get survey", days: 5, trade: 'Surveyor' },
  { phase: "Pre-Construction", task: "Take setbacks to architect", days: 2, trade: null },
  { phase: "Pre-Construction", task: "Get plans drawn", days: 21, trade: 'Architect' },
  // Permits
  { phase: "Permits", task: "Submit plans / pull permit", days: 2, trade: null },
  { phase: "Permits", task: "Permit issued / payment", days: 1, trade: null },
  { phase: "Permits", task: "Builders risk insurance", days: 2, trade: null },
  // Site Prep
  { phase: "Site Prep", task: "Set temp pole", days: 2, trade: 'Electrical' },
  { phase: "Site Prep", task: "Clear lot", days: 3, trade: 'Excavation' },
  { phase: "Site Prep", task: "Order dumpster & potty", days: 1, trade: null },
  // Foundation
  { phase: "Foundation", task: "Foundation markings", days: 1, trade: 'Foundation' },
  { phase: "Foundation", task: "Confirm markings", days: 1, trade: null },
  { phase: "Foundation", task: "Dig footings", days: 2, trade: 'Foundation' },
  { phase: "Foundation", task: "⚠️ Footings inspection", days: 1, inspection: true, trade: null },
  { phase: "Foundation", task: "Order blocks, sand, mortar", days: 1, trade: null },
  { phase: "Foundation", task: "Pour footings (cure 7 days)", days: 8, trade: 'Concrete' },
  { phase: "Foundation", task: "Rebar / schedule concrete", days: 2, trade: null },
  { phase: "Foundation", task: "Lay concrete blocks (cure 7 days)", days: 10, trade: 'Foundation' },
  { phase: "Foundation", task: "Backfill", days: 2, trade: 'Concrete' },
  { phase: "Foundation", task: "Plumber rough-ins", days: 2, trade: 'Plumbing' },
  { phase: "Foundation", task: "Electrical floor outlets (if needed)", days: 1, trade: 'Electrical' },
  { phase: "Foundation", task: "⚠️ Plumbing inspection", days: 1, inspection: true, trade: null },
  { phase: "Foundation", task: "Tamp dirt / lay plastic & wiremesh", days: 2, trade: 'Concrete' },
  { phase: "Foundation", task: "⚠️ Pre-pour slab inspection", days: 1, inspection: true, trade: null },
  { phase: "Foundation", task: "Pour slab", days: 2, trade: 'Concrete' },
  { phase: "Foundation", task: "Concrete cure (7 days)", days: 7, trade: null },
  // Framing
  { phase: "Framing", task: "Framing (framer orders materials)", days: 14, trade: 'Framing' },
  { phase: "Framing", task: "Install doors & windows", days: 2, trade: 'Framing' },
  { phase: "Framing", task: "⚠️ Framing inspection", days: 1, inspection: true, trade: null },
  // Exterior
  { phase: "Exterior", task: "Brick measure & quote", days: 2, trade: 'Masonry' },
  { phase: "Exterior", task: "Lay brick", days: 7, trade: 'Masonry' },
  { phase: "Exterior", task: "Soffit & fascia", days: 2, trade: 'Siding' },
  { phase: "Exterior", task: "Roofing measure & order", days: 3, trade: 'Roofing' },
  { phase: "Exterior", task: "Install roofing", days: 3, trade: 'Roofing' },
  { phase: "Exterior", task: "Mailbox", days: 1, trade: 'Masonry' },
  // Rough-Ins
  { phase: "Rough-Ins", task: "HVAC rough-ins", days: 3, trade: 'HVAC' },
  { phase: "Rough-Ins", task: "⚠️ HVAC inspection", days: 1, inspection: true, trade: null },
  { phase: "Rough-Ins", task: "Plumbing top outs / order tubs & faucets", days: 2, trade: 'Plumbing' },
  { phase: "Rough-Ins", task: "⚠️ Plumbing top out inspection", days: 1, inspection: true, trade: null },
  { phase: "Rough-Ins", task: "Electrical rough-ins", days: 3, trade: 'Electrical' },
  { phase: "Rough-Ins", task: "⚠️ Electrical inspection", days: 1, inspection: true, trade: null },
  // Insulation
  { phase: "Insulation", task: "Concrete stain (if applicable)", days: 2, trade: 'Concrete' },
  { phase: "Insulation", task: "Spray insulation", days: 2, trade: 'Insulation' },
  // Drywall
  { phase: "Drywall", task: "Drywall measure & order", days: 2, trade: 'Drywall' },
  { phase: "Drywall", task: "Hang drywall", days: 5, trade: 'Drywall' },
  { phase: "Drywall", task: "Finish drywall (tape, mud, sand)", days: 5, trade: 'Drywall' },
  // Finishes
  { phase: "Finishes", task: "Flooring", days: 4, trade: 'Flooring' },
  { phase: "Finishes", task: "Paint quote", days: 1, trade: 'Painting' },
  { phase: "Finishes", task: "Paint", days: 6, trade: 'Painting' },
  { phase: "Finishes", task: "HVAC top outs / trim", days: 2, trade: 'HVAC' },
  { phase: "Finishes", task: "Electrical final (fixtures, switches)", days: 2, trade: 'Electrical' },
  { phase: "Finishes", task: "Trim quote & order", days: 2, trade: 'Trim' },
  { phase: "Finishes", task: "Install trim", days: 3, trade: 'Trim' },
  { phase: "Finishes", task: "Cabinets quote", days: 2, trade: 'Cabinets' },
  { phase: "Finishes", task: "Install cabinets", days: 2, trade: 'Cabinets' },
  { phase: "Finishes", task: "Countertops quote & install", days: 5, trade: 'Countertops' },
  { phase: "Finishes", task: "Plumber fixtures (toilets, sinks, tie-in)", days: 2, trade: 'Plumbing' },
  { phase: "Finishes", task: "Paint trim / touchups", days: 2, trade: 'Painting' },
  // Final
  { phase: "Final", task: "Driveway", days: 3, trade: 'Concrete' },
  { phase: "Final", task: "Garage door", days: 1, trade: 'Garage Door' },
  { phase: "Final", task: "Gutters", days: 1, trade: 'Gutters' },
  { phase: "Final", task: "Appliances install", days: 1, trade: null },
  { phase: "Final", task: "Sod / landscaping", days: 2, trade: 'Landscaping' },
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
  const [projContractorSearch, setProjContractorSearch] = useState('');
  const [projContractorTradeFilter, setProjContractorTradeFilter] = useState('all');
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
  const [tradeDropdownOpen, setTradeDropdownOpen] = useState(false);
  const [supplierCatDropdownOpen, setSupplierCatDropdownOpen] = useState(false);
  
  // Dashboard state
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard-todos');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Call city about permit status', done: false, notes: '' },
        { id: 2, text: 'Get survey back from NEA Surveying', done: true, notes: 'John said it will be ready by Friday' },
        { id: 3, text: 'Order drywall materials', done: false, notes: '' },
      ];
    } catch { return []; }
  });
  const [expandedTodo, setExpandedTodo] = useState(null);
  const [notepad, setNotepad] = useState(() => {
    try { return localStorage.getItem('dashboard-notepad') || ''; } catch { return ''; }
  });
  const [newTodo, setNewTodo] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherView, setWeatherView] = useState('future'); // 'future' or 'past'
  const [weatherLocation, setWeatherLocation] = useState(() => {
    try { return localStorage.getItem('weather-location') || 'Jonesboro, AR'; } catch { return 'Jonesboro, AR'; }
  });
  const [weatherCoords, setWeatherCoords] = useState(() => {
    try {
      const saved = localStorage.getItem('weather-coords');
      return saved ? JSON.parse(saved) : { lat: 35.8423, lon: -90.7043 };
    } catch { return { lat: 35.8423, lon: -90.7043 }; }
  });
  
  // Save todos and notepad to localStorage
  useEffect(() => { try { localStorage.setItem('dashboard-todos', JSON.stringify(todos)); } catch {} }, [todos]);
  useEffect(() => { try { localStorage.setItem('dashboard-notepad', notepad); } catch {} }, [notepad]);
  
  // Fetch weather from Open-Meteo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { lat, lon } = weatherCoords;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&past_days=10&forecast_days=10&timezone=America/Chicago`);
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.error('Weather fetch failed:', e);
      }
    };
    fetchWeather();
  }, [weatherCoords]);

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
  
  // CRM - Contacts & Conversations
  const [crmContacts, setCrmContacts] = useState([
    { id: 1, name: 'John & Mary Smith', phone: '(870) 555-2001', email: 'smithfamily@email.com', role: 'Client', projectIds: [1], tags: ['VIP'], notes: 'Building their dream home, very involved in process', starred: false },
    { id: 2, name: 'Tom Reynolds', phone: '(870) 555-2002', email: 'tom.r@email.com', role: 'Inspector', projectIds: [], tags: ['responsive'], notes: 'County building inspector, usually available mornings', starred: true },
    { id: 3, name: 'Sarah Johnson', phone: '(870) 555-2003', email: 'sarah.j@realtor.com', role: 'Realtor', projectIds: [1], tags: [], notes: 'Referred the Smith project', starred: false },
  ]);
  const [messages, setMessages] = useState([
    // Thread with John & Mary Smith
    { id: 1, contactId: 1, type: 'text', direction: 'inbound', content: 'Hi, just wanted to check on the cabinet timeline?', timestamp: '2025-01-28T14:30:00' },
    { id: 2, contactId: 1, type: 'text', direction: 'outbound', content: 'Hey! Cabinets are scheduled for delivery next Tuesday. Install will be Wed-Fri.', timestamp: '2025-01-28T14:35:00' },
    { id: 3, contactId: 1, type: 'text', direction: 'inbound', content: 'Perfect, thanks for the update!', timestamp: '2025-01-28T14:36:00' },
    { id: 4, contactId: 1, type: 'call', direction: 'outbound', content: 'Discussed cabinet selections - they want white shaker style', timestamp: '2025-01-28T10:30:00', duration: '5 min' },
    { id: 5, contactId: 1, type: 'text', direction: 'outbound', content: 'Following up on our call - I\'ve ordered the white shaker cabinets. Will send tracking once shipped.', timestamp: '2025-01-29T09:00:00' },
    { id: 6, contactId: 1, type: 'text', direction: 'inbound', content: 'Great! Also, can we add under-cabinet lighting?', timestamp: '2025-01-29T11:20:00' },
    { id: 7, contactId: 1, type: 'text', direction: 'outbound', content: 'Absolutely, I\'ll get a quote from the electrician today.', timestamp: '2025-01-29T11:25:00' },
    // Thread with Tom Reynolds
    { id: 8, contactId: 2, type: 'call', direction: 'inbound', content: 'Called to schedule framing inspection for Thursday', timestamp: '2025-01-27T14:15:00', duration: '3 min' },
    { id: 9, contactId: 2, type: 'text', direction: 'outbound', content: 'Hi Tom, confirming framing inspection Thursday 9am at 123 Main St', timestamp: '2025-01-27T14:30:00' },
    { id: 10, contactId: 2, type: 'text', direction: 'inbound', content: 'Confirmed. See you then.', timestamp: '2025-01-27T15:00:00' },
    // Thread with Sarah Johnson
    { id: 11, contactId: 3, type: 'email', direction: 'outbound', content: 'Sent progress photos and update on completion timeline', timestamp: '2025-01-25T09:00:00' },
    { id: 12, contactId: 3, type: 'email', direction: 'inbound', content: 'Thanks! The Smiths are thrilled with the progress. They mentioned wanting to do a walkthrough next week if possible.', timestamp: '2025-01-25T14:30:00' },
  ]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showContactPanel, setShowContactPanel] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [newMessageType, setNewMessageType] = useState('text');
  const [inboxFilter, setInboxFilter] = useState('all'); // all, unread, starred
  const [contactSearch, setContactSearch] = useState('');
  const [contactRoleFilter, setContactRoleFilter] = useState('all');
  const [contactProjectFilter, setContactProjectFilter] = useState('all');
  const [convoSearch, setConvoSearch] = useState('');
  const [convoProjectFilter, setConvoProjectFilter] = useState('all');
  
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
        budget: t.trade === 'Foundation' ? 8500 : t.trade === 'Framing' ? 18000 : t.trade === 'Roofing' ? 12000 : t.trade === 'Electrical' ? 7500 : t.trade === 'Plumbing' ? 9000 : t.trade === 'HVAC' ? 8000 : t.trade === 'Insulation' ? 3500 : t.trade === 'Drywall' ? 6000 : t.trade === 'Flooring' ? 8500 : t.trade === 'Painting' ? 4500 : t.trade === 'Cabinets' ? 12000 : t.trade === 'Countertops' ? 5000 : t.trade === 'Landscaping' ? 6000 : 0,
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
      { id: 1, contractorId: 4, trade: 'Plumbing', description: 'Full rough-in and fixtures', amount: 9500, date: '2025-01-10', status: 'pending', notes: 'Includes all fixtures', taskId: 14 },
      { id: 2, contractorId: null, trade: 'HVAC', description: '3-ton system install', amount: 8200, date: '2025-01-08', status: 'accepted', notes: 'From HVAC Solutions', vendorName: 'HVAC Solutions', taskId: 13 },
      { id: 3, contractorId: 2, trade: 'Framing', description: 'Complete framing package', amount: 18500, date: '2025-01-05', status: 'accepted', notes: 'Includes trusses', taskId: 6 },
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
      { id: 1, date: '2025-01-12', vendor: 'Home Depot', amount: 1250, category: 'Materials', description: 'Framing lumber', fileName: 'receipt-001.pdf', taskId: 6 },
      { id: 2, date: '2025-01-18', vendor: 'City of Jonesboro', amount: 450, category: 'Permits', description: 'Building permit fee', fileName: 'permit-receipt.pdf', taskId: null },
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
    // Daily Logs
    dailyLogs: [
      { id: 1, date: '2025-01-20', weather: 'sunny', tempHigh: 52, tempLow: 38, 
        workPerformed: 'Completed foundation wall forms. Scheduled concrete pour for tomorrow.',
        workers: [{ name: 'Mike (Foundation)', hours: 8 }, { name: 'Helper 1', hours: 8 }, { name: 'Helper 2', hours: 6 }],
        deliveries: [{ item: 'Rebar bundle', vendor: "Barton's Lumber", quantity: '2 tons' }],
        visitors: [{ name: 'Building Inspector', purpose: 'Foundation inspection', time: '10:00 AM' }],
        delays: '',
        safety: 'All workers wore PPE. No incidents.',
        photos: ['foundation-forms.jpg'],
        notes: 'Inspector approved foundation. Ready for pour.'
      },
      { id: 2, date: '2025-01-21', weather: 'cloudy', tempHigh: 48, tempLow: 35,
        workPerformed: 'Poured foundation walls. 18 yards of concrete delivered.',
        workers: [{ name: 'Mike (Foundation)', hours: 10 }, { name: 'Concrete crew', hours: 8 }],
        deliveries: [{ item: 'Concrete', vendor: 'Ready Mix Inc', quantity: '18 yards' }],
        visitors: [],
        delays: 'Started 1 hour late due to concrete truck delay',
        safety: 'All workers wore PPE. No incidents.',
        photos: ['foundation-pour-1.jpg', 'foundation-pour-2.jpg'],
        notes: 'Pour completed by 4pm. Will strip forms in 3 days.'
      },
    ],
    // Punch List
    punchList: [
      { id: 1, item: 'Touch up paint - master bedroom corner', location: 'Master Bedroom', assignedTo: 13, status: 'open', priority: 'low', dueDate: '2025-04-01', photos: [], createdAt: '2025-03-25', completedAt: null, notes: 'Small scuff from moving furniture' },
      { id: 2, item: 'Adjust cabinet door alignment', location: 'Kitchen', assignedTo: 14, status: 'in_progress', priority: 'medium', dueDate: '2025-03-28', photos: [], createdAt: '2025-03-24', completedAt: null, notes: 'Upper cabinet doors not level' },
      { id: 3, item: 'Fix slow drain - bathroom sink', location: 'Hall Bathroom', assignedTo: 4, status: 'complete', priority: 'high', dueDate: '2025-03-26', photos: [], createdAt: '2025-03-23', completedAt: '2025-03-25', notes: 'Cleared P-trap blockage' },
    ],
    // RFIs (Requests for Information)
    rfis: [
      { id: 1, number: 'RFI-001', subject: 'Window header size clarification', question: 'Plans show 4x10 header for 6ft window opening. Standard practice is 4x12. Please clarify.', 
        submittedBy: 'Preston', submittedTo: 'Architect', submittedDate: '2025-01-15', dueDate: '2025-01-22',
        response: 'Use 4x12 header as noted. Plans will be updated in next revision.', respondedBy: 'John Smith (Architect)', respondedDate: '2025-01-18',
        status: 'closed', costImpact: 150, scheduleImpact: '0 days', attachments: [], linkedDrawing: 'A-201', notes: '' },
      { id: 2, number: 'RFI-002', subject: 'Electrical panel location', question: 'Plans show panel in garage but homeowner requests it in utility room. Can we relocate?',
        submittedBy: 'Preston', submittedTo: 'Architect', submittedDate: '2025-01-20', dueDate: '2025-01-27',
        response: '', respondedBy: '', respondedDate: null,
        status: 'open', costImpact: null, scheduleImpact: '', attachments: [], linkedDrawing: 'E-101', notes: 'Waiting on architect response' },
    ],
    // Submittals
    submittals: [
      { id: 1, number: 'SUB-001', title: 'Roofing Shingles', specSection: '07310', description: 'GAF Timberline HDZ Architectural Shingles - Charcoal',
        submittedBy: 'Preston', submittedTo: 'Architect', submittedDate: '2025-01-10', dueDate: '2025-01-17',
        status: 'approved', reviewedBy: 'John Smith', reviewedDate: '2025-01-14', reviewNotes: 'Approved as submitted',
        attachments: ['gaf-spec-sheet.pdf'], linkedSpec: '07310', contractorId: 10, notes: '' },
      { id: 2, number: 'SUB-002', title: 'Kitchen Cabinets', specSection: '06400', description: 'Kraft Maid - Durham Maple White',
        submittedBy: 'Preston', submittedTo: 'Architect', submittedDate: '2025-01-18', dueDate: '2025-01-25',
        status: 'revise', reviewedBy: 'John Smith', reviewedDate: '2025-01-22', reviewNotes: 'Please provide shop drawings with dimensions',
        attachments: ['cabinet-cut-sheet.pdf'], linkedSpec: '06400', contractorId: 14, notes: 'Need to get shop drawings from supplier' },
      { id: 3, number: 'SUB-003', title: 'HVAC Equipment', specSection: '23800', description: 'Carrier 3-ton heat pump system',
        submittedBy: 'Preston', submittedTo: 'Engineer', submittedDate: '2025-01-22', dueDate: '2025-01-29',
        status: 'pending', reviewedBy: '', reviewedDate: null, reviewNotes: '',
        attachments: ['carrier-spec.pdf'], linkedSpec: '23800', contractorId: 5, notes: '' },
    ],
    // Client Selections
    selections: [
      { id: 1, category: 'Flooring', room: 'Living Room', item: 'Hardwood - Oak Natural', allowance: 3500, actualCost: 3200, 
        status: 'approved', selectedDate: '2025-01-12', approvedDate: '2025-01-13', approvedBy: 'Mary Smith',
        vendor: 'Floor & Decor', sku: 'OAK-NAT-5', leadTime: '2 weeks', notes: 'Client loved the sample', photos: [], specs: '' },
      { id: 2, category: 'Flooring', room: 'Bedrooms', item: 'Carpet - Plush Gray', allowance: 2000, actualCost: 1850,
        status: 'approved', selectedDate: '2025-01-15', approvedDate: '2025-01-15', approvedBy: 'John Smith',
        vendor: 'Carpet World', sku: 'PLG-2847', leadTime: '1 week', notes: '', photos: [], specs: '' },
      { id: 3, category: 'Cabinets', room: 'Kitchen', item: '', allowance: 8000, actualCost: null,
        status: 'pending', selectedDate: null, approvedDate: null, approvedBy: null,
        vendor: '', sku: '', leadTime: '', notes: 'Client reviewing options', photos: [], specs: '', dueDate: '2025-02-01' },
      { id: 4, category: 'Countertops', room: 'Kitchen', item: 'Granite - Luna Pearl', allowance: 3000, actualCost: 4200,
        status: 'approved', selectedDate: '2025-01-20', approvedDate: '2025-01-21', approvedBy: 'Mary Smith',
        vendor: 'Stone Center', sku: 'LP-3CM', leadTime: '3 weeks', notes: 'Upgrade from laminate - client paying difference', photos: [], specs: '', overage: 1200 },
      { id: 5, category: 'Lighting', room: 'Kitchen', item: '', allowance: 1500, actualCost: null,
        status: 'pending', selectedDate: null, approvedDate: null, approvedBy: null,
        vendor: '', sku: '', leadTime: '', notes: '', photos: [], specs: '', dueDate: '2025-02-15' },
      { id: 6, category: 'Paint Colors', room: 'Interior', item: 'Sherwin Williams - Agreeable Gray', allowance: 0, actualCost: 0,
        status: 'approved', selectedDate: '2025-01-10', approvedDate: '2025-01-10', approvedBy: 'Mary Smith',
        vendor: 'Sherwin Williams', sku: 'SW 7029', leadTime: '', notes: 'All interior walls', photos: [], specs: '' },
      { id: 7, category: 'Appliances', room: 'Kitchen', item: '', allowance: 5000, actualCost: null,
        status: 'pending', selectedDate: null, approvedDate: null, approvedBy: null,
        vendor: '', sku: '', leadTime: '', notes: 'Client wants stainless steel package', photos: [], specs: '', dueDate: '2025-02-28' },
    ],
    // Warranty Items
    warranties: [
      { id: 1, item: 'Roofing - Shingles', manufacturer: 'GAF', warrantyType: 'Limited Lifetime', startDate: '2025-03-15', duration: 'Lifetime', 
        coverage: 'Material defects, wind damage up to 130mph', registrationNumber: 'GAF-2025-12345',
        contactPhone: '1-800-766-3411', contactEmail: 'warranty@gaf.com', documents: ['gaf-warranty.pdf'],
        notes: 'Registered online', expirationDate: null },
      { id: 2, item: 'HVAC System', manufacturer: 'Carrier', warrantyType: '10 Year Parts', startDate: '2025-03-20', duration: '10 years',
        coverage: 'All parts and compressor', registrationNumber: 'CR-2025-98765',
        contactPhone: '1-800-227-7437', contactEmail: 'support@carrier.com', documents: ['carrier-warranty.pdf'],
        notes: 'Must maintain annually to keep warranty valid', expirationDate: '2035-03-20' },
      { id: 3, item: 'Appliances - Refrigerator', manufacturer: 'Samsung', warrantyType: '1 Year Full', startDate: '2025-04-01', duration: '1 year',
        coverage: 'Parts and labor', registrationNumber: '',
        contactPhone: '1-800-726-7864', contactEmail: '', documents: [],
        notes: 'Need to register', expirationDate: '2026-04-01' },
    ],
    // Time Entries
    timeEntries: [
      { id: 1, date: '2025-01-20', workerId: null, workerName: 'Preston', hours: 4, taskId: null, phase: 'Foundation', description: 'Site supervision, met with inspector', billable: false, rate: 0 },
      { id: 2, date: '2025-01-20', workerId: null, workerName: 'Mike (Foundation)', hours: 8, taskId: 5, phase: 'Foundation', description: 'Foundation wall forms', billable: true, rate: 45 },
      { id: 3, date: '2025-01-21', workerId: null, workerName: 'Mike (Foundation)', hours: 10, taskId: 5, phase: 'Foundation', description: 'Foundation pour', billable: true, rate: 45 },
    ],
    // Equipment on Site
    equipment: [
      { id: 1, name: 'Excavator - CAT 308', type: 'Heavy Equipment', status: 'on_site', checkedOutDate: '2025-01-08', checkedOutBy: 'Mike', expectedReturn: '2025-01-15', actualReturn: '2025-01-14', ownerType: 'rental', rentalCompany: 'Sunbelt Rentals', dailyRate: 450, notes: 'Returned on time' },
      { id: 2, name: 'Concrete Pump Trailer', type: 'Heavy Equipment', status: 'returned', checkedOutDate: '2025-01-21', checkedOutBy: 'Ready Mix', expectedReturn: '2025-01-21', actualReturn: '2025-01-21', ownerType: 'vendor', rentalCompany: '', dailyRate: 0, notes: 'Included with concrete delivery' },
      { id: 3, name: 'Generator 7500W', type: 'Power Equipment', status: 'on_site', checkedOutDate: '2025-01-06', checkedOutBy: 'Preston', expectedReturn: null, actualReturn: null, ownerType: 'owned', rentalCompany: '', dailyRate: 0, notes: 'Company owned' },
      { id: 4, name: 'Scaffolding Set (10 sections)', type: 'Scaffolding', status: 'reserved', checkedOutDate: null, checkedOutBy: '', expectedReturn: null, actualReturn: null, ownerType: 'rental', rentalCompany: 'Sunbelt Rentals', dailyRate: 85, notes: 'Reserved for framing phase', reservedFor: '2025-02-01' },
    ],
    // Meeting Minutes
    meetings: [
      { id: 1, date: '2025-01-08', time: '10:00 AM', type: 'Pre-Construction', location: 'Jobsite', 
        attendees: ['Preston', 'John Smith (Client)', 'Mary Smith (Client)', 'Mike (Foundation)'],
        agenda: ['Review timeline', 'Discuss foundation options', 'Material selections timeline'],
        minutes: 'Reviewed project timeline with clients. Foundation work to begin next week. Clients reminded to make cabinet selections by Feb 1.',
        actionItems: [
          { item: 'Send updated schedule to clients', assignedTo: 'Preston', dueDate: '2025-01-09', status: 'complete' },
          { item: 'Get foundation bid from secondary contractor', assignedTo: 'Preston', dueDate: '2025-01-10', status: 'complete' },
          { item: 'Select kitchen cabinets', assignedTo: 'Mary Smith', dueDate: '2025-02-01', status: 'pending' },
        ],
        attachments: [],
        notes: 'Clients very excited about the project start.'
      },
      { id: 2, date: '2025-01-22', time: '3:00 PM', type: 'Progress Meeting', location: 'Jobsite',
        attendees: ['Preston', 'Mike (Foundation)', 'Building Inspector'],
        agenda: ['Foundation inspection', 'Review punch items', 'Schedule next phase'],
        minutes: 'Foundation passed inspection. Minor honeycomb on east wall to be addressed. Framing to begin next week pending lumber delivery.',
        actionItems: [
          { item: 'Patch honeycomb on foundation', assignedTo: 'Mike (Foundation)', dueDate: '2025-01-24', status: 'complete' },
          { item: 'Confirm lumber delivery date', assignedTo: 'Preston', dueDate: '2025-01-23', status: 'complete' },
        ],
        attachments: ['inspection-report.pdf'],
        notes: 'Inspector pleased with work quality.'
      },
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
  const selectCls = `${inputCls} pr-10 appearance-none bg-no-repeat bg-[length:16px_16px] bg-[position:right_12px_center] ${dark ? "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]" : "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]"}`;
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
          {[{ id: 'dashboard', icon: Home, label: 'Dashboard' }, { id: 'projects', icon: FolderKanban, label: 'Projects' }, { id: 'contacts', icon: UserPlus, label: 'Contacts' }, { id: 'conversations', icon: MessageSquare, label: 'Conversations' }, { id: 'contractors', icon: Briefcase, label: 'Contractors' }, { id: 'suppliers', icon: Package, label: 'Suppliers' }, { id: 'jurisdictions', icon: Landmark, label: 'Jurisdictions' }, { id: 'phases', icon: FileText, label: 'Phases' }, { id: 'team', icon: Users, label: 'Team' }].map(i => (
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
            <div className="mb-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div><h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Dashboard</h1><p className={muted}>Welcome back, {user.name}</p></div>
              <button onClick={() => { setForm({ financing: { type: 'loan' }, costs: {} }); setModal('addProject'); }} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" />New Project</button>
            </div>
            
            {/* Weather + To-Do Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Weather Section - Compact 7 Day */}
              <div className={`${card} rounded-xl border ${border} overflow-hidden`}>
                <div className={`px-4 py-3 flex justify-between items-center border-b ${border} ${dark ? 'bg-gradient-to-r from-slate-700 to-slate-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                  <div className="flex items-center gap-2">
                    <Cloud className={`w-4 h-4 ${dark ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`font-semibold text-sm ${text}`}>{weatherLocation}</span>
                    <button onClick={() => {
                      const loc = prompt('Enter city, state (e.g., "Dallas, TX"):', weatherLocation);
                      if (loc) {
                        setWeatherLocation(loc);
                        try { localStorage.setItem('weather-location', loc); } catch {}
                        const coords = {
                          'jonesboro, ar': { lat: 35.8423, lon: -90.7043 },
                          'dallas, tx': { lat: 32.7767, lon: -96.7970 },
                          'little rock, ar': { lat: 34.7465, lon: -92.2896 },
                          'memphis, tn': { lat: 35.1495, lon: -90.0490 },
                          'fayetteville, ar': { lat: 36.0626, lon: -94.1574 },
                          'tulsa, ok': { lat: 36.1540, lon: -95.9928 },
                          'oklahoma city, ok': { lat: 35.4676, lon: -97.5164 },
                          'springfield, mo': { lat: 37.2090, lon: -93.2923 },
                          'fort smith, ar': { lat: 35.3859, lon: -94.3985 },
                          'paragould, ar': { lat: 36.0584, lon: -90.5132 },
                        }[loc.toLowerCase()] || weatherCoords;
                        setWeatherCoords(coords);
                        try { localStorage.setItem('weather-coords', JSON.stringify(coords)); } catch {}
                      }
                    }} className={`text-xs ${muted} hover:text-blue-500`}><Edit2 className="w-3 h-3" /></button>
                  </div>
                  <div className={`inline-flex rounded-md ${dark ? 'bg-slate-600' : 'bg-white shadow-sm'} p-0.5`}>
                    <button onClick={() => setWeatherView('past')} className={`px-2 py-1 text-xs font-medium rounded transition ${weatherView === 'past' ? (dark ? 'bg-slate-500 text-white' : 'bg-blue-600 text-white') : muted}`}>Past</button>
                    <button onClick={() => setWeatherView('future')} className={`px-2 py-1 text-xs font-medium rounded transition ${weatherView === 'future' ? (dark ? 'bg-slate-500 text-white' : 'bg-blue-600 text-white') : muted}`}>Forecast</button>
                  </div>
                </div>
                
                {weather?.daily?.time ? (
                  <div className="grid grid-cols-7 divide-x ${border}">
                    {(() => {
                      const days = weather.daily.time || [];
                      const highs = weather.daily.temperature_2m_max || [];
                      const lows = weather.daily.temperature_2m_min || [];
                      const codes = weather.daily.weathercode || [];
                      const precip = weather.daily.precipitation_probability_max || [];
                      
                      if (days.length === 0) return <div className={`col-span-7 p-4 text-center ${muted}`}>No data</div>;
                      
                      const getWeatherIcon = (code) => {
                        if (code === 0) return '☀️';
                        if (code <= 3) return '⛅';
                        if (code <= 48) return '☁️';
                        if (code <= 67) return '🌧️';
                        if (code <= 77) return '🌨️';
                        if (code <= 82) return '🌧️';
                        if (code <= 86) return '🌨️';
                        return '⛈️';
                      };
                      
                      const today = new Date().toISOString().split('T')[0];
                      let todayIdx = days.findIndex(d => d === today);
                      if (todayIdx === -1) todayIdx = Math.floor(days.length / 2);
                      
                      let displayDays = weatherView === 'past' 
                        ? days.slice(Math.max(0, todayIdx - 6), todayIdx + 1).reverse() 
                        : days.slice(todayIdx, todayIdx + 7);
                      
                      return displayDays.map((day) => {
                        const idx = days.indexOf(day);
                        const icon = getWeatherIcon(codes[idx] || 0);
                        const isToday = day === today;
                        const date = new Date(day + 'T12:00:00');
                        const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                        const high = Math.round(highs[idx] || 0);
                        const low = Math.round(lows[idx] || 0);
                        const rain = precip[idx] || 0;
                        
                        return (
                          <div key={day} className={`flex flex-col items-center py-3 px-1 ${isToday ? (dark ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}>
                            <span className={`text-[10px] font-semibold ${isToday ? 'text-blue-600' : muted}`}>{dayName}</span>
                            <span className="text-xl my-1">{icon}</span>
                            <span className={`text-sm font-bold ${text}`}>{high}°</span>
                            <span className={`text-[10px] ${muted}`}>{low}°</span>
                            {rain > 30 && <span className="text-[9px] text-blue-500">💧{rain}%</span>}
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${muted}`}>Loading...</div>
                )}
              </div>
              
              {/* To-Do List */}
              <div className={`${card} rounded-xl border ${border}`}>
                <div className={`px-4 py-3 border-b ${border} flex justify-between items-center`}>
                  <h3 className={`font-semibold text-sm ${text} flex items-center gap-2`}><CheckCircle className="w-4 h-4 text-emerald-500" />To-Do List</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${muted}`}>{todos.filter(t => t.done).length}/{todos.length}</span>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {todos.map(todo => (
                    <div key={todo.id} className={`border-b ${border} last:border-b-0`}>
                      <div className={`flex items-center gap-3 px-4 py-2 ${dark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} group cursor-pointer`} onClick={() => setExpandedTodo(expandedTodo === todo.id ? null : todo.id)}>
                        <button onClick={e => { e.stopPropagation(); setTodos(todos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t)); }} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${todo.done ? 'bg-emerald-500 border-emerald-500' : `${border} hover:border-emerald-400`}`}>
                          {todo.done && <Check className="w-2.5 h-2.5 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm ${todo.done ? `line-through ${muted}` : text}`}>{todo.text}</span>
                          {todo.notes && expandedTodo !== todo.id && <span className={`text-xs ${muted} ml-1`}>📝</span>}
                        </div>
                        <ChevronRight className={`w-3 h-3 ${muted} transition-transform ${expandedTodo === todo.id ? 'rotate-90' : ''}`} />
                        <button onClick={e => { e.stopPropagation(); setTodos(todos.filter(t => t.id !== todo.id)); }} className={`p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50`}><X className="w-3 h-3 text-red-500" /></button>
                      </div>
                      {expandedTodo === todo.id && (
                        <div className={`px-4 pb-2 ${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                          <textarea 
                            value={todo.notes || ''} 
                            onChange={e => setTodos(todos.map(t => t.id === todo.id ? { ...t, notes: e.target.value } : t))}
                            placeholder="Add notes..."
                            className={`${inputCls} text-xs h-16 resize-none`}
                            onClick={e => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {todos.length === 0 && <p className={`text-sm ${muted} text-center py-4`}>No tasks yet</p>}
                </div>
                <div className={`px-3 py-2 border-t ${border} flex gap-2`}>
                  <input 
                    type="text" 
                    value={newTodo} 
                    onChange={e => setNewTodo(e.target.value)} 
                    onKeyDown={e => { 
                      if (e.key === 'Enter' && newTodo.trim()) { 
                        setTodos([...todos, { id: Date.now(), text: newTodo.trim(), done: false, notes: '' }]); 
                        setNewTodo(''); 
                      } 
                    }}
                    placeholder="Add a task..." 
                    className={`${inputCls} flex-1 py-1.5 text-sm`} 
                  />
                  <button 
                    onClick={() => { if (newTodo.trim()) { setTodos([...todos, { id: Date.now(), text: newTodo.trim(), done: false, notes: '' }]); setNewTodo(''); }}}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Notepad - Full Width */}
            <div className={`${card} rounded-xl border ${border}`}>
              <div className={`px-4 py-3 border-b ${border} flex justify-between items-center`}>
                <h3 className={`font-semibold text-sm ${text} flex items-center gap-2`}><FileText className="w-4 h-4 text-amber-500" />Notepad</h3>
                {notepad && <button onClick={() => setNotepad('')} className={`text-xs ${muted} hover:text-red-500`}>Clear</button>}
              </div>
              <div className="p-4">
                <textarea 
                  value={notepad} 
                  onChange={e => setNotepad(e.target.value)} 
                  placeholder="Quick notes, reminders, ideas..."
                  className={`${inputCls} h-[150px] text-sm resize-none`}
                />
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {view === 'contacts' && (() => {
          const filteredContacts = crmContacts.filter(c => {
            const matchesSearch = !contactSearch || 
              c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
              c.phone?.toLowerCase().includes(contactSearch.toLowerCase()) ||
              c.email?.toLowerCase().includes(contactSearch.toLowerCase());
            const matchesRole = contactRoleFilter === 'all' || c.role === contactRoleFilter;
            const matchesProject = contactProjectFilter === 'all' || c.projectIds?.includes(parseInt(contactProjectFilter));
            return matchesSearch && matchesRole && matchesProject;
          });
          const roles = ['Client', 'Inspector', 'Realtor', 'Vendor', 'Subcontractor', 'Lender', 'Other'];
          return (
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h1 className={`text-xl lg:text-2xl font-bold ${text}`}>Contacts</h1>
              <button onClick={() => { setForm({ projectIds: [], tags: [] }); setModal('addContact'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Contact</button>
            </div>
            
            {/* Search & Filters */}
            <div className={`${card} rounded-xl border ${border} p-3 mb-4 flex flex-col lg:flex-row gap-3`}>
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                <input type="text" placeholder="Search contacts..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} className={`${inputCls} pl-9 py-2`} />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select value={contactRoleFilter} onChange={e => setContactRoleFilter(e.target.value)} className={`${selectCls} py-2 w-full sm:w-auto`}>
                  <option value="all">All Roles</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={contactProjectFilter} onChange={e => setContactProjectFilter(e.target.value)} className={`${selectCls} py-2 w-full sm:w-auto`}>
                  <option value="all">All Projects</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredContacts.map(c => (
                <div key={c.id} className={`${card} rounded-xl border ${border} p-4`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`font-semibold ${text}`}>{c.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.role === 'Client' ? 'bg-blue-100 text-blue-700' : c.role === 'Inspector' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{c.role}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setForm(c); setModal('editContact'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                      <button onClick={() => setCrmContacts(crmContacts.filter(x => x.id !== c.id))} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </div>
                  <div className={`text-sm ${muted} space-y-1 mb-3`}>
                    {c.phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{c.phone}</p>}
                    {c.email && <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{c.email}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {c.projectIds?.map(pid => {
                      const proj = projects.find(p => p.id === pid);
                      return proj ? <span key={pid} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{proj.name}</span> : null;
                    })}
                    {c.tags?.map(tag => <span key={tag} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{tag}</span>)}
                  </div>
                  <div className="flex gap-2">
                    {c.phone && <a href={`tel:${c.phone}`} className="flex-1 py-2 text-center text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1"><Phone className="w-3 h-3" />Call</a>}
                    {c.phone && <a href={`sms:${c.phone}`} className="flex-1 py-2 text-center text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1"><MessageSquare className="w-3 h-3" />Text</a>}
                    {c.email && <a href={`mailto:${c.email}`} className="flex-1 py-2 text-center text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center gap-1"><Mail className="w-3 h-3" />Email</a>}
                  </div>
                </div>
              ))}
              {filteredContacts.length === 0 && <div className={`text-center py-8 ${muted}`}><UserPlus className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No contacts found</p></div>}
            </div>
            
            {/* Desktop Table */}
            <div className={`hidden md:block ${card} rounded-xl border ${border} overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Role</th>
                    <th className="text-left px-4 py-3 font-medium">Contact</th>
                    <th className="text-left px-4 py-3 font-medium">Projects</th>
                    <th className="text-left px-4 py-3 font-medium">Tags</th>
                    <th className="text-center px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                  {filteredContacts.map(c => (
                    <tr key={c.id} className={hover}>
                      <td className="px-4 py-3">
                        <p className={`font-medium ${text}`}>{c.name}</p>
                        {c.notes && <p className={`text-xs ${muted} truncate max-w-[200px]`}>{c.notes}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${c.role === 'Client' ? 'bg-blue-100 text-blue-700' : c.role === 'Inspector' ? 'bg-amber-100 text-amber-700' : c.role === 'Realtor' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'}`}>{c.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`text-sm ${muted}`}>
                          {c.phone && <p>{c.phone}</p>}
                          {c.email && <p className="truncate max-w-[180px]">{c.email}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.projectIds?.map(pid => {
                            const proj = projects.find(p => p.id === pid);
                            return proj ? <span key={pid} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{proj.name}</span> : null;
                          })}
                          {(!c.projectIds || c.projectIds.length === 0) && <span className={`text-xs ${muted}`}>—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.tags?.map(tag => <span key={tag} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{tag}</span>)}
                          {(!c.tags || c.tags.length === 0) && <span className={`text-xs ${muted}`}>—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {c.phone && <a href={`tel:${c.phone}`} className="p-1.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700"><Phone className="w-4 h-4" /></a>}
                          {c.phone && <a href={`sms:${c.phone}`} className="p-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"><MessageSquare className="w-4 h-4" /></a>}
                          {c.email && <a href={`mailto:${c.email}`} className="p-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-700"><Mail className="w-4 h-4" /></a>}
                          <button onClick={() => { setForm(c); setModal('editContact'); }} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setCrmContacts(crmContacts.filter(x => x.id !== c.id))} className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredContacts.length === 0 && <div className={`text-center py-12 ${muted}`}><UserPlus className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No contacts found</p></div>}
            </div>
          </div>
        );})()}

        {/* CONVERSATIONS - Inbox Style */}
        {view === 'conversations' && (() => {
          // Build threads - group messages by contact, get last message for preview
          const threads = crmContacts.map(contact => {
            const contactMessages = messages.filter(m => m.contactId === contact.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const lastMessage = contactMessages[0];
            // Get unique project IDs from this contact's messages
            const threadProjectIds = [...new Set(contactMessages.map(m => m.projectId).filter(Boolean))];
            return { contact, messages: contactMessages, lastMessage, threadProjectIds };
          }).filter(t => t.messages.length > 0).sort((a, b) => new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0));
          
          // Filter threads
          const filteredThreads = threads.filter(t => {
            if (inboxFilter === 'starred' && !t.contact.starred) return false;
            if (convoSearch && !t.contact.name.toLowerCase().includes(convoSearch.toLowerCase())) return false;
            // Project filter - show thread if contact is assigned to project OR has messages tagged with project
            if (convoProjectFilter !== 'all') {
              const projId = parseInt(convoProjectFilter);
              const contactHasProject = t.contact.projectIds?.includes(projId);
              const messagesHaveProject = t.threadProjectIds.includes(projId);
              if (!contactHasProject && !messagesHaveProject) return false;
            }
            return true;
          });
          
          // Get selected thread data
          const activeThread = selectedThread ? threads.find(t => t.contact.id === selectedThread) : null;
          let threadMessages = activeThread ? [...activeThread.messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
          
          // Filter messages by project if filter is active
          if (convoProjectFilter !== 'all' && activeThread) {
            const projId = parseInt(convoProjectFilter);
            threadMessages = threadMessages.filter(m => m.projectId === projId || !m.projectId);
          }
          
          // Group messages by date
          const groupedMessages = threadMessages.reduce((acc, msg) => {
            const date = new Date(msg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (!acc[date]) acc[date] = [];
            acc[date].push(msg);
            return acc;
          }, {});
          
          // Get unique project IDs across all messages for the active thread
          const activeThreadProjects = activeThread ? [...new Set(activeThread.messages.map(m => m.projectId).filter(Boolean))] : [];
          
          return (
          <div className={`flex-1 flex overflow-hidden`}>
            {/* Left Panel - Thread List */}
            <div className={`w-full md:w-80 lg:w-96 ${card} border-r ${border} flex flex-col shrink-0 ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className={`px-4 py-3 border-b ${border}`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`font-bold text-lg ${text}`}>Inbox</h2>
                  <button onClick={() => { setForm({ contactId: crmContacts[0]?.id, projectId: convoProjectFilter !== 'all' ? parseInt(convoProjectFilter) : null }); setModal('newConversation'); }} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                {/* Search */}
                <div className="relative mb-2">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                  <input type="text" placeholder="Search contacts..." value={convoSearch} onChange={e => setConvoSearch(e.target.value)} className={`${inputCls} pl-9 py-2 text-sm`} />
                </div>
                {/* Project Filter */}
                <select value={convoProjectFilter} onChange={e => setConvoProjectFilter(e.target.value)} className={`${selectCls} py-2 text-sm w-full`}>
                  <option value="all">All Projects</option>
                  {projects.map(p => <option key={p.id} value={p.id}>📍 {p.name}</option>)}
                </select>
              </div>
              
              {/* Filter Tabs */}
              <div className={`flex border-b ${border}`}>
                {[{ id: 'all', label: 'All', icon: MessageSquare }, { id: 'starred', label: 'Starred', icon: Star }].map(f => (
                  <button key={f.id} onClick={() => setInboxFilter(f.id)} className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${inboxFilter === f.id ? 'border-blue-600 text-blue-600' : `border-transparent ${muted} hover:text-gray-700`}`}>
                    <f.icon className="w-3.5 h-3.5" />{f.label}
                  </button>
                ))}
              </div>
              
              {/* Active Project Filter Badge */}
              {convoProjectFilter !== 'all' && (
                <div className={`px-3 py-2 ${dark ? 'bg-blue-900/30' : 'bg-blue-50'} flex items-center justify-between`}>
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Showing: {projects.find(p => p.id === parseInt(convoProjectFilter))?.name}
                  </span>
                  <button onClick={() => setConvoProjectFilter('all')} className="text-xs text-blue-600 hover:underline">Clear</button>
                </div>
              )}
              
              {/* Thread List */}
              <div className="flex-1 overflow-y-auto">
                {filteredThreads.map(thread => {
                  const isActive = selectedThread === thread.contact.id;
                  const lastMsg = thread.lastMessage;
                  const typeIcon = lastMsg?.type === 'call' ? '📞' : lastMsg?.type === 'email' ? '✉️' : '💬';
                  const preview = lastMsg?.content?.substring(0, 35) + (lastMsg?.content?.length > 35 ? '...' : '');
                  const timeStr = lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                  // Show project badges on thread
                  const contactProjects = thread.contact.projectIds || [];
                  
                  return (
                    <div 
                      key={thread.contact.id} 
                      onClick={() => setSelectedThread(thread.contact.id)}
                      className={`px-3 py-3 cursor-pointer border-b ${border} ${isActive ? (dark ? 'bg-blue-900/30' : 'bg-blue-50') : hover}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-9 h-9 rounded-full ${dark ? 'bg-slate-600' : 'bg-gray-200'} flex items-center justify-center text-xs font-semibold ${text} shrink-0`}>
                          {thread.contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-semibold text-sm ${text} truncate`}>{thread.contact.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              {thread.contact.starred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                              <span className={`text-[10px] ${muted}`}>{timeStr}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs">{typeIcon}</span>
                            <span className={`text-xs ${muted} truncate`}>{preview}</span>
                          </div>
                          {/* Project tags on thread */}
                          {contactProjects.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {contactProjects.slice(0, 2).map(pid => {
                                const proj = projects.find(p => p.id === pid);
                                return proj ? (
                                  <span key={pid} className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">{proj.name}</span>
                                ) : null;
                              })}
                              {contactProjects.length > 2 && (
                                <span className={`text-[10px] ${muted}`}>+{contactProjects.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredThreads.length === 0 && (
                  <div className={`text-center py-12 ${muted}`}>
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No conversations</p>
                    {convoProjectFilter !== 'all' && <p className="text-xs mt-1">Try clearing the project filter</p>}
                  </div>
                )}
              </div>
            </div>
            
            {/* Center Panel - Message Thread */}
            <div className={`flex-1 flex flex-col min-w-0 ${!selectedThread ? 'hidden md:flex' : 'flex'}`}>
              {selectedThread && activeThread ? (
                <>
                  {/* Thread Header */}
                  <div className={`px-4 py-3 border-b ${border} flex items-center justify-between ${card} shrink-0`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <button onClick={() => setSelectedThread(null)} className={`md:hidden p-1 rounded ${hover} shrink-0`}><ChevronLeft className="w-5 h-5" /></button>
                      <div className={`w-10 h-10 rounded-full ${dark ? 'bg-slate-600' : 'bg-gray-200'} flex items-center justify-center text-sm font-semibold ${text} shrink-0`}>
                        {activeThread.contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold ${text} truncate`}>{activeThread.contact.name}</p>
                        <p className={`text-xs ${muted} truncate`}>{activeThread.contact.phone} • {activeThread.contact.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {activeThread.contact.phone && <a href={`tel:${activeThread.contact.phone}`} className={`p-2 rounded-lg ${hover}`}><Phone className="w-4 h-4 text-emerald-600" /></a>}
                      {activeThread.contact.email && <a href={`mailto:${activeThread.contact.email}`} className={`p-2 rounded-lg ${hover}`}><Mail className="w-4 h-4 text-amber-600" /></a>}
                      <button onClick={() => setCrmContacts(crmContacts.map(c => c.id === activeThread.contact.id ? { ...c, starred: !c.starred } : c))} className={`p-2 rounded-lg ${hover}`}>
                        <Star className={`w-4 h-4 ${activeThread.contact.starred ? 'text-amber-500 fill-amber-500' : muted}`} />
                      </button>
                      <button onClick={() => setShowContactPanel(!showContactPanel)} className={`p-2 rounded-lg ${hover} hidden lg:block`}><User className={`w-4 h-4 ${muted}`} /></button>
                    </div>
                  </div>
                  
                  {/* Project context bar */}
                  {(activeThread.contact.projectIds?.length > 0 || activeThreadProjects.length > 0) && (
                    <div className={`px-4 py-2 border-b ${border} ${dark ? 'bg-slate-800/50' : 'bg-gray-50'} flex items-center gap-2 flex-wrap shrink-0`}>
                      <span className={`text-xs ${muted}`}>Projects:</span>
                      {[...new Set([...(activeThread.contact.projectIds || []), ...activeThreadProjects])].map(pid => {
                        const proj = projects.find(p => p.id === pid);
                        const isFiltered = convoProjectFilter === String(pid);
                        return proj ? (
                          <button 
                            key={pid} 
                            onClick={() => setConvoProjectFilter(isFiltered ? 'all' : String(pid))}
                            className={`text-xs px-2 py-1 rounded-full transition ${isFiltered ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                          >
                            {proj.name}
                          </button>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  {/* Messages */}
                  <div className={`flex-1 overflow-y-auto p-4 ${bg}`}>
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date}>
                        {/* Date Separator */}
                        <div className="flex items-center justify-center my-4">
                          <span className={`text-xs ${muted} px-3 py-1 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>{date}</span>
                        </div>
                        {/* Messages for this date */}
                        {msgs.map(msg => {
                          const isOutbound = msg.direction === 'outbound';
                          const time = new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                          const msgProject = msg.projectId ? projects.find(p => p.id === msg.projectId) : null;
                          
                          if (msg.type === 'call') {
                            // Call log - centered
                            return (
                              <div key={msg.id} className="flex justify-center my-3">
                                <div className={`inline-flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                  <div className={`flex items-center gap-2 ${muted} text-sm`}>
                                    <Phone className="w-4 h-4" />
                                    <span>{isOutbound ? 'Outgoing' : 'Incoming'} call</span>
                                    {msg.duration && <span>• {msg.duration}</span>}
                                  </div>
                                  {msg.content && <p className={`text-xs ${muted} text-center max-w-[250px]`}>{msg.content}</p>}
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] ${muted}`}>{time}</span>
                                    {msgProject && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">{msgProject.name}</span>}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          
                          // Text/Email bubble
                          return (
                            <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} mb-3`}>
                              <div className={`max-w-[75%]`}>
                                {!isOutbound && (
                                  <div className={`w-7 h-7 rounded-full ${dark ? 'bg-slate-600' : 'bg-gray-200'} flex items-center justify-center text-[10px] font-semibold ${text} mb-1`}>
                                    {activeThread.contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                  </div>
                                )}
                                <div className={`px-3.5 py-2.5 rounded-2xl ${isOutbound ? 'bg-blue-600 text-white' : (dark ? 'bg-slate-600 border border-slate-500' : 'bg-white border border-gray-200 shadow-sm')} ${isOutbound ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                                  {msg.type === 'email' && <div className={`text-[10px] ${isOutbound ? 'text-blue-200' : muted} mb-1 flex items-center gap-1`}><Mail className="w-3 h-3" />Email</div>}
                                  <p className={`text-sm leading-relaxed ${isOutbound ? 'text-white' : text}`}>{msg.content}</p>
                                </div>
                                <div className={`flex items-center gap-2 mt-1 ${isOutbound ? 'justify-end' : ''}`}>
                                  <span className={`text-[10px] ${muted}`}>{time}</span>
                                  {msgProject && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">{msgProject.name}</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    {threadMessages.length === 0 && (
                      <div className={`text-center py-12 ${muted}`}>
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No messages {convoProjectFilter !== 'all' ? 'for this project' : ''}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input - Fixed */}
                  <div className={`px-3 py-3 border-t ${border} ${card} shrink-0`}>
                    {/* Project tag for new message */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs ${muted}`}>Tag project:</span>
                      <select 
                        value={form.projectId || ''} 
                        onChange={e => setForm({ ...form, projectId: e.target.value ? parseInt(e.target.value) : null })}
                        className={`text-xs px-2 py-1 rounded border ${border} ${dark ? 'bg-slate-700' : 'bg-white'} ${text}`}
                      >
                        <option value="">None</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      {form.projectId && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                          {projects.find(p => p.id === form.projectId)?.name}
                          <button onClick={() => setForm({ ...form, projectId: null })}><X className="w-3 h-3" /></button>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Type selector - compact */}
                      <div className={`flex rounded-lg border ${border} overflow-hidden shrink-0`}>
                        {[{ t: 'text', icon: '💬' }, { t: 'call', icon: '📞' }, { t: 'email', icon: '✉️' }].map(x => (
                          <button 
                            key={x.t}
                            onClick={() => setNewMessageType(x.t)}
                            className={`px-2.5 py-2 text-sm transition ${newMessageType === x.t ? (dark ? 'bg-slate-600' : 'bg-gray-100') : ''}`}
                          >
                            {x.icon}
                          </button>
                        ))}
                      </div>
                      {/* Input */}
                      <input 
                        type="text"
                        value={newMessage} 
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newMessage.trim()) {
                            setMessages([...messages, {
                              id: Date.now(),
                              contactId: selectedThread,
                              type: newMessageType,
                              direction: 'outbound',
                              content: newMessage.trim(),
                              timestamp: new Date().toISOString(),
                              projectId: form.projectId || null,
                              duration: newMessageType === 'call' ? '' : undefined
                            }]);
                            setNewMessage('');
                          }
                        }}
                        placeholder={newMessageType === 'call' ? 'Log call notes...' : newMessageType === 'email' ? 'Log email summary...' : 'Type a message...'}
                        className={`${inputCls} flex-1 py-2 text-sm`}
                      />
                      <button 
                        onClick={() => {
                          if (!newMessage.trim()) return;
                          setMessages([...messages, {
                            id: Date.now(),
                            contactId: selectedThread,
                            type: newMessageType,
                            direction: 'outbound',
                            content: newMessage.trim(),
                            timestamp: new Date().toISOString(),
                            projectId: form.projectId || null,
                            duration: newMessageType === 'call' ? '' : undefined
                          }]);
                          setNewMessage('');
                        }}
                        className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shrink-0"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`flex-1 flex items-center justify-center ${bg}`}>
                  <div className={`text-center ${muted}`}>
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-1">Select a conversation</p>
                    <p className="text-sm">Choose from your existing conversations or start a new one</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Panel - Contact Details */}
            {selectedThread && activeThread && showContactPanel && (
              <div className={`hidden lg:flex w-72 ${card} border-l ${border} flex-col shrink-0`}>
                <div className={`px-4 py-3 border-b ${border} flex items-center justify-between`}>
                  <span className={`font-semibold text-sm ${text}`}>Contact Details</span>
                  <button onClick={() => setShowContactPanel(false)} className={`p-1 rounded ${hover}`}><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Avatar & Name */}
                  <div className="text-center mb-5">
                    <div className={`w-16 h-16 rounded-full ${dark ? 'bg-slate-600' : 'bg-gray-200'} flex items-center justify-center text-xl font-semibold ${text} mx-auto mb-2`}>
                      {activeThread.contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <p className={`font-bold ${text}`}>{activeThread.contact.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeThread.contact.role === 'Client' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{activeThread.contact.role}</span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-5">
                    {activeThread.contact.phone && (
                      <a href={`tel:${activeThread.contact.phone}`} className={`flex-1 py-2 text-center text-xs font-medium rounded-lg ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'} ${text}`}>
                        <Phone className="w-4 h-4 mx-auto mb-1 text-emerald-600" />Call
                      </a>
                    )}
                    {activeThread.contact.phone && (
                      <a href={`sms:${activeThread.contact.phone}`} className={`flex-1 py-2 text-center text-xs font-medium rounded-lg ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'} ${text}`}>
                        <MessageSquare className="w-4 h-4 mx-auto mb-1 text-blue-600" />Text
                      </a>
                    )}
                    {activeThread.contact.email && (
                      <a href={`mailto:${activeThread.contact.email}`} className={`flex-1 py-2 text-center text-xs font-medium rounded-lg ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'} ${text}`}>
                        <Mail className="w-4 h-4 mx-auto mb-1 text-amber-600" />Email
                      </a>
                    )}
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-3 mb-5">
                    {activeThread.contact.phone && (
                      <div>
                        <p className={`text-[10px] ${muted} uppercase`}>Phone</p>
                        <p className={`text-sm ${text}`}>{activeThread.contact.phone}</p>
                      </div>
                    )}
                    {activeThread.contact.email && (
                      <div>
                        <p className={`text-[10px] ${muted} uppercase`}>Email</p>
                        <p className={`text-sm ${text} break-all`}>{activeThread.contact.email}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Projects */}
                  <div className="mb-5">
                    <p className={`text-[10px] ${muted} uppercase mb-2`}>Assigned Projects</p>
                    {activeThread.contact.projectIds?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {activeThread.contact.projectIds.map(pid => {
                          const proj = projects.find(p => p.id === pid);
                          return proj ? (
                            <span key={pid} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">{proj.name}</span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className={`text-xs ${muted}`}>None assigned</p>
                    )}
                    <button 
                      onClick={() => { setForm(activeThread.contact); setModal('editContact'); }}
                      className={`text-xs text-blue-600 hover:underline mt-2`}
                    >
                      + Assign to project
                    </button>
                  </div>
                  
                  {/* Tags */}
                  {activeThread.contact.tags?.length > 0 && (
                    <div className="mb-5">
                      <p className={`text-[10px] ${muted} uppercase mb-2`}>Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {activeThread.contact.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {activeThread.contact.notes && (
                    <div className="mb-5">
                      <p className={`text-[10px] ${muted} uppercase mb-2`}>Notes</p>
                      <p className={`text-xs ${text} leading-relaxed`}>{activeThread.contact.notes}</p>
                    </div>
                  )}
                  
                  {/* Conversation Stats */}
                  <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'} mb-4`}>
                    <p className={`text-[10px] ${muted} uppercase mb-2`}>Conversation Stats</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className={`text-lg font-bold ${text}`}>{activeThread.messages.filter(m => m.type === 'text').length}</p>
                        <p className={`text-[10px] ${muted}`}>Texts</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${text}`}>{activeThread.messages.filter(m => m.type === 'call').length}</p>
                        <p className={`text-[10px] ${muted}`}>Calls</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${text}`}>{activeThread.messages.filter(m => m.type === 'email').length}</p>
                        <p className={`text-[10px] ${muted}`}>Emails</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Button */}
                  <button onClick={() => { setForm(activeThread.contact); setModal('editContact'); }} className={`w-full py-2 text-xs font-medium border ${border} ${text} rounded-lg ${hover}`}>
                    Edit Contact
                  </button>
                </div>
              </div>
            )}
          </div>
        );})()}

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
                <select value={projectStatusFilter} onChange={e => setProjectStatusFilter(e.target.value)} className={`${selectCls} flex-1 lg:w-40 py-2`}>
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
                  <button onClick={() => setTradeDropdownOpen(!tradeDropdownOpen)} className={`${inputCls} py-2 px-3 flex items-center gap-2 min-w-[140px]`}>
                    <span className="text-sm">{tradeFilters.length === 0 ? 'All Trades' : `${tradeFilters.length} selected`}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </button>
                  {tradeDropdownOpen && (
                    <div className={`absolute z-50 mt-1 w-56 ${card} rounded-lg border ${border} shadow-lg max-h-64 overflow-y-auto`}>
                      <div className={`p-2 border-b ${border}`}>
                        <button onClick={() => setTradeFilters([])} className={`text-xs ${muted} hover:text-blue-600`}>Clear all</button>
                      </div>
                      {TRADES.map(t => (
                        <label key={t} className={`flex items-center gap-2 px-3 py-2 ${hover} cursor-pointer`}>
                          <input type="checkbox" checked={tradeFilters.includes(t)} onChange={e => setTradeFilters(e.target.checked ? [...tradeFilters, t] : tradeFilters.filter(x => x !== t))} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className={`text-sm ${text}`}>{t}</span>
                          <span className={`text-xs ${muted} ml-auto`}>{contractors.filter(c => c.trade === t).length}</span>
                        </label>
                      ))}
                      <div className={`p-2 border-t ${border}`}>
                        <button onClick={() => setTradeDropdownOpen(false)} className="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium">Apply</button>
                      </div>
                    </div>
                  )}
                </div>
                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className={`${selectCls} flex-1 lg:w-40 py-2`}>
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
                  <button onClick={() => setSupplierCatDropdownOpen(!supplierCatDropdownOpen)} className={`${inputCls} py-2 px-3 flex items-center gap-2 min-w-[140px]`}>
                    <span className="text-sm">{supplierCategoryFilters.length === 0 ? 'All Categories' : `${supplierCategoryFilters.length} selected`}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </button>
                  {supplierCatDropdownOpen && (
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
                        <button onClick={() => setSupplierCatDropdownOpen(false)} className="w-full px-3 py-1.5 bg-purple-600 text-white rounded text-sm font-medium">Apply</button>
                      </div>
                    </div>
                  )}
                </div>
                <select value={supplierCityFilter} onChange={e => setSupplierCityFilter(e.target.value)} className={`${selectCls} flex-1 lg:w-40 py-2`}>
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
          proj.tasks.filter(t => {
            const matchesSearch = !search || t.task.toLowerCase().includes(search.toLowerCase());
            const matchesTrade = tradeFilter === 'all' || (tradeFilter === '__inspections__' ? t.inspection : t.trade === tradeFilter);
            return matchesSearch && matchesTrade;
          }).forEach(t => { if (tasksByPhase[t.phase]) tasksByPhase[t.phase].push(t); });

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
                  {['tasks', 'gantt', 'daily-logs', 'punch-list', 'rfis', 'submittals', 'selections', 'documents', 'warranty', 'time-tracking', 'equipment', 'meetings', 'contractors', 'bids', 'client', 'financials', 'draws', 'materials', 'photos', 'files', 'settings'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-2.5 lg:px-4 py-2.5 lg:py-3 border-b-2 text-xs lg:text-sm font-medium capitalize whitespace-nowrap transition ${tab === t ? 'border-blue-600 text-blue-600' : `border-transparent ${muted} hover:text-gray-900`}`}>{t.replace('-', ' ')}</button>
                  ))}
                </div>
              </div>

              <main className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bg}`}>
                
                {/* TASKS TAB */}
                {tab === 'tasks' && (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    {(() => {
                      const totalBudget = proj.tasks.reduce((sum, t) => sum + (parseFloat(t.budget) || 0), 0);
                      const receiptSpend = (proj.receipts || []).reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
                      const directCosts = proj.tasks.reduce((sum, t) => sum + (parseFloat(t.actualCost) || 0), 0);
                      const actualSpend = receiptSpend + directCosts;
                      const variance = totalBudget > 0 ? totalBudget - actualSpend : 0;
                      const scheduledDates = proj.tasks.filter(t => t.scheduledStart).map(t => new Date(t.scheduledStart));
                      const endDates = proj.tasks.filter(t => t.scheduledEnd).map(t => new Date(t.scheduledEnd));
                      const startDate = proj.startDate || (scheduledDates.length > 0 ? new Date(Math.min(...scheduledDates)).toISOString().split('T')[0] : null);
                      const estCompletion = endDates.length > 0 ? new Date(Math.max(...endDates)).toISOString().split('T')[0] : null;
                      const totalTasks = proj.tasks.length;
                      const completedTasks = proj.tasks.filter(t => t.status === 'complete').length;
                      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                      const tasksWithBudget = proj.tasks.filter(t => t.budget > 0).length;
                      const tasksWithActual = proj.tasks.filter(t => t.actualCost > 0).length;
                      
                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                          <div className={`${card} rounded-xl border ${border} p-3`}>
                            <p className={`text-[10px] sm:text-xs ${muted} uppercase`}>Budget</p>
                            <p className={`text-sm sm:text-lg font-bold ${totalBudget > 0 ? 'text-purple-600' : muted}`}>{totalBudget > 0 ? fmt(totalBudget) : '—'}</p>
                            <p className={`text-[10px] ${muted}`}>{tasksWithBudget}/{totalTasks} tasks</p>
                          </div>
                          <div className={`${card} rounded-xl border ${border} p-3`}>
                            <p className={`text-[10px] sm:text-xs ${muted} uppercase`}>Actual Spend</p>
                            <p className={`text-sm sm:text-lg font-bold ${actualSpend > 0 ? 'text-blue-600' : muted}`}>{actualSpend > 0 ? fmt(actualSpend) : '—'}</p>
                            <p className={`text-[10px] ${muted}`}>{tasksWithActual} costs + {(proj.receipts || []).length} receipts</p>
                          </div>
                          <div className={`${card} rounded-xl border ${border} p-3`}>
                            <p className={`text-[10px] sm:text-xs ${muted} uppercase`}>Variance</p>
                            <p className={`text-sm sm:text-lg font-bold ${totalBudget === 0 ? muted : variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {totalBudget === 0 ? '—' : (variance >= 0 ? '+' : '') + fmt(variance)}
                            </p>
                            <p className={`text-[10px] ${muted}`}>{variance >= 0 ? 'Under budget' : 'Over budget'}</p>
                          </div>
                          <div className={`${card} rounded-xl border ${border} p-3`}>
                            <p className={`text-[10px] sm:text-xs ${muted} uppercase`}>Start Date</p>
                            <p className={`text-sm sm:text-lg font-bold ${text}`}>{startDate ? fmtDate(startDate) : '—'}</p>
                            <p className={`text-[10px] ${muted}`}>Project start</p>
                          </div>
                          <div className={`${card} rounded-xl border ${border} p-3`}>
                            <p className={`text-[10px] sm:text-xs ${muted} uppercase`}>Est. Completion</p>
                            <p className={`text-sm sm:text-lg font-bold ${text}`}>{estCompletion ? fmtDate(estCompletion) : '—'}</p>
                            <p className={`text-[10px] ${muted}`}>Latest task end</p>
                          </div>
                          <div className={`${card} rounded-xl border ${border} p-3`}>
                            <p className={`text-[10px] sm:text-xs ${muted} uppercase`}>Progress</p>
                            <p className={`text-sm sm:text-lg font-bold ${progress === 100 ? 'text-emerald-600' : text}`}>{progress}%</p>
                            <p className={`text-[10px] ${muted}`}>{completedTasks}/{totalTasks} tasks</p>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                        <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
                      </div>
                      <select value={tradeFilter} onChange={e => setTradeFilter(e.target.value)} className={`${selectCls} w-full sm:w-48`}>
                        <option value="all">All Trades</option>
                        <option value="__inspections__">⚠️ Inspections</option>
                        {[...new Set(proj.tasks.map(t => t.trade).filter(Boolean))].sort().map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button onClick={() => { setForm({ phase: proj.phases[0], days: 1, priority: 'normal' }); setModal('addTask'); }} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" />Add Task</button>
                    </div>
                    {tradeFilter !== 'all' && <div className="flex items-center gap-2">
                      <span className={`text-sm ${muted}`}>Filtering by:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{tradeFilter === '__inspections__' ? '⚠️ Inspections' : tradeFilter}</span>
                      <button onClick={() => setTradeFilter('all')} className="text-xs text-blue-600 hover:underline">Clear</button>
                    </div>}
                    <p className={`text-xs md:text-sm ${muted}`}>💡 Tap a task to see details, dates & contractor info. Drag to reorder.</p>
                    
                    {proj.phases.map(phase => {
                      const phaseTasks = tasksByPhase[phase] || [];
                      const phaseBudget = phaseTasks.reduce((sum, t) => sum + (parseFloat(t.budget) || 0), 0);
                      const phaseBids = phaseTasks.reduce((sum, t) => {
                        const accepted = (proj.bids || []).find(b => b.taskId === t.id && b.status === 'accepted');
                        return sum + (accepted ? parseFloat(accepted.amount) || 0 : 0);
                      }, 0);
                      const phaseActual = phaseTasks.reduce((sum, t) => {
                        const receipts = (proj.receipts || []).filter(r => r.taskId === t.id);
                        const receiptTotal = receipts.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
                        return sum + (t.actualCost || 0) + receiptTotal;
                      }, 0);
                      
                      return (
                        <div key={phase} className={`${card} rounded-xl border ${border} overflow-hidden`} onDragOver={handleDragOver} onDrop={e => handleDropOnPhase(e, phase)}>
                        <button onClick={() => setExpanded(p => ({ ...p, [phase]: !p[phase] }))} className={`w-full flex flex-col px-3 md:px-4 py-2.5 md:py-3 ${dark ? 'bg-slate-750' : 'bg-gray-50'}`}>
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-2">
                              {expanded[phase] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              <span className={`font-semibold text-sm md:text-base ${text}`}>{phase}</span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">{phaseTasks.length}</span>
                            </div>
                            <span className="text-xs md:text-sm text-emerald-600 font-medium">{phaseTasks.filter(t => t.status === 'complete').length} done</span>
                          </div>
                          {(phaseBudget > 0 || phaseBids > 0 || phaseActual > 0) && (
                            <div className="flex items-center gap-1 mt-1 ml-6 text-xs font-medium">
                              <span className={phaseBudget > 0 ? 'text-purple-600' : muted}>{phaseBudget > 0 ? fmt(phaseBudget) : '—'}</span>
                              <span className={muted}>/</span>
                              <span className={phaseBids > 0 ? 'text-emerald-600' : muted}>{phaseBids > 0 ? fmt(phaseBids) : '—'}</span>
                              <span className={muted}>/</span>
                              <span className={phaseActual > 0 ? 'text-blue-600' : muted}>{phaseActual > 0 ? fmt(phaseActual) : '—'}</span>
                            </div>
                          )}
                        </button>
                        {expanded[phase] && (
                          <div className={`divide-y ${border}`}>
                            {phaseTasks.map(task => {
                              const taskContractor = task.contractorId ? contractors.find(c => c.id === task.contractorId) : null;
                              const taskExpanded = expanded[`task-${task.id}`];
                              const isOverdue = task.scheduledEnd && new Date(task.scheduledEnd) < new Date() && task.status !== 'complete';
                              const taskReceipts = (proj.receipts || []).filter(r => r.taskId === task.id);
                              const taskCost = taskReceipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
                              const taskActual = (task.actualCost || 0) + taskCost;
                              const taskBids = (proj.bids || []).filter(b => b.taskId === task.id);
                              const acceptedBid = taskBids.find(b => b.status === 'accepted');
                              const pendingBids = taskBids.filter(b => b.status === 'pending');
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
                                    }} className={`text-xs pl-2 md:pl-3 pr-7 py-1 rounded font-medium border-0 cursor-pointer shrink-0 appearance-none bg-no-repeat bg-[length:12px_12px] bg-[position:right_6px_center] ${task.status === 'complete' ? "bg-emerald-100 text-emerald-700 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23047857%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]" : task.status === 'in_progress' ? "bg-blue-100 text-blue-700 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231d4ed8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]" : "bg-gray-100 text-gray-600 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]"}`}>
                                      <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="complete">Complete</option>
                                    </select>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs ${muted} font-mono`}>#{task.id}</span>
                                        <p className={`text-xs md:text-sm font-medium truncate ${text}`}>{task.task}</p>
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
                                    {taskContractor ? (
                                      <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 shrink-0 hidden sm:inline-flex items-center gap-1" title={taskContractor.name}>
                                        <Briefcase className="w-3 h-3" />Assigned
                                      </span>
                                    ) : (
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${muted} shrink-0 hidden sm:inline-flex items-center gap-1`}>
                                        <Briefcase className="w-3 h-3" />Unassigned
                                      </span>
                                    )}
                                    {/* Budget / Bid / Actual - color coded */}
                                    <div className="hidden sm:flex items-center gap-0.5 text-xs font-medium shrink-0" title="Budget / Bid / Actual">
                                      <span className={task.budget > 0 ? 'text-purple-600' : muted}>{task.budget > 0 ? fmt(task.budget) : '—'}</span>
                                      <span className={muted}>/</span>
                                      <span className={acceptedBid ? 'text-emerald-600' : muted}>{acceptedBid ? fmt(acceptedBid.amount) : '—'}</span>
                                      <span className={muted}>/</span>
                                      <span className={taskActual > 0 ? 'text-blue-600' : muted}>{taskActual > 0 ? fmt(taskActual) : '—'}</span>
                                    </div>
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
                                            <div className="flex justify-between">
                                              <span className={`text-sm ${muted}`}>Budget</span>
                                              <span className={`text-sm font-medium ${task.budget > 0 ? 'text-purple-600' : muted}`}>{task.budget > 0 ? fmt(task.budget) : '—'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span className={`text-sm ${muted}`}>Actual Cost</span>
                                              <div className="flex items-center gap-2">
                                                <span className={`text-sm font-medium ${taskActual > 0 ? 'text-blue-600' : muted}`}>
                                                  {taskActual > 0 ? fmt(taskActual) : '—'}
                                                </span>
                                                <button 
                                                  onClick={e => { e.stopPropagation(); setForm({ actualCost: task.actualCost || '' }); setSel(task); setModal('editTaskActualCost'); }} 
                                                  className="text-xs text-blue-600 hover:underline"
                                                >
                                                  {task.actualCost ? 'Edit' : '+ Add'}
                                                </button>
                                              </div>
                                            </div>
                                            {task.assignedTo && (
                                              <div className="flex justify-between items-center">
                                                <span className={`text-sm ${muted}`}>Task Owner</span>
                                                <span className={`text-sm font-medium ${text}`}>{team.find(m => m.id === task.assignedTo)?.name || '-'}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Notes */}
                                      <div className={`mt-3 ${card} rounded-lg border ${border} p-3`}>
                                        <div className="flex justify-between items-center mb-1">
                                          <p className={`text-xs font-semibold ${muted} uppercase`}>Notes</p>
                                          <button 
                                            onClick={e => { e.stopPropagation(); setForm(task); setSel(task); setModal('editTaskNotes'); }} 
                                            className="text-xs text-blue-600 hover:underline"
                                          >
                                            {task.notes ? 'Edit' : '+ Add Note'}
                                          </button>
                                        </div>
                                        {task.notes ? (
                                          <p className={`text-sm ${text} whitespace-pre-wrap`}>{task.notes}</p>
                                        ) : (
                                          <p className={`text-sm ${muted} italic`}>No notes yet</p>
                                        )}
                                      </div>
                                      
                                      {/* Bids Section */}
                                      <div className={`mt-3 ${card} rounded-lg border ${border} p-3`}>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className={`text-xs font-semibold ${muted} uppercase`}>Bids ({taskBids.length})</p>
                                          {acceptedBid && <span className="text-sm font-bold text-emerald-600">{fmt(acceptedBid.amount)}</span>}
                                        </div>
                                        {taskBids.length > 0 ? (
                                          <div className="space-y-2">
                                            {taskBids.map(b => {
                                              const bidContractor = b.contractorId ? contractors.find(c => c.id === b.contractorId) : null;
                                              return (
                                                <div key={b.id} className={`flex justify-between items-center text-sm py-2 border-b ${border} last:border-0`}>
                                                  <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                      <span className={`font-medium ${text}`}>{bidContractor?.name || b.vendorName || 'Unknown'}</span>
                                                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${b.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {b.status === 'accepted' ? '✓ Accepted' : b.status === 'rejected' ? 'Rejected' : 'Pending'}
                                                      </span>
                                                    </div>
                                                    <p className={`text-xs ${muted} truncate`}>{b.description}</p>
                                                  </div>
                                                  <div className="flex items-center gap-2 ml-2">
                                                    <span className={`font-semibold ${text}`}>{fmt(b.amount)}</span>
                                                    {b.status === 'pending' && (
                                                      <div className="flex gap-1">
                                                        <button onClick={e => { e.stopPropagation(); updateProj(projId, { bids: proj.bids.map(x => x.id === b.id ? { ...x, status: 'accepted' } : (x.taskId === task.id && x.status === 'accepted' ? { ...x, status: 'pending' } : x)) }); }} className="p-1 hover:bg-emerald-100 rounded" title="Accept"><CheckCircle className="w-4 h-4 text-emerald-600" /></button>
                                                        <button onClick={e => { e.stopPropagation(); updateProj(projId, { bids: proj.bids.map(x => x.id === b.id ? { ...x, status: 'rejected' } : x) }); }} className="p-1 hover:bg-red-100 rounded" title="Reject"><X className="w-4 h-4 text-red-500" /></button>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        ) : (
                                          <p className={`text-sm ${muted} text-center py-2`}>No bids for this task</p>
                                        )}
                                        <button 
                                          onClick={e => { e.stopPropagation(); setForm({ date: new Date().toISOString().split('T')[0], status: 'pending', taskId: task.id, trade: task.trade || '' }); setModal('addBid'); }}
                                          className={`mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1`}
                                        >
                                          <Plus className="w-3 h-3" />Add Bid
                                        </button>
                                      </div>

                                      {/* Linked Expenses */}
                                      <div className={`mt-3 ${card} rounded-lg border ${border} p-3`}>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className={`text-xs font-semibold ${muted} uppercase`}>Expenses ({taskReceipts.length})</p>
                                          <span className={`text-sm font-bold ${taskCost > 0 ? 'text-emerald-600' : muted}`}>{fmt(taskCost)}</span>
                                        </div>
                                        {taskReceipts.length > 0 ? (
                                          <div className="space-y-2">
                                            {taskReceipts.map(r => (
                                              <div key={r.id} className={`flex justify-between items-center text-sm py-1 border-b ${border} last:border-0`}>
                                                <div>
                                                  <span className={text}>{r.vendor}</span>
                                                  <span className={`text-xs ${muted} ml-2`}>{r.description}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <span className={`font-medium ${text}`}>{fmt(r.amount)}</span>
                                                  <span className={`text-xs ${muted}`}>{fmtDate(r.date)}</span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className={`text-sm ${muted} text-center py-2`}>No expenses linked to this task</p>
                                        )}
                                        <button 
                                          onClick={e => { e.stopPropagation(); setForm({ date: new Date().toISOString().split('T')[0], category: 'Materials', taskId: task.id }); setModal('addReceipt'); }}
                                          className={`mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1`}
                                        >
                                          <Plus className="w-3 h-3" />Add Expense
                                        </button>
                                      </div>
                                      
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
                    )})}
                  </div>
                )}

                {/* GANTT CHART TAB */}
                {tab === 'gantt' && (() => {
                  const tasks = proj.tasks.filter(t => t.scheduledStart && t.scheduledEnd);
                  if (tasks.length === 0) return <div className={`text-center py-12 ${muted}`}>No tasks with scheduled dates. Add dates to tasks to see the Gantt chart.</div>;
                  
                  const allDates = tasks.flatMap(t => [new Date(t.scheduledStart), new Date(t.scheduledEnd)]);
                  const minDate = new Date(Math.min(...allDates));
                  const maxDate = new Date(Math.max(...allDates));
                  minDate.setDate(minDate.getDate() - 7);
                  maxDate.setDate(maxDate.getDate() + 7);
                  
                  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
                  const weeks = [];
                  let d = new Date(minDate);
                  while (d <= maxDate) {
                    weeks.push(new Date(d));
                    d.setDate(d.getDate() + 7);
                  }
                  
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const todayOffset = Math.ceil((today - minDate) / (1000 * 60 * 60 * 24));
                  
                  const getBarStyle = (task) => {
                    const start = new Date(task.scheduledStart);
                    const end = new Date(task.scheduledEnd);
                    const startOffset = Math.max(0, Math.ceil((start - minDate) / (1000 * 60 * 60 * 24)));
                    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                    return {
                      left: `${(startOffset / totalDays) * 100}%`,
                      width: `${(duration / totalDays) * 100}%`,
                    };
                  };
                  
                  const groupedByPhase = proj.phases.map(phase => ({
                    phase,
                    tasks: tasks.filter(t => t.phase === phase).sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart))
                  })).filter(g => g.tasks.length > 0);
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-semibold ${text}`}>Project Schedule - Gantt View</h3>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500"></span> Complete</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> In Progress</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300"></span> Pending</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500"></span> Inspection</span>
                        </div>
                      </div>
                      
                      <div className={`${card} rounded-xl border ${border} overflow-hidden`}>
                        <div className="overflow-x-auto">
                          <div style={{ minWidth: `${Math.max(800, totalDays * 8)}px` }}>
                            {/* Header - Week markers */}
                            <div className={`flex border-b ${border} ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                              <div className={`w-48 shrink-0 px-3 py-2 font-medium text-xs ${muted} border-r ${border}`}>Task</div>
                              <div className="flex-1 relative">
                                <div className="flex">
                                  {weeks.map((week, i) => (
                                    <div key={i} className={`flex-1 px-2 py-2 text-xs ${muted} border-r ${border} text-center`}>
                                      {week.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {/* Tasks by Phase */}
                            {groupedByPhase.map(({ phase, tasks: phaseTasks }) => (
                              <div key={phase}>
                                {/* Phase Header */}
                                <div className={`flex ${dark ? 'bg-slate-700/30' : 'bg-blue-50'} border-b ${border}`}>
                                  <div className={`w-48 shrink-0 px-3 py-2 font-semibold text-xs ${text} border-r ${border}`}>{phase}</div>
                                  <div className="flex-1"></div>
                                </div>
                                {/* Phase Tasks */}
                                {phaseTasks.map(task => {
                                  const barStyle = getBarStyle(task);
                                  const statusColor = task.status === 'complete' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-blue-500' : task.inspection ? 'bg-amber-500' : (dark ? 'bg-slate-500' : 'bg-gray-300');
                                  const contractor = task.contractorId ? contractors.find(c => c.id === task.contractorId) : null;
                                  return (
                                    <div key={task.id} className={`flex border-b ${border} ${hover} group`}>
                                      <div className={`w-48 shrink-0 px-3 py-2 border-r ${border}`}>
                                        <p className={`text-xs font-medium ${text} truncate`}>{task.task}</p>
                                        <p className={`text-[10px] ${muted} truncate`}>
                                          {task.scheduledStart} - {task.scheduledEnd}
                                          {contractor && ` • ${contractor.name}`}
                                        </p>
                                      </div>
                                      <div className="flex-1 relative py-2 px-1">
                                        {/* Today line */}
                                        {todayOffset >= 0 && todayOffset <= totalDays && (
                                          <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${(todayOffset / totalDays) * 100}%` }}></div>
                                        )}
                                        {/* Task bar */}
                                        <div 
                                          className={`absolute h-6 top-1/2 -translate-y-1/2 ${statusColor} rounded cursor-pointer transition hover:opacity-80`}
                                          style={barStyle}
                                          onClick={() => { setSel(task); setForm(task); setModal('editTask'); }}
                                          title={`${task.task}\n${task.scheduledStart} - ${task.scheduledEnd}\n${task.days} days`}
                                        >
                                          <span className="absolute inset-0 flex items-center px-2 text-[10px] text-white font-medium truncate">
                                            {task.task}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Legend and Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Project Duration</p>
                          <p className={`text-xl font-bold ${text}`}>{totalDays} days</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Tasks Scheduled</p>
                          <p className={`text-xl font-bold ${text}`}>{tasks.length}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Completed</p>
                          <p className={`text-xl font-bold text-emerald-600`}>{tasks.filter(t => t.status === 'complete').length}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>In Progress</p>
                          <p className={`text-xl font-bold text-blue-600`}>{tasks.filter(t => t.status === 'in_progress').length}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* DAILY LOGS TAB */}
                {tab === 'daily-logs' && (() => {
                  const logs = proj.dailyLogs || [];
                  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
                  const weatherIcons = { sunny: '☀️', cloudy: '☁️', 'partly-cloudy': '⛅', rainy: '🌧️', stormy: '⛈️', snowy: '🌨️', windy: '💨' };
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Daily Logs</h3>
                          <p className={`text-sm ${muted}`}>{logs.length} entries</p>
                        </div>
                        <button onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], weather: 'sunny', tempHigh: '', tempLow: '', workPerformed: '', workers: [], deliveries: [], visitors: [], delays: '', safety: '', photos: [], notes: '' }); setModal('addDailyLog'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Daily Log</button>
                      </div>
                      
                      {sortedLogs.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <FileText className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No daily logs yet</p>
                          <p className={`text-sm ${muted}`}>Document your daily progress, workers, and site conditions</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {sortedLogs.map(log => (
                            <div key={log.id} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                              <div className={`px-4 py-3 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} border-b ${border} flex flex-wrap items-center justify-between gap-2`}>
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">{weatherIcons[log.weather] || '🌤️'}</div>
                                  <div>
                                    <p className={`font-semibold ${text}`}>{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <p className={`text-xs ${muted}`}>{log.tempHigh}°F High / {log.tempLow}°F Low</p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button onClick={() => { setSel(log); setForm(log); setModal('editDailyLog'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                  <button onClick={() => updateProj(projId, { dailyLogs: (proj.dailyLogs || []).filter(l => l.id !== log.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                </div>
                              </div>
                              <div className="p-4 space-y-4">
                                {/* Work Performed */}
                                <div>
                                  <p className={`text-xs font-medium ${muted} uppercase mb-1`}>Work Performed</p>
                                  <p className={`text-sm ${text}`}>{log.workPerformed || '-'}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* Workers */}
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-2`}>Workers ({log.workers?.length || 0})</p>
                                    {(log.workers || []).length > 0 ? (
                                      <div className="space-y-1">
                                        {log.workers.map((w, i) => (
                                          <div key={i} className={`text-xs ${text} flex justify-between`}>
                                            <span>{w.name}</span>
                                            <span className={muted}>{w.hours} hrs</span>
                                          </div>
                                        ))}
                                        <div className={`text-xs font-medium ${text} pt-1 border-t ${border} flex justify-between`}>
                                          <span>Total</span>
                                          <span>{log.workers.reduce((s, w) => s + (w.hours || 0), 0)} hrs</span>
                                        </div>
                                      </div>
                                    ) : <p className={`text-xs ${muted}`}>No workers logged</p>}
                                  </div>
                                  
                                  {/* Deliveries */}
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-2`}>Deliveries ({log.deliveries?.length || 0})</p>
                                    {(log.deliveries || []).length > 0 ? (
                                      <div className="space-y-1">
                                        {log.deliveries.map((d, i) => (
                                          <div key={i} className={`text-xs ${text}`}>
                                            <span className="font-medium">{d.item}</span>
                                            <span className={muted}> - {d.vendor}</span>
                                            {d.quantity && <span className={muted}> ({d.quantity})</span>}
                                          </div>
                                        ))}
                                      </div>
                                    ) : <p className={`text-xs ${muted}`}>No deliveries</p>}
                                  </div>
                                  
                                  {/* Visitors */}
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-2`}>Visitors ({log.visitors?.length || 0})</p>
                                    {(log.visitors || []).length > 0 ? (
                                      <div className="space-y-1">
                                        {log.visitors.map((v, i) => (
                                          <div key={i} className={`text-xs ${text}`}>
                                            <span className="font-medium">{v.name}</span>
                                            {v.time && <span className={muted}> @ {v.time}</span>}
                                            {v.purpose && <p className={muted}>{v.purpose}</p>}
                                          </div>
                                        ))}
                                      </div>
                                    ) : <p className={`text-xs ${muted}`}>No visitors</p>}
                                  </div>
                                </div>
                                
                                {/* Delays & Safety */}
                                {(log.delays || log.safety) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {log.delays && (
                                      <div className={`p-3 rounded-lg ${dark ? 'bg-red-900/20' : 'bg-red-50'}`}>
                                        <p className="text-xs font-medium text-red-600 uppercase mb-1">⚠️ Delays/Issues</p>
                                        <p className={`text-sm ${text}`}>{log.delays}</p>
                                      </div>
                                    )}
                                    {log.safety && (
                                      <div className={`p-3 rounded-lg ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                                        <p className="text-xs font-medium text-green-600 uppercase mb-1">✓ Safety Notes</p>
                                        <p className={`text-sm ${text}`}>{log.safety}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Notes */}
                                {log.notes && (
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-1`}>Notes</p>
                                    <p className={`text-sm ${text}`}>{log.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* PUNCH LIST TAB */}
                {tab === 'punch-list' && (() => {
                  const items = proj.punchList || [];
                  const openItems = items.filter(i => i.status === 'open');
                  const inProgressItems = items.filter(i => i.status === 'in_progress');
                  const completeItems = items.filter(i => i.status === 'complete');
                  const priorityColors = { low: 'bg-gray-100 text-gray-600', medium: 'bg-blue-100 text-blue-700', high: 'bg-amber-100 text-amber-700', urgent: 'bg-red-100 text-red-700' };
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Punch List</h3>
                          <p className={`text-sm ${muted}`}>{openItems.length} open, {inProgressItems.length} in progress, {completeItems.length} complete</p>
                        </div>
                        <button onClick={() => { setForm({ status: 'open', priority: 'medium', dueDate: '', location: '', item: '', assignedTo: null, photos: [], notes: '', createdAt: new Date().toISOString().split('T')[0] }); setModal('addPunchItem'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Item</button>
                      </div>
                      
                      {/* Summary Cards */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className={`${card} rounded-xl border ${border} p-3 text-center`}>
                          <p className={`text-2xl font-bold text-red-600`}>{openItems.length}</p>
                          <p className={`text-xs ${muted}`}>Open</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-3 text-center`}>
                          <p className={`text-2xl font-bold text-blue-600`}>{inProgressItems.length}</p>
                          <p className={`text-xs ${muted}`}>In Progress</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-3 text-center`}>
                          <p className={`text-2xl font-bold text-emerald-600`}>{completeItems.length}</p>
                          <p className={`text-xs ${muted}`}>Complete</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-3 text-center`}>
                          <p className={`text-2xl font-bold ${text}`}>{items.length}</p>
                          <p className={`text-xs ${muted}`}>Total</p>
                        </div>
                      </div>
                      
                      {items.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <CheckCircle className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No punch list items yet</p>
                          <p className={`text-sm ${muted}`}>Add items that need to be fixed or completed before closeout</p>
                        </div>
                      ) : (
                        <div className={`${card} rounded-xl border ${border} overflow-hidden`}>
                          <table className="w-full">
                            <thead>
                              <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                                <th className="text-left px-4 py-3 font-medium">Item</th>
                                <th className="text-left px-4 py-3 font-medium">Location</th>
                                <th className="text-left px-4 py-3 font-medium">Assigned To</th>
                                <th className="text-left px-4 py-3 font-medium">Priority</th>
                                <th className="text-left px-4 py-3 font-medium">Due Date</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="text-center px-4 py-3 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                              {items.map(item => {
                                const assignee = item.assignedTo ? contractors.find(c => c.id === item.assignedTo) : null;
                                return (
                                  <tr key={item.id} className={hover}>
                                    <td className="px-4 py-3">
                                      <p className={`text-sm font-medium ${text}`}>{item.item}</p>
                                      {item.notes && <p className={`text-xs ${muted} truncate max-w-[200px]`}>{item.notes}</p>}
                                    </td>
                                    <td className="px-4 py-3"><span className={`text-sm ${text}`}>{item.location || '-'}</span></td>
                                    <td className="px-4 py-3"><span className={`text-sm ${text}`}>{assignee?.name || '-'}</span></td>
                                    <td className="px-4 py-3">
                                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${priorityColors[item.priority] || priorityColors.medium}`}>{item.priority}</span>
                                    </td>
                                    <td className="px-4 py-3"><span className={`text-sm ${text}`}>{item.dueDate || '-'}</span></td>
                                    <td className="px-4 py-3">
                                      <select 
                                        value={item.status} 
                                        onChange={e => updateProj(projId, { punchList: (proj.punchList || []).map(p => p.id === item.id ? { ...p, status: e.target.value, completedAt: e.target.value === 'complete' ? new Date().toISOString().split('T')[0] : p.completedAt } : p) })}
                                        className={`text-xs px-2 py-1 rounded border ${border} ${dark ? 'bg-slate-700' : 'bg-white'} ${text}`}
                                      >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="complete">Complete</option>
                                      </select>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex justify-center gap-1">
                                        <button onClick={() => { setSel(item); setForm(item); setModal('editPunchItem'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                        <button onClick={() => updateProj(projId, { punchList: (proj.punchList || []).filter(p => p.id !== item.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* RFIS TAB */}
                {tab === 'rfis' && (() => {
                  const rfis = proj.rfis || [];
                  const openRfis = rfis.filter(r => r.status === 'open' || r.status === 'draft');
                  const statusColors = { draft: 'bg-gray-100 text-gray-600', open: 'bg-amber-100 text-amber-700', answered: 'bg-blue-100 text-blue-700', closed: 'bg-emerald-100 text-emerald-700' };
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Requests for Information (RFIs)</h3>
                          <p className={`text-sm ${muted}`}>{rfis.length} total, {openRfis.length} open</p>
                        </div>
                        <button onClick={() => { setForm({ number: `RFI-${String(rfis.length + 1).padStart(3, '0')}`, subject: '', question: '', submittedBy: 'Preston', submittedTo: '', submittedDate: new Date().toISOString().split('T')[0], dueDate: '', response: '', respondedBy: '', respondedDate: null, status: 'draft', costImpact: null, scheduleImpact: '', attachments: [], linkedDrawing: '', notes: '' }); setModal('addRfi'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Create RFI</button>
                      </div>
                      
                      {rfis.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <FileText className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No RFIs yet</p>
                          <p className={`text-sm ${muted}`}>Create an RFI to request clarification from architects, engineers, or consultants</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {rfis.map(rfi => (
                            <div key={rfi.id} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                              <div className={`px-4 py-3 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} border-b ${border} flex flex-wrap items-center justify-between gap-2`}>
                                <div className="flex items-center gap-3">
                                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[rfi.status]}`}>{rfi.status}</span>
                                  <span className={`font-mono text-sm font-semibold ${text}`}>{rfi.number}</span>
                                  <span className={`text-sm ${text}`}>{rfi.subject}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {rfi.dueDate && new Date(rfi.dueDate) < new Date() && rfi.status !== 'closed' && (
                                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Overdue</span>
                                  )}
                                  <button onClick={() => { setSel(rfi); setForm(rfi); setModal('editRfi'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                  <button onClick={() => updateProj(projId, { rfis: (proj.rfis || []).filter(r => r.id !== rfi.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                </div>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                  <div><span className={muted}>Submitted:</span> <span className={text}>{rfi.submittedDate}</span></div>
                                  <div><span className={muted}>To:</span> <span className={text}>{rfi.submittedTo || '-'}</span></div>
                                  <div><span className={muted}>Due:</span> <span className={text}>{rfi.dueDate || '-'}</span></div>
                                  <div><span className={muted}>Drawing:</span> <span className={text}>{rfi.linkedDrawing || '-'}</span></div>
                                </div>
                                <div>
                                  <p className={`text-xs font-medium ${muted} uppercase mb-1`}>Question</p>
                                  <p className={`text-sm ${text}`}>{rfi.question}</p>
                                </div>
                                {rfi.response && (
                                  <div className={`p-3 rounded-lg ${dark ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                                    <p className={`text-xs font-medium text-emerald-600 uppercase mb-1`}>Response ({rfi.respondedDate})</p>
                                    <p className={`text-sm ${text}`}>{rfi.response}</p>
                                    {rfi.respondedBy && <p className={`text-xs ${muted} mt-1`}>— {rfi.respondedBy}</p>}
                                  </div>
                                )}
                                {(rfi.costImpact || rfi.scheduleImpact) && (
                                  <div className="flex gap-4 text-xs">
                                    {rfi.costImpact && <span><span className={muted}>Cost Impact:</span> <span className={`font-medium ${text}`}>${rfi.costImpact.toLocaleString()}</span></span>}
                                    {rfi.scheduleImpact && <span><span className={muted}>Schedule Impact:</span> <span className={`font-medium ${text}`}>{rfi.scheduleImpact}</span></span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* SUBMITTALS TAB */}
                {tab === 'submittals' && (() => {
                  const submittals = proj.submittals || [];
                  const pendingSubmittals = submittals.filter(s => s.status === 'pending' || s.status === 'draft');
                  const statusColors = { draft: 'bg-gray-100 text-gray-600', pending: 'bg-amber-100 text-amber-700', approved: 'bg-emerald-100 text-emerald-700', revise: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700' };
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Submittals</h3>
                          <p className={`text-sm ${muted}`}>{submittals.length} total, {pendingSubmittals.length} pending review</p>
                        </div>
                        <button onClick={() => { setForm({ number: `SUB-${String(submittals.length + 1).padStart(3, '0')}`, title: '', specSection: '', description: '', submittedBy: 'Preston', submittedTo: '', submittedDate: new Date().toISOString().split('T')[0], dueDate: '', status: 'draft', reviewedBy: '', reviewedDate: null, reviewNotes: '', attachments: [], linkedSpec: '', contractorId: null, notes: '' }); setModal('addSubmittal'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Create Submittal</button>
                      </div>
                      
                      {submittals.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <FileText className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No submittals yet</p>
                          <p className={`text-sm ${muted}`}>Track material and product approvals from architects and engineers</p>
                        </div>
                      ) : (
                        <div className={`${card} rounded-xl border ${border} overflow-hidden`}>
                          <table className="w-full">
                            <thead>
                              <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                                <th className="text-left px-4 py-3 font-medium">Number</th>
                                <th className="text-left px-4 py-3 font-medium">Title</th>
                                <th className="text-left px-4 py-3 font-medium">Spec Section</th>
                                <th className="text-left px-4 py-3 font-medium">Submitted</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="text-center px-4 py-3 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                              {submittals.map(sub => (
                                <tr key={sub.id} className={hover}>
                                  <td className="px-4 py-3"><span className={`font-mono text-sm ${text}`}>{sub.number}</span></td>
                                  <td className="px-4 py-3">
                                    <p className={`text-sm font-medium ${text}`}>{sub.title}</p>
                                    <p className={`text-xs ${muted} truncate max-w-[200px]`}>{sub.description}</p>
                                  </td>
                                  <td className="px-4 py-3"><span className={`text-sm ${muted}`}>{sub.specSection || '-'}</span></td>
                                  <td className="px-4 py-3"><span className={`text-sm ${muted}`}>{sub.submittedDate}</span></td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[sub.status]}`}>{sub.status === 'revise' ? 'Revise & Resubmit' : sub.status}</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-center gap-1">
                                      <button onClick={() => { setSel(sub); setForm(sub); setModal('editSubmittal'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                      <button onClick={() => updateProj(projId, { submittals: (proj.submittals || []).filter(s => s.id !== sub.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* CLIENT SELECTIONS TAB */}
                {tab === 'selections' && (() => {
                  const selections = proj.selections || [];
                  const pendingSelections = selections.filter(s => s.status === 'pending');
                  const approvedSelections = selections.filter(s => s.status === 'approved');
                  const totalAllowance = selections.reduce((s, sel) => s + (sel.allowance || 0), 0);
                  const totalActual = approvedSelections.reduce((s, sel) => s + (sel.actualCost || 0), 0);
                  const totalOverage = approvedSelections.reduce((s, sel) => s + Math.max(0, (sel.actualCost || 0) - (sel.allowance || 0)), 0);
                  
                  const groupedByCategory = SELECTION_CATEGORIES.map(cat => ({
                    category: cat,
                    items: selections.filter(s => s.category === cat)
                  })).filter(g => g.items.length > 0);
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Client Selections</h3>
                          <p className={`text-sm ${muted}`}>{pendingSelections.length} pending, {approvedSelections.length} approved</p>
                        </div>
                        <button onClick={() => { setForm({ category: 'Flooring', room: '', item: '', allowance: 0, actualCost: null, status: 'pending', selectedDate: null, approvedDate: null, approvedBy: null, vendor: '', sku: '', leadTime: '', notes: '', photos: [], specs: '', dueDate: '' }); setModal('addSelection'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Selection</button>
                      </div>
                      
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Total Allowances</p>
                          <p className={`text-xl font-bold ${text}`}>${totalAllowance.toLocaleString()}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Actual Cost</p>
                          <p className={`text-xl font-bold ${text}`}>${totalActual.toLocaleString()}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Client Overages</p>
                          <p className={`text-xl font-bold ${totalOverage > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>${totalOverage.toLocaleString()}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Pending Decisions</p>
                          <p className={`text-xl font-bold ${pendingSelections.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{pendingSelections.length}</p>
                        </div>
                      </div>
                      
                      {selections.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <Package className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No selections yet</p>
                          <p className={`text-sm ${muted}`}>Track client selections for flooring, cabinets, fixtures, and more</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {groupedByCategory.map(({ category, items }) => (
                            <div key={category} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                              <div className={`px-4 py-3 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} border-b ${border} flex justify-between items-center`}>
                                <h4 className={`font-semibold text-sm ${text}`}>{category}</h4>
                                <span className={`text-xs ${muted}`}>{items.filter(i => i.status === 'approved').length}/{items.length} approved</span>
                              </div>
                              <div className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                {items.map(sel => (
                                  <div key={sel.id} className={`px-4 py-3 ${hover}`}>
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                      <div className="flex-1 min-w-[200px]">
                                        <div className="flex items-center gap-2">
                                          <span className={`text-xs px-2 py-0.5 rounded-full ${sel.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{sel.status}</span>
                                          <span className={`text-sm font-medium ${text}`}>{sel.room || 'General'}</span>
                                        </div>
                                        {sel.item ? (
                                          <p className={`text-sm ${text} mt-1`}>{sel.item}</p>
                                        ) : (
                                          <p className={`text-sm ${muted} mt-1 italic`}>Awaiting selection</p>
                                        )}
                                        {sel.vendor && <p className={`text-xs ${muted}`}>{sel.vendor} {sel.sku && `• SKU: ${sel.sku}`}</p>}
                                        {sel.dueDate && sel.status === 'pending' && (
                                          <p className={`text-xs ${new Date(sel.dueDate) < new Date() ? 'text-red-600' : muted}`}>Due: {sel.dueDate}</p>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p className={`text-xs ${muted}`}>Allowance: ${(sel.allowance || 0).toLocaleString()}</p>
                                        {sel.actualCost !== null && (
                                          <>
                                            <p className={`text-sm font-medium ${text}`}>Actual: ${(sel.actualCost || 0).toLocaleString()}</p>
                                            {sel.actualCost > sel.allowance && (
                                              <p className="text-xs text-amber-600">+${(sel.actualCost - sel.allowance).toLocaleString()} overage</p>
                                            )}
                                          </>
                                        )}
                                      </div>
                                      <div className="flex gap-1">
                                        <button onClick={() => { setSel(sel); setForm(sel); setModal('editSelection'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                        <button onClick={() => updateProj(projId, { selections: (proj.selections || []).filter(s => s.id !== sel.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* DOCUMENTS TAB - Enhanced version of existing Files */}
                {tab === 'documents' && (() => {
                  const docs = proj.files || [];
                  const groupedByCategory = FILE_CATEGORIES.map(cat => ({
                    category: cat,
                    files: docs.filter(d => d.category === cat)
                  })).filter(g => g.files.length > 0);
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Project Documents</h3>
                          <p className={`text-sm ${muted}`}>{docs.length} documents</p>
                        </div>
                        <button onClick={() => { setForm({ category: 'Contracts', tags: [] }); setModal('addFile'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Upload Document</button>
                      </div>
                      
                      {docs.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <FileText className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No documents yet</p>
                          <p className={`text-sm ${muted}`}>Upload contracts, permits, plans, and other important files</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {FILE_CATEGORIES.map(cat => {
                            const catDocs = docs.filter(d => d.category === cat);
                            if (catDocs.length === 0) return null;
                            return (
                              <div key={cat} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                                <div className={`px-4 py-3 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} border-b ${border}`}>
                                  <h4 className={`font-semibold text-sm ${text}`}>{cat}</h4>
                                  <p className={`text-xs ${muted}`}>{catDocs.length} file{catDocs.length !== 1 ? 's' : ''}</p>
                                </div>
                                <div className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                  {catDocs.map(doc => (
                                    <div key={doc.id} className={`px-4 py-2 ${hover} flex items-center justify-between gap-2`}>
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileText className={`w-4 h-4 ${muted} shrink-0`} />
                                        <div className="min-w-0">
                                          <p className={`text-sm ${text} truncate`}>{doc.name}</p>
                                          <p className={`text-xs ${muted}`}>{doc.uploadedAt}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-1 shrink-0">
                                        <button onClick={() => { setSel(doc); setForm(doc); setModal('editFile'); }} className={`p-1 rounded ${hover}`}><Edit2 className="w-3 h-3 text-blue-600" /></button>
                                        <button onClick={() => updateProj(projId, { files: docs.filter(f => f.id !== doc.id) })} className={`p-1 rounded ${hover}`}><Trash2 className="w-3 h-3 text-red-500" /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* WARRANTY TAB */}
                {tab === 'warranty' && (() => {
                  const warranties = proj.warranties || [];
                  const activeWarranties = warranties.filter(w => !w.expirationDate || new Date(w.expirationDate) > new Date());
                  const expiringWarranties = warranties.filter(w => {
                    if (!w.expirationDate) return false;
                    const exp = new Date(w.expirationDate);
                    const now = new Date();
                    const days90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
                    return exp > now && exp < days90;
                  });
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Warranty Tracking</h3>
                          <p className={`text-sm ${muted}`}>{warranties.length} warranties, {expiringWarranties.length} expiring soon</p>
                        </div>
                        <button onClick={() => { setForm({ item: '', manufacturer: '', warrantyType: '', startDate: new Date().toISOString().split('T')[0], duration: '', coverage: '', registrationNumber: '', contactPhone: '', contactEmail: '', documents: [], notes: '', expirationDate: '' }); setModal('addWarranty'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Warranty</button>
                      </div>
                      
                      {warranties.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <FileText className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No warranties tracked yet</p>
                          <p className={`text-sm ${muted}`}>Keep track of all product and workmanship warranties for client handoff</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {expiringWarranties.length > 0 && (
                            <div className={`p-4 rounded-xl border-2 border-amber-500 ${dark ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                              <p className="text-sm font-medium text-amber-600 mb-2">⚠️ Expiring Soon (within 90 days)</p>
                              <div className="space-y-1">
                                {expiringWarranties.map(w => (
                                  <p key={w.id} className={`text-sm ${text}`}>{w.item} - Expires {w.expirationDate}</p>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {warranties.map(war => (
                            <div key={war.id} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                              <div className={`px-4 py-3 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} border-b ${border} flex flex-wrap items-center justify-between gap-2`}>
                                <div>
                                  <p className={`font-semibold ${text}`}>{war.item}</p>
                                  <p className={`text-xs ${muted}`}>{war.manufacturer} • {war.warrantyType}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {war.expirationDate && new Date(war.expirationDate) < new Date() && (
                                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Expired</span>
                                  )}
                                  <button onClick={() => { setSel(war); setForm(war); setModal('editWarranty'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                  <button onClick={() => updateProj(projId, { warranties: (proj.warranties || []).filter(w => w.id !== war.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                </div>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                  <div><span className={muted}>Start Date:</span> <span className={text}>{war.startDate}</span></div>
                                  <div><span className={muted}>Duration:</span> <span className={text}>{war.duration}</span></div>
                                  <div><span className={muted}>Expires:</span> <span className={text}>{war.expirationDate || 'Lifetime'}</span></div>
                                  <div><span className={muted}>Reg #:</span> <span className={text}>{war.registrationNumber || '-'}</span></div>
                                </div>
                                {war.coverage && (
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-1`}>Coverage</p>
                                    <p className={`text-sm ${text}`}>{war.coverage}</p>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-3 text-xs">
                                  {war.contactPhone && <span><Phone className="w-3 h-3 inline mr-1" />{war.contactPhone}</span>}
                                  {war.contactEmail && <span><Mail className="w-3 h-3 inline mr-1" />{war.contactEmail}</span>}
                                </div>
                                {war.notes && <p className={`text-xs ${muted}`}>{war.notes}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* TIME TRACKING TAB */}
                {tab === 'time-tracking' && (() => {
                  const entries = proj.timeEntries || [];
                  const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
                  const totalHours = entries.reduce((s, e) => s + (e.hours || 0), 0);
                  const billableHours = entries.filter(e => e.billable).reduce((s, e) => s + (e.hours || 0), 0);
                  const totalLaborCost = entries.filter(e => e.billable).reduce((s, e) => s + ((e.hours || 0) * (e.rate || 0)), 0);
                  
                  // Group by week
                  const groupedByDate = sortedEntries.reduce((acc, entry) => {
                    const date = entry.date;
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(entry);
                    return acc;
                  }, {});
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Time Tracking</h3>
                          <p className={`text-sm ${muted}`}>{entries.length} entries • {totalHours} total hours</p>
                        </div>
                        <button onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], workerName: '', hours: 0, taskId: null, phase: proj.phases[0], description: '', billable: false, rate: 0 }); setModal('addTimeEntry'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Time Entry</button>
                      </div>
                      
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Total Hours</p>
                          <p className={`text-xl font-bold ${text}`}>{totalHours.toFixed(1)}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Billable Hours</p>
                          <p className={`text-xl font-bold text-emerald-600`}>{billableHours.toFixed(1)}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Non-Billable</p>
                          <p className={`text-xl font-bold ${muted}`}>{(totalHours - billableHours).toFixed(1)}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Labor Cost</p>
                          <p className={`text-xl font-bold ${text}`}>${totalLaborCost.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {entries.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <Clock className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No time entries yet</p>
                          <p className={`text-sm ${muted}`}>Track labor hours for workers and subcontractors</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Object.keys(groupedByDate).map(date => (
                            <div key={date} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                              <div className={`px-4 py-2 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} border-b ${border} flex justify-between items-center`}>
                                <p className={`font-medium text-sm ${text}`}>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                <p className={`text-xs ${muted}`}>{groupedByDate[date].reduce((s, e) => s + (e.hours || 0), 0)} hours</p>
                              </div>
                              <div className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                {groupedByDate[date].map(entry => (
                                  <div key={entry.id} className={`px-4 py-3 ${hover} flex items-center justify-between`}>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${text}`}>{entry.workerName}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${entry.billable ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{entry.billable ? 'Billable' : 'Non-billable'}</span>
                                      </div>
                                      <p className={`text-xs ${muted}`}>{entry.phase}{entry.description && ` • ${entry.description}`}</p>
                                    </div>
                                    <div className="text-right mr-3">
                                      <p className={`text-sm font-medium ${text}`}>{entry.hours} hrs</p>
                                      {entry.billable && entry.rate > 0 && <p className={`text-xs ${muted}`}>${(entry.hours * entry.rate).toLocaleString()}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                      <button onClick={() => { setSel(entry); setForm(entry); setModal('editTimeEntry'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                      <button onClick={() => updateProj(projId, { timeEntries: (proj.timeEntries || []).filter(t => t.id !== entry.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* EQUIPMENT TAB */}
                {tab === 'equipment' && (() => {
                  const equipment = proj.equipment || [];
                  const onSite = equipment.filter(e => e.status === 'on_site');
                  const rented = equipment.filter(e => e.ownerType === 'rental');
                  const dailyRentalCost = onSite.filter(e => e.ownerType === 'rental').reduce((s, e) => s + (e.dailyRate || 0), 0);
                  
                  const statusColors = { on_site: 'bg-emerald-100 text-emerald-700', returned: 'bg-gray-100 text-gray-600', reserved: 'bg-blue-100 text-blue-700', maintenance: 'bg-amber-100 text-amber-700' };
                  const statusLabels = { on_site: 'On Site', returned: 'Returned', reserved: 'Reserved', maintenance: 'Maintenance' };
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Equipment & Tools</h3>
                          <p className={`text-sm ${muted}`}>{onSite.length} items on site • ${dailyRentalCost}/day in rentals</p>
                        </div>
                        <button onClick={() => { setForm({ name: '', type: 'Power Equipment', status: 'on_site', checkedOutDate: new Date().toISOString().split('T')[0], checkedOutBy: '', expectedReturn: '', ownerType: 'rental', rentalCompany: '', dailyRate: 0, notes: '' }); setModal('addEquipment'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Equipment</button>
                      </div>
                      
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>On Site</p>
                          <p className={`text-xl font-bold text-emerald-600`}>{onSite.length}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Rented Items</p>
                          <p className={`text-xl font-bold ${text}`}>{rented.length}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Daily Rental Cost</p>
                          <p className={`text-xl font-bold text-amber-600`}>${dailyRentalCost}</p>
                        </div>
                        <div className={`${card} rounded-xl border ${border} p-4`}>
                          <p className={`text-xs ${muted}`}>Total Items</p>
                          <p className={`text-xl font-bold ${text}`}>{equipment.length}</p>
                        </div>
                      </div>
                      
                      {equipment.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <Truck className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No equipment tracked yet</p>
                          <p className={`text-sm ${muted}`}>Track tools, equipment, and rentals on site</p>
                        </div>
                      ) : (
                        <div className={`${card} rounded-xl border ${border} overflow-hidden`}>
                          <table className="w-full">
                            <thead>
                              <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                                <th className="text-left px-4 py-3 font-medium">Equipment</th>
                                <th className="text-left px-4 py-3 font-medium">Type</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="text-left px-4 py-3 font-medium">Checked Out</th>
                                <th className="text-left px-4 py-3 font-medium">Return</th>
                                <th className="text-left px-4 py-3 font-medium">Daily Rate</th>
                                <th className="text-center px-4 py-3 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${dark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                              {equipment.map(eq => (
                                <tr key={eq.id} className={hover}>
                                  <td className="px-4 py-3">
                                    <p className={`text-sm font-medium ${text}`}>{eq.name}</p>
                                    {eq.ownerType === 'rental' && <p className={`text-xs ${muted}`}>{eq.rentalCompany}</p>}
                                    {eq.ownerType === 'owned' && <p className={`text-xs text-emerald-600`}>Company Owned</p>}
                                  </td>
                                  <td className="px-4 py-3"><span className={`text-sm ${text}`}>{eq.type}</span></td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[eq.status] || statusColors.on_site}`}>{statusLabels[eq.status] || eq.status}</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`text-sm ${text}`}>{eq.checkedOutDate || '-'}</span>
                                    {eq.checkedOutBy && <p className={`text-xs ${muted}`}>by {eq.checkedOutBy}</p>}
                                  </td>
                                  <td className="px-4 py-3">
                                    {eq.actualReturn ? (
                                      <span className={`text-sm text-emerald-600`}>{eq.actualReturn}</span>
                                    ) : eq.expectedReturn ? (
                                      <span className={`text-sm ${new Date(eq.expectedReturn) < new Date() ? 'text-red-600' : text}`}>{eq.expectedReturn}</span>
                                    ) : (
                                      <span className={`text-sm ${muted}`}>-</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {eq.dailyRate > 0 ? <span className={`text-sm ${text}`}>${eq.dailyRate}</span> : <span className={`text-sm ${muted}`}>-</span>}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-center gap-1">
                                      <button onClick={() => { setSel(eq); setForm(eq); setModal('editEquipment'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                      <button onClick={() => updateProj(projId, { equipment: (proj.equipment || []).filter(e => e.id !== eq.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* MEETING MINUTES TAB */}
                {tab === 'meetings' && (() => {
                  const meetings = proj.meetings || [];
                  const sortedMeetings = [...meetings].sort((a, b) => new Date(b.date) - new Date(a.date));
                  const openActionItems = meetings.flatMap(m => (m.actionItems || []).filter(a => a.status !== 'complete'));
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className={`font-semibold ${text}`}>Meeting Minutes</h3>
                          <p className={`text-sm ${muted}`}>{meetings.length} meetings • {openActionItems.length} open action items</p>
                        </div>
                        <button onClick={() => { setForm({ date: new Date().toISOString().split('T')[0], time: '', type: 'Progress Meeting', location: 'Jobsite', attendees: [], agenda: [], minutes: '', actionItems: [], attachments: [], notes: '' }); setModal('addMeeting'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Meeting</button>
                      </div>
                      
                      {/* Open Action Items Alert */}
                      {openActionItems.length > 0 && (
                        <div className={`p-4 rounded-xl border-2 border-amber-500 ${dark ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                          <p className="text-sm font-medium text-amber-600 mb-2">⚠️ Open Action Items ({openActionItems.length})</p>
                          <div className="space-y-1">
                            {openActionItems.slice(0, 5).map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className={text}>{item.item}</span>
                                <span className={muted}>{item.assignedTo} • Due {item.dueDate}</span>
                              </div>
                            ))}
                            {openActionItems.length > 5 && <p className={`text-xs ${muted}`}>+ {openActionItems.length - 5} more</p>}
                          </div>
                        </div>
                      )}
                      
                      {meetings.length === 0 ? (
                        <div className={`${card} rounded-xl border ${border} p-8 text-center`}>
                          <Users className={`w-12 h-12 mx-auto mb-3 ${muted} opacity-30`} />
                          <p className={muted}>No meetings recorded yet</p>
                          <p className={`text-sm ${muted}`}>Document meetings with clients, contractors, and inspectors</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {sortedMeetings.map(meeting => (
                            <div key={meeting.id} className={`${card} rounded-xl border ${border} overflow-hidden`}>
                              <div className={`px-4 py-3 ${dark ? 'bg-slate-700/50' : 'bg-gray-50'} border-b ${border} flex flex-wrap items-center justify-between gap-2`}>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700`}>{meeting.type}</span>
                                    <p className={`font-semibold ${text}`}>{new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    {meeting.time && <span className={muted}>@ {meeting.time}</span>}
                                  </div>
                                  <p className={`text-xs ${muted}`}>{meeting.location} • {(meeting.attendees || []).length} attendees</p>
                                </div>
                                <div className="flex gap-1">
                                  <button onClick={() => { setSel(meeting); setForm(meeting); setModal('editMeeting'); }} className={`p-1.5 rounded ${hover}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                                  <button onClick={() => updateProj(projId, { meetings: (proj.meetings || []).filter(m => m.id !== meeting.id) })} className={`p-1.5 rounded ${hover}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                </div>
                              </div>
                              <div className="p-4 space-y-4">
                                {/* Attendees */}
                                <div>
                                  <p className={`text-xs font-medium ${muted} uppercase mb-1`}>Attendees</p>
                                  <div className="flex flex-wrap gap-1">
                                    {(meeting.attendees || []).map((a, i) => (
                                      <span key={i} className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-slate-700' : 'bg-gray-100'} ${text}`}>{a}</span>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Minutes */}
                                {meeting.minutes && (
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-1`}>Minutes</p>
                                    <p className={`text-sm ${text}`}>{meeting.minutes}</p>
                                  </div>
                                )}
                                
                                {/* Action Items */}
                                {(meeting.actionItems || []).length > 0 && (
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-2`}>Action Items ({meeting.actionItems.length})</p>
                                    <div className="space-y-2">
                                      {meeting.actionItems.map((item, i) => (
                                        <div key={i} className={`flex items-start gap-2 text-sm ${item.status === 'complete' ? 'opacity-60' : ''}`}>
                                          <input 
                                            type="checkbox" 
                                            checked={item.status === 'complete'} 
                                            onChange={() => {
                                              const newStatus = item.status === 'complete' ? 'pending' : 'complete';
                                              const newItems = [...meeting.actionItems];
                                              newItems[i] = { ...item, status: newStatus };
                                              updateProj(projId, { meetings: (proj.meetings || []).map(m => m.id === meeting.id ? { ...m, actionItems: newItems } : m) });
                                            }}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                          />
                                          <div className="flex-1">
                                            <p className={`${text} ${item.status === 'complete' ? 'line-through' : ''}`}>{item.item}</p>
                                            <p className={`text-xs ${muted}`}>{item.assignedTo} • Due {item.dueDate}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {meeting.notes && (
                                  <div>
                                    <p className={`text-xs font-medium ${muted} uppercase mb-1`}>Notes</p>
                                    <p className={`text-sm ${muted}`}>{meeting.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* CONTRACTORS TAB */}
                {tab === 'contractors' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <h3 className={`font-semibold ${text}`}>Project Contractors</h3>
                      <button onClick={() => setModal('addProjectContractor')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm w-full sm:w-auto"><Plus className="w-4 h-4" />Add Contractor</button>
                    </div>
                    
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                        <input placeholder="Search contractors..." value={projContractorSearch} onChange={e => setProjContractorSearch(e.target.value)} className={`${inputCls} pl-10`} />
                      </div>
                      <select value={projContractorTradeFilter} onChange={e => setProjContractorTradeFilter(e.target.value)} className={`${selectCls} w-full sm:w-48`}>
                        <option value="all">All Trades</option>
                        {[...new Set(pcs.map(c => c.trade).filter(Boolean))].sort().map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    
                    {(() => {
                      const filteredPcs = pcs.filter(c => {
                        const matchesSearch = !projContractorSearch || c.name.toLowerCase().includes(projContractorSearch.toLowerCase()) || (c.trade && c.trade.toLowerCase().includes(projContractorSearch.toLowerCase()));
                        const matchesTrade = projContractorTradeFilter === 'all' || c.trade === projContractorTradeFilter;
                        return matchesSearch && matchesTrade;
                      });
                      
                      return (
                        <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {filteredPcs.map(c => {
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
                      {filteredPcs.length === 0 && <div className="p-8 text-center"><Briefcase className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{projContractorSearch || projContractorTradeFilter !== 'all' ? 'No contractors match filters' : 'No contractors added'}</p></div>}
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
                          {filteredPcs.map(c => {
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
                      {filteredPcs.length === 0 && <div className="p-8 text-center"><Briefcase className={`w-10 h-10 mx-auto mb-2 ${muted} opacity-30`} /><p className={muted}>{projContractorSearch || projContractorTradeFilter !== 'all' ? 'No contractors match filters' : 'No contractors added'}</p></div>}
                    </div>
                        </>
                      );
                    })()}

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
                            {proj.receipts.map(r => {
                              const linkedTask = r.taskId ? proj.tasks.find(t => t.id === r.taskId) : null;
                              return (
                              <div key={r.id} className={`${dark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-3`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div className="min-w-0 flex-1 mr-2">
                                    <p className={`font-medium ${text} truncate`}>{r.vendor}</p>
                                    <p className={`text-xs ${muted}`}>{fmtDate(r.date)}</p>
                                  </div>
                                  <div className="flex gap-1 flex-wrap justify-end">
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{r.category}</span>
                                    {linkedTask && <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-amber-100 text-amber-700">#{linkedTask.id}</span>}
                                  </div>
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
                            )})}
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
                                <th className="text-left px-4 py-2.5 font-medium">Task</th>
                                <th className="text-right px-4 py-2.5 font-medium">Amount</th>
                                <th className="text-center px-4 py-2.5 font-medium w-24">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {proj.receipts.map(r => {
                                const linkedTask = r.taskId ? proj.tasks.find(t => t.id === r.taskId) : null;
                                return (
                                <tr key={r.id} className={`border-t ${border} ${hover}`}>
                                  <td className={`px-4 py-2.5 ${text}`}>{fmtDate(r.date)}</td>
                                  <td className={`px-4 py-2.5 font-medium ${text}`}>{r.vendor}</td>
                                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">{r.category}</span></td>
                                  <td className={`px-4 py-2.5 ${muted} truncate max-w-48`}>{r.description || '-'}</td>
                                  <td className={`px-4 py-2.5 ${text}`}>
                                    {linkedTask ? (
                                      <span className="text-xs font-mono bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">#{linkedTask.id}</span>
                                    ) : (
                                      <span className={`text-xs ${muted}`}>—</span>
                                    )}
                                  </td>
                                  <td className={`px-4 py-2.5 text-right font-semibold ${text}`}>{fmt(r.amount)}</td>
                                  <td className="px-4 py-2.5 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      {r.fileData && <button onClick={() => { const link = document.createElement('a'); link.href = r.fileData; link.download = r.fileName || 'receipt'; link.click(); }} className={`p-1.5 hover:bg-blue-50 rounded text-blue-600`} title="Download"><FileText className="w-4 h-4" /></button>}
                                      <button onClick={() => { setForm(r); setSel(r); setModal('editReceipt'); }} className={`p-1.5 ${hover} rounded`} title="Edit"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                                      <button onClick={() => { if (confirm('Delete receipt?')) updateProj(projId, { receipts: proj.receipts.filter(x => x.id !== r.id) }); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                  </td>
                                </tr>
                              )})}
                              <tr className={`border-t ${border} ${dark ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                                <td colSpan="5" className={`px-4 py-2.5 font-semibold ${text}`}>Total</td>
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

                    {/* Cost by Task Section */}
                    <div className={`${card} rounded-xl border ${border}`}>
                      <div className={`px-4 py-3 border-b ${border}`}>
                        <h4 className={`font-semibold ${text}`}>Cost by Task</h4>
                        <p className={`text-xs ${muted}`}>Expenses linked to tasks</p>
                      </div>
                      {(() => {
                        const tasksWithCosts = proj.tasks.map(t => {
                          const receipts = (proj.receipts || []).filter(r => r.taskId === t.id);
                          const total = receipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
                          return { ...t, receipts, total };
                        }).filter(t => t.total > 0);
                        const unlinkedReceipts = (proj.receipts || []).filter(r => !r.taskId);
                        const unlinkedTotal = unlinkedReceipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
                        const grandTotal = (proj.receipts || []).reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
                        
                        return tasksWithCosts.length > 0 || unlinkedReceipts.length > 0 ? (
                          <>
                            {/* Mobile View */}
                            <div className="md:hidden p-3 space-y-2">
                              {tasksWithCosts.map(t => (
                                <div key={t.id} className={`${dark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-3`}>
                                  <div className="flex justify-between items-start">
                                    <div className="min-w-0 flex-1">
                                      <span className={`text-xs ${muted} font-mono`}>#{t.id}</span>
                                      <p className={`font-medium ${text} truncate`}>{t.task}</p>
                                      <p className={`text-xs ${muted}`}>{t.receipts.length} expense{t.receipts.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <span className={`font-semibold text-emerald-600`}>{fmt(t.total)}</span>
                                  </div>
                                </div>
                              ))}
                              {unlinkedTotal > 0 && (
                                <div className={`${dark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-3`}>
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className={`font-medium ${muted}`}>Unlinked Expenses</p>
                                      <p className={`text-xs ${muted}`}>{unlinkedReceipts.length} expense{unlinkedReceipts.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <span className={`font-semibold ${text}`}>{fmt(unlinkedTotal)}</span>
                                  </div>
                                </div>
                              )}
                              <div className={`${dark ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 flex justify-between items-center`}>
                                <span className={`font-semibold ${text}`}>Total</span>
                                <span className={`font-bold ${text}`}>{fmt(grandTotal)}</span>
                              </div>
                            </div>
                            {/* Desktop Table View */}
                            <table className="hidden md:table w-full text-sm">
                              <thead>
                                <tr className={`${dark ? 'bg-slate-700/50' : 'bg-gray-50'} text-xs ${muted} uppercase`}>
                                  <th className="text-left px-4 py-2.5 font-medium">Task</th>
                                  <th className="text-left px-4 py-2.5 font-medium">Phase</th>
                                  <th className="text-center px-4 py-2.5 font-medium">Expenses</th>
                                  <th className="text-right px-4 py-2.5 font-medium">Total Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tasksWithCosts.map(t => (
                                  <tr key={t.id} className={`border-t ${border} ${hover}`}>
                                    <td className={`px-4 py-2.5 ${text}`}>
                                      <span className={`text-xs ${muted} font-mono mr-2`}>#{t.id}</span>
                                      <span className="font-medium">{t.task}</span>
                                    </td>
                                    <td className={`px-4 py-2.5 ${muted}`}>{t.phase}</td>
                                    <td className={`px-4 py-2.5 text-center ${muted}`}>{t.receipts.length}</td>
                                    <td className={`px-4 py-2.5 text-right font-semibold text-emerald-600`}>{fmt(t.total)}</td>
                                  </tr>
                                ))}
                                {unlinkedTotal > 0 && (
                                  <tr className={`border-t ${border} ${hover}`}>
                                    <td className={`px-4 py-2.5 ${muted} italic`} colSpan="2">Unlinked Expenses</td>
                                    <td className={`px-4 py-2.5 text-center ${muted}`}>{unlinkedReceipts.length}</td>
                                    <td className={`px-4 py-2.5 text-right font-semibold ${text}`}>{fmt(unlinkedTotal)}</td>
                                  </tr>
                                )}
                                <tr className={`border-t ${border} ${dark ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                                  <td colSpan="3" className={`px-4 py-2.5 font-semibold ${text}`}>Total</td>
                                  <td className={`px-4 py-2.5 text-right font-bold ${text}`}>{fmt(grandTotal)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <div className="p-6 text-center"><Briefcase className={`w-8 h-8 mx-auto mb-2 ${muted} opacity-30`} /><p className={`text-sm ${muted}`}>No expenses linked to tasks yet</p><p className={`text-xs ${muted} mt-1`}>Link expenses when adding receipts</p></div>
                        );
                      })()}
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
                                    <select value={d.status} onChange={e => { e.stopPropagation(); updateProj(projId, { draws: proj.draws.map(dr => dr.id === d.id ? { ...dr, status: e.target.value, requestedDate: e.target.value !== 'pending' && !dr.requestedDate ? new Date().toISOString().split('T')[0] : dr.requestedDate, receivedDate: e.target.value === 'received' && !dr.receivedDate ? new Date().toISOString().split('T')[0] : dr.receivedDate } : dr) }); }} onClick={e => e.stopPropagation()} className={`text-xs px-3 py-1 rounded-full font-medium cursor-pointer ${d.status === 'received' ? 'bg-emerald-100 text-emerald-700' : d.status === 'requested' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`} style={{paddingRight: '1.5rem'}}>
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
                      <select value={matFilter} onChange={e => setMatFilter(e.target.value)} className={`${selectCls} w-full sm:w-40 py-2`}>
                        <option value="all">All Categories</option>
                        {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select value={matStatusFilter} onChange={e => setMatStatusFilter(e.target.value)} className={`${selectCls} w-full sm:w-40 py-2`}>
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
                              <select value={m.status} onChange={e => updateProj(projId, { materials: proj.materials.map(x => x.id === m.id ? { ...x, status: e.target.value } : x) })} className={`text-xs px-3 py-1 rounded-full font-medium cursor-pointer ${m.status === 'delivered' || m.status === 'installed' ? 'bg-emerald-100 text-emerald-700' : m.status === 'ordered' || m.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`} style={{paddingRight: '1.5rem'}}>
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
                                    <select value={m.status} onChange={e => { e.stopPropagation(); updateProj(projId, { materials: proj.materials.map(x => x.id === m.id ? { ...x, status: e.target.value, deliveredDate: e.target.value === 'delivered' && !x.deliveredDate ? new Date().toISOString().split('T')[0] : x.deliveredDate } : x) }); }} onClick={e => e.stopPropagation()} className={`text-xs px-3 py-1 rounded-full font-medium cursor-pointer ${m.status === 'delivered' || m.status === 'installed' ? 'bg-emerald-100 text-emerald-700' : m.status === 'ordered' || m.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`} style={{paddingRight: '1.5rem'}}>
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
                      <select value={photoFilter} onChange={e => setPhotoFilter(e.target.value)} className={`${selectCls} w-full sm:w-40 py-2`}>
                        <option value="all">All Phases</option>
                        {proj.phases.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select value={photoTagFilter} onChange={e => setPhotoTagFilter(e.target.value)} className={`${selectCls} w-full sm:w-40 py-2`}>
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
                        <select value={fileFilter} onChange={e => setFileFilter(e.target.value)} className={`${selectCls} flex-1 sm:w-40 py-2`}>
                          <option value="all">All Categories</option>
                          {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={fileSort} onChange={e => setFileSort(e.target.value)} className={`${selectCls} flex-1 sm:w-40 py-2`}>
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
                          <div><label className={`block text-sm ${muted} mb-1`}>County</label><select value={proj.county || ''} onChange={e => updateProj(projId, { county: e.target.value })} className={selectCls}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Status</label><select value={proj.status} onChange={e => updateProj(projId, { status: e.target.value })} className={selectCls}><option value="active">Active</option><option value="on_hold">On Hold</option><option value="completed">Completed</option></select></div>
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
                {modal === 'editContact' && 'Edit Contact'}
                {modal === 'logConversation' && 'Log Conversation'}
                {modal === 'editConversation' && 'Edit Conversation'}
                {modal === 'addTask' && 'Add Task'}
                {modal === 'editTask' && 'Edit Task'}
                {modal === 'editTaskNotes' && 'Task Notes'}
                {modal === 'editTaskActualCost' && 'Actual Cost'}
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
                {modal === 'addDailyLog' && 'Add Daily Log'}
                {modal === 'editDailyLog' && 'Edit Daily Log'}
                {modal === 'addPunchItem' && 'Add Punch List Item'}
                {modal === 'editPunchItem' && 'Edit Punch List Item'}
                {modal === 'addRfi' && 'Create RFI'}
                {modal === 'editRfi' && 'Edit RFI'}
                {modal === 'addSubmittal' && 'Create Submittal'}
                {modal === 'editSubmittal' && 'Edit Submittal'}
                {modal === 'addSelection' && 'Add Client Selection'}
                {modal === 'editSelection' && 'Edit Client Selection'}
                {modal === 'addWarranty' && 'Add Warranty'}
                {modal === 'editWarranty' && 'Edit Warranty'}
                {modal === 'addMeeting' && 'Add Meeting Minutes'}
                {modal === 'editMeeting' && 'Edit Meeting Minutes'}
                {modal === 'addTimeEntry' && 'Add Time Entry'}
                {modal === 'editTimeEntry' && 'Edit Time Entry'}
                {modal === 'addEquipment' && 'Add Equipment'}
                {modal === 'editEquipment' && 'Edit Equipment'}
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
                      <div><label className={`block text-sm ${muted} mb-1`}>County</label><select value={form.county || counties[0]?.name} onChange={e => setForm({ ...form, county: e.target.value })} className={selectCls}>{counties.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
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
                          <div><label className={`block text-sm ${muted} mb-1`}>Loan Amount</label><input type="text" value={formatWithCommas(form.financing?.loanAmount)} onChange={e => setForm({ ...form, financing: { ...form.financing, loanAmount: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Interest Rate (%)</label><input type="text" value={form.financing?.interestRate || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, interestRate: e.target.value.replace(/[^0-9.]/g, '') } })} className={inputCls} placeholder="10.5" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Term (months)</label><input type="text" value={form.financing?.term || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, term: e.target.value.replace(/\D/g, '') } })} className={inputCls} placeholder="12" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Expiration Date</label><input type="date" value={form.financing?.expirationDate || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, expirationDate: e.target.value } })} className={inputCls} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Points (%)</label><input type="text" value={form.financing?.points || ''} onChange={e => setForm({ ...form, financing: { ...form.financing, points: e.target.value.replace(/[^0-9.]/g, '') } })} className={inputCls} placeholder="1.5" /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Origination Fee</label><input type="text" value={formatWithCommas(form.financing?.originationFee)} onChange={e => setForm({ ...form, financing: { ...form.financing, originationFee: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                        </div>
                      </div>
                    )}

                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-blue-50'} border ${dark ? 'border-slate-600' : 'border-blue-200'} mt-6`}>
                      <p className={`text-sm font-medium ${dark ? 'text-blue-300' : 'text-blue-800'}`}>Initial Costs</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Lot Cost</label><input type="text" value={formatWithCommas(form.costs?.lot)} onChange={e => setForm({ ...form, costs: { ...form.costs, lot: parseCurrency(e.target.value) } })} className={inputCls} placeholder="1,234.56" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Sale Price</label><input type="text" value={formatWithCommas(form.salePrice)} onChange={e => setForm({ ...form, salePrice: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
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
                        tasks: TASKS.map((t, i) => ({ ...t, id: i + 1, status: 'pending', assignedTo: null })),
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Amount *</label><input type="text" placeholder="1,234.56" value={formatWithCommas(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Date *</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Method</label><select value={form.method || 'check'} onChange={e => setForm({ ...form, method: e.target.value })} className={selectCls}>{METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</select></div>
                    {METHODS.find(m => m.id === form.method)?.needsRef && <div><label className={`block text-sm ${muted} mb-1`}>{METHODS.find(m => m.id === form.method)?.refLabel}</label><input type="text" value={form.refNumber || ''} onChange={e => setForm({ ...form, refNumber: e.target.value })} className={inputCls} /></div>}
                    <div><label className={`block text-sm ${muted} mb-1`}>Account</label><select value={form.account || 'Business Checking'} onChange={e => setForm({ ...form, account: e.target.value })} className={selectCls}>{ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Link to Task</label>
                      <select value={form.taskId || ''} onChange={e => setForm({ ...form, taskId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                        <option value="">-- No task linked --</option>
                        {proj?.tasks.map(t => <option key={t.id} value={t.id}>#{t.id} - {t.task}</option>)}
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label><select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}><option value="">-- Select or leave blank --</option>{contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    {!form.contractorId && <div><label className={`block text-sm ${muted} mb-1`}>Vendor Name</label><input type="text" value={form.vendorName || ''} onChange={e => setForm({ ...form, vendorName: e.target.value })} className={inputCls} placeholder="If not in directory" /></div>}
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade *</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={selectCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description *</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Amount *</label><input type="text" value={formatWithCommas(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Link to Task</label>
                      <select value={form.taskId || ''} onChange={e => setForm({ ...form, taskId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                        <option value="">-- No task linked --</option>
                        {proj?.tasks.map(t => <option key={t.id} value={t.id}>#{t.id} - {t.task}</option>)}
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label><select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}><option value="">-- None --</option>{contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={selectCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Amount</label><input type="text" value={formatWithCommas(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Status</label><select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Est. Cost</label><input type="text" value={formatWithCommas(form.cost)} onChange={e => setForm({ ...form, cost: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Decision</label><select value={form.status || 'approved'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}><option value="approved">Approve</option><option value="rejected">Reject</option></select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Cost Impact</label><input type="text" value={formatWithCommas(form.cost)} onChange={e => setForm({ ...form, cost: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => { updateProj(projId, { changeRequests: proj.changeRequests.map(r => r.id === sel.id ? { ...r, status: form.status, cost: form.cost ? parseFloat(form.cost) : r.cost, notes: form.notes || r.notes, respondedAt: new Date().toISOString().split('T')[0] } : r) }); closeModal(); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Submit</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT DAILY LOG */}
              {(modal === 'addDailyLog' || modal === 'editDailyLog') && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date *</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Weather</label>
                        <select value={form.weather || 'sunny'} onChange={e => setForm({ ...form, weather: e.target.value })} className={selectCls}>
                          <option value="sunny">☀️ Sunny</option>
                          <option value="cloudy">☁️ Cloudy</option>
                          <option value="partly-cloudy">⛅ Partly Cloudy</option>
                          <option value="rainy">🌧️ Rainy</option>
                          <option value="stormy">⛈️ Stormy</option>
                          <option value="snowy">🌨️ Snowy</option>
                          <option value="windy">💨 Windy</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>High Temp (°F)</label><input type="number" value={form.tempHigh || ''} onChange={e => setForm({ ...form, tempHigh: parseInt(e.target.value) || '' })} className={inputCls} placeholder="72" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Low Temp (°F)</label><input type="number" value={form.tempLow || ''} onChange={e => setForm({ ...form, tempLow: parseInt(e.target.value) || '' })} className={inputCls} placeholder="55" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Work Performed *</label><textarea value={form.workPerformed || ''} onChange={e => setForm({ ...form, workPerformed: e.target.value })} className={`${inputCls} h-24`} placeholder="Describe work completed today..." /></div>
                    
                    {/* Workers Section */}
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <label className={`text-sm font-medium ${text}`}>Workers on Site</label>
                        <button onClick={() => setForm({ ...form, workers: [...(form.workers || []), { name: '', hours: 8 }] })} className="text-xs text-blue-600 hover:text-blue-700">+ Add Worker</button>
                      </div>
                      {(form.workers || []).map((w, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input type="text" value={w.name} onChange={e => { const workers = [...(form.workers || [])]; workers[i].name = e.target.value; setForm({ ...form, workers }); }} className={`${inputCls} flex-1`} placeholder="Worker name/company" />
                          <input type="number" value={w.hours} onChange={e => { const workers = [...(form.workers || [])]; workers[i].hours = parseFloat(e.target.value) || 0; setForm({ ...form, workers }); }} className={`${inputCls} w-20`} placeholder="Hours" />
                          <button onClick={() => setForm({ ...form, workers: (form.workers || []).filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {(form.workers || []).length === 0 && <p className={`text-xs ${muted}`}>No workers added</p>}
                    </div>
                    
                    {/* Deliveries Section */}
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <label className={`text-sm font-medium ${text}`}>Deliveries</label>
                        <button onClick={() => setForm({ ...form, deliveries: [...(form.deliveries || []), { item: '', vendor: '', quantity: '' }] })} className="text-xs text-blue-600 hover:text-blue-700">+ Add Delivery</button>
                      </div>
                      {(form.deliveries || []).map((d, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input type="text" value={d.item} onChange={e => { const deliveries = [...(form.deliveries || [])]; deliveries[i].item = e.target.value; setForm({ ...form, deliveries }); }} className={`${inputCls} flex-1`} placeholder="Item" />
                          <input type="text" value={d.vendor} onChange={e => { const deliveries = [...(form.deliveries || [])]; deliveries[i].vendor = e.target.value; setForm({ ...form, deliveries }); }} className={`${inputCls} flex-1`} placeholder="Vendor" />
                          <input type="text" value={d.quantity} onChange={e => { const deliveries = [...(form.deliveries || [])]; deliveries[i].quantity = e.target.value; setForm({ ...form, deliveries }); }} className={`${inputCls} w-24`} placeholder="Qty" />
                          <button onClick={() => setForm({ ...form, deliveries: (form.deliveries || []).filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {(form.deliveries || []).length === 0 && <p className={`text-xs ${muted}`}>No deliveries</p>}
                    </div>
                    
                    {/* Visitors Section */}
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <label className={`text-sm font-medium ${text}`}>Visitors</label>
                        <button onClick={() => setForm({ ...form, visitors: [...(form.visitors || []), { name: '', purpose: '', time: '' }] })} className="text-xs text-blue-600 hover:text-blue-700">+ Add Visitor</button>
                      </div>
                      {(form.visitors || []).map((v, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input type="text" value={v.name} onChange={e => { const visitors = [...(form.visitors || [])]; visitors[i].name = e.target.value; setForm({ ...form, visitors }); }} className={`${inputCls} flex-1`} placeholder="Name" />
                          <input type="text" value={v.purpose} onChange={e => { const visitors = [...(form.visitors || [])]; visitors[i].purpose = e.target.value; setForm({ ...form, visitors }); }} className={`${inputCls} flex-1`} placeholder="Purpose" />
                          <input type="time" value={v.time} onChange={e => { const visitors = [...(form.visitors || [])]; visitors[i].time = e.target.value; setForm({ ...form, visitors }); }} className={`${inputCls} w-28`} />
                          <button onClick={() => setForm({ ...form, visitors: (form.visitors || []).filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {(form.visitors || []).length === 0 && <p className={`text-xs ${muted}`}>No visitors</p>}
                    </div>
                    
                    <div><label className={`block text-sm ${muted} mb-1`}>Delays / Issues</label><textarea value={form.delays || ''} onChange={e => setForm({ ...form, delays: e.target.value })} className={`${inputCls} h-16`} placeholder="Document any delays or issues..." /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Safety Notes</label><textarea value={form.safety || ''} onChange={e => setForm({ ...form, safety: e.target.value })} className={`${inputCls} h-16`} placeholder="Safety observations, incidents, PPE compliance..." /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Additional Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.date || !form.workPerformed) return alert('Date and work performed are required');
                      if (modal === 'addDailyLog') {
                        const newLog = { ...form, id: Date.now() };
                        updateProj(projId, { dailyLogs: [...(proj.dailyLogs || []), newLog] });
                      } else {
                        updateProj(projId, { dailyLogs: (proj.dailyLogs || []).map(l => l.id === sel.id ? { ...l, ...form } : l) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addDailyLog' ? 'Add Log' : 'Save Changes'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT PUNCH LIST ITEM */}
              {(modal === 'addPunchItem' || modal === 'editPunchItem') && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Item Description *</label><input type="text" value={form.item || ''} onChange={e => setForm({ ...form, item: e.target.value })} className={inputCls} placeholder="e.g., Touch up paint in master bedroom" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Location</label>
                        <select value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} className={selectCls}>
                          <option value="">Select location...</option>
                          {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Priority</label>
                        <select value={form.priority || 'medium'} onChange={e => setForm({ ...form, priority: e.target.value })} className={selectCls}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Assigned To</label>
                        <select value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                          <option value="">Select contractor...</option>
                          {contractors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.trade})</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Due Date</label><input type="date" value={form.dueDate || ''} onChange={e => setForm({ ...form, dueDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                      <select value={form.status || 'open'} onChange={e => setForm({ ...form, status: e.target.value, completedAt: e.target.value === 'complete' ? new Date().toISOString().split('T')[0] : null })} className={selectCls}>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} placeholder="Additional details..." /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.item) return alert('Item description is required');
                      if (modal === 'addPunchItem') {
                        const newItem = { ...form, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
                        updateProj(projId, { punchList: [...(proj.punchList || []), newItem] });
                      } else {
                        updateProj(projId, { punchList: (proj.punchList || []).map(p => p.id === sel.id ? { ...p, ...form } : p) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addPunchItem' ? 'Add Item' : 'Save Changes'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT RFI */}
              {(modal === 'addRfi' || modal === 'editRfi') && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>RFI Number</label><input type="text" value={form.number || ''} onChange={e => setForm({ ...form, number: e.target.value })} className={inputCls} placeholder="RFI-001" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'draft'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
                          <option value="draft">Draft</option>
                          <option value="open">Open (Sent)</option>
                          <option value="answered">Answered</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Subject *</label><input type="text" value={form.subject || ''} onChange={e => setForm({ ...form, subject: e.target.value })} className={inputCls} placeholder="Brief description of the question" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Question *</label><textarea value={form.question || ''} onChange={e => setForm({ ...form, question: e.target.value })} className={`${inputCls} h-24`} placeholder="Detailed question or clarification needed..." /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Submitted By</label><input type="text" value={form.submittedBy || ''} onChange={e => setForm({ ...form, submittedBy: e.target.value })} className={inputCls} placeholder="Your name" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Submitted To</label><input type="text" value={form.submittedTo || ''} onChange={e => setForm({ ...form, submittedTo: e.target.value })} className={inputCls} placeholder="Architect, Engineer, etc." /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date Submitted</label><input type="date" value={form.submittedDate || ''} onChange={e => setForm({ ...form, submittedDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Due Date</label><input type="date" value={form.dueDate || ''} onChange={e => setForm({ ...form, dueDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Related Drawing/Spec</label><input type="text" value={form.linkedDrawing || ''} onChange={e => setForm({ ...form, linkedDrawing: e.target.value })} className={inputCls} placeholder="e.g., A-201, Section 07310" /></div>
                    
                    {(form.status === 'answered' || form.status === 'closed') && (
                      <div className={`p-3 rounded-lg ${dark ? 'bg-emerald-900/20' : 'bg-emerald-50'} space-y-3`}>
                        <p className={`text-sm font-medium text-emerald-600`}>Response</p>
                        <div><label className={`block text-sm ${muted} mb-1`}>Response</label><textarea value={form.response || ''} onChange={e => setForm({ ...form, response: e.target.value })} className={`${inputCls} h-20`} placeholder="Answer to the RFI..." /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Responded By</label><input type="text" value={form.respondedBy || ''} onChange={e => setForm({ ...form, respondedBy: e.target.value })} className={inputCls} /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Response Date</label><input type="date" value={form.respondedDate || ''} onChange={e => setForm({ ...form, respondedDate: e.target.value })} className={inputCls} /></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Cost Impact ($)</label><input type="text" value={formatWithCommas(form.costImpact)} onChange={e => setForm({ ...form, costImpact: parseCurrency(e.target.value) || null })} className={inputCls} placeholder="0.00" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Schedule Impact</label><input type="text" value={form.scheduleImpact || ''} onChange={e => setForm({ ...form, scheduleImpact: e.target.value })} className={inputCls} placeholder="e.g., 3 days delay" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.subject || !form.question) return alert('Subject and question are required');
                      if (modal === 'addRfi') {
                        const newRfi = { ...form, id: Date.now() };
                        updateProj(projId, { rfis: [...(proj.rfis || []), newRfi] });
                      } else {
                        updateProj(projId, { rfis: (proj.rfis || []).map(r => r.id === sel.id ? { ...r, ...form } : r) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addRfi' ? 'Create RFI' : 'Save Changes'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT SUBMITTAL */}
              {(modal === 'addSubmittal' || modal === 'editSubmittal') && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Submittal Number</label><input type="text" value={form.number || ''} onChange={e => setForm({ ...form, number: e.target.value })} className={inputCls} placeholder="SUB-001" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Spec Section</label><input type="text" value={form.specSection || ''} onChange={e => setForm({ ...form, specSection: e.target.value })} className={inputCls} placeholder="e.g., 07310" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Title *</label><input type="text" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="e.g., Roofing Shingles" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} h-20`} placeholder="Product details, manufacturer, model..." /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Submitted By</label><input type="text" value={form.submittedBy || ''} onChange={e => setForm({ ...form, submittedBy: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Submitted To</label><input type="text" value={form.submittedTo || ''} onChange={e => setForm({ ...form, submittedTo: e.target.value })} className={inputCls} placeholder="Architect, Engineer" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date Submitted</label><input type="date" value={form.submittedDate || ''} onChange={e => setForm({ ...form, submittedDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Due Date</label><input type="date" value={form.dueDate || ''} onChange={e => setForm({ ...form, dueDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label>
                      <select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                        <option value="">Select contractor...</option>
                        {contractors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.trade})</option>)}
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                      <select value={form.status || 'draft'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="revise">Revise & Resubmit</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    {(form.status === 'approved' || form.status === 'revise' || form.status === 'rejected') && (
                      <div className={`p-3 rounded-lg ${form.status === 'approved' ? (dark ? 'bg-emerald-900/20' : 'bg-emerald-50') : form.status === 'rejected' ? (dark ? 'bg-red-900/20' : 'bg-red-50') : (dark ? 'bg-amber-900/20' : 'bg-amber-50')} space-y-3`}>
                        <p className={`text-sm font-medium ${form.status === 'approved' ? 'text-emerald-600' : form.status === 'rejected' ? 'text-red-600' : 'text-amber-600'}`}>Review Response</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={`block text-sm ${muted} mb-1`}>Reviewed By</label><input type="text" value={form.reviewedBy || ''} onChange={e => setForm({ ...form, reviewedBy: e.target.value })} className={inputCls} /></div>
                          <div><label className={`block text-sm ${muted} mb-1`}>Review Date</label><input type="date" value={form.reviewedDate || ''} onChange={e => setForm({ ...form, reviewedDate: e.target.value })} className={inputCls} /></div>
                        </div>
                        <div><label className={`block text-sm ${muted} mb-1`}>Review Notes</label><textarea value={form.reviewNotes || ''} onChange={e => setForm({ ...form, reviewNotes: e.target.value })} className={`${inputCls} h-16`} placeholder="Reviewer comments..." /></div>
                      </div>
                    )}
                    
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.title) return alert('Title is required');
                      if (modal === 'addSubmittal') {
                        const newSubmittal = { ...form, id: Date.now() };
                        updateProj(projId, { submittals: [...(proj.submittals || []), newSubmittal] });
                      } else {
                        updateProj(projId, { submittals: (proj.submittals || []).map(s => s.id === sel.id ? { ...s, ...form } : s) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addSubmittal' ? 'Create Submittal' : 'Save Changes'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT CLIENT SELECTION */}
              {(modal === 'addSelection' || modal === 'editSelection') && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Category *</label>
                        <select value={form.category || 'Flooring'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>
                          {SELECTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Room/Location</label>
                        <select value={form.room || ''} onChange={e => setForm({ ...form, room: e.target.value })} className={selectCls}>
                          <option value="">Select room...</option>
                          {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Selected Item</label><input type="text" value={form.item || ''} onChange={e => setForm({ ...form, item: e.target.value })} className={inputCls} placeholder="e.g., Hardwood - Oak Natural" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Allowance ($)</label><input type="text" value={formatWithCommas(form.allowance)} onChange={e => setForm({ ...form, allowance: parseCurrency(e.target.value) })} className={inputCls} placeholder="Budget amount" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Actual Cost ($)</label><input type="text" value={form.actualCost !== null ? formatWithCommas(form.actualCost) : ''} onChange={e => setForm({ ...form, actualCost: e.target.value ? parseCurrency(e.target.value) : null })} className={inputCls} placeholder="Final cost" /></div>
                    </div>
                    {form.actualCost && form.allowance && form.actualCost > form.allowance && (
                      <div className={`p-2 rounded-lg ${dark ? 'bg-amber-900/20' : 'bg-amber-50'} text-amber-700 text-sm`}>
                        ⚠️ Overage: ${(form.actualCost - form.allowance).toLocaleString()} above allowance
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Vendor</label><input type="text" value={form.vendor || ''} onChange={e => setForm({ ...form, vendor: e.target.value })} className={inputCls} placeholder="Store/supplier name" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>SKU/Model #</label><input type="text" value={form.sku || ''} onChange={e => setForm({ ...form, sku: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Lead Time</label><input type="text" value={form.leadTime || ''} onChange={e => setForm({ ...form, leadTime: e.target.value })} className={inputCls} placeholder="e.g., 2 weeks" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Due Date (if pending)</label><input type="date" value={form.dueDate || ''} onChange={e => setForm({ ...form, dueDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                      <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value, approvedDate: e.target.value === 'approved' ? new Date().toISOString().split('T')[0] : form.approvedDate })} className={selectCls}>
                        <option value="pending">Pending Selection</option>
                        <option value="selected">Selected - Awaiting Approval</option>
                        <option value="approved">Approved</option>
                        <option value="ordered">Ordered</option>
                        <option value="delivered">Delivered</option>
                        <option value="installed">Installed</option>
                      </select>
                    </div>
                    {form.status === 'approved' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={`block text-sm ${muted} mb-1`}>Approved Date</label><input type="date" value={form.approvedDate || ''} onChange={e => setForm({ ...form, approvedDate: e.target.value })} className={inputCls} /></div>
                        <div><label className={`block text-sm ${muted} mb-1`}>Approved By</label><input type="text" value={form.approvedBy || ''} onChange={e => setForm({ ...form, approvedBy: e.target.value })} className={inputCls} placeholder="Client name" /></div>
                      </div>
                    )}
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} placeholder="Additional details..." /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.category) return alert('Category is required');
                      if (modal === 'addSelection') {
                        const newSelection = { ...form, id: Date.now() };
                        updateProj(projId, { selections: [...(proj.selections || []), newSelection] });
                      } else {
                        updateProj(projId, { selections: (proj.selections || []).map(s => s.id === sel.id ? { ...s, ...form } : s) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addSelection' ? 'Add Selection' : 'Save Changes'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT WARRANTY */}
              {(modal === 'addWarranty' || modal === 'editWarranty') && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Item/Product *</label><input type="text" value={form.item || ''} onChange={e => setForm({ ...form, item: e.target.value })} className={inputCls} placeholder="e.g., Roofing - Shingles" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Manufacturer</label><input type="text" value={form.manufacturer || ''} onChange={e => setForm({ ...form, manufacturer: e.target.value })} className={inputCls} placeholder="e.g., GAF" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Warranty Type</label><input type="text" value={form.warrantyType || ''} onChange={e => setForm({ ...form, warrantyType: e.target.value })} className={inputCls} placeholder="e.g., Limited Lifetime" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Start Date</label><input type="date" value={form.startDate || ''} onChange={e => setForm({ ...form, startDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Duration</label><input type="text" value={form.duration || ''} onChange={e => setForm({ ...form, duration: e.target.value })} className={inputCls} placeholder="e.g., 10 years" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Expiration Date</label><input type="date" value={form.expirationDate || ''} onChange={e => setForm({ ...form, expirationDate: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Coverage Details</label><textarea value={form.coverage || ''} onChange={e => setForm({ ...form, coverage: e.target.value })} className={`${inputCls} h-20`} placeholder="What does the warranty cover?" /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Registration Number</label><input type="text" value={form.registrationNumber || ''} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} className={inputCls} placeholder="Warranty registration #" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Contact Phone</label><input type="tel" value={form.contactPhone || ''} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className={inputCls} placeholder="1-800-XXX-XXXX" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Contact Email</label><input type="email" value={form.contactEmail || ''} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} placeholder="Additional notes, maintenance requirements..." /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.item) return alert('Item/Product is required');
                      if (modal === 'addWarranty') {
                        const newWarranty = { ...form, id: Date.now() };
                        updateProj(projId, { warranties: [...(proj.warranties || []), newWarranty] });
                      } else {
                        updateProj(projId, { warranties: (proj.warranties || []).map(w => w.id === sel.id ? { ...w, ...form } : w) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addWarranty' ? 'Add Warranty' : 'Save Changes'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT TIME ENTRY */}
              {(modal === 'addTimeEntry' || modal === 'editTimeEntry') && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date *</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Hours *</label><input type="number" step="0.5" value={form.hours || ''} onChange={e => setForm({ ...form, hours: parseFloat(e.target.value) || 0 })} className={inputCls} placeholder="8" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Worker Name *</label><input type="text" value={form.workerName || ''} onChange={e => setForm({ ...form, workerName: e.target.value })} className={inputCls} placeholder="Name or company" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Phase</label>
                        <select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={selectCls}>
                          <option value="">Select phase...</option>
                          {(proj?.phases || PHASES).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Task</label>
                        <select value={form.taskId || ''} onChange={e => setForm({ ...form, taskId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                          <option value="">Select task...</option>
                          {(proj?.tasks || []).map(t => <option key={t.id} value={t.id}>{t.task}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} h-16`} placeholder="Work performed..." /></div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.billable || false} onChange={e => setForm({ ...form, billable: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className={`text-sm ${text}`}>Billable</span>
                      </label>
                      {form.billable && (
                        <div className="flex-1"><label className={`block text-sm ${muted} mb-1`}>Rate ($/hr)</label><input type="number" value={form.rate || ''} onChange={e => setForm({ ...form, rate: parseFloat(e.target.value) || 0 })} className={inputCls} placeholder="45" /></div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.date || !form.workerName || !form.hours) return alert('Date, worker name, and hours are required');
                      if (modal === 'addTimeEntry') {
                        updateProj(projId, { timeEntries: [...(proj.timeEntries || []), { ...form, id: Date.now() }] });
                      } else {
                        updateProj(projId, { timeEntries: (proj.timeEntries || []).map(t => t.id === sel.id ? { ...t, ...form } : t) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addTimeEntry' ? 'Add Entry' : 'Save'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT EQUIPMENT */}
              {(modal === 'addEquipment' || modal === 'editEquipment') && (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Equipment Name *</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g., Excavator - CAT 308" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Type</label>
                        <select value={form.type || 'Power Equipment'} onChange={e => setForm({ ...form, type: e.target.value })} className={selectCls}>
                          <option value="Heavy Equipment">Heavy Equipment</option>
                          <option value="Power Equipment">Power Equipment</option>
                          <option value="Hand Tools">Hand Tools</option>
                          <option value="Scaffolding">Scaffolding</option>
                          <option value="Safety Equipment">Safety Equipment</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'on_site'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
                          <option value="on_site">On Site</option>
                          <option value="returned">Returned</option>
                          <option value="reserved">Reserved</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Ownership</label>
                      <select value={form.ownerType || 'rental'} onChange={e => setForm({ ...form, ownerType: e.target.value })} className={selectCls}>
                        <option value="rental">Rental</option>
                        <option value="owned">Company Owned</option>
                        <option value="vendor">Vendor Provided</option>
                      </select>
                    </div>
                    {form.ownerType === 'rental' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={`block text-sm ${muted} mb-1`}>Rental Company</label><input type="text" value={form.rentalCompany || ''} onChange={e => setForm({ ...form, rentalCompany: e.target.value })} className={inputCls} placeholder="e.g., Sunbelt Rentals" /></div>
                        <div><label className={`block text-sm ${muted} mb-1`}>Daily Rate ($)</label><input type="number" value={form.dailyRate || ''} onChange={e => setForm({ ...form, dailyRate: parseFloat(e.target.value) || 0 })} className={inputCls} placeholder="150" /></div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Checked Out Date</label><input type="date" value={form.checkedOutDate || ''} onChange={e => setForm({ ...form, checkedOutDate: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Checked Out By</label><input type="text" value={form.checkedOutBy || ''} onChange={e => setForm({ ...form, checkedOutBy: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Expected Return</label><input type="date" value={form.expectedReturn || ''} onChange={e => setForm({ ...form, expectedReturn: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Actual Return</label><input type="date" value={form.actualReturn || ''} onChange={e => setForm({ ...form, actualReturn: e.target.value })} className={inputCls} /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.name) return alert('Equipment name is required');
                      if (modal === 'addEquipment') {
                        updateProj(projId, { equipment: [...(proj.equipment || []), { ...form, id: Date.now() }] });
                      } else {
                        updateProj(projId, { equipment: (proj.equipment || []).map(e => e.id === sel.id ? { ...e, ...form } : e) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addEquipment' ? 'Add Equipment' : 'Save'}</button>
                  </div>
                </>
              )}

              {/* ADD/EDIT MEETING */}
              {(modal === 'addMeeting' || modal === 'editMeeting') && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date *</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Time</label><input type="time" value={form.time || ''} onChange={e => setForm({ ...form, time: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Type</label>
                        <select value={form.type || 'Progress Meeting'} onChange={e => setForm({ ...form, type: e.target.value })} className={selectCls}>
                          <option value="Pre-Construction">Pre-Construction</option>
                          <option value="Progress Meeting">Progress Meeting</option>
                          <option value="Client Meeting">Client Meeting</option>
                          <option value="Inspection">Inspection</option>
                          <option value="Subcontractor Coordination">Sub Coordination</option>
                          <option value="Closeout">Closeout</option>
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Location</label><input type="text" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="e.g., Jobsite, Office" /></div>
                    
                    {/* Attendees */}
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <label className={`text-sm font-medium ${text}`}>Attendees</label>
                        <button onClick={() => setForm({ ...form, attendees: [...(form.attendees || []), ''] })} className="text-xs text-blue-600 hover:text-blue-700">+ Add</button>
                      </div>
                      {(form.attendees || []).map((a, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input type="text" value={a} onChange={e => { const attendees = [...(form.attendees || [])]; attendees[i] = e.target.value; setForm({ ...form, attendees }); }} className={`${inputCls} flex-1`} placeholder="Name" />
                          <button onClick={() => setForm({ ...form, attendees: (form.attendees || []).filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {(form.attendees || []).length === 0 && <p className={`text-xs ${muted}`}>No attendees added</p>}
                    </div>
                    
                    <div><label className={`block text-sm ${muted} mb-1`}>Meeting Minutes *</label><textarea value={form.minutes || ''} onChange={e => setForm({ ...form, minutes: e.target.value })} className={`${inputCls} h-24`} placeholder="Key discussion points and decisions..." /></div>
                    
                    {/* Action Items */}
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <label className={`text-sm font-medium ${text}`}>Action Items</label>
                        <button onClick={() => setForm({ ...form, actionItems: [...(form.actionItems || []), { item: '', assignedTo: '', dueDate: '', status: 'pending' }] })} className="text-xs text-blue-600 hover:text-blue-700">+ Add</button>
                      </div>
                      {(form.actionItems || []).map((a, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-start">
                          <input type="text" value={a.item} onChange={e => { const actionItems = [...(form.actionItems || [])]; actionItems[i].item = e.target.value; setForm({ ...form, actionItems }); }} className={`${inputCls} flex-1`} placeholder="Action item" />
                          <input type="text" value={a.assignedTo} onChange={e => { const actionItems = [...(form.actionItems || [])]; actionItems[i].assignedTo = e.target.value; setForm({ ...form, actionItems }); }} className={`${inputCls} w-28`} placeholder="Assigned to" />
                          <input type="date" value={a.dueDate} onChange={e => { const actionItems = [...(form.actionItems || [])]; actionItems[i].dueDate = e.target.value; setForm({ ...form, actionItems }); }} className={`${inputCls} w-36`} />
                          <button onClick={() => setForm({ ...form, actionItems: (form.actionItems || []).filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {(form.actionItems || []).length === 0 && <p className={`text-xs ${muted}`}>No action items</p>}
                    </div>
                    
                    <div><label className={`block text-sm ${muted} mb-1`}>Additional Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-16`} /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.date || !form.minutes) return alert('Date and minutes are required');
                      if (modal === 'addMeeting') {
                        updateProj(projId, { meetings: [...(proj.meetings || []), { ...form, id: Date.now() }] });
                      } else {
                        updateProj(projId, { meetings: (proj.meetings || []).map(m => m.id === sel.id ? { ...m, ...form } : m) });
                      }
                      closeModal();
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{modal === 'addMeeting' ? 'Add Meeting' : 'Save'}</button>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={selectCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Trade</label><select value={form.trade || 'General'} onChange={e => setForm({ ...form, trade: e.target.value })} className={selectCls}>{TRADES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Category</label><select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>{MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Category</label><select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>{MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
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
                      <select value={projectContractorTradeFilter} onChange={e => setProjectContractorTradeFilter(e.target.value)} className={`${selectCls} w-32 py-2`}>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Phase *</label><select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={selectCls}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
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
                      <div><label className={`block text-sm ${muted} mb-1`}>Priority</label><select value={form.priority || 'normal'} onChange={e => setForm({ ...form, priority: e.target.value })} className={selectCls}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Task Owner</label><select value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}><option value="">-</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label>
                        <select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                          <option value="">-- Select Contractor --</option>
                          {contractors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.trade})</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Budget Estimate</label>
                        <div className="relative">
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`}>$</span>
                          <input type="text" inputMode="decimal" placeholder="0" value={formatWithCommas(form.budget)} onChange={e => setForm({ ...form, budget: parseCurrency(e.target.value) })} className={`${inputCls} pl-7`} />
                        </div>
                      </div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Phase</label><select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={selectCls}>{proj?.phases.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
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
                      <div><label className={`block text-sm ${muted} mb-1`}>Priority</label><select value={form.priority || 'normal'} onChange={e => setForm({ ...form, priority: e.target.value })} className={selectCls}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></div>
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

                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Contractor</label>
                        <select value={form.contractorId || ''} onChange={e => setForm({ ...form, contractorId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                          <option value="">-- No Contractor --</option>
                          {contractors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.trade})</option>)}
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Budget Estimate</label>
                        <div className="relative">
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`}>$</span>
                          <input type="text" inputMode="decimal" placeholder="0" value={formatWithCommas(form.budget)} onChange={e => setForm({ ...form, budget: parseCurrency(e.target.value) })} className={`${inputCls} pl-7`} />
                        </div>
                      </div>
                    </div>
                    {form.contractorId && (() => {
                        const c = contractors.find(x => x.id === form.contractorId);
                        return c ? (
                          <div className={`p-2 rounded-lg ${dark ? 'bg-slate-700' : 'bg-blue-50'} text-sm`}>
                            <p className={`font-medium ${text}`}>{c.name}</p>
                            <div className="flex gap-3 mt-1">
                              {c.phone && <span className={muted}><Phone className="w-3 h-3 inline mr-1" />{c.phone}</span>}
                              {c.email && <span className={muted}><Mail className="w-3 h-3 inline mr-1" />{c.email}</span>}
                            </div>
                          </div>
                        ) : null;
                      })()}
                    <div><label className={`block text-sm ${muted} mb-1`}>Task Owner (Team)</label><select value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}><option value="">-</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className={inputCls} placeholder="Any special instructions..." /></div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="editInspection" checked={form.inspection || false} onChange={e => setForm({ ...form, inspection: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="editInspection" className={`text-sm ${text}`}>⚠️ This is an inspection</label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { tasks: proj.tasks.map(t => t.id === sel.id ? { ...form, id: sel.id } : t) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save Changes</button>
                  </div>
                </>
              )}

              {/* EDIT TASK NOTES */}
              {modal === 'editTaskNotes' && (
                <>
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <p className={`text-sm font-medium ${text}`}>{form.task}</p>
                      <p className={`text-xs ${muted}`}>{form.phase}</p>
                    </div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Notes</label>
                      <textarea 
                        value={form.notes || ''} 
                        onChange={e => setForm({ ...form, notes: e.target.value })} 
                        rows={6} 
                        className={inputCls} 
                        placeholder="Add notes about this task... e.g., called city, they said permit takes 2 weeks..."
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { tasks: proj.tasks.map(t => t.id === sel.id ? { ...t, notes: form.notes } : t) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save Notes</button>
                  </div>
                </>
              )}

              {/* EDIT TASK ACTUAL COST */}
              {modal === 'editTaskActualCost' && (
                <>
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <p className={`text-sm font-medium ${text}`}>{sel.task}</p>
                      <p className={`text-xs ${muted}`}>{sel.phase}</p>
                    </div>
                    <div>
                      <label className={`block text-sm ${muted} mb-1`}>Actual Cost</label>
                      <div className="relative">
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`}>$</span>
                        <input 
                          type="text" 
                          inputMode="decimal"
                          value={formatWithCommas(form.actualCost)} 
                          onChange={e => setForm({ ...form, actualCost: parseCurrency(e.target.value) })} 
                          className={`${inputCls} pl-7`} 
                          placeholder="0"
                          autoFocus
                        />
                      </div>
                      <p className={`text-xs ${muted} mt-2`}>Direct cost for this task (permits, fees, inspections, etc.)</p>
                    </div>
                    {(() => {
                      const taskReceipts = (proj.receipts || []).filter(r => r.taskId === sel.id);
                      const receiptTotal = taskReceipts.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
                      if (receiptTotal > 0) {
                        return (
                          <div className={`p-3 rounded-lg ${dark ? 'bg-slate-700' : 'bg-blue-50'}`}>
                            <p className={`text-xs ${muted}`}>+ Linked receipts</p>
                            <p className={`text-sm font-medium text-blue-600`}>{fmt(receiptTotal)}</p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      updateProj(projId, { tasks: proj.tasks.map(t => t.id === sel.id ? { ...t, actualCost: form.actualCost || 0 } : t) }); 
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save</button>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Role</label><select value={form.role || 'partner'} onChange={e => setForm({ ...form, role: e.target.value })} className={selectCls}><option value="admin">Admin</option><option value="partner">Partner</option><option value="viewer">Viewer</option></select></div>
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
                    <div><label className={`block text-sm ${muted} mb-1`}>Role</label><select value={form.role || 'partner'} onChange={e => setForm({ ...form, role: e.target.value })} className={selectCls}><option value="admin">Admin</option><option value="partner">Partner</option><option value="viewer">Viewer</option></select></div>
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
                      <select value={form.odId || ''} onChange={e => setForm({ ...form, odId: parseInt(e.target.value) })} className={selectCls}>
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
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
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
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
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
                      <div><label className={`block text-sm ${muted} mb-1`}>Amount *</label><input type="text" placeholder="1,234.56" value={formatWithCommas(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Vendor *</label><input type="text" placeholder="Home Depot, Lowes, etc." value={form.vendor || ''} onChange={e => setForm({ ...form, vendor: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Materials'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>
                          {RECEIPT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" placeholder="What was purchased" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Link to Task (optional)</label>
                      <select value={form.taskId || ''} onChange={e => setForm({ ...form, taskId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                        <option value="">-- No task linked --</option>
                        {proj?.tasks.map(t => <option key={t.id} value={t.id}>#{t.id} - {t.task}</option>)}
                      </select>
                    </div>
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
                      <div><label className={`block text-sm ${muted} mb-1`}>Amount</label><input type="text" value={formatWithCommas(form.amount)} onChange={e => setForm({ ...form, amount: parseCurrency(e.target.value) })} className={inputCls} placeholder="1,234.56" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Vendor</label><input type="text" value={form.vendor || ''} onChange={e => setForm({ ...form, vendor: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Materials'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>
                          {RECEIPT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Link to Task</label>
                      <select value={form.taskId || ''} onChange={e => setForm({ ...form, taskId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                        <option value="">-- No task linked --</option>
                        {proj?.tasks.map(t => <option key={t.id} value={t.id}>#{t.id} - {t.task}</option>)}
                      </select>
                    </div>
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
                        <select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={selectCls}>
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
                        <select value={form.phase || ''} onChange={e => setForm({ ...form, phase: e.target.value })} className={selectCls}>
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
                        <select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>
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
                        <select value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>
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
                      <select value={form.supplierId || ''} onChange={e => setForm({ ...form, supplierId: parseInt(e.target.value) || null })} className={selectCls}>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} - {s.category}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Item Name *</label><input type="text" placeholder="e.g., Framing Lumber" value={form.item || ''} onChange={e => setForm({ ...form, item: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Lumber'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>
                          {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" placeholder="Specifications, sizes, etc." value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Quantity</label><input type="text" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit</label><input type="text" placeholder="each, lot, sqft" value={form.unit || ''} onChange={e => setForm({ ...form, unit: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit Price</label><input type="text" value={formatWithCommas(form.unitPrice)} onChange={e => setForm({ ...form, unitPrice: parseCurrency(e.target.value) })} className={inputCls} placeholder="0.00" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Total</label><input type="text" readOnly value={fmt((form.quantity || 0) * (form.unitPrice || 0))} className={`${inputCls} bg-gray-100`} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
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
                      <select value={form.supplierId || ''} onChange={e => setForm({ ...form, supplierId: parseInt(e.target.value) || null })} className={selectCls}>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} - {s.category}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Item Name</label><input type="text" value={form.item || ''} onChange={e => setForm({ ...form, item: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Category</label>
                        <select value={form.category || 'Lumber'} onChange={e => setForm({ ...form, category: e.target.value })} className={selectCls}>
                          {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Description</label><input type="text" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Quantity</label><input type="text" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit</label><input type="text" value={form.unit || ''} onChange={e => setForm({ ...form, unit: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Unit Price</label><input type="text" value={formatWithCommas(form.unitPrice)} onChange={e => setForm({ ...form, unitPrice: parseCurrency(e.target.value) })} className={inputCls} placeholder="0.00" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Total</label><input type="text" readOnly value={fmt((form.quantity || 0) * (form.unitPrice || 0))} className={`${inputCls} bg-gray-100`} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Status</label>
                        <select value={form.status || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
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

              {/* ADD/EDIT CONTACT */}
              {(modal === 'addContact' || modal === 'editContact') && (() => {
                const roles = ['Client', 'Inspector', 'Realtor', 'Vendor', 'Subcontractor', 'Lender', 'Other'];
                const isEdit = modal === 'editContact';
                return (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Name *</label><input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="John Smith" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Phone</label><input type="tel" value={formatPhone(form.phone)} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="(555) 123-4567" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Email</label><input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Role</label>
                      <select value={form.role || 'Client'} onChange={e => setForm({ ...form, role: e.target.value })} className={selectCls}>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Assigned Projects</label>
                      <div className={`${inputCls} min-h-[80px] p-2`}>
                        <div className="flex flex-wrap gap-2">
                          {projects.map(p => (
                            <button 
                              key={p.id} 
                              onClick={() => {
                                const ids = form.projectIds || [];
                                setForm({ ...form, projectIds: ids.includes(p.id) ? ids.filter(x => x !== p.id) : [...ids, p.id] });
                              }}
                              className={`text-xs px-2 py-1 rounded-full border transition ${(form.projectIds || []).includes(p.id) ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : `${border} ${muted} hover:border-emerald-300`}`}
                            >
                              {(form.projectIds || []).includes(p.id) && '✓ '}{p.name}
                            </button>
                          ))}
                          {projects.length === 0 && <span className={`text-xs ${muted}`}>No projects yet</span>}
                        </div>
                      </div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Tags</label>
                      <input 
                        type="text" 
                        value={(form.tags || []).join(', ')} 
                        onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        className={inputCls} 
                        placeholder="VIP, responsive, slow payer (comma-separated)"
                      />
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Notes</label><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputCls} h-20`} placeholder="Additional information about this contact..." /></div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.name) return;
                      if (isEdit) {
                        setCrmContacts(crmContacts.map(c => c.id === form.id ? form : c));
                      } else {
                        setCrmContacts([...crmContacts, { ...form, id: Date.now() }]);
                      }
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{isEdit ? 'Save' : 'Add Contact'}</button>
                  </div>
                </>
              );})()}

              {/* LOG/EDIT CONVERSATION */}
              {(modal === 'logConversation' || modal === 'editConversation') && (() => {
                const isEdit = modal === 'editConversation';
                return (
                <>
                  <div className="space-y-4">
                    <div><label className={`block text-sm ${muted} mb-1`}>Contact *</label>
                      <select value={form.contactId || ''} onChange={e => setForm({ ...form, contactId: parseInt(e.target.value) })} className={selectCls}>
                        <option value="">Select contact...</option>
                        {crmContacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Type *</label>
                        <select value={form.type || 'call'} onChange={e => setForm({ ...form, type: e.target.value })} className={selectCls}>
                          <option value="call">📞 Phone Call</option>
                          <option value="text">💬 Text Message</option>
                          <option value="email">✉️ Email</option>
                        </select>
                      </div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Direction *</label>
                        <select value={form.direction || 'outbound'} onChange={e => setForm({ ...form, direction: e.target.value })} className={selectCls}>
                          <option value="outbound">📤 Outbound (I reached out)</option>
                          <option value="inbound">📥 Inbound (They contacted me)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className={`block text-sm ${muted} mb-1`}>Date</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Time</label><input type="text" value={form.time || ''} onChange={e => setForm({ ...form, time: e.target.value })} className={inputCls} placeholder="2:30 PM" /></div>
                      <div><label className={`block text-sm ${muted} mb-1`}>Duration</label><input type="text" value={form.duration || ''} onChange={e => setForm({ ...form, duration: e.target.value })} className={inputCls} placeholder="5 min" /></div>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Project</label>
                      <select value={form.projectId || ''} onChange={e => setForm({ ...form, projectId: e.target.value ? parseInt(e.target.value) : null })} className={selectCls}>
                        <option value="">No project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div><label className={`block text-sm ${muted} mb-1`}>Summary / Notes *</label>
                      <textarea 
                        value={form.summary || ''} 
                        onChange={e => setForm({ ...form, summary: e.target.value })} 
                        className={`${inputCls} h-24`} 
                        placeholder="What was discussed? Key takeaways, action items, follow-ups..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={closeModal} className={`flex-1 px-4 py-2.5 border ${border} ${text} hover:bg-gray-50 rounded-lg font-medium`}>Cancel</button>
                    <button onClick={() => { 
                      if (!form.contactId || !form.summary) return;
                      if (isEdit) {
                        setConversations(conversations.map(c => c.id === form.id ? form : c));
                      } else {
                        setConversations([...conversations, { ...form, id: Date.now() }]);
                      }
                      closeModal(); 
                    }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{isEdit ? 'Save' : 'Log Conversation'}</button>
                  </div>
                </>
              );})()}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
