import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Info,
  TrendingUp,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const ExplainabilityLab: React.FC = () => {
  const [baseValue] = useState<number>(0.349); // Dataset positive base rate (34.9%)
  const [selectedCase, setSelectedCase] = useState<'high' | 'borderline' | 'low'>('high');

  const caseData = {
    high: {
      name: 'Case A: High-Risk Metformin Candidate',
      probability: 88,
      factors: [
        { feature: 'Fasting Plasma Glucose', value: '168 mg/dL', shap: +0.38, push: 'up', note: 'Exceeds diabetic diagnostic cutoff (≥126 mg/dL)' },
        { feature: 'Body Mass Index (BMI)', value: '38.4 kg/m²', shap: +0.22, push: 'up', note: 'Class II Adiposity with peripheral insulin resistance' },
        { feature: 'Patient Age', value: '54 years', shap: +0.14, push: 'up', note: 'Age demographic metabolic rate adjustment' },
        { feature: 'Diabetes Pedigree Function', value: '0.85', shap: +0.11, push: 'up', note: 'Strong 1st-degree maternal & sibling familial diabetes history' },
        { feature: 'Pregnancies', value: '4 parity', shap: +0.05, push: 'up', note: 'History of gestational glucose intolerance' },
        { feature: 'Serum Insulin', value: '185 μU/mL', shap: -0.02, push: 'down', note: 'Elevated compensatory beta-cell secretion' },
      ],
    },
    borderline: {
      name: 'Case B: Borderline Pre-Diabetic Screening',
      probability: 48,
      factors: [
        { feature: 'Fasting Plasma Glucose', value: '118 mg/dL', shap: +0.18, push: 'up', note: 'Impaired fasting glycaemia (100-125 mg/dL)' },
        { feature: 'Body Mass Index (BMI)', value: '29.2 kg/m²', shap: +0.08, push: 'up', note: 'Overweight classification' },
        { feature: 'Patient Age', value: '38 years', shap: -0.04, push: 'down', note: 'Mid-adult demographic' },
        { feature: 'Diabetes Pedigree Function', value: '0.42', shap: -0.05, push: 'down', note: 'Average baseline genetic pedigree' },
        { feature: 'Pregnancies', value: '1 count', shap: -0.04, push: 'down', note: 'Low gestational burden' },
      ],
    },
    low: {
      name: 'Case C: Low-Risk Active Athlete',
      probability: 8,
      factors: [
        { feature: 'Fasting Plasma Glucose', value: '84 mg/dL', shap: -0.28, push: 'down', note: 'Optimal fasting euglycemia' },
        { feature: 'Body Mass Index (BMI)', value: '21.4 kg/m²', shap: -0.16, push: 'down', note: 'Lean body mass & high insulin sensitivity' },
        { feature: 'Patient Age', value: '24 years', shap: -0.12, push: 'down', note: 'Young healthy cohort' },
        { feature: 'Diabetes Pedigree Function', value: '0.18', shap: -0.08, push: 'down', note: 'No first-degree diabetic history' },
      ],
    },
  };

  const current = caseData[selectedCase];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-200">
        {/* Ambient background glows */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-gradient-to-br from-indigo-400/10 dark:from-indigo-500/20 via-pink-400/10 dark:via-pink-500/20 to-teal-400/10 dark:to-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-2xs">
            <Sliders className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>SHAP / Shapley Additive Explanations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Local Feature Attribution &{' '}
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              SHAP Force Visualizer
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Understand how each physiological biomarker moves the patient's risk probability away from the
            cohort baseline ($E[f(x)] = 34.9\%$) toward the final predicted outcome.
          </p>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-200">
        <button
          onClick={() => setSelectedCase('high')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer font-heading ${
            selectedCase === 'high'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          High Risk Case (88%)
        </button>
        <button
          onClick={() => setSelectedCase('borderline')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer font-heading ${
            selectedCase === 'borderline'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Borderline Case (48%)
        </button>
        <button
          onClick={() => setSelectedCase('low')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer font-heading ${
            selectedCase === 'low'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Low Risk Case (8%)
        </button>
      </div>

      {/* SHAP Force Plot Visualization */}
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">{current.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Base Value $E[f(x)] = 34.9\%$ &rarr; Final Predicted Output: <strong className="text-teal-700 dark:text-teal-400 font-mono">{current.probability}%</strong>
            </p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-bold uppercase font-mono shadow-2xs ${
              current.probability >= 60
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                : current.probability >= 35
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
            }`}
          >
            {current.probability}% Risk Score
          </span>
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-3">
          {current.factors.map((f, idx) => {
            const isUp = f.push === 'up';
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-heading">{f.feature}:</span>
                    <span className="font-mono text-teal-800 dark:text-teal-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-semibold">
                      {f.value}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{f.note}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                  {isUp ? (
                    <span className="text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> +{(f.shap * 100).toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {(f.shap * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
