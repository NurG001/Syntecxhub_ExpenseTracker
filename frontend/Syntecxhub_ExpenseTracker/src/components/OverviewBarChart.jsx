import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const OverviewBarChart = ({ data }) => {
  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={-40} // Creates the overlapping effect
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          {/* Expense Bar (Light Purple - Layered behind) */}
          <Bar 
            dataKey="expense" 
            fill="#E6D9FF" 
            radius={[10, 10, 0, 0]} 
            barSize={45} 
          />
          {/* Income Bar (Dark Purple - Layered in front) */}
          <Bar 
            dataKey="income" 
            fill="#875cf5" 
            radius={[10, 10, 0, 0]} 
            barSize={45} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewBarChart;