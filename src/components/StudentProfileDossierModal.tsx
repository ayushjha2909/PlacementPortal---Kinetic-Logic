import React, { useState, useEffect } from 'react';
import { StudentCandidateProfile, User } from '../types';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Code2, 
  FileText, 
  Briefcase, 
  Award, 
  Building2, 
  ExternalLink, 
  Download, 
  Send, 
  Lock, 
  UserCheck,
  TrendingUp,
  Sparkles,
  Phone,
  Mail,
  Edit3,
  ArrowLeft
} from 'lucide-react';

interface StudentProfileDossierModalProps {
  student: StudentCandidateProfile | null;
  adminUser: User;
  onClose: () => void;
  onUpdateNotes?: (studentId: string, notes: string) => void;
  onToggleVerification?: (studentId: string) => void;
}

export const StudentProfileDossierModal: React.FC<StudentProfileDossierModalProps> = ({
  student,
  adminUser,
  onClose,
  onUpdateNotes,
  onToggleVerification
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'coding' | 'applications' | 'tpo_notes'>('overview');
  const [internalNotes, setInternalNotes] = useState(student?.tpoNotes || '');
  const [isSavedNotes, setIsSavedNotes] = useState(false);
  const [isVerified, setIsVerified] = useState(student?.tpoVerified || false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync state when student prop changes
  useEffect(() => {
    if (student) {
      setInternalNotes(student.tpoNotes);
      setIsVerified(student.tpoVerified);
    }
  }, [student]);

  // Support ESC key to exit easily
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && student) {
        onClose();
      }
    };
    if (student) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [student, onClose]);

  if (!student) return null;

  const showLocalToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(student.id, internalNotes);
    }
    setIsSavedNotes(true);
    showLocalToast('TPO confidential assessment remarks saved.');
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  const handleToggleVerification = () => {
    const nextState = !isVerified;
    setIsVerified(nextState);
    if (onToggleVerification) {
      onToggleVerification(student.id);
    }
    showLocalToast(nextState ? 'Candidate verified for campus placement drives' : 'Verification revoked for document review');
  };

  const handleDispatchAssessment = () => {
    showLocalToast(`Custom assessment invite dispatched to ${student.email}`);
  };

  return (
    <div 
      id="student-profile-dossier-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="student-profile-dossier-card"
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        
        {/* Security & Access Notice Banner */}
        <div className="bg-gradient-to-r from-sky-950/90 via-indigo-950/90 to-slate-900 px-6 py-2.5 border-b border-sky-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-sky-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>TPO Audit Console • Student Profile Inspection Only</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30 font-medium">
              Read-Only Candidate Dossier
            </span>
            <span className="text-slate-500">|</span>
            <span>Inspector: {adminUser.name}</span>
          </div>
        </div>

        {/* Header with Candidate Basic Info */}
        <div className="p-6 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
              />
              {isVerified && (
                <div 
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center border-2 border-slate-900 shadow-sm"
                  title="TPO Verified Candidate"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-white">{student.name}</h2>
                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-lg border border-slate-700">
                  {student.rollNo}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${
                  student.placementStatus.includes('Dream')
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : student.placementStatus.includes('Placed')
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : student.placementStatus.includes('Action')
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                }`}>
                  {student.placementStatus}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{student.branch}</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-400 font-semibold">{student.batch} Batch</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-medium">Readiness: {student.readinessGrade}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {student.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Verification & Close Controls */}
          <div className="flex items-center gap-2 sm:self-start">
            <button
              id="btn-toggle-verify-student"
              onClick={handleToggleVerification}
              className={`px-3.5 py-2 text-xs font-bold rounded-2xl border transition-all flex items-center gap-1.5 ${
                isVerified
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {isVerified ? 'TPO Verified' : 'Verify Student'}
            </button>

            <button
              id="btn-close-dossier-modal"
              onClick={onClose}
              className="px-3 py-2 text-slate-300 hover:text-white rounded-2xl hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Close Dossier (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Dossier Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/40 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Summary Overview', icon: Sparkles },
            { id: 'academic', label: 'Academic & ATS Profile', icon: GraduationCap },
            { id: 'coding', label: 'Coding & DSA Matrix', icon: Code2 },
            { id: 'applications', label: 'Placement Drives & Offers', icon: Briefcase },
            { id: 'tpo_notes', label: 'TPO Remarks & Actions', icon: Edit3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 4 Quick Stat Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative CGPA</span>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">{student.cgpa} / 10.0</p>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">0 Active Backlogs</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ATS Resume Score</span>
                  <p className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">{student.resumeATSScore} / 100</p>
                  <span className="text-[10px] text-indigo-300 font-semibold mt-0.5 block">Tier-1 Format Match</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DSA Solved</span>
                  <p className="text-xl sm:text-2xl font-black text-sky-400 mt-1">{student.codingStats.totalSolved}</p>
                  <span className="text-[10px] text-sky-300 font-semibold mt-0.5 block">LeetCode Rating: {student.codingStats.leetcodeRating}</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mock Interview</span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{student.mockInterviewScore}%</p>
                  <span className="text-[10px] text-emerald-300 font-semibold mt-0.5 block">STAR Compliant</span>
                </div>
              </div>

              {/* TPO Placement Office Note Highlight */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    TPO Officer Assessment Summary
                  </span>
                  <span className="text-[10px] text-slate-500">Confidential Internal Record</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  "{student.tpoNotes}"
                </p>
              </div>

              {/* Skills and Target Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-white block">Verified Core Technical Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.primarySkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold rounded-xl"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-white block">Recent Placement Trajectory</span>
                  <div className="space-y-1.5">
                    {student.recentActivity.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ACADEMIC & ATS TAB */}
          {activeTab === 'academic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">10th Standard Board</span>
                  <p className="text-lg font-black text-white mt-1">{student.tenthPercentage}%</p>
                  <span className="text-[10px] text-slate-500">Verified Marksheet on File</span>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">12th / Diploma Board</span>
                  <p className="text-lg font-black text-white mt-1">{student.twelfthPercentage}%</p>
                  <span className="text-[10px] text-slate-500">Verified Board Certificate</span>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Backlog History</span>
                  <p className="text-lg font-black text-emerald-400 mt-1">
                    {student.activeBacklogs} Active • {student.historyBacklogs} History
                  </p>
                  <span className="text-[10px] text-emerald-400/80">Clear Academic Record</span>
                </div>
              </div>

              {/* ATS Resume Details */}
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Submitted Resume &amp; ATS Parsing</span>
                    <span className="text-xs text-slate-400">{student.resumeFileName}</span>
                  </div>
                  <button
                    onClick={() => showLocalToast('Downloading student verified resume artifact...')}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Resume
                  </button>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Target Role</span>
                    <span className="font-bold text-white">{student.targetRole}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">ATS Match Grade</span>
                    <span className="font-bold text-indigo-400">{student.resumeATSScore}% Match</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Dream Drive Status</span>
                    <span className="font-bold text-amber-400">{student.dreamEligible ? 'Eligible for Dream Tier' : 'Standard Tier'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CODING & DSA TAB */}
          {activeTab === 'coding' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">LeetCode</span>
                    <span className="text-amber-400 font-mono font-bold">{student.codingStats.leetcodeRating}</span>
                  </div>
                  <p className="text-xs text-slate-400">@{student.codingStats.leetcodeUsername}</p>
                  <p className="text-base font-extrabold text-white mt-2">{student.codingStats.leetcodeSolved} Solved</p>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">Knight Badge Verified</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">Coding Ninjas</span>
                    <span className="text-orange-400 font-mono font-bold">Level 7</span>
                  </div>
                  <p className="text-xs text-slate-400">Master Track</p>
                  <p className="text-base font-extrabold text-white mt-2">{student.codingStats.codingNinjasSolved} Solved</p>
                  <span className="text-[10px] text-sky-400 font-semibold mt-0.5 block">DSA Ninja Certified</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">GeeksforGeeks</span>
                    <span className="text-emerald-400 font-mono font-bold">1240 pts</span>
                  </div>
                  <p className="text-xs text-slate-400">Institute Rank #14</p>
                  <p className="text-base font-extrabold text-white mt-2">{student.codingStats.gfgSolved} Solved</p>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">POTD Streak Holder</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Aggregated Problem Solving Volume</span>
                  <p className="text-xs text-slate-400 mt-0.5">Calculated across LeetCode, Coding Ninjas, GFG and HackerRank</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-indigo-400">{student.codingStats.totalSolved} Problems</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">Top 5% Cohort Percentile</span>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATIONS & DRIVES TAB */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Drive Applications &amp; Status Pipeline</h3>
                  <p className="text-[11px] text-slate-400">Campus on-campus &amp; pooled drive records</p>
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  {student.applications.length} Active Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                      <th className="py-2.5 px-3 rounded-l-xl">Company</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Applied Date</th>
                      <th className="py-2.5 px-3">CTC</th>
                      <th className="py-2.5 px-3 rounded-r-xl text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {student.applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          {app.company}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{app.role}</td>
                        <td className="py-3 px-3 text-slate-400">{app.appliedDate}</td>
                        <td className="py-3 px-3 font-bold text-sky-400">{app.packageLpa} LPA</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                            app.status === 'Offer Accepted' || app.status === 'Offer Extended'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : app.status.includes('Round') || app.status.includes('Cleared')
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TPO REMARKS & ACTIONS TAB */}
          {activeTab === 'tpo_notes' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white block">
                    TPO Internal Confidential Remarks
                  </label>
                  <span className="text-[10px] text-slate-400">Visible to TPO Admin Staff Only</span>
                </div>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                  placeholder="Enter evaluation notes, recruiter recommendations, or remedial assignments..."
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">
                    Last modified: Today by {adminUser.name}
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isSavedNotes ? 'Saved!' : 'Save Remarks'}
                  </button>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <button
                  onClick={handleDispatchAssessment}
                  className="p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      Dispatch DSA Remedial Task
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Assign targeted Dynamic Programming &amp; Graph questions via email.</p>
                </button>

                <button
                  onClick={() => showLocalToast(`Nominated ${student.name} for upcoming Google L3 Recruitment Drive`)}
                  className="p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 rounded-2xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-sky-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-sky-400" />
                      Nominate for Dream Drive
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Add student directly to executive priority recruiter shortlists.</p>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Candidate account untouched. Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">ESC</kbd> or click outside to exit</span>
          </div>

          <div className="flex items-center gap-2 self-end">
            <button
              onClick={() => showLocalToast('Exporting official university student dossier PDF...')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold flex items-center gap-1.5 border border-slate-800 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Export PDF
            </button>
            <button
              id="btn-dossier-done-bottom"
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>
          </div>
        </div>

        {/* Local Toast */}
        {toast && (
          <div className="absolute bottom-16 right-6 z-50 bg-slate-950 border border-indigo-500/60 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

      </div>
    </div>
  );
};
