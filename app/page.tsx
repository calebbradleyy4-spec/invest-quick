'use client';

import { useState } from 'react';
import { Holding } from './lib/types';
import HomeTab from './components/HomeTab';
import PortfolioTab from './components/PortfolioTab';
import AnalyzeTab from './components/AnalyzeTab';
import BottomNav, { Tab } from './components/BottomNav';

const DEFAULT_HOLDINGS: Holding[] = [
  {
    id: '1',
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    type: 'Stock/ETF',
    amountInvested: 3888,
    expectedReturn: 0.10,
    beta: 1.0,
    dividendYield: 0.015,
  },
  {
    id: '2',
    ticker: 'VXUS',
    name: 'Vanguard Total International Stock',
    type: 'Stock/ETF',
    amountInvested: 1259,
    expectedReturn: 0.08,
    beta: 0.66,
    dividendYield: 0.03,
  },
  {
    id: '3',
    ticker: 'QQQM',
    name: 'Invesco NASDAQ 100 ETF',
    type: 'Stock/ETF',
    amountInvested: 1562,
    expectedReturn: 0.14,
    beta: 1.17,
    dividendYield: 0.006,
  },
  {
    id: '4',
    ticker: 'SCHD',
    name: 'Schwab US Dividend Equity ETF',
    type: 'Stock/ETF',
    amountInvested: 934,
    expectedReturn: 0.10,
    beta: 0.62,
    dividendYield: 0.035,
  },
  {
    id: '5',
    ticker: 'BTC',
    name: 'Bitcoin',
    type: 'Crypto',
    amountInvested: 1193,
    expectedReturn: 0.40,
    beta: 1.85,
    dividendYield: 0,
  },
  {
    id: '6',
    ticker: 'ETH',
    name: 'Ethereum',
    type: 'Crypto',
    amountInvested: 335,
    expectedReturn: 0.30,
    beta: 1.70,
    dividendYield: 0,
  },
];

export default function App() {
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen bg-[#0a0e1a] max-w-md mx-auto relative">
      <main className="min-h-screen pb-32">
        {activeTab === 'home' && <HomeTab holdings={holdings} />}
        {activeTab === 'portfolio' && (
          <PortfolioTab holdings={holdings} setHoldings={setHoldings} />
        )}
        {activeTab === 'analyze' && <AnalyzeTab holdings={holdings} />}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
