import React, { useEffect, useRef } from "react";
import { Terminal, ShieldClose, Trash2, LayoutGrid, CheckCircle } from "lucide-react";
import { TelemetryLog } from "../types";

interface TerminalLogsProps {
  logs: TelemetryLog[];
  onClearLogs: () => void;
}

export default function TerminalLogs({ logs, onClearLogs }: TerminalLogsProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll down when new telemetry lines append
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden font-mono text-xs flex flex-col justify-between">
      {/* Title bar controller */}
      <div className="px-4 py-3 bg-[#050505]/45 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
            Real-time Compilation Telemetry Logs
          </span>
          <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono tracking-tight hidden sm:inline">
            Active CLI: bash-3.2_aistudio
          </span>

          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-400 bg-[#050505] border border-white/10 hover:border-red-500/20 px-2 py-0.5 rounded transition-all cursor-pointer"
            title="Clear all telemetry cache logs"
          >
            <Trash2 className="h-3 w-3" />
            <span>Nuke Logs</span>
          </button>
        </div>
      </div>

      {/* Terminal Board Content output height */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[220px] bg-[#050505]/80 min-h-[140px] space-y-2 leading-relaxed text-slate-400 font-mono scrollbar-thin scrollbar-thumb-white/5">
        {logs.map((log) => {
          let typeColor = "text-slate-400";
          let prefix = "[SYSTEM]";

          if (log.type === "success") {
            typeColor = "text-emerald-400";
            prefix = "[SUCCESS]";
          } else if (log.type === "warn") {
            typeColor = "text-amber-500";
            prefix = "[WARNING]";
          } else if (log.type === "error") {
            typeColor = "text-red-500 font-bold";
            prefix = "[CRITICAL]";
          } else if (log.type === "terminal") {
            typeColor = "text-indigo-400 font-bold";
            prefix = "[TERMINAL]";
          } else if (log.type === "info") {
            typeColor = "text-slate-200";
            prefix = "[COMPILER]";
          }

          return (
            <div key={log.id} className="text-[11px] flex gap-2">
              <span className="text-slate-600 shrink-0 select-none">
                {log.timestamp}
              </span>
              <span className={`${typeColor} shrink-0 select-none`}>
                {prefix}
              </span>
              <span className="text-slate-300 whitespace-pre-wrap">{log.message}</span>
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Compiler Footer telemetry information */}
      <div className="px-4 py-2.5 bg-[#050505]/10 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5 font-sans">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          <span>Ingress validation: <span className="font-mono text-slate-400 font-bold">Passed</span></span>
        </div>

        <div className="flex items-center gap-3">
          <span>Buffer: <span className="text-slate-400 font-bold">15MB</span></span>
          <span>Latency: <span className="text-slate-400 font-bold">14ms</span></span>
          <span className="hidden sm:inline">Active Thread: <span className="text-purple-400 font-bold font-mono">Main Compiler Core 01</span></span>
        </div>
      </div>
    </div>
  );
}
