# PlacementPortal 🎓💼
### Next-Generation Campus Placement Readiness & Recruitment Intelligence Platform

PlacementPortal is a full-stack campus recruitment and placement readiness management system. It bridges the gap between student candidates and institutional Training & Placement Officers (TPO) through intelligent ATS resume optimization, multi-platform competitive programming aggregation, AI mock interview simulations, company-specific placement mentorship, automated job matching, and real-time recruitment drive administration.

---

## ✨ Key Capabilities & Modules

### 👨‍🎓 1. Student Candidate Portal
- **ATS Resume Scanner & Keyword Optimizer**:
  - Live document parser supporting PDF, DOCX, TXT, and Markdown files.
  - Multi-dimensional scoring across readability, formatting, keyword density, and quantified impact.
  - AI-powered section rewrite suggestions and instant PDF readiness report generation.
- **Multi-Platform Coding Profile Aggregator**:
  - Unifies handles across **LeetCode**, **CodeChef**, **Codeforces**, **GeeksforGeeks**, **HackerRank**, and **Coding Ninjas**.
  - Calculates aggregated DSA problem counts, platform percentiles, contest ratings, and topic readiness.
- **Interactive Coding Sandbox**:
  - In-browser code runner with multiple programming language options (C++, Java, Python, JavaScript).
  - Built-in test cases, time/space complexity estimations, and automated solution verification.
- **AI Mock Interview Simulator**:
  - Realistic technical and HR/behavioral mock interview scenarios with voice and text responses.
  - Granular post-interview evaluations across technical depth, communication, and problem-solving.
- **RAG-Grounded AI Placement Mentor**:
  - Interactive career coach trained on tier-1 hiring patterns, system design questions, and DSA interview roadmaps.
- **Recruiter Radar & Campus Job Matcher**:
  - Automated job recommendations matched against student CGPA, skills, branch, and coding rank.
  - One-click application tracking with eligibility validation.

### 🏛️ 2. Training & Placement Officer (TPO) Command Center
- **Executive Cohort Analytics**:
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

## 🛠️ Tech Stack & Architecture

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend & API Layer**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database & ORM**: **PostgreSQL** with [Drizzle ORM](https://orm.drizzle.team/) (with non-blocking in-memory fallback)
- **AI Engine**: Google Gemini API via secure server-side proxies
- **Document & File Parsers**: `pdf-parse`, `mammoth` (DOCX extraction)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **Build System**: [Vite](https://vitejs.dev/) + [esbuild](https://esbuild.github.io/)

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

---

## 📡 API Reference Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check and server readiness probe |
| `/api/parse-resume-file` | `POST` | Uploads and extracts text from PDF / DOCX / TXT resumes |
| `/api/ai/resume-scanner` | `POST` | AI-powered ATS scoring, keyword extraction, and suggestions |
| `/api/ai/mentor-chat` | `POST` | RAG-grounded placement mentor conversation engine |
| `/api/ai/mock-interview/start` | `POST` | Generates role-specific mock interview questions |
| `/api/ai/mock-interview/evaluate` | `POST` | Evaluates candidate answer and returns rubric scoring |
| `/api/coding-profiles/aggregate` | `POST` | Aggregates DSA metrics across competitive programming sites |
| `/api/notifications` | `GET` | Retrieves active campus drive alerts and notifications |
| `/api/drives` | `GET` / `POST` | Lists or creates campus recruitment drives (TPO) |
| `/api/auth/log` | `POST` | Logs user sign-in/sign-out events to audit storage |
| `/api/audit-logs` | `GET` | Fetches system activity and login audit logs (TPO) |

---

## 🔒 Security & Performance Guidelines

1. **Server-Side AI Gateway**: API keys are strictly contained within server-side endpoints and never exposed to the client.
2. **Dynamic Lazy Loading**: Binary parsers (PDF and Word document processors) are loaded on-demand to guarantee instant server boot times.
3. **Resilient Data Strategy**: Features run with automated database synchronization and graceful offline/memory fallbacks.
4. **WCAG AA Compliance**: High-contrast, legible typography, focus states, and responsive touch targets across all viewport sizes.

---

## 📜 License

This project is released under the MIT License.
