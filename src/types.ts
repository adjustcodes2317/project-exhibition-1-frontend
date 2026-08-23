export interface PatientData {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

export type ModelType = 'random_forest' | 'xgboost' | 'logistic_regression' | 'svm';

export interface FeatureContribution {
  feature: keyof PatientData;
  label: string;
  value: number;
  normalRange: string;
  unit: string;
  impactScore: number; // -1 to +1 (SHAP value representation)
  direction: 'increases_risk' | 'decreases_risk' | 'neutral';
  clinicalNote: string;
}

export interface PredictionResponse {
  prediction: 0 | 1; // 0: No Risk, 1: High Risk
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  probability: number; // 0 to 100%
  modelUsed: ModelType;
  modelName: string;
  modelAccuracy: number;
  modelF1: number;
  modelRocAuc: number;
  featureContributions: FeatureContribution[];
  topRiskDrivers: string[];
  preventativeRecommendations: string[];
  timestamp: string;
}

export interface ModelMetrics {
  id: ModelType;
  name: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  };
  rocCurve: { fpr: number; tpr: number }[];
  featureImportance: { feature: string; label: string; importance: number }[];
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
  isBestPerformer?: boolean;
}

export interface DatasetFeatureStat {
  feature: keyof PatientData;
  label: string;
  unit: string;
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
  imputedZeroCount: number;
  nonDiabeticMean: number;
  diabeticMean: number;
  histogramBins: {
    binStart: number;
    binEnd: number;
    label: string;
    nonDiabeticCount: number;
    diabeticCount: number;
  }[];
}

export interface CorrelationMatrixItem {
  feature1: string;
  feature2: string;
  correlation: number;
}

export interface EDAResponse {
  totalRecords: number;
  positiveRecords: number;
  negativeRecords: number;
  positivePercentage: number;
  negativePercentage: number;
  featureStats: DatasetFeatureStat[];
  correlationMatrix: {
    features: string[];
    matrix: number[][];
  };
  keyInsights: string[];
}

export interface PatientPreset {
  id: string;
  name: string;
  category: 'low_risk' | 'moderate_risk' | 'high_risk';
  description: string;
  data: PatientData;
  expectedOutcome: string;
}

export interface AIConsultationResponse {
  summary: string;
  clinicalInterpretation: string;
  dietaryActionPlan: string[];
  exerciseAndLifestyle: string[];
  diagnosticFollowUps: string[];
  warningSigns: string[];
}
