/**
 * Backend Integration Service Layer
 * 
 * ══════════════════════════════════════════════════════════════════════════════
 * Instructions for Backend Engineering Team:
 * 1. Toggle `USE_BACKEND_API: true` in `API_CONFIG` below when your server is live.
 * 2. Set your backend URL in `.env` as `VITE_API_URL=http://localhost:8000` (FastAPI/Flask/Express/Django).
 * 3. All API routes and JSON contracts are pre-typed via `src/types.ts`.
 * 4. When `USE_BACKEND_API: false`, the frontend seamlessly uses instant client-side computation.
 * ══════════════════════════════════════════════════════════════════════════════
 */

import {
  PatientData,
  PredictionResponse,
  ModelType,
  EDAResponse,
  ModelMetrics,
  AIConsultationResponse,
} from '../types';
import { computeClientPrediction } from '../utils/clientMlPredictor';
import { BENCHMARK_MODELS } from '../data/benchmarkData';
import { PIMA_EDA_DATA } from '../data/edaData';

export const API_CONFIG = {
  USE_BACKEND_API: false, // Switch to `true` to route calls to your live backend server
  API_BASE_URL:
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ||
    'http://localhost:8000',
};

/**
 * 1. Single Patient Risk Prediction Endpoint
 * Backend expected route: POST /api/predict
 */
export async function predictPatientRisk(
  patientData: PatientData,
  model: ModelType = 'random_forest'
): Promise<PredictionResponse> {
  if (API_CONFIG.USE_BACKEND_API) {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...patientData, model }),
    });
    if (!res.ok) throw new Error(`Backend Error: ${res.statusText}`);
    return res.json();
  }

  // Dynamic client fallback
  return computeClientPrediction(patientData, model);
}

/**
 * 2. Batch Cohort Screening Endpoint
 * Backend expected route: POST /api/batch-predict
 */
export async function batchPredictPatients(
  patients: PatientData[],
  model: ModelType = 'random_forest'
): Promise<PredictionResponse[]> {
  if (API_CONFIG.USE_BACKEND_API) {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/api/batch-predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patients, model }),
    });
    if (!res.ok) throw new Error(`Backend Error: ${res.statusText}`);
    return res.json();
  }

  // Dynamic client fallback
  return patients.map((p) => computeClientPrediction(p, model));
}

/**
 * 3. Model Benchmark & Metrics Matrix Endpoint
 * Backend expected route: GET /api/models/benchmark
 */
export async function fetchModelBenchmarks(): Promise<ModelMetrics[]> {
  if (API_CONFIG.USE_BACKEND_API) {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/api/models/benchmark`);
    if (!res.ok) throw new Error(`Backend Error: ${res.statusText}`);
    const data = await res.json();
    return data.models || data;
  }

  return BENCHMARK_MODELS;
}

/**
 * 4. Dataset Exploratory Data Analysis (EDA) Endpoint
 * Backend expected route: GET /api/eda/stats
 */
export async function fetchEDAStats(): Promise<EDAResponse> {
  if (API_CONFIG.USE_BACKEND_API) {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/api/eda/stats`);
    if (!res.ok) throw new Error(`Backend Error: ${res.statusText}`);
    return res.json();
  }

  return PIMA_EDA_DATA;
}

/**
 * 5. Clinical AI Consultation & Doctor's Note Endpoint
 * Backend expected route: POST /api/ai/clinical-insights
 */
export async function fetchAIConsultation(
  patientData: PatientData,
  prediction: PredictionResponse
): Promise<AIConsultationResponse> {
  if (API_CONFIG.USE_BACKEND_API) {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/api/ai/clinical-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientData, prediction }),
    });
    if (!res.ok) throw new Error(`Backend Error: ${res.statusText}`);
    return res.json();
  }

  // Pure frontend default summary
  return {
    summary: `Clinical assessment for ${patientData.age}-year-old patient with Fasting Glucose of ${patientData.glucose} mg/dL and BMI of ${patientData.bmi}.`,
    clinicalInterpretation:
      prediction.probability >= 50
        ? 'High metabolic risk indicated with elevated fasting glycemia and adiposity markers. Immediate diagnostic oral glucose tolerance verification recommended.'
        : 'Biomarkers remain within acceptable preventative ranges. Maintain standard lifestyle and metabolic health monitoring.',
    dietaryActionPlan: [
      'Prioritize complex carbohydrates with low glycemic index (GI < 55).',
      'Increase soluble dietary fiber to >30g daily to slow intestinal glucose absorption.',
      'Restrict ultra-processed sugars, sodas, and saturated fats.',
    ],
    exerciseAndLifestyle: [
      'Aim for 150 minutes of moderate aerobic activity weekly (e.g. brisk walking, swimming).',
      'Incorporate resistance training 2-3 times weekly to enhance skeletal muscle glucose uptake.',
      'Prioritize 7-8 hours of regular sleep to optimize cortisol and insulin sensitivity.',
    ],
    diagnosticFollowUps: [
      'Fasting Plasma Glucose (FPG) test verification',
      'Hemoglobin A1c (HbA1c) diagnostic assay',
      'Comprehensive Lipid Panel & Renal Function Screen',
    ],
    warningSigns: [
      'Polydipsia (excessive thirst) & Polyuria (frequent urination)',
      'Unexplained weight loss or chronic postprandial fatigue',
      'Slow-healing cuts or peripheral tingling in extremities',
    ],
  };
}
