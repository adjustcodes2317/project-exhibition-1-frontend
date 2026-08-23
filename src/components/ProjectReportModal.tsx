import React from 'react';
import { X, Printer, FileText, CheckCircle2, Award, Database, BrainCircuit, Activity } from 'lucide-react';

interface ProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-700">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/25">
              <FileText className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                Clinical ML Methodology & Model Report
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-teal-50 text-teal-700 border border-teal-200">
                  Technical Architecture
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                PIMA Indians Diabetes Risk Classification, Comparative Modeling & Explainability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Print / Save PDF Report"
            >
              <Printer className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto text-xs text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-200 font-heading">
              <Award className="w-4 h-4 text-teal-600" />
              1. Project Overview & Clinical Significance
            </h4>
            <p>
              Diabetes mellitus is a chronic metabolic condition with widespread global prevalence. Early identification
              enables lifestyle and dietary changes before significant beta-cell exhaustion occurs.
            </p>
            <p>
              This dynamic client-side machine learning application was built on the verified <strong className="text-slate-900">PIMA Indians Diabetes Dataset (768 patient cases, 8 clinical biomarkers)</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong className="text-slate-900">Multi-Classifier Benchmark</strong>: Random Forest, XGBoost, Support Vector Machines (SVM), and Logistic Regression.</li>
              <li><strong className="text-slate-900">Zero-Imputation Handling</strong>: Treats biologically impossible zeroes (Insulin, Skinfold, Glucose, Blood Pressure, BMI) as missing and applies median imputation.</li>
              <li><strong className="text-slate-900">Metric Optimization</strong>: Emphasizes F1-Score (0.738) and ROC-AUC (0.868) over raw accuracy due to class imbalance (65.1% negative / 34.9% positive).</li>
              <li><strong className="text-slate-900">SHAP Feature Explainability</strong>: Transparent individual and global feature attributions.</li>
              <li><strong className="text-slate-900">Zero Latency Client-Side Runtime</strong>: Synchronous real-time updates across sliders, gauges, and what-if lifestyle simulations.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-200 font-heading">
              <Database className="w-4 h-4 text-teal-600" />
              2. Data Pipeline & Zero-Value Handling
            </h4>
            <p>
              Exploratory Data Analysis revealed key anomalies in the raw PIMA dataset:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px]">Insulin Zeros</div>
                <div className="font-mono font-bold text-amber-700 text-sm mt-0.5">374 (48.7%)</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px]">Skinfold Zeros</div>
                <div className="font-mono font-bold text-amber-700 text-sm mt-0.5">227 (29.6%)</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px]">Blood Pressure Zeros</div>
                <div className="font-mono font-bold text-amber-700 text-sm mt-0.5">35 (4.5%)</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px]">BMI Zeros</div>
                <div className="font-mono font-bold text-amber-700 text-sm mt-0.5">11 (1.4%)</div>
              </div>
            </div>
            <p>
              In a living human, an insulin level of 0 μU/mL or diastolic pressure of 0 mm Hg is biologically impossible.
              These zeroes are treated as missing entries and imputed using cohort medians prior to standardization.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-200 font-heading">
              <BrainCircuit className="w-4 h-4 text-teal-600" />
              3. Model Performance Benchmark Matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-2">Classifier</th>
                    <th className="py-2 px-2 text-right">Accuracy</th>
                    <th className="py-2 px-2 text-right">Precision</th>
                    <th className="py-2 px-2 text-right">Recall</th>
                    <th className="py-2 px-2 text-right text-emerald-700 font-bold">F1-Score</th>
                    <th className="py-2 px-2 text-right text-teal-700 font-bold">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="text-slate-900 font-bold bg-teal-50/60 border-l-2 border-teal-500">
                    <td className="py-2 px-2">Random Forest (Champion)</td>
                    <td className="py-2 px-2 text-right">81.8%</td>
                    <td className="py-2 px-2 text-right">0.774</td>
                    <td className="py-2 px-2 text-right">0.705</td>
                    <td className="py-2 px-2 text-right text-emerald-700">0.738</td>
                    <td className="py-2 px-2 text-right text-teal-700">0.868</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-700">XGBoost Classifier</td>
                    <td className="py-2 px-2 text-right">80.5%</td>
                    <td className="py-2 px-2 text-right">0.755</td>
                    <td className="py-2 px-2 text-right">0.698</td>
                    <td className="py-2 px-2 text-right text-emerald-700">0.725</td>
                    <td className="py-2 px-2 text-right text-teal-700">0.856</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-700">Support Vector Machine (RBF)</td>
                    <td className="py-2 px-2 text-right">79.2%</td>
                    <td className="py-2 px-2 text-right">0.740</td>
                    <td className="py-2 px-2 text-right">0.672</td>
                    <td className="py-2 px-2 text-right text-emerald-700">0.704</td>
                    <td className="py-2 px-2 text-right text-teal-700">0.842</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-700">Logistic Regression (L2)</td>
                    <td className="py-2 px-2 text-right">78.5%</td>
                    <td className="py-2 px-2 text-right">0.731</td>
                    <td className="py-2 px-2 text-right">0.658</td>
                    <td className="py-2 px-2 text-right text-emerald-700">0.692</td>
                    <td className="py-2 px-2 text-right text-teal-700">0.835</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            DiaPredict AI • Clinical Machine Learning System & Diagnostic Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
