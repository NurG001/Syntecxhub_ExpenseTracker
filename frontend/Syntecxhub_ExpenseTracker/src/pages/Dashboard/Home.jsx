import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import FinancialOverview from '../../components/FinancialOverview';
import AddTransactionModal from '../../components/AddTransactionModal';
import MiniOverviewChart from '../../components/MiniOverviewChart';
import { 
  Plus, Loader2, ArrowUpRight, ArrowDownRight, 
  ChevronRight, Menu, ChevronDown 
} from 'lucide-react';
import api from '../../services/api'; 
import { useAuth } from '../../context/AuthContext'; 
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const Home = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile responsiveness state
  const [stats, setStats] = useState({ totalBalance: 0, income: 0, expense: 0 });
  const [allTransactions, setAllTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ State for Year Filtering
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Toggle function for mobile sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, transactionsRes] = await Promise.all([
        api.get('/transactions/summary'),
        api.get('/transactions')
      ]);
      setStats(summaryRes.data);
      setAllTransactions(transactionsRes.data);
      setRecentTransactions(transactionsRes.data.slice(0, 5));
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Derive available years from transaction history for the filter dropdown
  const availableYears = useMemo(() => {
    const years = allTransactions.map(t => new Date(t.date).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
  }, [allTransactions]);

  // ✅ Process Data for the Overlapping Bar Chart (Filtered by Selected Year)
  const monthlyOverviewData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataMap = months.map(m => ({ month: m, income: 0, expense: 0 }));

    allTransactions.forEach(t => {
      const date = new Date(t.date);
      if (date.getFullYear() === parseInt(selectedYear)) {
        const monthIndex = date.getMonth();
        if (t.amount > 0) {
          dataMap[monthIndex].income += t.amount;
        } else {
          dataMap[monthIndex].expense += Math.abs(t.amount);
        }
      }
    });
    return dataMap;
  }, [allTransactions, selectedYear]);

  // ✅ Process Data for "Last 30 Days Expenses" Bar Chart
  const expenseChartData = useMemo(() => {
    const last30Days = allTransactions.filter(t => t.amount < 0).slice(0, 7);
    return last30Days.map(t => ({
      name: new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      amount: Math.abs(t.amount)
    }));
  }, [allTransactions]);

  // ✅ Process Data for "Last 60 Days Income" Donut
  const incomePieData = useMemo(() => {
    const incomeItems = allTransactions.filter(t => t.amount > 0).slice(0, 4);
    const colors = ['#875cf5', '#ef4444', '#ff6b00', '#22c55e'];
    return incomeItems.map((t, i) => ({
      name: t.text,
      value: t.amount,
      color: colors[i % colors.length]
    }));
  }, [allTransactions]);

  return (
    <div className="flex bg-[#fcfbfc] min-h-screen font-poppins relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-3 bg-white rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all border border-slate-100"
            >
              <Menu size={24} />
            </button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                Hello, {user?.fullName || 'User'}! 👋
              </h1>
              <p className="hidden md:block text-slate-400 mt-1 font-medium">
                Here's what's happening with your money.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-5 md:px-6 py-3 md:py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            <Plus size={20} /> <span className="hidden sm:inline">Add New</span>
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-[10px]">Syncing Accounts...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Row 1: Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Total Balance" amount={stats.totalBalance} iconType="balance" color="#875cf5" />
              <StatCard title="Total Income" amount={stats.income} iconType="income" color="#ff6b00" />
              <StatCard title="Total Expenses" amount={stats.expense} iconType="expense" color="#ef4444" />
            </div>

            {/* ✅ Row 2: Overlapping Bar Chart (Financial Growth Trend) */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Financial Growth Trend</h3>
                  <p className="text-slate-400 text-xs font-medium mt-1">Comparing monthly income vs expenses</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Legend */}
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#875cf5]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#E6D9FF]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense</span>
                    </div>
                  </div>

                  {/* Year Filter Dropdown */}
                  <div className="relative shrink-0">
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="pl-4 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold appearance-none outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyOverviewData} barGap={-40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                    
                    {/* Layer 1: Income Bar (Dark Purple - Rendered Behind) */}
                    <Bar dataKey="income" fill="#875cf5" radius={[10, 10, 0, 0]} barSize={45} />
                    
                    {/* Layer 2: Expense Bar (Light Purple - Rendered in Front) */}
                    <Bar dataKey="expense" fill="#E6D9FF" radius={[10, 10, 0, 0]} barSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Row 3: Recent Transactions & Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                  <Link to="/income" className="text-slate-400 hover:text-primary flex items-center gap-1 text-sm font-bold">
                    See All <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="space-y-6">
                  {recentTransactions.map((item) => (
                    <div key={item._id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                          {item.icon || (item.amount > 0 ? '💰' : '💸')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{item.text}</h4>
                          <p className="text-slate-400 text-xs font-medium">
                            {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 font-black text-lg ${item.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <span>{item.amount > 0 ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}</span>
                        {item.amount > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
                <h3 className="text-xl font-bold text-slate-800 self-start mb-4">Financial Overview</h3>
                <FinancialOverview income={stats.income} expense={stats.expense} totalBalance={stats.totalBalance} />
              </section>
            </div>

            {/* Row 4: Last 60 Days Income & Income List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-8 text-left">Last 60 Days Income</h3>
                <div className="h-75 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={incomePieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                        {incomePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Income</span>
                    <span className="text-2xl font-black text-slate-800">${stats.income.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                  {incomePieData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-slate-400 uppercase">{item.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Income Sources</h3>
                  <Link to="/income" className="text-slate-400 hover:text-primary flex items-center gap-1 text-sm font-bold">
                    See All <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="space-y-6">
                  {allTransactions.filter(t => t.amount > 0).slice(0, 5).map((item) => (
                    <div key={item._id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">
                          {item.icon || '💰'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{item.text}</h4>
                          <p className="text-slate-400 text-xs font-medium">
                            {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-500 font-black text-lg">
                        <span>+${item.amount.toLocaleString()}</span>
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Row 5: Expenses List & Last 30 Days Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Expenses</h3>
                  <Link to="/expense" className="text-slate-400 hover:text-primary flex items-center gap-1 text-sm font-bold">
                    See All <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="space-y-6">
                  {allTransactions.filter(t => t.amount < 0).slice(0, 4).map((item) => (
                    <div key={item._id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">
                          {item.icon || '💸'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{item.text}</h4>
                          <p className="text-slate-400 text-xs font-medium">
                            {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-red-500 font-black text-lg bg-red-50 px-3 py-1 rounded-xl">
                        <span>-${Math.abs(item.amount).toLocaleString()}</span>
                        <ArrowDownRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-8">Last 30 Days Expenses</h3>
                <div className="h-75">
                  <MiniOverviewChart data={expenseChartData} color="#875cf5" />
                </div>
              </section>
            </div>
          </div>
        )}

        <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchDashboardData} />
      </main>
    </div>
  );
};

export default Home;