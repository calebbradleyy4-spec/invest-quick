'use client';

import { Holding } from '../lib/types';
import {
  calculatePortfolio,
  totalProjected,
  fmt$,
  fmt$full,
  fmtPct,
  HOLDING_COLORS,
} from '../lib/calculations';

const PROJECTION_YEARS = [1, 5, 10, 15, 20, 30, 40, 50];

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
}

function DonutChart({ segments }: DonutChartProps) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 64;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * r;

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  let cumulativeAngle = -90;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#1e293b"
        strokeWidth={strokeWidth}
      />
      {segments.map((seg, i) => {
        const fraction = seg.value / total;
        const dashLength = fraction * circumference;
        const startAngle = cumulativeAngle;
        cumulativeAngle += fraction * 360;

        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference}`}
            transform={`rotate(${startAngle} ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      {/* Center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui">
        TOTAL
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold" fontFamily="system-ui">
        {fmt$(total)}
      </text>
    </svg>
  );
}

interface AnalyzeTabProps {
  holdings: Holding[];
}

export default function AnalyzeTab({ holdings }: AnalyzeTabProps) {
  const { calculated, stats } = calculatePortfolio(holdings);

  const donutSegments = holdings.map((h, i) => ({
    label: h.ticker,
    value: h.amountInvested,
    color: HOLDING_COLORS[i % HOLDING_COLORS.length],
  }));

  return (
    <div className="px-4 pt-12 pb-4 space-y-5">
      {/* Header */}
      <div>
        <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Analysis</p>
        <h1 className="text-white text-2xl font-bold tracking-tight">Analyze</h1>
      </div>

      {/* Summary Header */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#111827] rounded-2xl p-3.5 border border-[#1e293b] text-center">
          <p className="text-slate-500 text-[10px] font-medium mb-1">Invested</p>
          <p className="text-white text-base font-bold">{fmt$(stats.totalValue)}</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-3.5 border border-[#1e293b] text-center">
          <p className="text-slate-500 text-[10px] font-medium mb-1">Exp. Return</p>
          <p className="text-[#10d982] text-base font-bold">{fmtPct(stats.portfolioReturn)}</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-3.5 border border-[#1e293b] text-center">
          <p className="text-slate-500 text-[10px] font-medium mb-1">Beta</p>
          <p className="text-white text-base font-bold">{stats.portfolioBeta.toFixed(2)}</p>
        </div>
      </div>

      {/* Projection Table */}
      <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e293b]">
          <h2 className="text-white text-sm font-semibold">Growth Projection</h2>
          <p className="text-slate-500 text-xs mt-0.5">Based on expected returns</p>
        </div>
        <div className="divide-y divide-[#1e293b]">
          <div className="flex px-4 py-2">
            <p className="text-slate-500 text-[11px] font-medium w-12">Year</p>
            <p className="text-slate-500 text-[11px] font-medium flex-1 text-right">Proj. Value</p>
            <p className="text-slate-500 text-[11px] font-medium flex-1 text-right">Total Gain</p>
          </div>
          {PROJECTION_YEARS.map((years) => {
            const projected = totalProjected(holdings, years);
            const gain = projected - stats.totalValue;
            const multiplier = stats.totalValue > 0 ? projected / stats.totalValue : 1;
            return (
              <div key={years} className="flex items-center px-4 py-3">
                <div className="w-12">
                  <span className="text-white text-sm font-semibold">{years}Y</span>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white text-sm font-semibold">{fmt$(projected)}</p>
                  <p className="text-slate-500 text-[10px]">{multiplier.toFixed(1)}x</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#10d982] text-sm font-semibold">+{fmt$(gain)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dividend Income */}
      <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e293b]">
          <h2 className="text-white text-sm font-semibold">Dividend Income</h2>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 gap-4 border-b border-[#1e293b]">
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Annual Income</p>
            <p className="text-[#10d982] text-xl font-bold">{fmt$full(stats.totalAnnualDividend)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Monthly Income</p>
            <p className="text-white text-xl font-bold">{fmt$full(stats.totalMonthlyDividend)}</p>
          </div>
        </div>
        <div className="divide-y divide-[#1e293b]">
          {calculated
            .filter((c) => c.annualDividend > 0)
            .sort((a, b) => b.annualDividend - a.annualDividend)
            .map((c, i) => {
              const color = HOLDING_COLORS[holdings.indexOf(c.holding) % HOLDING_COLORS.length];
              return (
                <div key={c.holding.id} className="flex items-center px-4 py-3 gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-white text-sm font-semibold w-14">{c.holding.ticker}</p>
                  <p className="text-slate-500 text-xs flex-1">{fmtPct(c.holding.dividendYield)} yield</p>
                  <div className="text-right">
                    <p className="text-[#10d982] text-sm font-semibold">{fmt$full(c.annualDividend)}/yr</p>
                    <p className="text-slate-500 text-xs">{fmt$full(c.monthlyDividend)}/mo</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Asset Allocation Donut Chart */}
      <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e293b]">
          <h2 className="text-white text-sm font-semibold">Asset Allocation</h2>
        </div>
        <div className="flex items-center gap-4 px-4 py-5">
          <div className="flex-shrink-0">
            <DonutChart segments={donutSegments} />
          </div>
          <div className="flex-1 space-y-2.5">
            {donutSegments.map((seg, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <p className="text-white text-xs font-semibold w-10">{seg.label}</p>
                <div className="flex-1 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(seg.value / stats.totalValue) * 100}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                </div>
                <p className="text-slate-400 text-xs w-10 text-right">
                  {fmtPct(seg.value / stats.totalValue, 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Holding Breakdown Table */}
      <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e293b]">
          <h2 className="text-white text-sm font-semibold">Holdings Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-slate-500 font-medium px-4 py-2.5">Ticker</th>
                <th className="text-right text-slate-500 font-medium px-2 py-2.5">Amount</th>
                <th className="text-right text-slate-500 font-medium px-2 py-2.5">Wt%</th>
                <th className="text-right text-slate-500 font-medium px-2 py-2.5">Ret%</th>
                <th className="text-right text-slate-500 font-medium px-2 py-2.5">WRet%</th>
                <th className="text-right text-slate-500 font-medium px-2 py-2.5">Beta</th>
                <th className="text-right text-slate-500 font-medium px-4 py-2.5">Ann.Div</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {calculated.map((c, i) => {
                const h = c.holding;
                const color = HOLDING_COLORS[i % HOLDING_COLORS.length];
                return (
                  <tr key={h.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-white font-semibold">{h.ticker}</span>
                      </div>
                    </td>
                    <td className="text-right px-2 py-3 text-white font-medium">{fmt$(h.amountInvested)}</td>
                    <td className="text-right px-2 py-3 text-slate-300">{fmtPct(c.weight, 0)}</td>
                    <td className="text-right px-2 py-3 text-[#10d982]">{fmtPct(h.expectedReturn, 0)}</td>
                    <td className="text-right px-2 py-3 text-[#10d982]">{fmtPct(c.weightedReturn, 2)}</td>
                    <td className="text-right px-2 py-3 text-slate-300">{h.beta.toFixed(2)}</td>
                    <td className="text-right px-4 py-3 text-slate-300">{fmt$full(c.annualDividend)}</td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="bg-[#0d1523]">
                <td className="px-4 py-3 text-white font-bold">Total</td>
                <td className="text-right px-2 py-3 text-white font-bold">{fmt$(stats.totalValue)}</td>
                <td className="text-right px-2 py-3 text-white font-bold">100%</td>
                <td className="text-right px-2 py-3 text-[#10d982] font-bold">{fmtPct(stats.portfolioReturn, 1)}</td>
                <td className="text-right px-2 py-3 text-[#10d982] font-bold">{fmtPct(stats.portfolioReturn, 2)}</td>
                <td className="text-right px-2 py-3 text-white font-bold">{stats.portfolioBeta.toFixed(2)}</td>
                <td className="text-right px-4 py-3 text-white font-bold">{fmt$full(stats.totalAnnualDividend)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
