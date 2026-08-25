import React, { useState, useRef } from 'react';
import { User, Role } from '../types';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Camera, 
  Sparkles, 
  Check, 
  User as UserIcon, 
  Trash2, 
  ShieldCheck, 
  GraduationCap, 
  RefreshCw, 
  Image as ImageIcon,
  Building,
  Mail,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSaveUser: (updatedUser: User) => void;
}

// Curated avatar presets for quick selection
const PRESET_AVATARS = [
  // Student & Candidate portraits
  {
    id: 's1',
    category: 'student',
    label: 'Professional (Female 1)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 's2',
    category: 'student',
    label: 'Professional (Male 1)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 's3',
    category: 'student',
    label: 'Tech Candidate (Female 2)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 's4',
    category: 'student',
    label: 'Software Aspirant (Male 2)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 's5',
    category: 'student',
    label: 'Developer (Female 3)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 's6',
    category: 'student',
    label: 'DSA Engineer (Male 3)',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 's7',
    category: 'student',
    label: 'Graduate (Female 4)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 's8',
    category: 'student',
    label: 'Campus Lead (Male 4)',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  },
  // Administrative & Executive TPO portraits
  {
    id: 'a1',
    category: 'admin',
    label: 'TPO Officer (Executive)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a2',
    category: 'admin',
    label: 'Placement Director (Executive)',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a3',
    category: 'admin',
    label: 'Head of Corporate Relations',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a4',
    category: 'admin',
    label: 'Dean of Career Services',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
];

const DICEBEAR_STYLES = [
  { id: 'avataaars', name: 'Avataaars' },
  { id: 'lorelei', name: 'Lorelei (Modern)' },
  { id: 'bottts', name: 'Bottts (Robo-Tech)' },
  { id: 'adventurer', name: 'Adventurer' },
  { id: 'initials', name: 'Monogram Initials' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
}) => {
  // Form fields
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [headline, setHeadline] = useState(user.headline || (user.role === 'admin' ? 'TPO Placement Director & Corporate Liaison' : 'B.Tech Candidate | Full-Stack & DSA Aspirant'));
  const [branch, setBranch] = useState(user.branch || 'Computer Science & Engineering');
  const [batch, setBatch] = useState(user.batch || '2026');
  const [cgpa, setCgpa] = useState(user.cgpa ? String(user.cgpa) : '8.8');
  const [targetRole, setTargetRole] = useState(user.targetRole || 'Software Development Engineer');
  const [institution, setInstitution] = useState(user.institution || 'Institute of Engineering & Technology');
  const [phone, setPhone] = useState(user.phone || '+91 98765 43210');

  // Photo tab selection: 'upload' | 'url' | 'presets' | 'generator'
  const [photoTab, setPhotoTab] = useState<'upload' | 'url' | 'presets' | 'generator'>('presets');
  
  // Custom URL input
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlPreviewValid, setUrlPreviewValid] = useState<boolean | null>(null);

  // Drag & drop upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Avatar Generator state
  const [generatorStyle, setGeneratorStyle] = useState('avataaars');
  const [generatorSeed, setGeneratorSeed] = useState(user.name.toLowerCase().replace(/\s+/g, '-'));

  // Preset filter
  const [presetCategory, setPresetCategory] = useState<'all' | 'student' | 'admin'>(
    user.role === 'admin' ? 'admin' : 'all'
  );

  // Reset internal states when opened
  React.useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setAvatar(user.avatar);
      setHeadline(user.headline || (user.role === 'admin' ? 'TPO Placement Director & Corporate Liaison' : 'B.Tech Candidate | Full-Stack & DSA Aspirant'));
      setBranch(user.branch || 'Computer Science & Engineering');
      setBatch(user.batch || '2026');
      setCgpa(user.cgpa ? String(user.cgpa) : '8.8');
      setTargetRole(user.targetRole || 'Software Development Engineer');
      setInstitution(user.institution || 'Institute of Engineering & Technology');
      setPhone(user.phone || '+91 98765 43210');
      setUploadError(null);
      setCustomUrlInput('');
      setUrlPreviewValid(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handle local image file upload & convert to base64
  const processImageFile = (file: File) => {
    setUploadError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, SVG, GIF).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File is too large. Please choose an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setAvatar(e.target.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Apply Custom URL
  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatar(customUrlInput.trim());
    setUrlPreviewValid(true);
  };

  // Generate Dicebear URL
  const generateNewSeedAvatar = (style = generatorStyle, seed = Math.random().toString(36).substring(7)) => {
    setGeneratorSeed(seed);
    const newAvatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    setAvatar(newAvatarUrl);
  };

  // Handle Save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name: name.trim() || user.name,
      avatar: avatar.trim() || user.avatar,
      headline: headline.trim(),
      phone: phone.trim(),
      ...(user.role === 'student'
        ? {
            branch,
            batch,
            cgpa: parseFloat(cgpa) || user.cgpa || 8.5,
            targetRole,
          }
        : {
            institution,
          }),
    };

    onSaveUser(updatedUser);
    onClose();
  };

  // Reset to default
  const handleResetToDefault = () => {
    const defaultSeed = name.toLowerCase().replace(/\s+/g, '-');
    const defaultUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${defaultSeed}`;
    setAvatar(defaultUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="profile-picture-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              {user.role === 'admin' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Edit Profile & Picture
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  user.role === 'admin' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  {user.role === 'admin' ? 'TPO Admin' : 'Student Candidate'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload or change your profile image and update your career bio information
              </p>
            </div>
          </div>
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Section 1: Interactive Profile Picture Manager */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-600" />
                Profile Picture
              </span>
              <span className="text-[11px] font-normal text-slate-500 lowercase">
                Appears on dossier, header & recruitment drives
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar Live Preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-indigo-500/80 shadow-md bg-white flex items-center justify-center">
                  <img
                    src={avatar}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image URL is broken
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`;
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload new image"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Source Tabs */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex flex-wrap gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPhotoTab('presets')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      photoTab === 'presets'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Presets
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTab('upload')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      photoTab === 'upload'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTab('url')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      photoTab === 'url'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Image URL
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTab('generator')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      photoTab === 'generator'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Avatars
                  </button>
                </div>

                {/* TAB 1: PRESET GALLERY */}
                {photoTab === 'presets' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Click to select an avatar preset:</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPresetCategory('all')}
                          className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${presetCategory === 'all' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetCategory('student')}
                          className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${presetCategory === 'student' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                          Students
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetCategory('admin')}
                          className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${presetCategory === 'admin' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                          TPO Officers
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1 max-h-32 overflow-y-auto no-scrollbar">
                      {PRESET_AVATARS.filter(p => presetCategory === 'all' || p.category === presetCategory).map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAvatar(preset.url)}
                          className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                            avatar === preset.url
                              ? 'border-indigo-600 ring-2 ring-indigo-400/50 scale-105'
                              : 'border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                          {avatar === preset.url && (
                            <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow-sm" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: UPLOAD LOCAL FILE */}
                {photoTab === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="input-file-upload-avatar"
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                        dragOver
                          ? 'border-indigo-500 bg-indigo-50/50'
                          : 'border-slate-300 hover:border-indigo-400 bg-white'
                      }`}
                    >
                      <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-slate-800">
                        Click to browse or drag & drop photo here
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports JPG, PNG, WEBP, SVG (Max 5MB)
                      </p>
                    </div>

                    {uploadError && (
                      <p className="text-xs text-rose-600 font-medium">{uploadError}</p>
                    )}
                  </div>
                )}

                {/* TAB 3: IMAGE URL */}
                {photoTab === 'url' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/my-photo.jpg"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        disabled={!customUrlInput.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Paste any direct image URL from LinkedIn, GitHub, or your portfolio.
                    </p>
                  </div>
                )}

                {/* TAB 4: DICEBEAR AVATAR GENERATOR */}
                {photoTab === 'generator' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={generatorStyle}
                        onChange={(e) => {
                          setGeneratorStyle(e.target.value);
                          generateNewSeedAvatar(e.target.value, generatorSeed);
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {DICEBEAR_STYLES.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => generateNewSeedAvatar(generatorStyle)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                        Randomize Avatar
                      </button>
                    </div>
                  </div>
                )}

                {/* Reset to Default Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reset to default avatar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Profile Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
              General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email (Read-only / Institutional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institutional Email
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              {/* Headline / Career Role */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {user.role === 'admin' ? 'Designation & Title' : 'Career Objective / Headline'}
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={user.role === 'admin' ? 'Head of Training & Placements' : 'Full-Stack Developer | Competitive Programmer'}
                />
              </div>

              {/* Role-Specific Fields */}
              {user.role === 'student' ? (
                <>
                  {/* Branch */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Academic Branch / Department
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>

                  {/* Batch Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Graduating Batch
                    </label>
                    <select
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>

                  {/* CGPA */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cumulative CGPA (out of 10)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. 8.85"
                    />
                  </div>

                  {/* Target Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Target Role
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. SDE-1 / Cloud Architect"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Institution / University */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institution / College Name
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                        placeholder="Institute Name"
                      />
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Contact Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="btn-save-profile-modal"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Profile & Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
