// server/db/db.ts
// A simple in-memory database for the prototype.
// In a real application, this would be SQLite or PostgreSQL.

interface DbStore {
  content: Record<string, any>;
  simulations: any[];
  telemetry: any[];
  submissions: any[];
  config: Record<string, any>;
  logs: any[];
}

const store: DbStore = {
  content: {
    hero: {
      title: "ML-KEM Secure Platform",
      subtitle: "Unassailable Post-Quantum Orbital Protection",
      cta: "Explore Architecture"
    },
    problem: {
      title: "The Quantum Threat",
      description: "Classical encryption is vulnerable to Shor's algorithm. Future quantum computers will break RSA and ECC."
    },
    solution: {
      title: "ML-KEM Protection Model",
      description: "Exclusively powered by ML-KEM for unassailable post-quantum security."
    }
  },
  simulations: [],
  telemetry: [],
  submissions: [],
  config: {
    presets: [
      { id: "normal", name: "Normal Transmission", intensity: 0.1 },
      { id: "threat", name: "Threat Detected", intensity: 0.8 },
      { id: "refresh", name: "Key Refresh", intensity: 0.3 }
    ],
    featureFlags: {
      enableQuantumSim: true,
      enableThreatModel: true
    }
  },
  logs: []
};

export const db = {
  get: (key: keyof DbStore) => store[key],
  set: (key: keyof DbStore, value: any) => { (store as any)[key] = value; },
  push: (key: keyof DbStore, value: any) => { (store as any)[key].push(value); },
  updateContent: (section: string, data: any) => { store.content[section] = { ...store.content[section], ...data }; }
};
