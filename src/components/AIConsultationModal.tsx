import React from 'react';
import { AIConsultationResponse, PatientData, PredictionResponse } from '../types';
import {
  X,
  Sparkles,
  Stethoscope,
  Utensils,
  Dumbbell,
  FlaskConical,
  AlertTriangle,
  Printer,
  Copy,
  Check,
} from 'lucide-react';

interface AIConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: AIConsultationResponse | null;
  patientData: PatientData;
  prediction: PredictionResponse | null;
}

export const AIConsultationModal: React.FC<AIConsultationModalProps> = ({
  isOpen,
  onClose,
  insights,
  patientData,
  prediction,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !insights || !prediction) return null;

  const handleCopy = () => {
    const text = `=== DiaPredict Comprehensive Clinical Diagnostic Report ===
Patient Profile: Age ${patientData.age}, Fasting Glucose ${patientData.glucose} mg/dL, BMI ${patientData.bmi}, BP ${patientData.bloodPressure} mm Hg
Classification: ${prediction.riskLevel} (${prediction.probability}% Probability)

SUMMARY:
${insights.summary}

CLINICAL PATHOPHYSIOLOGY:
${insights.clinicalInterpretation}

DIETARY ACTION PLAN:
${insights.dietaryActionPlan.map((d) => `- ${d}`).join('\n')}

EXERCISE & LIFESTYLE:
${insights.exerciseAndLifestyle.map((e) => `- ${e}`).join('\n')}

RECOMMENDED DIAGNOSTIC FOLLOW-UPS:
${insights.diagnosticFollowUps.map((f) => `- ${f}`).join('\n')}

ACUTE WARNING SIGNS:
${insights.warningSigns.map((w) => `- ${w}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto transition-colors duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-sm shadow-teal-600/20">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                Clinical Diagnostic Assessment & Care Plan
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40">
                  Diagnostic Protocol
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalized metabolic profile analysis & clinical management recommendations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Copy report text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs cursor-pointer"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Patient Quick Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Risk Assessment:</span>
              <div className="font-bold text-teal-700 dark:text-teal-400 font-mono">
                {prediction.riskLevel} ({prediction.probability}%)
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Fasting Glucose:</span>
              <div className="font-bold text-slate-900 dark:text-white font-mono">{patientData.glucose} mg/dL</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Patient BMI:</span>
              <div className="font-bold text-slate-900 dark:text-white font-mono">{patientData.bmi} kg/m²</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Age & Pedigree:</span>
              <div className="font-bold text-slate-900 dark:text-white font-mono">
                {patientData.age}y / {patientData.diabetesPedigreeFunction}
              </div>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Executive Summary
            </h4>
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {insights.summary}
            </div>
          </div>

          {/* Pathophysiology & Biomarker Interpretation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Pathophysiological Mechanisms
            </h4>
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {insights.clinicalInterpretation}
            </div>
          </div>

          {/* Dietary Action Plan */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Evidence-Based Nutritional Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {insights.dietaryActionPlan.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise & Lifestyle Interventions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Dumbbell className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Physical Activity & Lifestyle Regimen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {insights.exerciseAndLifestyle.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Follow-Ups & Warning Signs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Follow Ups */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Recommended Diagnostic Tests
              </h4>
              <ul className="space-y-2 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {insights.diagnosticFollowUps.map((test, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning Signs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Acute Symptoms to Monitor
              </h4>
              <ul className="space-y-2 bg-rose-50/60 dark:bg-rose-950/40 p-3.5 rounded-xl border border-rose-200 dark:border-rose-500/40 text-xs text-rose-800 dark:text-rose-300">
                {insights.warningSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            For clinical decision support & demonstration only. Consult a physician.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
