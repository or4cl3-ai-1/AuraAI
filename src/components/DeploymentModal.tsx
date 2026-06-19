import React, { useState, useEffect } from "react";
import { X, Globe, Cpu, Loader2, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, Terminal, Smartphone, Monitor } from "lucide-react";
import { GeneratedProject } from "../types";
import SandboxViewer from "./SandboxViewer";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GeneratedProject | null;
  onTelemetryLog: (type: "info" | "success" | "warn" | "error" | "terminal", message: string) => void;
}

const DEPLOY_STEPS = [
  { t: "Analyzing workspace code structures & project configuration index...", d: 600 },
  { t: "Executing 'npm run build' inside isolation docker target container...", d: 1300 },
  { t: "Stripping type definitions & compiling Express backend server scripts...", d: 900 },
  { t: "Optimizing Tailwind CSS assets & caching static script segments...", d: 800 },
  { t: "Spawning on-demand Cloud Run cluster node with 100% capacity...", d: 1200 },
  { t: "Exposing secure service endpoint in public load-balancer gateway...", d: 700 }
];

export default function DeploymentModal({ isOpen, onClose, project, onTelemetryLog }: DeploymentModalProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setCurrentStepIdx(0);
    setCompleted(false);
    setProgress(0);
    setLogs(["[SYSTEM] Firing up autonomous production deployment cluster..."]);

    onTelemetryLog("terminal", ">> npm run build && deploy-container --target=prod");
    onTelemetryLog("info", "Deploying user-created production code assets to Aura public cloud mesh...");

    let stepIdx = 0;
    const runStep = () => {
      if (stepIdx >= DEPLOY_STEPS.length) {
        setTimeout(() => {
          setCompleted(true);
          setProgress(100);
          onTelemetryLog("success", `Container deployed live! Production ingress active.`);
          const timestamp = new Date().toLocaleTimeString();
          setLogs((prev) => [...prev, `[${timestamp}] SUCCESS - Deployment complete! Active subdomain mapped successfully.`]);
        }, 500);
        return;
      }

      const step = DEPLOY_STEPS[stepIdx];
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, `[${timestamp}] INFO - ${step.t}`]);
      setCurrentStepIdx(stepIdx);
      
      // Interpolate progress calculation
      setProgress(Math.floor((stepIdx / DEPLOY_STEPS.length) * 100));

      setTimeout(() => {
        stepIdx++;
        runStep();
      }, step.d);
    };

    runStep();

  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  // Generate dynamic app slug
  const appSlug = project.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const publicUrl = `https://${appSlug}.deployment.aura.live`;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 animate-fadeIn font-sans">
      <div className="w-full max-w-5xl bg-[#06060a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Deployment Progress and Logs Console */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h2 className="font-display font-black text-white text-base tracking-tight uppercase">
                  Aura Mesh Cloud Deployer
                </h2>
              </div>
              <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-mono font-bold tracking-widest ${
                completed ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25" : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
              }`}>
                {completed ? "STATUS: LIVE & ONLINE" : "STATUS: COMPILING CONTEXTS"}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
              We compile and push your customized workspace components straight into native production Cloud Run node environments.
            </p>

            {/* Micro loaders list */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>DOCKER IMAGE COMPRESSED LEVEL</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-[#111115] rounded-full overflow-hidden p-[2px] border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            {!completed && (
              <div className="bg-black/50 p-4 border border-white/5 rounded-xl flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-purple-400 animate-spin shrink-0" />
                <p className="text-xs font-mono text-purple-300">
                  {DEPLOY_STEPS[currentStepIdx]?.t || "Preparing server nodes..."}
                </p>
              </div>
            )}

            {/* Live Terminal outputs */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
                Compilation Log Stream
              </span>
              <div className="bg-black text-slate-300 p-4 rounded-xl border border-white/5 font-mono text-[10.5px] leading-relaxed select-all max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
                {logs.map((log, idx) => (
                  <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-400" : "text-slate-400"}>
                    <span className="text-slate-600 mr-2">❯</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>TLS / SSL SECURED ENDPOINT</span>
            </div>
            {completed && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-neutral-900 border border-white/10 hover:border-white/20 text-xs font-bold text-white rounded-lg cursor-pointer hover:bg-neutral-800 transition-all"
              >
                Close Controller
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Renderized Simulated Public Page Ingress */}
        <div className="flex-1 p-6 md:p-8 bg-[#0b0c10] flex flex-col justify-between max-h-[50vh] md:max-h-full overflow-hidden">
          
          {/* Header layout simulating a browser address bar */}
          <div className="space-y-4 flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono font-extrabold text-indigo-400 flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                PRODUCTION CODES PREVIEWER
              </span>
              <button 
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Address bar chassis */}
            <div className="bg-black/80 rounded-xl p-2.5 border border-white/5 font-mono text-xs text-slate-500 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden truncate">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                </div>
                <span className="text-emerald-400 font-bold ml-1 text-[11px]">https://</span>
                <span className="text-slate-300 text-[11px] truncate select-all">{appSlug}.deployment.aura.live/</span>
              </div>

              {completed && (
                <a 
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/20 hover:bg-indigo-500/30 rounded border border-indigo-500/20 text-indigo-300 text-[10px] transform hover:scale-[1.03] transition-all cursor-pointer select-none"
                >
                  <span>Open URL</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Browser frame viewport simulating live container output */}
            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl min-h-[180px] flex flex-col items-center justify-center relative overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 p-4">
              
              {!completed ? (
                <div className="text-center space-y-3 font-mono text-xs text-slate-500 p-6 select-none animate-pulse">
                  <RefreshCw className="h-8 w-8 text-indigo-400/40 animate-spin mx-auto" />
                  <p className="font-extrabold">SANDBOX SERVER RE-COMPROMISING</p>
                  <p className="text-[10.5px]">Hold on. Launching live virtual rendering core...</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-[10.5px] text-emerald-400 font-mono">
                    <span className="inline-block h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping mr-1"></span>
                    <span>Live preview loaded from remote build cluster.</span>
                  </div>
                  
                  {/* Miniature dashboard representation */}
                  <div className="bg-[#040406] border border-white/10 rounded-xl p-4 space-y-3">
                    <h4 className="font-display font-bold text-white text-xs">{project.appName}</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{project.tagline}</p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px]">
                      {project.sandboxData.views.slice(0, 2).map((view, index) => (
                        <div key={index} className="bg-neutral-900 border border-white/5 p-1.5 rounded-md text-slate-300 truncate">
                          Tab: {view}
                        </div>
                      ))}
                      <div className="col-span-2 bg-[#090f09] border border-emerald-500/20 p-2 rounded-md text-emerald-300 flex items-center justify-between">
                        <span>Production status</span>
                        <strong className="text-emerald-400 uppercase text-[8px] tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">HEALTHY</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
