# DiaPredict AI — Machine Learning Diabetes Risk Prediction & Clinical Analytics

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB.svg?logo=python)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.3%2B-F7931E.svg?logo=scikit-learn)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0%2B-EB5424.svg)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**DiaPredict AI** is a full-stack clinical machine learning application engineered for early diabetes risk stratification, exploratory data analysis (EDA), and transparent model interpretability using **SHAP (Shapley Additive Explanations)**.

Built on the clinical **Pima Indians Diabetes Database** (768 patient records), the platform benchmarks four supervised classification algorithms (**Random Forest**, **XGBoost**, **Support Vector Machines (SVM)**, and **Logistic Regression**) and provides an interactive decision threshold tuner, feature attribution waterfall charts, batch cohort testing with CSV import/export, and personalized clinical guidance.

---

## Key Features

-  Real-Time Biomarker Risk Prediction**:
  - Live evaluation across 8 clinical biomarkers (Glucose, BMI, Age, Insulin, Blood Pressure, Skinfold Thickness, Diabetes Pedigree, Pregnancies).
  - Dynamic gauge meter displaying calibrated risk percentages (`<35%` Low, `35-59%` Moderate, `≥60%` Elevated).
  - Quick-load clinical archetype presets (e.g., Gestational History, Severe Insulin Resistance, Healthy Euglycemia).

-  SHAP Explainability & Feature Attribution**:
  - Local waterfall attribution measuring odds-ratio impact for each physiological parameter.
  - Transparent force visualizers illustrating how biomarkers shift probabilities away from the cohort baseline ($E[f(x)] = 34.9\%$).

-  Interactive "What-If" Sensitivity Simulator**:
  - Direct lifestyle slider adjustments (e.g., target BMI reduction, postprandial glucose control).
  - Instant re-calculation of predicted risk reduction.

-  Model Arena & Dynamic Threshold Tuner**:
  - Head-to-head comparison of **Random Forest** (Champion, ROC-AUC: `0.868`), **XGBoost**, **SVM (RBF)**, and **Logistic Regression**.
  - Interactive classification cutoff slider ($\theta = 0.15 \to 0.85$) updating sensitivity (Recall), specificity, 2×2 confusion matrix, and ROC operating point in real time.

-  Exploratory Data Analysis (EDA) Lab**:
  - Distribution histograms comparing diabetic vs. non-diabetic cohorts across all 8 features.
  - Class balance analysis (65.1% negative vs. 34.9% positive) and zero-imputation tracking.

-  High-Throughput Batch Cohort Tester**:
  - Test patient cohorts simultaneously with live search, risk-level filters, and column sorting.
  - Paste/upload custom CSV data and export results to `.csv` with one click.

-  Clinical Diagnostic Assessment & PDF Report Generator**:
  - Generates comprehensive diagnostic summaries with pathophysiological mechanisms, dietary protocols, physical activity recommendations, and acute warning signs.
  - Print-ready and copyable markdown clinical format.

-  Dark & Light Mode Support**:
  - Modern, accessible interface with instant theme toggle and local storage persistence.

---

##  Project Architecture & Folder Structure

```text
├── src/
│   ├── components/               # UI components and view modules
│   │   ├── AIConsultationModal.tsx   # Diagnostic report modal & print view
│   │   ├── BatchTester.tsx           # Batch screening, CSV upload & export
│   │   ├── EDALab.tsx                # Dataset distribution charts & stats
│   │   ├── ExplainabilityLab.tsx     # SHAP force visualizer & case studies
│   │   ├── Header.tsx                # Navigation, theme toggle & methodology
│   │   ├── MethodologyModal.tsx      # ML training & preprocessing architecture
│   │   ├── ModelArena.tsx            # Model comparison, threshold tuner & ROC
│   │   ├── PatientInputForm.tsx      # Biomarker sliders & clinical presets
│   │   ├── PredictionResultCard.tsx  # Risk gauge, SHAP waterfall & top drivers
│   │   └── WhatIfSimulator.tsx       # Sensitivity & lifestyle intervention analysis
│   ├── context/
│   │   └── ThemeContext.tsx          # Light/Dark mode state provider
│   ├── data/
│   │   ├── benchmarkData.ts          # Stratified 80/20 test split metrics
│   │   ├── edaData.ts                # Cohort statistics & histogram bins
│   │   └── patientPresets.ts         # Verified clinical patient archetypes
│   ├── services/
│   │   └── api.ts                    # REST API client with offline fallback
│   ├── utils/
│   │   └── clientMlPredictor.ts      # Client-side ML inference engine
│   ├── types.ts                      # Shared TypeScript definitions & schemas
│   ├── App.tsx                       # Main application shell & tab routing
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Tailwind CSS styles & typography
├── package.json                      # Node.js dependencies & build scripts
├── requirements.txt                  # Python dependencies for ML training & API
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite build configuration
├── metadata.json                     # Applet configuration
└── README.md                         # Project documentation
```

---

##  Machine Learning Pipeline & Methodology

### 1. Dataset Characteristics
- **Source**: Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases).
- **Records**: 768 female patient observations $\ge 21$ years old.
- **Target**: Binary classification (`0` = Non-Diabetic, `1` = Diabetic).
- **Base Rate**: 34.9% positive ($268/768$), 65.1% negative ($500/768$).

### 2. Clinical Data Preprocessing
- **Biologically Impossible Zero Handling**: Physiological variables (`Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI`) where $0$ indicates missing laboratory data are imputed using cohort feature medians:
  - Glucose: $117.0\text{ mg/dL}$
  - Blood Pressure: $72.0\text{ mmHg}$
  - Skin Thickness: $23.0\text{ mm}$
  - Insulin: $30.5\ \mu\text{U/mL}$
  - BMI: $32.0\text{ kg/m}^2$
- **Feature Scaling**: Standardized via z-score normalization ($z = \frac{x - \mu}{\sigma}$).
- **Validation Scheme**: Stratified $5$-Fold Cross-Validation with an $80/20$ independent test split ($154$ unseen patient cases).

### 3. Model Benchmark Comparison (Test Split, $\theta = 0.50$)

| Algorithm | Accuracy | Precision | Recall (Sensitivity) | F1-Score | ROC-AUC | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Classifier** | **83.1%** | **0.784** | **0.741** | **0.762** | **0.868** |  **Champion** |
| **XGBoost Classifier** | 81.8% | 0.760 | 0.704 | 0.731 | 0.856 | High Performer |
| **Support Vector Machine (RBF)** | 79.9% | 0.750 | 0.648 | 0.695 | 0.842 | Baseline |
| **Logistic Regression** | 78.6% | 0.725 | 0.630 | 0.674 | 0.835 | Interpretable Baseline |

---

##  Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **bun** / **yarn**
- *(Optional for Python Backend)*: **Python 3.10+**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/diapredict-ai.git
cd diapredict-ai
```

---

### Step 2: Run the Web Application
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at **`http://localhost:3000`** to view the app.

---

### Step 3 (Optional): Python Backend & ML Training

If you wish to run a dedicated Python FastAPI backend or train models from scratch:

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install Python requirements
pip install -r requirements.txt
```

#### Example Python FastAPI Server (`server.py`):
```python
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI(title="DiaPredict ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    pregnancies: float
    glucose: float
    bloodPressure: float
    skinThickness: float
    insulin: float
    bmi: float
    diabetesPedigreeFunction: float
    age: float

@app.post("/api/predict")
def predict(data: PatientData):
    # Impute zeros and compute probability using trained scikit-learn / XGBoost model
    # Example response schema:
    prob = 0.72
    return {
        "prediction": 1 if prob >= 0.5 else 0,
        "probability": round(prob * 100, 1),
        "riskLevel": "High Risk" if prob >= 0.6 else ("Moderate Risk" if prob >= 0.35 else "Low Risk"),
        "modelName": "Random Forest Classifier",
        "topRiskDrivers": ["Fasting Glucose >= 126 mg/dL", "Elevated BMI (>= 30)"],
        "preventativeRecommendations": ["Schedule OGTT / HbA1c test", "Consult nutritionist"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

##  API Endpoints Specification

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/predict` | Computes diabetes risk score & SHAP attributions | `PatientData`, `model: string` | `PredictionResponse` |
| `GET` | `/api/eda` | Returns cohort distribution stats & histogram bins | None | `EDAResponse` |
| `GET` | `/api/models` | Returns benchmark metrics & confusion matrices | None | `ModelMetrics[]` |
| `POST` | `/api/consultation` | Generates diagnostic clinical action plan | `PatientData`, `PredictionResponse` | `AIConsultationResponse` |

---

##  Exporting & Deploying to GitHub

1. Initialize git in the directory (if not already initialized):
   ```bash
   git init
   git add .
   git commit -m "feat: complete DiaPredict AI machine learning suite"
   ```
2. Link your remote repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

---

##  Clinical & Academic Disclaimer

This application and machine learning model are developed for **educational, exploratory, and clinical decision support demonstration purposes only**. The predictions generated by these statistical models do not constitute medical diagnoses or prescriptive treatment protocols. Always seek the advice of a qualified physician or healthcare provider regarding metabolic health and diagnostic evaluations.

---

##  License

Distributed under the **MIT License**. See `LICENSE` for more information.
