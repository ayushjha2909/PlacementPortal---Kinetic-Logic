import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TPODashboardStats, 
  StudentSkillGap, 
  PlacedStudentOffer, 
  StudentCandidateProfile,
  User,
  CompanyDrive,
  JobApplication
} from '../types';
import { 
  tpoStats, 
  criticalSkillGaps, 
  recentOffersAccepted, 
  batchStudentProfiles 
} from '../data/mockData';
import { StudentProfileDossierModal } from './StudentProfileDossierModal';
import { PostgresAuditLogsView } from './PostgresAuditLogsView';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  GraduationCap,
  FileText,
  UserCheck,
  Eye,
  Briefcase,
  Code2,
  Lock,
  X,
  Database,
  PlusCircle,
  Clock,
  Loader2,
  Check,
  RefreshCw,
  Camera,
  User as UserIcon
} from 'lucide-react';

interface TPODashboardProps {
  adminUser: User;
  onOpenReport: () => void;
  onOpenProfileModal?: () => void;
}

export const TPODashboard: React.FC<TPODashboardProps> = ({ 
  adminUser, 
  onOpenReport,
  onOpenProfileModal,
}) => {
  if (adminUser.role !== 'admin') {
    return (
      <div className="p-12 text-center text-rose-600 font-bold bg-white border border-rose-200 rounded-3xl space-y-2 shadow-xs">
        <ShieldCheck className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <p className="text-base text-slate-900">Unauthorized Access</p>
        <p className="text-xs text-slate-500">Institutional placement analytics are restricted to administrative personnel.</p>
      </div>
    );
  }

  const [tpoSubTab, setTpoSubTab] = useState<'overview' | 'drives' | 'students' | 'shortlists' | 'skillgaps' | 'auditlogs'>('overview');
  const [stats, setStats] = useState<TPODashboardStats>(tpoStats);
  const [students, setStudents] = useState<StudentCandidateProfile[]>(batchStudentProfiles);
  const [gaps, setGaps] = useState<StudentSkillGap[]>(criticalSkillGaps);
  const [offers, setOffers] = useState<PlacedStudentOffer[]>(recentOffersAccepted);
  
  // Placement Drives & Applications
  const [drivesList, setDrivesList] = useState<CompanyDrive[]>([]);
  const [selectedDriveForApplicants, setSelectedDriveForApplicants] = useState<CompanyDrive | null>(null);
  const [driveApplicants, setDriveApplicants] = useState<JobApplication[]>([]);
  const [loadingDrives, setLoadingDrives] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

  // New Drive Modal State
  const [createDriveModalOpen, setCreateDriveModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newPackageLpa, setNewPackageLpa] = useState('24.0');
  const [newMinCgpa, setNewMinCgpa] = useState('8.0');
  const [newTier, setNewTier] = useState<'Super Dream' | 'Tier-1' | 'Tier-2'>('Tier-1');
  const [newSkills, setNewSkills] = useState('DSA, React, TypeScript, System Design');
  const [newLocation, setNewLocation] = useState('Bangalore / Hybrid');
  const [createDriveLoading, setCreateDriveLoading] = useState(false);

  // Student Directory Filters
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('All');
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');

  // Selected student for dossier modal
  const [inspectingStudent, setInspectingStudent] = useState<StudentCandidateProfile | null>(null);

  // Shortlist Criteria State
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [shortlistSuccess, setShortlistSuccess] = useState(false);
  const [shortlistCompany, setShortlistCompany] = useState('Google');
  const [shortlistMinCgpa, setShortlistMinCgpa] = useState('8.0');
  const [shortlistSkill, setShortlistSkill] = useState('DSA');

  // Fetch drives
  const loadDrives = async () => {
    setLoadingDrives(true);
    try {
      const res = await fetch('/api/drives');
      if (res.ok) {
        const data = await res.json();
        if (data.drives) {
          setDrivesList(data.drives);
          if (!selectedDriveForApplicants && data.drives.length > 0) {
            setSelectedDriveForApplicants(data.drives[0]);
            loadApplicantsForDrive(data.drives[0].id);
          }
        }
      }
    } catch (err) {
      console.warn('[TPODashboard] Failed to load drives:', err);
    } finally {
      setLoadingDrives(false);
    }
  };

  const loadApplicantsForDrive = async (driveId: number) => {
    setLoadingApplicants(true);
    try {
      const res = await fetch(`/api/applications/drive/${driveId}`);
      if (res.ok) {
        const data = await res.json();
        setDriveApplicants(data.applications || []);
      }
    } catch (err) {
      console.warn('[TPODashboard] Error fetching applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const handleCreateDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateDriveLoading(true);
    try {
      const driveCode = `${newCompanyName.slice(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
      const res = await fetch('/api/drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driveCode,
          companyName: newCompanyName,
          roleTitle: newRoleTitle,
          packageLpa: parseFloat(newPackageLpa) || 20.0,
          minCgpa: parseFloat(newMinCgpa) || 7.5,
          tier: newTier,
          skillsRequired: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
          location: newLocation,
          description: `Campus recruitment drive for ${newRoleTitle} at ${newCompanyName}.`,
          rounds: ['Online Assessment', 'Technical Interview 1', 'Bar Raiser / HR'],
        }),
      });

      if (res.ok) {
        setCreateDriveModalOpen(false);
        setNewCompanyName('');
        setNewRoleTitle('');
        await loadDrives();
      }
    } catch (err) {
      console.error('Failed to create drive:', err);
    } finally {
      setCreateDriveLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (appId: number, status: string, notes?: string) => {
    setStatusUpdatingId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (res.ok && selectedDriveForApplicants) {
        await loadApplicantsForDrive(selectedDriveForApplicants.id);
        await loadDrives();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter((std) => {
    const matchesSearch = 
      std.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      std.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      std.targetRole.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      std.primarySkills.some(s => s.toLowerCase().includes(studentSearchQuery.toLowerCase()));
    const matchesBranch = studentBranchFilter === 'All' || std.branch.includes(studentBranchFilter);
    const matchesStatus = studentStatusFilter === 'All' || std.placementStatus.includes(studentStatusFilter);
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleGenerateShortlist = () => {
    setShortlistSuccess(true);
    setTimeout(() => {
      setShortlistSuccess(false);
      setShortlistModalOpen(false);
    }, 1800);
  };

  const handleUpdateStudentNotes = (studentId: string, notes: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, tpoNotes: notes } : s))
    );
  };

  const handleToggleStudentVerification = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, tpoVerified: !s.tpoVerified } : s))
    );
  };

  const handleInspectStudentByName = (name: string) => {
    const found = students.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setInspectingStudent(found);
    } else {
      setInspectingStudent(students[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* TPO Administrative Bento Header */}
      <div 
        id="tpo-header-banner"
        className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-start sm:items-center gap-4">
          <motion.button
            type="button"
            id="btn-admin-avatar-edit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenProfileModal}
            title="Click to change TPO admin photo & profile"
            className="relative group shrink-0 rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <img
              src={adminUser.avatar}
              alt={adminUser.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-indigo-600 shadow-md shadow-indigo-500/20 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 bg-slate-900/30 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Camera className="w-5 h-5 drop-shadow-sm" />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
              <Camera className="w-2.5 h-2.5" />
            </span>
          </motion.button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{adminUser.name}</h1>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-indigo-600" />
                TPO Director Session
              </span>
              {onOpenProfileModal && (
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  Change Photo
                </button>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {adminUser.headline || 'Institutional placement director console. Inspect verified candidate profiles, manage live campus recruitment drives, and issue offer letters.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCreateDriveModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Campus Drive
          </button>

          <button
            id="btn-tpo-generate-shortlist"
            onClick={() => setShortlistModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Recruiter Shortlist Engine
          </button>

          <button
            id="btn-tpo-export-report"
            onClick={onOpenReport}
            className="px-4 py-2.5 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            Export TPO Report
          </button>
        </div>
      </div>

      {/* TPO Internal Navigation Pills with Live Hovering */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar shadow-2xs">
        {[
          { id: 'overview', label: 'Placement KPIs & Overview', icon: TrendingUp },
          { id: 'drives', label: 'Campus Drives & Applicant Queues', icon: Briefcase, badge: `${drivesList.length} Active Drives` },
          { id: 'students', label: 'Student Profiles & Directory', icon: Users, badge: `${students.length} Candidates` },
          { id: 'shortlists', label: 'Drive Shortlisting Engine', icon: Sparkles },
          { id: 'skillgaps', label: 'Batch Skill Gaps & Alerts', icon: AlertTriangle, badge: `${gaps.length} Action` },
          { id: 'auditlogs', label: 'PostgreSQL Session Audits', icon: Database, badge: 'Auth Logs' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = tpoSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTpoSubTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW VIEW */}
      {tpoSubTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Top Bento KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Students */}
            <div 
              id="kpi-total-students"
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registered</span>
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{stats.totalStudents}</p>
              <span className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {stats.totalStudentsGrowth}
              </span>
            </div>

            {/* Placed Percentage */}
            <div 
              id="kpi-placed-rate"
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placed Rate</span>
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{stats.placedPercentage}%</p>
              <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                854 / 1,248 candidates placed
              </span>
            </div>

            {/* Average Package */}
            <div 
              id="kpi-avg-package"
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average CTC</span>
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{stats.avgPackageLpa} LPA</p>
              <span className="text-[11px] text-sky-700 font-medium mt-1.5 block">
                Median: {stats.medianPackageLpa} LPA • Peak: 44.0 LPA
              </span>
            </div>

            {/* Top Recruiter */}
            <div 
              id="kpi-top-recruiter"
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Recruiter</span>
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-3 truncate">{stats.topRecruiter}</p>
              <span className="text-[11px] text-amber-700 font-semibold mt-1.5 block">
                {stats.topRecruiterOffers} Campus Offers Extended
              </span>
            </div>

          </div>

          {/* Main 2-Column Bento Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Batch Skill Readiness Breakdown (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-0.5">Cohort Competency</span>
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Batch Skill Readiness Analytics</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Aggregated from mock tests, coding assessments, and ATS scans</p>
                  </div>
                  <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                    2025 Batch
                  </span>
                </div>

                {/* Technical Skills Bars */}
                <div className="space-y-3.5 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">Core Technical Competencies:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {stats.techReadiness.map((item) => (
                      <div key={item.skill} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold text-slate-700">{item.skill}</span>
                          <span className="font-extrabold text-slate-900">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.percentage >= 75
                                ? 'bg-indigo-600'
                                : item.percentage >= 50
                                ? 'bg-sky-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soft Skills & Behavioral Bars */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block">Soft Skills &amp; Interview Etiquette:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {stats.softSkillsReadiness.slice(0, 3).map((item) => (
                      <div key={item.skill} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-colors">
                        <span className="text-xs font-semibold text-slate-600 block">{item.skill}</span>
                        <span className="text-sm font-extrabold text-sky-600 mt-0.5 block">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Critical Skill Gaps & Alerts (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Critical Skill Gaps Alert</h2>
                  </div>
                  <button 
                    onClick={() => setTpoSubTab('skillgaps')}
                    className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100"
                  >
                    View All
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Students identified with critical bottlenecks before upcoming tier-1 drives.
                </p>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {gaps.map((gap) => (
                    <div
                      key={gap.id}
                      className="p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-amber-300 hover:shadow-xs rounded-2xl transition-all flex items-center justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleInspectStudentByName(gap.studentName)}
                            className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 underline decoration-dotted"
                          >
                            {gap.studentName}
                          </button>
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            {gap.studentId} • {gap.branch}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {gap.gaps.map((g) => (
                            <span
                              key={g}
                              className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold rounded-full"
                            >
                              Gap: {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-700 block">{gap.avgScore}% avg</span>
                        <button
                          onClick={() => handleInspectStudentByName(gap.studentName)}
                          className="mt-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Inspect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Table: Recent Offers Accepted */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Campus Placement Offers</h2>
                <p className="text-xs text-slate-500 mt-0.5">Verified offers recorded in the University Placement Management System</p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setTpoSubTab('students')}
                  className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  View All Student Profiles
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/75">
                    <th className="py-3.5 px-4 rounded-l-2xl">Student Candidate</th>
                    <th className="py-3.5 px-4">Branch</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Role Offered</th>
                    <th className="py-3.5 px-4">Package (CTC)</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 rounded-r-2xl text-right">Dossier Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                            {offer.avatarInitials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{offer.studentName}</span>
                            <span className="text-[10px] text-slate-500">{offer.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{offer.branch}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{offer.company}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{offer.role}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-indigo-600">{offer.packageLpa} LPA</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{offer.date}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleInspectStudentByName(offer.studentName)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-all shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. CAMPUS PLACEMENT DRIVES & APPLICANTS QUEUE VIEW */}
      {tpoSubTab === 'drives' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Active Drives List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Campus Drives ({drivesList.length})</h2>
                    <p className="text-xs text-slate-500">Select a drive to review applicant queue</p>
                  </div>
                  <button
                    onClick={loadDrives}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                    title="Refresh Drives"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingDrives ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {drivesList.map((drive) => {
                    const isSelected = selectedDriveForApplicants?.id === drive.id;
                    return (
                      <div
                        key={drive.id}
                        onClick={() => {
                          setSelectedDriveForApplicants(drive);
                          loadApplicantsForDrive(drive.id);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                            : 'bg-slate-50 hover:bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                              {drive.driveCode} • {drive.tier}
                            </span>
                            <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{drive.companyName}</h3>
                            <p className="text-xs text-slate-600 font-medium">{drive.roleTitle}</p>
                          </div>
                          <span className="text-xs font-black text-indigo-600 shrink-0">₹{drive.packageLpa} LPA</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
                          <span>Min CGPA: <strong className="text-slate-800">{drive.minCgpa}</strong></span>
                          <span className="px-2 py-0.5 bg-white text-indigo-700 rounded-md border border-indigo-100 font-bold">
                            {drive.applicantCount || 0} Applicants
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Selected Drive Applicant Queue & Pipeline Review (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                {selectedDriveForApplicants ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                            {selectedDriveForApplicants.driveCode}
                          </span>
                          <h2 className="text-base font-extrabold text-slate-900">
                            {selectedDriveForApplicants.companyName} — Applicant Queue
                          </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {selectedDriveForApplicants.roleTitle} • ₹{selectedDriveForApplicants.packageLpa} LPA CTC • Cutoff: {selectedDriveForApplicants.minCgpa} CGPA
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadApplicantsForDrive(selectedDriveForApplicants.id)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingApplicants ? 'animate-spin' : ''}`} />
                          Sync Pipeline
                        </button>
                      </div>
                    </div>

                    {loadingApplicants ? (
                      <div className="py-16 text-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
                        <p className="text-xs">Fetching candidate applications from PostgreSQL database...</p>
                      </div>
                    ) : driveApplicants.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 space-y-2">
                        <Users className="w-10 h-10 mx-auto text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">No applicants in queue yet</p>
                        <p className="text-xs">Students will appear here as soon as they submit one-click applications.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                        {driveApplicants.map((app) => (
                          <div
                            key={app.id}
                            className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 transition-all space-y-3 shadow-2xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xs font-extrabold text-slate-900">{app.studentName}</h3>
                                  <span className="text-[11px] text-slate-500 font-mono">({app.studentBranch})</span>
                                </div>
                                <p className="text-[11px] text-slate-500">{app.studentEmail}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded-md">
                                  CGPA: {app.studentCgpa}
                                </span>
                                <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                                  ATS: {app.atsScore || 85}%
                                </span>
                                <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase ${
                                  app.status === 'OFFERED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.status === 'SHORTLISTED'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : app.status === 'REJECTED'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                            </div>

                            {/* TPO Workflow Status Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                              <span className="text-[10px] text-slate-400">
                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'SHORTLISTED', 'Qualified screening filter')}
                                  disabled={statusUpdatingId === app.id}
                                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Shortlist
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'INTERVIEW_SCHEDULED', 'Technical Round 1 Scheduled')}
                                  disabled={statusUpdatingId === app.id}
                                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Schedule Interview
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'OFFERED', 'Campus Placement Letter Issued')}
                                  disabled={statusUpdatingId === app.id}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer shadow-2xs"
                                >
                                  Extend Offer
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'REJECTED', 'Did not meet criteria')}
                                  disabled={statusUpdatingId === app.id}
                                  className="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-16 text-center text-slate-400">
                    <p className="text-xs">Select a campus placement drive on the left to inspect applicant pipeline.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. STUDENT DIRECTORY & PROFILES VIEW */}
      {tpoSubTab === 'students' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-extrabold text-slate-900">Batch Student Directory &amp; Profiles</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Institutional Candidate Directory. Inspect individual student academic records, ATS resumes, coding profiles, and application statuses.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, roll no, skill..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-52 sm:w-64"
                />
              </div>

              <select
                value={studentBranchFilter}
                onChange={(e) => setStudentBranchFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="All">All Branches</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Tech</option>
                <option value="Electronics">Electronics</option>
              </select>

              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="In Process">Eligible - In Process</option>
                <option value="Dream Offer">Placed - Dream Offer</option>
                <option value="Core">Placed - Core</option>
                <option value="Action Required">Action Required</option>
              </select>
            </div>
          </div>

          {/* Student Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((std) => (
              <div
                key={std.id}
                className="p-5 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 rounded-3xl space-y-4 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-indigo-200 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{std.name}</h3>
                        <p className="text-[11px] text-slate-500 font-mono">{std.rollNo} • {std.batch}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                      std.placementStatus.includes('Dream')
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : std.placementStatus.includes('Placed')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : std.placementStatus.includes('Action')
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {std.placementStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-1">
                    {std.branch}
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">CGPA</span>
                      <span className="text-xs font-black text-slate-900">{std.cgpa}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">ATS Score</span>
                      <span className="text-xs font-black text-indigo-600">{std.resumeATSScore}%</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">DSA Solved</span>
                      <span className="text-xs font-black text-sky-600">{std.codingStats.totalSolved}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {std.primarySkills.slice(0, 3).map((sk) => (
                      <span key={sk} className="px-2 py-0.5 bg-slate-50 text-slate-700 text-[10px] font-medium rounded-lg border border-slate-200">
                        {sk}
                      </span>
                    ))}
                    {std.primarySkills.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-200">
                        +{std.primarySkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Inspect Profile Dossier CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    {std.tpoVerified ? (
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => setInspectingStudent(std)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 3. RECRUITER SHORTLISTING ENGINE VIEW */}
      {tpoSubTab === 'shortlists' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-extrabold text-slate-900">Automated Recruiter Shortlisting Engine</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Filter and compile verified candidate dossiers according to corporate eligibility criteria.
              </p>
            </div>

            <button
              onClick={() => setShortlistModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Configure New Drive Shortlist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 rounded-3xl space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Google SDE-1 Pool</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Active Drive</span>
              </div>
              <p className="text-xs text-slate-600">Criteria: CGPA &ge; 8.0, Solved &ge; 350 DSA, 0 Backlogs</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-indigo-600 font-extrabold">48 Shortlisted</span>
                <button 
                  onClick={() => setInspectingStudent(students[0])}
                  className="text-slate-600 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors"
                >
                  View Candidates <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 rounded-3xl space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Amazon SDE-1 OA</span>
                <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold border border-sky-200">OA Dispatched</span>
              </div>
              <p className="text-xs text-slate-600">Criteria: CGPA &ge; 7.5, Python / Java proficiencies</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-indigo-600 font-extrabold">82 Shortlisted</span>
                <button 
                  onClick={() => setInspectingStudent(students[0])}
                  className="text-slate-600 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors"
                >
                  View Candidates <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 rounded-3xl space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Microsoft Solutions</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">Shortlisting</span>
              </div>
              <p className="text-xs text-slate-600">Criteria: CGPA &ge; 8.5, Cloud / System Architecture</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-indigo-600 font-extrabold">34 Shortlisted</span>
                <button 
                  onClick={() => setInspectingStudent(students[3])}
                  className="text-slate-600 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors"
                >
                  View Candidates <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BATCH SKILL GAPS VIEW */}
      {tpoSubTab === 'skillgaps' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-extrabold text-slate-900">Critical Batch Skill Gap Interventions</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Diagnostic reports highlighting students with preparation bottlenecks prior to Tier-1 recruiters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className="p-5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xs rounded-3xl space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{gap.studentName}</h3>
                    <p className="text-xs text-slate-500 font-mono">{gap.studentId} • {gap.branch}</p>
                  </div>
                  <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                    {gap.avgScore}% Readiness
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block">Identified Weak Areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {gap.gaps.map((g) => (
                      <span key={g} className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button
                    onClick={() => handleInspectStudentByName(gap.studentName)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Candidate Profile
                  </button>

                  <button
                    onClick={() => alert(`Assigned custom remedial sprint module to ${gap.studentName}`)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                  >
                    <Send className="w-3 h-3" />
                    Assign Remedial Sprint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. POSTGRESQL SESSION AUDITS VIEW */}
      {tpoSubTab === 'auditlogs' && (
        <div className="animate-in fade-in duration-200">
          <PostgresAuditLogsView />
        </div>
      )}

      {/* Recruiter Shortlist Generator Modal */}
      {shortlistModalOpen && (
        <div 
          id="modal-shortlist-generator"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShortlistModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Generate Recruiter Shortlist</h3>
              </div>
              <button 
                onClick={() => setShortlistModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {shortlistSuccess ? (
              <div className="p-6 text-center space-y-2 text-emerald-600">
                <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                <p className="font-extrabold text-slate-900 text-base">Shortlist Generated &amp; Dispatched!</p>
                <p className="text-xs text-slate-600">48 eligible candidate profiles compiled for {shortlistCompany}.</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Target Recruiter:</label>
                  <select
                    value={shortlistCompany}
                    onChange={(e) => setShortlistCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Google">Google (SDE L3)</option>
                    <option value="Amazon">Amazon (SDE-1)</option>
                    <option value="Microsoft">Microsoft (Solutions Architect)</option>
                    <option value="Atlassian">Atlassian (Full Stack)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Minimum CGPA Cutoff:</label>
                    <input
                      type="text"
                      value={shortlistMinCgpa}
                      onChange={(e) => setShortlistMinCgpa(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Mandatory Skill:</label>
                    <select
                      value={shortlistSkill}
                      onChange={(e) => setShortlistSkill(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="DSA">Data Structures &amp; Algorithms</option>
                      <option value="Python">Python / FastAPI</option>
                      <option value="React">React / TypeScript</option>
                      <option value="System Design">System Design</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-slate-700">
                  <p>Estimated Matches: <strong className="text-indigo-700">48 Candidates</strong> (including Alex Mercer, CGPA 8.84).</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShortlistModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateShortlist}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Compile &amp; Export Shortlist
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Campus Placement Drive Modal */}
      {createDriveModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setCreateDriveModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Post New Campus Recruitment Drive</h3>
                  <p className="text-xs text-slate-500">Publish eligibility criteria, compensation, and rounds to the student portal</p>
                </div>
              </div>
              <button 
                onClick={() => setCreateDriveModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDriveSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adobe Systems"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Member of Technical Staff"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="28.0"
                    value={newPackageLpa}
                    onChange={(e) => setNewPackageLpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="10.0"
                    required
                    placeholder="8.0"
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Drive Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Super Dream">Super Dream (40+ LPA)</option>
                    <option value="Tier-1">Tier-1 (20-40 LPA)</option>
                    <option value="Tier-2">Tier-2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Mandatory Skills (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="DSA, C++, React, System Design"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Job Location / Model</label>
                <input
                  type="text"
                  required
                  placeholder="Bangalore / Hybrid"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateDriveModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createDriveLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-70"
                >
                  {createDriveLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      Publish Campus Drive
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Dossier Inspection Modal */}
      <StudentProfileDossierModal
        student={inspectingStudent}
        adminUser={adminUser}
        onClose={() => setInspectingStudent(null)}
        onUpdateNotes={handleUpdateStudentNotes}
        onToggleVerification={handleToggleStudentVerification}
      />

    </div>
  );
};
