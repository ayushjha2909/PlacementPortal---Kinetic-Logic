import React from 'react';
import { 
  User, 
  JobOpening, 
  TimelineEvent, 
  ATSScanResult 
} from '../types';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Bot, 
  FileText, 
  Mic, 
  Code2, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  Building2, 
  AlertCircle,
  Download,
  GraduationCap,
  Briefcase,
  Target,
  Zap,
  Camera,
  User as UserIcon
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  atsResult: ATSScanResult;
  jobs: JobOpening[];
  timeline: TimelineEvent[];
  onNavigate: (tab: string) => void;
  onApplyJob: (job: JobOpening) => void;
  onOpenReport: () => void;
  onOpenProfileModal?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  atsResult,
  jobs,
  timeline,
  onNavigate,
  onApplyJob,
  onOpenReport,
  onOpenProfileModal,
}) => {
  // SVG circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const currentScore = atsResult?.score || 0;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  // Dynamic eligibility tier based on active candidate CGPA and ATS/Readiness score
  const eligibilityTier = 
    (user.cgpa && user.cgpa >= 8.5 && (currentScore >= 75 || (user.readinessScore || 0) >= 75))
      ? { label: 'Super Dream Eligible (15+ LPA)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      : (user.cgpa && user.cgpa >= 7.5)
      ? { label: 'Dream Tier Eligible (8-14 LPA)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
      : { label: 'Core Placement Track (5-8 LPA)', color: 'bg-blue-50 text-blue-700 border-blue-200' };

  // Read active candidate coding profile problems to dynamically adjust proficiencies
  const savedProfilesRaw = typeof window !== 'undefined' ? localStorage.getItem(`coding_profiles_${user.id}`) : null;
  let userProfiles: any[] = [];
  try {
    if (savedProfilesRaw) userProfiles = JSON.parse(savedProfilesRaw);
  } catch {}

  const totalProblemsSolved = userProfiles.reduce((acc, p) => acc + (p.stats?.totalSolved || 0), 0);

  // Derive dynamic proficiencies from user.skills, coding stats and ATS keywords
  const baseSkills = (user.skills && user.skills.length > 0) 
    ? user.skills 
    : ['Data Structures & Algorithms', 'TypeScript & React', 'Node.js & Backend', 'SQL & Databases', 'System Design'];
  
  const techProficiencies = baseSkills.slice(0, 5).map((skillName, idx) => {
    const isMatchedInResume = atsResult.matchedKeywords?.some(
      (k) => k.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(k.toLowerCase())
    );
    
    let score = 70;
    if (totalProblemsSolved > 400) score += 20;
    else if (totalProblemsSolved > 200) score += 14;
    else if (totalProblemsSolved > 50) score += 8;

    if (isMatchedInResume) score += 6;
    if (idx === 0) score += 5; // Primary skill bonus
    if (idx === 1) score += 2;

    const finalScore = Math.min(96, Math.max(50, score - (idx * 3)));
    
    let category = 'Technical Skill';
    if (/react|vue|angular|frontend|html|css|typescript|javascript/i.test(skillName)) category = 'Frontend';
    else if (/python|node|java|golang|backend|c\+\+|express|fastapi|django/i.test(skillName)) category = 'Backend';
    else if (/data structures|algorithm|dsa|problem solving|competitive/i.test(skillName)) category = 'Problem Solving';
    else if (/sql|database|postgres|mongodb|redis|prisma/i.test(skillName)) category = 'Databases';
    else if (/system design|distributed|docker|kubernetes|aws|cloud/i.test(skillName)) category = 'Architecture';

    return {
      name: skillName,
      score: finalScore,
      category,
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Bento Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        id="student-hero-banner"
        className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-slate-300"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <motion.button 
              type="button"
              id="btn-student-avatar-edit"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={onOpenProfileModal}
              title="Click to change profile picture & details"
              className="relative group shrink-0 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-indigo-500/80 shadow-xs group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-slate-900/30 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Camera className="w-5 h-5 drop-shadow-sm" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                <Camera className="w-2.5 h-2.5" />
              </span>
            </motion.button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Welcome back, {user.name}
                </h1>
                <span className={`px-2.5 py-0.5 border text-xs font-semibold rounded-full flex items-center gap-1 ${eligibilityTier.color}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {eligibilityTier.label}
                </span>
                {onOpenProfileModal && (
                  <button
                    type="button"
                    onClick={onOpenProfileModal}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    Change Picture
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3.5 mt-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  {user.branch}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">CGPA: {user.cgpa} / 10.0</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">Batch: {user.batch}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-quick-ats-scan"
              onClick={() => onNavigate('resume')}
              className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Scan Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-quick-mock"
              onClick={() => onNavigate('mock')}
              className="flex-1 md:flex-none px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-600" />
              Start Mock
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              id="btn-download-readiness"
              onClick={onOpenReport}
              className="px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-medium hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
              title="Download Readiness Summary"
            >
              <Download className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid: 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Bento Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Bento Tile 1: ATS Readiness Circular Gauge Card */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            id="card-ats-gauge"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">ATS Analytics</span>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Resume Readiness Score
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Target: {user.targetRole || 'Software Engineer (SDE-1)'}</p>
              </div>
              <button
                onClick={() => onNavigate('resume')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Breakdown <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="#f1f5f9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="#4f46e5"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="text-3xl font-extrabold text-slate-900"
                  >
                    {atsResult?.score || 0}
                  </motion.span>
                  <span className="text-[10px] font-semibold text-slate-400">/ 100 ATS</span>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <TrendingUp className="w-3 h-3 text-emerald-600" /> Active
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 mt-2 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Format</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">{atsResult?.breakdown?.formattingReadability || 0}%</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Keywords</span>
                <span className="text-xs font-bold text-amber-600 mt-0.5 block">{atsResult?.breakdown?.keywordOptimization || 0}%</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Impact</span>
                <span className="text-xs font-bold text-indigo-600 mt-0.5 block">{atsResult?.breakdown?.experienceImpact || 0}%</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Tile 2: Technical Proficiency Bars */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            id="card-tech-proficiency"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-0.5">Benchmark</span>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Skill Proficiency Matrix</h2>
              </div>
              <button
                onClick={() => onNavigate('coding')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Practice Code <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {techProficiencies.map((skill, idx) => (
                <div key={skill.name} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{skill.name}</span>
                    <span className="font-bold text-slate-900">{skill.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 0.6, delay: 0.05 + idx * 0.05, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        skill.score >= 85
                          ? 'bg-indigo-600'
                          : skill.score >= 75
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                      }`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Tile 3: AI Mentor Daily Strategy Highlight */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            id="card-mentor-tip"
            className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden shadow-2xs group"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">
                    AI Mentor Strategy
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">RAG Grounded</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  "Google's upcoming online assessment heavily prioritizes <strong className="text-indigo-950 font-semibold">Dynamic Programming</strong> &amp; <strong className="text-indigo-950 font-semibold">Binary Trees</strong>. Revisit LRU Cache and Graph BFS algorithms today."
                </p>
                <button
                  onClick={() => onNavigate('mentor')}
                  className="pt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Ask AI Mentor Follow-up <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Bento Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Bento Tile 4: Top Matched Campus Openings */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            id="card-top-matches"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">Recruiter Radar</span>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Matched Companies</h2>
                <p className="text-xs text-slate-500 mt-0.5">Matched using verified skills, CGPA {user.cgpa}, &amp; ATS resume keywords</p>
              </div>
              <button
                onClick={() => onNavigate('jobs')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All ({jobs.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + idx * 0.05 }}
                  id={`job-card-${job.id}`}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-white transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: job.logoColor || '#3b82f6' }}
                    >
                      {job.logoLetter}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {job.role}
                        </h3>
                        {job.status && (
                          <span className="px-2 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold rounded-md">
                            {job.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-800">{job.company}</span>
                        <span className="text-slate-300">•</span>
                        <span>{job.location}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-indigo-600 font-bold">{job.packageLpa} LPA</span>
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-semibold rounded-md">
                          {job.matchPercentage}% Match ({job.matchBasis})
                        </span>
                        {job.missingSkill && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium rounded-md">
                            Gap: {job.missingSkill}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <motion.button
                      whileHover={{ scale: job.applied ? 1 : 1.02 }}
                      whileTap={{ scale: job.applied ? 1 : 0.98 }}
                      id={`btn-apply-${job.id}`}
                      onClick={() => onApplyJob(job)}
                      disabled={job.applied}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        job.applied
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                      }`}
                    >
                      {job.applied ? 'Applied ✓' : 'Quick Apply'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bento Tile 5: Placement Timeline & Scheduled Events */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            id="card-timeline"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">Live Roadmap</span>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Upcoming Placement Schedule
                </h2>
              </div>
              <span className="text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Campus TPO Feed
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((item, idx) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + idx * 0.04 }}
                  className="relative group"
                >
                  <div 
                    className={`absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full border-2 border-white ${
                      item.isLive ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-indigo-600'
                    }`}
                  ></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </span>
                        {item.isLive && (
                          <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase rounded-md border border-emerald-200">
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{item.subtitle}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 shrink-0 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {item.timeLabel}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bento Tile 6: Quick Action Bento Dock with Live Hovering */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('resume')}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">Optimize Resume</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">ATS keyword booster</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('mock')}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/5 text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-200">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 block group-hover:text-sky-600 transition-colors">HR / Tech Mock</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">STAR method feedback</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('coding')}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-600 transition-colors">Daily DSA Problem</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">LRU Cache &amp; Graphs</span>
            </motion.button>
          </div>

        </div>

      </div>

    </div>
  );
};
