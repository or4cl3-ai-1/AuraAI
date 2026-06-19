import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Code2, PlayCircle, Loader2, RefreshCw, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";
import { GeneratedProject, ProjectFile } from "../types";

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
  isEditing?: boolean;
  affectedFile?: string;
  buildStatus?: "success" | "error" | "pending";
}

interface ChatAgentProps {
  project: GeneratedProject | null;
  selectedFile: ProjectFile | null;
  onUpdateProject: (updated: GeneratedProject, actionDescription: string) => void;
  onTelemetryLog: (type: "info" | "success" | "warn" | "error" | "terminal", message: string) => void;
}

const QUICK_PROMPTS = [
  { label: "Add hydration goal control in WorkoutMetrics.tsx", text: "Please add an interactive input or setter button to adjust the Hydration Target in src/components/WorkoutMetrics.tsx" },
  { label: "Implement profile badge inside App.tsx", text: "Create an elegant user profile rank badge based on streaks inside src/App.tsx head bar." },
  { label: "Inject mock cardiac risk warning widget", text: "Add an extra warning alert block under WorkoutMetrics.tsx if cardiac heart rate exceeds 150 BPM." }
];

export default function ChatAgent({ project, selectedFile, onUpdateProject, onTelemetryLog }: ChatAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "agent",
      text: "Greetings! I am the Aura Autonomous Engineering Agent. I can edit and write code in response to our chat. Let me know what changes or components you would like to introduce!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend = inputText) => {
    if (!textToSend.trim() || !project) return;

    // 1. Add user message
    const userMsgId = Math.random().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);
    setInputText("");

    onTelemetryLog("terminal", `>> Agent Chat Trigger: "${textToSend.slice(0, 45)}..."`);
    onTelemetryLog("info", "Autonomous AI is indexing repository files to find structural targets...");

    const filePaths = project.files.map(f => f.path);

    try {
      // Send chat request to server
      const response = await fetch("/api/chat-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project,
          message: textToSend,
          filePaths
        })
      });

      if (!response.ok) {
        throw new Error("Autonomous Agent pipeline returned error status.");
      }

      const data = await response.json();
      
      // Update local project files if code changes were compiled
      if (data.updatedProject) {
        onUpdateProject(data.updatedProject, `AI Autonomous Edit: "${textToSend.slice(0, 40)}"`);
        onTelemetryLog("success", `AI Autonomous Edit completed! Files modified successfully.`);
        
        const changeLogMsg: Message = {
          id: Math.random().toString(),
          sender: "agent",
          text: data.reply || "I have analyzed and successfully refactored the workspace code files to align with your instructions! Check out the updated files and dynamic simulator components.",
          timestamp: new Date().toLocaleTimeString(),
          isEditing: true,
          affectedFile: data.targetFile || "src/App.tsx",
          buildStatus: "success"
        };
        setMessages((prev) => [...prev, changeLogMsg]);
      } else {
        // Simple conversational reply
        const standardMsg: Message = {
          id: Math.random().toString(),
          sender: "agent",
          text: data.reply || "I have scanned the instructions but could not pinpoint secure modification indices. Provide explicit instructions like 'Add a Reset button in WorkoutMetrics.tsx'!",
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages((prev) => [...prev, standardMsg]);
      }

    } catch (error: any) {
      console.error(error);
      onTelemetryLog("error", `Agent compilation aborted: ${error.message}`);
      
      // Simulated interactive local backup edit when server is simulation-only or errors occur
      let mockReply = "I have simulated your request inside the workspace! ";
      let targetFileEdited = "src/App.tsx";
      let matchedPath = "";

      // Match target file based on text
      if (textToSend.toLowerCase().includes("workout") || textToSend.toLowerCase().includes("metrics")) {
        targetFileEdited = "src/components/WorkoutMetrics.tsx";
      }

      const fileToEdit = project.files.find(f => f.path === targetFileEdited) || project.files[0];
      if (fileToEdit) {
        matchedPath = fileToEdit.path;
        // Inject a simple comment representation and mock update to files
        const revisedFiles = project.files.map(f => {
          if (f.path === fileToEdit.path) {
            const injectedComment = `// Autonomous Agent update: Added interactive dynamic hooks matching instruction: "${textToSend}"\n`;
            // Also append simulated visual elements or handlers depending on prompt if possible
            let content = f.content;
            if (textToSend.toLowerCase().includes("streak") && f.path === "src/App.tsx") {
              content = content.replace("setStreak(14)", "setStreak(45) /* AI auto-boost streak */");
              mockReply += "I've increased the athlete streak parameter state variable from 14 to 45 Days inside src/App.tsx directly.";
            } else if (textToSend.toLowerCase().includes("reset") && f.path === "src/components/WorkoutMetrics.tsx") {
              content = content.replace(
                "Cardio Output Scale",
                "Cardio Output Scale (Refreshed via Agent)"
              );
              mockReply += "I've updated the Cardio metrics panel header title inside WorkoutMetrics.tsx to reflect live agent tracking.";
            } else {
              content = injectedComment + content;
              mockReply += `I've successfully injected a new autonomous telemetry compiler comment to trace: "${textToSend}" into ${fileToEdit.filename}.`;
            }

            return { ...f, content };
          }
          return f;
        });

        const nextProject = { ...project, files: revisedFiles };
        onUpdateProject(nextProject, `Simulated Autonomous Update: ${textToSend.slice(0, 30)}`);
        
        const fallbackMsg: Message = {
          id: Math.random().toString(),
          sender: "agent",
          text: `${mockReply}\n\n(Notice: Currently running under highly realistic offline compiler simulation. Configure your GEMINI_API_KEY secret to authorize fully autonomous real-time generation.)`,
          timestamp: new Date().toLocaleTimeString(),
          isEditing: true,
          affectedFile: matchedPath,
          buildStatus: "success"
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#050505]/80 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col min-h-[550px]">
      
      {/* Absolute top glowing layer */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Header telemetry section */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 flex-wrap gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-indigo-400" />
          <h2 className="font-display font-extrabold text-[#f5f5f7] tracking-tight text-base flex items-center gap-2">
            Aura Autonomous Agent Co-Pilot
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-450 animate-ping"></span>
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 uppercase tracking-widest font-extrabold flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          MULTl-AGENT THREAD ACTIVE
        </span>
      </div>

      <p className="text-white/40 text-sm leading-relaxed max-w-2xl mb-4">
        Type code instructions naturally below. Our background engineering agent will intelligently parse your commands, identify corresponding target files, rewrite blocks to respect types, and automatically compile them to update the workspace hot sandbox.
      </p>

      {/* Main Grid: Messages on left/top, suggestions on right/bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 items-stretch min-h-[300px]">
        
        {/* Chat message threads column */}
        <div className="lg:col-span-3 bg-black/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between h-[380px]">
          
          {/* Scrollable messages screen */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin scrollbar-thumb-white/5 pb-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Sender Icon */}
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  msg.sender === "user" 
                    ? "bg-[#0c0c14] border-indigo-500/30 text-indigo-400" 
                    : "bg-[#110c14] border-purple-500/30 text-purple-400"
                }`}>
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble details */}
                <div className="space-y-1">
                  <div className={`rounded-xl px-4 py-2.5 text-[12.5px] leading-relaxed shadow-sm font-sans ${
                    msg.sender === "user"
                      ? "bg-indigo-600/15 border border-indigo-500/25 text-slate-200"
                      : "bg-[#0b0c10]/95 border border-white/5 text-slate-200"
                  }`}>
                    {msg.text}

                    {/* Integrated file-changed notices */}
                    {msg.isEditing && (
                      <div className="mt-3 p-2 bg-purple-500/5 border border-purple-500/10 rounded-lg flex flex-col gap-1.5 text-[10.5px] font-mono leading-normal select-none">
                        <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase text-[9px] tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>SANDBOX RE-COMPILE MERGED</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Target Segment:</span>{" "}
                          <strong className="text-white text-[11px]">{msg.affectedFile}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="block text-[9.5px] text-slate-600 font-mono text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="h-7 w-7 rounded-lg bg-[#110c14] border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="rounded-xl px-4 py-2.5 bg-[#0b0c10]/95 border border-white/5 text-slate-400 text-xs italic flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                  <span>Synthesizer compilation pipeline is active. Rebuilding workspace tree ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input field row */}
          <div className="border-t border-white/5 pt-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { // Support enter key submissions
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              placeholder="e.g. Add an interactive Reset button with state triggers inside WorkoutMetrics.tsx..."
              className="flex-1 bg-black/50 border border-white/10 focus:border-indigo-500/30 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600 font-sans"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-40 font-bold transition-all text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:cursor-not-allowed border border-indigo-600/10 shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </div>

        </div>

        {/* Autonomous quick prompts helpers sidebar */}
        <div className="bg-[#0b0b0f] border border-white/5 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase font-mono font-extrabold text-indigo-400 tracking-wider">
              Quick Agent Goals
            </h3>
            <p className="text-slate-500 text-[11px] font-sans leading-relaxed">
              Click any of our specialized pre-compiled agents tasks to automatically test workspace edits:
            </p>
            
            <div className="space-y-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.text)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg bg-black/40 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-[11.5px] text-slate-300 hover:text-white cursor-pointer group flex flex-col gap-1 disabled:opacity-50 disabled:cursor-not-allowed font-medium font-sans"
                >
                  <span className="text-indigo-400 text-[10px] font-mono uppercase tracking-wide group-hover:text-indigo-300 flex items-center gap-1">
                    <Code2 className="h-3 w-3" /> Preset {idx + 1}
                  </span>
                  <span className="line-clamp-2 leading-relaxed text-slate-400 group-hover:text-slate-200">{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 font-sans text-[10px] leading-relaxed text-slate-500 flex gap-2">
            <ShieldAlert className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold block text-indigo-400 uppercase text-[9px] mb-0.5">Live Environment notice:</span>
              Our agent relies on active file schemas to compile edits safely. Ensure files are fully saved inside your workspace version stream to maintain accuracy.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
