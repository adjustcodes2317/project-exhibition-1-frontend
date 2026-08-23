import React from 'react';
import { PatientData, ModelType, PatientPreset } from '../types';
import { PATIENT_PRESETS } from '../data/patientPresets';
import {
  Sliders,
  Stethoscope,
  Info,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface PatientInputFormProps {
  formData: PatientData;
  setFormData: React.Dispatch<React.SetStateAction<PatientData>>;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  onPredict: () => void;
  isLoading: boolean;
}

export const PatientInputForm: React.FC<PatientInputFormProps> = ({
  formData,
  setFormData,
  selectedModel,
  setSelectedModel,
  onPredict,
  isLoading,
}) => {
  const handleInputChange = (field: keyof PatientData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const loadPreset = (preset: PatientPreset) => {
    setFormData(preset.data);
  };

  const handleReset = () => {
    setFormData({
      pregnancies: 1,
      glucose: 110,
      bloodPressure: 72,
      skinThickness: 23,
      insulin: 80,
      bmi: 26.5,
      diabetesPedigreeFunction: 0.35,
      age: 32,
    });
  };

  const fields: {
    key: keyof PatientData;
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    normalRange: string;
    description: string;
    clinicalCategory: string;
  }[] = [
    {
      key: 'glucose',
      label: 'Fasting Plasma Glucose',
      unit: 'mg/dL',
      min: 50,
      max: 240,
      step: 1,
      normalRange: '70 - 99 mg/dL',
      description: 'Oral glucose tolerance test (OGTT) concentration measured at 2 hours.',
      clinicalCategory: formData.glucose >= 126 ? 'Diabetic (≥126)' : formData.glucose >= 100 ? 'Pre-diabetic (100-125)' : 'Normal (<100)',
    },
    {
      key: 'bmi',
      label: 'Body Mass Index (BMI)',
      unit: 'kg/m²',
      min: 15.0,
      max: 55.0,
      step: 0.1,
      normalRange: '18.5 - 24.9 kg/m²',
      description: 'Weight in kilograms divided by height in meters squared.',
      clinicalCategory: formData.bmi >= 30 ? 'Obese (≥30)' : formData.bmi >= 25 ? 'Overweight (25-29.9)' : 'Normal (18.5-24.9)',
    },
    {
      key: 'age',
      label: 'Patient Age',
      unit: 'years',
      min: 18,
      max: 85,
      step: 1,
      normalRange: '20 - 45 years',
      description: 'Age of patient; diabetes incidence increases sharply past 45 years.',
      clinicalCategory: formData.age >= 45 ? 'Elevated Age Risk' : 'Standard Age Baseline',
    },
    {
      key: 'diabetesPedigreeFunction',
      label: 'Diabetes Pedigree (DPF)',
      unit: 'score',
      min: 0.05,
      max: 2.5,
      step: 0.01,
      normalRange: '0.10 - 0.50',
      description: 'Genetic score synthesizing diabetic family history & pedigree relationships.',
      clinicalCategory: formData.diabetesPedigreeFunction > 0.6 ? 'High Genetic Risk' : 'Average Genetic Risk',
    },
    {
      key: 'pregnancies',
      label: 'Pregnancies (Parity)',
      unit: 'count',
      min: 0,
      max: 17,
      step: 1,
      normalRange: '0 - 3',
      description: 'Total number of pregnancies; multiparity can contribute to gestational insulin resistance.',
      clinicalCategory: formData.pregnancies >= 5 ? 'High Parity' : 'Normal Parity',
    },
    {
      key: 'insulin',
      label: '2-Hour Serum Insulin',
      unit: 'μU/mL',
      min: 0,
      max: 600,
      step: 5,
      normalRange: '16 - 166 μU/mL',
      description: 'Serum insulin 2 hours after glucose loading. Set to 0 to auto-impute median (30.5).',
      clinicalCategory: formData.insulin === 0 ? 'Auto-Imputed Median' : formData.insulin > 166 ? 'Hyperinsulinemia' : 'Normal Range',
    },
    {
      key: 'bloodPressure',
      label: 'Diastolic Blood Pressure',
      unit: 'mmHg',
      min: 40,
      max: 130,
      step: 1,
      normalRange: '60 - 80 mmHg',
      description: 'Diastolic arterial blood pressure in mmHg.',
      clinicalCategory: formData.bloodPressure >= 90 ? 'Hypertension Stage 2' : formData.bloodPressure >= 80 ? 'Prehypertension' : 'Normal',
    },
    {
      key: 'skinThickness',
      label: 'Triceps Skinfold Thickness',
      unit: 'mm',
      min: 0,
      max: 90,
      step: 1,
      normalRange: '10 - 30 mm',
      description: 'Subcutaneous fat thickness measure for peripheral body composition.',
      clinicalCategory: formData.skinThickness === 0 ? 'Auto-Imputed Median' : 'Direct Measurement',
    },
  ];

  return (
    <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6 transition-colors duration-200">
      {/* Header & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center shadow-2xs">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            Clinical Biomarker Inputs (8 Features)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust patient parameters via sliders or enter exact laboratory values.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-2xs cursor-pointer font-medium"
        >
          <RotateCcw className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Verified Preset Archetypes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Quick Patient Clinical Archetypes:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PATIENT_PRESETS.map((preset) => {
            const isHigh = preset.category === 'high_risk';
            const isMod = preset.category === 'moderate_risk';

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 text-left transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isHigh
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                        : isMod
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                    }`}
                  >
                    {isHigh ? 'High' : isMod ? 'Borderline' : 'Low'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8 Biomarker Input Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {fields.map((field) => {
          const val = formData[field.key];
          const isHighlight =
            (field.key === 'glucose' && val >= 126) ||
            (field.key === 'bmi' && val >= 30) ||
            (field.key === 'age' && val >= 45);

          return (
            <div
              key={field.key}
              className={`p-3.5 rounded-xl border transition-all ${
                isHighlight
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/40 shadow-2xs'
                  : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Field Label & Numeric Value */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={field.label}>
                  {field.label}
                </label>

                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={val}
                    onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value))}
                    className="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-1.5 py-0.5 text-right text-xs font-bold text-teal-800 dark:text-teal-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{field.unit}</span>
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={val}
                onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600 dark:accent-teal-400 mb-2"
              />

              {/* Sub-info: Normal Range & Clinical Category */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">Normal: {field.normalRange}</span>
                <span
                  className={`font-semibold ${
                    isHighlight ? 'text-rose-700 dark:text-rose-400 font-medium' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {field.clinicalCategory}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
