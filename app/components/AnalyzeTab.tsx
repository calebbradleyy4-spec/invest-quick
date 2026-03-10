'use client';

import { useState } from 'react';
import { Holding } from '../lib/types';
import {
  calculatePortfolio,
  totalProjected,
  projectedValue,
  fmt$,
  fmt$full,
  fmtPct,
  HOLDING_COLORS,
} from '../lib/calculations';

// ── Types ──────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'stocks' | 'crypto' | 'hysa';

const FILTER_LABELS: Record<FilterKey, string> = {
  all: 'All',
  stocks: 'Stocks & ETFs',
  crypto: 'Crypto',
  hysa: 'HYSA',
};

const PROJECTION_YEARS = [1, 5, 10, 15, 20, 30, 40];

// Category colors for the "All" donut
const CAT_COLORS: Record<string, string> = {
  'Stock/ETF': '#3b82f6',
  Crypto: '#a855f7',
  HYSA: '#f59e0b',
};

// ── DonutChart ─────────────────────────────────────────────────────────────

interface Segment {
  label: string;
  sublabel?: string;
  value: number;
  color: string;
}

function DonutChart({ segments }: { segments: Segment[] }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 64;
  const sw = 26;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  let angle = -90;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={sw} />
      {segments.map((seg, i) => {
        const frac = seg.value / total;
        const start = angle;
        angle += frac * 360;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={sw}
            strokeDasharray={`${frac * C} ${C}`}
            transform={`rotate(${start} ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui" fontWeight="600" letterSpacing="1">
        TOTAL
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold" fontFamily="system-ui">
        {fmt$(total)}
      </text>
    </svg>
  );
}

// ── Legend ─────────────────────────────────────────────────────────────────

function Legend({ segments, total }: { segments: Segment[]; total: number }) {
  if (total === 0) return null;
  return (
    <div className="flex-1 space-y-2.5 min-w-0">
      {segments.map((seg, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1">
              <p className="text-white text-xs font-semibold truncate">{seg.label}</p>
              {seg.sublabel && <p className="text-slate-500 text-[10px] truncate">{seg.sublabel}</p>}
            </div>
            <div className="h-1 bg-[#1e293b] rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(seg.value / total) * 100}%`, backgroundColor: seg.color }}
              />
            </div>
          </div>
          <p className="text-slate-400 text-xs flex-shrink-0 w-9 text-right">
            {fmtPct(seg.value / total, 0)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm">No {label} holdings yet</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface AnalyzeTabProps {
  holdings: Holding[];
}

export default function AnalyzeTab({ holdings }: AnalyzeTabProps) {
  const [filter, setFilter] = useState<FilterKey>('all');

  // Filter holdings for the active view
  const filteredHoldings: Holding[] = (() => {
    switch (filter) {
      case 'stocks': return holdings.filter((h) => h.type === 'Stock/ETF');
      case 'crypto': return holdings.filter((h) => h.type === 'Crypto');
      case 'hysa':   return holdings.filter((h) => h.type === 'HYSA');
      default:       return holdings;
    }
  })();

  const { calculated, stats } = calculatePortfolio(filteredHoldings);

  // Color index maps back to the full holdings array so colors stay consistent
  const colorFor = (h: Holding) => HOLDING_COLORS[holdings.indexOf(h) % HOLDING_COLORS.length];

  // Show beta? — yes for All and Stocks views
  const showBeta = filter === 'all' || filter === 'stocks';

  // HYSA view: "interest income" label instead of "dividend"
  const isHYSA = filter === 'hysa';

  // ── Donut segments ─────────────────────────────────────────────────────
  const donutSegments: Segment[] = filter === 'all'
    ? // "All" → category-level segments
      (['Stock/ETF', 'Crypto', 'HYSA'] as const)
        .map((type) => ({
          label: type === 'Stock/ETF' ? 'Stocks & ETFs' : type,
          value: holdings.filter((h) => h.type === type).reduce((s, h) => s + h.amountInvested, 0),
          color: CAT_COLORS[type],
        }))
        .filter((s) => s.value > 0)
    : // Specific filter → per-holding segments
      filteredHoldings.map((h) => ({
        label: h.ticker,
        sublabel: fmt$(h.amountInvested),
        value: h.amountInvested,
        color: colorFor(h),
      }));

  const filterKeys: FilterKey[] = ['all', 'stocks', 'crypto', 'hysa'];

  return (
    <div className="px-4 pt-12 pb-4 space-y-5">
      {/* Header */}
      <div>
        <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Analysis</p>
        <h1 className="text-white text-2xl font-bold tracking-tight">Analyze</h1>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {filterKeys.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
              filter === key
                ? 'bg-[#10d982] text-[#0a0e1a]'
                : 'bg-[#111827] text-slate-400 border border-[#1e293b]'
            }`}
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Empty state for filtered views */}
      {filteredHoldings.length === 0 ? (
        <div className="bg-[#111827] rounded-2xl border border-[#1e293b]">
          <EmptyState label={FILTER_LABELS[filter].toLowerCase()} />
        </div>
      ) : (
        <>
          {/* ── Donut chart + legend ────────────────────────────────────── */}
          <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e293b]">
              <h2 className="text-white text-sm font-semibold">
                {filter === 'all' ? 'Allocation by Category' : 'Holding Allocation'}
              </h2>
            </div>
            <div className="flex items-center gap-4 px-4 py-5">
              <div className="flex-shrink-0">
                <DonutChart segments={donutSegments} />
              </div>
              <Legend segments={donutSegments} total={stats.totalValue} />
            </div>
          </div>

          {/* ── Summary cards ───────────────────────────────────────────── */}
          <div className={`grid gap-3 ${showBeta ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div className="bg-[#111827] rounded-2xl p-3 border border-[#1e293b] text-center">
              <p className="text-slate-500 text-[10px] font-medium mb-1">Total Value</p>
              <p className="text-white text-sm font-bold">{fmt$(stats.totalValue)}</p>
            </div>
            <div className="bg-[#111827] rounded-2xl p-3 border border-[#1e293b] text-center">
              <p className="text-slate-500 text-[10px] font-medium mb-1">
                {isHYSA ? 'Avg Rate' : 'Exp. Return'}
              </p>
              <p className="text-[#10d982] text-sm font-bold">{fmtPct(stats.portfolioReturn)}</p>
            </div>
            {showBeta && (
              <div className="bg-[#111827] rounded-2xl p-3 border border-[#1e293b] text-center">
                <p className="text-slate-500 text-[10px] font-medium mb-1">Beta</p>
                <p className="text-white text-sm font-bold">{stats.portfolioBeta.toFixed(2)}</p>
              </div>
            )}
            <div className="bg-[#111827] rounded-2xl p-3 border border-[#1e293b] text-center">
              <p className="text-slate-500 text-[10px] font-medium mb-1">
                {isHYSA ? 'Monthly Int.' : 'Monthly Div.'}
              </p>
              <p className="text-[#10d982] text-sm font-bold">{fmt$full(stats.totalMonthlyDividend)}</p>
            </div>
          </div>

          {/* ── Projection table ────────────────────────────────────────── */}
          <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e293b]">
              <h2 className="text-white text-sm font-semibold">Growth Projection</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                {isHYSA ? 'Compound interest at entered rate' : 'Based on expected returns'}
              </p>
            </div>
            <div className="divide-y divide-[#1e293b]">
              <div className="flex px-4 py-2">
                <p className="text-slate-500 text-[11px] font-medium w-12">Year</p>
                <p className="text-slate-500 text-[11px] font-medium flex-1 text-right">Proj. Value</p>
                <p className="text-slate-500 text-[11px] font-medium w-8 text-right">×</p>
                <p className="text-slate-500 text-[11px] font-medium flex-1 text-right">Total Gain</p>
              </div>
              {PROJECTION_YEARS.map((years) => {
                const projected = totalProjected(filteredHoldings, years);
                const gain = projected - stats.totalValue;
                const mult = stats.totalValue > 0 ? projected / stats.totalValue : 1;
                return (
                  <div key={years} className="flex items-center px-4 py-3">
                    <span className="text-white text-sm font-semibold w-12">{years}Y</span>
                    <span className="flex-1 text-right text-white text-sm font-semibold">{fmt$(projected)}</span>
                    <span className="w-8 text-right text-slate-500 text-xs">{mult.toFixed(1)}x</span>
                    <span className="flex-1 text-right text-[#10d982] text-sm font-semibold">+{fmt$(gain)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Income section ───────────────────────────────────────────── */}
          <div className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e293b]">
              <h2 className="text-white text-sm font-semibold">
                {isHYSA ? 'Interest Income' : 'Dividend Income'}
              </h2>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 gap-4 border-b border-[#1e293b]">
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Annual</p>
                <p className="text-[#10d982] text-xl font-bold">{fmt$full(stats.totalAnnualDividend)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Monthly</p>
                <p className="text-white text-xl font-bold">{fmt$full(stats.totalMonthlyDividend)}</p>
              </div>
            </div>
            <div className="divide-y divide-[#1e293b]">
              {calculated
                .filter((c) => c.annualDividend > 0)
                .sort((a, b) => b.annualDividend - a.annualDividend)
                .map((c) => {
                  const h = c.holding;
                  const color = colorFor(h);
                  return (
                    <div key={h.id} className="flex items-center px-4 py-3 gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <p className="text-white text-sm font-semibold w-14">{h.ticker}</p>
                      <p className="text-slate-500 text-xs flex-1">
                        {isHYSA
                          ? `${fmtPct(h.expectedReturn)} rate`
                          : `${fmtPct(h.dividendYield)} yield`}
                      </p>
                      <div className="text-right">
                        <p className="text-[#10d982] text-sm font-semibold">{fmt$full(c.annualDividend)}/yr</p>
                        <p className="text-slate-500 text-xs">{fmt$full(c.monthlyDividend)}/mo</p>
                      </div>
                    </div>
                  );
                })}
              {calculated.filter((c) => c.annualDividend > 0).length === 0 && (
                <p className="text-slate-500 text-xs text-center py-4">
                  {isHYSA ? 'No interest income' : 'No dividend income'}
                </p>
              )}
            </div>
          </div>

          {/* ── Per-holding breakdown table ──────────────────────────────── */}
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
                    <th className="text-right text-slate-500 font-medium px-2 py-2.5">Proj 40Y</th>
                    <th className="text-right text-slate-500 font-medium px-4 py-2.5">
                      {isHYSA ? 'Ann. Int.' : 'Ann. Div.'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {calculated.map((c) => {
                    const h = c.holding;
                    const color = colorFor(h);
                    const proj40 = projectedValue(h.amountInvested, h.expectedReturn, 40);
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
                        <td className="text-right px-2 py-3 text-[#10d982] font-medium">{fmt$(proj40)}</td>
                        <td className="text-right px-4 py-3 text-slate-300">{fmt$full(c.annualDividend)}</td>
                      </tr>
                    );
                  })}
                  {/* Totals */}
                  <tr className="bg-[#0d1523]">
                    <td className="px-4 py-3 text-white font-bold">Total</td>
                    <td className="text-right px-2 py-3 text-white font-bold">{fmt$(stats.totalValue)}</td>
                    <td className="text-right px-2 py-3 text-white font-bold">100%</td>
                    <td className="text-right px-2 py-3 text-[#10d982] font-bold">
                      {fmt$(totalProjected(filteredHoldings, 40))}
                    </td>
                    <td className="text-right px-4 py-3 text-white font-bold">{fmt$full(stats.totalAnnualDividend)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
