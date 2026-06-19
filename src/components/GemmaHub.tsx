import React, { useState } from "react";
import { Cpu, Terminal, Sparkles, Check, Copy, BookOpen, Download, ShieldAlert, Code, PlayCircle, Layers, CheckCircle } from "lucide-react";
import { GeneratedProject, ProjectFile } from "../types";

interface GemmaHubProps {
  project: GeneratedProject | null;
  selectedFile: ProjectFile | null;
  onUpdateFiles: (updated: ProjectFile[], description: string) => void;
  onTelemetryLog: (type: "info" | "success" | "warn" | "error" | "terminal", message: string) => void;
}

interface GemmaModelSchema {
  id: string;
  name: string;
  tag: string;
  role: string;
  size: string;
  context: string;
  suitability: string;
  license: string;
  ollamaCmd: string;
}

const GEMMA_MODELS: GemmaModelSchema[] = [
  {
    id: "gemma-4-coder",
    name: "Gemma 4 Coder (Experimental)",
    tag: "Next-Gen Open weights Alpha",
    role: "Ultimate multi-agent logical reasoning, massive context translation, type-safe full-stack software schemas.",
    size: "32B Parameters",
    context: "128k Token Window",
    suitability: "High-level visual structures and deep database schema indexing.",
    license: "Permissive Open Source (Gemma License)",
    ollamaCmd: "ollama run gemma4:32b-coder"
  },
  {
    id: "gemma-2-27b",
    name: "Gemma 2 27B",
    tag: "High-Fluency Heavyweight",
    role: "State-of-the-art open weights coding. Outperforms larger models in software design and complex algorithm syntax.",
    size: "27B Parameters",
    context: "32k Token Window",
    suitability: "Complex business logic handlers, state machines, and mathematical charts.",
    license: "Free & Open Weights",
    ollamaCmd: "ollama run gemma2:27b-coder"
  },
  {
    id: "gemma-2-9b",
    name: "Gemma 2 9B",
    tag: "Ultra-Fast Developer Edge",
    role: "Optimized compact computing. Ideal for standard edge laptops, rapid command line helpers, and instant execution.",
    size: "9B Parameters",
    context: "16k Token Window",
    suitability: "Utility functions, formatting templates, and routine test compilation.",
    license: "Free & Open Weights",
    ollamaCmd: "ollama run gemma2:9b"
  },
  {
    id: "codegemma",
    name: "CodeGemma 7B",
    tag: "Dedicated Programming Kernel",
    role: "Hardwired representation model specifically pre-trained and fine-tuned for code completion, filling-in-the-middle, and tests.",
    size: "7B Parameters",
    context: "8k Token Window",
    suitability: "Inline code completions, fast component styling patterns, and CLI automation.",
    license: "Free Special-Purpose Open Source",
    ollamaCmd: "ollama run codegemma"
  }
];

const PRESET_CODING_CHALLENGES = [
  {
    label: "Debounce Function",
    snippet: "Create a generic TypeScript debounce function helper with appropriate listener cancellation support.",
    response: `/**
 * Gemma-Generated TypeScript Debounce Utility
 * Fully type-safe and client-compliant.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): {
  (...args: Parameters<T>): void;
  cancel(): void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const context = this;
    
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}`
  },
  {
    label: "Tailwind Theme Builder",
    snippet: "Build a responsive Tailwind theme utility helper function that generates color scheme lists.",
    response: `/**
 * Gemma-Generated Tailwind Palette Transformer
 * Converts hex definitions into formatted Tailwind CSS token references.
 */
export interface ColorToken {
  name: string;
  value: string;
  classStr: string;
}

export function compileTailwindPalette(baseHex: string, steps = 5): ColorToken[] {
  // Simulates shifting brightness multipliers for custom color generation
  const tokens: ColorToken[] = [];
  const cleanHex = baseHex.replace("#", "");
  
  for (let i = 1; i <= steps; i++) {
    const weight = i * 100;
    const factor = 1 - (i / 10);
    
    // Simple mock RGB shifting values
    const r = Math.min(255, Math.floor(parseInt(cleanHex.substring(0,2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(cleanHex.substring(2,4), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(cleanHex.substring(4,6), 16) * factor));
    
    const hexResult = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
    
    tokens.push({
      name: \`color-\${weight}\`,
      value: hexResult,
      classStr: \`bg-[\${hexResult}] text-white\`
    });
  }
  
  return tokens;
}`
  },
  {
    label: "SQLite Auth Schema",
    snippet: "Draft a modern TypeScript/SQL schema for secure local token-based sessions.",
    response: `/**
 * Gemma-Generated SQLite Database Session Schema
 * Standardized data layout structures.
 */
export const SQL_SESSION_SCHEMA = \`
CREATE TABLE IF NOT EXISTS user_accounts (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'developer' CHECK(role IN ('admin', 'developer', 'guest')),
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS oauth_sessions (
  token_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked INTEGER DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON oauth_sessions(user_id);
\`;`
  }
];

export default function GemmaHub({ project, selectedFile, onUpdateFiles, onTelemetryLog }: GemmaHubProps) {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [synthesizedCode, setSynthesizedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [deployTab, setDeployTab] = useState<"ollama" | "docker" | "python">("ollama");

  const model = GEMMA_MODELS[selectedModelIndex];

  const handleCopyCode = () => {
    if (!synthesizedCode) return;
    navigator.clipboard.writeText(synthesizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onTelemetryLog("success", "Gemma code snippet copied to clipboard.");
  };

  const handleInjectCode = () => {
    if (!project || !selectedFile || !synthesizedCode) {
      onTelemetryLog("error", "No active target code file is selected in your workspace sidebar.");
      return;
    }

    const updatedFiles = project.files.map((file) => {
      if (file.path === selectedFile.path) {
        // Append snippet to top of file cleanly or integrate it
        const newContent = `${synthesizedCode}\n\n${file.content}`;
        return { ...file, content: newContent };
      }
      return file;
    });

    onUpdateFiles(updatedFiles, `Injected helper generated by: "${model.name}" into ${selectedFile.filename}`);
    onTelemetryLog("success", `Successfully injected Gemma synthesized helper block into the top of "${selectedFile.filename}"!`);
  };

  const handleSynthesize = (promptText = customPrompt) => {
    if (!promptText.trim()) return;
    setIsCompiling(true);
    setSynthesizedCode("");
    
    onTelemetryLog("terminal", `>> local-eval --model="${model.id}" --task="${promptText.slice(0, 35)}..."`);
    onTelemetryLog("info", `Warming open-weights compiler workers. Allocating memory indices on ${model.name}...`);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      onTelemetryLog("info", `Gemma computational pipeline running. Compile progress: ${progress}%...`);
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      // Construct a generic customized code snippet based on what they wrote if it's not a preset
      let dynamicResult = "";
      if (promptText.toLowerCase().includes("debounce")) {
        dynamicResult = PRESET_CODING_CHALLENGES[0].response;
      } else if (promptText.toLowerCase().includes("tailwind") || promptText.toLowerCase().includes("palette")) {
        dynamicResult = PRESET_CODING_CHALLENGES[1].response;
      } else if (promptText.toLowerCase().includes("sql") || promptText.toLowerCase().includes("schema") || promptText.toLowerCase().includes("db")) {
        dynamicResult = PRESET_CODING_CHALLENGES[2].response;
      } else {
        // Universal generative fallback matching the custom prompt
        const functionName = promptText.trim().split(" ")[0].toLowerCase().replace(/[^a-z]+/g, "") || "gemmaHelper";
        dynamicResult = `/**
 * Gemma Code Synthesis Engine [Open Source & FOSS]
 * Automatically optimized for type-safety, performance, and memory durability.
 * Prompt: "${promptText}"
 */
export function ${functionName}Utility<T>(context: T) {
  // Model generated custom pipeline logic for: ${promptText}
  console.log("Gemma Open Weights helper: executing target thread with contexts", context);
  
  const computationTimestamp = Date.now();
  
  return {
    success: true,
    compiledBy: "${model.name}",
    origin: "Google Gemma Free Software Framework",
    timestamp: computationTimestamp,
    payload: context
  };
}`;
      }

      setSynthesizedCode(dynamicResult);
      setIsCompiling(false);
      onTelemetryLog("success", `Gemma synthesis execution finished! Returned type-safe response structure.`);
    }, 1500);
  };

  return (
    <div className="bg-[#050505]/80 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Visual background ambient gradient */}
      <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-purple-500/5 blur-[90px] rounded-full pointer-events-none"></div>

      <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10 flex-wrap gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-purple-400" />
          <h2 className="font-display font-extrabold text-slate-100 tracking-tight text-base">
            Gemma FOSS Integration & Micro-Agent Workspace
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded text-[10px] bg-purple-500/15 border border-purple-500/25 text-purple-300 uppercase tracking-widest font-extrabold">
          FREE & OPEN SOURCE
        </span>
      </div>

      <p className="text-white/40 text-sm leading-relaxed max-w-3xl mb-6">
        Google's flagship <strong>Gemma 2</strong> and next-gen experimental coding models represent the absolute pinnacle of open weight software engineering agents. Download them to run locally on your device or simulate specialized code synthesis helpers directly inside your live sandbox workspace.
      </p>

      {/* Grid of Gemma model selector boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {GEMMA_MODELS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => { setSelectedModelIndex(index); setSynthesizedCode(""); }}
            className={`p-4 text-left rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedModelIndex === index
                ? "bg-purple-950/20 border-purple-500/55 shadow-lg shadow-purple-500/5"
                : "bg-black/35 border-white/5 hover:border-purple-500/20"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  selectedModelIndex === index ? "bg-purple-500/20 text-purple-300" : "bg-white/5 text-slate-500"
                }`}>
                  {item.size}
                </span>
                <span className="text-[9px] text-slate-600 font-mono">
                  Ctx: {item.context}
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-200 text-xs mb-1">
                {item.name}
              </h3>
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                {item.tag}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[10px] font-mono font-bold text-purple-400 uppercase">
              <span>Select Core</span>
              <span className={`h-1.5 w-1.5 rounded-full ${selectedModelIndex === index ? "bg-purple-400 animate-pulse" : "bg-slate-700"}`}></span>
            </div>
          </button>
        ))}
      </div>

      {/* Main interactive split terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Playgound prompting console column */}
        <div className="space-y-4">
          <div className="bg-[#050505] border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="text-xs uppercase font-mono font-extrabold text-purple-400 flex items-center gap-1">
              <Terminal className="h-4 w-4" />
              Gemma Quick-synthesis Terminal
            </h3>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-500 font-mono">
                Selected Active Kernell Parameters:
              </label>
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[10.5px] space-y-1 text-slate-450">
                <div><span className="text-purple-400">Class:</span> {model.name}</div>
                <div><span className="text-purple-400">Primary Objective:</span> {model.role}</div>
                <div><span className="text-purple-400">License Architecture:</span> {model.license}</div>
                <div><span className="text-purple-400">Optimum Range:</span> {model.suitability}</div>
              </div>
            </div>

            {/* Quick Presets row */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase text-slate-500 font-mono">
                Load Fast Coding Challenge Presets:
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_CODING_CHALLENGES.map((challenge, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomPrompt(challenge.snippet);
                      handleSynthesize(challenge.snippet);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/20 text-[10.5px] font-mono text-slate-300 hover:text-white cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Code className="h-3 w-3 text-purple-400" />
                    <span>{challenge.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Form Input */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[10px] uppercase text-slate-500 font-mono">
                Write Custom Prompt for Gemma:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Write a TypeScript debounce helper, math formulas, data structures..."
                  className="flex-1 bg-[#050505] border border-white/10 focus:border-purple-400/50 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-650 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleSynthesize()}
                  disabled={isCompiling || !customPrompt.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-400 font-bold transition-all text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {isCompiling ? (
                    <span className="animate-spin text-white">⚙</span>
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  <span>Synthesize</span>
                </button>
              </div>
            </div>
          </div>

          {/* Local Deployment copy block */}
          <div className="bg-[#050505] border border-white/10 rounded-xl p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="uppercase font-extrabold text-slate-300 flex items-center gap-1">
                <Download className="h-4 w-4 text-purple-400" />
                Local Deployment Blueprint
              </span>
              <div className="flex gap-1.5 text-[10px]">
                <button
                  onClick={() => setDeployTab("ollama")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    deployTab === "ollama" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Ollama CLI
                </button>
                <button
                  onClick={() => setDeployTab("docker")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    deployTab === "docker" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Docker
                </button>
                <button
                  onClick={() => setDeployTab("python")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    deployTab === "python" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Transformers
                </button>
              </div>
            </div>

            {deployTab === "ollama" && (
              <div className="space-y-2">
                <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                  The simplest mechanism to run Gemma completely free on your local desktop using the beautiful Ollama toolbelt:
                </p>
                <div className="bg-black/50 p-3 rounded-lg border border-white/5 relative group">
                  <pre className="text-purple-300 select-all overflow-x-auto font-mono text-[11px]">
                    {model.ollamaCmd}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(model.ollamaCmd);
                      onTelemetryLog("success", "Ollama launch command copied.");
                    }}
                    className="absolute right-2 top-2 bg-neutral-900 group-hover:block hidden p-1 hover:bg-neutral-800 rounded border border-white/10 text-slate-400 cursor-pointer text-[10px]"
                    title="Copy command"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {deployTab === "docker" && (
              <div className="space-y-2">
                <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                  Host an on-demand REST API inference endpoint supporting standard OpenAI compatibility on your servers/local infrastructure:
                </p>
                <div className="bg-black/50 p-3 rounded-lg border border-white/5 overflow-x-auto relative group max-h-[150px]">
                  <pre className="text-emerald-400 text-[10px] leading-relaxed">
{`version: '3.8'
services:
  gemma-inference:
    image: ollama/ollama:latest
    container_name: gemma-local-service
    ports:
      - "11434:11434"
    volumes:
      - ./gemma_models:/root/.ollama
    restart: unless-stopped`}
                  </pre>
                </div>
              </div>
            )}

            {deployTab === "python" && (
              <div className="space-y-2">
                <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                  Query Gemma programmatically using the Hugging Face Transformers Python pipeline block:
                </p>
                <div className="bg-black/50 p-3 rounded-lg border border-white/5 overflow-x-auto max-h-[150px]">
                  <pre className="text-amber-300 text-[10px] leading-relaxed">
{`from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("google/gemma-2-27b-it")
model = AutoModelForCausalLM.from_pretrained("google/gemma-2-27b-it")

input_text = "Write a type-safe TypeScript debounce function."
input_ids = tokenizer(input_text, return_tensors="pt")

outputs = model.generate(**input_ids, max_new_tokens=256)
print(tokenizer.decode(outputs[0]))`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Code Result column */}
        <div className="space-y-4">
          <div className="bg-[#050505] border border-white/10 rounded-xl p-5 space-y-4 min-h-[384px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-xs uppercase font-mono font-extrabold text-indigo-400 flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  Synthesized Code Snippet
                </span>

                {synthesizedCode && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[10px] font-mono font-bold text-slate-300 cursor-pointer flex items-center gap-1 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-slate-400" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleInjectCode}
                      className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/30 rounded text-[10px] font-mono font-bold text-purple-300 cursor-pointer flex items-center gap-1 transition-all"
                      title={selectedFile ? `Inject code into ${selectedFile.filename}` : "Select a codebase file first"}
                    >
                      <Layers className="h-3 w-3 text-purple-400" />
                      <span>Inject into {selectedFile ? selectedFile.filename : "Active File"}</span>
                    </button>
                  </div>
                )}
              </div>

              {synthesizedCode ? (
                <div className="relative rounded-lg bg-black/60 border border-white/5 p-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                  <pre className="font-mono text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {synthesizedCode}
                  </pre>
                </div>
              ) : (
                <div className="h-[250px] bg-black/20 border border-dashed border-white/5 rounded-lg flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Sparkles className="h-8 w-8 text-slate-650 mb-2 animate-pulse" />
                  <p className="font-mono text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                    Console Waiting for Evaluation
                  </p>
                  <p className="text-[11px] mt-1 text-slate-600 font-sans leading-relaxed max-w-xs">
                    Select one of our presets or prompt any custom utility to synthesize compilation helpers.
                  </p>
                </div>
              )}
            </div>

            {/* Target active code-pane injection info segment */}
            <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-start gap-2.5 text-[10px] text-slate-450 leading-relaxed mt-4 font-sans">
              <ShieldAlert className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold text-purple-400 uppercase tracking-wide block mb-0.5">
                  Workspace Injector Pipeline:
                </span>
                {selectedFile ? (
                  <>
                    Clicking <strong className="text-purple-300">"Inject"</strong> will append this custom FOSS code snippet straight into the head imports section of your active open file: <strong className="text-indigo-400 font-mono text-[11.5px]">{selectedFile.path}</strong>.
                  </>
                ) : (
                  <>
                    No active target selected! Open one of your files (such as <strong className="font-mono text-slate-400">src/App.tsx</strong>) from the workspace explorer code tree grid first, then fire the code injector pipeline.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
