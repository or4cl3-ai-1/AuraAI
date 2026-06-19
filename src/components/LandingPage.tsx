import React from "react";
import { Sparkles, Terminal, Cpu, ArrowRight, Layers, ShieldCheck, Zap, Code2, PlayCircle, Globe, GitBranch } from "lucide-react";
import AuraLogoFull from "./AuraLogo";

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Decorative futuristic glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: "8s" }}></div>
      <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Futuristic digital grid background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-80 pointer-events-none"
      />

      {/* Header telemetry bar */}
      <header className="border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center bg-black/40 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2.5">
          <AuraLogoFull size="sm" />
        </div>

        <div className="flex items-center gap-6 font-mono text-[10px] text-slate-400">
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM NODE: ACTIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 border border-white/10 px-2.5 py-0.5 rounded-md bg-[#0a0a0d]">
            <span>CORE SPEC:</span>
            <span className="text-purple-400 font-bold">Gemma-4-Coder</span>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 md:py-16 flex flex-col items-center justify-center text-center relative z-10 flex-1 gap-12">
        
        {/* Full Interactive Custom Glowing Branding Logo */}
        <AuraLogoFull size="xl" className="filter drop-shadow-[0_0_35px_rgba(168,85,247,0.25)]" />

        {/* Futuristic Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950 border border-white/10 text-xs text-indigo-300 font-mono tracking-wider shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>FOSS MULTI-AGENT COMPILATION DEPLOYER</span>
        </div>

        {/* Big Displays Display Typography */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-display font-black tracking-tight text-white leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
            The World's Most Polished <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Autonomous AI</span> Code Cluster
          </h1>
          
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            A state-of-the-art interactive workspace where you speak, design, run, and host full-stack React templates directly inside a highly detailed, containerized mock evaluation playground.
          </p>
        </div>

        {/* Visual Call To Action Block */}
        <div className="relative group">
          {/* Pulsing button backdrop glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-250 animate-pulse"></div>
          
          <button
            onClick={onLaunch}
            id="launch-workspace-cta"
            className="relative px-8 py-5 bg-black hover:bg-neutral-900 border border-white/10 hover:border-white/20 rounded-2xl text-white font-display font-extrabold text-base tracking-wide flex items-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>LAUNCH ACTIVE COMPREHENSIVE COMPILER</span>
            <ArrowRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Tech Grid Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left max-w-5xl mt-8">
          
          {/* Card 1 */}
          <div className="bg-[#07070a]/80 border border-white/5 rounded-2xl p-6 relative group hover:border-purple-500/25 transition-all">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <Cpu className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-display font-extrabold text-slate-100 text-sm mb-1.5 uppercase tracking-wide">
              FOSS Open Weights Kernel
            </h3>
            <p className="text-slate-400 text-[12.5px] leading-relaxed">
              Equipped with custom Google Gemma 2 & CodeGemma parameters tuned for rigorous programming syntax, type safety, and fast local compiles.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#07070a]/80 border border-white/5 rounded-2xl p-6 relative group hover:border-indigo-500/25 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Terminal className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="font-display font-extrabold text-slate-100 text-sm mb-1.5 uppercase tracking-wide">
              Conversational Copilot Chat
            </h3>
            <p className="text-slate-400 text-[12.5px] leading-relaxed">
              An autonomous chat agent that understands complex instructions, edits standard files natively, and deploys workspace revisions on the fly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#07070a]/80 border border-white/5 rounded-2xl p-6 relative group hover:border-emerald-500/25 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Layers className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-display font-extrabold text-slate-100 text-sm mb-1.5 uppercase tracking-wide">
              Mock Container Testing
            </h3>
            <p className="text-slate-400 text-[12.5px] leading-relaxed">
              Examine generated viewports, test forms, submit simulated actions, and audit relational schema maps in our high fidelity iframe sandbox.
            </p>
          </div>

        </div>

      </main>

      {/* Panoramic telemetry footer */}
      <footer className="border-t border-white/5 py-5 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center bg-black/60 relative z-10 text-[10px] font-mono text-slate-500 gap-4">
        <div>
          <span>© 2026 GOOGLE AI STUDIO BULLD ● POWERED BY GENIUS EMBEDDED CODES</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>ENCRYPTED SANDBOX COMPLIANT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>COMPILE LATENCY: ~14ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
