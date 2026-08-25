import React, { useState } from 'react';
import { 
  User, 
  Role, 
  JobOpening, 
  TimelineEvent, 
  ATSScanResult 
} from './types';
import { 
  currentUser, 
  adminUser, 
  initialATSResult, 
  createFreshATSResult,
  mockJobs, 
  initialTimelineEvents 
} from './data/mockData';
import { LandingPage } from './components/LandingPage';
import { Navigation } from './components/Navigation';
import { StudentDashboard } from './components/StudentDashboard';
import { ResumeScanner } from './components/ResumeScanner';
import { CompanyMatches } from './components/CompanyMatches';
import { AIMentorChat } from './components/AIMentorChat';
import { MockInterviews } from './components/MockInterviews';
import { CodingPractice } from './components/CodingPractice';
import { TPODashboard } from './components/TPODashboard';
import { AccessDenied } from './components/AccessDenied';
import { AuthModal } from './components/AuthModal';
import { JobApplyModal } from './components/JobApplyModal';
import { ReportModal } from './components/ReportModal';
import { ProfileModal } from './components/ProfileModal';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Authentication & Session State
  // Initial state is unauthenticated so visitors land on the Landing Page Overview first
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('placement_portal_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch {
      // fallback
    }
    return currentUser;
  });
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Data states (User-isolated in state and localStorage)
  const [atsResult, setAtsResult] = useState<ATSScanResult>(() => {
    try {
      const savedUser = localStorage.getItem('placement_portal_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const userId = parsed?.id;
        if (userId) {
          const savedAts = localStorage.getItem(`ats_result_${userId}`);
          if (savedAts) return JSON.parse(savedAts);
          if (userId !== 'usr_alex_01' && userId !== 'std_alex_2026') {
            return createFreshATSResult(parsed);
          }
        }
      }
    } catch {
      // fallback
    }
    return initialATSResult;
  });
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobs);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimelineEvents);
  
  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<Role>('student');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeApplyJob, setActiveApplyJob] = useState<JobOpening | null>(null);
  
  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenAuthModal = (initialMode: 'login' | 'register' = 'login', initialRole: Role = 'student') => {
    setAuthInitialMode(initialMode);
    setAuthInitialRole(initialRole);
    setAuthModalOpen(true);
  };

  const handleUpdateATSResult = (newResult: ATSScanResult) => {
    setAtsResult(newResult);
    if (user?.id) {
      localStorage.setItem(`ats_result_${user.id}`, JSON.stringify(newResult));
      
      const newCgpa = (typeof newResult.extractedCgpa === 'number' && newResult.extractedCgpa > 0)
        ? newResult.extractedCgpa
        : user.cgpa;

      // Also update user's latestAtsScore and extracted CGPA
      const updatedUser = { 
        ...user, 
        cgpa: newCgpa,
        latestAtsScore: newResult.score, 
        readinessScore: Math.round((newResult.score + (newCgpa ? newCgpa * 10 : 85)) / 2) 
      };
      setUser(updatedUser);
      localStorage.setItem('placement_portal_user', JSON.stringify(updatedUser));
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('placement_portal_user', JSON.stringify(newUser));
    setIsAuthenticated(true);

    // If new user has their own ATS result stored, load it; otherwise initialize fresh state for new student
    const isNewStudent = newUser.id !== 'usr_alex_01' && newUser.id !== 'std_alex_2026';
    const userAts = localStorage.getItem(`ats_result_${newUser.id}`);
    
    if (userAts) {
      try {
        setAtsResult(JSON.parse(userAts));
      } catch {
        setAtsResult(isNewStudent ? createFreshATSResult(newUser) : initialATSResult);
      }
    } else if (isNewStudent) {
      // Clean slate for newly registered candidates
      const freshAts = createFreshATSResult(newUser);
      setAtsResult(freshAts);
      localStorage.setItem(`ats_result_${newUser.id}`, JSON.stringify(freshAts));
    } else {
      setAtsResult(initialATSResult);
    }

    if (newUser.role === 'admin') {
      setCurrentTab('tpo');
    } else {
      setCurrentTab('dashboard');
    }
    showToast(`Authenticated successfully as ${newUser.name} (${newUser.role === 'admin' ? 'TPO Admin' : 'Student'})`);

    // Log authentication event to PostgreSQL backend
    fetch('/api/auth/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        eventType: 'LOGIN',
        metadata: {
          branch: newUser.branch,
          batch: newUser.batch,
          cgpa: newUser.cgpa,
        },
      }),
    }).catch((e) => console.warn('Auth log recording deferred:', e));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('placement_portal_user', JSON.stringify(updatedUser));
    showToast('Profile and photo updated successfully!');
  };

  const handleLogout = () => {
    // Log logout event to PostgreSQL backend before resetting client state
    if (user) {
      fetch('/api/auth/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          eventType: 'LOGOUT',
          metadata: {
            sessionDurationSec: 120,
          },
        }),
      }).catch((e) => console.warn('Logout log recording deferred:', e));
    }

    setIsAuthenticated(false);
    setCurrentTab('dashboard');
    showToast('Signed out successfully. Returned to Landing Page overview.');
  };

  const handleApplyJob = (job: JobOpening) => {
    setActiveApplyJob(job);
  };

  const handleConfirmApply = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applied: true, status: 'Applied' } : j))
    );
    showToast('Application successfully submitted with ATS resume!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative selection:bg-indigo-500 selection:text-white">
      
      {!isAuthenticated ? (
        /* Unauthenticated Landing Page with complete platform overview, interactive tabs, & Auth CTAs */
        <LandingPage
          onOpenAuth={handleOpenAuthModal}
          onDirectDemoLogin={handleLogin}
        />
      ) : (
        /* Authenticated Application Environment */
        <>
          {/* Navigation & Header */}
          <Navigation
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            user={user}
            onSwitchRole={() => handleOpenAuthModal('login', user.role === 'admin' ? 'student' : 'admin')}
            onOpenAuth={() => handleOpenAuthModal('login', user.role)}
            onOpenReport={() => setReportModalOpen(true)}
            onOpenProfileModal={() => setProfileModalOpen(true)}
            onSignOut={handleLogout}
          />

          {/* Main Content View Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <AnimatePresence mode="wait">
              {/* Admin Dashboard: Rendered when user is Admin */}
              {user.role === 'admin' ? (
                <motion.div
                  key="tpo-admin"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <TPODashboard
                    adminUser={user}
                    onOpenReport={() => setReportModalOpen(true)}
                    onOpenProfileModal={() => setProfileModalOpen(true)}
                  />
                </motion.div>
              ) : (
                /* Student Candidate Views: Accessible only to Student role */
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentTab === 'dashboard' && (
                    <StudentDashboard
                      user={user}
                      atsResult={atsResult}
                      jobs={jobs}
                      timeline={timeline}
                      onNavigate={setCurrentTab}
                      onApplyJob={handleApplyJob}
                      onOpenReport={() => setReportModalOpen(true)}
                      onOpenProfileModal={() => setProfileModalOpen(true)}
                    />
                  )}

                  {currentTab === 'resume' && (
                    <ResumeScanner
                      user={user}
                      atsResult={atsResult}
                      onUpdateATSResult={handleUpdateATSResult}
                      onUpdateUser={(updated) => {
                        setUser(updated);
                        localStorage.setItem('placement_portal_user', JSON.stringify(updated));
                      }}
                      onNavigate={setCurrentTab}
                    />
                  )}

                  {currentTab === 'jobs' && (
                    <CompanyMatches
                      jobs={jobs}
                      user={user}
                      onApplyJob={handleApplyJob}
                    />
                  )}

                  {currentTab === 'mentor' && (
                    <AIMentorChat
                      user={user}
                    />
                  )}

                  {currentTab === 'mock' && (
                    <MockInterviews
                      user={user}
                    />
                  )}

                  {currentTab === 'coding' && (
                    <CodingPractice user={user} />
                  )}

                  {currentTab === 'tpo' && (
                    <AccessDenied
                      user={user}
                      onReturnToDashboard={() => setCurrentTab('dashboard')}
                      onRequestAdminLogin={() => handleOpenAuthModal('login', 'admin')}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Minimal Clean White Footer */}
          <footer className="bg-white border-t border-slate-200/80 py-5 px-4 text-xs text-slate-500 mt-auto shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-slate-800 text-xs tracking-tight flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">K</span>
                  Kinetic Placement Portal
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  {user.role === 'admin' ? 'TPO Administrative Hub' : 'Student Career & Placement Readiness Hub'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium hover:underline underline-offset-4"
                >
                  {user.role === 'admin' ? 'University Placement Report' : 'Student Readiness Dossier'}
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={handleLogout}
                  className="text-rose-600 hover:text-rose-700 transition-colors font-semibold hover:underline underline-offset-4"
                >
                  Sign Out to Landing Page
                </button>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        initialMode={authInitialMode}
        initialRole={authInitialRole}
      />

      <JobApplyModal
        job={activeApplyJob}
        user={user}
        onClose={() => setActiveApplyJob(null)}
        onConfirmApply={handleConfirmApply}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        user={user}
        atsResult={atsResult}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onSaveUser={handleUpdateUser}
      />

      {/* Global Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            id="global-toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
