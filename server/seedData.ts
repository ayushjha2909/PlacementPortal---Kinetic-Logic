import { getDb } from '../src/db/index';
import { companyDrives, users } from '../src/db/schema';
import { hashPassword } from './auth';
import { eq } from 'drizzle-orm';

export const INITIAL_DRIVES = [
  {
    driveCode: 'DRV-GOOG-2026',
    companyName: 'Google',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=60',
    roleTitle: 'Software Engineer (Early Career / Campus)',
    tier: 'Super Dream' as const,
    packageLpa: 45.0,
    location: 'Bangalore / Hyderabad / Hybrid',
    minCgpa: 8.0,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'IT', 'ECE', 'AI & DS'],
    skillsRequired: ['Data Structures', 'Algorithms', 'Distributed Systems', 'C++', 'Java', 'Python'],
    description:
      'Join Google Core Engineering. You will design, develop, test, deploy, maintain, and enhance large-scale distributed software applications.',
    rounds: ['Online Coding Assessment (2 Qs)', 'Technical Interview 1 (DSA)', 'Technical Interview 2 (System Design/Algorithms)', 'Googlyness & Leadership'],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: 'ACTIVE' as const,
  },
  {
    driveCode: 'DRV-AMZN-2026',
    companyName: 'Amazon',
    logoUrl: 'https://images.unsplash.com/photo-1523474253246-73be6cb3225a?w=100&auto=format&fit=crop&q=60',
    roleTitle: 'Software Development Engineer I (SDE-1)',
    tier: 'Tier-1' as const,
    packageLpa: 32.5,
    location: 'Bangalore / Chennai / Hyderabad',
    minCgpa: 7.5,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'IT', 'ECE', 'EE', 'AI & DS'],
    skillsRequired: ['Object-Oriented Design', 'Java', 'DSA', 'AWS Cloud', 'REST APIs'],
    description:
      'Build scalable distributed systems powering hundreds of millions of customers globally. Apply Amazon Leadership Principles to drive high-impact architecture.',
    rounds: ['Online Assessment (Debugging + Coding)', 'Technical Round 1 (DSA & Problem Solving)', 'Technical Round 2 (OOP & Low-Level Design)', 'Bar Raiser Round'],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'ACTIVE' as const,
  },
  {
    driveCode: 'DRV-MSFT-2026',
    companyName: 'Microsoft',
    logoUrl: 'https://images.unsplash.com/photo-1642132652806-94303498808d?w=100&auto=format&fit=crop&q=60',
    roleTitle: 'Software Engineer - Azure Cloud Core',
    tier: 'Tier-1' as const,
    packageLpa: 34.0,
    location: 'Hyderabad / Noida / Remote',
    minCgpa: 7.5,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'IT', 'ECE', 'AI & DS'],
    skillsRequired: ['C#', 'C++', 'Go', 'Cloud Computing', 'Operating Systems', 'Algorithms'],
    description:
      'Empower every person and every organization on the planet to achieve more. Work on Azure Compute, Networking, and Next-Gen Cloud Orchestration.',
    rounds: ['Online Assessment', 'Technical Round 1 (Data Structures)', 'Technical Round 2 (Concurrency & Systems)', 'Director Interview / Fitment'],
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    status: 'ACTIVE' as const,
  },
  {
    driveCode: 'DRV-ATLS-2026',
    companyName: 'Atlassian',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    roleTitle: 'Graduate Software Engineer',
    tier: 'Super Dream' as const,
    packageLpa: 42.0,
    location: 'Bengaluru / Remote Work From Anywhere',
    minCgpa: 8.0,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'IT', 'AI & DS'],
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Microservices', 'Distributed Systems'],
    description:
      'Unleash the potential of every team. Build Jira, Confluence, and Loom collaboration engines utilized by millions worldwide.',
    rounds: ['HackerRank Coding Test', 'DSA & Craftsmanship Round', 'System Design & Code Quality', 'Values & Leadership Round'],
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    status: 'ACTIVE' as const,
  },
  {
    driveCode: 'DRV-ADBE-2026',
    companyName: 'Adobe',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&auto=format&fit=crop&q=60',
    roleTitle: 'Member of Technical Staff (MTS-1)',
    tier: 'Tier-1' as const,
    packageLpa: 28.0,
    location: 'Noida / Bengaluru',
    minCgpa: 7.0,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'IT', 'ECE', 'Mechanical', 'AI & DS'],
    skillsRequired: ['C++', 'Graphics / WebGL', 'React', 'Algorithm Optimization', 'Python'],
    description:
      'Transform digital experiences with Creative Cloud and Document Cloud platforms. Focus on high-performance graphics engines and AI-assisted workflows.',
    rounds: ['Online Assessment', 'Round 1: DSA & Math', 'Round 2: Problem Solving & Architecture', 'HR & Cultural Alignment'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'ACTIVE' as const,
  },
];

/**
 * Seeds default drives and default users if table is empty
 */
export async function seedInitialDataIfNeeded() {
  const db = getDb();
  if (!db) return;

  try {
    const existingDrives = await db.select().from(companyDrives).limit(1);
    if (existingDrives.length === 0) {
      console.log('[PostgreSQL Seed] Seeding initial campus company placement drives...');
      for (const d of INITIAL_DRIVES) {
        await db
          .insert(companyDrives)
          .values(d)
          .onConflictDoNothing();
      }
      console.log('[PostgreSQL Seed] Initial company drives seeded successfully.');
    }

    // Seed default demo users with hashed passwords
    const defaultPassword = await hashPassword('placement2026');
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length === 0) {
      console.log('[PostgreSQL Seed] Seeding default student and TPO admin accounts...');
      await db.insert(users).values([
        {
          uid: 'std_demo_101',
          name: 'Aarav Sharma',
          email: 'aarav.sharma@university.edu',
          passwordHash: defaultPassword,
          role: 'student',
          branch: 'Computer Science & Engineering',
          batch: '2026',
          cgpa: 8.92,
          backlogs: 0,
          skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Data Structures', 'Python', 'Docker'],
          latestAtsScore: 88,
          codingProfiles: {
            leetcode: 'aarav_sharma26',
            geeksforgeeks: 'aarav_gfg',
            codeforces: 'aarav_cf',
          },
        },
        {
          uid: 'tpo_admin_001',
          name: 'Dr. Rajesh Deshmukh',
          email: 'tpo.head@university.edu',
          passwordHash: defaultPassword,
          role: 'admin',
          branch: 'Training & Placement Cell',
          batch: 'Head of Placements',
          cgpa: 10.0,
          backlogs: 0,
          skills: ['Corporate Relations', 'Placement Analytics', 'Talent Screening'],
        },
      ]).onConflictDoNothing();
      console.log('[PostgreSQL Seed] Default users seeded successfully.');
    }
  } catch (err: any) {
    console.warn('[PostgreSQL Seed] Notice during data check/seed:', err?.message);
  }
}
