import React from "react";
import { Cpu, Terminal, Shield, HelpCircle, Flame, Server, Globe } from "lucide-react";
import AuraLogoFull from "./AuraLogo";

interface HeaderProps {
  isCompiling: boolean;
  activePresetName?: string;
  isSimulated: boolean;
  onDeploy?: () => void;
  onViewLanding?: () => void;
}

export default function AuraHeader({ isCompiling, activePresetName, isSimulated, onDeploy, onViewLanding }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl px-6 py-4 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-50">
      <div 
        onClick={onViewLanding} 
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 active:scale-98 transition-all"
        title="Return to visual landing screen"
      >
        <AuraLogoFull size="sm" />
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status pills */}
        <div className="hidden lg:flex items-center gap-3 border-r border-white/10 pr-4">
          <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
            <Server className="h-3.5 w-3.5 text-purple-400" />
            <span>Node Runtime:</span>
            <span className="text-purple-350 font-bold">Cloud-Ready</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>Port:</span>
            <span className="text-indigo-350 font-bold">3000 Ingress</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onViewLanding && (
            <button
              onClick={onViewLanding}
              className="px-3 py-1.5 bg-[#0d0d12] hover:bg-neutral-900 border border-white/10 hover:border-white/20 text-[11px] font-mono font-bold text-slate-300 rounded-lg transition-all cursor-pointer"
              title="Return to visual landing screen"
            >
              System Landing
            </button>
          )}

          {onDeploy && (
            <button
              onClick={onDeploy}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-purple-400 border border-white/10 text-[11.5px] font-mono font-black text-white rounded-lg transition-all shadow-lg shadow-indigo-500/15 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
              title="Deploy compiled container live to production instance"
            >
              <Globe className="h-3.5 w-3.5 animate-pulse" />
              <span>⚡ Deploy Preview</span>
            </button>
          )}

          {isSimulated ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
              <Flame className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
              <span>Simulation Engine Active</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span>Full-Stack AI Connected</span>
            </div>
          )}

          {isCompiling && (
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping inline-block"></span>
          )}
        </div>
      </div>
    </header>
  );
}
