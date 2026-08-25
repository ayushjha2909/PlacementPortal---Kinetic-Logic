export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  branch?: string;
  batch?: string;
  cgpa?: number;
  backlogs?: number;
  readinessScore?: number;
  skills?: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeText?: string;
  latestAtsScore?: number;
  headline?: string;
  phone?: string;
  targetRole?: string;
  institution?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface ATSScoreBreakdown {
  formattingReadability: number;
  keywordOptimization: number;
  experienceImpact: number;
}

export interface ATSScanResult {
  score: number;
  breakdown: ATSScoreBreakdown;
  fileName: string;
  timestamp: string;
  missingKeywords: string[];
  suggestions: {
    id: string;
    type: 'metric' | 'summary' | 'formatting' | 'skill';
    title: string;
    description: string;
  }[];
  matchedKeywords: string[];
  roleMatch: string;
  extractedSkills: string[];
  summaryFeedback: string;
  extractedCgpa?: number;
  candidateName?: string;
  candidateBranch?: string;
}

export interface CompanyDrive {
  id: number;
  driveCode: string;
  companyName: string;
  logoUrl?: string;
  roleTitle: string;
  tier: 'Super Dream' | 'Tier-1' | 'Tier-2' | 'Mass';
  packageLpa: number;
  location: string;
  minCgpa: number;
  maxBacklogs?: number;
  allowedBranches?: string[];
  skillsRequired: string[];
  description: string;
  rounds?: string[];
  deadline?: string;
  applicantCount?: number;
  status?: 'ACTIVE' | 'CLOSED' | 'UPCOMING';
  isActive?: boolean;
  hasApplied?: boolean;
  applicationStatus?: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'OFFERED' | 'REJECTED';
  createdAt?: string;
}

export interface JobApplication {
  id: number;
  driveId: number;
  driveCode?: string;
  companyName?: string;
  roleTitle?: string;
  userId?: string;
  studentId?: number;
  studentEmail: string;
  studentName: string;
  studentBranch?: string;
  studentCgpa?: number;
  atsScore?: number;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'OFFERED' | 'REJECTED';
  currentRound?: string;
  feedback?: string;
  notes?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: number;
  userId?: number | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface InterviewSlot {
  id: number;
  applicationId?: number;
  driveCode: string;
  companyName: string;
  userId: string;
  studentEmail: string;
  interviewerName: string;
  roundName: string;
  scheduledAt: string;
  meetingLink: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedbackScore?: number;
  notes?: string;
}

export interface AppNotification {
  id: number;
  userId: string;
  userEmail: string;
  title: string;
  message: string;
  type: 'DRIVE_ALERT' | 'STATUS_UPDATE' | 'ATS_ALERT' | 'INTERVIEW_SCHEDULED' | 'INFO';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface JobOpening {
  id: string;
  company: string;
  logoLetter: string;
  logoColor?: string;
  logoUrl?: string;
  role: string;
  location: string;
  type: 'Hybrid' | 'Remote' | 'On-site';
  matchPercentage: number;
  matchBasis: 'Resume' | 'Skills' | 'Interests';
  missingSkill?: string;
  packageLpa: number;
  eligibility: {
    minCgpa: number;
    branches: string[];
    batch: string;
  };
  requiredSkills: string[];
  description: string;
  applied?: boolean;
  status?: 'Applied' | 'Shortlisted' | 'Assessment Scheduled' | 'Offered' | 'Rejected';
  deadline: string;
}

export interface TimelineEvent {
  id: string;
  timeLabel: string;
  title: string;
  subtitle: string;
  type: 'interview' | 'assessment' | 'workshop' | 'deadline';
  isLive?: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tip?: string;
  citations?: string[];
}

export interface CompanyInsight {
  company: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  difficultyPercentage: number;
  commonTopics: string[];
  keyFocusAreas: string[];
  interviewStages: string[];
  sampleQuestions: string[];
}

export interface MockQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'system_design' | 'situational';
  hint?: string;
  sampleAnswer?: string;
  expectedKeywords?: string[];
}

export interface MockInterviewResult {
  overallScore: number;
  starCompliance: number;
  technicalAccuracy: number;
  communicationClarity: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  detailedBreakdown: {
    question: string;
    userAnswer: string;
    score: number;
    feedback: string;
  }[];
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Data Structures' | 'Algorithms' | 'SQL & Databases' | 'System Design';
  acceptance: string;
  solved: boolean;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<string, string>;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  hints: string[];
}

export interface StudentCandidateProfile {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  avatar: string;
  branch: string;
  batch: string;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  activeBacklogs: number;
  historyBacklogs: number;
  placementStatus: 'Eligible - In Process' | 'Placed - Dream Offer' | 'Placed - Core' | 'Unplaced - Action Required';
  dreamEligible: boolean;
  tpoVerified: boolean;
  tpoNotes: string;
  resumeATSScore: number;
  resumeFileName: string;
  targetRole: string;
  primarySkills: string[];
  codingStats: {
    totalSolved: number;
    leetcodeUsername: string;
    leetcodeSolved: number;
    leetcodeRating: number;
    codingNinjasSolved: number;
    gfgSolved: number;
    codeforcesRating?: number;
  };
  mockInterviewScore: number;
  readinessGrade: string;
  applications: {
    id: string;
    company: string;
    role: string;
    appliedDate: string;
    packageLpa: number;
    status: 'Applied' | 'OA Cleared' | 'Technical Round 2' | 'Offer Extended' | 'Offer Accepted' | 'Rejected';
  }[];
  recentActivity: string[];
}

export interface StudentSkillGap {
  id: string;
  studentName: string;
  studentId: string;
  branch: string;
  avgScore: number;
  gaps: string[];
  cgpa: number;
  readyForPlacement: boolean;
}

export interface PlacedStudentOffer {
  id: string;
  studentName: string;
  studentId: string;
  branch: string;
  company: string;
  role: string;
  packageLpa: number;
  date: string;
  avatarInitials: string;
}

export interface TPODashboardStats {
  totalStudents: number;
  totalStudentsGrowth: string;
  placedPercentage: number;
  avgPackageLpa: number;
  medianPackageLpa: number;
  topRecruiter: string;
  topRecruiterOffers: number;
  techReadiness: { skill: string; percentage: number }[];
  softSkillsReadiness: { skill: string; percentage: number }[];
}

export type CodingPlatform = 
  | 'leetcode' 
  | 'codingninjas' 
  | 'hackerrank' 
  | 'geeksforgeeks' 
  | 'codeforces' 
  | 'codechef';

export interface TopicProficiency {
  topic: string;
  solved: number;
  totalEstimated: number;
  accuracy: number;
  proficiency: 'Novice' | 'Competent' | 'Proficient' | 'Master';
}

export interface CodingProfile {
  id: string;
  platform: CodingPlatform;
  username: string;
  profileUrl: string;
  avatarUrl?: string;
  verified: boolean;
  lastSynced: string;
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking?: string | number;
    contestRating?: number;
    globalPercentile?: number;
    streakDays?: number;
    stars?: number;
    badges?: string[];
    accuracy?: number;
    points?: number;
    problemsByTopic?: TopicProficiency[];
  };
}

export interface PredictedClearance {
  company: string;
  probability: number;
  role: string;
  rationale: string;
  minRecommendedProblemCount: number;
  keyRoundsCovered: string[];
}

export interface TopicStrengthAnalysis {
  topic: string;
  score: number;
  status: 'strong' | 'moderate' | 'weak';
  recommendation: string;
  benchmarkScore: number;
}

export interface RecommendedActionPlanStep {
  step: number;
  title: string;
  target: string;
  timeFrame: string;
  specificProblems: string[];
}

export interface CodingProfileAnalysis {
  candidateRating: number; // 0-100
  placementReadinessTier: string;
  totalProblemsAcrossPlatforms: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  crossPlatformPercentile: number;
  activeStreak: number;
  dsaReadinessScore: number;
  systemDesignReadinessScore: number;
  contestConsistencyScore: number;
  aiExecutiveSummary: string;
  predictedRoundClearance: PredictedClearance[];
  topicStrengths: TopicStrengthAnalysis[];
  criticalGaps: string[];
  recommendedActionPlan: RecommendedActionPlanStep[];
  timestamp: string;
}
