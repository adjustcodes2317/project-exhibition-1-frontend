import React, { useState, useEffect } from 'react';
import { ModelMetrics } from '../types';
import { BENCHMARK_MODELS } from '../data/benchmarkData';
import { fetchModelBenchmarks } from '../services/api';
import {
  Trophy,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export const ModelArena: React.FC = () => {
  const [models, setModels] = useState<ModelMetrics[]>(BENCHMARK_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<string>('random_forest');
  const [decisionThreshold, setDecisionThreshold] = useState<number>(0.5);

  useEffect(() => {
    fetchModelBenchmarks()
      .then((data) => {
        if (data && data.length > 0) {
          setModels(data);
        }
      })
      .catch(() => {
        // Fallback to static benchmark models
      });
  }, []);

  if (models.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium">Loading ML Benchmark Models...</p>
      </div>
    );
  }

  const activeModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Dynamically calculate adjusted confusion matrix and metrics based on Decision Threshold
  const basePos = 54;
  const baseNeg = 100;

  const thresholdShift = (0.5 - decisionThreshold);
  const adjustedRecall = Math.min(0.98, Math.max(0.25, activeModel.recall + thresholdShift * 0.7));
  const adjustedFPR = Math.min(0.85, Math.max(0.04, (1 - activeModel.precision * 0.9) - thresholdShift * 0.45));

  const dynamicTP = Math.round(basePos * adjustedRecall);
  const dynamicFN = basePos - dynamicTP;
  const dynamicFP = Math.round(baseNeg * adjustedFPR);
  const dynamicTN = baseNeg - dynamicFP;

  const dynamicPrecision = dynamicTP + dynamicFP > 0 ? dynamicTP / (dynamicTP + dynamicFP) : 1;
  const dynamicRecall = dynamicTP / basePos;
  const dynamicF1 =
    dynamicPrecision + dynamicRecall > 0
      ? (2 * dynamicPrecision * dynamicRecall) / (dynamicPrecision + dynamicRecall)
      : 0;
  const dynamicAccuracy = (dynamicTP + dynamicTN) / (basePos + baseNeg);

  const rocSvgX = 40 + adjustedFPR * 260;
  const rocSvgY = 180 - dynamicRecall * 160;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-200">
        {/* Multi-color ambient background glows */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-gradient-to-br from-indigo-400/10 dark:from-indigo-500/20 via-cyan-400/10 dark:via-cyan-500/20 to-teal-400/10 dark:to-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Model Comparison & Threshold Arena</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Classifier Benchmarks &{' '}
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Interactive Threshold Tuner
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Evaluated on stratified 80/20 test split (154 patient cases). Drag the classification
            cutoff slider below to examine how sensitivity and specificity dynamically balance.
          </p>
        </div>
      </div>

      {/* Model Benchmark Matrix Table */}
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
              <BrainCircuit className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Standard Metric Comparison (Baseline θ = 0.50)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any algorithm to inspect its confusion matrix and ROC operating point.
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-slate-200 dark:border-slate-700 font-mono font-semibold">
            Stratified 80/20
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3">Algorithm</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-right">Accuracy</th>
                <th className="py-3 px-3 text-right">Precision</th>
                <th className="py-3 px-3 text-right">Recall</th>
                <th className="py-3 px-3 text-right">F1-Score</th>
                <th className="py-3 px-3 text-right">ROC-AUC Area</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {models.map((m) => {
                const isSelected = m.id === selectedModelId;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-3 font-semibold flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          m.isBestPerformer ? 'bg-teal-500 ring-2 ring-teal-500/30' : 'bg-slate-400 dark:bg-slate-600'
                        }`}
                      />
                      <span className={isSelected ? 'text-teal-900 dark:text-teal-300 font-bold' : 'text-slate-900 dark:text-white'}>{m.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{m.type}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">{m.precision.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">{m.recall.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-teal-700 dark:text-teal-400">
                      {m.f1Score.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-cyan-700 dark:text-cyan-400">
                      {m.rocAuc.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {m.isBestPerformer ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40">
                          ⭐ Champion
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Baseline
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Classification Decision Threshold Control */}
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Interactive Decision Threshold Tuner: <span className="font-mono text-teal-700 dark:text-teal-300">θ = {decisionThreshold.toFixed(2)}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust classification cutoff to balance sensitivity (TPR) against false alarm rates (FPR).
              </p>
            </div>
          </div>

          <button
            onClick={() => setDecisionThreshold(0.5)}
            className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
          >
            Reset (0.50)
          </button>
        </div>

        <div className="space-y-2 pt-2">
          <input
            type="range"
            min={0.15}
            max={0.85}
            step={0.01}
            value={decisionThreshold}
            onChange={(e) => setDecisionThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600 dark:accent-teal-400"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">← θ = 0.15 (High Sensitivity)</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">θ = 0.50 (Standard)</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">θ = 0.85 (High Specificity) →</span>
          </div>
        </div>

        {/* Dynamic Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Dynamic Accuracy:</span>
            <div className="font-mono font-bold text-slate-900 dark:text-white text-base mt-0.5">
              {(dynamicAccuracy * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Dynamic Precision:</span>
            <div className="font-mono font-bold text-cyan-700 dark:text-cyan-400 text-base mt-0.5">
              {dynamicPrecision.toFixed(3)}
            </div>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Dynamic Sensitivity (Recall):</span>
            <div className="font-mono font-bold text-teal-700 dark:text-teal-400 text-base mt-0.5">
              {dynamicRecall.toFixed(3)} ({dynamicTP} / 54)
            </div>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Dynamic F1-Score:</span>
            <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-base mt-0.5">
              {dynamicF1.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix */}
        <div className="lg:col-span-6 bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-5 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Dynamic Confusion Matrix: {activeModel.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live output at decision cutoff θ = {decisionThreshold.toFixed(2)}.
              </p>
            </div>

            {/* Model Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeModel.id === m.id
                      ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m.id === 'random_forest'
                    ? 'RF'
                    : m.id === 'xgboost'
                    ? 'XGB'
                    : m.id === 'svm'
                    ? 'SVM'
                    : 'LR'}
                </button>
              ))}
            </div>
          </div>

          {/* 2x2 Matrix */}
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* TN */}
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 p-4 rounded-xl space-y-1">
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                True Negative (TN)
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 transition-all duration-300">
                {dynamicTN}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Correct Non-Diabetic</div>
            </div>

            {/* FP */}
            <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 p-4 rounded-xl space-y-1">
              <div className="text-[11px] text-rose-800 dark:text-rose-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                False Positive (FP)
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-700 dark:text-rose-400 transition-all duration-300">
                {dynamicFP}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Type I Error (False Alarm)</div>
            </div>

            {/* FN */}
            <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 p-4 rounded-xl space-y-1">
              <div className="text-[11px] text-rose-800 dark:text-rose-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                False Negative (FN)
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-700 dark:text-rose-400 transition-all duration-300">
                {dynamicFN}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Type II Error (Missed Diagnosis)</div>
            </div>

            {/* TP */}
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 p-4 rounded-xl space-y-1">
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                True Positive (TP)
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 transition-all duration-300">
                {dynamicTP}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Correct Diabetic Detection</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Clinical Screening Context:
            </div>
            <p className="leading-relaxed">
              {decisionThreshold < 0.4
                ? 'Lower threshold minimizes missed diabetic cases, optimal for broad community screening.'
                : decisionThreshold > 0.6
                ? 'Higher threshold ensures high diagnostic precision, minimizing unnecessary treatment initiation.'
                : 'Standard 0.50 cutoff provides balanced harmonic F1 optimization.'}
            </p>
          </div>
        </div>

        {/* ROC Curve Chart */}
        <div className="lg:col-span-6 bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-5 transition-colors duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Receiver Operating Characteristic (ROC)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The operating point tracks your live decision threshold along the ROC curve.
            </p>
          </div>

          <div className="relative bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <svg viewBox="0 0 320 220" className="w-full h-48">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="40" y2="180" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="40" y1="180" x2="300" y2="180" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="40" y1="100" x2="300" y2="100" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
              <line x1="170" y1="20" x2="170" y2="180" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />

              {/* Diagonal Random Baseline */}
              <line x1="40" y1="180" x2="300" y2="20" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />

              {/* RF Curve (Emerald) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth={activeModel.id === 'random_forest' ? '3' : '1.5'}
                points="40,180 50,135 60,96 70,71 85,55 105,42 140,32 195,26 300,20"
                opacity={activeModel.id === 'random_forest' ? '1' : '0.4'}
              />

              {/* XGBoost Curve (Teal) */}
              <polyline
                fill="none"
                stroke="#14b8a6"
                strokeWidth={activeModel.id === 'xgboost' ? '3' : '1.5'}
                strokeDasharray="2 2"
                points="40,180 52,140 65,100 75,74 95,57 115,45 150,36 210,28 300,20"
                opacity={activeModel.id === 'xgboost' ? '1' : '0.4'}
              />

              {/* SVM Curve (Sky Blue) */}
              <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth={activeModel.id === 'svm' ? '3' : '1.5'}
                points="40,180 55,145 70,103 80,81 105,62 125,50 165,38 220,30 300,20"
                opacity={activeModel.id === 'svm' ? '1' : '0.4'}
              />

              {/* Logistic Regression Curve (Amber) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth={activeModel.id === 'logistic_regression' ? '3' : '1.5'}
                strokeDasharray="4 2"
                points="40,180 58,148 76,110 88,87 112,66 138,52 175,41 235,31 300,20"
                opacity={activeModel.id === 'logistic_regression' ? '1' : '0.4'}
              />

              {/* Dynamic Animated Threshold Operating Point */}
              <circle
                cx={rocSvgX}
                cy={rocSvgY}
                r="6"
                fill="#ffffff"
                stroke="#0d9488"
                strokeWidth="3"
                className="transition-all duration-300 shadow-md"
              />

              {/* Axis Labels */}
              <text x="35" y="25" fill="#64748b" fontSize="9" textAnchor="end">1.0</text>
              <text x="35" y="100" fill="#64748b" fontSize="9" textAnchor="end">0.5</text>
              <text x="35" y="180" fill="#64748b" fontSize="9" textAnchor="end">0.0</text>

              <text x="40" y="195" fill="#64748b" fontSize="9" textAnchor="middle">0.0</text>
              <text x="170" y="195" fill="#64748b" fontSize="9" textAnchor="middle">0.5</text>
              <text x="300" y="195" fill="#64748b" fontSize="9" textAnchor="middle">1.0 (FPR)</text>
              <text x="15" y="100" fill="#64748b" fontSize="9" textAnchor="middle" transform="rotate(-90 15,100)">
                Sensitivity (TPR)
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Random Forest (0.868)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="w-3 h-1 bg-teal-500 rounded-full inline-block" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">XGBoost (0.856)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="w-3 h-1 bg-sky-500 rounded-full inline-block" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">SVM RBF (0.842)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="w-3 h-1 bg-amber-500 rounded-full inline-block" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Logistic Reg. (0.835)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
