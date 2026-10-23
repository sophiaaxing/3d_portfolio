import type { DistrictId } from './districts';
import { earlierWork } from './earlierWork';

export interface FlowStep {
  label: string;
  note: string;
}

export interface CaseSection {
  heading: string;
  body?: string[];
  list?: string[];
  /** A simple left-to-right diagram of how something works. */
  flow?: { caption: string; steps: FlowStep[] };
}

export interface CaseStudy {
  id: string;
  /** Which index the study belongs to; also the first part of its URL. */
  section: 'work' | 'projects';
  /** Optional city location; some work experiences have no building. */
  place?: DistrictId;
  item?: string;
  eyebrow: string;
  title: string;
  role: string;
  year?: string;
  context?: string;
  stack?: string[];
  sections: CaseSection[];
}

// Experience and projects from Sophia’s resume.
export const caseStudies: CaseStudy[] = [
  {
    "id": "google",
    "section": "work",
    "place": "google",
    "eyebrow": "01 / Google",
    "title": "Concurrent retrieval for financial AI agents",
    "role": "Software Engineer Intern, Finance Engineering",
    "year": "Aug 2026 \u2013 Present",
    "context": "San Jose, California",
    "stack": [
      "Python",
      "AI agents",
      "RPC",
      "Async execution"
    ],
    "sections": [
      {
        "heading": "What I worked on",
        "list": [
          "Parallelized documentation and issue searches with concurrent Python retrieval, reducing median LLM calls by 40%.",
          "Redesigned multi-agent troubleshooting with intent-based routing and prioritized retrieval across documentation and issue trackers.",
          "Isolated tool failures with fault-tolerant async execution to preserve concurrent retrieval workflows.",
          "Integrated backend RPC services into AI agents with authenticated data retrieval and structured financial workflows."
        ]
      }
    ]
  },
  {
    "id": "nvidia",
    "section": "work",
    "place": "nvidia",
    "eyebrow": "02 / NVIDIA",
    "title": "Distributed infrastructure for GPU sessions",
    "role": "Software Engineer Intern, GeForce NOW",
    "year": "May 2026 \u2013 Aug 2026",
    "context": "Santa Clara, California",
    "stack": [
      "Java",
      "Spring Boot",
      "Redis",
      "Distributed systems"
    ],
    "sections": [
      {
        "heading": "What I worked on",
        "list": [
          "Engineered distributed storage orchestration for persistent and ephemeral volumes across GPU session lifecycles.",
          "Built resource provisioning and validation in Java and Spring Boot, coordinating allocation and assignment across services.",
          "Prevented duplicate session operations with Redis locks and idempotent state transitions across concurrent requests.",
          "Improved scheduler fault tolerance by handling recoverable allocation failures and preserving sessions for retry.",
          "Integrated Google Ads into session queueing with routing and authentication to support $5M+ in projected annual revenue."
        ]
      }
    ]
  },
  {
    "id": "aws",
    "section": "work",
    "place": "aws",
    "eyebrow": "03 / Amazon Web Services (AWS)",
    "title": "Infrastructure-aware load balancer tooling",
    "role": "Software Engineer Intern, EC2",
    "year": "May 2025 \u2013 Aug 2025",
    "context": "Seattle, Washington",
    "stack": [
      "React",
      "React Query",
      "AWS SDK v3",
      "EKS",
      "Kubernetes"
    ],
    "sections": [
      {
        "heading": "What I worked on",
        "list": [
          "Enhanced the Elastic Load Balancer Console for 1M+ customers with an Infrastructure-as-Code aware interface.",
          "Designed a tag-based system to detect and map Kubernetes resources, improving cross-service navigation and visibility.",
          "Implemented IaC-specific filters and indicators that cut resource discovery time by 30% using React Query caching.",
          "Developed a service layer integrating the EKS API through AWS SDK v3, optimizing data fetching and reducing API calls."
        ]
      }
    ]
  },
  ...earlierWork.map((job, index): CaseStudy => ({
    id: job.id,
    section: 'work',
    eyebrow: `${String(index + 4).padStart(2, '0')} / ${job.company}`,
    title: job.title,
    role: job.role,
    year: job.year,
    context: job.context,
    stack: job.stack,
    sections: [{ heading: 'What I worked on', list: job.points }],
  })),
  {
    "id": "orchestrator",
    "section": "projects",
    "place": "lab",
    "item": "orchestrator",
    "eyebrow": "05 / Project Lab",
    "title": "Data Pipeline Orchestrator",
    "role": "Scheduler & DAG parser",
    "context": "Two Sigma-sponsored capstone",
    "stack": [
      "C#",
      ".NET",
      "Azure Functions",
      "Azure Service Bus",
      "PostgreSQL"
    ],
    "sections": [
      {
        "heading": "Overview",
        "body": [
          "A distributed pipeline orchestrator with a stateless, event-driven scheduler."
        ]
      },
      {
        "heading": "Engineering",
        "list": [
          "Built a DAG parser validating cycles, dependencies, data bindings, and compute requirements.",
          "Implemented atomic dependency tracking for concurrent fan-out and fan-in execution.",
          "Engineered fault-tolerant execution with retries and persistent state recovery across distributed tasks."
        ]
      }
    ]
  },
  {
    "id": "owldb",
    "section": "projects",
    "place": "lab",
    "item": "owldb",
    "eyebrow": "05 / Project Lab",
    "title": "OwlDB",
    "role": "Project developer",
    "context": "Concurrent NoSQL database",
    "stack": [
      "Go",
      "REST APIs",
      "Concurrent Programming"
    ],
    "sections": [
      {
        "heading": "Overview",
        "body": [
          "An in-memory NoSQL database with hierarchical documents and real-time subscriptions."
        ]
      },
      {
        "heading": "Engineering",
        "list": [
          "Built CRUD requests and JSON Schema validation for hierarchical documents.",
          "Implemented a concurrent skip-list index with fine-grained locking, atomic updates, and ordered range queries.",
          "Added token-based authentication and real-time SSE subscriptions with event broadcasting and concurrent client management."
        ]
      }
    ]
  },
  {
    "id": "spectralwalk",
    "section": "projects",
    "place": "lab",
    "item": "spectralwalk",
    "eyebrow": "05 / Project Lab",
    "title": "SpectralWalk",
    "role": "Project developer",
    "context": "Spectral graph theory \u00b7 In progress",
    "stack": [
      "C++",
      "Python",
      "FFT",
      "Spectral Graph Theory"
    ],
    "sections": [
      {
        "heading": "Overview",
        "body": [
          "A spectral analysis engine for modular random walks and fastest-mixing transitions."
        ]
      },
      {
        "heading": "Engineering",
        "list": [
          "Building an FFT-based engine to compute eigenvalues of modular random walks in O(n log n) time.",
          "Developing an optimization solver for fastest-mixing transition probabilities and generating sets on cyclic graphs."
        ]
      }
    ]
  }
];

export const caseStudyById = Object.fromEntries(caseStudies.map((study) => [study.id, study])) as Record<string, CaseStudy>;

/** The case study that opens from a place, or from an object in it. */
export function caseStudyFor(place: DistrictId, item: string | null): CaseStudy | undefined {
  return caseStudies.find((study) => study.place === place && (study.item ?? null) === item);
}

export function nextCaseStudy(id: string): CaseStudy {
  const i = caseStudies.findIndex((study) => study.id === id);
  return caseStudies[(i + 1) % caseStudies.length];
}
