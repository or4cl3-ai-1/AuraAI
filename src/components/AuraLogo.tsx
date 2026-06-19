import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AuraLogoIcon({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizeClasses = {
    sm: "h-8 w-14",
    md: "h-12 w-24",
    lg: "h-20 w-40",
    xl: "h-32 w-64",
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Glow Backdrops */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full pointer-events-none animate-pulse" style={{ animationDelay: "1s" }}></div>

      <svg
        viewBox="0 0 240 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
      >
        <defs>
          <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="swooshGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="60%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cyan Code Bracket: < */}
        <path
          d="M 50,35 L 25,60 L 50,85"
          stroke="url(#cyanGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowEffect)"
        />

        {/* Purple Code Bracket: > */}
        <path
          d="M 190,35 L 215,60 L 190,85"
          stroke="url(#purpleGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowEffect)"
        />

        {/* Constellation Network A Icon (Core Structure) */}
        {/* Main lines of the A letter */}
        <line x1="120" y1="25" x2="80" y2="95" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="120" y1="25" x2="160" y2="95" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="90" y1="75" x2="150" y2="75" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

        {/* Glowing Network Nodes Linked Nodes */}
        {/* Left leg nodes */}
        <line x1="120" y1="25" x2="100" y2="55" stroke="url(#cyanGlow)" strokeWidth="2" filter="url(#glowEffect)" />
        <line x1="100" y1="55" x2="85" y2="80" stroke="url(#cyanGlow)" strokeWidth="1.5" />
        <line x1="85" y1="80" x2="70" y2="95" stroke="url(#cyanGlow)" strokeWidth="2" filter="url(#glowEffect)" />

        {/* Right leg nodes */}
        <line x1="120" y1="25" x2="140" y2="55" stroke="url(#purpleGlow)" strokeWidth="2" filter="url(#glowEffect)" />
        <line x1="140" y1="55" x2="155" y2="80" stroke="url(#purpleGlow)" strokeWidth="1.5" />
        <line x1="155" y1="80" x2="170" y2="95" stroke="url(#purpleGlow)" strokeWidth="2" filter="url(#glowEffect)" />

        {/* Horizontal bar connection nodes */}
        <line x1="100" y1="55" x2="140" y2="55" stroke="url(#swooshGrad)" strokeWidth="1.5" />
        <line x1="85" y1="80" x2="155" y2="80" stroke="#475569" strokeWidth="1" />

        {/* Intersecting support network coordinates */}
        <line x1="100" y1="55" x2="85" y2="80" stroke="url(#cyanGlow)" strokeWidth="1" opacity="0.6" />
        <line x1="140" y1="55" x2="155" y2="80" stroke="url(#purpleGlow)" strokeWidth="1" opacity="0.6" />
        <line x1="120" y1="25" x2="120" y2="45" stroke="url(#cyanGlow)" strokeWidth="1" opacity="0.4" />

        {/* Circle Vertices with cyan/purple gradient fill */}
        <circle cx="120" cy="25" r="5.5" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" filter="url(#glowEffect)" />
        <circle cx="100" cy="55" r="4.5" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
        <circle cx="140" cy="55" r="4.5" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
        <circle cx="85" cy="80" r="4.5" fill="#0f172a" stroke="#0891b2" strokeWidth="1.5" />
        <circle cx="155" cy="80" r="4.5" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
        <circle cx="70" cy="95" r="6" fill="#0f172a" stroke="#22d3ee" strokeWidth="2.5" filter="url(#glowEffect)" />
        <circle cx="170" cy="95" r="6" fill="#0f172a" stroke="#c084fc" strokeWidth="2.5" filter="url(#glowEffect)" />

        {/* Swooping dynamic neon light warp path (Rocket trail curving from bottom-left up right) */}
        <path
          d="M 68,90 C 85,85 110,65 140,43 C 158,29 175,18 195,15"
          stroke="url(#swooshGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glowEffect)"
        />

        {/* Additional accent swoosh sparkles */}
        <circle cx="195" cy="15" r="1.5" fill="#f472b6" filter="url(#glowEffect)" />
      </svg>
    </div>
  );
}

export default function AuraLogoFull({ size = "md", iconOnly = false, className = "" }: LogoProps) {
  const fontSizes = {
    sm: { title: "text-lg", subtitle: "text-[7px]", gap: "gap-2" },
    md: { title: "text-2xl", subtitle: "text-[10px]", gap: "gap-4" },
    lg: { title: "text-4xl", subtitle: "text-[13px]", gap: "gap-6" },
    xl: { title: "text-6xl", subtitle: "text-[16px]", gap: "gap-8" },
  };

  if (iconOnly) {
    return <AuraLogoIcon size={size} className={className} />;
  }

  return (
    <div className={`flex items-center ${size === "xl" ? "flex-col" : "flex-row"} ${fontSizes[size].gap} ${className}`}>
      {/* core graphic logo */}
      <AuraLogoIcon size={size} className="shrink-0" />

      {/* typographic text components */}
      <div className={`flex flex-col ${size === "xl" ? "items-center text-center mt-2" : "items-start text-left"}`}>
        <div className="flex items-baseline font-display font-black tracking-tight leading-none">
          <span className="text-slate-300 font-extrabold">Aura</span>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent font-black ml-0.5">
            AI
          </span>
        </div>
        <div className={`font-mono text-slate-500 font-bold uppercase tracking-[0.18em] ${fontSizes[size].subtitle} mt-1.5`}>
          AI-Powered Natural Language Coding
        </div>
      </div>
    </div>
  );
}
