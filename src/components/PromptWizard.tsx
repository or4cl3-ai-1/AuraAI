import React, { useState } from "react";
import { Sparkles, Settings, ArrowRight, BookOpen, Layers, Monitor, Sliders, HardDrive, Cpu } from "lucide-react";

interface PromptWizardProps {
  onGenerate: (prompt: string, model: string, depth: string) => void;
  isGenerating: boolean;
}

const PRESET_IDEAS = [
  {
    title: "Enterprise CRM & Deal Analytics",
    description: "Multi-tiered pipeline dashboard with conversion chart projections, lead status modifications, and sales quotas.",
    prompt: "A sophisticated sales and business CRM platform called Vertex with pipeline visualization, target quota tracking, and customer contact management.",
    badge: "CRM & Sales",
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Docker Sandbox & Runtime Terminal",
    description: "Virtual container compiler simulation showcasing file AST diagnostics, sandbox state machines, and real-time terminal output.",
    prompt: "An interactive code playground console called Aether IDE supporting mock esbuild compilation pipeline logs, test cases, and file editor dashboards.",
    badge: "IDE & Utilities",
    color: "from-purple-500 to-indigo-400"
  },
  {
    title: "Live Fitness Hub & Goals Monitor",
    description: "Dynamic heart rate trackers, training history tables, hydration forms, and personalized athletic scheduling matrices.",
    prompt: "An elegant athletic tracker called Ascent Hub featuring workout goals form submissions, weekly cardiac activity graphs, and streak records.",
    badge: "Health Tech",
    color: "from-emerald-500 to-cyan-400"
  }
];

export default function PromptWizard({ onGenerate, isGenerating }: PromptWizardProps) {
  const [inputText, setInputText] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash");
  const [selectedDepth, setSelectedDepth] = useState("Enterprise Microservices");
  const [selectedLayout, setSelectedLayout] = useState("Glassmorphic Dark Mode");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onGenerate(inputText, selectedModel, selectedDepth);
  };

  const selectPreset = (presetPrompt: string) => {
    setInputText(presetPrompt);
  };

  return (
    <div className="bg-[#050505]/80 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Dynamic ambient gradient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <h2 className="font-display font-bold text-slate-100 tracking-tight text-base">
            Configure App Creation Parameters
          </h2>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
            showAdvanced
              ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
              : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
          }`}
        >
          <Settings className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          <span>Advanced Compiler Config</span>
        </button>
      </div>

      <p className="text-white/40 text-sm mb-6 max-w-2xl leading-relaxed">
        Describe your application requirements in standard natural language. Aura's compilation cluster will automatically design the relational database schema, structure the file node modules hierarchy, generate functional TypeScript code, and assemble an interactive testing player.
      </p>

      {/* Preset cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {PRESET_IDEAS.map((item, index) => (
          <button
            key={index}
            onClick={() => selectPreset(item.prompt)}
            className="group text-left p-4 rounded-xl bg-[#050505]/40 hover:bg-[#050505]/90 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/5 border border-indigo-500/10">
                  {item.badge}
                </span>
                <span className="text-slate-600 group-hover:text-indigo-400 transition-colors text-[10px] font-mono">
                  Preset 0{index + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-200 text-sm mb-1 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-400 transition-colors">
                {item.description}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-4 text-[11px] font-mono font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
              <span>Load Template</span>
              <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your application description here (e.g., 'An analytics CRM with functional sales charts, new lead forms, and status toggles...')"
            rows={3}
            className="w-full bg-[#050505]/60 border border-white/10 hover:border-white/15 focus:border-indigo-500/50 rounded-xl p-4 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/35 transition-all outline-none font-sans leading-relaxed resize-none"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => setInputText("")}
              className="absolute right-3 bottom-3 text-xs text-slate-500 hover:text-slate-300 font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Expandable Advanced Options */}
        {showAdvanced && (
          <div className="p-4 rounded-xl bg-[#050505]/50 border border-white/10 space-y-4 font-mono animate-fadeIn">
            <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <Sliders className="h-3.5 w-3.5" />
              Compiler Core Overrides
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-purple-400" />
                  Cognitive LLM Engine:
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-slate-200 outline-none focus:border-indigo-500/30 font-medium"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Failsafe Auto)</option>
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Architectures)</option>
                  <option value="gemma-4-coder-preview">Gemma 4 Coder (Experimental FOSS)</option>
                  <option value="gemma-2-27b-it">Gemma 2 27B Coder (Flagship FOSS)</option>
                  <option value="codegemma-7b-it">CodeGemma 7B (Dedicated FOSS)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Assigns compiler synthesis weight factor.
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                  <Layers className="h-3 w-3 text-emerald-400" />
                  Structural Architecture:
                </label>
                <select
                  value={selectedDepth}
                  onChange={(e) => setSelectedDepth(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-slate-200 outline-none focus:border-indigo-500/30 font-medium"
                >
                  <option value="Modular Monolith with local state">Modular Frontend (Standard)</option>
                  <option value="Enterprise Microservices & Cloud Schemas">Enterprise Microservices (Verbose)</option>
                  <option value="Serverless Cloud Functions Stack">Cloud-Native Serverless Router</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Tailors file generation directory depth.
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                  <Monitor className="h-3 w-3 text-indigo-400" />
                  Styling Layout Presets:
                </label>
                <select
                  value={selectedLayout}
                  onChange={(e) => setSelectedLayout(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-slate-200 outline-none focus:border-indigo-500/30 font-medium"
                >
                  <option value="Glassmorphic Dark Mode">Glassmorphic Dark Mode</option>
                  <option value="High-Contrast Mono Minimalist">High-Contrast Mono Minimalist</option>
                  <option value="Neon Cyberpunk Brutalist">Neon Cyberpunk Brutalist</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Alters UI mockup color and layout properties.
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isGenerating || !inputText.trim()}
            className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-bold font-sans tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/35 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 group overflow-hidden cursor-pointer"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Assembling Architecture...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Compile Software Workspace</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
