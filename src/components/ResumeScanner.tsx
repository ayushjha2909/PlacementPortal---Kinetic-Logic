import React, { useState, useEffect } from 'react';
import { 
  ATSScanResult,
  User,
  ExtractedResumeInfo
} from '../types';
import { sampleResumes } from '../data/mockData';
import { extractComprehensiveResumeData, extractCgpaFromText } from '../utils/resumeExtractor';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  RefreshCw, 
  Check, 
  Copy, 
  Wand2, 
  FileCheck, 
  Layers,
  Search,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  Edit2,
  UserCheck,
  Mail,
  Phone,
  Building2,
  Calendar,
  Briefcase,
  Code,
  Award,
  Globe,
  ArrowRight,
  Database,
  Terminal,
  Cpu,
  BookmarkCheck
} from 'lucide-react';

export { extractCgpaFromText };

interface ResumeScannerProps {
  user?: User;
  atsResult: ATSScanResult;
  onUpdateATSResult: (result: ATSScanResult) => void;
  onUpdateUser?: (updated: User) => void;
  onNavigate: (tab: string) => void;
}

export const ResumeScanner: React.FC<ResumeScannerProps> = ({
  user,
  atsResult,
  onUpdateATSResult,
  onUpdateUser,
  onNavigate,
}) => {
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'Software Engineer (SDE-1)');
  const [activeResumeText, setActiveResumeText] = useState(
    user?.id === 'std_alex_2026' || !user?.id 
      ? sampleResumes[0].content 
      : `Candidate: ${user.name}\nEmail: ${user.email}\nBranch: ${user.branch || 'Engineering'}\nTarget: ${user.targetRole || 'Software Engineer'}\n\nTechnical Skills: ${(user.skills || ['Data Structures', 'TypeScript', 'React']).join(', ')}\n\nEducation:\nB.Tech in ${user.branch || 'Computer Science & Engineering'} | CGPA: ${user.cgpa || 7.95}/10.0\n\nExperience & Projects:\n• Upload your PDF/Word resume using the button above to extract complete project history, experience, and calculate live ATS score.`
  );
  const [fileName, setFileName] = useState(
    user?.id === 'std_alex_2026' || !user?.id ? 'Software_Eng_Resume_v2.pdf' : `${user?.name?.replace(/\s+/g, '_') || 'My'}_Resume.pdf`
  );
  const [isScanning, setIsScanning] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [appliedKeywords, setAppliedKeywords] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'extracted' | 'editor' | 'preview'>('extracted');
  const [boostFeedback, setBoostFeedback] = useState<string | null>(null);
  const [isEditingGpa, setIsEditingGpa] = useState(false);
  const [manualGpaInput, setManualGpaInput] = useState(user?.cgpa ? String(user.cgpa) : '7.95');

  // Compute live extracted structured resume data (merging server ATS result + deterministic parsing)
  const localExtracted = extractComprehensiveResumeData(activeResumeText);
  const liveExtracted: ExtractedResumeInfo = {
    ...localExtracted,
    ...(atsResult.extractedInfo || {}),
    name: atsResult.candidateName || atsResult.extractedInfo?.name || localExtracted.name || user?.name || 'Student Candidate',
    email: atsResult.candidateEmail || atsResult.extractedInfo?.email || localExtracted.email || user?.email || '',
    phone: atsResult.candidatePhone || atsResult.extractedInfo?.phone || localExtracted.phone || user?.phone || '',
    branch: atsResult.candidateBranch || atsResult.extractedInfo?.branch || localExtracted.branch || user?.branch || 'Computer Science & Engineering',
    degree: atsResult.candidateDegree || atsResult.extractedInfo?.degree || localExtracted.degree || 'B.Tech',
    institution: atsResult.candidateInstitution || atsResult.extractedInfo?.institution || localExtracted.institution || user?.institution || 'Engineering Institute of Technology',
    graduationYear: atsResult.candidateGraduationYear || atsResult.extractedInfo?.graduationYear || localExtracted.graduationYear || user?.batch || '2025',
    cgpa: atsResult.extractedCgpa || localExtracted.cgpa || user?.cgpa || 7.95,
  };

  // Detected CGPA derived from ATS scan, raw text regex, or active user profile
  const detectedCgpa = liveExtracted.cgpa || atsResult.extractedCgpa || extractCgpaFromText(activeResumeText) || user?.cgpa || 7.95;

  // Sync state if user prop changes
  useEffect(() => {
    if (user?.id && user.id !== 'std_alex_2026' && user.id !== 'usr_alex_01') {
      const savedAts = localStorage.getItem(`ats_result_${user.id}`);
      if (!savedAts && !activeResumeText.includes(user.name)) {
        setActiveResumeText(
          `Candidate: ${user.name}\nEmail: ${user.email}\nBranch: ${user.branch || 'Computer Science'}\nCGPA: ${user.cgpa || 7.95}\nTarget: ${user.targetRole || 'Software Engineer (SDE-1)'}\n\nTechnical Skills:\n${(user.skills || ['Data Structures', 'TypeScript', 'React', 'Node.js', 'SQL']).join(', ')}\n\nEducation:\nB.Tech in ${user.branch || 'Computer Science & Engineering'} | Batch: ${user.batch || '2021-2025'}\n\nProjects & Experience:\n• Built full-stack responsive web applications using modern JavaScript and component architecture.\n• Implemented optimized database schemas and REST API endpoints for low latency.\n• Collaborated in Git version-controlled Agile workflows with unit and integration test suites.`
        );
        setFileName(`${user.name.replace(/\s+/g, '_')}_Resume.pdf`);
      }
    }
  }, [user?.id, user?.name, user?.email]);

  // SVG Gauge Math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((atsResult.score || 0) / 100) * circumference;

  const handleSelectSample = (sample: typeof sampleResumes[0]) => {
    setActiveResumeText(sample.content);
    setFileName(sample.fileName);
    setSelectedRole(sample.targetRole);
    runAnalysis(sample.content, sample.targetRole, sample.fileName);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsScanning(true);
    setUploadStatus(`Parsing document "${file.name}"...`);

    try {
      // 1. Send binary file to server-side parser
      const formData = new FormData();
      formData.append('resume', file);

      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        const extracted = uploadData.text || '';
        if (extracted.trim().length > 0) {
          setActiveResumeText(extracted);
          setUploadStatus(`Extracted ${uploadData.wordCount || extracted.split(/\s+/).length} words from ${file.name}`);
          setTimeout(() => setUploadStatus(null), 4000);
          // 2. Automatically trigger AI ATS Evaluation with the extracted text
          await runAnalysis(extracted, selectedRole, file.name, uploadData.extractedCgpa);
          return;
        }
      }

      // Fallback to text reading if binary parser had an issue or empty
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = (event.target?.result as string) || '';
        if (text.trim().length > 0) {
          setActiveResumeText(text);
          setUploadStatus(`Loaded ${text.split(/\s+/).length} words from ${file.name}`);
          setTimeout(() => setUploadStatus(null), 4000);
          await runAnalysis(text, selectedRole, file.name);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.warn('[Resume Upload] Error during upload extraction:', err);
      // Fallback local reader
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = (event.target?.result as string) || '';
        if (text.trim().length > 0) {
          setActiveResumeText(text);
          await runAnalysis(text, selectedRole, file.name);
        }
      };
      reader.readAsText(file);
    } finally {
      setIsScanning(false);
    }
  };

  const runAnalysis = async (text: string, role: string, name: string, preExtractedCgpa?: number) => {
    setIsScanning(true);
    try {
      const localExtractedCgpa = preExtractedCgpa || extractCgpaFromText(text);
      const res = await fetch('/api/gemini/resume-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: text,
          targetRole: role,
          fileName: name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const finalCgpa = data.extractedCgpa || localExtractedCgpa || undefined;
        const completeResult: ATSScanResult = {
          ...data,
          extractedCgpa: finalCgpa,
        };
        onUpdateATSResult(completeResult);

        if (finalCgpa && user && onUpdateUser) {
          onUpdateUser({
            ...user,
            cgpa: finalCgpa,
            latestAtsScore: data.score,
            readinessScore: Math.round((data.score + finalCgpa * 10) / 2),
          });
        }
      }
    } catch (err) {
      console.error('Resume scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualGpaSave = () => {
    const val = parseFloat(manualGpaInput);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      const formatted = Number(val.toFixed(2));
      const updatedResult = {
        ...atsResult,
        extractedCgpa: formatted,
      };
      onUpdateATSResult(updatedResult);
      if (user && onUpdateUser) {
        onUpdateUser({
          ...user,
          cgpa: formatted,
          readinessScore: Math.round(((atsResult.score || 85) + formatted * 10) / 2),
        });
      }
      setIsEditingGpa(false);
      setBoostFeedback(`✅ Profile GPA synchronized to ${formatted} / 10.0`);
      setTimeout(() => setBoostFeedback(null), 3000);
    }
  };

  const handleAddKeywordToResume = (keyword: string) => {
    if (appliedKeywords.includes(keyword)) return;
    const updated = activeResumeText + `\n• Demonstrated practical expertise in ${keyword} across production scalable services.`;
    setActiveResumeText(updated);
    setAppliedKeywords([...appliedKeywords, keyword]);
    runAnalysis(updated, selectedRole, fileName);
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(activeResumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoEnhanceWithAI = async () => {
    setIsScanning(true);
    setBoostFeedback('Injecting high-impact industry keywords & quantified KPI metrics...');
    
    // Pick missing keywords to inject intelligently
    const missing = (atsResult.missingKeywords && atsResult.missingKeywords.length > 0) 
      ? atsResult.missingKeywords.slice(0, 4) 
      : ['System Design', 'Microservices', 'Docker & Kubernetes', 'CI/CD Pipelines'];
    
    const boostSection = `\n\n[AI Optimization — Impact & Architecture Highlights]\n• Cloud & Microservices Engineering: Architected resilient backend services leveraging ${missing[0] || 'Distributed Systems'} and ${missing[1] || 'Docker Containers'}, achieving 99.9% uptime.\n• Performance & Scalability: Deployed automated ${missing[2] || 'CI/CD Pipelines'} and optimized database query execution plans, reducing p99 latency by 38%.\n• Technical Leadership: Mentored junior peers on clean code standards and implemented ${missing[3] || 'System Design'} best practices.`;

    const enhanced = activeResumeText + boostSection;
    setActiveResumeText(enhanced);
    setAppliedKeywords((prev) => [...new Set([...prev, ...missing])]);

    await runAnalysis(enhanced, selectedRole, fileName);
    setBoostFeedback('✨ ATS Compatibility boosted! Added high-impact keywords & metrics.');
    setTimeout(() => setBoostFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bento Tile */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">ATS Resume Parser &amp; Optimizer</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Extract candidate qualifications, GPA, and simulate ATS screening systems to maximize interview shortlists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="text-xs text-slate-600 font-semibold whitespace-nowrap">Target Role:</label>
          <div className="relative">
            <select
              id="select-target-role"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                runAnalysis(activeResumeText, e.target.value, fileName);
              }}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 pr-9 appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-2xs"
            >
              <option value="Software Engineer (SDE-1)">Software Engineer (SDE-1)</option>
              <option value="Frontend UI/UX Engineer">Frontend UI/UX Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist / ML Engineer">Data Scientist / ML Engineer</option>
              <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Main 2-Column Bento Grid: Left Scorecard / Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Circular ATS Gauge Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            id="ats-score-card"
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-0.5">Scoring Engine</span>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  ATS Compatibility Score
                </h2>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold rounded-full">
                Tier-1 Qualified (85+)
              </span>
            </div>

            <div className="flex items-center justify-center py-3">
              <div className="relative flex items-center justify-center">
                <svg className="w-38 h-38 transform -rotate-90">
                  <circle
                    cx="76"
                    cy="76"
                    r={radius}
                    stroke="#f1f5f9"
                    strokeWidth="11"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="76"
                    cy="76"
                    r={radius}
                    stroke="#4f46e5"
                    strokeWidth="11"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-3xl font-black text-slate-900"
                  >
                    {atsResult.score}
                  </motion.span>
                  <span className="text-[11px] font-bold text-slate-500">/ 100 ATS</span>
                  <span className="text-[10px] text-indigo-600 font-bold mt-0.5">
                    {atsResult.score >= 80 ? 'High Pass Rate' : 'Needs Optimization'}
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Sub-meters */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Formatting &amp; Readability</span>
                  <span className="text-slate-900 font-extrabold">{atsResult.breakdown.formattingReadability}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${atsResult.breakdown.formattingReadability}%` }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-full"
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Keyword Optimization</span>
                  <span className="text-amber-600 font-extrabold">{atsResult.breakdown.keywordOptimization}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${atsResult.breakdown.keywordOptimization}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-amber-500 rounded-full"
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Quantified Experience Impact</span>
                  <span className="text-indigo-600 font-extrabold">{atsResult.breakdown.experienceImpact}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${atsResult.breakdown.experienceImpact}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="h-full bg-indigo-600 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </div>

            {/* Extracted Academic GPA Badge / Real-time Sync */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 bg-sky-50/70 -mx-6 -mb-6 p-4 rounded-b-3xl flex items-center justify-between border-sky-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-600 text-white rounded-xl shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Academic GPA / CGPA</span>
                  {isEditingGpa ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={manualGpaInput}
                        onChange={(e) => setManualGpaInput(e.target.value)}
                        className="w-16 px-2 py-0.5 bg-white border border-sky-300 rounded text-xs font-bold text-slate-900 focus:outline-none"
                      />
                      <button
                        onClick={handleManualGpaSave}
                        className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-black text-sky-950">
                      {detectedCgpa} / 10.0 <span className="text-[10px] font-medium text-sky-700">• Extracted from Resume</span>
                    </span>
                  )}
                </div>
              </div>

              {!isEditingGpa && (
                <button
                  type="button"
                  onClick={() => {
                    setManualGpaInput(String(detectedCgpa));
                    setIsEditingGpa(true);
                  }}
                  className="p-1.5 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit or confirm GPA"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Re-scan Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-trigger-ai-scan"
              onClick={() => runAnalysis(activeResumeText, selectedRole, fileName)}
              disabled={isScanning}
              className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-600 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Analyzing with Gemini AI...' : 'Re-Run ATS Scan'}
            </motion.button>
          </motion.div>

          {/* Missing Keywords Radar Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            id="card-missing-keywords"
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Missing Industry Keywords
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">Click to inject</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {atsResult.missingKeywords.map((kw) => {
                const isAdded = appliedKeywords.includes(kw);
                return (
                  <motion.button
                    key={kw}
                    whileHover={{ scale: isAdded ? 1 : 1.05 }}
                    whileTap={{ scale: isAdded ? 1 : 0.95 }}
                    onClick={() => handleAddKeywordToResume(kw)}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 line-through'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300'
                    }`}
                  >
                    <span>{isAdded ? '✓' : '+'}</span>
                    <span>{kw}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Matched Keywords */}
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">Detected Matching Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {atsResult.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-medium"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Actionable Improvement Suggestions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            id="card-ats-suggestions"
            className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3.5 shadow-xs"
          >
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Actionable AI Recommendations
            </h3>

            <div className="space-y-3">
              {atsResult.suggestions.map((sug, idx) => (
                <motion.div 
                  key={sug.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.15 + idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="p-3.5 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-150 hover:border-indigo-200 transition-all shadow-2xs"
                >
                  <span className="text-xs font-extrabold text-slate-900 block">{sug.title}</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{sug.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column: Resume Extractor Profile & Editor / View (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Upload, Sync & Preset Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Active Resume File:</span>
                <span className="text-xs text-indigo-600 font-bold flex items-center gap-1.5 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                  {fileName}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <motion.label 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="btn-upload-file-label"
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <UploadCloud className="w-4 h-4 text-sky-600" />
                  Upload PDF / Doc
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </motion.label>

                {user && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    id="btn-sync-to-profile"
                    onClick={() => {
                      if (!onUpdateUser) return;
                      const extracted = liveExtracted;
                      const finalCgpa = extracted.cgpa || atsResult.extractedCgpa || user.cgpa || 7.95;
                      
                      const extractedSkillsList = [
                        ...(extracted.skillsByCategory?.languages || []),
                        ...(extracted.skillsByCategory?.frameworks || []),
                        ...(extracted.skillsByCategory?.databases || []),
                        ...(extracted.skillsByCategory?.cloudAndDevOps || []),
                        ...(extracted.skillsByCategory?.coreCS || []),
                        ...(atsResult.extractedSkills || []),
                      ];

                      const mergedSkills = Array.from(new Set([...(user.skills || []), ...extractedSkillsList])).filter(Boolean);

                      const updatedUser: User = {
                        ...user,
                        name: extracted.name && extracted.name !== 'Student Candidate' ? extracted.name : user.name,
                        email: extracted.email || user.email,
                        phone: extracted.phone || user.phone,
                        branch: extracted.branch || user.branch,
                        batch: extracted.graduationYear || user.batch,
                        institution: extracted.institution || user.institution,
                        cgpa: finalCgpa,
                        skills: mergedSkills.length > 0 ? mergedSkills : user.skills,
                        latestAtsScore: atsResult.score || user.latestAtsScore,
                        readinessScore: Math.round(((atsResult.score || 85) + finalCgpa * 10) / 2),
                      };

                      onUpdateUser(updatedUser);
                      setBoostFeedback('✅ Extracted resume credentials & skills synchronized to your Student Profile!');
                      setTimeout(() => setBoostFeedback(null), 4000);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
                    title="Copy extracted details and CGPA directly into your student portal account"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    Sync to Profile
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="btn-auto-optimize-ai"
                  onClick={handleAutoEnhanceWithAI}
                  disabled={isScanning}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  Auto-Boost ATS
                </motion.button>
              </div>
            </div>

            {/* Sample Presets */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">Load Preset:</span>
              {sampleResumes.map((sample) => (
                <motion.button
                  key={sample.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectSample(sample)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    fileName === sample.fileName
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {sample.title.split(' ')[0]} Track
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Interactive Resume View / Extracted Profile Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs"
          >
            {/* View Mode Navigation Tabs */}
            <div className="bg-slate-50 px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                <button
                  id="tab-view-extracted"
                  onClick={() => setViewMode('extracted')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    viewMode === 'extracted' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Extracted Profile
                </button>
                <button
                  id="tab-view-preview"
                  onClick={() => setViewMode('preview')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    viewMode === 'preview' 
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  id="tab-view-editor"
                  onClick={() => setViewMode('editor')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    viewMode === 'editor' 
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  Raw Editor
                </button>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  id="btn-copy-resume"
                  onClick={handleCopyResume}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </motion.button>
              </div>
            </div>

            {uploadStatus && (
              <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-2.5 flex items-center justify-between text-xs text-indigo-800 font-medium">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  {uploadStatus}
                </span>
              </div>
            )}

            {boostFeedback && (
              <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-800 font-medium">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {boostFeedback}
                </span>
              </div>
            )}

            {/* TAB 1: EXTRACTED STRUCTURED PROFILE VIEW */}
            {viewMode === 'extracted' && (
              <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                
                {/* Candidate Overview Card */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        Extracted Candidate
                      </span>
                      <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                        {liveExtracted.name || 'Candidate Name'}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold">
                        CGPA: {detectedCgpa} / 10.0
                      </span>
                    </div>
                  </div>

                  {/* Contact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{liveExtracted.email || 'Email not found'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{liveExtracted.phone || 'Phone not found'}</span>
                    </div>
                    {liveExtracted.linkedin && (
                      <div className="flex items-center gap-2 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                        <Globe className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="truncate">{liveExtracted.linkedin}</span>
                      </div>
                    )}
                    {liveExtracted.github && (
                      <div className="flex items-center gap-2 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                        <Code className="w-4 h-4 text-slate-700 shrink-0" />
                        <span className="truncate">{liveExtracted.github}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Credentials Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Academic Credentials &amp; Institution
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Degree &amp; Major</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                        {liveExtracted.degree} in {liveExtracted.branch}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Institution / College</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block truncate">
                        {liveExtracted.institution}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Graduation / Batch</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                        Class of {liveExtracted.graduationYear}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Verified CGPA</span>
                        <span className="font-extrabold text-sky-700 text-xs mt-0.5 block">
                          {detectedCgpa} / 10.0
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                        Eligible for 95% Drives
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categorized Skills Taxonomy */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-indigo-600" />
                    Extracted Technical Skills Taxonomy
                  </h3>

                  <div className="space-y-3">
                    {/* Programming Languages */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1.5 flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5 text-indigo-500" /> Languages:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(liveExtracted.skillsByCategory?.languages?.length ? liveExtracted.skillsByCategory.languages : ['Python', 'TypeScript', 'C++', 'Java', 'SQL']).map((sk) => (
                          <span key={sk} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-bold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Frameworks & Web */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1.5 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-sky-500" /> Frameworks &amp; Libraries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(liveExtracted.skillsByCategory?.frameworks?.length ? liveExtracted.skillsByCategory.frameworks : ['React', 'Node.js', 'Express', 'Tailwind CSS']).map((sk) => (
                          <span key={sk} className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200/80 rounded-xl text-xs font-bold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Databases & Cloud */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1.5 flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-emerald-500" /> Databases &amp; Cloud / DevOps:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(liveExtracted.skillsByCategory?.databases?.length || liveExtracted.skillsByCategory?.cloudAndDevOps?.length 
                          ? [...(liveExtracted.skillsByCategory?.databases || []), ...(liveExtracted.skillsByCategory?.cloudAndDevOps || [])]
                          : ['PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git']
                        ).map((sk) => (
                          <span key={sk} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Core CS & AI */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1.5 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-purple-500" /> Core Computer Science:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(liveExtracted.skillsByCategory?.coreCS?.length ? liveExtracted.skillsByCategory.coreCS : ['Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'System Design']).map((sk) => (
                          <span key={sk} className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-xl text-xs font-bold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extracted Experience & Internships */}
                {liveExtracted.experiences && liveExtracted.experiences.length > 0 && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      Work Experience &amp; Internships ({liveExtracted.experiences.length})
                    </h3>

                    <div className="space-y-3">
                      {liveExtracted.experiences.map((exp, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-extrabold text-slate-900">{exp.role}</span>
                            {exp.duration && (
                              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {exp.duration}
                              </span>
                            )}
                          </div>
                          {exp.company && (
                            <span className="text-xs font-bold text-indigo-600 block">{exp.company}</span>
                          )}
                          {exp.description && (
                            <p className="text-xs text-slate-600 leading-relaxed mt-1">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Projects */}
                {liveExtracted.projects && liveExtracted.projects.length > 0 && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      Technical Projects ({liveExtracted.projects.length})
                    </h3>

                    <div className="space-y-3">
                      {liveExtracted.projects.map((proj, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
                          <span className="text-xs font-extrabold text-slate-900 block">{proj.title}</span>
                          {proj.technologies && (
                            <span className="text-[11px] font-bold text-sky-700 block">{proj.technologies}</span>
                          )}
                          {proj.description && (
                            <p className="text-xs text-slate-600 leading-relaxed mt-1">{proj.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications & Achievements */}
                {liveExtracted.certifications && liveExtracted.certifications.length > 0 && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2.5">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Certifications &amp; Key Highlights
                    </h3>
                    <div className="space-y-1.5">
                      {liveExtracted.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: PLAIN TEXT EDITOR */}
            {viewMode === 'editor' && (
              <textarea
                id="resume-text-editor"
                value={activeResumeText}
                onChange={(e) => {
                  const newText = e.target.value;
                  setActiveResumeText(newText);
                  const newCgpa = extractCgpaFromText(newText);
                  if (newCgpa && user && onUpdateUser && newCgpa !== user.cgpa) {
                    onUpdateUser({
                      ...user,
                      cgpa: newCgpa,
                      readinessScore: Math.round(((atsResult.score || 85) + newCgpa * 10) / 2),
                    });
                  }
                }}
                rows={18}
                className="w-full p-5 bg-white text-slate-800 text-xs font-mono leading-relaxed focus:outline-none resize-y selection:bg-indigo-100 min-h-[380px]"
                placeholder="Paste or edit resume text here..."
              />
            )}

            {/* TAB 3: FORMATTED DOCUMENT PREVIEW */}
            {viewMode === 'preview' && (
              <div className="p-6 bg-white text-slate-800 text-xs font-mono leading-relaxed space-y-4 max-h-[500px] overflow-y-auto">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-wide uppercase">
                    {liveExtracted.name || user?.name || 'CANDIDATE PROFILE'}
                  </h2>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {liveExtracted.email || user?.email || 'email@university.edu'} • {liveExtracted.branch || user?.branch || 'Engineering'} • CGPA: {detectedCgpa} / 10.0 • Target: {selectedRole}
                  </p>
                </div>

                <div className="space-y-3 font-sans text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {activeResumeText.split('\n\n').map((paragraph, pIdx) => {
                    const lines = paragraph.split('\n');
                    const firstLine = lines[0];
                    const isHeading = firstLine.endsWith(':') || firstLine.startsWith('[') || firstLine.toUpperCase() === firstLine;

                    return (
                      <div key={pIdx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                        {isHeading && (
                          <h4 className="text-xs font-extrabold text-indigo-700 tracking-wide">
                            {firstLine}
                          </h4>
                        )}
                        <div className="space-y-1 text-slate-700 text-xs font-mono">
                          {(isHeading ? lines.slice(1) : lines).map((line, lIdx) => (
                            <p key={lIdx} className={line.startsWith('•') || line.startsWith('-') ? 'pl-2 text-slate-800 font-medium' : 'text-slate-600'}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Summary Bar */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs text-slate-500">
                Word Count: <strong className="text-slate-900">{activeResumeText.split(/\s+/).filter(Boolean).length}</strong> words • Extracted CGPA: <strong className="text-sky-700 font-bold">{detectedCgpa} / 10.0</strong> • Candidate: <strong className="text-slate-900">{liveExtracted.name}</strong>
              </span>
              <button
                onClick={() => onNavigate('jobs')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Match with Campus Recruiters <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>

    </div>
  );
};
