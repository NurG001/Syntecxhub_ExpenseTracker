import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AddTransactionModal from '../../components/AddTransactionModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Plus, Download, ArrowUpRight, Loader2, Calendar as CalendarIcon, ChevronDown, Trash2, Menu } from 'lucide-react';
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
        <p className="text-primary font-black text-lg">
          + ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Income = () => {
  const [allIncomes, setAllIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ Added for mobile responsive

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transactions');
      const incomesOnly = data
        .filter(t => t.amount > 0 || t.category === 'Income')
        .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
      
      setAllIncomes(incomesOnly);
      setFilteredIncomes(incomesOnly);
    } catch (err) { toast.error("Failed to load income data"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchIncomes(); }, []);

  useEffect(() => {
    if (selectedMonth === 'All') {
      setFilteredIncomes(allIncomes);
    } else {
      const filtered = allIncomes.filter(item => {
        const itemMonth = new Date(item.date || item.createdAt).toLocaleString('en-US', { month: 'long' });
        return itemMonth === selectedMonth;
      });
      setFilteredIncomes(filtered);
    }
  }, [selectedMonth, allIncomes]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Entry deleted");
      fetchIncomes();
    } catch (err) { toast.error("Delete failed"); }
  };

  const downloadExcel = () => {
    if (filteredIncomes.length === 0) return toast.error("No data available");
    const excelData = filteredIncomes.map((item, index) => ({
      "No.": index + 1,
      "Source": item.text,
      "Amount ($)": item.amount,
      "Date": formatDate(item.date || item.createdAt, { day: 'numeric', month: 'long', year: 'numeric' }),
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income Report");
    XLSX.writeFile(workbook, `Income_Report_${selectedMonth}.xlsx`);
    toast.success("Excel report saved!");
  };

  const chartData = filteredIncomes.map(item => ({
    name: formatDate(item.date || item.createdAt),
    fullDate: formatDate(item.date || item.createdAt, { day: 'numeric', month: 'long', year: 'numeric' }),
    transactionName: item.text,
    amount: item.amount
  }));

  const totalIncome = filteredIncomes.reduce((acc, curr) => acc + curr.amount, 0);

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
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Income Stream</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-5 md:px-7 py-3 md:py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            <Plus size={18} /> <span className="hidden sm:inline">Add Income</span>
          </button>
        </header>

        {/* Chart Card */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-8 mb-8 border border-slate-100 shadow-sm relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h2 className="text-xl font-bold">Earnings Report</h2>
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
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fcfbfc' }} />
                <Bar dataKey="amount" radius={[10, 10, 10, 10]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7B61FF' : '#E6D9FF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Sources Grid */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
             <div>
                <h2 className="text-xl font-bold">Income Sources</h2>
                <span className="text-green-500 font-black text-sm">+ ${totalIncome.toLocaleString()}</span>
             </div>
             <button onClick={downloadExcel} className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-500 hover:text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 px-5 py-3 rounded-xl transition-all">
                <Download size={14} /> Download CSV
             </button>
          </div>

          {loading ? (
             <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredIncomes.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 md:p-6 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all group relative">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl shadow-sm border border-slate-100">
                      {item.icon || '💰'} 
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.text}</h4>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        {formatDate(item.date || item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-1 text-green-500 font-black text-lg">
                      <span>+${item.amount.toLocaleString()}</span>
                      <ArrowUpRight size={16} />
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

        <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchIncomes} />
      </main>
    </div>
  );
};

export default Income;