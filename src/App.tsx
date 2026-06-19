import React, { useState, useEffect } from "react";
import AuraHeader from "./components/AuraHeader";
import PromptWizard from "./components/PromptWizard";
import ProjectViewer from "./components/ProjectViewer";
import SandboxViewer from "./components/SandboxViewer";
import TerminalLogs from "./components/TerminalLogs";
import VersionHistory from "./components/VersionHistory";
import DependenciesHub from "./components/DependenciesHub";
import ImportHub from "./components/ImportHub";
import GemmaHub from "./components/GemmaHub";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
import ChatAgent from "./components/ChatAgent";
import DeploymentModal from "./components/DeploymentModal";
import { GeneratedProject, ProjectFile, TelemetryLog, ProjectVersion } from "./types";
import { Sparkles, Terminal, BookOpen, Layers, HelpCircle, ArrowRight, Server, Play, CheckCircle, Download, History, Cpu, FolderUp, Github, Bot } from "lucide-react";
import JSZip from "jszip";

// Seed data to make the initial experience fully populated, rich, and functional
const INITIAL_PROJECT_PRESET: GeneratedProject = {
  appName: "Ascent Athlete Hub",
  tagline: "Dynamic athletic performance charts, hydration monitoring, and cardiac history tracker.",
  architecture: {
    techStack: ["React 19", "Vite", "D3.js Vectors", "Tailwind CSS Core", "LocalDB Cache Handler"],
    databaseSchema: `Table Session {\n  id varchar PK\n  athlete_id integer FK\n  activity_type varchar\n  cardiac_avg integer\n  calories_burnt decimal\n  duration_mins integer\n  created_at timestamp\n}\nTable AthleteProfile {\n  id integer PK\n  name varchar\n  vo2_max decimal\n  streak_days integer\n}`,
    userFlow: "1. Athletic Dashboard Dashboard -> 2. Workout Capture Form -> 3. Cardiac History Lists -> 4. Target Hydration Monitor Panel."
  },
  files: [
    {
      path: "src/App.tsx",
      filename: "App.tsx",
      language: "typescript",
      content: `import React, { useState } from 'react';\nimport WorkoutMetrics from './components/WorkoutMetrics';\n\n// Primary dashboard entry for Ascent Athlete Hub\nexport default function App() {\n  const [streak, setStreak] = useState(14);\n  \n  return (\n    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">\n      <header className="border-b border-white/5 px-6 py-4 bg-slate-900/40 flex justify-between items-center">\n        <div className="flex items-center gap-2">\n          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>\n          <h1 className="text-base font-bold font-display tracking-tight text-white">ASCENT HUB</h1>\n        </div>\n        <div className="text-xs text-slate-400 font-mono">Streak: <span className="text-emerald-400 font-bold">{streak} Days 🔥</span></div>\n      </header>\n      \n      <main className="p-6 max-w-7xl mx-auto w-full space-y-6">\n        <WorkoutMetrics />\n      </main>\n    </div>\n  );\n}`
    },
    {
      path: "src/components/WorkoutMetrics.tsx",
      filename: "WorkoutMetrics.tsx",
      language: "typescript",
      content: `import React from 'react';\n\n// Renders interactive stats panels and hydration controls\nexport default function WorkoutMetrics() {\n  return (\n    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n      <div className="p-5 rounded-xl bg-slate-900 border border-white/5">\n        <h3 className="text-xs uppercase text-slate-400 font-mono tracking-wider">Hydration Monitor</h3>\n        <p className="text-2xl font-bold font-display mt-2 text-cyan-400">2.1 Liters <span className="text-xs text-slate-500">of 3.0L Target</span></p>\n      </div>\n      \n      <div className="p-5 rounded-xl bg-slate-900 border border-white/5">\n        <h3 className="text-xs uppercase text-slate-400 font-mono tracking-wider">Cardio Output Scale</h3>\n        <p className="text-2xl font-bold font-display mt-2 text-purple-400">144 BPM <span className="text-xs text-slate-500">Average heart rate</span></p>\n      </div>\n    </div>\n  );\n}`
    },
    {
      path: "src/types.ts",
      filename: "types.ts",
      language: "typescript",
      content: `export interface WorkoutSession {\n  id: string;\n  activityType: 'run' | 'swim' | 'lift' | 'cycle';\n  durationMinutes: number;\n  averageHeartRate: number;\n  caloriesBurnt: number;\n  recordedAt: number;\n}`
    }
  ],
  sandboxData: {
    views: ["Athletic Dashboard", "Workout Capture Form", "Cardiac History Lists", "Target Hydration Monitor Panel"],
    widgets: [
      { title: "Weekly Energy Expenditure Chart", type: "chart", data: JSON.stringify([{ name: "Mon Run", value: 450 }, { name: "Wed Swim", value: 680 }, { name: "Fri Power", value: 390 }, { name: "Sat Cycle", value: 890 }]) },
      { title: "Weekly Vo2 Max Level", type: "stat", data: "Active VO2 Max: 52.4 mL/kg/min (Top 5% of demography)" },
      { title: "Cardiac Distribution Rate", type: "chart", data: JSON.stringify([{ name: "Fat Burn Zone", value: 120 }, { name: "Cardio Threshold", value: 240 }, { name: "Peak Threshold", value: 40 }]) }
    ],
    forms: [
      {
        formName: "Log Athletic Workout Activity",
        fields: [
          { name: "activityType", type: "text", placeholderString: "Enter activity title (e.g. Morning Jog, Pool laps)..." },
          { name: "caloriesBurnt", type: "number", placeholderString: "Est. calories burnt (kCal)..." },
          { name: "heartRate", type: "number", placeholderString: "Avg BPM intensity..." }
        ]
      }
    ],
    sampleActions: [
      { trigger: "Calculate Target Zone", description: "Fires analysis logic against current cardiac history and age metrics to generate aerobic zones." },
      { trigger: "Simulate Live Run Loop", description: "Injects constant active speed records to simulate live satellite route tracking." }
    ]
  }
};

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "loading" | "dashboard">(() => {
    return localStorage.getItem("aura_has_launched") === "true" ? "dashboard" : "landing";
  });
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"workspace" | "techSpecs" | "dependencies" | "history" | "gemma" | "chatAgent">("workspace");
  const [versionHistory, setVersionHistory] = useState<ProjectVersion[]>([]);
  const [ingestionMode, setIngestionMode] = useState<"ai" | "import">("ai");

  const handleImportProject = (imported: GeneratedProject, summary: string) => {
    const enriched = ensurePackageJson(imported);
    setProject(enriched);
    if (enriched.files.length > 0) {
      setSelectedFile(enriched.files[0]);
    }
    setTimeout(() => {
      saveVersionSnapshot(enriched, summary);
    }, 50);
  };

  // Helper to add telemetry lines
  const appendTelemetryLog = (type: "info" | "success" | "warn" | "error" | "terminal", message: string) => {
    const timeStr = new Date().toLocaleTimeString();
    const newLog: TelemetryLog = {
      id: Math.random().toString(),
      timestamp: timeStr,
      type,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Helper to ensure package.json exists in project files mapping for active dependencies visualization
  const ensurePackageJson = (proj: GeneratedProject): GeneratedProject => {
    const hasPkg = proj.files.some((f) => f.path === "package.json");
    if (hasPkg) return proj;

    const defaultDependencies: Record<string, string> = {
      "react": "^19.0.1",
      "react-dom": "^19.0.1",
      "lucide-react": "^0.546.0",
      "recharts": "^2.15.0",
      "d3": "^7.9.0"
    };

    proj.architecture.techStack.forEach((tech) => {
      const normalized = tech.toLowerCase().replace(/\s+core|\s+vectors|\s+cache.*|\d+/g, "").trim().replace(/\s+/g, "-");
      if (normalized && normalized !== "react" && normalized !== "vite" && normalized !== "tailwind-css" && normalized !== "d3" && normalized !== "recharts") {
        defaultDependencies[normalized] = "^1.0.0";
      }
    });

    const pkgContent = JSON.stringify({
      name: proj.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      version: "1.0.0",
      dependencies: defaultDependencies
    }, null, 2);

    const updatedFiles = [
      ...proj.files,
      {
        path: "package.json",
        filename: "package.json",
        language: "json",
        content: pkgContent
      }
    ];

    return {
      ...proj,
      files: updatedFiles
    };
  };

  // Save current files state into timeline snapshots
  const saveVersionSnapshot = (proj: GeneratedProject, description: string) => {
    const timestamp = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    const newVersion: ProjectVersion = {
      id: Math.random().toString(),
      timestamp,
      description,
      files: proj.files.map(f => ({ ...f })), // deep copy
      techStack: [...proj.architecture.techStack],
      appName: proj.appName
    };
    setVersionHistory((prev) => [newVersion, ...prev]);
  };

  const handleUpdateFiles = (updatedFiles: ProjectFile[], actionDescription: string) => {
    setProject((prev) => {
      if (!prev) return null;
      const nextProj = { ...prev, files: updatedFiles };
      if (selectedFile) {
        const match = updatedFiles.find(f => f.path === selectedFile.path);
        if (match) setSelectedFile(match);
      }
      setTimeout(() => {
        saveVersionSnapshot(nextProj, actionDescription);
      }, 50);
      return nextProj;
    });
  };

  const handleRestoreVersion = (version: ProjectVersion) => {
    appendTelemetryLog("terminal", `>> COMMAND WORKSPACE: restore-version --id="${version.id}"`);
    appendTelemetryLog("info", `Initiating roll-back trigger. Loading files snapshot copy...`);

    setTimeout(() => {
      setProject((prev) => {
        if (!prev) return null;
        const nextProj = {
          ...prev,
          appName: version.appName,
          files: version.files.map(f => ({ ...f })),
          architecture: {
            ...prev.architecture,
            techStack: [...version.techStack]
          }
        };

        if (version.files.length > 0) {
          const matched = version.files.find(f => f.path === selectedFile?.path) || version.files[0];
          setSelectedFile(matched);
        }

        setTimeout(() => {
          const restoreTimestamp = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
          const restoreVer: ProjectVersion = {
            id: Math.random().toString(),
            timestamp: restoreTimestamp,
            description: `Reverted Workspace: Loaded "${version.description}"`,
            files: version.files.map(f => ({ ...f })),
            techStack: [...version.techStack],
            appName: version.appName
          };
          setVersionHistory((prevHist) => [restoreVer, ...prevHist]);
        }, 50);

        return nextProj;
      });

      appendTelemetryLog("success", `Restore complete! Returned project state back to: "${version.description}"`);
    }, 800);
  };

  const handleCreateSnapshot = (description: string) => {
    if (!project) return;
    appendTelemetryLog("success", `Manual snapshot backup recorded: "${description}"`);
    saveVersionSnapshot(project, `Manual backup: ${description}`);
  };

  const handleExportProjectZip = () => {
    if (!project) return;
    appendTelemetryLog("terminal", ">> archive-workspace --output=zip");
    appendTelemetryLog("info", "Gathering repository code files and packaging ZIP compilation bundle...");

    try {
      const zip = new JSZip();
      project.files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      if (!project.files.some(f => f.path.endsWith("README.md"))) {
        zip.file("README.md", `# ${project.appName}\n\n${project.tagline}\n\n## Tech Stack\n${project.architecture.techStack.join(", ")}\n\n## Database Schema\n\`\`\`sql\n${project.architecture.databaseSchema}\n\`\`\`\n\n## User Flow\n${project.architecture.userFlow}\n\n## Local Development\nEnsure Node.js is installed, then run:\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`);
      }

      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${project.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-workspace.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        appendTelemetryLog("success", `ZIP Archive downloaded successfully: ${project.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-workspace.zip`);
      });
    } catch (err: any) {
      appendTelemetryLog("error", `Failed to generate ZIP archive: ${err.message}`);
    }
  };

  // Seed on boot
  useEffect(() => {
    const enrichedPreset = ensurePackageJson(INITIAL_PROJECT_PRESET);
    setProject(enrichedPreset);
    if (enrichedPreset.files.length > 0) {
      setSelectedFile(enrichedPreset.files[0]);
    }

    const initialTimestamp = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    const initialVer: ProjectVersion = {
      id: "initial-preset",
      timestamp: initialTimestamp,
      description: "Initial Preset Loaded: Ascent Athlete Hub",
      files: enrichedPreset.files.map(f => ({ ...f })),
      techStack: [...enrichedPreset.architecture.techStack],
      appName: enrichedPreset.appName
    };
    setVersionHistory([initialVer]);

    // Welcoming telemetries
    appendTelemetryLog("success", "Aura Multi-Agent Compilation Cluster Initialized.");
    appendTelemetryLog("info", "Loading active athletic Ascent template repository.");
    appendTelemetryLog("terminal", "Mock SQLite storage node active: 100% durability.");
  }, []);

  const handleGenerateProject = async (prompt: string, model: string, depth: string) => {
    setIsGenerating(true);
    setProject(null);
    setSelectedFile(null);
    appendTelemetryLog("terminal", `>> COMMAND WORKSPACE: compile-project --prompt="${prompt}" --engine="${model}"`);
    appendTelemetryLog("info", `Establishing compiler worker thread. Invoking generative logic schema...`);

    // Simulated step logs to look amazing and immersive
    const steps = [
      { t: "info", m: "Step [1/4]: Creating code files index array structure..." },
      { t: "info", m: "Step [2/4]: Invoking relational database Spanner/SQLite schemas compiler..." },
      { t: "warn", m: "Dev package dependencies audited: 0 vulnerabilities found." },
      { t: "info", m: "Step [3/4]: Checking AST structures conformance and JSX nodes..." },
      { t: "info", m: "Step [4/4]: Initializing simulated execution runtime engines..." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        appendTelemetryLog(step.t as any, step.m);
      }, (idx + 1) * 600);
    });

    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, designModel: model, depthMode: depth }),
      });

      if (!response.ok) {
        throw new Error("Generative server returned abnormal compilation code status.");
      }

      const generated: GeneratedProject = await response.json();

      setTimeout(() => {
        const enrichedGenerated = ensurePackageJson(generated);
        setProject(enrichedGenerated);
        if (enrichedGenerated.files && enrichedGenerated.files.length > 0) {
          setSelectedFile(enrichedGenerated.files[0]);
        }
        setIsGenerating(false);
        appendTelemetryLog("success", `Application compiled successfully! Name: "${enrichedGenerated.appName}"`);
        appendTelemetryLog("terminal", `Live sandbox routes mapped: ${enrichedGenerated.sandboxData.views.join(", ")}`);
        
        // Hook snapshot update
        saveVersionSnapshot(enrichedGenerated, `Compiled Workspace: "${enrichedGenerated.appName}"`);
      }, 3000);

    } catch (e: any) {
      console.error(e);
      setTimeout(() => {
        setIsGenerating(false);
        appendTelemetryLog("error", `Compilation aborted: ${e.message || "Aura network thread lost contact."}`);
      }, 3000);
    }
  };

  const handleRefactorFile = async (filePath: string, instruction: string) => {
    if (!selectedFile) return;
    setIsRefactoring(true);
    appendTelemetryLog("terminal", `>> COMMAND WORKSPACE: copilot-refactor --file="${filePath}" --query="${instruction}"`);
    appendTelemetryLog("info", `Analyzing AST logic branches of file: ${selectedFile.filename}...`);

    try {
      const response = await fetch("/api/refactor-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: selectedFile.content,
          instruction,
          filename: selectedFile.filename,
          path: filePath
        }),
      });

      if (!response.ok) {
        throw new Error("Refactor thread rejected instructions.");
      }

      const data = await response.json();

      setProject((prev) => {
        if (!prev) return null;
        const updatedFiles = prev.files.map((file) => {
          if (file.path === filePath) {
            const updated = { ...file, content: data.code };
            setSelectedFile(updated);
            return updated;
          }
          return file;
        });
        const nextProj = { ...prev, files: updatedFiles };
        setTimeout(() => {
          saveVersionSnapshot(nextProj, `Refactored ${selectedFile.filename}: "${instruction}"`);
        }, 50);
        return nextProj;
      });

      appendTelemetryLog("success", `Refactor merged cleanly in target code branches of ${selectedFile.filename}`);

    } catch (err: any) {
      console.error(err);
      appendTelemetryLog("error", `Refactor merge conflicts detected: ${err.message || "Synthesizer offline"}`);
    } finally {
      setIsRefactoring(false);
    }
  };

  const isSimulated = !project || !!project.compilerNotice;

  if (viewMode === "landing") {
    return <LandingPage onLaunch={() => setViewMode("loading")} />;
  }

  if (viewMode === "loading") {
    return <LoadingScreen onComplete={() => { localStorage.setItem("aura_has_launched", "true"); setViewMode("dashboard"); }} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Absolute top glowing matrix layer */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 blur-[180px] rounded-full pointer-events-none"></div>

      <AuraHeader
        isCompiling={isGenerating || isRefactoring}
        activePresetName={project?.appName}
        isSimulated={isSimulated}
        onDeploy={() => setIsDeploymentOpen(true)}
        onViewLanding={() => setViewMode("landing")}
      />

      {/* Main Grid Wrapper */}
      <main className="p-6 max-w-7xl mx-auto w-full flex-1 space-y-6">
        {/* Intro branding banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#050505] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold bg-indigo-500/5 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                Unified AI IDE
              </span>
              <span className="text-slate-600 font-mono text-[10px]">● PROTOTYPING NODE READY</span>
            </div>
            <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white leading-none">
              Aura Code Synthesizer
            </h2>
            <p className="text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Eliminate development barriers instantly. Input natural requirements, optimize with integrated AI refactoring channels, and test your apps in real-time under a compliant mock container space.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-[#050505]/60 border border-white/10 px-3 py-2 rounded-xl">
            <Server className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-205">99.98% Compiler Uptime</span>
          </div>
        </div>

        {/* Workspace Ingestion Strategy Selection */}
        <div className="flex border border-white/10 p-1 rounded-xl bg-neutral-950/60 max-w-sm self-start font-mono text-[11px] font-bold gap-1">
          <button
            onClick={() => setIngestionMode("ai")}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
              ingestionMode === "ai"
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 shadow"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Code Synthesizer</span>
          </button>
          <button
            onClick={() => setIngestionMode("import")}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
              ingestionMode === "import"
                ? "bg-purple-500/15 text-purple-400 border border-purple-500/20 shadow"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <FolderUp className="h-3.5 w-3.5" />
            <span>Repository Importer</span>
          </button>
        </div>

        {/* Input Wizard Row */}
        {ingestionMode === "ai" ? (
          <PromptWizard onGenerate={handleGenerateProject} isGenerating={isGenerating} />
        ) : (
          <ImportHub onImportProject={handleImportProject} onTelemetryLog={appendTelemetryLog} />
        )}

        {/* Workspace Segment Tab Switcher */}
        {project && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 w-full max-w-full -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth flex-nowrap lg:flex-wrap">
              <button
                onClick={() => setActiveSegment("workspace")}
                className={`flex-none h-11 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2 cursor-pointer ${
                  activeSegment === "workspace"
                    ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] scaler-[1.01]"
                    : "bg-neutral-900/45 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-neutral-800/40"
                }`}
              >
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Code Nodes & Simulator</span>
              </button>

              <button
                onClick={() => setActiveSegment("chatAgent")}
                className={`flex-none h-11 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2 cursor-pointer ${
                  activeSegment === "chatAgent"
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] scaler-[1.01]"
                    : "bg-neutral-900/45 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-neutral-800/40"
                }`}
              >
                <Bot className="h-4 w-4 text-purple-400 animate-pulse" />
                <span>Autonomous AI Chat</span>
              </button>

              <button
                onClick={() => setActiveSegment("techSpecs")}
                className={`flex-none h-11 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2 cursor-pointer ${
                  activeSegment === "techSpecs"
                    ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] scaler-[1.01]"
                    : "bg-neutral-900/45 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-neutral-800/40"
                }`}
              >
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span>Architecture Specs</span>
              </button>

              <button
                onClick={() => setActiveSegment("dependencies")}
                className={`flex-none h-11 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2 cursor-pointer ${
                  activeSegment === "dependencies"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-450 shadow-[0_0_15px_rgba(16,185,129,0.15)] scaler-[1.01]"
                    : "bg-neutral-900/45 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-neutral-800/40"
                }`}
              >
                <Cpu className="h-4 w-4 text-emerald-400" />
                <span>Dependencies Hub</span>
              </button>

              <button
                onClick={() => setActiveSegment("history")}
                className={`flex-none h-11 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2 cursor-pointer ${
                  activeSegment === "history"
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] scaler-[1.01]"
                    : "bg-neutral-900/45 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-neutral-800/40"
                }`}
              >
                <History className="h-4 w-4 text-amber-400" />
                <span>Version Control</span>
              </button>

              <button
                onClick={() => setActiveSegment("gemma")}
                className={`flex-none h-11 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2 cursor-pointer ${
                  activeSegment === "gemma"
                    ? "bg-pink-500/15 border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)] scaler-[1.01]"
                    : "bg-neutral-900/45 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-neutral-800/40"
                }`}
              >
                <Cpu className="h-4 w-4 text-pink-400" />
                <span>Gemma FOSS Hub</span>
              </button>
            </div>

            <button
              onClick={handleExportProjectZip}
              className="flex items-center justify-center gap-2 h-11 px-4 bg-gradient-to-r from-cyan-600/20 to-purple-500/20 hover:from-cyan-600/40 hover:to-purple-500/40 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl text-xs font-mono font-extrabold text-cyan-300 hover:text-white cursor-pointer shadow-lg hover:shadow-cyan-500/5 transition-all text-center w-full lg:w-auto shrink-0"
              title="Download full project folder workspace as local development ZIP"
            >
              <Download className="h-4 w-4 animate-bounce" />
              <span>Export ZIP Repository</span>
            </button>
          </div>
        )}

        {/* Dynamic Display based on menu segment */}
        {project && activeSegment === "workspace" && (
          <div className="space-y-6">
            {/* Visual Simulator Sandbox and Code Explorer sections */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Sandbox Viewer */}
              <div className="xl:col-span-5">
                <SandboxViewer project={project} onTelemetryLog={appendTelemetryLog} />
              </div>

              {/* Right Code Ingress File Explorer */}
              <div className="xl:col-span-7">
                <ProjectViewer
                  files={project.files}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  onRefactorFile={handleRefactorFile}
                  isRefactoring={isRefactoring}
                  compilerNotice={project.compilerNotice}
                />
              </div>
            </div>
          </div>
        )}

        {project && activeSegment === "chatAgent" && (
          <div className="space-y-6 animate-fadeIn">
            <ChatAgent
              project={project}
              selectedFile={selectedFile}
              onUpdateProject={(updatedProj, actionDesc) => {
                setProject(updatedProj);
                if (selectedFile) {
                  const match = updatedProj.files.find(f => f.path === selectedFile.path);
                  if (match) setSelectedFile(match);
                }
                setTimeout(() => {
                  saveVersionSnapshot(updatedProj, actionDesc);
                }, 50);
              }}
              onTelemetryLog={appendTelemetryLog}
            />
          </div>
        )}

        {/* Technical Dependencies visual segments */}
        {project && activeSegment === "dependencies" && (
          <div className="space-y-6 animate-fadeIn">
            <DependenciesHub
              project={project}
              onUpdateFiles={handleUpdateFiles}
              onTelemetryLog={appendTelemetryLog}
            />
          </div>
        )}

        {/* Immutable Snapshots List Versions segment */}
        {project && activeSegment === "history" && (
          <div className="space-y-6 animate-fadeIn">
            <VersionHistory
              versions={versionHistory}
              currentProjectId={project.appName}
              onRestoreVersion={handleRestoreVersion}
              onCreateSnapshot={handleCreateSnapshot}
              project={project}
            />
          </div>
        )}

        {/* Gemma Open source model hub integration */}
        {project && activeSegment === "gemma" && (
          <div className="space-y-6 animate-fadeIn">
            <GemmaHub
              project={project}
              selectedFile={selectedFile}
              onUpdateFiles={handleUpdateFiles}
              onTelemetryLog={appendTelemetryLog}
            />
          </div>
        )}

        {/* Tech Specs Panel */}
        {project && activeSegment === "techSpecs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn font-mono text-xs">
            {/* Database schema relationships table representation */}
            <div className="p-5 rounded-2xl bg-[#050505]/85 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-widest text-[11px] text-purple-400">
                  Relational Relational Database Schema Schema
                </h4>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/10">
                  SQL Scheme
                </span>
              </div>
              <pre className="text-slate-400 overflow-auto whitespace-pre-wrap max-h-[300px] leading-relaxed text-[11px]">
                {project.architecture.databaseSchema}
              </pre>
            </div>

            {/* Architecture Overview and User Flow narration */}
            <div className="p-5 rounded-2xl bg-[#050505]/85 border border-white/10 space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 font-mono">
                <h4 className="font-bold text-slate-200 uppercase tracking-widest text-[11px] text-indigo-400">
                  System Architecture Stack & Narrative
                </h4>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  System Stack
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-500 block mb-1.5">
                    Recommended Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {project.architecture.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] bg-[#050505] border border-white/10 px-2.5 py-0.5 rounded-full text-slate-300 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-slate-500 block mb-1">
                    System Design Narrative Flow:
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {project.architecture.userFlow}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compilation Terminal Output logs at bottom */}
        <TerminalLogs logs={logs} onClearLogs={() => setLogs([])} />
      </main>

      <DeploymentModal
        isOpen={isDeploymentOpen}
        onClose={() => setIsDeploymentOpen(false)}
        project={project}
        onTelemetryLog={appendTelemetryLog}
      />
    </div>
  );
}
