import React, { useState } from "react";
import { History, RotateCcw, Calendar, FileCode, Plus, CheckCircle, Clock } from "lucide-react";
import { GeneratedProject, ProjectVersion } from "../types";

interface VersionHistoryProps {
  versions: ProjectVersion[];
  currentProjectId: string | null;
  onRestoreVersion: (version: ProjectVersion) => void;
  onCreateSnapshot: (description: string) => void;
  project: GeneratedProject | null;
}

export default function VersionHistory({
  versions,
  currentProjectId,
  onRestoreVersion,
  onCreateSnapshot,
  project
}: VersionHistoryProps) {
  const [snapshotName, setSnapshotName] = useState("");
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;
    onCreateSnapshot(snapshotName.trim());
    setSnapshotName("");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs text-slate-100">
      {/* Left side: Create manual snapshot form */}
      <div className="xl:col-span-1 bg-[#050505]/95 border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
            <Plus className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Commit Live Snapshot
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-4">
            Create an immutable backup copy of all project files, relational schemas, and compilation parameters. You can restore this exact state at any time if downstream refactors fail.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 font-sans">
              <label className="block text-[10px] font-mono uppercase text-slate-500">
                Snapshot Description:
              </label>
              <textarea
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="e.g., Added Cardiac Chart and finished styling athletic layout..."
                required
                rows={4}
                className="w-full bg-[#050505] border border-white/10 hover:border-white/15 focus:border-indigo-500/40 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none transition-all outline-none leading-relaxed resize-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!project || !snapshotName.trim()}
              className="w-full py-2.5 bg-[#050505] text-indigo-400 font-bold font-sans text-xs border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <History className="h-4 w-4" />
              <span>Commit Snapshot (Simulate Commit)</span>
            </button>
          </form>
        </div>

        <div className="mt-6 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-slate-400 leading-relaxed font-sans">
          <p className="font-mono font-bold text-indigo-400 uppercase tracking-wide mb-1 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            State Engine Alert:
          </p>
          Restoring old code nodes will update both the active simulated sandbox browser and physical workspace code trees instantly.
        </div>
      </div>

      {/* Right side: Snapshot log browser */}
      <div className="xl:col-span-2 bg-[#050505]/95 border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none"></div>
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-purple-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Snapshot Timeline Matrix
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Total Backups: <span className="font-bold text-purple-400">{versions.length}</span>
            </span>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <History className="h-8 w-8 text-slate-700 mb-2 animate-pulse" />
                <p className="text-xs">No version states recorded.</p>
                <p className="text-[10px] text-slate-600 mt-1 max-w-xs font-sans">
                  Whenever you compile your workspace or refit code nodes, automated backups are saved here.
                </p>
              </div>
            ) : (
              versions.map((ver, idx) => {
                const isExpanded = expandedVersionId === ver.id;
                const isFirst = idx === 0; // Most recent is current
                return (
                  <div
                    key={ver.id}
                    className={`border rounded-xl transition-all ${
                      isFirst
                        ? "bg-indigo-500/5 border-indigo-500/20"
                        : "bg-[#050505]/60 hover:bg-[#050505] border-white/10"
                    }`}
                  >
                    <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-slate-300 font-bold break-all leading-tight">
                            {ver.description}
                          </span>
                          {isFirst && (
                            <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                              Active Version
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {ver.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileCode className="h-3 w-3" />
                            {ver.files.length} Modules
                          </span>
                          <span className="text-[10px] text-slate-550 truncate max-w-xs">
                            App: "{ver.appName}"
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedVersionId(isExpanded ? null : ver.id)}
                          className="px-2.5 py-1 text-[10px] hover:text-slate-200 border border-white/10 hover:border-white/20 bg-[#050505] rounded-md transition-colors cursor-pointer"
                        >
                          {isExpanded ? "Hide File Map" : "View File Map"}
                        </button>

                        <button
                          onClick={() => onRestoreVersion(ver)}
                          disabled={isFirst}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                            isFirst
                              ? "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed opacity-50"
                              : "bg-[#050505] border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/40"
                          }`}
                          title={isFirst ? "You are currently running this version" : "Revert all files and schema to this state"}
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Revert</span>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-white/10 pt-3 bg-neutral-950/40 rounded-b-xl space-y-2">
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                          Snapshot Modules File Trees:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                          {ver.files.map((file) => (
                            <div
                              key={file.path}
                              className="flex items-center gap-1.5 p-1.5 bg-[#050505] border border-white/5 rounded-lg text-[11px] text-slate-400"
                            >
                              <FileCode className="h-3.5 w-3.5 text-indigo-400/70" />
                              <span className="truncate" title={file.path}>
                                {file.path}
                              </span>
                              <span className="text-[8px] text-slate-600 font-normal shrink-0 ml-auto mr-1 font-mono">
                                {file.content.length.toLocaleString()} bytes
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
