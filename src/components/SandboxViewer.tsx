import React, { useState, useEffect } from "react";
import { Monitor, Smartphone, RefreshCw, Layers, CheckCircle2, AlertCircle, Database, HelpCircle, Activity, Play, Send } from "lucide-react";
import { GeneratedProject } from "../types";

interface SandboxViewerProps {
  project: GeneratedProject | null;
  onTelemetryLog: (type: "info" | "success" | "warn" | "error" | "terminal", message: string) => void;
}

export default function SandboxViewer({ project, onTelemetryLog }: SandboxViewerProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<string>("");
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [mockDatabaseRecords, setMockDatabaseRecords] = useState<Array<any>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize view and mock database records based on project loading
  useEffect(() => {
    if (project && project.sandboxData) {
      if (project.sandboxData.views && project.sandboxData.views.length > 0) {
        setActiveTab(project.sandboxData.views[0]);
      }
      
      // Seed initial mock records in sandbox
      const seedRecords = [
        { id: "TX-104", name: "Strategic Asset Ingestion", val: "Approved", owner: "Securities Team", time: "Just now" },
        { id: "TX-105", name: "Core Kernel Optimization", val: "94.3% Perf", owner: "System Agent", time: "3 mins ago" },
        { id: "TX-106", name: "E-Commerce Pipeline Hook", val: "$4,290.00", owner: "Merchant Gateway", time: "1 hr ago" }
      ];
      setMockDatabaseRecords(seedRecords);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 min-h-[450px] flex flex-col items-center justify-center text-center backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-500"></div>
        <Activity className="h-12 w-12 text-slate-800 animate-pulse mb-3" />
        <p className="font-display font-bold text-slate-400 text-lg">Virtual Execution Sandbox</p>
        <p className="text-slate-600 text-xs mt-1.5 max-w-md">
          Assemble a system pipeline above first. Aura's sandbox compiler will parse its properties to build a live device-rendered container representing the finalized app.
        </p>
      </div>
    );
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    onTelemetryLog("info", `Firing Sandbox Hot-Reload Signal for: "${project.appName}"`);
    setTimeout(() => {
      setIsRefreshing(false);
      onTelemetryLog("success", `Hot-Reload Completed. 0 compilation failures.`);
      showToast("Sandbox environment refreshed.");
    }, 1000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormInputs((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent, formName: string) => {
    e.preventDefault();
    onTelemetryLog("info", `Submitting form: "${formName}" under Active Database schema...`);
    
    // Assemble record info
    const recordId = "TX-" + Math.floor(100 + Math.random() * 900);
    const mainField = Object.keys(formInputs)[0] || "Custom Entity";
    const mainVal = formInputs[mainField] || "Unspecified entry";
    
    const newRecord = {
      id: recordId,
      name: mainVal,
      val: Object.values(formInputs)[1] ? `$${Object.values(formInputs)[1]}` : "Active status",
      owner: Object.values(formInputs)[2] || "Root Sandbox User",
      time: "Just now"
    };

    setTimeout(() => {
      setMockDatabaseRecords((prev) => [newRecord, ...prev]);
      onTelemetryLog("success", `Database Record Successfully Saved. Primary key mapped: ${recordId}`);
      showToast(`Saved database row: ${recordId}!`);
      setFormInputs({});
    }, 650);
  };

  const triggerAction = (actionTrigger: string, actionDescription: string) => {
    onTelemetryLog("terminal", `>> COMMAND WORKSPACE: Triggering action "${actionTrigger}"`);
    onTelemetryLog("info", `ACTION EXECUTION: ${actionDescription}`);
    
    setTimeout(() => {
      onTelemetryLog("success", `Action "${actionTrigger}" executed and telemetry logged.`);
      showToast(`Action "${actionTrigger}" triggered successfully!`);
    }, 600);
  };

  // Safe JSON extraction for bar charts list representation
  const getChartData = (dataStr: string) => {
    try {
      const parsed = JSON.parse(dataStr);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // return fallback static items if data isn't JSON array
    }
    return [
      { name: "Segment Alpha", value: 3200 },
      { name: "Segment Beta", value: 4800 },
      { name: "Segment Gamma", value: 1200 }
    ];
  };

  return (
    <div className="flex flex-col gap-4 mx-auto w-full">
      {/* Simulation Dashboard Header controllers */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-[#050505]/95 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
            Aura App Sandbox Frame Model
          </h3>
        </div>

        {/* Device view model toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#050505] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                deviceMode === "desktop" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Set to Desktop Canvas Chassis Mode"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                deviceMode === "mobile" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Set to Mobile Frame Simulator Mode"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-[#050505] hover:bg-neutral-900 border border-white/10 hover:border-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
            title="Reload simulation container"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Chassis Device Wrapper */}
      <div className="relative">
        {toastMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 text-xs font-mono bg-indigo-950/95 text-indigo-300 border border-indigo-500/30 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn whitespace-nowrap">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div
          className={`mx-auto bg-[#050505] border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl relative ${
            deviceMode === "mobile"
              ? "max-w-[360px] h-[640px] border-[12px] border-[#0c0c0c] shadow-indigo-500/5"
              : "w-full min-h-[500px]"
          }`}
        >
          {/* Mock App Banner / Navigation Header */}
          <div className="bg-[#050505] border-b border-white/10 py-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5 leading-none">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 inline-block animate-pulse"></span>
                  {project.appName}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px] mt-0.5">
                  {project.tagline}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#050505] border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-mono text-indigo-400 font-bold shrink-0">
                <Database className="h-3 w-3 text-indigo-400" />
                <span>SimDB: Bound</span>
              </div>
            </div>

            {/* Simulated view tabs */}
            {project.sandboxData.views && project.sandboxData.views.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
                {project.sandboxData.views.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-[10px] font-mono font-bold tracking-tight rounded-md whitespace-nowrap border transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-300"
                        : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sandbox Inner Body Area */}
          <div className="p-5 font-sans space-y-6 overflow-y-auto max-h-[460px] no-scrollbar">
            {/* Custom dynamic summary label */}
            <div className="p-4 rounded-xl bg-[#050505]/40 border border-white/10">
              <span className="text-[9px] font-mono uppercase text-indigo-400 tracking-wider block mb-1">
                Active Environment Status
              </span>
              <p className="text-xs text-slate-350 leading-relaxed">
                You are testing the sandbox mockup screen for <span className="font-bold text-white">"{activeTab}"</span> view. Try interacting with the custom data log sheets, filling inputs, or calling automated test suites.
              </p>
            </div>

            {/* Dynamic Widgets Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.sandboxData.widgets &&
                project.sandboxData.widgets.map((widget, i) => {
                  if (widget.type === "stat") {
                    return (
                      <div
                        key={i}
                        className="bg-[#050505]/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between"
                      >
                        <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                          {widget.title}
                        </h5>
                        <p className="text-slate-200 text-sm font-bold tracking-tight mt-2 leading-snug">
                          {widget.data}
                        </p>
                      </div>
                    );
                  }

                  if (widget.type === "chart") {
                    const chartData = getChartData(widget.data);
                    return (
                      <div
                        key={i}
                        className="bg-[#050505]/60 border border-white/10 rounded-xl p-4 md:col-span-1 space-y-3"
                      >
                        <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                          {widget.title}
                        </h5>

                        <div className="space-y-2 mt-2">
                          {chartData.map((item, idx) => {
                            // Find percentage offset relative to value scale max (mock max is 500k or fallback limit)
                            const maxVal = Math.max(...chartData.map((d) => d.value), 1);
                            const percent = Math.min((item.value / maxVal) * 100, 100);

                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-slate-400">{item.name}</span>
                                  <span className="text-indigo-400 font-bold">
                                    {typeof item.value === "number"
                                      ? item.value.toLocaleString()
                                      : item.value}
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-[#050505] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
            </div>

            {/* Interactive Forms Section */}
            {project.sandboxData.forms && project.sandboxData.forms.length > 0 && (
              <div className="bg-[#050505]/80 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                  <h5 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    {project.sandboxData.forms[0].formName}
                  </h5>
                  <span className="text-[9px] uppercase font-mono font-bold bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">
                    Form Ingest
                  </span>
                </div>

                <form
                  onSubmit={(e) => handleFormSubmit(e, project.sandboxData.forms[0].formName)}
                  className="space-y-3.5"
                >
                  {project.sandboxData.forms[0].fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-slate-500">
                        {field.name.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={field.type}
                        value={formInputs[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholderString}
                        required
                        className="w-full bg-[#050505] border border-white/10 hover:border-white/15 focus:border-indigo-500/40 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none transition-all outline-none"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#050505] text-indigo-400 font-bold font-sans text-xs border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit & Write Record to Mock Database</span>
                  </button>
                </form>
              </div>
            )}

            {/* Dynamic Mock Database Row Inspector */}
            <div className="bg-[#050505]/40 border border-white/10 rounded-xl p-4 font-mono text-xs">
              <h5 className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Direct Data Store Logs</span>
                <span className="text-slate-650 font-normal">Simulated SQLite/Spanner</span>
              </h5>

              <div className="space-y-2 truncate">
                {mockDatabaseRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex justify-between items-center p-2 rounded bg-[#050505] border border-white/10 text-[11px]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-indigo-400 font-bold">{rec.id}</span>
                      <span className="text-slate-300 font-medium truncate">{rec.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-505 text-[10px]">{rec.time}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                        {rec.val}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Triggers Area */}
            {project.sandboxData.sampleActions && project.sandboxData.sampleActions.length > 0 && (
              <div className="space-y-2">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Micro-Service Operational Commands
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {project.sandboxData.sampleActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => triggerAction(action.trigger, action.description)}
                      className="p-2.5 rounded-lg bg-[#050505]/80 hover:bg-[#050505] border border-white/10 hover:border-purple-500/20 text-slate-300 hover:text-white transition-all text-left text-[11px] font-mono group flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
                          {action.trigger}
                        </span>
                        <Play className="h-3 w-3 text-slate-500 group-hover:text-purple-400 transform scale-75 group-hover:scale-100 transition-all" />
                      </div>
                      <span className="block text-[9px] text-slate-550 group-hover:text-slate-400 mt-1">
                        Trigger function call
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
