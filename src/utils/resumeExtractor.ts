import { ExtractedResumeInfo, ExtractedExperience, ExtractedProject } from '../types';

/**
 * Extracts candidate CGPA / GPA / percentage from resume text
 */
export function extractCgpaFromText(text: string): number | null {
  if (!text || typeof text !== 'string') return null;

  const patterns = [
    /(?:cgpa|gpa|cpi|sgpa|cumulative\s+gpa|overall\s+gpa|aggregate|pointer)[\s:=|\-–]+([0-9]+(?:\.[0-9]+)?)/i,
    /\b([0-9]\.[0-9]{1,2})\s*(?:\/\s*10|\/\s*4\.0|\s*cgpa|\s*gpa|\s*cpi)\b/i,
    /\b(?:cgpa|gpa)\s+is\s+([0-9]+(?:\.[0-9]+)?)/i,
    /\b(?:cgpa|gpa)\s*[:=\s]*([0-9]\.[0-9]{1,2})\b/i,
    /grade\s*(?:point\s*average)?[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
    /\b([0-9]\.[0-9]{1,2})\s*\/\s*10\.?0?\b/i,
    /([0-9]\.[0-9]{1,2})\s*(?:out of|\/)\s*10/i,
    /percentage[\s:=]+([0-9]{2}(?:\.[0-9]+)?)\s*%/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (!isNaN(val)) {
        // If percentage (e.g. 85%), convert to 10 scale
        if (val > 10 && val <= 100) {
          return Number((val / 10).toFixed(2));
        }
        if (val >= 0.0 && val <= 10.0) {
          return Number(val.toFixed(2));
        }
      }
    }
  }
  return null;
}

/**
 * Known tech skills dictionary for deep regex taxonomy matching
 */
const SKILL_TAXONOMY: Record<string, string[]> = {
  languages: [
    'Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C#', 'C', 'Go', 'Golang',
    'Rust', 'Ruby', 'Kotlin', 'Swift', 'PHP', 'SQL', 'HTML5', 'CSS3', 'HTML', 'CSS',
    'R', 'Dart', 'Scala', 'Bash', 'Shell', 'MATLAB'
  ],
  frameworks: [
    'React', 'React.js', 'Next.js', 'Node.js', 'Express', 'Express.js', 'Vue', 'Vue.js',
    'Angular', 'Django', 'FastAPI', 'Flask', 'Spring Boot', 'Spring', 'Tailwind CSS',
    'Tailwind', 'Redux', 'Zustand', 'GraphQL', 'REST API', 'REST APIs', 'ASP.NET',
    '.NET Core', 'Laravel', 'Bootstrap', 'PyTorch', 'TensorFlow', 'Scikit-learn',
    'Pandas', 'NumPy', 'OpenCV', 'Keras'
  ],
  databases: [
    'PostgreSQL', 'Postgres', 'MongoDB', 'MySQL', 'Redis', 'DynamoDB', 'SQLite',
    'Firebase', 'Supabase', 'Oracle', 'Cassandra', 'Elasticsearch', 'Prisma', 'Drizzle'
  ],
  cloudAndDevOps: [
    'AWS', 'Amazon Web Services', 'Docker', 'Kubernetes', 'GCP', 'Google Cloud',
    'Azure', 'Microsoft Azure', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Linux',
    'Nginx', 'Terraform', 'GitHub Actions', 'Jenkins', 'Vercel', 'Cloudflare',
    'Microservices', 'Distributed Systems', 'Serverless'
  ],
  coreCS: [
    'Data Structures', 'Algorithms', 'Data Structures & Algorithms', 'System Design',
    'Object Oriented Programming', 'OOP', 'Operating Systems', 'Computer Networks',
    'DBMS', 'Agile', 'Scrum', 'Unit Testing', 'Machine Learning', 'Artificial Intelligence',
    'Deep Learning', 'NLP', 'Computer Vision'
  ],
};

/**
 * Extracts comprehensive structured information from resume text
 */
export function extractComprehensiveResumeData(text: string): ExtractedResumeInfo {
  if (!text || typeof text !== 'string') {
    return {};
  }

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const info: ExtractedResumeInfo = {
    skillsByCategory: {
      languages: [],
      frameworks: [],
      databases: [],
      cloudAndDevOps: [],
      coreCS: [],
    },
    experiences: [],
    projects: [],
    certifications: [],
  };

  // 1. Email extraction
  const emailMatch = text.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/);
  if (emailMatch) {
    info.email = emailMatch[1].toLowerCase();
  }

  // 2. Phone extraction
  const phoneMatch = text.match(/(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{2,4})?/);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
    info.phone = phoneMatch[0].trim();
  }

  // 3. LinkedIn & GitHub extraction
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in\/)?([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    info.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
  }

  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    info.github = `github.com/${githubMatch[1]}`;
  }

  // 4. Candidate Name extraction (Check header lines before section headers)
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    // Ignore lines with emails, urls, or obvious section headers
    if (
      line.includes('@') ||
      line.includes('http') ||
      line.includes('www.') ||
      line.includes('.com') ||
      /^(resume|curriculum|cv|education|skills|experience|projects|contact|profile|objective|summary)$/i.test(line)
    ) {
      continue;
    }

    // Check if line has "Name: John Doe" or is just "John Doe"
    const explicitNameMatch = line.match(/^(?:candidate(?:\s+name)?|name)[\s:=]+([A-Za-z\s.'-]+)/i);
    if (explicitNameMatch && explicitNameMatch[1].trim().length > 2) {
      info.name = explicitNameMatch[1].trim();
      break;
    }

    // Clean single line name candidate (typically 2-4 words, alpha only)
    const cleanLine = line.replace(/[-|•].*$/, '').trim();
    if (
      cleanLine.length >= 3 &&
      cleanLine.length <= 40 &&
      /^[A-Za-z\s.'-]+$/.test(cleanLine) &&
      cleanLine.split(/\s+/).length <= 4
    ) {
      info.name = cleanLine;
      break;
    }
  }

  // 5. Academic Details & CGPA
  info.cgpa = extractCgpaFromText(text) || undefined;

  // Degree extraction
  const degreeMatch = text.match(/\b(B\.?Tech|B\.?E\.?|B\.?S\.?|B\.?Sc|BCA|M\.?Tech|M\.?E\.?|M\.?S\.?|MCA|M\.?Sc|Bachelor of Technology|Bachelor of Engineering|Bachelor of Science|Master of Technology)\b/i);
  if (degreeMatch) {
    info.degree = degreeMatch[0];
  }

  // Branch extraction
  const branchMatch = text.match(/\b(Computer Science(?:\s*&(?:amp;)?\s*Engineering)?|Information Technology|Electronics\s*(?:&(?:amp;)?\s*Communication)?(?:\s*Engineering)?|Electrical Engineering|Mechanical Engineering|Civil Engineering|Artificial Intelligence|Data Science|Software Engineering)\b/i);
  if (branchMatch) {
    info.branch = branchMatch[0];
  }

  // Institution / University
  const institutionMatch = text.match(/\b([A-Za-z\s]+(?:Institute of Technology|University|College of Engineering|IIT|NIT|IIIT|BITS|VIT|SRM|Academy|State University))\b/i);
  if (institutionMatch) {
    info.institution = institutionMatch[1].trim().slice(0, 60);
  }

  // Graduation Year / Batch
  const yearMatch = text.match(/\b(202[1-9]|203[0-2])\b/g);
  if (yearMatch && yearMatch.length > 0) {
    info.graduationYear = yearMatch[yearMatch.length - 1];
  }

  // 6. Skills extraction across taxonomy
  const lowerText = text.toLowerCase();
  const foundSkills: Set<string> = new Set();

  for (const [category, skillList] of Object.entries(SKILL_TAXONOMY)) {
    const matchedCategorySkills: string[] = [];
    for (const skill of skillList) {
      // Escape for regex
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
      if (regex.test(text) || lowerText.includes(skill.toLowerCase())) {
        matchedCategorySkills.push(skill);
        foundSkills.add(skill);
      }
    }
    if (info.skillsByCategory) {
      (info.skillsByCategory as any)[category] = Array.from(new Set(matchedCategorySkills));
    }
  }

  // 7. Experiences & Internships extraction
  const expMatch = text.match(/(?:EXPERIENCE|WORK EXPERIENCE|INTERNSHIPS|EMPLOYMENT HISTORY)[\s\S]*?(?=(?:PROJECTS|TECHNICAL PROJECTS|EDUCATION|ACADEMIC|SKILLS|ACHIEVEMENTS|CERTIFICATIONS|$))/i);
  if (expMatch && expMatch[0]) {
    const expLines = expMatch[0].split('\n').map((l) => l.trim()).filter(Boolean).slice(1);
    const exps: ExtractedExperience[] = [];
    let currentExp: ExtractedExperience | null = null;

    for (const line of expLines) {
      if (line.includes('|') || /(?:Intern|Engineer|Developer|Analyst|Lead|Specialist|Associate|Coordinator)/i.test(line)) {
        if (currentExp && (currentExp.role || currentExp.company)) {
          exps.push(currentExp);
        }
        const parts = line.split(/[|–-]/).map((p) => p.trim());
        currentExp = {
          role: parts[0] || 'Software Engineer Intern',
          company: parts[1] || 'Tech Company',
          duration: parts[2] || 'Summer Internship',
          description: '',
        };
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        if (currentExp) {
          currentExp.description = (currentExp.description ? currentExp.description + ' ' : '') + line.replace(/^[-•*]\s*/, '');
        }
      }
    }
    if (currentExp && (currentExp.role || currentExp.company)) {
      exps.push(currentExp);
    }
    info.experiences = exps.slice(0, 4);
  }

  // 8. Projects extraction
  const projMatch = text.match(/(?:PROJECTS|ACADEMIC PROJECTS|KEY PROJECTS|TECHNICAL PROJECTS)[\s\S]*?(?=(?:EXPERIENCE|EDUCATION|SKILLS|ACHIEVEMENTS|CERTIFICATIONS|$))/i);
  if (projMatch && projMatch[0]) {
    const projLines = projMatch[0].split('\n').map((l) => l.trim()).filter(Boolean).slice(1);
    const projects: ExtractedProject[] = [];
    let currentProj: ExtractedProject | null = null;

    for (const line of projLines) {
      if (line.includes('|') || (line.length > 5 && line.length < 80 && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*') && !/^(built|developed|created|implemented|engineered)/i.test(line))) {
        if (currentProj && currentProj.title) {
          projects.push(currentProj);
        }
        const parts = line.split(/[|–-]/).map((p) => p.trim());
        const rawTech = parts.slice(1).join(', ');
        const techList = rawTech.split(/[,/]/).map((t) => t.trim()).filter((t) => t.length > 1);
        currentProj = {
          title: parts[0] || 'Technical Project',
          technologies: techList.length > 0 ? techList : ['TypeScript', 'Full-Stack'],
          description: '',
        };
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        if (currentProj) {
          currentProj.description = (currentProj.description ? currentProj.description + ' ' : '') + line.replace(/^[-•*]\s*/, '');
        }
      }
    }
    if (currentProj && currentProj.title) {
      projects.push(currentProj);
    }
    info.projects = projects.slice(0, 4);
  }

  // 9. Achievements / Certifications
  const certMatch = text.match(/(?:ACHIEVEMENTS|CERTIFICATIONS|HONORS|AWARDS)[\s\S]*?(?=(?:EXPERIENCE|PROJECTS|EDUCATION|SKILLS|$))/i);
  if (certMatch && certMatch[0]) {
    const certLines = certMatch[0]
      .split('\n')
      .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
      .filter((l) => l.length > 5 && !/^(achievements|certifications|honors|awards)$/i.test(l))
      .slice(0, 5);
    info.certifications = certLines;
  }

  return info;
}
