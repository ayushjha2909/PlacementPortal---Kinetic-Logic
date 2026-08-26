import { 
  User, 
  JobOpening, 
  TimelineEvent, 
  ATSScanResult, 
  CompanyInsight, 
  CodingProblem, 
  TPODashboardStats, 
  StudentSkillGap, 
  PlacedStudentOffer,
  StudentCandidateProfile
} from '../types';

export const currentUser: User = {
  id: 'usr_alex_01',
  name: 'Alex Mercer',
  email: 'alex.mercer@university.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  branch: 'Computer Science & Engineering',
  batch: '2024-2025',
  cgpa: 8.84,
  readinessScore: 85,
  skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Data Structures', 'Algorithms', 'AWS'],
  resumeUrl: 'Software_Eng_Resume_v2.pdf'
};

export const adminUser: User = {
  id: 'usr_tpo_01',
  name: 'Dr. Vikramaditya Rao',
  email: 'tpo.director@university.edu',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  branch: 'Training & Placement Office',
  batch: 'Faculty Administration'
};

export const initialATSResult: ATSScanResult = {
  score: 85,
  fileName: 'Software_Eng_Resume_v2.pdf',
  timestamp: '2 hours ago',
  breakdown: {
    formattingReadability: 95,
    keywordOptimization: 65,
    experienceImpact: 85,
  },
  missingKeywords: ['Docker', 'System Design', 'CI/CD Pipeline', 'Kubernetes', 'Microservices', 'GraphQL'],
  matchedKeywords: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'REST API', 'Git', 'Agile', 'AWS S3', 'Redis'],
  roleMatch: 'Full-Stack / Software Development Engineer (SDE-1)',
  extractedSkills: ['TypeScript', 'React.js', 'Python', 'FastAPI', 'Express', 'SQL', 'Algorithms', 'Unit Testing'],
  summaryFeedback: 'Resume showcases strong project foundations and solid backend experience. Adding quantified latency metrics and cloud infrastructure keywords (Docker, CI/CD) will easily elevate the parse rate past 92%.',
  suggestions: [
    {
      id: 'sug_1',
      type: 'metric',
      title: "Quantify 'Developed API' bullet point",
      description: "Add clear metrics (e.g., 'Reduced query latency by 28% across 50k daily active users') to substantiate real engineering impact.",
    },
    {
      id: 'sug_2',
      type: 'summary',
      title: "Rephrase Objective & Summary Statement",
      description: "Current summary is slightly generic. Tailor it to highlight specific proficiencies in distributed systems and modern cloud architectures.",
    },
    {
      id: 'sug_3',
      type: 'skill',
      title: "Add Containerization & DevOps Stack",
      description: "Top recruiters (Google, Amazon, Microsoft) heavily scan for Docker, Kubernetes, and automated CI/CD testing in SDE roles.",
    }
  ]
};

export const sampleResumes = [
  {
    id: 'res_sde',
    title: 'Software Engineer Application (Current)',
    fileName: 'Software_Eng_Resume_v2.pdf',
    targetRole: 'Software Engineer, L3 / SDE-1',
    content: `ALEX MERCER
alex.mercer@university.edu | +1 (555) 234-5678 | github.com/alexmercer | linkedin.com/in/alexmercer

EDUCATION
B.Tech in Computer Science & Engineering | University Institute of Technology | CGPA: 8.84/10 | 2021 – 2025
Relevant Coursework: Data Structures & Algorithms, Database Management, Operating Systems, Computer Networks.

TECHNICAL SKILLS
Languages: Python, TypeScript, JavaScript, SQL, C++, HTML5/CSS3
Frameworks & Libraries: React, Node.js, Express, FastAPI, Tailwind CSS, Next.js
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Git, Linux

EXPERIENCE
Software Engineering Intern | CloudScale Technologies | Jun 2024 – Aug 2024
• Engineered responsive dashboard interfaces in React and TypeScript for real-time telemetry monitoring.
• Built REST API microservices in Node.js and Express to aggregate sensor data from 10,000+ IoT nodes.
• Optimized PostgreSQL query execution plans, decreasing average API response times by 35%.
• Collaborated with senior engineers in daily standups and agile sprint reviews.

PROJECTS
Campus Placement Portal & ATS Engine | React, Express, PostgreSQL, AI SDK
• Developed full-stack placement portal enabling students to parse resumes and practice mock technical rounds.
• Integrated LLM-based structured evaluation with STAR rubric scoring and real-time feedback.
• Implemented role-based access control (RBAC) separating student and TPO administrative dashboards.

Distributed Key-Value Cache Store | Python, Socket Programming, Redis Protocol
• Built an in-memory key-value caching system supporting LRU eviction and concurrent TCP connections.
• Achieved sub-5ms read/write latencies benchmarked with 100,000 requests.

ACHIEVEMENTS & CERTIFICATIONS
• Ranked Top 5% in National Inter-College Algorithmic Coding Challenge (5,000+ participants).
• AWS Certified Cloud Practitioner (2024).
• Solved 450+ Data Structures & Algorithms problems across LeetCode & Codeforces.`
  },
  {
    id: 'res_frontend',
    title: 'Frontend React Specialist Resume',
    fileName: 'Alex_Frontend_Engineer.pdf',
    targetRole: 'Frontend UI/UX Engineer',
    content: `ALEX MERCER - FRONTEND DEVELOPER
Passionate frontend engineer specializing in React 19, TypeScript, state management, and accessible UI/UX design systems. Experienced in building high-performance web applications with modern styling frameworks like Tailwind CSS and Motion animations.`
  },
  {
    id: 'res_data',
    title: 'Data Science & AI Track Resume',
    fileName: 'Alex_DataScience_ML.pdf',
    targetRole: 'Data Scientist / ML Engineer',
    content: `ALEX MERCER - DATA SCIENTIST & ML ENGINEER
Proficient in Python, PyTorch, Scikit-learn, SQL, Pandas, LLM fine-tuning, RAG architectures, and statistical modeling. 8.84 CGPA with proven background in NLP and recommendation engines.`
  }
];

export const mockJobs: JobOpening[] = [
  {
    id: 'job_google_01',
    company: 'Google',
    logoLetter: 'G',
    logoColor: '#4285F4',
    role: 'Software Engineer, L3',
    location: 'Mountain View (Hybrid)',
    type: 'Hybrid',
    matchPercentage: 92,
    matchBasis: 'Resume',
    packageLpa: 32.0,
    eligibility: {
      minCgpa: 8.0,
      branches: ['Computer Science', 'Information Tech', 'Electronics'],
      batch: '2025'
    },
    requiredSkills: ['Data Structures', 'Algorithms', 'Python', 'C++', 'System Design', 'Distributed Systems'],
    description: 'Build scalable next-generation systems, improve search indexing pipelines, and contribute to planetary-scale infrastructure.',
    deadline: 'Oct 28, 2026',
    applied: false
  },
  {
    id: 'job_msft_01',
    company: 'Microsoft',
    logoLetter: 'M',
    logoColor: '#00A4EF',
    role: 'Cloud Solutions Architect',
    location: 'Seattle (Remote)',
    type: 'Remote',
    matchPercentage: 88,
    matchBasis: 'Skills',
    packageLpa: 28.5,
    eligibility: {
      minCgpa: 7.5,
      branches: ['Computer Science', 'Information Tech', 'Software Eng'],
      batch: '2025'
    },
    requiredSkills: ['Azure / AWS', 'React', 'Node.js', 'Distributed Systems', 'CI/CD'],
    description: 'Design enterprise cloud architectures, collaborate with customer engineering teams, and implement resilient microservices.',
    deadline: 'Nov 04, 2026',
    applied: true,
    status: 'Assessment Scheduled'
  },
  {
    id: 'job_aws_01',
    company: 'AWS',
    logoLetter: 'A',
    logoColor: '#FF9900',
    role: 'Backend Developer',
    location: 'Austin (On-site)',
    type: 'On-site',
    matchPercentage: 81,
    matchBasis: 'Resume',
    missingSkill: 'DynamoDB',
    packageLpa: 26.0,
    eligibility: {
      minCgpa: 7.5,
      branches: ['Computer Science', 'Information Tech', 'Electronics'],
      batch: '2025'
    },
    requiredSkills: ['Java / Python', 'DynamoDB', 'Distributed Systems', 'REST API', 'Docker'],
    description: 'Develop high-throughput cloud services underpinning Amazon Web Services compute and serverless products.',
    deadline: 'Nov 12, 2026',
    applied: false
  },
  {
    id: 'job_atlassian_01',
    company: 'Atlassian',
    logoLetter: 'AT',
    logoColor: '#0052CC',
    role: 'Full Stack Graduate Engineer',
    location: 'Bengaluru (Hybrid)',
    type: 'Hybrid',
    matchPercentage: 94,
    matchBasis: 'Skills',
    packageLpa: 30.0,
    eligibility: {
      minCgpa: 8.0,
      branches: ['Computer Science', 'Information Tech'],
      batch: '2025'
    },
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Agile'],
    description: 'Work on Jira, Confluence, and Trello core collaboration experiences loved by millions of engineering teams worldwide.',
    deadline: 'Oct 31, 2026',
    applied: false
  },
  {
    id: 'job_uber_01',
    company: 'Uber',
    logoLetter: 'U',
    logoColor: '#000000',
    role: 'Software Engineer - Rider Experience',
    location: 'Hyderabad (Hybrid)',
    type: 'Hybrid',
    matchPercentage: 86,
    matchBasis: 'Skills',
    missingSkill: 'Kafka',
    packageLpa: 34.0,
    eligibility: {
      minCgpa: 8.2,
      branches: ['Computer Science', 'Information Tech'],
      batch: '2025'
    },
    requiredSkills: ['Golang / Java', 'Kafka', 'Redis', 'High Concurrency', 'Algorithms'],
    description: 'Build real-time dispatch systems, map routing algorithms, and payment transaction rails.',
    deadline: 'Nov 18, 2026',
    applied: false
  }
];

export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: 'evt_1',
    timeLabel: 'Today, 2:00 PM',
    title: 'Mock Interview: System Design',
    subtitle: 'With Senior Architect from Meta (AI Simulated)',
    type: 'interview',
    isLive: true
  },
  {
    id: 'evt_2',
    timeLabel: 'Tomorrow, 10:00 AM',
    title: 'Amazon Online Assessment',
    subtitle: '90 mins • 2 Coding Qs, Leadership Principles',
    type: 'assessment'
  },
  {
    id: 'evt_3',
    timeLabel: 'Oct 15, 3:30 PM',
    title: 'Resume Review & ATS Workshop',
    subtitle: 'Career Services Dept. & TPO Cell',
    type: 'workshop'
  },
  {
    id: 'evt_4',
    timeLabel: 'Oct 28, 11:59 PM',
    title: 'Google SDE-1 Application Deadline',
    subtitle: 'On-campus placement drive portal closing',
    type: 'deadline'
  }
];

export const companyInsightsData: Record<string, CompanyInsight> = {
  'Amazon (SDE II)': {
    company: 'Amazon',
    role: 'SDE II / SDE I Role',
    difficulty: 'Hard',
    difficultyPercentage: 85,
    commonTopics: ['Graphs / Trees', 'Dynamic Prog.', 'System Design', 'Object-Oriented Design'],
    keyFocusAreas: [
      '16 Leadership Principles (Customer Obsession, Bias for Action)',
      'Scalability & High Availability Architecture',
      'Code Maintainability & Clean Unit Tests',
      'Time & Space Complexity optimization'
    ],
    interviewStages: [
      'Online Assessment (2 DSA Coding Questions + Work Style Simulation)',
      'Technical Round 1: Data Structures & Problem Solving (Trees, Graphs)',
      'Technical Round 2: System Architecture & Low-Level Design',
      'Bar Raiser Round: Deep Dive Leadership Principles & Past Projects'
    ],
    sampleQuestions: [
      'Design a scalable URL shortener with rate limiting and analytics.',
      'Tell me about a time you made a decision without complete data (Bias for Action).',
      'Find the shortest path in a weighted grid with obstacles.'
    ]
  },
  'Google (SDE)': {
    company: 'Google',
    role: 'Software Engineer L3',
    difficulty: 'Very Hard',
    difficultyPercentage: 92,
    commonTopics: ['Dynamic Programming', 'Graph Traversal', 'Trie / Segment Trees', 'Concurrency'],
    keyFocusAreas: [
      'Algorithmic optimality & edge case handling',
      'Googleyness & Collaborative problem solving',
      'Thinking out loud and validating assumptions'
    ],
    interviewStages: [
      'Google Online Challenge (GOC)',
      'Technical Phone Screen (45 mins Live Coding)',
      'Virtual Onsite (3 Coding Rounds + 1 Googleyness & Leadership Round)'
    ],
    sampleQuestions: [
      'Given a stream of words, implement an autocomplete system with frequency weights.',
      'Serialize and deserialize an N-ary tree.',
      'How would you handle race conditions in a distributed counter?'
    ]
  },
  'Microsoft': {
    company: 'Microsoft',
    role: 'Software Development Engineer',
    difficulty: 'Hard',
    difficultyPercentage: 78,
    commonTopics: ['Linked Lists & Trees', 'System Design', 'SQL & Database Indexing', 'API Design'],
    keyFocusAreas: [
      'Growth Mindset and passion for technology',
      'Robust error handling and maintainable code',
      'Practical software engineering patterns'
    ],
    interviewStages: [
      'Codility / HackerRank Assessment',
      'Technical Round 1: DSA & Problem Solving',
      'Technical Round 2: Design & Cloud Concepts',
      'Director / AA (As Appropriate) Round'
    ],
    sampleQuestions: [
      'Design an LRU Cache with O(1) get and put operations.',
      'Explain how relational database indexes work and B+ Tree mechanics.',
      'Tell me about a time you had to learn a completely new technology quickly.'
    ]
  }
};

export const codingProblems: CodingProblem[] = [
  {
    id: 'code_01',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Data Structures',
    acceptance: '53.2%',
    solved: true,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
    },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' }
    ],
    hints: [
      'A brute force O(n^2) approach checks all pairs.',
      'Use a Hash Map to store seen elements and their indices for an optimal O(n) solution.'
    ]
  },
  {
    id: 'code_02',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Data Structures',
    acceptance: '41.8%',
    solved: true,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`
    },
    testCases: [
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true' }
    ],
    hints: [
      'Use a Stack data structure (LIFO).',
      'Push open brackets onto the stack. When seeing a close bracket, pop and verify matching type.'
    ]
  },
  {
    id: 'code_03',
    title: 'LRU Cache Implementation',
    difficulty: 'Medium',
    category: 'Data Structures',
    acceptance: '42.1%',
    solved: false,
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
• \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
• \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
• \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        input: 'LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); get(2);',
        output: '[null, null, null, 1, null, -1]',
        explanation: 'Key 2 was evicted because it was least recently used when key 3 was added.'
      }
    ],
    starterCode: {
      javascript: `class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this._remove(this.map.get(key));
    }
    const node = new Node(key, value);
    this._add(node);
    this.map.set(key, node);
    if (this.map.size > this.capacity) {
      const lru = this.head.next;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _add(node) {
    const prev = this.tail.prev;
    prev.next = node;
    node.prev = prev;
    node.next = this.tail;
    this.tail.prev = node;
  }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        # Combine Hash Map + Doubly Linked List for O(1) operations
`
    },
    testCases: [
      { input: 'Capacity: 2, ops: put(1,1), put(2,2), get(1)', expectedOutput: '1' },
      { input: 'Capacity: 2, ops: put(3,3), get(2)', expectedOutput: '-1' }
    ],
    hints: [
      'Combine a Hash Map with a Doubly Linked List.',
      'The Hash Map provides O(1) key lookup, while the Doubly Linked List allows O(1) node removal and insertion.'
    ]
  },
  {
    id: 'code_04',
    title: 'Dijkstra Shortest Path Algorithm',
    difficulty: 'Hard',
    category: 'Algorithms',
    acceptance: '38.6%',
    solved: false,
    description: `Given a weighted directed graph represented as an adjacency list and a starting source vertex \`src\`, find the shortest distance from \`src\` to all other reachable vertices.

Return an array containing the minimum distance to each vertex, or \`-1\` if a vertex cannot be reached.`,
    examples: [
      {
        input: 'V = 4, edges = [[0,1,1],[0,2,4],[1,2,2],[1,3,6],[2,3,3]], src = 0',
        output: '[0, 1, 3, 6]',
        explanation: 'Path to 2 is 0->1->2 with cost 1+2=3.'
      }
    ],
    starterCode: {
      javascript: `function dijkstra(V, edges, src) {
  // Build adjacency list
  const adj = Array.from({ length: V }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
  }

  const dist = new Array(V).fill(Infinity);
  dist[src] = 0;
  
  // Priority queue / min-heap simulated
  const pq = [[0, src]]; // [cost, vertex]

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();

    if (d > dist[u]) continue;

    for (const [v, weight] of adj[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.push([dist[v], v]);
      }
    }
  }

  return dist.map(d => (d === Infinity ? -1 : d));
}`,
      python: `import heapq

def dijkstra(V, edges, src):
    adj = {i: [] for i in range(V)}
    for u, v, w in edges:
        adj[u].append((v, w))
    
    dist = [float('inf')] * V
    dist[src] = 0
    pq = [(0, src)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    
    return [d if d != float('inf') else -1 for d in dist]`
    },
    testCases: [
      { input: 'V=4, edges=[[0,1,1],[0,2,4],[1,2,2],[1,3,6],[2,3,3]], src=0', expectedOutput: '[0, 1, 3, 6]' }
    ],
    hints: [
      'Use a Min-Priority Queue (Binary Heap).',
      'Greedily relax the edge weights of the smallest tentative distance node.'
    ]
  },
  {
    id: 'code_05',
    title: 'Top K Placed Students by Department',
    difficulty: 'Medium',
    category: 'SQL & Databases',
    acceptance: '64.5%',
    solved: true,
    description: `Write a PostgreSQL query to find the top 2 highest package earners in each department. If there is a tie in salary package, sort by \`cgpa\` descending.

Table: \`Students\` (id, name, branch_id, package_lpa, cgpa)
Table: \`Branches\` (id, branch_name)`,
    examples: [
      {
        input: 'Students and Branches tables',
        output: 'branch_name, student_name, package_lpa, rank',
        explanation: 'Uses DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY package_lpa DESC, cgpa DESC)'
      }
    ],
    starterCode: {
      javascript: `-- Write your SQL Query below
WITH RankedStudents AS (
  SELECT 
    b.branch_name,
    s.name AS student_name,
    s.package_lpa,
    s.cgpa,
    DENSE_RANK() OVER (
      PARTITION BY s.branch_id 
      ORDER BY s.package_lpa DESC, s.cgpa DESC
    ) as rank_num
  FROM Students s
  JOIN Branches b ON s.branch_id = b.id
)
SELECT branch_name, student_name, package_lpa
FROM RankedStudents
WHERE rank_num <= 2
ORDER BY branch_name, rank_num;`,
      python: `# SQL Query Solution
query = """
SELECT b.branch_name, s.name, s.package_lpa
FROM (
  SELECT *, DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY package_lpa DESC) as rnk
  FROM Students
) s JOIN Branches b ON s.branch_id = b.id
WHERE rnk <= 2;
"""`
    },
    testCases: [
      { input: 'Branches: CS, IT, EC', expectedOutput: 'Ranked records <= 2 per branch' }
    ],
    hints: [
      'Use Window Functions: `DENSE_RANK()` or `ROW_NUMBER()`.',
      'Partition by `branch_id` and order by `package_lpa DESC`.'
    ]
  }
];

export const tpoStats: TPODashboardStats = {
  totalStudents: 1248,
  totalStudentsGrowth: '+12% from last year',
  placedPercentage: 68.4,
  avgPackageLpa: 8.4,
  medianPackageLpa: 7.2,
  topRecruiter: 'TechCorp Inc.',
  topRecruiterOffers: 42,
  techReadiness: [
    { skill: 'Python', percentage: 85 },
    { skill: 'Java', percentage: 60 },
    { skill: 'DSA', percentage: 92 },
    { skill: 'System Des.', percentage: 35 },
    { skill: 'React', percentage: 70 },
    { skill: 'SQL', percentage: 50 },
    { skill: 'Cloud / AWS', percentage: 45 },
    { skill: 'Docker', percentage: 28 }
  ],
  softSkillsReadiness: [
    { skill: 'STAR Method', percentage: 74 },
    { skill: 'Verbal Comm.', percentage: 82 },
    { skill: 'Leadership', percentage: 65 },
    { skill: 'Aptitude Tests', percentage: 58 },
    { skill: 'HR Etiquette', percentage: 90 }
  ]
};

export const criticalSkillGaps: StudentSkillGap[] = [
  {
    id: 'gap_1',
    studentName: 'Alex Mercer',
    studentId: '20CS1012',
    branch: 'CS',
    avgScore: 62,
    gaps: ['Aptitude', 'System Des.'],
    cgpa: 8.84,
    readyForPlacement: true
  },
  {
    id: 'gap_2',
    studentName: 'Sarah Chen',
    studentId: '20IT1044',
    branch: 'IT',
    avgScore: 58,
    gaps: ['DSA', 'Comm'],
    cgpa: 7.92,
    readyForPlacement: false
  },
  {
    id: 'gap_3',
    studentName: 'James Wilson',
    studentId: '20EC2019',
    branch: 'EC',
    avgScore: 65,
    gaps: ['System Des.'],
    cgpa: 8.10,
    readyForPlacement: true
  },
  {
    id: 'gap_4',
    studentName: 'Priya Patel',
    studentId: '20CS1108',
    branch: 'CS',
    avgScore: 59,
    gaps: ['Coding', 'Aptitude'],
    cgpa: 7.45,
    readyForPlacement: false
  },
  {
    id: 'gap_5',
    studentName: 'David Kim',
    studentId: '20ME3002',
    branch: 'ME',
    avgScore: 52,
    gaps: ['Python', 'SQL'],
    cgpa: 7.12,
    readyForPlacement: false
  }
];

export const recentOffersAccepted: PlacedStudentOffer[] = [
  {
    id: 'off_1',
    studentName: 'Maya Kapoor',
    studentId: '20CS1042',
    branch: 'Computer Science',
    company: 'Google',
    role: 'SDE I',
    packageLpa: 16.0,
    date: 'Yesterday',
    avatarInitials: 'MK'
  },
  {
    id: 'off_2',
    studentName: 'Rahul Verma',
    studentId: '20IT2015',
    branch: 'Information Tech',
    company: 'Amazon',
    role: 'Cloud Support Engineer',
    packageLpa: 12.5,
    date: '2 days ago',
    avatarInitials: 'RT'
  },
  {
    id: 'off_3',
    studentName: 'Anita Nair',
    studentId: '20EC3088',
    branch: 'Electronics',
    company: 'TCS',
    role: 'System Engineer',
    packageLpa: 7.0,
    date: '3 days ago',
    avatarInitials: 'AN'
  },
  {
    id: 'off_4',
    studentName: 'Rohan Sharma',
    studentId: '20CS1099',
    branch: 'Computer Science',
    company: 'Microsoft',
    role: 'Software Engineer',
    packageLpa: 24.0,
    date: '4 days ago',
    avatarInitials: 'RS'
  },
  {
    id: 'off_5',
    studentName: 'Sneha Reddy',
    studentId: '20IT2045',
    branch: 'Information Tech',
    company: 'Atlassian',
    role: 'Graduate SDE',
    packageLpa: 30.0,
    date: '5 days ago',
    avatarInitials: 'SR'
  }
];

export const placementRulesAndFaq = `
CAMPUS PLACEMENT POLICY & RULES (2024-2025 BATCH):
1. **One Student, One Job Policy (Dream / Super Dream Exception)**:
   - A student placed in a Tier-3 company (< 6 LPA) may apply for Tier-2 (6 - 12 LPA) or Tier-1 / Super Dream (> 12 LPA).
   - Once an offer exceeding 15 LPA is accepted, the candidate is placed and cannot sit for other regular campus drives.
2. **Attendance & Eligibility Criteria**:
   - Minimum 75% attendance in TPO Aptitude and Soft Skills training modules is mandatory for sit-in eligibility.
   - All backlogs/arrears must be cleared prior to final semester onboarding.
3. **Assessment & Interview Conduct**:
   - Malpractice in online proctored assessments (GOC, HackerRank, Codility) results in immediate 1-year debarment.
   - Formal dress code and professional video background required for all virtual rounds.
`;

export const initialCodingProfiles: import('../types').CodingProfile[] = [
  {
    id: 'prof_leetcode',
    platform: 'leetcode',
    username: 'alex_mercer_dev',
    profileUrl: 'https://leetcode.com/u/alex_mercer_dev',
    verified: true,
    lastSynced: '10 mins ago',
    stats: {
      totalSolved: 348,
      easySolved: 142,
      mediumSolved: 174,
      hardSolved: 32,
      ranking: '48,120',
      contestRating: 1845,
      globalPercentile: 91.4,
      streakDays: 46,
      badges: ['Guardian Contender', '50 Days 2024', 'Top 10% DSA', 'Dynamic Programming Specialist'],
      accuracy: 86.4,
      problemsByTopic: [
        { topic: 'Arrays & Hashing', solved: 72, totalEstimated: 80, accuracy: 92, proficiency: 'Master' },
        { topic: 'Two Pointers & Sliding Window', solved: 48, totalEstimated: 55, accuracy: 88, proficiency: 'Proficient' },
        { topic: 'Binary Trees & BST', solved: 45, totalEstimated: 60, accuracy: 84, proficiency: 'Proficient' },
        { topic: 'Graphs & BFS/DFS', solved: 38, totalEstimated: 50, accuracy: 78, proficiency: 'Competent' },
        { topic: 'Dynamic Programming', solved: 42, totalEstimated: 75, accuracy: 72, proficiency: 'Competent' },
        { topic: 'Backtracking & Recursion', solved: 26, totalEstimated: 40, accuracy: 80, proficiency: 'Competent' },
        { topic: 'Trie & Advanced Structures', solved: 14, totalEstimated: 30, accuracy: 65, proficiency: 'Novice' },
        { topic: 'Bit Manipulation', solved: 18, totalEstimated: 25, accuracy: 82, proficiency: 'Competent' },
      ],
    },
  },
  {
    id: 'prof_codingninjas',
    platform: 'codingninjas',
    username: 'alexmercer_ninja',
    profileUrl: 'https://www.naukri.com/code360/profile/alexmercer_ninja',
    verified: true,
    lastSynced: '1 hour ago',
    stats: {
      totalSolved: 145,
      easySolved: 50,
      mediumSolved: 75,
      hardSolved: 20,
      ranking: 'Master Ninja (Level 8)',
      points: 4820,
      accuracy: 89.2,
      streakDays: 28,
      badges: ['Problem Solver Gold', 'DSA Champion', 'Campus Ambassador Top 50'],
    },
  },
  {
    id: 'prof_hackerrank',
    platform: 'hackerrank',
    username: 'alex_mercer_cs',
    profileUrl: 'https://www.hackerrank.com/profile/alex_mercer_cs',
    verified: true,
    lastSynced: 'Yesterday',
    stats: {
      totalSolved: 86,
      easySolved: 38,
      mediumSolved: 40,
      hardSolved: 8,
      stars: 6,
      ranking: 'Gold Badge - Problem Solving',
      badges: ['6★ Problem Solving', '5★ Python', 'SQL Advanced Certified', 'Algorithms Specialist'],
      accuracy: 94.0,
    },
  },
  {
    id: 'prof_geeksforgeeks',
    platform: 'geeksforgeeks',
    username: 'alexmercer2025',
    profileUrl: 'https://auth.geeksforgeeks.org/user/alexmercer2025',
    verified: true,
    lastSynced: '2 days ago',
    stats: {
      totalSolved: 112,
      easySolved: 44,
      mediumSolved: 56,
      hardSolved: 12,
      points: 1240,
      ranking: 'Institute Rank #14',
      streakDays: 19,
      badges: ['GFG POTD 30-Day Streak', 'Campus Problem Setter'],
      accuracy: 87.5,
    },
  },
];

export const initialCodingAnalysis: import('../types').CodingProfileAnalysis = {
  candidateRating: 88,
  placementReadinessTier: 'Tier 1 SDE Ready (FAANG / High-Growth Product)',
  totalProblemsAcrossPlatforms: 691,
  difficultyDistribution: {
    easy: 274,
    medium: 345,
    hard: 72,
  },
  crossPlatformPercentile: 92.6,
  activeStreak: 46,
  dsaReadinessScore: 89,
  systemDesignReadinessScore: 78,
  contestConsistencyScore: 86,
  aiExecutiveSummary: `Alex demonstrates an exceptional problem-solving repertoire across LeetCode, Coding Ninjas, and HackerRank with **691 aggregated DSA solutions**. The medium-to-hard problem ratio (60.3%) exceeds tier-1 product firm benchmarks (Amazon, Google, Microsoft). Core proficiencies in Arrays, Sliding Windows, Trees, and Graph BFS are interview-ready. Focus areas to solidify 95+ score: advanced Dynamic Programming (Knapsack/Interval DP) and Distributed System Design patterns.`,
  predictedRoundClearance: [
    {
      company: 'Amazon',
      probability: 93,
      role: 'SDE-1 / SDE-2 Intern',
      rationale: 'Exceeds Amazon Online Assessment (OA) benchmark of 300+ problems. Strong in Binary Trees, HashMaps, and Graph shortest path algorithms.',
      minRecommendedProblemCount: 300,
      keyRoundsCovered: ['OA Coding Assessment', 'Data Structures & Algorithms Virtual Onsite (2 rounds)', 'System Decomposition'],
    },
    {
      company: 'Google',
      probability: 86,
      role: 'Software Engineer L3 (GOC)',
      rationale: 'Solid baseline in Graph traversals and Medium/Hard DP. Recommend solving 15 additional Hard Graph & Tree questions (Segment Trees, Dijkstra, Topological Sort).',
      minRecommendedProblemCount: 450,
      keyRoundsCovered: ['Google Online Challenge (GOC)', 'Technical Onsite Problem Solving', 'Corner Case & Complexity Proving'],
    },
    {
      company: 'Microsoft',
      probability: 91,
      role: 'Software Engineer (SDE-1)',
      rationale: 'High accuracy rate in Linked Lists, Matrix DP, and String manipulation matches Microsoft Redmond & IDC question distributions.',
      minRecommendedProblemCount: 250,
      keyRoundsCovered: ['Codility OA', 'DSA Live Coding', 'Low Level Object-Oriented Design (LLD)'],
    },
    {
      company: 'Atlassian',
      probability: 88,
      role: 'Graduate Software Developer',
      rationale: 'Clean code structures and high medium-difficulty completion rates match Atlassian live pair-programming and concurrency expectations.',
      minRecommendedProblemCount: 350,
      keyRoundsCovered: ['Karat Technical Screen', 'Data Structures & System Architecture', 'Values & Leadership'],
    },
  ],
  topicStrengths: [
    {
      topic: 'Arrays, HashMaps & Two Pointers',
      score: 95,
      status: 'strong',
      benchmarkScore: 85,
      recommendation: 'Interview ready. Continue timed 20-minute speed drills for quick warm-ups.',
    },
    {
      topic: 'Binary Trees & BST Traversals',
      score: 90,
      status: 'strong',
      benchmarkScore: 80,
      recommendation: 'Strong mastery in recursive DFS and iterative level-order BFS traversal.',
    },
    {
      topic: 'Graph Algorithms & Disjoint Set Union (DSU)',
      score: 82,
      status: 'moderate',
      benchmarkScore: 80,
      recommendation: 'Practice Bellman-Ford, Floyd-Warshall, and Tarjan’s Strongly Connected Components.',
    },
    {
      topic: 'Dynamic Programming (1D & 2D Grid)',
      score: 76,
      status: 'moderate',
      benchmarkScore: 85,
      recommendation: 'Drill classic patterns: Longest Increasing Subsequence variants, Edit Distance, and Partition DP.',
    },
    {
      topic: 'Tries & Advanced Segment Trees',
      score: 64,
      status: 'weak',
      benchmarkScore: 75,
      recommendation: 'Crucial for Google GOC & Uber OA. Implement Prefix Tries and Range Query Segment Trees from scratch.',
    },
    {
      topic: 'System Design & Object-Oriented Design (LLD)',
      score: 74,
      status: 'moderate',
      benchmarkScore: 78,
      recommendation: 'Review Design Patterns (Factory, Strategy, Observer) and rate limiter implementations.',
    },
  ],
  criticalGaps: [
    'Solve 8-10 Hard problems in 2D Dynamic Programming (Matrix Chains, Bitmask DP).',
    'Strengthen Segment Tree & Fenwick Tree implementations for high-tier OAs.',
    'Consistently participate in weekly LeetCode / Codeforces virtual contests to improve under-pressure speed (target: 3 problems in 45 mins).',
  ],
  recommendedActionPlan: [
    {
      step: 1,
      title: 'Targeted DP Mastery Sprint',
      target: 'Dynamic Programming (Medium/Hard)',
      timeFrame: 'Next 5 Days',
      specificProblems: ['Coin Change II', 'Word Break II', 'Burst Balloons', 'Target Sum'],
    },
    {
      step: 2,
      title: 'Graph Cycle & Shortest Path Drill',
      target: 'Dijkstra, Topological Sort & Bipartite',
      timeFrame: 'Days 6 to 10',
      specificProblems: ['Network Delay Time', 'Course Schedule II', 'Cheapest Flights Within K Stops'],
    },
    {
      step: 3,
      title: 'FAANG Timed Mock Assessments',
      target: 'Google GOC & Amazon SDE-1 OA Simulation',
      timeFrame: 'Days 11 to 14',
      specificProblems: ['LRU Cache', 'Merge k Sorted Lists', 'Trapping Rain Water', 'Alien Dictionary'],
    },
  ],
  timestamp: 'Updated today with latest sync data',
};

export const createFreshATSResult = (user?: Partial<import('../types').User>): import('../types').ATSScanResult => {
  const name = user?.name || 'Candidate';
  const cleanName = name.replace(/\s+/g, '_');
  const skills = user?.skills || ['Data Structures', 'TypeScript', 'React'];
  return {
    score: user?.latestAtsScore || 0,
    fileName: `${cleanName}_Resume.pdf`,
    timestamp: 'Just now',
    breakdown: {
      formattingReadability: 0,
      keywordOptimization: 0,
      experienceImpact: 0,
    },
    missingKeywords: ['System Design', 'Docker', 'Kubernetes', 'CI/CD Pipeline', 'Microservices'],
    matchedKeywords: skills.slice(0, 4),
    extractedSkills: skills,
    roleMatch: user?.targetRole || 'Software Engineer (SDE-1)',
    summaryFeedback: `No resume scanned for ${name} yet. Upload your PDF or Word resume to run an automated ATS scan, evaluate keyword density, and compute role alignment.`,
    suggestions: [
      {
        id: 'sug_fresh_1',
        type: 'formatting',
        title: 'Upload Your Resume',
        description: 'Upload your PDF or DOCX resume to extract text and calculate your live ATS compatibility score.',
      },
      {
        id: 'sug_fresh_2',
        type: 'skill',
        title: 'Connect Coding Handles',
        description: 'Link your LeetCode, Codeforces, or HackerRank profiles to sync your competitive programming ratings.',
      },
    ],
  };
};

export const createEmptyCodingAnalysis = (userName: string = 'Candidate'): import('../types').CodingProfileAnalysis => ({
  candidateRating: 0,
  placementReadinessTier: 'Unrated (Connect Profiles)',
  totalProblemsAcrossPlatforms: 0,
  difficultyDistribution: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  crossPlatformPercentile: 0,
  activeStreak: 0,
  dsaReadinessScore: 0,
  systemDesignReadinessScore: 0,
  contestConsistencyScore: 0,
  aiExecutiveSummary: `No coding handles connected for ${userName} yet. Click '+ Add Coding Handle' to link your LeetCode, Codeforces, HackerRank, GeeksforGeeks, or Coding Ninjas profiles to compute composite placement analytics.`,
  predictedRoundClearance: [
    {
      company: 'Amazon',
      probability: 0,
      role: 'SDE-1',
      rationale: 'Link coding profiles to calculate OA clearance probability based on problem difficulty distribution.',
      minRecommendedProblemCount: 250,
      keyRoundsCovered: ['OA Coding Assessment', 'DSA Virtual Onsite'],
    },
    {
      company: 'Google',
      probability: 0,
      role: 'Software Engineer L3',
      rationale: 'Connect LeetCode/Codeforces to evaluate graph algorithms, recursion, and dynamic programming depth.',
      minRecommendedProblemCount: 400,
      keyRoundsCovered: ['Google Online Challenge', 'Live Whiteboard DSA'],
    },
    {
      company: 'Microsoft',
      probability: 0,
      role: 'Software Engineer',
      rationale: 'Connect profiles to analyze arrays, trees, and object-oriented design problem count.',
      minRecommendedProblemCount: 200,
      keyRoundsCovered: ['Codility OA', 'DSA Live Coding'],
    },
    {
      company: 'Atlassian',
      probability: 0,
      role: 'Graduate Developer',
      rationale: 'Connect profiles to benchmark coding speed and medium-difficulty accuracy.',
      minRecommendedProblemCount: 300,
      keyRoundsCovered: ['Karat Screen', 'System & DSA'],
    },
  ],
  topicStrengths: [
    { topic: 'Arrays & HashMaps', score: 0, status: 'weak', benchmarkScore: 85, recommendation: 'Start with Two Sum, Subarray Sum, and Sliding Window basics.' },
    { topic: 'Binary Trees & BST', score: 0, status: 'weak', benchmarkScore: 80, recommendation: 'Practice Inorder, Preorder, Postorder, and Level Order traversals.' },
    { topic: 'Graph Algorithms', score: 0, status: 'weak', benchmarkScore: 80, recommendation: 'Master Breadth First Search (BFS) and Depth First Search (DFS).' },
    { topic: 'Dynamic Programming', score: 0, status: 'weak', benchmarkScore: 85, recommendation: 'Begin with 1D Memoization and Classic 2D Grid DP.' },
    { topic: 'Tries & Advanced', score: 0, status: 'weak', benchmarkScore: 75, recommendation: 'Learn Prefix Trees and Range Query Segment Trees.' },
    { topic: 'System Design & LLD', score: 0, status: 'weak', benchmarkScore: 78, recommendation: 'Review Object-Oriented Design Principles (SOLID) and caching.' },
  ],
  criticalGaps: [
    'Connect at least one active coding profile (LeetCode, Codeforces, HackerRank, etc.) to start tracking progress.',
    'Solve 15-20 foundational array and string manipulation problems.',
    'Complete basic binary tree and graph traversal problems.',
  ],
  recommendedActionPlan: [
    {
      step: 1,
      title: 'Link Competitive Profiles',
      target: 'LeetCode / Codeforces / HackerRank',
      timeFrame: 'Day 1',
      specificProblems: ['Two Sum', 'Valid Palindrome', 'Invert Binary Tree'],
    },
    {
      step: 2,
      title: 'Data Structures Foundation',
      target: 'Arrays, Two Pointers & HashMaps',
      timeFrame: 'Days 2 to 7',
      specificProblems: ['Container With Most Water', 'Group Anagrams', 'Top K Frequent Elements'],
    },
    {
      step: 3,
      title: 'Tree & Graph Traversal Sprint',
      target: 'Binary Tree Level Order & Number of Islands',
      timeFrame: 'Days 8 to 14',
      specificProblems: ['Binary Tree Level Order Traversal', 'Number of Islands', 'Max Depth of Binary Tree'],
    },
  ],
  timestamp: 'Just now',
});

export const batchStudentProfiles: StudentCandidateProfile[] = [
  {
    id: 'std_alex_01',
    name: 'Alex Mercer',
    rollNo: '21CS1084',
    email: 'alex.mercer@university.edu',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    batch: '2021-2025',
    cgpa: 8.84,
    tenthPercentage: 94.5,
    twelfthPercentage: 92.0,
    activeBacklogs: 0,
    historyBacklogs: 0,
    placementStatus: 'Eligible - In Process',
    dreamEligible: true,
    tpoVerified: true,
    tpoNotes: 'Top-tier candidate for SDE-1 / Product Engineering roles. Strong in DSA (691 solved) and backend systems. OA cleared for Google & Amazon.',
    resumeATSScore: 85,
    resumeFileName: 'Software_Eng_Resume_v2.pdf',
    targetRole: 'Software Engineer (SDE-1)',
    primarySkills: ['Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'DSA', 'AWS S3', 'Redis'],
    codingStats: {
      totalSolved: 691,
      leetcodeUsername: 'alexmercer_dev',
      leetcodeSolved: 382,
      leetcodeRating: 1842,
      codingNinjasSolved: 145,
      gfgSolved: 112,
      codeforcesRating: 1420
    },
    mockInterviewScore: 88,
    readinessGrade: 'A+ (Tier-1 SDE Ready)',
    applications: [
      { id: 'app_1', company: 'Google', role: 'Software Engineer, L3', appliedDate: 'Oct 12, 2026', packageLpa: 32.0, status: 'OA Cleared' },
      { id: 'app_2', company: 'Amazon', role: 'SDE-1 Intern / Full Time', appliedDate: 'Oct 14, 2026', packageLpa: 28.5, status: 'Technical Round 2' },
      { id: 'app_3', company: 'Microsoft', role: 'Cloud Solutions Architect', appliedDate: 'Oct 16, 2026', packageLpa: 26.0, status: 'Applied' },
      { id: 'app_4', company: 'Atlassian', role: 'Graduate Software Engineer', appliedDate: 'Oct 18, 2026', packageLpa: 35.0, status: 'Applied' }
    ],
    recentActivity: [
      'Cleared Google Online Assessment (GOC) Round 1',
      'Completed FAANG Mock Interview with 88% STAR Score',
      'Synced LeetCode profile (382 solved, Knight badge)'
    ]
  },
  {
    id: 'std_priya_02',
    name: 'Priya Sharma',
    rollNo: '21CS1022',
    email: 'priya.sharma@university.edu',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    batch: '2021-2025',
    cgpa: 9.42,
    tenthPercentage: 96.8,
    twelfthPercentage: 95.4,
    activeBacklogs: 0,
    historyBacklogs: 0,
    placementStatus: 'Placed - Dream Offer',
    dreamEligible: true,
    tpoVerified: true,
    tpoNotes: 'Accepted Dream Offer at Adobe (38.0 LPA). Outstanding academic track record with 9.42 CGPA and multiple national hackathon wins.',
    resumeATSScore: 94,
    resumeFileName: 'Priya_Sharma_Resume.pdf',
    targetRole: 'Full Stack & Distributed Systems',
    primarySkills: ['Java', 'Spring Boot', 'React', 'Docker', 'Kubernetes', 'Microservices', 'Kafka', 'System Design'],
    codingStats: {
      totalSolved: 840,
      leetcodeUsername: 'priyasharma_codes',
      leetcodeSolved: 512,
      leetcodeRating: 1985,
      codingNinjasSolved: 198,
      gfgSolved: 130,
      codeforcesRating: 1610
    },
    mockInterviewScore: 95,
    readinessGrade: 'A+ (Placed - Dream Offer)',
    applications: [
      { id: 'app_5', company: 'Adobe', role: 'Member of Technical Staff-1', appliedDate: 'Sep 28, 2026', packageLpa: 38.0, status: 'Offer Accepted' },
      { id: 'app_6', company: 'Salesforce', role: 'Associate Software Engineer', appliedDate: 'Oct 02, 2026', packageLpa: 31.0, status: 'Offer Extended' }
    ],
    recentActivity: [
      'Accepted Offer Letter from Adobe (38 LPA)',
      'Verified University Placement Undertaking with TPO',
      'Conducted peer guidance session on Microservices'
    ]
  },
  {
    id: 'std_rohan_03',
    name: 'Rohan Gupta',
    rollNo: '21IT1055',
    email: 'rohan.gupta@university.edu',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    branch: 'Information Technology',
    batch: '2021-2025',
    cgpa: 8.65,
    tenthPercentage: 91.0,
    twelfthPercentage: 89.5,
    activeBacklogs: 0,
    historyBacklogs: 0,
    placementStatus: 'Placed - Core',
    dreamEligible: true,
    tpoVerified: true,
    tpoNotes: 'Secured Cloud Engineering offer at Cisco (18.5 LPA). Eligible for Dream company attempts per TPO dual-offer policy.',
    resumeATSScore: 88,
    resumeFileName: 'Rohan_Gupta_DevOps.pdf',
    targetRole: 'DevOps / Cloud Platform Engineer',
    primarySkills: ['Go', 'Python', 'Terraform', 'Kubernetes', 'AWS', 'Linux', 'GCP', 'Prometheus'],
    codingStats: {
      totalSolved: 420,
      leetcodeUsername: 'rohan_cloud',
      leetcodeSolved: 260,
      leetcodeRating: 1650,
      codingNinjasSolved: 90,
      gfgSolved: 70,
    },
    mockInterviewScore: 84,
    readinessGrade: 'A (Placed - Core)',
    applications: [
      { id: 'app_7', company: 'Cisco', role: 'Cloud Platform Engineer', appliedDate: 'Oct 01, 2026', packageLpa: 18.5, status: 'Offer Accepted' },
      { id: 'app_8', company: 'Oracle', role: 'Cloud Infrastructure Associate', appliedDate: 'Oct 05, 2026', packageLpa: 21.0, status: 'Technical Round 2' }
    ],
    recentActivity: [
      'Placed at Cisco Systems (18.5 LPA)',
      'CKA (Certified Kubernetes Administrator) verified by TPO'
    ]
  },
  {
    id: 'std_ananya_04',
    name: 'Ananya Desai',
    rollNo: '21CS1090',
    email: 'ananya.desai@university.edu',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    batch: '2021-2025',
    cgpa: 9.15,
    tenthPercentage: 95.0,
    twelfthPercentage: 94.2,
    activeBacklogs: 0,
    historyBacklogs: 0,
    placementStatus: 'Placed - Dream Offer',
    dreamEligible: true,
    tpoVerified: true,
    tpoNotes: 'Placed at Microsoft IDC (42.0 LPA). Exceptional background in Machine Learning and Natural Language Processing.',
    resumeATSScore: 92,
    resumeFileName: 'Ananya_Desai_ML.pdf',
    targetRole: 'AI/ML Applied Scientist',
    primarySkills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Transformers', 'FastAPI', 'MLOps', 'Vector DBs'],
    codingStats: {
      totalSolved: 610,
      leetcodeUsername: 'ananya_ai',
      leetcodeSolved: 390,
      leetcodeRating: 1890,
      codingNinjasSolved: 120,
      gfgSolved: 100,
    },
    mockInterviewScore: 96,
    readinessGrade: 'A+ (Placed - Dream Offer)',
    applications: [
      { id: 'app_9', company: 'Microsoft', role: 'Applied Scientist - GenAI', appliedDate: 'Oct 08, 2026', packageLpa: 42.0, status: 'Offer Accepted' }
    ],
    recentActivity: [
      'Offer Accepted: Microsoft Research & IDC (42 LPA)',
      'Published research paper in IEEE NLP Workshop'
    ]
  },
  {
    id: 'std_vikram_05',
    name: 'Vikram Choudhury',
    rollNo: '21ECE1014',
    email: 'vikram.c@university.edu',
    phone: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    branch: 'Electronics & Communication',
    batch: '2021-2025',
    cgpa: 7.92,
    tenthPercentage: 88.0,
    twelfthPercentage: 86.5,
    activeBacklogs: 0,
    historyBacklogs: 1,
    placementStatus: 'Unplaced - Action Required',
    dreamEligible: false,
    tpoVerified: true,
    tpoNotes: 'Needs remedial practice in Dynamic Programming & System Design. Enrolled in TPO Accelerated DSA Bootcamp.',
    resumeATSScore: 71,
    resumeFileName: 'Vikram_ECE_Embedded.pdf',
    targetRole: 'Embedded Software / Firmware Engineer',
    primarySkills: ['C', 'C++', 'Embedded Systems', 'RTOS', 'ARM Cortex', 'Python', 'Git'],
    codingStats: {
      totalSolved: 195,
      leetcodeUsername: 'vikram_c_ece',
      leetcodeSolved: 110,
      leetcodeRating: 1410,
      codingNinjasSolved: 45,
      gfgSolved: 40,
    },
    mockInterviewScore: 68,
    readinessGrade: 'Needs Remedial (DP / DSA)',
    applications: [
      { id: 'app_10', company: 'Qualcomm', role: 'Associate Engineer - Firmware', appliedDate: 'Oct 15, 2026', packageLpa: 16.0, status: 'Applied' },
      { id: 'app_11', company: 'Texas Instruments', role: 'Embedded Systems Intern', appliedDate: 'Oct 17, 2026', packageLpa: 17.5, status: 'Applied' }
    ],
    recentActivity: [
      'Assigned Remedial Practice Sprint: Dynamic Programming & Bit Manipulation',
      'Completed RTOS Microcontroller Verification Project'
    ]
  },
  {
    id: 'std_neha_06',
    name: 'Neha Patel',
    rollNo: '21CS1048',
    email: 'neha.patel@university.edu',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    batch: '2021-2025',
    cgpa: 8.72,
    tenthPercentage: 93.0,
    twelfthPercentage: 90.5,
    activeBacklogs: 0,
    historyBacklogs: 0,
    placementStatus: 'Eligible - In Process',
    dreamEligible: true,
    tpoVerified: true,
    tpoNotes: 'Shortlisted for Uber OA. High problem-solving speed in Tree traversals and Graphs.',
    resumeATSScore: 89,
    resumeFileName: 'Neha_Patel_SDE.pdf',
    targetRole: 'Software Engineer / Backend Systems',
    primarySkills: ['Java', 'C++', 'Spring Boot', 'SQL', 'Redis', 'Algorithms', 'Microservices'],
    codingStats: {
      totalSolved: 580,
      leetcodeUsername: 'nehapatel_code',
      leetcodeSolved: 340,
      leetcodeRating: 1795,
      codingNinjasSolved: 140,
      gfgSolved: 100,
    },
    mockInterviewScore: 89,
    readinessGrade: 'A (Tier-1 SDE Ready)',
    applications: [
      { id: 'app_12', company: 'Uber', role: 'Software Engineer - Backend', appliedDate: 'Oct 11, 2026', packageLpa: 36.0, status: 'OA Cleared' },
      { id: 'app_13', company: 'Amazon', role: 'SDE-1', appliedDate: 'Oct 14, 2026', packageLpa: 28.5, status: 'Applied' }
    ],
    recentActivity: [
      'Uber Round 1 OA Cleared with 100% test cases',
      'Completed High-Concurrency Java Spring Boot project'
    ]
  }
];
