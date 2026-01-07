import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const FinancialOverview = ({ income, expense, totalBalance }) => {
  // ✅ Prepare data specifically for the donut segments
  const data = [
    { name: 'Income', value: income, color: '#ff6b00' }, // Orange
    { name: 'Expense', value: expense, color: '#ef4444' }, // Red
    { name: 'Balance', value: Math.abs(totalBalance), color: '#875cf5' }, // Purple
  ];

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="relative w-full h-75">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80} // ✅ Creates the donut hole
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* ✅ Center Text: Displays the Total Balance */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Balance</span>
          <span className="text-2xl font-black text-slate-800">${totalBalance?.toLocaleString()}</span>
        </div>
      </div>

      {/* ✅ Custom Legend with Stats */}
      <div className="w-full mt-6 grid grid-cols-3 gap-2">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-700">
                ${item.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialOverview;