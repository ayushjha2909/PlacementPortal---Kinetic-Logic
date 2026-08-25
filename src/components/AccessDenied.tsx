import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface AccessDeniedProps {
  user: User;
  onReturnToDashboard: () => void;
  onRequestAdminLogin: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  user,
  onReturnToDashboard,
  onRequestAdminLogin,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 animate-in fade-in duration-200">
      <div className="max-w-xl w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center">
        
        {/* Background ambient red glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mt-20"></div>

        {/* Security Shield Icon */}
        <div className="relative z-10 w-20 h-20 mx-auto rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.2)] mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Lock className="w-3.5 h-3.5" />
          HTTP 403 • Administrative Access Restricted
        </div>

        {/* Headline & Explanation */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Access Denied: TPO Admin Only
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          You are currently signed in as <strong className="text-white">{user.name}</strong> (<span className="text-indigo-400 font-semibold">{user.email}</span>, <span className="capitalize">{user.role}</span> role). The Training &amp; Placement Office (TPO) dashboard contains confidential institution-wide student dossiers, recruiter packages, and placement audit metrics restricted to authorized campus placement directors.
        </p>

        {/* Security checklist info */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-left text-xs text-slate-400 space-y-2 mb-8">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Lock className="w-4 h-4 text-rose-400" />
            Security &amp; Privacy Policy (FERPA &amp; Institutional Compliance)
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            • Student candidates cannot view peer placement offers, corporate compensation records, or modify institutional eligibility filters.
          </p>
          <p className="text-[11px] text-slate-400 leading-normal">
            • To access institutional reports, you must sign in with a verified <code className="text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded">@university.edu</code> TPO Director account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-access-denied-back"
            onClick={onReturnToDashboard}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Candidate Dashboard
          </button>

          <button
            id="btn-access-denied-login-admin"
            onClick={onRequestAdminLogin}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <KeyRound className="w-4 h-4 text-sky-400" />
            Admin Credentials Login
          </button>
        </div>

      </div>
    </div>
  );
};
