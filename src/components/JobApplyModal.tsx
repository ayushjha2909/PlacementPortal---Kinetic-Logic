import React, { useState, useEffect } from 'react';
import { JobOpening, User } from '../types';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Send, 
  FileText, 
  GraduationCap, 
  DollarSign 
} from 'lucide-react';

interface JobApplyModalProps {
  job: JobOpening | null;
  user: User;
  onClose: () => void;
  onConfirmApply: (jobId: string) => void;
}

export const JobApplyModal: React.FC<JobApplyModalProps> = ({
  job,
  user,
  onClose,
  onConfirmApply,
}) => {
  const [pitchNote, setPitchNote] = useState(
    `I am eager to apply for the ${job?.role} role at ${job?.company}. With an 8.84 CGPA in Computer Science and hands-on experience in full-stack architecture, distributed systems, and real-time APIs, I am confident in adding immediate value to your engineering team.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirmApply(job.id);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div 
      id="job-apply-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
      >
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm text-sm"
              style={{ backgroundColor: job.logoColor || '#3b82f6' }}
            >
              {job.logoLetter}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{job.role}</h3>
              <p className="text-xs text-slate-600 font-semibold">{job.company} • {job.packageLpa} LPA CTC</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3 text-emerald-600 animate-in zoom-in-95">
            <CheckCircle2 className="w-14 h-14 mx-auto animate-bounce" />
            <h4 className="text-lg font-black text-slate-900">Application Dispatched!</h4>
            <p className="text-xs text-slate-600">Your profile and verified ATS resume have been routed to the {job.company} campus hiring coordinator.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            
            {/* Match Banner */}
            <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900">ATS Resume Compatibility</span>
              </div>
              <span className="px-2.5 py-0.5 bg-white text-indigo-700 border border-indigo-200 font-extrabold rounded-full shadow-2xs">
                {job.matchPercentage}% Strong Fit
              </span>
            </div>

            {/* Profile Snapshot */}
            <div className="grid grid-cols-2 gap-2.5 text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block font-medium">Candidate</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{user.name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block font-medium">CGPA / Branch</span>
                <span className="font-bold text-indigo-600 mt-0.5 block">{user.cgpa} • CS Dept</span>
              </div>
            </div>

            {/* Attached Resume */}
            <div>
              <label className="text-slate-600 font-bold block mb-1">Attached Verified Resume</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <span className="text-slate-800 flex items-center gap-2 font-mono">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  {user.resumeUrl || 'Software_Eng_Resume_v2.pdf'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  85 ATS Score
                </span>
              </div>
            </div>

            {/* Custom Pitch Note */}
            <div>
              <label className="text-slate-600 font-bold block mb-1">Cover Note / Candidate Pitch</label>
              <textarea
                rows={4}
                value={pitchNote}
                onChange={(e) => setPitchNote(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none leading-relaxed transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Transmitting...' : 'Confirm Application'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
