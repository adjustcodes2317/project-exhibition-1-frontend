import React, { useState, useEffect } from 'react';
import { EDAResponse, DatasetFeatureStat } from '../types';
import { PIMA_EDA_DATA } from '../data/edaData';
import { fetchEDAStats } from '../services/api';
import {
  BarChart3,
  Database,
  PieChart,
  Activity,
  Layers,
  ArrowUpDown,
  Sparkles,
  Info,
} from 'lucide-react';

export const EDALab: React.FC = () => {
  const [edaData, setEdaData] = useState<EDAResponse>(PIMA_EDA_DATA);
  const [selectedFeature, setSelectedFeature] = useState<string>('glucose');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEDAStats()
      .then((data) => {
        if (data?.featureStats) {
          setEdaData(data);
        }
      })
      .catch(() => {
        // Fallback to static EDA stats
      });
  }, []);

  if (isLoading || !edaData) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium">Computing Cohort Exploratory Data Analysis...</p>
      </div>
    );
  }

  const activeStat =
    edaData.featureStats.find((f) => f.feature === selectedFeature) ||
    edaData.featureStats[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-200">
        {/* Luminous ambient background glows */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-gradient-to-br from-emerald-400/10 dark:from-emerald-500/20 via-cyan-400/10 dark:via-cyan-500/20 to-indigo-400/10 dark:to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-2xs">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Dataset Exploration & Feature Distributions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Clinical Patient Cohort{' '}
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Statistical Distributions
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Examine biomarker distributions, clinical zero-imputation adjustments, and correlation coefficients across 768 patient records.
          </p>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-1 transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Patient Records</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{edaData.totalRecords}</div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Cohort Population Size</span>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-1 transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Non-Diabetic (0)</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {edaData.negativeRecords} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">({edaData.negativePercentage}%)</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Majority Class</span>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-1 transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Diabetic (1)</span>
          <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {edaData.positiveRecords} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">({edaData.positivePercentage}%)</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Minority Class</span>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-1 transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Class Ratio</span>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">1 : 1.87</div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Moderate Imbalance</span>
        </div>
      </div>

      {/* Class Imbalance Bar */}
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <PieChart className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Outcome Target Class Distribution (65.1% vs 34.9%)
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Addressed via Stratified K-Fold</span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-700">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${edaData.negativePercentage}%` }}
            title={`Negative: ${edaData.negativePercentage}%`}
          />
          <div
            className="h-full bg-rose-500"
            style={{ width: `${edaData.positivePercentage}%` }}
            title={`Positive: ${edaData.positivePercentage}%`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-2xs" />
            Class 0 (Non-Diabetic): 500 cases ({edaData.negativePercentage}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-2xs" />
            Class 1 (Diabetic): 268 cases ({edaData.positivePercentage}%)
          </span>
        </div>
      </div>

      {/* Feature Distribution Inspector & Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Feature List */}
        <div className="lg:col-span-4 bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-3 transition-colors duration-200">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Biomarker Feature Selector</h3>
          <div className="space-y-1.5">
            {edaData.featureStats.map((f) => {
              const isSelected = f.feature === selectedFeature;
              return (
                <button
                  key={f.feature}
                  onClick={() => setSelectedFeature(f.feature)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-500/50 text-teal-800 dark:text-teal-300 shadow-2xs font-bold'
                      : 'bg-slate-50/80 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{f.unit}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Histogram Chart Card */}
        <div className="lg:col-span-8 bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-5 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                {activeStat.label} Distribution by Diagnostic Outcome
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparative cohort frequencies between diabetic (red) and non-diabetic (green) patients.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-slate-200 dark:border-slate-700 font-semibold">
              Imputed 0s: {activeStat.imputedZeroCount}
            </span>
          </div>

          {/* Histogram Bars */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            {activeStat.histogramBins.map((bin, i) => {
              const maxCount = 180;
              const nonDiabeticPct = (bin.nonDiabeticCount / maxCount) * 100;
              const diabeticPct = (bin.diabeticCount / maxCount) * 100;

              return (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 text-[11px]">
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{bin.label} {activeStat.unit}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Non-Diab: {bin.nonDiabeticCount} | Diab: {bin.diabeticCount}
                    </span>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex overflow-hidden gap-0.5 border border-slate-300/60 dark:border-slate-700">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${nonDiabeticPct}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${diabeticPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Biomarker Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Cohort Mean ± Std:</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {activeStat.mean} ± {activeStat.std}
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Cohort Median:</span>
              <div className="font-mono font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                {activeStat.median} {activeStat.unit}
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Non-Diabetic Mean:</span>
              <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {activeStat.nonDiabeticMean} {activeStat.unit}
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Diabetic Group Mean:</span>
              <div className="font-mono font-bold text-rose-700 dark:text-rose-400 mt-0.5">
                {activeStat.diabeticMean} {activeStat.unit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
