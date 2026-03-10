export type HoldingType = 'Stock/ETF' | 'Crypto' | 'HYSA';

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  type: HoldingType;
  amountInvested: number;
  expectedReturn: number; // decimal, e.g. 0.10 for 10%
  beta: number;
  dividendYield: number; // decimal, e.g. 0.015 for 1.5%
}

export interface CalculatedHolding {
  holding: Holding;
  weight: number;
  weightedReturn: number;
  weightedBeta: number;
  annualDividend: number;
  monthlyDividend: number;
}

export interface PortfolioStats {
  totalValue: number;
  portfolioReturn: number;
  portfolioBeta: number;
  totalAnnualDividend: number;
  totalMonthlyDividend: number;
}
