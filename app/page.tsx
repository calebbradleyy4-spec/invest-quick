'use client';

import { useState } from 'react';
import { Holding } from './lib/types';
import HomeTab from './components/HomeTab';
import PortfolioTab from './components/PortfolioTab';
import AnalyzeTab from './components/AnalyzeTab';
import BottomNav, { Tab } from './components/BottomNav';

export default function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
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
