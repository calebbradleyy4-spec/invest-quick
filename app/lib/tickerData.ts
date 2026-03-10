import { HoldingType } from './types';

export interface TickerInfo {
  name: string;
  type: HoldingType;
  expectedReturn: number; // decimal
  beta: number;
  dividendYield: number; // decimal
}

const TICKER_DATA: Record<string, TickerInfo> = {
  // ── ETFs ──────────────────────────────────────────────────────────────────
  VOO:  { name: 'Vanguard S&P 500 ETF',                      type: 'Stock/ETF', expectedReturn: 0.10,  beta: 1.00,  dividendYield: 0.015  },
  VTI:  { name: 'Vanguard Total Stock Market ETF',            type: 'Stock/ETF', expectedReturn: 0.102, beta: 1.00,  dividendYield: 0.014  },
  VXUS: { name: 'Vanguard Total International Stock ETF',     type: 'Stock/ETF', expectedReturn: 0.08,  beta: 0.66,  dividendYield: 0.03   },
  QQQM: { name: 'Invesco Nasdaq 100 ETF',                     type: 'Stock/ETF', expectedReturn: 0.14,  beta: 1.17,  dividendYield: 0.006  },
  QQQ:  { name: 'Invesco QQQ Trust',                          type: 'Stock/ETF', expectedReturn: 0.14,  beta: 1.17,  dividendYield: 0.006  },
  SCHD: { name: 'Schwab US Dividend Equity ETF',              type: 'Stock/ETF', expectedReturn: 0.10,  beta: 0.62,  dividendYield: 0.035  },
  VGT:  { name: 'Vanguard Information Technology ETF',        type: 'Stock/ETF', expectedReturn: 0.15,  beta: 1.15,  dividendYield: 0.006  },
  JEPI: { name: 'JPMorgan Equity Premium Income ETF',         type: 'Stock/ETF', expectedReturn: 0.08,  beta: 0.55,  dividendYield: 0.075  },
  JEPQ: { name: 'JPMorgan Nasdaq Equity Premium Income ETF',  type: 'Stock/ETF', expectedReturn: 0.09,  beta: 0.65,  dividendYield: 0.095  },
  SPYI: { name: 'NEOS S&P 500 High Income ETF',               type: 'Stock/ETF', expectedReturn: 0.09,  beta: 0.60,  dividendYield: 0.12   },
  VYM:  { name: 'Vanguard High Dividend Yield ETF',           type: 'Stock/ETF', expectedReturn: 0.09,  beta: 0.75,  dividendYield: 0.028  },
  IVV:  { name: 'iShares Core S&P 500 ETF',                   type: 'Stock/ETF', expectedReturn: 0.10,  beta: 1.00,  dividendYield: 0.015  },
  SPY:  { name: 'SPDR S&P 500 ETF',                           type: 'Stock/ETF', expectedReturn: 0.10,  beta: 1.00,  dividendYield: 0.015  },
  AGG:  { name: 'iShares Core US Aggregate Bond ETF',         type: 'Stock/ETF', expectedReturn: 0.04,  beta: 0.10,  dividendYield: 0.035  },
  BND:  { name: 'Vanguard Total Bond Market ETF',             type: 'Stock/ETF', expectedReturn: 0.04,  beta: 0.10,  dividendYield: 0.034  },
  VNQ:  { name: 'Vanguard Real Estate ETF',                   type: 'Stock/ETF', expectedReturn: 0.08,  beta: 0.85,  dividendYield: 0.038  },
  ARKK: { name: 'ARK Innovation ETF',                         type: 'Stock/ETF', expectedReturn: 0.12,  beta: 1.60,  dividendYield: 0      },
  SMH:  { name: 'VanEck Semiconductor ETF',                   type: 'Stock/ETF', expectedReturn: 0.16,  beta: 1.25,  dividendYield: 0.007  },
  XLE:  { name: 'Energy Select Sector SPDR',                  type: 'Stock/ETF', expectedReturn: 0.09,  beta: 1.10,  dividendYield: 0.032  },
  GLD:  { name: 'SPDR Gold Shares',                           type: 'Stock/ETF', expectedReturn: 0.07,  beta: 0.10,  dividendYield: 0      },

  // ── Stocks ────────────────────────────────────────────────────────────────
  AAPL:  { name: 'Apple Inc',           type: 'Stock/ETF', expectedReturn: 0.14,  beta: 1.19,  dividendYield: 0.005  },
  MSFT:  { name: 'Microsoft Corp',      type: 'Stock/ETF', expectedReturn: 0.18,  beta: 0.90,  dividendYield: 0.007  },
  NVDA:  { name: 'NVIDIA Corp',         type: 'Stock/ETF', expectedReturn: 0.50,  beta: 1.68,  dividendYield: 0.0003 },
  AMZN:  { name: 'Amazon.com Inc',      type: 'Stock/ETF', expectedReturn: 0.22,  beta: 1.15,  dividendYield: 0      },
  GOOGL: { name: 'Alphabet Inc',        type: 'Stock/ETF', expectedReturn: 0.16,  beta: 1.05,  dividendYield: 0      },
  META:  { name: 'Meta Platforms',      type: 'Stock/ETF', expectedReturn: 0.24,  beta: 1.20,  dividendYield: 0.004  },
  TSLA:  { name: 'Tesla Inc',           type: 'Stock/ETF', expectedReturn: 0.20,  beta: 2.00,  dividendYield: 0      },
  'BRK.B': { name: 'Berkshire Hathaway', type: 'Stock/ETF', expectedReturn: 0.11, beta: 0.85,  dividendYield: 0      },
  JPM:   { name: 'JPMorgan Chase',      type: 'Stock/ETF', expectedReturn: 0.12,  beta: 1.10,  dividendYield: 0.021  },
  V:     { name: 'Visa Inc',            type: 'Stock/ETF', expectedReturn: 0.13,  beta: 0.95,  dividendYield: 0.007  },

  // ── Crypto ────────────────────────────────────────────────────────────────
  BTC:  { name: 'Bitcoin',    type: 'Crypto', expectedReturn: 0.40,  beta: 1.85,  dividendYield: 0 },
  ETH:  { name: 'Ethereum',   type: 'Crypto', expectedReturn: 0.30,  beta: 1.70,  dividendYield: 0 },
  SOL:  { name: 'Solana',     type: 'Crypto', expectedReturn: 0.45,  beta: 2.10,  dividendYield: 0 },
  XRP:  { name: 'XRP',        type: 'Crypto', expectedReturn: 0.25,  beta: 1.90,  dividendYield: 0 },
  LINK: { name: 'Chainlink',  type: 'Crypto', expectedReturn: 0.35,  beta: 2.00,  dividendYield: 0 },

  // ── Other ─────────────────────────────────────────────────────────────────
  HYSA: { name: 'High Yield Savings Account', type: 'HYSA', expectedReturn: 0.045, beta: 0, dividendYield: 0.045 },
};

export function lookupTicker(ticker: string): TickerInfo | null {
  return TICKER_DATA[ticker.trim().toUpperCase()] ?? null;
}
