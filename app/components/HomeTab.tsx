'use client';

import { useState } from 'react';
import { Holding } from '../lib/types';
import { calculatePortfolio, totalProjected, fmt$, fmtPct, HOLDING_COLORS } from '../lib/calculations';

const TIME_RANGES = ['1D', '1W', '1M', '3M', 'YTD', '1Y'];

const TYPE_BADGE: Record<string, string> = {
  'Stock/ETF': 'bg-blue-500/20 text-blue-400',
  Crypto: 'bg-purple-500/20 text-purple-400',
  HYSA: 'bg-amber-500/20 text-amber-400',
};

interface HomeTabProps {
  holdings: Holding[];
}

export default function HomeTab({ holdings }: HomeTabProps) {
  const [selectedRange, setSelectedRange] = useState('1Y');
  const [showAll, setShowAll] = useState(false);

  const { stats } = calculatePortfolio(holdings);

  const sorted = [...holdings].sort((a, b) => b.amountInvested - a.amountInvested);
  const displayed = showAll ? sorted : sorted.slice(0, 3);

  const projected40Y = totalProjected(holdings, 40);

  return (
    <div className="px-4 pt-12 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Portfolio</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">Invest Quick</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#10d982]/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#10d982" opacity="0.3" />
            <path d="M12 6v6l4 2" stroke="#10d982" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Total Value */}
      <div className="text-center py-2">
        <p className="text-slate-400 text-sm font-medium mb-1">Total Portfolio Value</p>
        <p className="text-white text-5xl font-bold tracking-tight">
          {fmt$(stats.totalValue)}
        </p>
        <p className="text-[#10d982] text-sm mt-1 font-medium">
          ↑ {fmt$(projected40Y - stats.totalValue)} projected gain (40Y)
        </p>
      </div>

      {/* Stats Badges */}
      <div className="flex gap-3">
        <div className="flex-1 bg-[#111827] rounded-2xl p-4 border border-[#1e293b]">
          <p className="text-slate-500 text-xs font-medium mb-1">Portfolio Beta</p>
          <p className="text-white text-xl font-bold">{stats.portfolioBeta.toFixed(2)}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {stats.portfolioBeta < 1 ? 'Less volatile' : stats.portfolioBeta > 1.2 ? 'High risk' : 'Moderate risk'}
          </p>
        </div>
        <div className="flex-1 bg-[#111827] rounded-2xl p-4 border border-[#1e293b]">
          <p className="text-slate-500 text-xs font-medium mb-1">Expected Return</p>
          <p className="text-[#10d982] text-xl font-bold">{fmtPct(stats.portfolioReturn)}</p>
          <p className="text-slate-500 text-xs mt-0.5">Annual weighted avg</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-[#111827] rounded-2xl p-4 border border-[#1e293b]">
        <div className="flex gap-1 mb-4">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRange(r)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                selectedRange === r
                  ? 'bg-[#10d982] text-[#0a0e1a]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {/* Visual chart placeholder */}
        <div className="relative h-16 overflow-hidden">
          <svg viewBox="0 0 300 64" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10d982" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10d982" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,50 C30,48 60,42 90,35 C120,28 150,38 180,25 C210,12 240,18 270,10 L300,8 L300,64 L0,64 Z"
              fill="url(#chartGrad)"
            />
            <path
              d="M0,50 C30,48 60,42 90,35 C120,28 150,38 180,25 C210,12 240,18 270,10 L300,8"
              fill="none"
              stroke="#10d982"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Holdings List */}
      <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
          <h2 className="text-white text-sm font-semibold">Top Holdings</h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#10d982] text-xs font-semibold"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        </div>
        <div className="divide-y divide-[#1e293b]">
          {displayed.map((h, i) => {
            const colorIndex = holdings.indexOf(h);
            const color = HOLDING_COLORS[colorIndex % HOLDING_COLORS.length];
            const proj40 = h.amountInvested * Math.pow(1 + h.expectedReturn, 40);
            return (
              <div key={h.id} className="flex items-center px-4 py-3.5 gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {h.ticker.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-tight">{h.ticker}</p>
                  <p className="text-slate-500 text-xs truncate">{h.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white text-sm font-semibold">{fmt$(h.amountInvested)}</p>
                  <p className="text-[#10d982] text-xs font-medium">{fmt$(proj40)} / 40Y</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Dividend Income */}
      <div className="bg-[#111827] rounded-2xl p-4 border border-[#1e293b] flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-xs font-medium">Monthly Dividend Income</p>
          <p className="text-white text-2xl font-bold mt-0.5">
            {fmt$(stats.totalMonthlyDividend)}
            <span className="text-slate-500 text-sm font-normal"> /mo</span>
          </p>
          <p className="text-slate-500 text-xs mt-0.5">{fmt$(stats.totalAnnualDividend)}/year</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#10d982]/10 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#10d982" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
