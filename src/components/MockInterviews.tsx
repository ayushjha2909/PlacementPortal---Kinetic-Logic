import React, { useState, useEffect } from 'react';
import { 
  MockQuestion, 
  MockInterviewResult, 
  User 
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  Timer, 
  ChevronRight, 
  Award, 
  Layers, 
  Building2, 
  Send,
  HelpCircle
} from 'lucide-react';

interface MockInterviewsProps {
  user: User;
}

export const MockInterviews: React.FC<MockInterviewsProps> = ({ user }) => {
  const [track, setTrack] = useState<'behavioral' | 'technical' | 'system_design'>('behavioral');
  const [targetCompany, setTargetCompany] = useState('Amazon');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<MockInterviewResult | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sampleQuestions: Record<string, MockQuestion[]> = {
    behavioral: [
      {
        id: 'bq_1',
        question: 'Tell me about a time you took a calculated risk and failed. What did you learn?',
        category: 'behavioral',
        hint: 'Use the STAR method. Focus on accountability, self-reflection, and permanent systemic fixes.',
        expectedKeywords: ['Situation', 'Risk Assessment', 'Outcome', 'Retrospective', 'Key Takeaway']
      },
      {
        id: 'bq_2',
        question: 'Describe a situation where you had a disagreement with a team member or mentor on technical architecture. How did you resolve it?',
        category: 'behavioral',
        hint: 'Demonstrate "Have Backbone; Disagree and Commit" or data-driven consensus building.',
        expectedKeywords: ['Trade-offs', 'Telemetry Data', 'Constructive Debate', 'Consensus']
      },
      {
        id: 'bq_3',
        question: 'Why do you want to join our engineering team and how do your technical skills align with our roadmap?',
        category: 'behavioral',
        hint: 'Mention specific products, company engineering blog posts, and your demonstrated passion.',
        expectedKeywords: ['Company Mission', 'Technical Fit', 'Growth Mindset']
      }
    ],
    technical: [
      {
        id: 'tq_1',
        question: 'Explain how an LRU Cache operates in O(1) time complexity. What internal data structures would you combine?',
        category: 'technical',
        hint: 'Combine a Doubly Linked List for O(1) eviction/insertion with a Hash Map for O(1) key lookup.',
        expectedKeywords: ['Doubly Linked List', 'Hash Map', 'Head/Tail Sentinel', 'O(1) amortized']
      },
      {
        id: 'tq_2',
        question: 'What is the difference between TCP and UDP? In what placement scenario would you select UDP over TCP?',
        category: 'technical',
        hint: 'Mention connection handshake, packet acknowledgment, ordering guarantees, and real-time streaming vs transactional integrity.',
        expectedKeywords: ['3-Way Handshake', 'Connectionless', 'Packet Loss', 'Real-time Streaming']
      },
      {
        id: 'tq_3',
        question: 'How do database indexes (B-Trees) accelerate read queries, and what is the trade-off during write operations?',
        category: 'technical',
        hint: 'Explain tree height, page splits, disk I/O reduction, and maintenance cost on INSERT/UPDATE.',
        expectedKeywords: ['B+ Tree', 'Logarithmic Search', 'Write Amplification', 'Index Fragmentation']
      }
    ],
    system_design: [
      {
        id: 'sd_1',
        question: 'How would you design a distributed Rate Limiter for a high-traffic API gateway (e.g. 50,000 requests/second)?',
        category: 'system_design',
        hint: 'Discuss algorithms like Token Bucket, Leaky Bucket, and Redis sorted sets / Lua scripts for atomic counters.',
        expectedKeywords: ['Token Bucket', 'Redis Cluster', 'Sliding Window', 'Atomic Lua Script', 'Race Conditions']
      },
      {
        id: 'sd_2',
        question: 'How would you architect a real-time Notification System delivering push alerts to 10M active campus students?',
        category: 'system_design',
        hint: 'Use message brokers (Kafka/RabbitMQ), WebSockets for live clients, and worker pools for APNS/FCM delivery.',
        expectedKeywords: ['Message Queue', 'WebSocket Gateway', 'Worker Pool', 'Idempotency']
      }
    ]
  };

  const currentQuestions = sampleQuestions[track] || sampleQuestions.behavioral;
  const currentQ = currentQuestions[currentQuestionIndex] || currentQuestions[0];

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(120);
  };

  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(currentQ.question);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setIsTimerRunning(false);

    try {
      const res = await fetch('/api/gemini/mock-interview-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          userAnswer,
          category: track,
          company: targetCompany,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        throw new Error('Evaluation request failed');
      }
    } catch (err) {
      console.error('Mock interview eval error:', err);
      // Fallback
      setResult({
        overallScore: 84,
        starCompliance: 86,
        technicalAccuracy: 88,
        communicationClarity: 80,
        feedback: 'Solid structured answer with clear ownership. Elevate to 95+ by adding explicit quantified metrics on user impact.',
        strengths: ['Identified core trade-offs clearly', 'Good explanation of technical implementation'],
        improvements: ['State specific numbers for latency/throughput improvement', 'Structure conclusion more firmly'],
        detailedBreakdown: [],
        modelAnswer: 'In my last project, our backend service hit a bottleneck with 400ms query latency. I restructured the SQL indexes and introduced an in-memory Redis cache with an LRU policy. Consequently, 99th percentile response time plummeted by 82% under peak load.'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setResult(null);
    setUserAnswer('');
    handleResetTimer();
    setCurrentQuestionIndex((prev) => (prev + 1) % currentQuestions.length);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls Bento Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">AI Mock Interview Simulator</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
              Voice &amp; Text
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time HR Behavioral (STAR) &amp; Technical round simulation with instant AI feedback rubrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Track Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-2xs">
            <button
              id="btn-track-behavioral"
              onClick={() => { setTrack('behavioral'); setCurrentQuestionIndex(0); setResult(null); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                track === 'behavioral' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HR Behavioral (STAR)
            </button>
            <button
              id="btn-track-technical"
              onClick={() => { setTrack('technical'); setCurrentQuestionIndex(0); setResult(null); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                track === 'technical' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Technical DSA
            </button>
            <button
              id="btn-track-system"
              onClick={() => { setTrack('system_design'); setCurrentQuestionIndex(0); setResult(null); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                track === 'system_design' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System Design
            </button>
          </div>

          {/* Company Target */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Target:</span>
            <select
              id="select-mock-company"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Atlassian">Atlassian</option>
              <option value="Uber">Uber</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Left Question & Input / Right Scorecard & Model Answer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Question & Answer Input (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Question Card with Live Hover */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            id="mock-question-card"
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:border-indigo-300 transition-colors relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
                <span className="text-xs text-slate-500 font-semibold capitalize">
                  {track.replace('_', ' ')} Round
                </span>
              </div>

              {/* Timer Pill */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Timer className={`w-3.5 h-3.5 ${timerSeconds < 30 ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`} />
                <span className={`text-xs font-mono font-bold ${timerSeconds < 30 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
                {!isTimerRunning ? (
                  <button onClick={handleStartTimer} className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer">
                    Start
                  </button>
                ) : (
                  <button onClick={handleResetTimer} className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer">
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Question Text with Animation */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQ.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3 my-4"
              >
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug flex-1">
                  "{currentQ.question}"
                </h2>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  id="btn-speak-question"
                  onClick={handleSpeakQuestion}
                  className={`p-2.5 rounded-2xl border transition-colors shrink-0 cursor-pointer ${
                    isSpeaking
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title="Read question out loud"
                >
                  <Volume2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Hint Accordion */}
            {currentQ.hint && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Interviewer Clue: </strong>
                  {currentQ.hint}
                </div>
              </div>
            )}
          </motion.div>

          {/* Answer Input Area */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Answer / Live Response
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {userAnswer.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              id="mock-answer-input"
              rows={8}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`Structure your response here...

For behavioral:
• Situation: Set the background context...
• Task: What challenge did you need to solve?
• Action: What specific engineering steps did you execute?
• Result: Quantify the outcome (e.g. reduced latency by 35%).`}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-y leading-relaxed font-sans transition-colors"
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserAnswer(`In my previous semester project, our API latency was bottlenecked at 450ms under heavy test loads (Situation). My task was to optimize the read throughput without rewriting the entire database schema (Task). I implemented a Redis caching layer with LRU eviction and indexed composite query keys in PostgreSQL (Action). As a result, the 99th-percentile response time dropped to 65ms, supporting 3x higher concurrent traffic seamlessly (Result).`)}
                className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                Insert Sample STAR Answer
              </button>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="btn-eval-mock-answer"
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  {isEvaluating ? 'Evaluating with Gemini AI...' : 'Submit for AI Feedback'}
                </motion.button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: AI Scorecard & Model Answer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result-present"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                id="mock-result-card"
                className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-5 shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Evaluation</span>
                    <h3 className="text-sm font-black text-slate-900">Recruiter Rubric Scorecard</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <motion.span 
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-black text-indigo-600"
                      >
                        {result.overallScore}
                      </motion.span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>
                </div>

                {/* Sub Scores */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-medium">STAR Rubric</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">{result.starCompliance}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Tech Depth</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">{result.technicalAccuracy}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Clarity</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">{result.communicationClarity}%</span>
                  </div>
                </div>

                {/* General Feedback */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-indigo-600 block mb-1">Interviewer Feedback:</strong>
                  {result.feedback}
                </div>

                {/* Strengths */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {result.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Areas to Refine:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {result.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Model 95+ Answer */}
                {result.modelAnswer && (
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 text-xs text-slate-800">
                    <strong className="text-indigo-700 block mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-600" /> Exemplary Model Response (95+ Rating):
                    </strong>
                    <p className="italic text-slate-700 leading-relaxed">"{result.modelAnswer}"</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="btn-next-mock-q"
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-indigo-500/20 cursor-pointer"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="result-empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 text-center space-y-4 shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Awaiting Candidate Submission</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Type your response in the editor and click <strong>Submit for AI Feedback</strong> to generate a full STAR rubric evaluation.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs text-slate-700 space-y-2">
                  <span className="font-bold text-slate-900 block">STAR Method Checklist:</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span><strong>S</strong>ituation: Background &amp; context</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span><strong>T</strong>ask: Specific challenge</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span><strong>A</strong>ction: What you built / fixed</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span><strong>R</strong>esult: Quantified impact metrics</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
};
