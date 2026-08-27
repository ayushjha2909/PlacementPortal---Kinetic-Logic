# PlacementPortal 🎓💼
### Next-Generation Campus Placement Readiness & Recruitment Intelligence Platform

PlacementPortal is a production-grade campus recruitment and placement readiness management platform built with React 19, TypeScript, Tailwind CSS, Express, and PostgreSQL (via Drizzle ORM). It bridges the gap between student candidates and institutional Training & Placement Officers (TPOs) through intelligent ATS resume parsing, structured credential extraction, multi-platform competitive programming aggregation, in-browser code execution sandbox, AI mock interview simulations, company-specific placement mentorship, automated job matching, and real-time recruitment drive administration.

---

## ✨ Key Capabilities & Modules

### 👨‍🎓 1. Student Candidate Portal
- **Intelligent ATS Resume Parser & Data Extractor**:
  - **Multi-Format Document Parsing**: Upload and extract clean text from PDF, DOCX, TXT, and Markdown files with sub-second parsing.
  - **Structured Credential Extraction**: Deterministic and AI-powered extraction of candidate **Name, Email, Phone, Degree, Branch/Major, Institution, Graduation Batch, and exact CGPA/GPA**.
  - **Categorized Technical Skills Taxonomy**: Automatically classifies technical skills into *Languages, Frameworks, Databases, Cloud & DevOps, and Core CS (DSA, DBMS, OS, System Design)*.
  - **Experience & Project Recognition**: Extracts company names, job titles, tenures, descriptions, and technical project stacks.
  - **Interactive Extracted Profile View**: Seamlessly switch between *Extracted Profile & Details*, *Formatted Document Preview*, and *Raw Text Editor*.
  - **One-Click Profile Sync**: Automatically synchronize extracted resume details, verified CGPA, and technical skills directly into your student portal account.
  - **ATS Compatibility Scoring**: Multi-dimensional scoring across readability, formatting, keyword density, and quantified impact with actionable improvement suggestions.

- **Multi-Platform Coding Profile Aggregator**:
  - Unifies competitive programming handles across **LeetCode**, **CodeChef**, **Codeforces**, **GeeksforGeeks**, **HackerRank**, and **Coding Ninjas**.
  - Aggregates DSA problem counts, platform percentiles, contest ratings, active streaks, and topic readiness.
  - AI-driven diagnostic analysis predicting campus placement round clearance chances.

- **Interactive Coding Practice Arena & IDE**:
  - In-browser code runner supporting **JavaScript (Node.js 20)** and **Python 3.11**.
  - Curated DSA and System Design challenges tested in Google, Amazon, Microsoft, and Atlassian online assessments.
  - Automated test case verification, console logs output, and Gemini AI time/space complexity analysis.

- **AI Mock Interview Simulator**:
  - Realistic technical and HR/behavioral mock interview scenarios with voice speech synthesis and text responses.
  - Granular post-interview evaluations across technical depth, communication, and STAR method problem-solving.

- **RAG-Grounded AI Placement Mentor**:
  - Interactive career coach trained on tier-1 hiring patterns, system design questions, and DSA interview roadmaps.
  - Pre-seeded contextual prompts for salary negotiation, OA strategies, and resume optimization.

- **Recruiter Radar & Campus Job Matcher**:
  - Automated job recommendations matched against student CGPA, skills, branch, and coding rank.
  - One-click application tracking with eligibility validation, missing skill gap indicators, and deadline alerts.

---

### 🏛️ 2. Training & Placement Officer (TPO) Command Center
- **Executive Cohort Analytics & Bento Dashboard**:
  - Department-wise placement percentages, offer velocity, CTC distributions, and recruitment funnel trends.
- **Student Verification & Dossier Inspector**:
  - Filter and inspect student eligibility (CGPA thresholds, backlog criteria, branch, coding percentiles).
  - Export standardized candidate dossiers and PDF portfolios for recruiting company panels.
- **Campus Recruitment Drive Manager**:
  - Create, schedule, and update campus placement drives, registration deadlines, and eligibility criteria.
  - Manage candidate shortlists and status transitions across rounds (OA, Technical, HR, Offered).
- **Relational Session & Audit Logs**:
  - Track student logins, sign-outs, role switches, and authentication events with PostgreSQL audit tracking.

---

## 📱 Responsive Design Architecture

PlacementPortal is engineered with **fluid responsive layouts** tailored for mobile, tablet, and desktop viewports:
- **Responsive Bento Grids**: Multi-column grids automatically stack on mobile devices (`grid-cols-1 lg:grid-cols-12`) with mathematically calculated inner and outer padding.
- **Touch-Friendly Controls**: Touch targets meet WCAG standards (minimum 44px) with custom scrollbars and smooth drawer transitions.
- **Adaptive Navigation**: Sticky responsive navigation bar with dedicated mobile menu drawers and tab bars.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend & API Layer**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database & ORM**: **PostgreSQL** with [Drizzle ORM](https://orm.drizzle.team/) (with non-blocking in-memory fallback)
- **AI Engine**: Google Gemini API via secure server-side proxies
- **Document & File Parsers**: `pdf-parse`, `mammoth` (DOCX extraction)
- **Animations & Icons**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **Build System**: [Vite](https://vitejs.dev/) + [esbuild](https://esbuild.github.io/)

---

## 📁 Project Structure

```
placement-portal/
├── src/
│   ├── components/                     # React UI components & sub-views
│   │   ├── AIMentorChat.tsx            # AI placement advisor & chat
│   │   ├── AccessDenied.tsx            # Role-based access control screen
│   │   ├── AddCodingProfileModal.tsx   # Modal to add competitive coding handles
│   │   ├── AuthModal.tsx               # Login, sign-up, and demo account switcher
│   │   ├── CodingPractice.tsx          # Coding Arena, IDE & Profiles Hub
│   │   ├── CodingProfileAnalysisView.tsx# Aggregated coding stats & AI diagnostics
│   │   ├── CompanyMatches.tsx          # Job drives catalog & quick application flow
│   │   ├── JobApplyModal.tsx           # Job application submission modal
│   │   ├── LandingPage.tsx             # Interactive landing page & feature overview
│   │   ├── MockInterviews.tsx          # AI technical & HR mock interview simulator
│   │   ├── Navigation.tsx              # Responsive top navigation & mobile menu
│   │   ├── PostgresAuditLogsView.tsx   # Live PostgreSQL authentication audit logs
│   │   ├── ProfileModal.tsx            # User profile, photo & credentials editor
│   │   ├── ReportModal.tsx             # TPO comprehensive placement report export
│   │   ├── ResumeScanner.tsx           # ATS resume scanner & structured extractor
│   │   ├── StudentDashboard.tsx        # Student central Bento dashboard
│   │   ├── StudentProfileDossierModal.tsx# Verified candidate dossier & recruiter view
│   │   └── TPODashboard.tsx            # TPO command center, drives & analytics
│   ├── data/                           # Mock data, preset resumes & seed items
│   │   └── mockData.ts
│   ├── db/                             # PostgreSQL connection & Drizzle ORM schemas
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── drizzle.config.ts
│   ├── utils/                          # Client utilities & helpers
│   ├── types.ts                        # TypeScript data models & schemas
│   ├── App.tsx                         # Main application component & routing
│   ├── main.tsx                        # Application entry point
│   └── index.css                       # Global Tailwind CSS styling
├── server/
│   ├── auth.ts                         # Password hashing & JWT authentication
│   ├── fileParser.ts                   # PDF & DOCX binary text parser
│   ├── resumeExtractor.ts              # Deterministic & regex resume extractor
│   ├── security.ts                     # Input sanitization, CORS & rate limiting
│   └── seedData.ts                     # Initial recruitment drives & sample data
├── server.ts                           # Express server & API endpoints
├── metadata.json                       # Application metadata & permissions
├── package.json                        # Dependencies & build scripts
├── vite.config.ts                      # Vite configuration
└── README.md                           # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18+ (Node 20+ LTS recommended)
- **npm**, **pnpm**, or **yarn**

### Quick Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd placement-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Configure required values in `.env`:
   ```env
   # Google Gemini API key for live AI features (ATS optimization, AI mentor, mock interviews)
   GEMINI_API_KEY=your_gemini_api_key_here

   # PostgreSQL Database Configuration (optional for local dev / automatically configured on Cloud SQL)
   SQL_HOST=localhost
   SQL_PORT=5432
   SQL_DB_NAME=placement_portal
   SQL_USER=postgres
   SQL_PASSWORD=your_password
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Reference Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check, PostgreSQL status, and server readiness probe |
| `/api/parse-resume-file` | `POST` | Binary parser for uploaded PDF/DOCX resume documents |
| `/api/gemini/ats-scan` | `POST` | AI-powered ATS scoring, keyword extraction, and structured parsing |
| `/api/gemini/mentor-chat` | `POST` | RAG-grounded placement mentor conversation engine |
| `/api/gemini/mock-interview-eval` | `POST` | Evaluates candidate interview answer and returns STAR rubric scoring |
| `/api/gemini/code-review` | `POST` | Analyzes code snippets for time/space complexity and optimization |
| `/api/gemini/coding-diagnostic` | `POST` | Generates predictive placement round clearance diagnostics |
| `/api/drives` | `GET` / `POST` | Lists or creates campus recruitment drives (TPO) |
| `/api/applications` | `GET` / `POST` | Manages student campus job applications and status |
| `/api/auth/register` | `POST` | Registers a new candidate or TPO account |
| `/api/auth/login` | `POST` | Authenticates user credentials and returns JWT token |
| `/api/auth/log` | `POST` | Logs user sign-in/sign-out events to audit storage |
| `/api/audit-logs` | `GET` | Fetches system activity and login audit logs (TPO) |

---

## 🔒 Security & Performance Highlights

1. **Server-Side Secret Containment**: All Gemini API keys and sensitive configurations remain strictly on the backend.
2. **Deterministic Fallbacks**: Resume parsing, skill classification, and CGPA extraction operate deterministically even when external API limits are encountered.
3. **Lazy-Loaded Document Parsers**: PDF (`pdf-parse`) and Word (`mammoth`) parsers are loaded dynamically to ensure fast cold-start times.
4. **WCAG AA Compliance**: High-contrast typography, accessible color scales, full keyboard navigation, and responsive touch targets.

---

## 📜 License

This project is licensed under the MIT License.
