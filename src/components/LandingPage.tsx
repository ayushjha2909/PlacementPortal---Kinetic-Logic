import React, { useState } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useSpring, 
  useTransform 
} from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Bot, 
  Mic, 
  Code2, 
  Briefcase, 
  BarChart3, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Star, 
  Cpu, 
  ChevronRight, 
  Search, 
  Award,
  Zap,
  Globe,
  Layers,
  Lock,
  Play,
  RotateCcw,
  Volume2,
  Terminal,
  Activity,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { User, Role } from '../types';
import { currentUser, adminUser } from '../data/mockData';

interface LandingPageProps {
  onOpenAuth: (initialMode?: 'login' | 'register', initialRole?: Role) => void;
  onDirectDemoLogin: (user: User) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onDirectDemoLogin,
}) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'ats' | 'mentor' | 'mock' | 'coding' | 'drives' | 'tpo'>('ats');

  // Interactive Live Playground inside the Landing Page
  const [demoScanRunning, setDemoScanRunning] = useState(false);
  const [demoScanScore, setDemoScanScore] = useState<number>(86);
  const [demoActiveSnippet, setDemoActiveSnippet] = useState<'optimized' | 'raw'>('optimized');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const stats = [
    { label: 'Campus Placement Rate', value: '98.4%', sub: 'Across 2026 Batch', icon: TrendingUp },
    { label: 'Highest Tier Package', value: '₹44.0 LPA', sub: 'International SDE Role', icon: Award },
    { label: 'Average CTC Offered', value: '₹14.8 LPA', sub: 'Tech & Product Cohort', icon: Briefcase },
    { label: 'Active Hiring Partners', value: '180+', sub: 'Fortune 500 & Unicorns', icon: Building2 },
  ];

  const recruitingPartners = [
    { name: 'Google', tier: 'Tier-1 Super Dream', logoText: 'G', color: '#4285F4' },
    { name: 'Amazon', tier: 'Tier-1 Super Dream', logoText: 'A', color: '#FF9900' },
    { name: 'Microsoft', tier: 'Tier-1 Super Dream', logoText: 'M', color: '#00A4EF' },
    { name: 'Atlassian', tier: 'Tier-1 Dream', logoText: 'At', color: '#0052CC' },
    { name: 'Uber', tier: 'Tier-1 Super Dream', logoText: 'U', color: '#000000' },
    { name: 'Adobe', tier: 'Tier-1 Dream', logoText: 'Ad', color: '#FF0000' },
    { name: 'Oracle', tier: 'Tier-1 Core Tech', logoText: 'O', color: '#F80000' },
    { name: 'Salesforce', tier: 'Tier-1 Super Dream', logoText: 'SF', color: '#00A1E0' },
  ];

  const featureTabs = [
    {
      id: 'ats',
      label: 'ATS Resume Intelligence',
      icon: FileText,
      tag: 'Score 85+',
      title: 'Smart ATS Keyword Matcher & Metric Booster',
      desc: 'Instant deep-scan of candidate resumes against tier-1 job descriptions. Flags missing high-impact technical keywords, verifies quantifiable action metrics, and generates tailored PDF reports.',
      metrics: ['Formatting & Readability: 92/100', 'Keyword Optimization: 84/100', 'Quantified Experience Impact: 78/100'],
      previewHighlights: [
        { label: 'Extracted Skills', val: 'TypeScript, React 19, Redis, AWS, Distributed Systems' },
        { label: 'Role Alignment', val: 'Software Development Engineer II (94% Fit)' },
        { label: 'Missing Keywords', val: 'gRPC, Kafka, CI/CD Pipeline Telemetry' }
      ]
    },
    {
      id: 'mentor',
      label: 'AI Placement Mentor',
      icon: Bot,
      tag: 'RAG Grounded',
      title: 'RAG Grounded Recruiter Dossiers & STAR Method Framework',
      desc: 'Interactive 24/7 AI mentor trained on real company round archives, leadership principles (Amazon, Google, Microsoft), and institutional placement guidelines.',
      metrics: ['Amazon STAR Templates', 'System Design Checklists', 'Placement Policy FAQs'],
      previewHighlights: [
        { label: 'Recruiter Target', val: 'Amazon SDE II (Difficulty: 85% Very Hard)' },
        { label: 'Core Principle', val: 'Customer Obsession & Disagree and Commit' },
        { label: 'Suggested Drill', val: 'Design a distributed LRU cache with O(1) ops' }
      ]
    },
    {
      id: 'mock',
      label: 'AI Mock Interviews',
      icon: Mic,
      tag: 'Voice & Text',
      title: 'Live Voice & Text Simulation with Real-time Rubric Scorecards',
      desc: 'Simulate high-pressure behavioral and technical interviews. Delivers immediate feedback on STAR compliance, communication clarity, and 95+ model answers.',
      metrics: ['Voice Synthesized Questions', 'Countdown Pressure Timer', 'Instant 95+ Model Responses'],
      previewHighlights: [
        { label: 'Active Question', val: '"Tell me about a time you took a calculated risk and failed."' },
        { label: 'Evaluation Output', val: 'Score 84/100 • Strong Trade-off Identification' },
        { label: 'Key Recommendation', val: 'Add exact quantified telemetry numbers to the Result' }
      ]
    },
    {
      id: 'coding',
      label: 'Coding & DSA Analytics',
      icon: Code2,
      tag: '690+ Problems',
      title: 'Multi-Platform DSA Sync & Live Code Judge',
      desc: 'Integrated coding arena with curated campus placement problems, live TypeScript/Python execution, and cross-platform profile synchronizer for LeetCode, Codeforces, and GeeksforGeeks.',
      metrics: ['342 LeetCode Solved (1,842 Rating)', '184 GeeksforGeeks Solved', '165 Coding Ninjas Solved'],
      previewHighlights: [
        { label: 'Curated Topics', val: 'Dynamic Programming, Graph DFS/BFS, Tries, Sliding Window' },
        { label: 'Live Test Runner', val: 'Passed 3/3 hidden test suites in 42ms' },
        { label: 'Verified Global Rank', val: 'Top 6.8% Campus Cohort' }
      ]
    },
    {
      id: 'drives',
      label: 'Recruitment Drives',
      icon: Briefcase,
      tag: '1-Click Apply',
      title: 'Real-Time Campus Drives & Verified 1-Click Application',
      desc: 'Explore active on-campus recruitment drives with automatic eligibility verification (CGPA, branch, backlogs) and instant dispatch of ATS-verified resumes to hiring coordinators.',
      metrics: ['Real-Time Application Status', 'Dream & Super Dream Policy Enforcement', 'Direct Coordinator Routing'],
      previewHighlights: [
        { label: 'Live Super Dream', val: 'Amazon Web Services — ₹32.0 LPA CTC' },
        { label: 'Candidate Fit', val: '88% Match • Meets 8.0 CGPA Threshold' },
        { label: 'Application Status', val: 'Shortlisted for Round 1 Assessment' }
      ]
    },
    {
      id: 'tpo',
      label: 'TPO Institutional Hub',
      icon: BarChart3,
      tag: 'Admin Console',
      title: 'Director-Level Cohort Analytics & Candidate Dossiers',
      desc: 'Comprehensive placement office management suite. Track university-wide hiring funnels, review student readiness dossiers, verify academic compliance, and generate audit-ready placement reports.',
      metrics: ['310/315 Total Registered', '98.4% Placement Rate', '42 Active Campus Drives'],
      previewHighlights: [
        { label: 'Cohort Monitoring', val: 'Computer Science, IT, Electronics & AI Departments' },
        { label: 'Readiness Dossiers', val: 'Full student breakdown with LeetCode & ATS score' },
        { label: 'One Student One Job', val: 'Automated policy enforcement for Dream offers' }
      ]
    },
  ];

  const currentFeature = featureTabs.find(f => f.id === activeFeatureTab) || featureTabs[0];

  const workflowSteps = [
    {
      step: '01',
      title: 'Profile & ATS Optimization',
      desc: 'Upload your resume for instant AI parsing, keyword alignment, and ATS scoring against top tech standards.',
      badge: '92% Average Score'
    },
    {
      step: '02',
      title: 'AI Practice & Mock Drills',
      desc: 'Engage with the 24/7 AI Placement Mentor and run voice-enabled mock interviews using the STAR framework.',
      badge: 'STAR Method'
    },
    {
      step: '03',
      title: '1-Click Campus Applications',
      desc: 'Apply to verified campus drives from Amazon, Google, Microsoft with automated eligibility checks.',
      badge: 'Zero Friction'
    },
    {
      step: '04',
      title: 'Offer Tracking & TPO Audit',
      desc: 'Track stage-by-stage shortlists and access certified institutional readiness dossiers.',
      badge: 'Direct Dispatch'
    }
  ];

  const faqs = [
    {
      q: 'How does the ATS Resume Scanner evaluate candidate profiles?',
      a: 'The ATS engine parses technical skills, leadership action verbs, and quantifiable impact metrics from your uploaded PDF, benchmarking them directly against Tier-1 job descriptions to pinpoint missing high-priority keywords.'
    },
    {
      q: 'What is the "One Student One Job" and Dream Offer policy engine?',
      a: 'Our TPO engine automatically enforces university placement policies. Once a candidate secures an offer, higher CTC thresholds ("Dream" or "Super Dream" tiers) are automatically verified before allowing further applications.'
    },
    {
      q: 'Can I test the platform without registering?',
      a: 'Yes! Click the 1-Click Instant Demo buttons (Alex Mercer for Student Candidate or Dr. Vikramaditya for TPO Director) to jump straight into the full interactive sandboxes without password barriers.'
    },
    {
      q: 'How realistic is the AI Mock Interview system?',
      a: 'The mock simulator provides real-time speech-to-text response tracking, timing pressure, leadership principle rubric scoring, and generates instant 95+ model STAR answers to guide improvements.'
    }
  ];

  const handleTriggerSimulatedScan = () => {
    setDemoScanRunning(true);
    setDemoScanScore(72);
    setTimeout(() => {
      setDemoScanScore(94);
      setDemoScanRunning(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Top Floating Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo with micro-hover animation */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/25">
              KP
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-2">
                Placement Hub
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                  v2.4 Live
                </span>
              </span>
              <span className="text-xs text-slate-500 block -mt-0.5 font-medium">
                Campus Placement Preparation &amp; Recruitment Ecosystem
              </span>
            </div>
          </motion.div>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#interactive-demo" className="hover:text-indigo-600 transition-colors">Live Simulation</a>
            <a href="#features-matrix" className="hover:text-indigo-600 transition-colors">Platform Modules</a>
            <a href="#workflow-section" className="hover:text-indigo-600 transition-colors">Preparation Lifecycle</a>
            <a href="#recruiter-partners" className="hover:text-indigo-600 transition-colors">Hiring Partners</a>
            <a href="#faq-section" className="hover:text-indigo-600 transition-colors">FAQs</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              id="landing-btn-login"
              onClick={() => onOpenAuth('login', 'student')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold rounded-2xl border border-slate-200 transition-all shadow-2xs"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              id="landing-btn-register"
              onClick={() => onOpenAuth('register', 'student')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-sm shadow-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Register Candidate</span>
            </motion.button>
          </div>

        </div>
      </header>

      {/* Hero Section with Staggered Entrance and Floating Badges */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-200/80 bg-white">
        
        {/* Subtle Decorative Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-50/80 via-slate-50/40 to-transparent pointer-events-none -z-10"></div>
        
        {/* Floating Ambient Badges */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden xl:flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl shadow-lg shadow-slate-900/5 absolute top-28 left-8 text-xs font-bold text-slate-800 z-10"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[11px]">
            ✓
          </div>
          <div>
            <span className="block font-bold">ATS Score: 94/100</span>
            <span className="text-[10px] text-slate-400">Target: Amazon SDE II</span>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden xl:flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl shadow-lg shadow-slate-900/5 absolute top-40 right-10 text-xs font-bold text-slate-800 z-10"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-[11px]">
            ★
          </div>
          <div>
            <span className="block font-bold">Super Dream Shortlist</span>
            <span className="text-[10px] text-slate-400">₹32 LPA Verified</span>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top Pill Animated */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Next-Generation University Placement &amp; Career Acceleration Platform</span>
          </motion.div>

          {/* Main Display Headline with Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Elevate Your Campus Career from <span className="text-indigo-600 bg-clip-text">Preparation</span> to <span className="text-slate-900 underline decoration-indigo-300 decoration-wavy">Dream Offer</span>.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              An all-in-one ecosystem uniting AI-powered ATS resume parsing, STAR behavioral interview simulation, live coding judges, and institutional TPO placement drive orchestration.
            </p>
          </motion.div>

          {/* Quick Action Button Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="hero-cta-register"
              onClick={() => onOpenAuth('register', 'student')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <span>Create Candidate Account</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="hero-cta-login"
              onClick={() => onOpenAuth('login', 'student')}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-extrabold rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300"
            >
              Sign In to Existing Portal
            </motion.button>
          </motion.div>

          {/* Instant One-Click Demo Personas Bar with Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-6 max-w-2xl mx-auto"
          >
            <div className="p-4 bg-slate-50/90 border border-slate-200/90 rounded-3xl shadow-xs space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Instant One-Click Demo Access (No password required)
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="btn-demo-student"
                  onClick={() => onDirectDemoLogin(currentUser)}
                  className="p-3.5 bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all duration-200 group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      Alex Mercer (Student)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    8.84 CGPA • ATS Score 85 • 5 Campus Drives
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="btn-demo-tpo"
                  onClick={() => onDirectDemoLogin(adminUser)}
                  className="p-3.5 bg-white hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 rounded-2xl text-left transition-all duration-200 group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      Dr. Vikramaditya (TPO Director)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Institutional Console • 315 Students • 98.4% Placed
                  </p>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Key University Placement Metrics Strip with Scroll Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 max-w-5xl mx-auto"
          >
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <motion.div 
                  key={i}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs hover:border-indigo-300 transition-all hover:shadow-sm text-left relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {st.value}
                  </div>
                  <div className="text-xs font-bold text-indigo-700 mt-1">
                    {st.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {st.sub}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* Interactive Live Playground Simulation Showcase */}
      <section id="interactive-demo" className="py-16 bg-slate-100/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-2"
          >
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Try It Live
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Experience the Real-Time ATS Intelligence Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click below to simulate real-time keyword parsing, metric boosting, and ATS scoring in action.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md max-w-4xl mx-auto space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">Candidate Sample Resume: Alex_Mercer_SDE_2026.pdf</span>
                  <span className="text-[11px] text-slate-500">Benchmark Role: Amazon SDE II (Distributed Systems)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerSimulatedScan}
                  disabled={demoScanRunning}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-500/20 active:scale-95 cursor-pointer"
                >
                  {demoScanRunning ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deep Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Deep ATS Scan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Visual Score Meter and Real-time Keyword Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Score Dial / Visual Meter (5 cols) */}
              <div className="md:col-span-5 p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Calculated ATS Compatibility
                </span>
                
                <div className="relative inline-flex items-center justify-center">
                  <div className="text-4xl sm:text-5xl font-black text-indigo-600 tracking-tight">
                    {demoScanScore}%
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${demoScanScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-indigo-600 rounded-full"
                  />
                </div>

                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 py-1 px-3 rounded-xl border border-emerald-200 inline-block">
                  {demoScanScore >= 85 ? '✓ Meets Tier-1 Super Dream Cutoff' : '⚠ Action Items Required'}
                </div>
              </div>

              {/* Keyword & Metric Highlights (7 cols) */}
              <div className="md:col-span-7 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Keyword Extraction Telemetry:</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button 
                      onClick={() => setDemoActiveSnippet('optimized')} 
                      className={`px-2 py-0.5 rounded-lg font-bold ${demoActiveSnippet === 'optimized' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                    >
                      AI Optimized
                    </button>
                    <button 
                      onClick={() => setDemoActiveSnippet('raw')} 
                      className={`px-2 py-0.5 rounded-lg font-bold ${demoActiveSnippet === 'raw' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                    >
                      Raw Input
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {demoActiveSnippet === 'optimized' ? (
                    <motion.div
                      key="opt"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2"
                    >
                      <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Quantified Result Applied (Google XYZ Formula)</span>
                      </div>
                      <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                        "Architected distributed cache using Redis &amp; TypeScript, decreasing p99 API latency by 42% across 2.4M daily requests."
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="raw"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2"
                    >
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Generic Baseline Statement (Unquantified)</span>
                      </div>
                      <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                        "Worked on backend caching and made APIs run much faster for user queries."
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Formatting</span>
                    <span className="text-slate-900 text-xs">95/100</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Keywords</span>
                    <span className="text-slate-900 text-xs">92/100</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Impact Metrics</span>
                    <span className="text-slate-900 text-xs">94/100</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Recruiter Partners Marquee with Hover Lift */}
      <section id="recruiter-partners" className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Trusted by Premier Technology Recruiter Networks
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              Active On-Campus Hiring Partners &amp; Super-Dream Recruiters
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            {recruitingPartners.map((c, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
              >
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-2xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: c.color }}
                >
                  {c.logoText}
                </div>
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {c.name}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold truncate w-full">
                  {c.tier}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Platform Feature Showcase Tabs */}
      <section id="features-matrix" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Interactive System Modules
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              A Complete Suite Engineered for High-Yield Placements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Explore how every capability within the Placement Portal interacts to prepare, verify, and match students with high-tier career opportunities.
            </p>
          </motion.div>

          {/* Module Selector Pill Bar with Smooth Transitions */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isCurrent = tab.id === activeFeatureTab;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id={`btn-feature-tab-${tab.id}`}
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                    isCurrent ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {tab.tag}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Active Module Showcase Card with Animated Presence */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentFeature.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Details (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                        Module Spotlight
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">• Live in Candidate Portal</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {currentFeature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentFeature.desc}
                    </p>
                  </div>

                  {/* Bullets / Metrics */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Core Capabilities &amp; Highlights:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentFeature.metrics.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Launch CTA */}
                  <div className="pt-2 flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onDirectDemoLogin(currentUser)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-sm shadow-indigo-500/20"
                    >
                      <span>Test Drive in Student Sandbox</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                    <button
                      onClick={() => onOpenAuth('register', 'student')}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-2xl transition-all"
                    >
                      Sign Up to Access
                    </button>
                  </div>
                </div>

                {/* Right Live Preview Box (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <currentFeature.icon className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">{currentFeature.label} Snapshot</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Live Verified
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {currentFeature.previewHighlights.map((hl, i) => (
                      <div key={i} className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          {hl.label}
                        </span>
                        <span className="text-slate-900 font-bold block leading-relaxed">
                          {hl.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Real-time data synchronization enabled across student &amp; TPO dashboards.</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* Step-by-Step Preparation Lifecycle with Staggered Scroll Animation */}
      <section id="workflow-section" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Candidates Navigate from Day 1 to Super-Dream Offers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A structured 4-step engineering roadmap designed to maximize candidate interview performance and placement conversion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((wf, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center border border-indigo-200 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {wf.step}
                  </span>
                  <span className="text-[10px] font-bold bg-white text-indigo-600 px-2 py-0.5 rounded-full border border-slate-200">
                    {wf.badge}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {wf.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {wf.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* For Students vs For TPO Overview with Motion */}
      <section id="tpo-overview" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
              Two Tailored Experiences
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for Both Candidates and University Placement Offices
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Role-based access ensures students get personalized career acceleration tools while faculty administrators have full institutional oversight.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Student Persona Card */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">For Student Candidates</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Achieve complete technical, algorithmic, and behavioral interview readiness. Match your profile with live recruitment drives and apply with pre-verified ATS credentials.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ATS Resume Scoring:</strong> Instant keyword gap diagnostics and 85+ score benchmarks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>AI Mock Simulator:</strong> Practice voice/text rounds with live STAR rubric scoring.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>1-Click Applications:</strong> Direct routing to campus hiring coordinators with live status tracking.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onOpenAuth('register', 'student')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-sm shadow-indigo-500/25"
                >
                  <span>Register as Student</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <button
                  onClick={() => onDirectDemoLogin(currentUser)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                >
                  Try Student Demo &rarr;
                </button>
              </div>
            </motion.div>

            {/* TPO Admin Card */}
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">For TPO Directors &amp; Faculty</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Streamline university placement drives, verify student eligibility compliance, track multi-round hiring funnels, and export institutional placement dossiers.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Cohort Analytics:</strong> Live visibility into department-wise placement rates and package metrics.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Policy Automation:</strong> Enforce "One Student One Job" and Dream Offer thresholds automatically.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Student Dossiers:</strong> Review complete candidate profiles with LeetCode stats in read-only mode.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onOpenAuth('login', 'admin')}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-sm shadow-sky-600/25"
                >
                  <span>Sign In as TPO Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <button
                  onClick={() => onDirectDemoLogin(adminUser)}
                  className="text-xs text-sky-600 hover:text-sky-800 font-bold hover:underline"
                >
                  Try TPO Demo &rarr;
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Interactive Animated FAQs Accordion Section */}
      <section id="faq-section" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Everything You Need to Know
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 hover:bg-slate-100/60 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Bottom Conversion CTA Banner */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg shadow-indigo-500/30"
          >
            KP
          </motion.div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to Begin Your Placement Preparation Journey?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Register candidate account or sign in to access personalized ATS resume optimization, AI mock interviews, and live campus recruitment drives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenAuth('register', 'student')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register Candidate Now</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenAuth('login', 'student')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold rounded-2xl border border-slate-700"
            >
              Sign In to Existing Account
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
              KP
            </div>
            <span className="font-bold text-slate-800 text-xs">PlacementPortal</span>
            <span className="text-slate-300">•</span>
            <span>University Career Services &amp; Recruitment Management System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 text-[11px] font-medium">
            <button 
              onClick={() => onOpenAuth('login', 'student')} 
              className="hover:text-indigo-600 transition-colors hover:underline"
            >
              Student Portal
            </button>
            <span className="text-slate-300">•</span>
            <button 
              onClick={() => onOpenAuth('login', 'admin')} 
              className="hover:text-indigo-600 transition-colors hover:underline"
            >
              TPO Placement Office
            </button>
            <span className="text-slate-300">•</span>
            <button 
              onClick={() => onOpenAuth('register', 'student')} 
              className="hover:text-indigo-600 transition-colors hover:underline"
            >
              New Registration
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
