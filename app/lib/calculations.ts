import { Holding, CalculatedHolding, PortfolioStats } from './types';

export const HOLDING_COLORS = [
  '#10d982',
  '#3b82f6',
  '#a855f7',
  '#f59e0b',
  '#f97316',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#ef4444',
  '#8b5cf6',
];

export function calculatePortfolio(holdings: Holding[]): {
  calculated: CalculatedHolding[];
  stats: PortfolioStats;
} {
  const totalValue = holdings.reduce((sum, h) => sum + h.amountInvested, 0);

  const calculated: CalculatedHolding[] = holdings.map((h) => {
    const weight = totalValue > 0 ? h.amountInvested / totalValue : 0;
    const annualDividend = h.amountInvested * h.dividendYield;
    return {
      holding: h,
      weight,
      weightedReturn: h.expectedReturn * weight,
      weightedBeta: h.beta * weight,
      annualDividend,
      monthlyDividend: annualDividend / 12,
    };
  });

  const stats: PortfolioStats = {
    totalValue,
    portfolioReturn: calculated.reduce((sum, c) => sum + c.weightedReturn, 0),
    portfolioBeta: calculated.reduce((sum, c) => sum + c.weightedBeta, 0),
    totalAnnualDividend: calculated.reduce((sum, c) => sum + c.annualDividend, 0),
    totalMonthlyDividend: calculated.reduce((sum, c) => sum + c.monthlyDividend, 0),
  };

  return { calculated, stats };
}

export function projectedValue(amount: number, rate: number, years: number): number {
  return amount * Math.pow(1 + rate, years);
}

export function totalProjected(holdings: Holding[], years: number): number {
  return holdings.reduce((sum, h) => sum + projectedValue(h.amountInvested, h.expectedReturn, years), 0);
}

export function fmt$(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 10_000) return `$${(value / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function fmt$full(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function fmtPct(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
