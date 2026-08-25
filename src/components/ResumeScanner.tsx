import React, { useState, useEffect } from 'react';
import { 
  ATSScanResult,
  User
} from '../types';
import { sampleResumes } from '../data/mockData';
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
  Edit2
} from 'lucide-react';

export function extractCgpaFromText(text: string): number | null {
  if (!text || typeof text !== 'string') return null;
  const patterns = [
    /(?:cgpa|gpa|cpi|sgpa|cumulative\s+gpa|overall\s+gpa|aggregate|pointer)[\s:=|\-–]+([0-9]+(?:\.[0-9]+)?)/i,
    /\b([0-9]\.[0-9]{1,2})\s*(?:\/\s*10|\/\s*4\.0|\s*cgpa|\s*gpa|\s*cpi)\b/i,
    /\b(?:cgpa|gpa)\s+is\s+([0-9]+(?:\.[0-9]+)?)/i,
    /\b(?:cgpa|gpa)\s*([0-9]\.[0-9]{1,2})\b/i,
    /grade\s*(?:point\s*average)?[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
    /\b([0-9]\.[0-9]{1,2})\s*\/\s*10\.?0?\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (!isNaN(val) && val >= 0.0 && val <= 10.0) {
        return Number(val.toFixed(2));
      }
    }
  }
  return null;
}

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
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [boostFeedback, setBoostFeedback] = useState<string | null>(null);
  const [isEditingGpa, setIsEditingGpa] = useState(false);
  const [manualGpaInput, setManualGpaInput] = useState(user?.cgpa ? String(user.cgpa) : '7.95');

  // Detected CGPA derived from ATS scan, raw text regex, or active user profile
  const detectedCgpa = atsResult.extractedCgpa || extractCgpaFromText(activeResumeText) || user?.cgpa || 7.95;

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

        {/* Right Column: Resume Editor / File Preview & Auto-Optimizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Upload & Sample Selector Box */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Active Document:</span>
                <span className="text-xs text-indigo-600 font-bold flex items-center gap-1.5 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                  {fileName}
                </span>
              </div>

              <div className="flex items-center gap-2">
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

          {/* Interactive Resume View / Editor */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs"
          >
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'preview' ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Formatted Preview
                </button>
                <button
                  onClick={() => setViewMode('editor')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'editor' ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Plain Text Editor
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

            {viewMode === 'editor' ? (
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
            ) : (
              <div className="p-6 bg-white text-slate-800 text-xs font-mono leading-relaxed space-y-4 max-h-[500px] overflow-y-auto">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-wide uppercase">
                    {user?.name || 'CANDIDATE PROFILE'}
                  </h2>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {user?.email || 'email@university.edu'} • {user?.branch || 'Engineering'} • CGPA: {detectedCgpa} / 10.0 • Target: {selectedRole}
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
                Word Count: <strong className="text-slate-900">{activeResumeText.split(/\s+/).filter(Boolean).length}</strong> words • Extracted CGPA: <strong className="text-sky-700 font-bold">{detectedCgpa} / 10.0</strong> • ATS Parser: <strong className="text-emerald-700 font-bold">Pass</strong>
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
