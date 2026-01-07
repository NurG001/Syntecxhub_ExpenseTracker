import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AddTransactionModal from '../../components/AddTransactionModal';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Plus, Download, ArrowDownRight, Loader2, Calendar as CalendarIcon, ChevronDown, Trash2, Menu } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

const formatDate = (dateValue, options = { day: 'numeric', month: 'short' }) => {
  const d = new Date(dateValue);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString('en-US', options);
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {payload[0].payload.fullDate}
        </p>
        <p className="text-sm font-bold text-slate-800 mb-1">
          {payload[0].payload.transactionName}
        </p>
        <p className="text-red-500 font-black text-lg">
          - ${Math.abs(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Expense = () => {
  const [allExpenses, setAllExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ Added for mobile responsive

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transactions');
      const expensesOnly = data
        .filter(t => t.amount < 0 || t.category === 'Expense')
        .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
      
      setAllExpenses(expensesOnly);
      setFilteredExpenses(expensesOnly);
    } catch (err) {
      toast.error("Failed to load expense data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  useEffect(() => {
    if (selectedMonth === 'All') {
      setFilteredExpenses(allExpenses);
    } else {
      const filtered = allExpenses.filter(item => {
        const itemMonth = new Date(item.date || item.createdAt).toLocaleString('en-US', { month: 'long' });
        return itemMonth === selectedMonth;
      });
      setFilteredExpenses(filtered);
    }
  }, [selectedMonth, allExpenses]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense record?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Expense removed");
      fetchExpenses();
    } catch (err) { toast.error("Delete failed"); }
  };

  const downloadExcel = () => {
    if (filteredExpenses.length === 0) return toast.error("No data to export");
    const excelData = filteredExpenses.map((item, index) => ({
      "No.": index + 1,
      "Description": item.text,
      "Amount ($)": Math.abs(item.amount),
      "Date": formatDate(item.date || item.createdAt, { day: 'numeric', month: 'long', year: 'numeric' }),
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, `Expense_Report_${selectedMonth}.xlsx`);
    toast.success("Excel report saved!");
  };

  const chartData = filteredExpenses.map(item => ({
    name: formatDate(item.date || item.createdAt),
    fullDate: formatDate(item.date || item.createdAt, { day: 'numeric', month: 'long', year: 'numeric' }),
    transactionName: item.text,
    amount: Math.abs(item.amount)
  }));

  const totalExpense = filteredExpenses.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen font-poppins text-slate-900 relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Header Section with Mobile Toggle */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-3 bg-white rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all border border-slate-100"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Expense Analysis</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-5 md:px-7 py-3 md:py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            <Plus size={18} /> <span className="hidden sm:inline">Add Expense</span>
          </button>
        </header>

        {/* Trend Section: Area Chart */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-8 mb-8 border border-slate-100 shadow-sm relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h2 className="text-xl font-bold">Trend Overview</h2>
            <div className="relative w-full md:w-auto">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold appearance-none outline-none cursor-pointer"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#875cf5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#875cf5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#875cf5" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Expenses Grid */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
             <div>
                <h2 className="text-xl font-bold">Transaction History</h2>
                <span className="text-red-500 font-black text-sm">-${totalExpense.toLocaleString()}</span>
             </div>
             <button onClick={downloadExcel} className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-500 hover:text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 px-5 py-3 rounded-xl transition-all">
                <Download size={14} /> Download CSV
             </button>
          </div>

          {loading ? (
             <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : filteredExpenses.length === 0 ? (
            <div className="py-24 text-center text-slate-400 font-medium italic">No expense history found for this period.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredExpenses.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 md:p-6 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all group relative">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl shadow-sm">
                      {item.icon || '💸'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.text}</h4>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        {formatDate(item.date || item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-1 text-red-500 font-black text-lg">
                      <span>-${Math.abs(item.amount).toLocaleString()}</span>
                      <ArrowDownRight size={16} />
                    </div>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all lg:opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchExpenses} />
      </main>
    </div>
  );
};

export default Expense;