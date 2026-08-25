// src/db/schema.ts
import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, jsonb, boolean } from 'drizzle-orm/pg-core';

// 1. Users table (Students & TPO Admins with password hash for production authentication)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Unique identifier
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'), // bcrypt hashed password
  role: text('role').notNull().default('student'), // student, admin, recruiter
  avatar: text('avatar'),
  branch: text('branch'), // e.g. CSE, IT, ECE, Mechanical
  batch: text('batch'), // e.g. 2026, 2027
  cgpa: doublePrecision('cgpa'),
  backlogs: integer('backlogs').default(0),
  skills: jsonb('skills').$type<string[]>(),
  resumeText: text('resume_text'),
  resumeFileName: text('resume_file_name'),
  latestAtsScore: integer('latest_ats_score'),
  codingProfiles: jsonb('coding_profiles').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Company Placement Drives table
export const companyDrives = pgTable('company_drives', {
  id: serial('id').primaryKey(),
  driveCode: text('drive_code').notNull().unique(),
  companyName: text('company_name').notNull(),
  logoUrl: text('logo_url'),
  roleTitle: text('role_title').notNull(),
  tier: text('tier').notNull().default('Tier-1'), // Super Dream, Tier-1, Tier-2, Mass
  packageLpa: doublePrecision('package_lpa').notNull(),
  location: text('location').notNull(),
  minCgpa: doublePrecision('min_cgpa').notNull().default(6.0),
  maxBacklogs: integer('max_backlogs').notNull().default(0),
  allowedBranches: jsonb('allowed_branches').$type<string[]>().notNull(),
  skillsRequired: jsonb('skills_required').$type<string[]>().notNull(),
  description: text('description').notNull(),
  rounds: jsonb('rounds').$type<string[]>(),
  deadline: timestamp('deadline').notNull(),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, CLOSED, UPCOMING
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Job Applications & Pipeline Tracking table
export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  driveId: integer('drive_id').notNull(),
  driveCode: text('drive_code').notNull(),
  companyName: text('company_name').notNull(),
  roleTitle: text('role_title').notNull(),
  userId: text('user_id').notNull(),
  studentEmail: text('student_email').notNull(),
  studentName: text('student_name').notNull(),
  studentBranch: text('student_branch'),
  studentCgpa: doublePrecision('student_cgpa'),
  atsScore: integer('ats_score'),
  status: text('status').notNull().default('APPLIED'), // APPLIED, SHORTLISTED, INTERVIEW_SCHEDULED, OFFERED, REJECTED
  currentRound: text('current_round').default('Online Assessment (OA)'),
  feedback: text('feedback'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Interview Slots table
export const interviewSlots = pgTable('interview_slots', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id'),
  driveCode: text('drive_code').notNull(),
  companyName: text('company_name').notNull(),
  userId: text('user_id').notNull(),
  studentEmail: text('student_email').notNull(),
  interviewerName: text('interviewer_name').notNull(),
  roundName: text('round_name').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  meetingLink: text('meeting_link').notNull(),
  durationMinutes: integer('duration_minutes').default(45),
  status: text('status').notNull().default('SCHEDULED'), // SCHEDULED, COMPLETED, CANCELLED
  feedbackScore: integer('feedback_score'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. In-App Notifications table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  userEmail: text('user_email').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('INFO'), // DRIVE_ALERT, STATUS_UPDATE, ATS_ALERT, INTERVIEW_SCHEDULED, INFO
  read: boolean('read').default(false).notNull(),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Auth Logs table (Session audits, Logins, Logouts, Role switches)
export const authLogs = pgTable('auth_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  eventType: text('event_type').notNull(), // LOGIN, REGISTER, LOGOUT, SESSION_REFRESH, ROLE_SWITCH
  ipAddress: text('ip_address').default('127.0.0.1'),
  userAgent: text('user_agent').default('Web Browser'),
  status: text('status').default('SUCCESS'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// 7. Activity logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  userEmail: text('user_email').notNull(),
  userName: text('user_name').notNull(),
  action: text('action').notNull(),
  details: jsonb('details').$type<Record<string, any>>(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  authLogs: many(authLogs),
  activityLogs: many(activityLogs),
  applications: many(jobApplications),
  notifications: many(notifications),
}));

export const companyDrivesRelations = relations(companyDrives, ({ many }) => ({
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  drive: one(companyDrives, {
    fields: [jobApplications.driveId],
    references: [companyDrives.id],
  }),
}));
