import React from 'react';
import { PredictionResponse, PatientData } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  FileText,
  Stethoscope,
  Share2,
  ShieldAlert,
  BarChart2,
  Info,
} from 'lucide-react';

interface PredictionResultCardProps {
  result: PredictionResponse | null;
  patientData: PatientData;
  onOpenAIConsultation: () => void;
  isLoadingAI: boolean;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  patientData,
  onOpenAIConsultation,
  isLoadingAI,
}) => {
  const { isDark } = useTheme();

  if (!result) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-8 text-center text-slate-400 space-y-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mx-auto flex items-center justify-center text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700">
          <Stethoscope className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Evaluating Biomarkers...</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
            Adjust patient inputs or select a clinical preset to view live risk scoring.
          </p>
        </div>
      </div>
    );
  }

  const isHighRisk = result.riskLevel === 'High Risk';
  const isModerateRisk = result.riskLevel === 'Moderate Risk';

  const copyToClipboard = () => {
    const text = `DiaPredict - Clinical Risk Assessment
Result: ${result.riskLevel} (${result.probability}% Probability)
Model: ${result.modelName} (Accuracy: ${(result.modelAccuracy * 100).toFixed(1)}%, F1: ${result.modelF1})
Patient Fasting Glucose: ${patientData.glucose} mg/dL | BMI: ${patientData.bmi} | Age: ${patientData.age}
Top Drivers: ${result.topRiskDrivers.join('; ')}
Recommendations: ${result.preventativeRecommendations.join('; ')}`;

    navigator.clipboard.writeText(text);
    alert('Patient Assessment copied to clipboard!');
  };

  // Semi-circle gauge needle rotation angle: 0% = -90deg, 100% = 90deg
  const needleAngle = -90 + (result.probability / 100) * 180;

  return (
    <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6 transition-colors duration-200">
      {/* Top Banner & Risk Gauge */}
      <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs transition-all duration-300 ${
                isHighRisk
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-400'
                  : isModerateRisk
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isHighRisk ? (
                <ShieldAlert className="w-7 h-7" />
              ) : isModerateRisk ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <CheckCircle2 className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors shadow-2xs ${
                    isHighRisk
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                      : isModerateRisk
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                  }`}
                >
                  {result.riskLevel}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Class: <strong className="text-slate-800 dark:text-slate-200 font-mono">{result.prediction === 1 ? 'Positive (1)' : 'Negative (0)'}</strong>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 font-heading">
                {isHighRisk
                  ? 'Elevated Diabetes Risk'
                  : isModerateRisk
                  ? 'Borderline Metabolic Profile'
                  : 'Low Diabetes Risk Profile'}
              </h3>
            </div>
          </div>

          {/* Probability Metric */}
          <div className="text-right sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-4">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Predicted Probability</div>
            <div className="flex items-baseline justify-end gap-1">
              <span
                className={`text-4xl font-extrabold font-mono transition-colors duration-300 ${
                  isHighRisk
                    ? 'text-rose-600 dark:text-rose-400'
                    : isModerateRisk
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {result.probability}
              </span>
              <span className="text-base text-slate-500 dark:text-slate-400 font-semibold">%</span>
            </div>
          </div>
        </div>

        {/* Dynamic SVG Semi-Circular Gauge Meter */}
        <div className="relative pt-2 flex flex-col items-center justify-center">
          <svg viewBox="0 0 200 110" className="w-48 sm:w-56 h-28">
            <defs>
              <linearGradient id="gaugeGradAdaptive" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Background Arc Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Colored Gradient Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradAdaptive)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * (result.probability / 100))}
              className="transition-all duration-700 ease-out"
            />

            {/* Center Pivot Point */}
            <circle cx="100" cy="100" r="7" fill={isDark ? '#475569' : '#64748b'} />
            <circle cx="100" cy="100" r="4" fill={isDark ? '#2dd4bf' : '#0d9488'} />

            {/* Dynamic Needle */}
            <g
              style={{
                transform: `rotate(${needleAngle}deg)`,
                transformOrigin: '100px 100px',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke={isDark ? '#f8fafc' : '#0f172a'}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* Gauge Labels */}
            <text x="20" y="108" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">0%</text>
            <text x="100" y="24" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">50%</text>
            <text x="180" y="108" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle">100%</text>
          </svg>

          <div className="flex items-center justify-between w-full text-[10px] text-slate-500 dark:text-slate-400 px-4 -mt-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">● Low (&lt;35%)</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">● Moderate (35-59%)</span>
            <span className="text-rose-700 dark:text-rose-400 font-semibold">● High (≥60%)</span>
          </div>
        </div>
      </div>

      {/* Model Benchmark Performance Bar */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Model Accuracy</div>
          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {(result.modelAccuracy * 100).toFixed(1)}%
          </div>
        </div>
        <div className="border-x border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">F1-Score (Balanced)</div>
          <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 mt-0.5">
            {result.modelF1}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">ROC-AUC Area</div>
          <div className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 mt-0.5">
            {result.modelRocAuc}
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution Waterfall */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-heading">
            <BarChart2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Live Feature Attribution (SHAP Odds Impact)
          </h4>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Local Interpretability</span>
        </div>

        <div className="space-y-2 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          {result.featureContributions.map((fc) => {
            const isPushingUp = fc.impactScore > 0;
            const isPushingDown = fc.impactScore < 0;
            const absScore = Math.abs(fc.impactScore);
            const percentageWidth = Math.min(100, Math.max(8, absScore * 100 * 0.9));

            return (
              <div key={fc.feature} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="font-medium flex items-center gap-1.5">
                    {fc.label}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      ({fc.value} {fc.unit})
                    </span>
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    {isPushingUp ? (
                      <span className="text-rose-700 dark:text-rose-400 flex items-center gap-0.5 font-semibold">
                        <TrendingUp className="w-3 h-3 text-rose-600 dark:text-rose-400" /> +{fc.impactScore}
                      </span>
                    ) : isPushingDown ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 font-semibold">
                        <TrendingDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {fc.impactScore}
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">0.00</span>
                    )}
                  </div>
                </div>

                {/* Relative Bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  {isPushingDown && (
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentageWidth}%` }}
                    />
                  )}
                  {isPushingUp && (
                    <div
                      className="h-full bg-rose-500 rounded-full ml-auto transition-all duration-500"
                      style={{ width: `${percentageWidth}%` }}
                    />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{fc.clinicalNote}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Clinical Drivers Callout */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          Primary Risk Determinants:
        </div>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pl-4 list-disc">
          {result.topRiskDrivers.map((driver, i) => (
            <li key={i}>{driver}</li>
          ))}
        </ul>
      </div>

      {/* Preventative Recommendations */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">
          Clinical Guidance & Preventative Steps:
        </h4>
        <div className="space-y-1.5">
          {result.preventativeRecommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          id="clinical-report-btn"
          onClick={onOpenAIConsultation}
          disabled={isLoadingAI}
          className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-600/20 hover:shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          {isLoadingAI ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FileText className="w-4 h-4 text-white" />
              <span className="font-heading tracking-wide">Generate Clinical Diagnostic Report</span>
            </>
          )}
        </button>

        <button
          type="button"
          id="copy-summary-btn"
          onClick={copyToClipboard}
          className="w-full sm:w-auto px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Copy Summary</span>
        </button>
      </div>
    </div>
  );
};
