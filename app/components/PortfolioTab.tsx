'use client';

import { useState, useRef, useEffect } from 'react';
import { Holding, HoldingType } from '../lib/types';
import { calculatePortfolio, fmt$, fmtPct, HOLDING_COLORS } from '../lib/calculations';

interface PortfolioTabProps {
  holdings: Holding[];
  setHoldings: React.Dispatch<React.SetStateAction<Holding[]>>;
}

const DEFAULT_FORM = {
  ticker: '',
  name: '',
  type: 'Stock/ETF' as HoldingType,
  amountInvested: '',
  expectedReturn: '',
  beta: '',
  dividendYield: '',
};

function AmountInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const start = () => {
    setRaw(value === 0 ? '' : String(value));
    setEditing(true);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const n = parseFloat(raw);
    if (!isNaN(n) && n >= 0) onChange(n);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-28 bg-[#0a0e1a] border border-[#10d982] rounded-lg px-2 py-1 text-sm text-white text-right focus:outline-none"
        placeholder="0"
      />
    );
  }

  return (
    <button
      onClick={start}
      className="text-right group"
    >
      <span className="text-white text-sm font-semibold group-hover:text-[#10d982] transition-colors">
        {fmt$(value)}
      </span>
      <svg className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#10d982" strokeWidth="2" strokeLinecap="round" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#10d982" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

interface AddFormProps {
  onAdd: (h: Holding) => void;
  onClose: () => void;
}

function AddHoldingForm({ onAdd, onClose }: AddFormProps) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const submit = () => {
    if (!form.ticker.trim()) return setError('Ticker is required');
    if (!form.name.trim()) return setError('Name is required');
    const amount = parseFloat(form.amountInvested);
    if (isNaN(amount) || amount < 0) return setError('Enter a valid amount');
    const ret = parseFloat(form.expectedReturn);
    if (isNaN(ret)) return setError('Enter a valid expected return');
    const beta = parseFloat(form.beta);
    if (isNaN(beta)) return setError('Enter a valid beta');
    const div = parseFloat(form.dividendYield) || 0;

    onAdd({
      id: Date.now().toString(),
      ticker: form.ticker.trim().toUpperCase(),
      name: form.name.trim(),
      type: form.type,
      amountInvested: amount,
      expectedReturn: ret / 100,
      beta,
      dividendYield: div / 100,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-md mx-auto left-1/2 -translate-x-1/2 w-full">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#111827] rounded-t-3xl border-t border-[#1e293b] px-5 pt-5 pb-10 space-y-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white text-lg font-bold">Add Holding</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {error && (
          <p className="text-[#f43f5e] text-sm bg-[#f43f5e]/10 rounded-xl px-3 py-2">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-500 text-xs font-medium mb-1 block">Ticker *</label>
            <input
              className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#10d982] uppercase"
              placeholder="VOO"
              value={form.ticker}
              onChange={(e) => set('ticker', e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label className="text-slate-500 text-xs font-medium mb-1 block">Type *</label>
            <select
              className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#10d982]"
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
            >
              <option>Stock/ETF</option>
              <option>Crypto</option>
              <option>HYSA</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-500 text-xs font-medium mb-1 block">Name *</label>
          <input
            className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#10d982]"
            placeholder="Vanguard S&P 500 ETF"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </div>

        <div>
          <label className="text-slate-500 text-xs font-medium mb-1 block">Amount Invested ($) *</label>
          <input
            type="number"
            className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#10d982]"
            placeholder="1000"
            value={form.amountInvested}
            onChange={(e) => set('amountInvested', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-slate-500 text-xs font-medium mb-1 block">Return % *</label>
            <input
              type="number"
              className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#10d982]"
              placeholder="10"
              value={form.expectedReturn}
              onChange={(e) => set('expectedReturn', e.target.value)}
            />
          </div>
          <div>
            <label className="text-slate-500 text-xs font-medium mb-1 block">Beta *</label>
            <input
              type="number"
              className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#10d982]"
              placeholder="1.0"
              value={form.beta}
              onChange={(e) => set('beta', e.target.value)}
            />
          </div>
          <div>
            <label className="text-slate-500 text-xs font-medium mb-1 block">Div Yield %</label>
            <input
              type="number"
              className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#10d982]"
              placeholder="0"
              value={form.dividendYield}
              onChange={(e) => set('dividendYield', e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full py-3.5 rounded-2xl bg-[#10d982] text-[#0a0e1a] font-bold text-sm mt-2 active:opacity-90"
        >
          Add Holding
        </button>
      </div>
    </div>
  );
}

export default function PortfolioTab({ holdings, setHoldings }: PortfolioTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const { calculated, stats } = calculatePortfolio(holdings);

  const updateAmount = (id: string, amount: number) => {
    setHoldings((prev) =>
      prev.map((h) => (h.id === id ? { ...h, amountInvested: amount } : h))
    );
  };

  const deleteHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const addHolding = (h: Holding) => {
    setHoldings((prev) => [...prev, h]);
  };

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Holdings</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">Portfolio</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#10d982] text-[#0a0e1a] font-bold text-sm px-4 py-2.5 rounded-xl active:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#0a0e1a" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Add
        </button>
      </div>

      {/* Holdings Cards */}
      <div className="space-y-3 mb-4">
        {calculated.map((c, i) => {
          const color = HOLDING_COLORS[i % HOLDING_COLORS.length];
          const h = c.holding;
          return (
            <div
              key={h.id}
              className="bg-[#111827] rounded-2xl border border-[#1e293b] overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center px-4 pt-4 pb-3 gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {h.ticker.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-bold">{h.ticker}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-[#1e293b] text-slate-400">
                      {h.type}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs truncate">{h.name}</p>
                </div>
                <button
                  onClick={() => deleteHolding(h.id)}
                  className="w-8 h-8 rounded-full bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center flex-shrink-0 active:bg-[#f43f5e]/30"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Card Stats */}
              <div className="px-4 pb-4 grid grid-cols-3 gap-y-3">
                <div>
                  <p className="text-slate-500 text-[10px] font-medium mb-1">Invested</p>
                  <AmountInput
                    value={h.amountInvested}
                    onChange={(v) => updateAmount(h.id, v)}
                  />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-medium mb-1">Weight</p>
                  <p className="text-white text-sm font-semibold">{fmtPct(c.weight)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-medium mb-1">W. Return</p>
                  <p className="text-[#10d982] text-sm font-semibold">{fmtPct(c.weightedReturn, 2)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-medium mb-1">Exp. Return</p>
                  <p className="text-white text-sm font-semibold">{fmtPct(h.expectedReturn)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-medium mb-1">Beta</p>
                  <p className="text-white text-sm font-semibold">{h.beta.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-medium mb-1">Beta Contrib.</p>
                  <p className="text-white text-sm font-semibold">{c.weightedBeta.toFixed(3)}</p>
                </div>
              </div>

              {/* Progress bar showing weight */}
              <div className="h-0.5 bg-[#1e293b]">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${c.weight * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals Bar */}
      <div className="bg-[#111827] rounded-2xl border border-[#1e293b] p-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-slate-500 text-[10px] font-medium mb-1">Total Invested</p>
          <p className="text-white text-sm font-bold">{fmt$(stats.totalValue)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-[10px] font-medium mb-1">Portfolio Return</p>
          <p className="text-[#10d982] text-sm font-bold">{fmtPct(stats.portfolioReturn)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-[10px] font-medium mb-1">Portfolio Beta</p>
          <p className="text-white text-sm font-bold">{stats.portfolioBeta.toFixed(2)}</p>
        </div>
      </div>

      {showAddForm && (
        <AddHoldingForm onAdd={addHolding} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
