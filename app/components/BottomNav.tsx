'use client';

export type Tab = 'analyze' | 'home' | 'portfolio';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

function AnalyzeIcon({ active }: { active: boolean }) {
  const color = active ? '#10d982' : '#64748b';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 3v18h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 16l4-4 4 4 4-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? '#0a0e1a' : '#94a3b8';
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PortfolioIcon({ active }: { active: boolean }) {
  const color = active ? '#10d982' : '#64748b';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="15" rx="2" stroke={color} strokeWidth="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="15" x2="16" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div className="bg-[#111827] border-t border-[#1e293b] flex items-end justify-around px-6 pb-6 pt-3">
        {/* Analyze */}
        <button
          onClick={() => setActiveTab('analyze')}
          className="flex flex-col items-center gap-1.5 min-w-[64px]"
        >
          <AnalyzeIcon active={activeTab === 'analyze'} />
          <span className={`text-[11px] font-medium tracking-wide ${activeTab === 'analyze' ? 'text-[#10d982]' : 'text-slate-500'}`}>
            Analyze
          </span>
        </button>

        {/* Home - elevated center */}
        <div className="relative -mt-10 flex flex-col items-center gap-1.5">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-[#10d982] border-[#10d982] shadow-[0_0_24px_rgba(16,217,130,0.4)]'
                : 'bg-[#1e293b] border-[#2d3f55]'
            }`}
          >
            <HomeIcon active={activeTab === 'home'} />
          </button>
          <span className={`text-[11px] font-medium tracking-wide ${activeTab === 'home' ? 'text-[#10d982]' : 'text-slate-500'}`}>
            Home
          </span>
        </div>

        {/* Portfolio */}
        <button
          onClick={() => setActiveTab('portfolio')}
          className="flex flex-col items-center gap-1.5 min-w-[64px]"
        >
          <PortfolioIcon active={activeTab === 'portfolio'} />
          <span className={`text-[11px] font-medium tracking-wide ${activeTab === 'portfolio' ? 'text-[#10d982]' : 'text-slate-500'}`}>
            Portfolio
          </span>
        </button>
      </div>
    </div>
  );
}
