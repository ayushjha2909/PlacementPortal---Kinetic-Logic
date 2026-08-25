import React, { useState, useEffect } from 'react';
import { 
  User, 
  Role,
  NotificationItem
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Bot, 
  Mic, 
  Code2, 
  BarChart3, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2,
  ExternalLink,
  Check,
  RefreshCw,
  Camera,
  User as UserIcon
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User;
  onSwitchRole: (role: Role) => void;
  onOpenAuth: () => void;
  onOpenReport: () => void;
  onOpenProfileModal?: () => void;
  onSignOut?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onSwitchRole,
  onOpenAuth,
  onOpenReport,
  onOpenProfileModal,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const token = localStorage.getItem('placement_auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/notifications', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [user.id]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard, badge: null, roles: ['student'] },
    { id: 'resume', label: 'ATS Resume Scanner', icon: FileText, badge: 'ATS 85', roles: ['student'] },
    { id: 'jobs', label: 'Job Opportunities', icon: Briefcase, badge: '5 Drives', roles: ['student'] },
    { id: 'mentor', label: 'AI Placement Mentor', icon: Bot, badge: 'RAG', roles: ['student'] },
    { id: 'mock', label: 'Mock Interview', icon: Mic, badge: 'Live AI', roles: ['student'] },
    { id: 'coding', label: 'Coding & Profiles', icon: Code2, badge: '691 DSA', roles: ['student'] },
    { id: 'tpo', label: 'TPO Placement Office', icon: BarChart3, badge: 'Admin Console', roles: ['admin'] },
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button 
              id="brand-logo-btn"
              onClick={() => setCurrentTab(user.role === 'admin' ? 'tpo' : 'dashboard')} 
              className="flex items-center gap-2.5 group text-left transition-transform duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs group-hover:bg-indigo-700 transition-all">
                KP
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                  Placement Hub
                </span>
                <span className="text-[11px] text-slate-500 block -mt-0.5 font-medium">
                  {user.role === 'admin' ? 'TPO Institutional Portal' : 'Student Career Readiness'}
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <input
                id="global-search-input"
                type="text"
                placeholder={user.role === 'admin' ? "Search roll number, profiles, drives..." : "Search companies, DSA questions, placement rules..."}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none input-focus-glow transition-all shadow-2xs"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs font-mono">
                ⌘K
              </div>
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Active Role Indicator Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-sky-500' : 'bg-emerald-500'}`}></span>
              <span className="font-semibold text-slate-700">
                {user.role === 'admin' ? 'TPO Director' : 'Student Candidate'}
              </span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                id="btn-notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 relative transition-all shadow-2xs cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-black rounded-full ring-2 ring-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    id="notifications-popup"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">Placement Alerts &amp; Updates</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            {unreadCount} Unread
                          </span>
                        )}
                      </div>
                      <button
                        onClick={fetchNotifications}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Refresh"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingNotifications ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-xl border transition-all ${
                              n.isRead
                                ? 'bg-slate-50/60 border-slate-100 text-slate-600'
                                : 'bg-indigo-50/70 border-indigo-200 text-slate-900 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-xs font-bold ${!n.isRead ? 'text-indigo-900' : 'text-slate-800'}`}>
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                            {!n.isRead && (
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => handleMarkAsRead(n.id)}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" /> Mark as read
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="btn-user-profile-toggle"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 pl-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full transition-all shadow-2xs cursor-pointer"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user.role === 'admin' ? 'TPO Director' : 'Candidate'}</p>
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-500"
                />
              </motion.button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div 
                    id="profile-dropdown-menu"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg p-3.5 z-50"
                  >
                    <div className="pb-3 border-b border-slate-100 mb-2.5">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold rounded-md">
                          {user.branch || 'Campus Placement'}
                        </span>
                        {user.cgpa && (
                          <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold rounded-md">
                            CGPA: {user.cgpa}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {onOpenProfileModal && (
                        <button
                          id="btn-dropdown-edit-profile"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenProfileModal();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 hover:text-indigo-900 rounded-xl transition-all font-bold cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-indigo-600" />
                            Edit Profile & Picture
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-indigo-200/70 text-indigo-800 rounded font-bold">New</span>
                        </button>
                      )}

                      <button
                        id="btn-dropdown-report"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenReport();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-xl transition-all font-medium cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          Placement Readiness Dossier
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        id="btn-dropdown-auth"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all font-medium cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        Switch Account / Role
                      </button>

                      {onSignOut && (
                        <button
                          id="btn-dropdown-signout"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onSignOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out to Landing Page
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* Main Navigation Tab Bar with Clean Modern Tabs */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.01)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-1.5">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`nav-tab-item flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Placement Season Active
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-start"
          >
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-72 bg-white border-r border-slate-200 h-full p-5 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-extrabold text-slate-900 text-base">Placement Portal</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {visibleNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/25'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full py-2.5 bg-indigo-50 text-indigo-700 hover:text-indigo-900 border border-indigo-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    Edit Profile & Picture
                  </button>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Switch Account / Role
                </button>

                {onSignOut && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full py-2.5 bg-rose-50 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Sign Out to Landing Page
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
