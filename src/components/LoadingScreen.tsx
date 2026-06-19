import React, { useState, useEffect } from "react";
import { Terminal, Cpu, CloudLightning, ShieldAlert, Sparkles, Server } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOAD_STEPS = [
  { p: 5, t: "Mapping client-side configuration files..." },
  { p: 15, t: "Initializing sandboxed dev server context..." },
  { p: 28, t: "Configuring Vite frontend bundler middleware..." },
  { p: 40, t: "Establishing network bridge on standard interface port 3000..." },
  { p: 56, t: "Allocating 2GB RAM container segment inside browser cache limits..." },
  { p: 70, t: "Seeding project mock files repository schemas..." },
  { p: 85, t: "Bootstrapping Gemma 2 / Gemma 4 open weights parameters..." },
  { p: 95, t: "Performing final AST integrity compilations..." },
  { p: 100, t: "Cluster interface ready. Redirecting safely..." }
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [currentStepText, setCurrentStepText] = useState("Establishing sandbox connection protocol...");
  const [logLines, setLogLines] = useState<string[]>([]);

  useEffect(() => {
    // Dynamic percentage ticker
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const delta = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + delta);
        
        // Find matching step
        const matched = LOAD_STEPS.find(step => next >= step.p - 5 && next <= step.p + 5);
        if (matched) {
          setCurrentStepText(matched.t);
        }
        return next;
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  // Add random terminal log files on interval to look exceptionally detailed and immersive
  useEffect(() => {
    const logInterval = setInterval(() => {
      if (percent >= 100) {
        clearInterval(logInterval);
        return;
      }
      
      const mockLogOpts = [
        `[${new Date().toLocaleTimeString()}] INFO - AST Parser loaded: 24 active nodes audited.`,
        `[${new Date().toLocaleTimeString()}] WARN - Dependencies analyzed: dev-dependency cached successfully.`,
        `[${new Date().toLocaleTimeString()}] SUCCESS - Bound server listener to public host: 0.0.0.0:3000`,
        `[${new Date().toLocaleTimeString()}] DEBUG - Mounted static assets routes from target: /dist`,
        `[${new Date().toLocaleTimeString()}] TRACE - Ingested Gemma 4 weights layer template: codegemma:7b`,
        `[${new Date().toLocaleTimeString()}] INFO - Injected mock database record indices safely.`,
        `[${new Date().toLocaleTimeString()}] SUCCESS - Webpack/Vite index tree parsed without syntax warnings.`
      ];
      
      const randomLine = mockLogOpts[Math.floor(Math.random() * mockLogOpts.length)];
      setLogLines((prev) => [...prev.slice(-6), randomLine]);
    }, 450);

    return () => clearInterval(logInterval);
  }, [percent]);

  useEffect(() => {
    if (percent === 100) {
      const wait = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(wait);
    }
  }, [percent, onComplete]);

  return (
    <div className="min-h-screen bg-[#020204] text-slate-100 flex flex-col items-center justify-center font-mono p-6 relative overflow-hidden">
      {/* Visual glowing overlay nodes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse"></div>
      
      {/* Interactive terminal box container */}
      <div className="w-full max-w-2xl bg-[#07070d]/90 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
        <div className="absolute top-0 right-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        
        {/* Box title bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Server className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 tracking-wider">AURA PROTOTYPING BOOTLOAD VECTOR</span>
          </div>
          <div className="text-[10px] text-slate-500">
            SPEED: <span className="text-emerald-400 font-bold">14 Mbps</span>
          </div>
        </div>

        {/* Visual CPU chip spin indicator */}
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/15 blur-lg rounded-full animate-ping" style={{ animationDuration: "3s" }}></div>
            <div className="h-16 w-16 rounded-full border border-white/10 border-t-purple-400 animate-spin flex items-center justify-center relative bg-neutral-950">
              <Cpu className="h-7 w-7 text-purple-400" />
            </div>
            {/* Spinning percentage label */}
            <span className="absolute bottom-[-10px] right-[-10px] bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] px-1.5 py-0.5 rounded font-extrabold shadow">
              {percent}%
            </span>
          </div>

          <div className="space-y-1.5 pt-3">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
              {percent === 100 ? "COMPILING SENSE DATA COMPLETE" : "STALLING INFRASTRUCTURE SEED NODES"}
            </p>
            <p className="text-[11px] text-purple-300 font-medium max-w-sm">
              {currentStepText}
            </p>
          </div>
        </div>

        {/* Glowing Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>PROG: /dev/sys/core</span>
            <span>{percent}/100</span>
          </div>
          <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-[2px]">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-150 relative"
              style={{ width: `${percent}%` }}
            >
              {/* Highlight shimmer effect */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>

        {/* Visual Live Compilation Ticker Log */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase tracking-widest">
            <Terminal className="h-3 w-3" />
            <span>Telemetry Standard Logs</span>
          </div>
          
          <div className="bg-black/80 rounded-xl p-4 border border-white/5 min-h-[140px] flex flex-col justify-end text-left select-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>
            
            {logLines.length === 0 ? (
              <span className="text-slate-600 text-[10.5px] italic font-normal">Waiting for compilation worker pipelines ...</span>
            ) : (
              <div className="space-y-1 overflow-hidden">
                {logLines.map((line, index) => (
                  <div 
                    key={index} 
                    className={`text-[10.5px] tracking-tight leading-relaxed truncate font-mono ${
                      line.includes("SUCCESS") ? "text-emerald-400" :
                      line.includes("WARN") ? "text-amber-400" :
                      line.includes("DEBUG") ? "text-blue-400" :
                      line.includes("TRACE") ? "text-slate-400" : "text-slate-300"
                    }`}
                  >
                    <span className="text-slate-600 mr-1.5">❯</span>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
