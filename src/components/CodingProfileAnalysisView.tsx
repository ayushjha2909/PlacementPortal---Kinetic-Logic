import React, { useState } from 'react';
import { 
  CodingProfile, 
  CodingProfileAnalysis,
  CodingPlatform 
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  Award, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Trash2, 
  ChevronRight,
  BookOpen,
  Layers,
  Building2,
  Sliders,
  Check,
  Edit3,
  X
} from 'lucide-react';

interface CodingProfileAnalysisViewProps {
  profiles: CodingProfile[];
  analysis: CodingProfileAnalysis;
  onOpenAddModal: () => void;
  onRemoveProfile: (id: string) => void;
  onSyncProfile: (profile: CodingProfile) => void;
  onUpdateProfile?: (profile: CodingProfile) => Promise<void>;
  onRunAiDiagnostic: () => Promise<void>;
  isAnalyzing: boolean;
  onSelectProblemToPractice?: (problemName: string) => void;
}

const PLATFORM_THEMES: Record<CodingPlatform, { name: string; badgeColor: string; bg: string; border: string; letter: string }> = {
  leetcode: {
    name: 'LeetCode',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    bg: 'bg-amber-50/40',
    border: 'border-amber-200',
    letter: 'LC',
  },
  codingninjas: {
    name: 'Coding Ninjas',
    badgeColor: 'text-orange-700 bg-orange-50 border-orange-200',
    bg: 'bg-orange-50/40',
    border: 'border-orange-200',
    letter: 'CN',
  },
  hackerrank: {
    name: 'HackerRank',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-200',
    letter: 'HR',
  },
  geeksforgeeks: {
    name: 'GeeksforGeeks',
    badgeColor: 'text-green-700 bg-green-50 border-green-200',
    bg: 'bg-green-50/40',
    border: 'border-green-200',
    letter: 'GFG',
  },
  codeforces: {
    name: 'Codeforces',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    bg: 'bg-blue-50/40',
    border: 'border-blue-200',
    letter: 'CF',
  },
  codechef: {
    name: 'CodeChef',
    badgeColor: 'text-amber-800 bg-amber-50 border-amber-300',
    bg: 'bg-amber-50/40',
    border: 'border-amber-200',
    letter: 'CC',
  },
};

export const CodingProfileAnalysisView: React.FC<CodingProfileAnalysisViewProps> = ({
  profiles = [],
  analysis,
  onOpenAddModal,
  onRemoveProfile,
  onSyncProfile,
  onUpdateProfile,
  onRunAiDiagnostic,
  isAnalyzing,
  onSelectProblemToPractice,
}) => {
  const predictedClearance = analysis?.predictedRoundClearance || [];
  const topicStrengths = analysis?.topicStrengths || [];
  const criticalGaps = analysis?.criticalGaps || [];
  const recommendedActionPlan = analysis?.recommendedActionPlan || [];

  const [selectedCompany, setSelectedCompany] = useState<string>(
    predictedClearance[0]?.company || 'Amazon'
  );
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Edit Profile modal state
  const [editingProfile, setEditingProfile] = useState<CodingProfile | null>(null);
  const [editTotal, setEditTotal] = useState<number | string>('');
  const [editEasy, setEditEasy] = useState<number | string>('');
  const [editMed, setEditMed] = useState<number | string>('');
  const [editHard, setEditHard] = useState<number | string>('');
  const [editRating, setEditRating] = useState<number | string>('');
  const [editRank, setEditRank] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleOpenEdit = (p: CodingProfile) => {
    setEditingProfile(p);
    setEditTotal(p.stats.totalSolved);
    setEditEasy(p.stats.easySolved);
    setEditMed(p.stats.mediumSolved);
    setEditHard(p.stats.hardSolved);
    setEditRating(p.stats.contestRating || '');
    setEditRank(p.stats.ranking ? String(p.stats.ranking) : '');
  };

  const handleEditTotalChange = (val: string) => {
    setEditTotal(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      const e = Math.floor(num * 0.38);
      const h = Math.max(1, Math.floor(num * 0.14));
      const m = Math.max(0, num - e - h);
      setEditEasy(e);
      setEditMed(m);
      setEditHard(h);
    }
  };

  const handleEditDiffChange = (type: 'easy' | 'med' | 'hard', val: string) => {
    const numVal = parseInt(val, 10) || 0;
    let newEasy = type === 'easy' ? numVal : (parseInt(String(editEasy), 10) || 0);
    let newMed = type === 'med' ? numVal : (parseInt(String(editMed), 10) || 0);
    let newHard = type === 'hard' ? numVal : (parseInt(String(editHard), 10) || 0);

    if (type === 'easy') setEditEasy(val);
    if (type === 'med') setEditMed(val);
    if (type === 'hard') setEditHard(val);

    setEditTotal(newEasy + newMed + newHard);
  };

  const handleSaveEdit = async () => {
    if (!editingProfile) return;
    setIsSavingEdit(true);

    const total = parseInt(String(editTotal), 10) || editingProfile.stats.totalSolved;
    const easy = parseInt(String(editEasy), 10) || editingProfile.stats.easySolved;
    const med = parseInt(String(editMed), 10) || editingProfile.stats.mediumSolved;
    const hard = parseInt(String(editHard), 10) || editingProfile.stats.hardSolved;
    const rating = editRating ? parseInt(String(editRating), 10) : editingProfile.stats.contestRating;
    const rank = editRank || editingProfile.stats.ranking;

    const updatedProf: CodingProfile = {
      ...editingProfile,
      lastSynced: 'Just now',
      stats: {
        ...editingProfile.stats,
        totalSolved: total,
        easySolved: easy,
        mediumSolved: med,
        hardSolved: hard,
        contestRating: rating,
        ranking: rank,
        problemsByTopic: [
          { topic: 'Arrays & Hashing', solved: Math.round(total * 0.23), totalEstimated: 80, accuracy: 92, proficiency: 'Master' },
          { topic: 'Two Pointers & Sliding Window', solved: Math.round(total * 0.16), totalEstimated: 55, accuracy: 88, proficiency: 'Proficient' },
          { topic: 'Binary Trees & BST', solved: Math.round(total * 0.16), totalEstimated: 60, accuracy: 85, proficiency: 'Proficient' },
          { topic: 'Dynamic Programming', solved: Math.round(total * 0.15), totalEstimated: 75, accuracy: 76, proficiency: 'Competent' },
          { topic: 'Graphs & BFS/DFS', solved: Math.round(total * 0.14), totalEstimated: 50, accuracy: 79, proficiency: 'Competent' },
          { topic: 'Trie & Segment Trees', solved: Math.round(total * 0.08), totalEstimated: 30, accuracy: 66, proficiency: 'Competent' },
          { topic: 'Bit Manipulation', solved: Math.round(total * 0.08), totalEstimated: 25, accuracy: 84, proficiency: 'Competent' },
        ],
      },
    };

    if (onUpdateProfile) {
      await onUpdateProfile(updatedProf);
    } else {
      onSyncProfile(updatedProf);
    }

    setIsSavingEdit(false);
    setEditingProfile(null);
  };

  const handleSyncSingle = async (p: CodingProfile) => {
    setSyncingId(p.id);
    await new Promise((r) => setTimeout(r, 600));
    onSyncProfile(p);
    setSyncingId(null);
  };

  const currentCompanyData = predictedClearance.find(
    (c) => c.company === selectedCompany
  ) || predictedClearance[0];

  const totalEasy = (profiles || []).reduce((acc, p) => acc + (p?.stats?.easySolved || 0), 0);
  const totalMed = (profiles || []).reduce((acc, p) => acc + (p?.stats?.mediumSolved || 0), 0);
  const totalHard = (profiles || []).reduce((acc, p) => acc + (p?.stats?.hardSolved || 0), 0);
  const totalSolved = totalEasy + totalMed + totalHard;

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Quick Actions Bento Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200/90 rounded-3xl p-6 relative overflow-hidden shadow-xs"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Unified Coding Profile &amp; AI Diagnostic
              </h2>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                {analysis.placementReadinessTier}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Cross-platform analytics aggregating verified solutions from LeetCode, Coding Ninjas, HackerRank, GeeksforGeeks, and Codeforces to benchmark campus SDE readiness.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Coding Handle
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRunAiDiagnostic}
              disabled={isAnalyzing}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-indigo-600' : ''}`} />
              {isAnalyzing ? 'Analyzing Metrics...' : 'Re-Run Diagnostic'}
            </motion.button>
          </div>
        </div>

        {/* 2. Top Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-6 mt-6 border-t border-slate-100">
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Overall Rating</span>
              <Award className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{analysis.candidateRating}</span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
            <p className="text-[10px] text-emerald-700 mt-0.5 font-bold">Top 8% on Campus</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Total Solved</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{totalSolved || analysis.totalProblemsAcrossPlatforms}</span>
              <span className="text-[10px] text-slate-500">across {profiles.length} handles</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold">
              <span className="text-emerald-700">{totalEasy}E</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700">{totalMed}M</span>
              <span className="text-slate-300">•</span>
              <span className="text-rose-700">{totalHard}H</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Cross-Percentile</span>
              <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-sky-600">{analysis.crossPlatformPercentile}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Tier 1 Target Benchmark</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Active Streak</span>
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-orange-600">{analysis.activeStreak}</span>
              <span className="text-xs text-slate-500">days</span>
            </div>
            <p className="text-[10px] text-emerald-700 mt-0.5 font-bold">Daily POTD active</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>DSA Readiness</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600">{analysis.dsaReadinessScore}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Sys Design: {analysis.systemDesignReadinessScore}%</p>
          </motion.div>

        </div>
      </motion.div>

      {/* 2. Connected Platform Profiles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>Connected Profiles ({profiles.length})</span>
            <span className="text-xs text-slate-400 font-normal">
              Syncing live problem counts &amp; contest ratings
            </span>
          </h3>
          <button
            onClick={onOpenAddModal}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Another Platform
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((profile, index) => {
            const theme = PLATFORM_THEMES[profile.platform] || PLATFORM_THEMES.leetcode;
            const isSyncing = syncingId === profile.id;

            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between relative hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all shadow-xs group"
              >
                <div>
                  {/* Top line: Platform badge & External Link */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${theme.badgeColor}`}>
                        {theme.letter}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{theme.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">@{profile.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(profile)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Edit / Adjust Solved Count"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={profile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Open profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onRemoveProfile(profile.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Problem breakdown counters */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center mb-3">
                    <div>
                      <p className="text-[10px] text-emerald-700 font-bold">Easy</p>
                      <p className="text-xs font-black text-slate-900">{profile.stats.easySolved}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-700 font-bold">Med</p>
                      <p className="text-xs font-black text-slate-900">{profile.stats.mediumSolved}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-rose-700 font-bold">Hard</p>
                      <p className="text-xs font-black text-slate-900">{profile.stats.hardSolved}</p>
                    </div>
                  </div>

                  {/* Ranking / Rating info */}
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total Solved:</span>
                      <span className="font-bold text-slate-900">{profile.stats.totalSolved}</span>
                    </div>
                    {profile.stats.ranking && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Rank / Standing:</span>
                        <span className="font-mono text-indigo-600 font-bold">{profile.stats.ranking}</span>
                      </div>
                    )}
                    {profile.stats.contestRating && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Contest Rating:</span>
                        <span className="font-mono text-amber-700 font-bold">{profile.stats.contestRating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Sync bar */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {profile.lastSynced}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(profile)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      Adjust
                    </button>
                    <button
                      onClick={() => handleSyncSingle(profile)}
                      disabled={isSyncing}
                      className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
                      Sync
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add Profile Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddModal}
            className="bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-6 flex flex-col items-center justify-center text-center group transition-colors min-h-[190px] shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-indigo-50 border border-slate-200 group-hover:border-indigo-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 mb-2 transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Connect Platform</p>
            <p className="text-[11px] text-slate-400 mt-0.5">CodeChef, Codeforces, etc.</p>
          </motion.button>
        </div>
      </div>

      {/* 3. AI Executive Analysis Summary */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">AI Diagnostic Assessment</h3>
            <p className="text-[11px] text-slate-500">Algorithmic velocity &amp; campus placement bar evaluation</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 leading-relaxed space-y-2">
          <p>{analysis.aiExecutiveSummary}</p>
        </div>
      </div>

      {/* 4. Company Clearance Predictor & Topic Mastery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Topic Mastery Radar */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Topic Mastery &amp; Blind Spots</h3>
                <p className="text-[11px] text-slate-500">Score vs. Tier-1 Placement Benchmark</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 font-bold">
              6 Core Topics
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {topicStrengths.map((topicItem, idx) => {
              const isStrong = topicItem.status === 'strong';
              const isModerate = topicItem.status === 'moderate';

              return (
                <div key={idx} className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{topicItem.topic}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${
                          isStrong
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isModerate
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {isStrong ? 'Strong' : isModerate ? 'Moderate' : 'Needs Practice'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-extrabold text-slate-900">{topicItem.score}%</span>
                      <span className="text-slate-400 text-[10px]">(Target: {topicItem.benchmarkScore}%)</span>
                    </div>
                  </div>

                  {/* Progress bar comparison */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isStrong ? 'bg-emerald-500' : isModerate ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${topicItem.score}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    <span className="text-indigo-600 font-bold">Tip: </span>
                    {topicItem.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Target Company Predictor */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Company OA Clearance Predictor</h3>
                <p className="text-[11px] text-slate-500">Estimated chance of clearing technical screen</p>
              </div>
            </div>

            {/* Company selector tabs */}
            <div className="flex gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar mb-4">
              {predictedClearance.map((comp) => {
                const isSelected = selectedCompany === comp.company;
                return (
                  <button
                    key={comp.company}
                    onClick={() => setSelectedCompany(comp.company)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {comp.company}
                  </button>
                );
              })}
            </div>

            {/* Selected Company Card */}
            {currentCompanyData && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-slate-900">{currentCompanyData.company}</h4>
                    <p className="text-xs text-slate-500">{currentCompanyData.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600">
                      {currentCompanyData.probability}%
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">Clearance Probability</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Problem Count Readiness:</span>
                    <span className="font-bold text-slate-800">
                      {totalSolved} / {currentCompanyData.minRecommendedProblemCount} recommended
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (totalSolved / (currentCompanyData.minRecommendedProblemCount || 1)) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {currentCompanyData.rationale}
                </p>

                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Evaluated Rounds:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(currentCompanyData.keyRoundsCovered || []).map((round, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-medium"
                      >
                        ✓ {round}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Callout */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical Gaps Identified: <strong className="text-rose-600">{criticalGaps.length}</strong></span>
            <span className="text-indigo-600 font-bold">Auto-Synced with TPO</span>
          </div>
        </div>

      </div>

      {/* 5. Recommended High-Yield Action Roadmap & Target Problems */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Targeted Practice Roadmap</h3>
              <p className="text-[11px] text-slate-500">High-yield sprint plan to bridge detected algorithmic blind spots</p>
            </div>
          </div>
          <span className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            14-Day Sprint
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {recommendedActionPlan.map((stepItem) => (
            <div
              key={stepItem.step}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center text-xs font-black">
                    {stepItem.step}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">{stepItem.timeFrame}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{stepItem.title}</h4>
                <p className="text-[11px] text-indigo-700 font-semibold">{stepItem.target}</p>
              </div>

              {/* Recommended problem list */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Target Problems:
                </p>
                <div className="space-y-1">
                  {(stepItem.specificProblems || []).map((prob, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => onSelectProblemToPractice && onSelectProblemToPractice(prob)}
                      className="w-full text-left flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-colors group active:scale-98 shadow-2xs"
                    >
                      <span className="truncate font-medium">{prob}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Edit Profile Stats Modal */}
      {editingProfile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setEditingProfile(null)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    Adjust Solved Problems &amp; Stats
                  </h3>
                  <p className="text-xs text-slate-500">
                    @{editingProfile.username} on {PLATFORM_THEMES[editingProfile.platform]?.name || editingProfile.platform}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProfile(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  Update your exact problem count (e.g. <strong>566</strong> solved). Changing the total will automatically scale the difficulty ratio or you can edit each individually.
                </p>
              </div>

              {/* Total Solved */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Total Solved Problems
                </label>
                <input
                  type="number"
                  value={editTotal}
                  onChange={(e) => handleEditTotalChange(e.target.value)}
                  placeholder="e.g. 566"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-black focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-700 mb-1">Easy Solved</label>
                  <input
                    type="number"
                    value={editEasy}
                    onChange={(e) => handleEditDiffChange('easy', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-700 mb-1">Medium Solved</label>
                  <input
                    type="number"
                    value={editMed}
                    onChange={(e) => handleEditDiffChange('med', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-amber-700 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-700 mb-1">Hard Solved</label>
                  <input
                    type="number"
                    value={editHard}
                    onChange={(e) => handleEditDiffChange('hard', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-rose-700 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Rating and Standing */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Contest Rating</label>
                  <input
                    type="number"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                    placeholder="e.g. 1750"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Rank / Standing</label>
                  <input
                    type="text"
                    value={editRank}
                    onChange={(e) => setEditRank(e.target.value)}
                    placeholder="e.g. 35,400"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-indigo-600/20 active:scale-95 cursor-pointer"
              >
                {isSavingEdit ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Updating &amp; Re-analyzing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save &amp; Re-run AI Diagnostic
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
