import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

const MiniOverviewChart = ({ title, data, color, total, loading }) => {
  // Calculate the total from the chart data for the period shown
  const chartTotal = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex flex-col mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-3xl font-black tracking-tight" style={{ color: color }}>
          ${total?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
        {data.length > 0 && (
          <p className="text-sm font-bold text-slate-400 mt-1">
            Last {data.length} days: <span style={{ color: color }}>${chartTotal.toLocaleString()}</span>
          </p>
        )}
      </div>

      <div className="flex-1 h-45 min-h-45 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-300">
            <Loader2 className="animate-spin" size={30} />
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 font-bold text-sm">
            No recent data to show.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" hide />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-lg font-black" style={{ color: color }}>
                          ${payload[0].value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                {data.map((entry, index) => (
                  // Use a lighter opacity for older bars to create a visual trend focus
                  <Cell key={`cell-${index}`} fill={color} fillOpacity={index >= data.length - 7 ? 1 : 0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MiniOverviewChart;