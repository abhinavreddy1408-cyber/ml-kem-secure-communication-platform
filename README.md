<div align="center">

# 🔐 ML-KEM Secure Communication Platform

**A post-quantum cryptographic communication simulator built with React, Three.js, and Gemini AI**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r183-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🌐 Overview

The **ML-KEM Secure Communication Platform** is an interactive web application that simulates and visualizes quantum-safe cryptographic communication using the **Module-Lattice-Based Key Encapsulation Mechanism (ML-KEM / CRYSTALS-Kyber)** — a NIST-standardized post-quantum algorithm.

The platform provides real-time telemetry, threat monitoring, 3D satellite communication visualization, and an AI assistant powered by Google Gemini for contextual guidance on quantum-resistant cryptography.

---

## ✨ Features

- **🛰️ 3D Satellite Visualization** — Interactive Three.js scene simulating quantum-safe satellite communication links
- **📊 Real-Time Telemetry** — Live simulation of ML-KEM key exchange metrics (encapsulation time, decapsulation time, key sizes)
- **🛡️ Threat Monitor** — Displays quantum threat levels and lattice-based security parameters
- **⚡ Quantum State Grid** — Visual lattice structure representation of ML-KEM polynomial operations
- **🤖 AI Assistant** — Gemini-powered chatbot for questions about post-quantum cryptography
- **🎮 Simulation Controls** — Adjustable security levels (ML-KEM-512 / 768 / 1024) with real-time parameter updates
- **🎨 Premium UI** — Glassmorphism design, GSAP + Framer Motion animations, dark theme

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 5.8 |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **Styling** | Tailwind CSS 4, Glassmorphism |
| **Animations** | GSAP, Framer Motion |
| **AI** | Google Gemini API (`@google/genai`) |
| **Server** | Express.js, WebSocket (ws) |
| **Build** | Vite 6, TSX |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ml-kem-secure-communication-platform.git
cd ml-kem-secure-communication-platform

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

> See [`.env.example`](.env.example) for all available environment variables.

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📂 Project Structure

```
ml-kem-secure-communication-platform/
├── src/
│   ├── App.tsx                 # Main application with AI chat + dashboard
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles
│   ├── components/
│   │   ├── LandingPage.tsx     # Hero landing page with animations
│   │   ├── QuantumHeroVisual.tsx  # 3D quantum visualization (R3F)
│   │   ├── SatelliteScene.tsx  # 3D satellite communication scene
│   │   ├── QuantumStateGrid.tsx   # Lattice state visualization
│   │   ├── TelemetryFeed.tsx   # Real-time ML-KEM metrics
│   │   ├── ThreatMonitor.tsx   # Quantum threat level display
│   │   ├── SimulationControls.tsx # Security parameter controls
│   │   └── GlassCard.tsx       # Reusable glassmorphism card
│   ├── hooks/
│   │   ├── useContent.ts       # Content management hook
│   │   ├── useSubmission.ts    # Form submission hook
│   │   └── useTelemetry.ts     # Telemetry simulation hook
│   └── lib/
│       └── utils.ts            # Utility functions
├── server/                     # Server-side modules
├── server.ts                   # Express + WebSocket server
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
└── .env.example                # Environment variable template
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove build artifacts |

---

## 🔬 About ML-KEM

**ML-KEM (Module-Lattice-Based Key Encapsulation Mechanism)**, formerly known as **CRYSTALS-Kyber**, is a post-quantum cryptographic algorithm standardized by **NIST** in 2024 as **FIPS 203**. It is designed to be secure against attacks from both classical and quantum computers.

### Security Levels

| Parameter Set | NIST Level | Shared Secret | Public Key | Ciphertext |
|---------------|-----------|---------------|------------|------------|
| ML-KEM-512 | 1 | 32 bytes | 800 bytes | 768 bytes |
| ML-KEM-768 | 3 | 32 bytes | 1,184 bytes | 1,088 bytes |
| ML-KEM-1024 | 5 | 32 bytes | 1,568 bytes | 1,568 bytes |

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for Post-Quantum Cryptography Research**

</div>

---

## 📬 Contact

**Abhinav Reddy** — [@abhinavreddy1408-cyber](https://github.com/abhinavreddy1408-cyber)  
Project Link: [https://github.com/abhinavreddy1408-cyber/ml-kem-secure-communication-platform](https://github.com/abhinavreddy1408-cyber/ml-kem-secure-communication-platform)
