import React from 'react';
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Sliders,
  Layers,
  FileText,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: 'predict' | 'eda' | 'models' | 'explain' | 'batch';
  setActiveTab: (tab: 'predict' | 'eda' | 'models' | 'explain' | 'batch') => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'predict' as const, label: 'Live Predictor', icon: Activity },
    { id: 'eda' as const, label: 'Dataset EDA', icon: BarChart3 },
    { id: 'models' as const, label: 'Model Arena', icon: BrainCircuit },
    { id: 'explain' as const, label: 'SHAP Explainability', icon: Sliders },
    { id: 'batch' as const, label: 'Cohort Screener', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl border-b border-slate-200/90 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 ring-1 ring-teal-500/20">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight font-heading text-slate-900 dark:text-white">
                  Dia<span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">Predict</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-500/30 font-mono shadow-2xs">
                  ML ENGINE
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block -mt-0.5">
                Clinical Risk Stratification Intelligence
              </span>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-500/30 shadow-xs font-bold ring-1 ring-teal-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Methodology */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-2xs cursor-pointer text-xs font-semibold"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  <span className="hidden sm:inline text-[11px] font-medium text-slate-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/10" />
                  <span className="hidden sm:inline text-[11px] font-medium text-slate-600">Dark</span>
                </>
              )}
            </button>

            {/* Methodology Modal Trigger */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Methodology</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-1.5 pb-3 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-400 dark:border-teal-500/50 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
