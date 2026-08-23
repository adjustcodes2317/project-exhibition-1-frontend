import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LivePredictor } from './components/LivePredictor';
import { EDALab } from './components/EDALab';
import { ModelArena } from './components/ModelArena';
import { ExplainabilityLab } from './components/ExplainabilityLab';
import { BatchTester } from './components/BatchTester';
import { ProjectReportModal } from './components/ProjectReportModal';
import { Activity } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'predict' | 'eda' | 'models' | 'explain' | 'batch'>('predict');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] bg-hue-mesh text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Dynamic Luminous Floating Ambient Aurora Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {/* Soft Pastel Emerald Orb */}
        <motion.div
          animate={{
            x: [0, 45, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-28 left-[8%] w-[560px] h-[560px] rounded-full blur-[120px] ${
            isDark
              ? 'bg-emerald-500/15 mix-blend-screen'
              : 'bg-emerald-300/25 mix-blend-multiply'
          }`}
        />

        {/* Soft Pastel Sky Cyan Orb */}
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[18%] -right-20 w-[600px] h-[600px] rounded-full blur-[130px] ${
            isDark
              ? 'bg-cyan-500/15 mix-blend-screen'
              : 'bg-sky-300/25 mix-blend-multiply'
          }`}
        />

        {/* Soft Pastel Pink / Rose Orb */}
        <motion.div
          animate={{
            x: [0, 40, -45, 0],
            y: [0, -45, 25, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[45%] left-[2%] w-[540px] h-[540px] rounded-full blur-[120px] ${
            isDark
              ? 'bg-rose-500/12 mix-blend-screen'
              : 'bg-rose-200/25 mix-blend-multiply'
          }`}
        />

        {/* Soft Royal Violet Orb */}
        <motion.div
          animate={{
            x: [0, -40, 35, 0],
            y: [0, 30, -45, 0],
            scale: [1, 1.1, 0.92, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -bottom-24 right-[12%] w-[580px] h-[580px] rounded-full blur-[130px] ${
            isDark
              ? 'bg-indigo-500/15 mix-blend-screen'
              : 'bg-indigo-200/30 mix-blend-multiply'
          }`}
        />

        {/* Luminous Golden Honeycomb Orb */}
        <motion.div
          animate={{
            x: [0, 35, -25, 0],
            y: [0, -25, 35, 0],
            scale: [1, 0.94, 1.15, 1],
          }}
          transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-[8%] left-[30%] w-[520px] h-[520px] rounded-full blur-[120px] ${
            isDark
              ? 'bg-amber-500/10 mix-blend-screen'
              : 'bg-amber-200/25 mix-blend-multiply'
          }`}
        />

        {/* Subtle Light/Dark Dot Grid overlay */}
        <div className="absolute inset-0 subtle-dot-grid opacity-40 dark:opacity-25 pointer-events-none" />
      </div>

      {/* Top Navbar */}
      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenReport={() => setIsReportModalOpen(true)}
        />
      </div>

      {/* Main Content Area with Animated Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'predict' && (
            <motion.div
              key="predict"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <LivePredictor
                onNavigateToModels={() => setActiveTab('models')}
                onNavigateToEDA={() => setActiveTab('eda')}
              />
            </motion.div>
          )}

          {activeTab === 'eda' && (
            <motion.div
              key="eda"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <EDALab />
            </motion.div>
          )}

          {activeTab === 'models' && (
            <motion.div
              key="models"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ModelArena />
            </motion.div>
          )}

          {activeTab === 'explain' && (
            <motion.div
              key="explain"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ExplainabilityLab />
            </motion.div>
          )}

          {activeTab === 'batch' && (
            <motion.div
              key="batch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <BatchTester />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Sleek Light / Dark Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/75 backdrop-blur-xl py-8 mt-12 relative z-10 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white font-bold shadow-md shadow-teal-600/20">
                <Activity className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight font-heading">
                DiaPredict AI
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">
                • Clinical Risk Intelligence
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('predict')}
                className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 font-medium transition-colors cursor-pointer"
              >
                Predictor
              </button>
              <button
                onClick={() => setActiveTab('eda')}
                className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 font-medium transition-colors cursor-pointer"
              >
                EDA Analysis
              </button>
              <button
                onClick={() => setActiveTab('models')}
                className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 font-medium transition-colors cursor-pointer"
              >
                Model Arena
              </button>
              <button
                onClick={() => setActiveTab('explain')}
                className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 font-medium transition-colors cursor-pointer"
              >
                Explainability
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 font-medium transition-colors cursor-pointer"
              >
                Methodology
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div>
              Interactive Machine Learning Diabetes Risk Scoring Prototype.
            </div>
            <div>
              High-Precision Random Forest & Ensemble Architecture
            </div>
          </div>
        </div>
      </footer>

      {/* Project Exhibition Report Modal */}
      <ProjectReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
