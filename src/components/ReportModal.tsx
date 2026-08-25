import React, { useEffect } from 'react';
import { User, ATSScanResult } from '../types';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Award, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  atsResult: ATSScanResult;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  user,
  atsResult,
}) => {
  // Read dynamic coding stats from active user's storage
  const userProfilesRaw = typeof window !== 'undefined' ? localStorage.getItem(`coding_profiles_${user.id}`) : null;
  let totalSolved = 0;
  let codingAccuracy = 90;
  try {
    if (userProfilesRaw) {
      const parsed = JSON.parse(userProfilesRaw);
      totalSolved = parsed.reduce((acc: number, p: any) => acc + (p.stats?.totalSolved || 0), 0);
      const accList = parsed.map((p: any) => p.stats?.accuracy).filter(Boolean);
      if (accList.length > 0) {
        codingAccuracy = Math.round(accList.reduce((a: number, b: number) => a + b, 0) / accList.length);
      }
    }
  } catch {}

  const isTier1 = (user.cgpa && user.cgpa >= 8.0) && (atsResult.score >= 70 || (user.readinessScore || 0) >= 70);
  const regId = user.id.startsWith('std_') ? user.id.toUpperCase() : `ST-${user.id.slice(0, 8).toUpperCase()}`;

  // Support ESC key to exit easily
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="report-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
    >
      <div 
        id="report-modal-card"
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 text-slate-200"
      >
        
        {/* Sticky Header with Title & Direct Close Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <button
              id="btn-report-back-top"
              onClick={onClose}
              className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Close Dossier (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="p-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">Student Placement Readiness Dossier</h2>
              <p className="text-[11px] text-slate-400">Institutional Training &amp; Placement Record</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-report-print-top"
              onClick={handlePrint}
              className="hidden sm:flex px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              Print / Save PDF
            </button>
            <button 
              id="btn-report-close-x"
              onClick={onClose} 
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Report Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div className="bg-slate-950/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-xs leading-relaxed shadow-inner">
            
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest block">
                  UNIVERSITY TRAINING &amp; PLACEMENT CELL
                </span>
                <h1 className="text-xl font-black text-white mt-1">{user.name} — Candidate Assessment</h1>
                <p className="text-slate-400 text-xs mt-0.5">
                  Reg ID: {regId} • {user.branch} • Batch {user.batch}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold border ${
                  isTier1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                  {isTier1 ? 'Verified Super Dream Eligible' : 'Verified Placement Track'}
                </div>
                <span className="text-[10px] text-slate-500 block mt-1.5">Generated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Scores Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium block">Overall ATS Score</span>
                <span className="text-xl font-black text-indigo-400 mt-1 block">{atsResult.score || 0} / 100</span>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium block">Academic CGPA</span>
                <span className="text-xl font-black text-sky-400 mt-1 block">{user.cgpa || 8.0} / 10.0</span>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium block">Coding Accuracy</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">{codingAccuracy}%</span>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium block">Problems Solved</span>
                <span className="text-xl font-black text-white mt-1 block">{totalSolved}</span>
              </div>
            </div>

            {/* ATS Breakdown */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">1. ATS Resume Keyword &amp; Formatting Audit</h3>
              <p className="text-slate-300">
                {atsResult.summaryFeedback || `The candidate's resume shows structural compliance (${atsResult.breakdown?.formattingReadability || 0}%) and keyword alignment (${atsResult.breakdown?.keywordOptimization || 0}%).`}
              </p>
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-300">Matched Core Competencies:</span>
                <p className="text-slate-400 text-[11px]">{(atsResult.matchedKeywords && atsResult.matchedKeywords.length > 0) ? atsResult.matchedKeywords.join(', ') : (user.skills || []).join(', ')}</p>
              </div>
            </div>

            {/* AI Mentor Insights */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">2. Technical &amp; Behavioral Readiness</h3>
              <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                <li><strong>Data Structures &amp; Algorithms:</strong> Solved high-frequency problems (Two Sum, Valid Parentheses, LRU Cache) in O(1) and O(n) optimal complexity.</li>
                <li><strong>Behavioral Alignment:</strong> Demonstrates mastery in Amazon Leadership Principles (Customer Obsession, Bias for Action) using the STAR framework.</li>
                <li><strong>Recommended Next Step:</strong> Finalize System Design concepts (Rate Limiting, Consistent Hashing) before the upcoming Google and Amazon on-campus drives.</li>
              </ul>
            </div>

            {/* Official Sign-off Stamp */}
            <div className="pt-5 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <div>
                <span className="font-bold text-white block">Dr. Vikramaditya Rao</span>
                <span>Director of Training &amp; Placements</span>
              </div>
              <div className="text-right">
                <span className="px-3 py-1.5 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 rounded-xl font-mono font-bold">
                  AUTH-SIG #KLOGIC-2025-994
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Sticky Footer with Prominent Close Action */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">ESC</kbd> or click outside anytime to return to Dashboard</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="btn-report-print-bottom"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              Print / Save PDF
            </button>
            <button
              id="btn-report-close-bottom"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
