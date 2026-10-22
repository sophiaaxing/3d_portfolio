export type DistrictId = 'google' | 'nvidia' | 'aws' | 'rice' | 'lab' | 'studio';

export interface District {
  id: DistrictId;
  index: string;
  name: string;
  /** Short line for the index in the corner of the page. */
  keyMeta: string;
  role: string;
  year?: string;
  tags: string;
  /** One or two sentences shown when the place is selected. */
  summary: string;
  /** Centre of the district on the board, as [x, z]. */
  position: [number, number];
  /** Footprint of the district's base, as [width, depth]. */
  padSize: [number, number];
}

export const districts: District[] = [
  {
    id: 'google',
    index: '01',
    name: 'Google',
    keyMeta: 'AI · 2026',
    role: "Software Engineer Intern, Finance Engineering",
    year: "Aug 2026 – Present",
    tags: 'AI · RAG · Finance Engineering',
    summary:
      "Building concurrent retrieval and fault-tolerant AI agents for Finance Engineering. Parallelized documentation and issue searches to reduce median LLM calls by 40%.",
    position: [-9, -8.5],
    padSize: [10, 8],
  },
  {
    id: 'nvidia',
    index: '02',
    name: 'NVIDIA',
    keyMeta: 'GPU infrastructure · 2026',
    role: "Software Engineer Intern, GeForce NOW",
    year: "May 2026 – Aug 2026",
    tags: 'GPU infrastructure · distributed systems',
    summary:
      "Built storage orchestration, resource provisioning, and fault-tolerant scheduling for GeForce NOW. Integrated ads into session queueing to support $5M+ in projected annual revenue.",
    position: [9, -8.5],
    padSize: [10, 8],
  },
  {
    id: 'aws',
    index: '03',
    name: 'AWS',
    keyMeta: 'Cloud · 2025',
    role: "Software Engineer Intern, EC2",
    year: "May 2025 – Aug 2025",
    tags: 'Cloud infrastructure · Kubernetes · React',
    summary:
      "Built an Infrastructure-as-Code aware Elastic Load Balancer Console for 1M+ customers. Kubernetes resource mapping and React Query caching helped cut resource discovery time by 30%.",
    position: [11.5, 6],
    padSize: [11, 7],
  },
  {
    id: 'rice',
    index: '04',
    name: 'Rice University',
    keyMeta: 'CS + Math · 2027',
    role: 'Computer Science + Mathematics',
    tags: 'Class of 2027 · Business minor',
    summary:
      'Studying computer science and mathematics, with a Business minor. CS Club President, D2K Lab Datathon Director, and Undergraduate Investment Fund Senior Analyst.',
    position: [-11, 6.5],
    padSize: [12, 8],
  },
  {
    id: 'lab',
    index: '05',
    name: 'Project Lab',
    keyMeta: 'Things I build',
    role: 'Projects & experiments',
    tags: 'Data Pipeline Orchestrator · OwlDB · SpectralWalk',
    summary:
      'Distributed pipelines, a concurrent NoSQL database, and spectral graph analysis: projects in systems, data, and mathematics.',
    position: [10.5, 14.5],
    padSize: [10, 6],
  },
  {
    id: 'studio',
    index: '06',
    name: 'Studio',
    keyMeta: 'Life outside work',
    role: 'Life outside work',
    tags: 'Photography · Writing · Travel',
    summary:
      'Short stories and poems, a new photography habit, and travel. Aruba and Switzerland are my favorites so far.',
    position: [-9, 15.5],
    padSize: [7, 5],
  },
];

export const districtById = Object.fromEntries(districts.map((d) => [d.id, d])) as Record<DistrictId, District>;

/** The place before or after this one in the index, wrapping around. */
export function neighbour(id: DistrictId, step: 1 | -1): District {
  const i = districts.findIndex((d) => d.id === id);
  return districts[(i + step + districts.length) % districts.length];
}
