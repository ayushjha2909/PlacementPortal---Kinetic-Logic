import React, { useState, useEffect } from 'react';
import { CodingPlatform, CodingProfile } from '../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Code2,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';

interface AddCodingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfile: (profile: CodingProfile) => void;
  existingPlatforms: CodingPlatform[];
}

interface PlatformConfig {
  id: CodingPlatform;
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconLetter: string;
  defaultUrl: string;
  sampleUser: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    subtitle: 'Algorithms, Data Structures & Contests',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconLetter: 'LC',
    defaultUrl: 'https://leetcode.com/u/',
    sampleUser: 'alex_mercer_dev',
  },
  {
    id: 'codingninjas',
    name: 'Coding Ninjas',
    subtitle: 'Code360 & Campus Placement Track',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconLetter: 'CN',
    defaultUrl: 'https://www.naukri.com/code360/profile/',
    sampleUser: 'alexmercer_ninja',
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    subtitle: 'Skill Badges & Problem Solving Stars',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconLetter: 'HR',
    defaultUrl: 'https://www.hackerrank.com/profile/',
    sampleUser: 'alex_mercer_cs',
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    subtitle: 'POTD, Practice & Institute Rank',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconLetter: 'GFG',
    defaultUrl: 'https://auth.geeksforgeeks.org/user/',
    sampleUser: 'alexmercer2025',
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    subtitle: 'Competitive Divisions & Contest Rating',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconLetter: 'CF',
    defaultUrl: 'https://codeforces.com/profile/',
    sampleUser: 'alex_cf_coder',
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    subtitle: 'Star Ratings & Monthly Challenges',
    color: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconLetter: 'CC',
    defaultUrl: 'https://www.codechef.com/users/',
    sampleUser: 'alex_chef_star',
  },
];

export const AddCodingProfileModal: React.FC<AddCodingProfileModalProps> = ({
  isOpen,
  onClose,
  onAddProfile,
  existingPlatforms,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<CodingPlatform>('leetcode');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<CodingProfile | null>(null);
  const [isFineTuning, setIsFineTuning] = useState(false);
  const [customTotal, setCustomTotal] = useState<number | string>('');
  const [customEasy, setCustomEasy] = useState<number | string>('');
  const [customMed, setCustomMed] = useState<number | string>('');
  const [customHard, setCustomHard] = useState<number | string>('');
  const [customRating, setCustomRating] = useState<number | string>('');
  const [customRank, setCustomRank] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentPlatformConfig = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];
  const isAlreadyConnected = existingPlatforms.includes(selectedPlatform);

  const handleFetchStats = async () => {
    if (!username.trim()) {
      setError('Please enter a username or handle');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreviewProfile(null);
    setIsFineTuning(false);

    try {
      const response = await fetch('/api/coding-profile/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          username: username.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coding profile data');
      }

      const data = await response.json();
      const prof = data.profile;
      setPreviewProfile(prof);
      setCustomTotal(prof.stats.totalSolved);
      setCustomEasy(prof.stats.easySolved);
      setCustomMed(prof.stats.mediumSolved);
      setCustomHard(prof.stats.hardSolved);
      setCustomRating(prof.stats.contestRating || '');
      setCustomRank(prof.stats.ranking ? String(prof.stats.ranking) : '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not verify coding handle. Please check the spelling.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotalSolvedChange = (val: string) => {
    setCustomTotal(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      const e = Math.floor(num * 0.38);
      const h = Math.max(1, Math.floor(num * 0.14));
      const m = Math.max(0, num - e - h);
      setCustomEasy(e);
      setCustomMed(m);
      setCustomHard(h);

      if (previewProfile) {
        setPreviewProfile({
          ...previewProfile,
          stats: {
            ...previewProfile.stats,
            totalSolved: num,
            easySolved: e,
            mediumSolved: m,
            hardSolved: h,
          },
        });
      }
    }
  };

  const handleDifficultyChange = (type: 'easy' | 'med' | 'hard', val: string) => {
    const numVal = parseInt(val, 10) || 0;
    let newEasy = type === 'easy' ? numVal : (parseInt(String(customEasy), 10) || 0);
    let newMed = type === 'med' ? numVal : (parseInt(String(customMed), 10) || 0);
    let newHard = type === 'hard' ? numVal : (parseInt(String(customHard), 10) || 0);

    if (type === 'easy') setCustomEasy(val);
    if (type === 'med') setCustomMed(val);
    if (type === 'hard') setCustomHard(val);

    const newTotal = newEasy + newMed + newHard;
    setCustomTotal(newTotal);

    if (previewProfile) {
      setPreviewProfile({
        ...previewProfile,
        stats: {
          ...previewProfile.stats,
          totalSolved: newTotal,
          easySolved: newEasy,
          mediumSolved: newMed,
          hardSolved: newHard,
        },
      });
    }
  };

  const handleConfirmAdd = () => {
    if (previewProfile) {
      const finalTotal = parseInt(String(customTotal), 10) || previewProfile.stats.totalSolved;
      const finalEasy = parseInt(String(customEasy), 10) || previewProfile.stats.easySolved;
      const finalMed = parseInt(String(customMed), 10) || previewProfile.stats.mediumSolved;
      const finalHard = parseInt(String(customHard), 10) || previewProfile.stats.hardSolved;
      const finalRating = customRating ? parseInt(String(customRating), 10) : previewProfile.stats.contestRating;
      const finalRank = customRank || previewProfile.stats.ranking;

      const finalizedProfile: CodingProfile = {
        ...previewProfile,
        stats: {
          ...previewProfile.stats,
          totalSolved: finalTotal,
          easySolved: finalEasy,
          mediumSolved: finalMed,
          hardSolved: finalHard,
          contestRating: finalRating,
          ranking: finalRank,
        },
      };

      onAddProfile(finalizedProfile);
      onClose();
      setUsername('');
      setPreviewProfile(null);
      setIsFineTuning(false);
    }
  };

  const handleQuickFillSample = () => {
    setUsername(currentPlatformConfig.sampleUser);
    setError(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Connect Coding Profile
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Link competitive programming handles to sync solved counts, ratings, &amp; topics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Step 1: Select Platform */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              1. Choose Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PLATFORMS.map((plat) => {
                const isSelected = selectedPlatform === plat.id;
                const isConnected = existingPlatforms.includes(plat.id);

                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(plat.id);
                      setPreviewProfile(null);
                      setError(null);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between relative active:scale-95 ${
                      isSelected
                        ? `${plat.bgColor} ${plat.borderColor} ring-2 ring-indigo-500 shadow-2xs`
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${plat.bgColor} ${plat.color} border ${plat.borderColor}`}>
                        {plat.iconLetter}
                      </span>
                      {isConnected && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-bold">
                          <Check className="w-2.5 h-2.5" /> Connected
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{plat.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{plat.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Enter Handle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                2. Enter {currentPlatformConfig.name} Username / Handle
              </label>
              <button
                type="button"
                onClick={handleQuickFillSample}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Fill Demo Handle ({currentPlatformConfig.sampleUser})
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono select-none">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchStats()}
                  placeholder={`e.g. ${currentPlatformConfig.sampleUser}`}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={handleFetchStats}
                disabled={isLoading || !username.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-indigo-500/20 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Verify &amp; Preview
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Step 3: Profile Verification Preview */}
          {previewProfile && (
            <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">@{previewProfile.username}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        Verified Profile
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{currentPlatformConfig.name} • Live Stats Synced</span>
                  </div>
                </div>

                <a
                  href={previewProfile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-600 hover:text-indigo-600 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                >
                  <ExternalLink className="w-3 h-3" /> View
                </a>
              </div>

              {/* Stats Grid Preview */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-slate-500 font-medium">Total Solved</p>
                  <p className="text-base font-black text-slate-900">{customTotal || previewProfile.stats.totalSolved}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-emerald-700 font-bold">Easy</p>
                  <p className="text-base font-black text-emerald-700">{customEasy || previewProfile.stats.easySolved}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-amber-700 font-bold">Medium</p>
                  <p className="text-base font-black text-amber-700">{customMed || previewProfile.stats.mediumSolved}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-rose-700 font-bold">Hard</p>
                  <p className="text-base font-black text-rose-700">{customHard || previewProfile.stats.hardSolved}</p>
                </div>
              </div>

              {/* Fine-Tuning / Solved Count Override Panel */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Need to fine-tune or set your exact solved count (e.g. 566)?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFineTuning(!isFineTuning)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                  >
                    {isFineTuning ? 'Hide Custom Inputs' : 'Edit Exact Numbers'}
                  </button>
                </div>

                {isFineTuning && (
                  <div className="mt-2.5 p-3.5 bg-white border border-indigo-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
                    <p className="text-[11px] text-slate-500 font-medium">
                      Enter your exact problem count below. Setting Total Solved (e.g. <strong>566</strong>) will auto-distribute across difficulties or you can tune each individually:
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Total Solved</label>
                        <input
                          type="number"
                          value={customTotal}
                          onChange={(e) => handleTotalSolvedChange(e.target.value)}
                          placeholder="e.g. 566"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-700 mb-1">Easy</label>
                        <input
                          type="number"
                          value={customEasy}
                          onChange={(e) => handleDifficultyChange('easy', e.target.value)}
                          placeholder="Easy"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-emerald-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-700 mb-1">Medium</label>
                        <input
                          type="number"
                          value={customMed}
                          onChange={(e) => handleDifficultyChange('med', e.target.value)}
                          placeholder="Medium"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-amber-700 focus:outline-none focus:border-amber-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-rose-700 mb-1">Hard</label>
                        <input
                          type="number"
                          value={customHard}
                          onChange={(e) => handleDifficultyChange('hard', e.target.value)}
                          placeholder="Hard"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-rose-700 focus:outline-none focus:border-rose-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Contest Rating (Optional)</label>
                        <input
                          type="number"
                          value={customRating}
                          onChange={(e) => setCustomRating(e.target.value)}
                          placeholder="e.g. 1750"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Rank / Standing (Optional)</label>
                        <input
                          type="text"
                          value={customRank}
                          onChange={(e) => setCustomRank(e.target.value)}
                          placeholder="e.g. 35,400"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges / Rating Pill */}
              {previewProfile.stats.ranking && (
                <div className="flex items-center justify-between text-[11px] bg-white px-3 py-1.5 rounded-xl text-slate-700 border border-slate-200">
                  <span className="text-slate-500">Ranking / Rating:</span>
                  <span className="font-mono font-bold text-indigo-700">{customRank || previewProfile.stats.ranking}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmAdd}
            disabled={!previewProfile}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isAlreadyConnected ? 'Update Profile Data' : 'Connect & Add to Analysis'}
          </button>
        </div>

      </div>
    </div>
  );
};
