import React, { useState } from "react";
import { HardDrive, Search, Trash2, Plus, CornerDownRight, CheckCircle, ShieldAlert, Cpu } from "lucide-react";
import { GeneratedProject, ProjectFile } from "../types";

interface DependenciesHubProps {
  project: GeneratedProject;
  onUpdateFiles: (updatedFiles: ProjectFile[], actionDescription: string) => void;
  onTelemetryLog: (type: "info" | "success" | "warn" | "error" | "terminal", message: string) => void;
}

// Popular libraries that make sense for standard developer UI workspaces
const POPULAR_PACKAGES = [
  { name: "lodash", version: "^4.17.21", desc: "A modern JavaScript utility library delivering modularity, performance & extras.", category: "Utilities" },
  { name: "axios", version: "^1.7.9", desc: "Promise based HTTP client for the browser and node.js.", category: "Network" },
  { name: "framer-motion", version: "^11.18.0", desc: "A production-ready motion library for React web applications.", category: "Animation" },
  { name: "zod", version: "^3.24.1", desc: "TypeScript-first schema validation with static type inference.", category: "Validation" },
  { name: "date-fns", version: "^4.1.0", desc: "Modern JavaScript date utility library, elegant and modular.", category: "Utilities" },
  { name: "canvas-confetti", version: "^1.9.3", desc: "Performant full-canvas particle confetti explosion animations.", category: "Visual Effects" },
  { name: "recharts", version: "^2.15.0", desc: "Redefined chart library built with React and D3.", category: "Visualization" },
  { name: "d3", version: "^7.9.0", desc: "Bring data to life using SVG, Canvas and HTML.", category: "Visualization" }
];

export default function DependenciesHub({
  project,
  onUpdateFiles,
  onTelemetryLog
}: DependenciesHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [customPackageName, setCustomPackageName] = useState("");
  const [customVersion, setCustomVersion] = useState("^1.0.0");
  const [installingPackage, setInstallingPackage] = useState<string | null>(null);

  // Parse package.json dependencies
  const packageFile = project.files.find((f) => f.path === "package.json");

  const getDependenciesMap = (): Record<string, string> => {
    if (!packageFile) return {};
    try {
      const parsed = JSON.parse(packageFile.content);
      return parsed.dependencies || {};
    } catch (e) {
      console.error("Error parsing virtual package.json:", e);
      return {};
    }
  };

  const dependencies = getDependenciesMap();

  // Install a package
  const handleInstallPackage = (name: string, version: string) => {
    if (dependencies[name]) {
      onTelemetryLog("warn", `Dependency "${name}" is already present in package.json.`);
      return;
    }

    setInstallingPackage(name);
    onTelemetryLog("terminal", `>> npm install ${name}@${version} --save`);
    onTelemetryLog("info", `Resolving dependencies of "${name}" from npm registry...`);

    setTimeout(() => {
      // Modify target package.json
      let currentJson: any = {
        name: project.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        version: "1.0.0",
        dependencies: {}
      };

      if (packageFile) {
        try {
          currentJson = JSON.parse(packageFile.content);
        } catch (e) {
          // Re-initialize if corrupted
        }
      }

      if (!currentJson.dependencies) {
        currentJson.dependencies = {};
      }

      currentJson.dependencies[name] = version;
      const updatedJsonString = JSON.stringify(currentJson, null, 2);

      let updatedFiles = [...project.files];
      const pkgIndex = updatedFiles.findIndex((f) => f.path === "package.json");

      if (pkgIndex >= 0) {
        updatedFiles[pkgIndex] = {
          ...updatedFiles[pkgIndex],
          content: updatedJsonString
        };
      } else {
        updatedFiles.push({
          path: "package.json",
          filename: "package.json",
          language: "json",
          content: updatedJsonString
        });
      }

      // If techStack doesn't have it, append it
      if (!project.architecture.techStack.includes(name)) {
        project.architecture.techStack.push(name);
      }

      setInstallingPackage(null);
      setCustomPackageName("");
      setCustomVersion("^1.0.0");

      onUpdateFiles(updatedFiles, `Installed package: ${name}@${version}`);
      onTelemetryLog("success", `Package "${name}@${version}" successfully added directly inside code node trees!`);
    }, 1200);
  };

  // Uninstall a package
  const handleUninstallPackage = (name: string) => {
    onTelemetryLog("terminal", `>> npm uninstall ${name}`);
    onTelemetryLog("info", `Removing package reference of "${name}"...`);

    setTimeout(() => {
      if (!packageFile) return;

      let currentJson: any = {};
      try {
        currentJson = JSON.parse(packageFile.content);
      } catch (e) {
        return;
      }

      if (currentJson.dependencies && currentJson.dependencies[name]) {
        delete currentJson.dependencies[name];
      }

      const updatedJsonString = JSON.stringify(currentJson, null, 2);

      const updatedFiles = project.files.map((file) => {
        if (file.path === "package.json") {
          return { ...file, content: updatedJsonString };
        }
        return file;
      });

      // Also clean up technical stack labels if relevant
      const revisedTechStack = project.architecture.techStack.filter(t => t.toLowerCase() !== name.toLowerCase());
      project.architecture.techStack = revisedTechStack;

      onUpdateFiles(updatedFiles, `Uninstalled package: ${name}`);
      onTelemetryLog("success", `Removed package "${name}" successfully from package.json.`);
    }, 800);
  };

  const cleanDependenciesList = Object.entries(dependencies);
  const filteredPopular = POPULAR_PACKAGES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-slate-100 font-mono text-xs">
      {/* Left side: Installed Dependencies visualizer */}
      <div className="xl:col-span-5 bg-[#050505]/95 border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
            <HardDrive className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Installed Packages Explorer
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-4">
            Below is the list of active npm libraries fetched directly from the virtual <span className="font-mono text-indigo-300">package.json</span> root manifest node. Under interactive runtime sandbox compilation, these libraries are hot-compiled.
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {cleanDependenciesList.length === 0 ? (
              <div className="p-6 border border-dashed border-white/10 rounded-xl text-center text-slate-600">
                <ShieldAlert className="h-6 w-6 text-slate-800 mx-auto mb-1.5" />
                <span>No package dependencies mapped in package.json.</span>
              </div>
            ) : (
              cleanDependenciesList.map(([name, ver]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#050505]/60 hover:bg-[#050505] border border-white/5 transition-all"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{name}</span>
                      <span className="text-[9px] text-slate-500 font-normal">({ver})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      <span>Ready & Bundled</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUninstallPackage(name)}
                    className="p-1.5 rounded-lg bg-[#050505] hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                    title={`Uninstall ${name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Custom install manual trigger */}
        <div className="pt-4 mt-6 border-t border-white/10">
          <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 font-mono">
            Direct Manifest Hook:
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. lodash-es"
              value={customPackageName}
              onChange={(e) => setCustomPackageName(e.target.value)}
              className="flex-1 min-w-0 bg-[#050505] border border-white/10 hover:border-white/15 focus:border-indigo-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-650"
            />
            <input
              type="text"
              placeholder="^1.0.0"
              value={customVersion}
              onChange={(e) => setCustomVersion(e.target.value)}
              className="w-20 bg-[#050505] border border-white/10 hover:border-white/15 focus:border-indigo-500/40 rounded-lg px-2 py-1.5 text-xs text-slate-200 text-center outline-none transition-all"
            />
            <button
              onClick={() => handleInstallPackage(customPackageName.trim(), customVersion)}
              disabled={!customPackageName.trim() || !!installingPackage}
              className="px-3 py-1.5 bg-[#050505] text-indigo-400 font-bold border border-indigo-500/20 hover:border-indigo-500/45 hover:bg-indigo-500/5 transition-all text-xs rounded-lg cursor-pointer disabled:opacity-40 flex items-center gap-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Hook</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right side: NPM Registry explorer */}
      <div className="xl:col-span-7 bg-[#050505]/95 border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none"></div>
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Aura Package Registry Catalog
              </h3>
            </div>
            <div className="relative w-40">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050505]/60 border border-white/10 hover:border-white/20 focus:border-purple-500/40 rounded-lg pl-8 pr-3 py-1.5 text-[10px] text-slate-200 placeholder-slate-650 focus:outline-none transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
            {filteredPopular.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-600">
                No matching packages in registry. Fill in details manually on the left.
              </div>
            ) : (
              filteredPopular.map((pkg) => {
                const isInstalled = !!dependencies[pkg.name];
                return (
                  <div
                    key={pkg.name}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 text-left transition-all ${
                      isInstalled
                        ? "bg-indigo-500/5 border-indigo-500/10"
                        : "bg-[#050505]/60 hover:bg-[#050505] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-200 text-sm leading-none">{pkg.name}</span>
                          <span className="text-[9px] text-slate-500 font-normal font-mono">{pkg.version}</span>
                        </div>
                        <span className="text-[8px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {pkg.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                        {pkg.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleInstallPackage(pkg.name, pkg.version)}
                      disabled={isInstalled || installingPackage === pkg.name}
                      className={`w-full py-1.5 text-[11px] font-bold font-sans rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isInstalled
                          ? "bg-slate-850 border border-white/5 text-slate-500 cursor-not-allowed"
                          : "bg-[#050505] border border-purple-500/20 text-purple-400 hover:bg-purple-500/5 hover:border-purple-500/40"
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Installed</span>
                        </>
                      ) : installingPackage === pkg.name ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Install Package</span>
                        </>
                      )}
                    </button>
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
