import React, { useState, useMemo } from 'react';
import { PatientData, ModelType, PredictionResponse, AIConsultationResponse } from '../types';
import { PatientInputForm } from './PatientInputForm';
import { PredictionResultCard } from './PredictionResultCard';
import { AIConsultationModal } from './AIConsultationModal';
import { computeClientPrediction } from '../utils/clientMlPredictor';
import { fetchAIConsultation } from '../services/api';
import {
  Activity,
  SlidersHorizontal,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface LivePredictorProps {
  onNavigateToModels?: () => void;
  onNavigateToEDA?: () => void;
}

export const LivePredictor: React.FC<LivePredictorProps> = ({
  onNavigateToModels,
  onNavigateToEDA,
}) => {
  const [formData, setFormData] = useState<PatientData>({
    pregnancies: 2,
    glucose: 125,
    bloodPressure: 74,
    skinThickness: 24,
    insulin: 85,
    bmi: 28.5,
    diabetesPedigreeFunction: 0.45,
    age: 35,
  });

  const [selectedModel, setSelectedModel] = useState<ModelType>('random_forest');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIConsultationResponse | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // What-if comparison delta state
  const [whatIfGlucoseDelta, setWhatIfGlucoseDelta] = useState<number>(-20);
  const [whatIfBmiDelta, setWhatIfBmiDelta] = useState<number>(-3);
  const [showWhatIf, setShowWhatIf] = useState(true);

  // Synchronous Instant Client-Side Computation (0ms Latency on every slider tick)
  const predictionResult: PredictionResponse = useMemo(() => {
    return computeClientPrediction(formData, selectedModel);
  }, [formData, selectedModel]);

  // Synchronous What-If Simulation
  const whatIfResult: PredictionResponse = useMemo(() => {
    const simulatedPatient: PatientData = {
      ...formData,
      glucose: Math.max(70, formData.glucose + whatIfGlucoseDelta),
      bmi: Math.max(18.5, Number((formData.bmi + whatIfBmiDelta).toFixed(1))),
    };
    return computeClientPrediction(simulatedPatient, selectedModel);
  }, [formData, whatIfGlucoseDelta, whatIfBmiDelta, selectedModel]);

  const handleFetchAIConsultation = async () => {
    setIsLoadingAI(true);
    try {
      const data = await fetchAIConsultation(formData, predictionResult);
      setAiInsights(data);
      setIsAIModalOpen(true);
    } catch (err) {
      console.error('AI consultation fetch:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const riskReduction = Math.max(0, predictionResult.probability - whatIfResult.probability);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-colors duration-200">
        {/* Luminous background shimmer glow */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-gradient-to-br from-emerald-400/10 dark:from-emerald-500/20 via-teal-400/10 dark:via-teal-500/20 to-indigo-400/10 dark:to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-pink-400/10 dark:bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive Real-Time Clinical Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Patient Diabetes Risk Stratification &{' '}
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Explainable ML
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Adjust clinical biomarker sliders or pick a verified archetype. The machine learning engine,
            risk gauge, and SHAP attribution waterfall recalculate <strong className="text-slate-900 dark:text-white">instantly in real time</strong>.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout: Form (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <PatientInputForm
            formData={formData}
            setFormData={setFormData}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            onPredict={() => {}}
            isLoading={false}
          />

          {/* Dynamic "What-If" Lifestyle Intervention Simulator */}
          <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
                  <SlidersHorizontal className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Dynamic "What-If" Lifestyle Intervention Simulator
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Simulate how targeted glucose or weight reductions impact projected risk in real time.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWhatIf(!showWhatIf)}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors px-2.5 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {showWhatIf ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {showWhatIf && (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Glucose Delta Slider */}
                  <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
                      <span>Glucose Modification</span>
                      <span className="font-mono text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-500/40 text-[11px] shadow-2xs">
                        {whatIfGlucoseDelta} mg/dL ({Math.max(70, formData.glucose + whatIfGlucoseDelta)} target)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-60}
                      max={20}
                      step={5}
                      value={whatIfGlucoseDelta}
                      onChange={(e) => setWhatIfGlucoseDelta(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600 dark:accent-teal-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>-60 mg/dL (Diet/Meds)</span>
                      <span>+20 mg/dL</span>
                    </div>
                  </div>

                  {/* BMI Delta Slider */}
                  <div className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
                      <span>BMI Weight Loss</span>
                      <span className="font-mono text-cyan-800 dark:text-cyan-300 font-bold bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-500/40 text-[11px] shadow-2xs">
                        {whatIfBmiDelta > 0 ? `+${whatIfBmiDelta}` : whatIfBmiDelta} kg/m² ({Math.max(18.5, Number((formData.bmi + whatIfBmiDelta).toFixed(1)))} target)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-10}
                      max={5}
                      step={0.5}
                      value={whatIfBmiDelta}
                      onChange={(e) => setWhatIfBmiDelta(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>-10 kg/m² (Caloric Deficit)</span>
                      <span>+5 kg/m²</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Outcome Banner */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50 via-white to-cyan-50 dark:from-teal-950/40 dark:via-slate-900/60 dark:to-cyan-950/40 border border-teal-200 dark:border-teal-500/30 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Intervention Projected Risk:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl font-mono font-extrabold text-teal-700 dark:text-teal-300">
                        {whatIfResult.probability}%
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        (down from <strong className="text-slate-800 dark:text-slate-200">{predictionResult.probability}%</strong>)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Absolute Risk Reduction:</span>
                    <div className="flex items-center justify-end gap-1 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-lg mt-0.5">
                      <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>-{riskReduction.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <PredictionResultCard
            result={predictionResult}
            patientData={formData}
            onOpenAIConsultation={handleFetchAIConsultation}
            isLoadingAI={isLoadingAI}
          />
        </div>
      </div>

      {/* AI Consultation Modal */}
      <AIConsultationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        insights={aiInsights}
        patientData={formData}
        prediction={predictionResult}
      />
    </div>
  );
};
