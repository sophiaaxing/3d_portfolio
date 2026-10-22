/**
 * Projects shown in the Project Lab. Each one is placed on the next free slot
 * in the lab; `model` picks the object that represents it.
 */
export interface Project {
  id: string;
  name: string;
  model: 'dag' | 'capsule' | 'database';
  kicker: string;
  summary: string;
  points?: string[];
  tags?: string;
}

export const projects: Project[] = [
  {
    "id": "orchestrator",
    "name": "Data Pipeline Orchestrator",
    "model": "dag",
    "kicker": "Two Sigma-sponsored capstone",
    "summary": "A distributed pipeline orchestrator with a stateless, event-driven scheduler.",
    "tags": "C# \u00b7 .NET \u00b7 Azure Functions \u00b7 Azure Service Bus \u00b7 PostgreSQL",
    "points": [
      "Built a DAG parser validating cycles, dependencies, data bindings, and compute requirements.",
      "Implemented atomic dependency tracking for concurrent fan-out and fan-in execution.",
      "Engineered fault-tolerant execution with retries and persistent state recovery across distributed tasks."
    ]
  },
  {
    "id": "owldb",
    "name": "OwlDB",
    "model": "database",
    "kicker": "Concurrent NoSQL database",
    "summary": "An in-memory NoSQL database with hierarchical documents and real-time subscriptions.",
    "tags": "Go \u00b7 REST APIs \u00b7 Concurrent Programming",
    "points": [
      "Built CRUD requests and JSON Schema validation for hierarchical documents.",
      "Implemented a concurrent skip-list index with fine-grained locking, atomic updates, and ordered range queries.",
      "Added token-based authentication and real-time SSE subscriptions with event broadcasting and concurrent client management."
    ]
  },
  {
    "id": "spectralwalk",
    "name": "SpectralWalk",
    "model": "dag",
    "kicker": "Spectral graph theory \u00b7 In progress",
    "summary": "A spectral analysis engine for modular random walks and fastest-mixing transitions.",
    "tags": "C++ \u00b7 Python \u00b7 FFT \u00b7 Spectral Graph Theory",
    "points": [
      "Building an FFT-based engine to compute eigenvalues of modular random walks in O(n log n) time.",
      "Developing an optimization solver for fastest-mixing transition probabilities and generating sets on cyclic graphs."
    ]
  }
];
