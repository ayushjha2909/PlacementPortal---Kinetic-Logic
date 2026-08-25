import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatMessage, 
  User 
} from '../types';
import { companyInsightsData, placementRulesAndFaq } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  Building2, 
  ChevronRight, 
  RefreshCw, 
  BookOpen, 
  Clock,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface AIMentorChatProps {
  user: User;
}

export const AIMentorChat: React.FC<AIMentorChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      role: 'assistant',
      content: `Hello ${user.name}! I'm your AI Career Mentor and Placement Advisor. 
I can help you master the **STAR method** for behavioral questions, break down complex **DSA algorithms & System Design**, or share real interview patterns for companies like **Amazon, Google, and Microsoft**.

What would you like to prepare for today?`,
      timestamp: '10:00 AM',
      tip: 'Tip: Frame past project accomplishments with quantified metrics (e.g. "reduced latency by 35%").'
    },
    {
      id: 'msg_2',
      role: 'user',
      content: 'How should I structure my answer for Amazon\'s "Customer Obsession" leadership principle?',
      timestamp: '10:02 AM'
    },
    {
      id: 'msg_3',
      role: 'assistant',
      content: `When framing your answer for Amazon's **Customer Obsession** leadership principle, utilize the **STAR methodology**:

1. **Situation**: Set the stage. Describe a time when a customer requirement conflicted with short-term project deadlines or default architecture.
2. **Task**: Clearly define your responsibility in championing the end-user's needs.
3. **Action**: What steps did you take? Explain how you dug deep into telemetry/feedback to understand root causes, iterated on prototypes, or pushed back against premature shortcuts.
4. **Result**: Quantify the impact! (e.g., *"prevented 99.4% of checkout drop-offs"* or *"improved user retention by 22%"*).`,
      timestamp: '10:03 AM',
      tip: 'Tip: Amazon bar-raisers look for candidates who start with the customer and work backwards, even under pressure.'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCompanyKey, setSelectedCompanyKey] = useState<string>('Amazon (SDE II)');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedInsight = companyInsightsData[selectedCompanyKey] || companyInsightsData['Amazon (SDE II)'];

  const starterQueries = [
    { title: 'QuickSort Complexity', prompt: 'Explain QuickSort algorithm time & space complexity with interview follow-ups.' },
    { title: 'Amazon STAR Method', prompt: 'Give me a template for Amazon Customer Obsession leadership principle.' },
    { title: 'System Design: TinyURL', prompt: 'Break down System Design for a scalable URL Shortener (TinyURL).' },
    { title: 'Placement Policy Rules', prompt: 'What is the One Student One Job policy and Dream company threshold?' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/gemini/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          companyContext: selectedInsight,
          studentContext: {
            name: user.name,
            branch: user.branch,
            cgpa: user.cgpa,
            skills: user.skills,
            rulesFaq: placementRulesAndFaq,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tip: data.tip,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API response failed');
      }
    } catch (err) {
      console.error('Mentor chat error:', err);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: `Great question! In campus technical rounds, remember to always clarify edge cases (empty inputs, integer overflow) before writing code, and state time/space complexity explicitly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tip: 'Tip: Always think out loud during coding rounds to demonstrate your thought process.',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left / Sidebar Column: Company Intelligence & RAG Question Bank (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Company Intelligence Selector Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          id="card-company-insights"
          className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Target Recruiter Dossier
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              RAG Active
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1.5">Select Target Company:</label>
              <select
                id="select-company-insights"
                value={selectedCompanyKey}
                onChange={(e) => setSelectedCompanyKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
              >
                <option value="Amazon (SDE II)">Amazon (SDE II / I)</option>
                <option value="Google (SDE)">Google (SDE L3)</option>
                <option value="Microsoft">Microsoft (SDE)</option>
              </select>
            </div>

            {/* Difficulty & Common Topics */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Interview Difficulty:</span>
                <span className="font-extrabold text-rose-600">{selectedInsight.difficulty} ({selectedInsight.difficultyPercentage}%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedInsight.difficultyPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full"
                ></motion.div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedInsight.commonTopics.map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] bg-white text-indigo-700 px-2.5 py-1 rounded-xl border border-slate-200 font-bold shadow-2xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Focus Areas */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700">Recruiter Focus Areas:</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {selectedInsight.keyFocusAreas.map((area, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Suggested Prompts & Question Bank with Live Hover */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          id="card-suggested-prompts"
          className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3.5 shadow-xs"
        >
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            Recommended Drill Topics
          </span>

          <div className="space-y-2">
            {starterQueries.map((q, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSendMessage(q.prompt)}
                className="w-full text-left p-3 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition-colors group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                  <span>{q.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{q.prompt}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Main Chat Interface (8 cols) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="lg:col-span-8 flex flex-col h-[700px] bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs"
      >
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900">Career Mentor &amp; Placement Advisor</h2>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Placement archives, company round patterns, &amp; interview STAR guides</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            id="btn-clear-chat"
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Reset Chat Session"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Message Feed */}
        <div 
          id="chat-messages-container"
          className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/40"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${isAssistant ? '' : 'text-right'}`}>
                    <div
                      className={`p-4 rounded-3xl text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                          : 'bg-indigo-600 text-white font-semibold shadow-sm ml-auto'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>
                    </div>

                    {/* AI Tip Box */}
                    {isAssistant && msg.tip && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-medium"
                      >
                        <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{msg.tip}</span>
                      </motion.div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative flex items-center">
            <input
              id="mentor-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about interview questions, algorithms, STAR answers, placement rules..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="btn-send-mentor-chat"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            AI Mentor responses are grounded in real placement syllabi &amp; recruiter benchmarks.
          </p>
        </div>

      </motion.div>

    </div>
  );
};
