import React, { useState, useMemo } from 'react';
import { SAMPLE_BATCH_PATIENTS } from '../data/patientPresets';
import { ModelType } from '../types';
import {
  Layers,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Play,
  RotateCcw,
  Search,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { computeClientPrediction } from '../utils/clientMlPredictor';

interface BatchResultItem {
  id: number;
  patientName?: string;
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
  prediction?: number;
  riskLevel?: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  probability?: number;
}

export const BatchTester: React.FC = () => {
  const [patients, setPatients] = useState<BatchResultItem[]>(SAMPLE_BATCH_PATIENTS);
  const [results, setResults] = useState<BatchResultItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType>('random_forest');
  const [isLoading, setIsLoading] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [showCsvInput, setShowCsvInput] = useState(false);

  // Dynamic filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High Risk' | 'Moderate Risk' | 'Low Risk'>('ALL');
  const [sortField, setSortField] = useState<'probability' | 'glucose' | 'bmi' | 'age'>('probability');
  const [sortAsc, setSortAsc] = useState(false);

  const runBatchPrediction = (patientsToPredict = patients) => {
    setIsLoading(true);
    setTimeout(() => {
      const computed = patientsToPredict.map((p, idx) => {
        const pred = computeClientPrediction(
          {
            pregnancies: p.pregnancies,
            glucose: p.glucose,
            bloodPressure: p.bloodPressure,
            skinThickness: p.skinThickness,
            insulin: p.insulin,
            bmi: p.bmi,
            diabetesPedigreeFunction: p.diabetesPedigreeFunction,
            age: p.age,
          },
          selectedModel,
        );

        return {
          ...p,
          patientName: p.patientName || `Patient #${100 + idx + 1}`,
          prediction: pred.prediction,
          riskLevel: pred.riskLevel,
          probability: pred.probability,
        };
      });
      setResults(computed);
      setIsLoading(false);
    }, 150);
  };

  const handleApplyCsvText = () => {
    try {
      const lines = csvText.trim().split('\n');
      const parsed: BatchResultItem[] = [];

      const startIndex = lines[0].toLowerCase().includes('glucose') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts.length >= 8) {
          parsed.push({
            id: i + 1,
            patientName: parts.length > 8 ? parts[8] : `Uploaded Case #${i + 1}`,
            pregnancies: Number(parts[0]) || 0,
            glucose: Number(parts[1]) || 120,
            bloodPressure: Number(parts[2]) || 70,
            skinThickness: Number(parts[3]) || 20,
            insulin: Number(parts[4]) || 80,
            bmi: Number(parts[5]) || 28,
            diabetesPedigreeFunction: Number(parts[6]) || 0.47,
            age: Number(parts[7]) || 30,
          });
        }
      }

      if (parsed.length > 0) {
        setPatients(parsed);
        runBatchPrediction(parsed);
        setShowCsvInput(false);
      } else {
        alert('Could not parse valid CSV. Provide 8 columns: Pregnancies, Glucose, BP, SkinThickness, Insulin, BMI, Pedigree, Age');
      }
    } catch (e) {
      alert('Error parsing CSV');
    }
  };

  const exportResultsCSV = () => {
    if (results.length === 0) return;
    const headers = [
      'Patient ID',
      'Patient Name',
      'Pregnancies',
      'Glucose',
      'BloodPressure',
      'SkinThickness',
      'Insulin',
      'BMI',
      'Pedigree',
      'Age',
      'Outcome (0/1)',
      'Risk Level',
      'Probability (%)',
    ];
    const rows = results.map((r) => [
      r.id,
      `"${r.patientName}"`,
      r.pregnancies,
      r.glucose,
      r.bloodPressure,
      r.skinThickness,
      r.insulin,
      r.bmi,
      r.diabetesPedigreeFunction,
      r.age,
      r.prediction ?? '',
      r.riskLevel ?? '',
      r.probability ?? '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'diapredict_batch_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSortedList = useMemo(() => {
    const sourceList = results.length > 0 ? results : patients;

    let filtered = sourceList.filter((p) => {
      const matchSearch =
        (p.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.glucose.toString().includes(searchQuery);
      const matchRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;
      return matchSearch && matchRisk;
    });

    filtered.sort((a, b) => {
      let valA = a[sortField] ?? 0;
      let valB = b[sortField] ?? 0;
      if (sortAsc) return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return filtered;
  }, [results, patients, searchQuery, riskFilter, sortField, sortAsc]);

  const highRiskCount = results.filter((r) => r.riskLevel === 'High Risk').length;
  const moderateRiskCount = results.filter((r) => r.riskLevel === 'Moderate Risk').length;
  const lowRiskCount = results.filter((r) => r.riskLevel === 'Low Risk').length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-200">
        {/* Multi-color ambient background glows */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-gradient-to-br from-indigo-400/10 dark:from-indigo-500/20 via-cyan-400/10 dark:via-cyan-500/20 to-teal-400/10 dark:to-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Cohort Screening & Batch Testing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            High-Throughput Patient{' '}
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Cohort Evaluation
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Execute batch risk evaluations with live searching, categorical risk filters, column sorting, and instant CSV export.
          </p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => runBatchPrediction()}
            disabled={isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-600/20 active:scale-[0.99] cursor-pointer disabled:opacity-50 font-heading"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Evaluate Batch ({patients.length} Cases)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowCsvInput(!showCsvInput)}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Paste / Upload CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {results.length > 0 && (
            <button
              onClick={exportResultsCSV}
              className="px-3.5 py-2.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={() => {
              setPatients(SAMPLE_BATCH_PATIENTS);
              setResults([]);
              setSearchQuery('');
              setRiskFilter('ALL');
            }}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Reset Cohort"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CSV Input Panel */}
      {showCsvInput && (
        <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white font-heading">
              Paste Comma-Separated Values (CSV):
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              Pregnancies, Glucose, BP, Skin, Insulin, BMI, Pedigree, Age, [Name]
            </span>
          </div>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="3, 145, 80, 28, 160, 32.4, 0.65, 45, Patient A&#10;0, 92, 68, 18, 50, 22.1, 0.25, 26, Patient B"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-teal-800 dark:text-teal-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCsvInput(false)}
              className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCsvText}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-2xs"
            >
              Load & Evaluate
            </button>
          </div>
        </div>
      )}

      {/* Summary Ribbon */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/95 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 p-4 rounded-2xl text-xs shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-200">
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total Evaluated:</span>
            <div className="font-mono font-extrabold text-slate-900 dark:text-white text-lg mt-0.5">{results.length} Patients</div>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">High Risk:</span>
            <div className="font-mono font-extrabold text-rose-600 dark:text-rose-400 text-lg mt-0.5">{highRiskCount} ({((highRiskCount / results.length) * 100).toFixed(0)}%)</div>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Moderate / Borderline:</span>
            <div className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-lg mt-0.5">{moderateRiskCount}</div>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Low Risk:</span>
            <div className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-lg mt-0.5">{lowRiskCount}</div>
          </div>
        </div>
      )}

      {/* Search & Risk Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 p-4 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient name or glucose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {(['ALL', 'High Risk', 'Moderate Risk', 'Low Risk'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                riskFilter === lvl
                  ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 shadow-2xs font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              {lvl === 'ALL' ? 'All' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Results Table */}
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <FileSpreadsheet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Patient Risk Cohort Table ({filteredAndSortedList.length} Matching Records)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Patient Case</th>
                <th
                  onClick={() => {
                    setSortField('glucose');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-2.5 px-3 cursor-pointer hover:text-teal-700 dark:hover:text-teal-400"
                >
                  <span className="inline-flex items-center gap-1">
                    Glucose <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => {
                    setSortField('bmi');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-2.5 px-3 cursor-pointer hover:text-teal-700 dark:hover:text-teal-400"
                >
                  <span className="inline-flex items-center gap-1">
                    BMI <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => {
                    setSortField('age');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-2.5 px-3 cursor-pointer hover:text-teal-700 dark:hover:text-teal-400"
                >
                  <span className="inline-flex items-center gap-1">
                    Age <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="py-2.5 px-3">BP / Insulin</th>
                <th className="py-2.5 px-3">Pedigree</th>
                <th
                  onClick={() => {
                    setSortField('probability');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-teal-700 dark:hover:text-teal-400"
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Risk Score <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="py-2.5 px-3 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredAndSortedList.map((p, idx) => {
                const hasResult = p.probability !== undefined;
                const isHigh = p.riskLevel === 'High Risk';
                const isModerate = p.riskLevel === 'Moderate Risk';

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {p.patientName || `Patient #${101 + idx}`}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={p.glucose >= 140 ? 'text-rose-700 dark:text-rose-400 font-bold' : p.glucose >= 100 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}>
                        {p.glucose} mg/dL
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{p.bmi}</td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{p.age}y</td>
                    <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                      {p.bloodPressure} / {p.insulin}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{p.diabetesPedigreeFunction}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {hasResult ? (
                        <span className={isHigh ? 'text-rose-700 dark:text-rose-400' : isModerate ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}>
                          {p.probability}%
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {hasResult ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isHigh
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                              : isModerate
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                          }`}
                        >
                          {p.riskLevel}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">Click Run</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
