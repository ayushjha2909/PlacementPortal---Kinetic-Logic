import React, { useState, useEffect } from 'react';
import { 
  JobOpening, 
  User,
  CompanyDrive,
  JobApplication
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Search,
  Clock,
  Layers,
  GraduationCap,
  Briefcase,
  Check,
  Send,
  Loader2,
  Calendar,
  Award,
  ChevronRight
} from 'lucide-react';

interface CompanyMatchesProps {
  jobs: JobOpening[];
  user: User;
  onApplyJob: (job: JobOpening) => void;
}

export const CompanyMatches: React.FC<CompanyMatchesProps> = ({
  jobs,
  user,
  onApplyJob,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'drives' | 'my-applications'>('drives');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [liveDrives, setLiveDrives] = useState<CompanyDrive[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);
  const [applyErrorMessage, setApplyErrorMessage] = useState<string | null>(null);

  // Fetch live drives from backend
  const fetchDrivesAndApplications = async () => {
    setLoading(true);
    try {
      const [drivesRes, appsRes] = await Promise.all([
        fetch(`/api/drives?userEmail=${encodeURIComponent(user.email)}`),
        fetch(`/api/applications/my?email=${encodeURIComponent(user.email)}`),
      ]);

      if (drivesRes.ok) {
        const dData = await drivesRes.json();
        if (dData.drives && dData.drives.length > 0) {
          setLiveDrives(dData.drives);
        }
      }

      if (appsRes.ok) {
        const aData = await appsRes.json();
        if (aData.applications) {
          setMyApplications(aData.applications);
        }
      }
    } catch (err) {
      console.warn('[CompanyMatches] Notice during drive fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivesAndApplications();
  }, [user.email]);

  const handleApplyDrive = async (drive: CompanyDrive) => {
    setApplyingId(drive.id);
    setApplySuccessMessage(null);
    setApplyErrorMessage(null);

    const studentCgpa = user.cgpa || 8.5;
    if (studentCgpa < drive.minCgpa) {
      setApplyErrorMessage(`Eligibility constraint: Minimum CGPA required is ${drive.minCgpa}. Your verified CGPA is ${studentCgpa}.`);
      setApplyingId(null);
      return;
    }

    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driveId: drive.id,
          driveCode: drive.driveCode,
          companyName: drive.companyName,
          roleTitle: drive.roleTitle,
          userId: user.id,
          studentEmail: user.email,
          studentName: user.name,
          studentBranch: user.branch || 'Computer Science',
          studentCgpa: user.cgpa || 8.5,
          atsScore: user.latestAtsScore || 88,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setApplySuccessMessage(`Application confirmed for ${drive.companyName} (${drive.roleTitle})!`);
      // Refresh list
      await fetchDrivesAndApplications();
    } catch (err: any) {
      setApplyErrorMessage(err.message || 'Application submission failed.');
    } finally {
      setApplyingId(null);
    }
  };

  const filteredDrives = liveDrives.filter((d) => {
    const matchesSearch =
      d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = selectedTier === 'All' || d.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Bento Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Campus Placement Hub &amp; Drives</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
              {liveDrives.length} Verified Drives
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time campus recruitment drives, verified minimum CGPA ({user.cgpa || 8.8}), and one-click application pipeline.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('drives')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'drives' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Drives ({liveDrives.length})
          </button>
          <button
            onClick={() => setActiveSubTab('my-applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'my-applications' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Applications
            {myApplications.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                {myApplications.length}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Success / Error Alerts */}
      {applySuccessMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{applySuccessMessage}</span>
          </div>
          <button 
            onClick={() => setApplySuccessMessage(null)}
            className="text-xs text-emerald-700 hover:underline font-bold"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {applyErrorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{applyErrorMessage}</span>
          </div>
          <button 
            onClick={() => setApplyErrorMessage(null)}
            className="text-xs text-rose-700 hover:underline font-bold"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {activeSubTab === 'drives' ? (
        <>
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by company, role, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none placeholder-slate-400 text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Drive Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="Super Dream">Super Dream (40+ LPA)</option>
                <option value="Tier-1">Tier-1 (25-40 LPA)</option>
                <option value="Tier-2">Tier-2</option>
              </select>
            </div>
          </div>

          {/* Placement Drives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDrives.map((drive, idx) => {
                const userCgpa = user.cgpa || 8.8;
                const isEligible = userCgpa >= drive.minCgpa;
                const isApplied = drive.hasApplied;

                return (
                  <motion.div
                    key={drive.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 rounded-3xl p-6 transition-colors flex flex-col justify-between space-y-4 group shadow-xs"
                  >
                    <div className="space-y-4">
                      
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-base text-white shrink-0 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                            {drive.logoUrl ? (
                              <img src={drive.logoUrl} alt={drive.companyName} className="w-full h-full object-cover" />
                            ) : (
                              drive.companyName.charAt(0)
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {drive.companyName}
                              </h3>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                                {drive.tier}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5">
                              {drive.roleTitle}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {drive.location}
                            </p>
                          </div>
                        </div>

                        {/* CTC Package */}
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-indigo-600 block">
                            ₹{drive.packageLpa} LPA
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">CTC Offered</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {drive.description}
                      </p>

                      {/* Criteria Highlights */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] text-slate-500 font-medium block">Min CGPA Required</span>
                          <span className={`text-xs font-extrabold mt-0.5 flex items-center gap-1 ${isEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isEligible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {drive.minCgpa} CGPA {isEligible ? '(Eligible)' : '(Ineligible)'}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] text-slate-500 font-medium block">Allowed Backlogs</span>
                          <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                            Max {drive.maxBacklogs} Active
                          </span>
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Required Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {drive.skillsRequired.map((s) => (
                            <span key={s} className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Assessment Rounds Preview */}
                      {drive.rounds && drive.rounds.length > 0 && (
                        <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900">
                          <span className="font-bold block mb-1">Recruitment Rounds:</span>
                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            {drive.rounds.map((r, i) => (
                              <span key={i} className="flex items-center gap-1">
                                <span className="font-semibold">{r}</span>
                                {i < drive.rounds!.length - 1 && <ChevronRight className="w-3 h-3 text-indigo-400" />}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Footer Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Code: {drive.driveCode}
                      </span>

                      <button
                        onClick={() => handleApplyDrive(drive)}
                        disabled={isApplied || applyingId === drive.id || !isEligible}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : !isEligible
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20'
                        }`}
                      >
                        {applyingId === drive.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            {drive.applicationStatus || 'Applied'}
                          </>
                        ) : !isEligible ? (
                          'CGPA Ineligible'
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            One-Click Apply
                          </>
                        )}
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* MY APPLICATIONS TRACKER VIEW */
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">
              Active Application Pipelines ({myApplications.length})
            </h2>
            <p className="text-xs text-slate-500">
              Track live interview rounds, online assessment schedules, and offer letters issued by recruiters.
            </p>

            {myApplications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No active placement applications submitted yet.</p>
                <button
                  onClick={() => setActiveSubTab('drives')}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer hover:bg-indigo-700"
                >
                  Explore Active Campus Drives
                </button>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                {myApplications.map((app) => (
                  <div 
                    key={app.id}
                    className="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 transition-all shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-slate-900">{app.companyName}</h3>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold rounded-md">
                            {app.driveCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">{app.roleTitle}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          app.status === 'OFFERED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'SHORTLISTED'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Pipeline Milestone Stepper */}
                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-emerald-800 block">1. Applied ✓</span>
                        <span className="text-[9px] text-emerald-600 font-medium">Resume Synced</span>
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED'].includes(app.status)
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <span className="text-[10px] font-bold block">2. OA / Screening</span>
                        <span className="text-[9px] font-medium">
                          {['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED'].includes(app.status) ? 'Passed' : 'In Review'}
                        </span>
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        ['INTERVIEW_SCHEDULED', 'OFFERED'].includes(app.status)
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <span className="text-[10px] font-bold block">3. Technical Round</span>
                        <span className="text-[9px] font-medium">
                          {app.status === 'OFFERED' ? 'Cleared' : app.status === 'INTERVIEW_SCHEDULED' ? 'Scheduled' : 'Pending'}
                        </span>
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        app.status === 'OFFERED'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-black'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <span className="text-[10px] font-bold block">4. Final Offer</span>
                        <span className="text-[9px] font-medium">{app.status === 'OFFERED' ? 'Issued ✓' : 'Awaiting'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      <span>Verified ATS Score: <strong className="text-slate-800">{app.atsScore || 85}/100</strong></span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
