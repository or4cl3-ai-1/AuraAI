# <div align="center"><img src="https://ais-dev-nbvzwutljtdo44zgrsihzg-86623272546.us-east1.run.app/assets/logo.png" alt="AuraAI Logo" width="600" /><br/>AuraAI: Autonomous Natural Language Coding Platform</div>

[![Build Status](https://img.shields.io/badge/Build-Succeeded-cyan?style=flat-square&logo=github)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](https://opensource.org/licenses/MIT)
[![Engine](https://img.shields.io/badge/Engine-Gemini_3.5_Flash-indigo?style=flat-square&logo=google)](https://ai.google.dev/)
[![Weights](https://img.shields.io/badge/Model_Weights-Gemma_2-pink?style=flat-square)](https://ai.google.dev/gemma)
[![Port](https://img.shields.io/badge/Port-3000_Ingress-emerald?style=flat-square&logo=nginx)](http://localhost:3000)

AuraAI is an advanced, production-ready, full-stack prototyping platform that translates natural language prompts into complete, functional, React-based web applications. Packed with a professional code playground, dynamic runtime sandboxes, SQLite relational simulation engines, local timeline version control, and multi-agent AI refactoring coordinates, it bridges the gap between text specification and live, deployable software.

---

## 🌌 Core Features & Capabilities

* **Natural-Language Code Synthesis**: Instantly compiles complex feature requests into fully modular React applications featuring multiple functional views, custom styled layouts, and pre-configured databases.
* **Dual Ingestion Systems**:
  * **Synthesizer Console**: Enter natural requirements to compile new code branches on-demand.
  * **Repository Importer**: Upload and ingest existing package repositories to review structural composition, analyze dependencies, and inspect active nodes.
* **Immersion-Grade Sandbox Simulator**:
  * Visual test-bed containing customized dashboards, charts, transaction ledgers, performance curves (rendered through visual vectors), and database tables.
  * Interactive forms, functional state controllers, and diagnostic trace mechanisms to verify logic flows in real time.
* **Integrated Copilot & AI Chat Manager**: Chat dynamically with an autonomous programming companion that performs code modifications, applies modular file revisions, and implements targeted feature refactors.
* **Technical Dependency & package Hub**: Inspect, audit, and inject global dependencies natively. View current package counts, list dev modules, and visualize dependency hierarchies.
* **Version Control SNAPSHOT Engine**: Seamless snapshot history tracks and saves every workspace revision. Recover previous compiles instantly with bulletproof rollback tracking.
* **Gemma Open Weights Cluster**: Embedded code assistance playgrounds configured with customized Google Gemma 2 and CodeGemma parameters tuned for syntax auditing, type safety compliance, and fast compiles.
* **Single-Click Repository Export**: Package your entire newly compiled stack (React 19, Vite, custom CSS configurations, and responsive sidebars) into a structured `.zip` archive for immediate external deployments.

---

## 🏛️ System Architecture Workflow

```
[ Natural Language Prompt ] ─> [ Smart Ingestion Compiler ]
                                            │
               ┌────────────────────────────┴──────────────────────────┐
               ▼                                                       ▼
  [ Gemini Generative Cloud API ]                             [ Aura Offline Sandbox Engine ]
  (Prototyping multi-agent layours)                           (Rule-based adaptive synthesis)
               │                                                       │
               └────────────────────────────┬──────────────────────────┘
                                            ▼
                             [ TS AST Code Sanitizer ]
                                            │
               ┌────────────────────────────┼──────────────────────────┐
               ▼                            ▼                          ▼
      [ Dynamic React App ]        [ Relational Schema ]      [ Active Workspace State ]
      (Interactive Sidebars, UI)   (Visual DB Coordinates)    (Telemetry Logs Console)
```

1. **Intake Processing**: Raw requirements are ingested through the Prompt Wizard or Repository Importer.
2. **Generative Processing**: The core server engine parses variables and, depending on environment variables, leverages the cloud Gemini API or activates Aura's custom fallback preset engine to model bespoke application structures.
3. **AST & Syntax Auditing**: Code paths undergo rigorous sanity checks to ensure syntax compliance, React 19 conformity, and Tailwind grid responsive layouts.
4. **Active Workspace Synchronization**: Compiled structures are broadcast to the Project Code Viewer, the Sandbox Simulator, and the localized History snapshot timeline.

---

## 🔌 Quick Start & Local Installation

### Prerequisites
* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher

### 1. Clone & Set Up Directory
```bash
git clone https://github.com/your-username/aura-ai-coding.git
cd aura-ai-coding
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
AuraAI uses server-side proxies to shield secrets from browser inspector tools. Create a `.env` file at the root:
```bash
cp .env.example .env
```
Add your sensitive Google Gemini API key to activate live layout generations:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Boot Development Ingress
Run the unified full-stack server process. This binds the Node server and the Vite compiler middleware securely to port `3000`:
```bash
npm run dev
```
Open a browser and navigate to: `http://localhost:3000`

---

## 🛠️ Environmental Variable Declaration (`.env.example`)

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Recommended | `""` | Google AI Studio developer token. Activates live, non-simulated generative coding channels. |
| `PORT` | Optional | `3000` | Networking ingress port routing for the host machine container. |

---

## 🪐 Typography & Aesthetic Identity (The Cosmic Vibe)

AuraAI features a spectacular **Space-Dark Cybernetic** visual theme inspired by deep-sky nebula constellations. 
* **Primary Fonts**: Paired elegant **Inter** (sans-serif) for high general layout readability with **Space Grotesk** (display titles) for sleek futuristic subtitles.
* **Code Blocks**: Formatted with high-contrast, type-safe matching **JetBrains Mono** displaying styled keywords, comments, and tags.
* **Neon Glow Details**: Vibrant cyan (`#06b6d4`, representing visual brackets `<`) and purple-pink (`#a855f7` to `#f472b6`, representing structural brackets `>`) highlights illuminate the margins, headers, cards, and interactive buttons to provide precise focal feedback.

---

## 📦 Bundling & Production Compilation

Aura compiles into high performance, standalone CJS binaries coupled with static Web client representations.

### Build Production Assets
Generate optimized client chunks and bundle the TypeScript Node server into a self-contained runtime:
```bash
npm run build
```

### Start Standalone Host
Launch the compiled container service directly:
```bash
npm run start
```
By bundling paths at build-time, cold starts and file-system indexing overhead are entirely bypassed.

---

## 🧪 License & Community

Distributed under the MIT License. See `LICENSE` for details. AuraAI is open-source and welcomes contributions aiming to advance developer-first autonomous workspaces.
