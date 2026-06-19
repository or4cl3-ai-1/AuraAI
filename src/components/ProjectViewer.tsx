import React, { useState } from "react";
import { Folder, FileCode, Check, Copy, ChevronRight, Edit2, Play, CornerDownRight, MessageSquare, Terminal, Eye } from "lucide-react";
import { ProjectFile } from "../types";

interface ProjectViewerProps {
  files: ProjectFile[];
  selectedFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  onRefactorFile: (filePath: string, instruction: string) => void;
  isRefactoring: boolean;
  compilerNotice?: string;
}

export default function ProjectViewer({
  files,
  selectedFile,
  onSelectFile,
  onRefactorFile,
  isRefactoring,
  compilerNotice
}: ProjectViewerProps) {
  const [refactorInput, setRefactorInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refactorInput.trim() || !selectedFile) return;
    onRefactorFile(selectedFile.path, refactorInput);
    setRefactorInput("");
  };

  // Helper to colorize basic TSX keywords for premium rendering in our text block
  const colorizeCode = (code: string) => {
    if (!code) return "";
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Keywords
      .replace(/\b(import|export|default|const|let|var|function|return|interface|type|class|extends|from|as|new|if|else|for|async|await)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
      // Strings
      .replace(/(["'`])(.*?)\1/g, '<span class="text-emerald-300">$&</span>')
      // React components & JSX tags
      .replace(/(&lt;\/?[A-Za-z0-9_]+)/g, '<span class="text-indigo-300 font-medium">$1</span>')
      // Comments
      .replace(/(\/\/.*)/g, '<span class="text-slate-500 italic">$1</span>');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
      {/* File Tree Sidebar */}
      <div className="lg:col-span-1 bg-[#050505]/95 border border-white/10 rounded-2xl p-4 flex flex-col justify-between font-mono">
        <div>
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
            <Folder className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Workspace Files Directories
            </h3>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-bold py-1">
              <ChevronRight className="h-3 w-3 text-slate-500 transform rotate-90" />
              <span>project_root</span>
              <span className="text-[10px] text-slate-600 font-normal ml-1">/</span>
            </div>

            <div className="pl-4 space-y-0.5">
              {files.map((file) => {
                const isSelected = selectedFile?.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => onSelectFile(file)}
                    className={`w-full flex items-center justify-between text-left p-2 rounded-lg text-xs transition-all ${
                      isSelected
                        ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                        : "hover:bg-white/5 text-slate-400 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                      <span className="truncate">{file.filename}</span>
                    </div>

                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {compilerNotice && (
          <div className="mt-8 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-500/80 leading-relaxed font-sans">
            <p className="font-mono font-bold text-amber-400 uppercase tracking-wide mb-1">
              Compiler Notice:
            </p>
            {compilerNotice}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="lg:col-span-3 bg-[#050505]/95 border border-white/10 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Editor Title Bar */}
        <div className="px-4 py-3 bg-[#050505]/60 border-b border-white/10 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5 mr-2">
              <span className="h-3 w-3 rounded-full bg-red-500/40 border border-red-500/20 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500/40 border border-yellow-500/20 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-green-500/40 border border-green-500/20 inline-block"></span>
            </span>

            {selectedFile ? (
              <div className="flex items-center gap-1.5 bg-[#050505] border border-white/10 px-2.5 py-1 rounded-lg">
                <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs font-mono text-slate-300">
                  {selectedFile.path}
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500">No file loaded</span>
            )}
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#050505] border border-white/10 px-2 py-0.5 rounded text-indigo-400">
                {selectedFile.language}
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#050505] hover:bg-neutral-900 border border-white/10 text-[11px] font-mono text-white/50 hover:text-white/80 transition-colors cursor-pointer"
                title="Copy code to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Refactor Chat Overlay/Header */}
        {selectedFile && (
          <div className="px-5 py-3.5 bg-[#050505]/40 border-b border-white/10 font-sans">
            <form onSubmit={handleRefactorSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                  <MessageSquare className="h-4 w-4 text-indigo-400/70" />
                </div>
                <input
                  type="text"
                  value={refactorInput}
                  onChange={(e) => setRefactorInput(e.target.value)}
                  disabled={isRefactoring}
                  placeholder={`Ask AI to change, refactor, or write a new snippet for ${selectedFile.filename} (e.g. 'add a toggle button', 'refactor theme colors')`}
                  className="w-full bg-[#050505]/60 border border-white/10 hover:border-white/15 focus:border-indigo-500/40 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isRefactoring || !refactorInput.trim()}
                className="px-4 py-2 bg-[#050505] hover:bg-neutral-900 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isRefactoring ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Refactor File</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Code Content Window */}
        <div className="flex-1 p-5 overflow-auto max-h-[480px] font-mono text-xs leading-relaxed text-slate-300">
          {selectedFile ? (
            <pre className="whitespace-pre">
              <code
                dangerouslySetInnerHTML={{
                  __html: colorizeCode(selectedFile.content)
                }}
              />
            </pre>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-slate-500 font-sans p-6">
              <Terminal className="h-10 w-10 text-indigo-500/40 mb-3 animate-pulse" />
              <p className="font-display font-medium text-slate-400">Compile a custom code pipeline first</p>
              <p className="text-xs text-slate-600 mt-1 max-w-sm">
                Enter your system prompt above. Aura will process your requirements, establish files, generate codes, and output the structure here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
