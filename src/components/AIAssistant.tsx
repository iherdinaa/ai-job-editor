import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, JobData, JobType } from "../types";
import { Send, Sparkles, RotateCcw, Clock, RefreshCw } from "lucide-react";

interface AIAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  onUndo: (id: string) => void;
  isTyping: boolean;
  jobData: JobData;
}

export const STEP_2_JOB_TYPES: Array<{ id: JobType; label: string; icon: string; fullLabel: string }> = [
  { id: "internship", label: "Internship", icon: "🎓", fullLabel: "Internship" },
  { id: "parttime", label: "Part-time", icon: "⏱️", fullLabel: "Part-time" },
  { id: "freelance", label: "Freelance", icon: "💻", fullLabel: "Freelance" },
  { id: "highpay", label: "High Pay (> RM8,000)", icon: "💰", fullLabel: "High Pay (> RM8,000)" },
  { id: "volunteer", label: "Volunteer", icon: "🤝", fullLabel: "Volunteer" },
  { id: "singapore", label: "Singapore Job (SGD)", icon: "🇸🇬", fullLabel: "Singapore Job (SGD)" }
];

export const SALARY_PRESETS_BY_JOB_TYPE: Record<string, string[]> = {
  internship: [
    "RM 800 - RM 1,200 / month",
    "RM 1,000 - RM 1,800 / month",
    "RM 1,500 - RM 2,500 / month",
    "Unpaid / Allowance"
  ],
  parttime: [
    "RM 12 - RM 20 / hour",
    "RM 15 - RM 30 / hour",
    "RM 1,200 - RM 2,000 / month"
  ],
  freelance: [
    "RM 1,500 - RM 3,500 / month",
    "RM 2,500 - RM 5,000 / month",
    "Project based"
  ],
  highpay: [
    "RM 8,500 - RM 12,000 / month",
    "RM 10,000 - RM 15,000 / month",
    "RM 15,000 - RM 25,000 / month"
  ],
  volunteer: [
    "Unpaid / Certificate provided",
    "Transport & meal allowance"
  ],
  singapore: [
    "SGD 2,500 - SGD 4,000 / month",
    "SGD 3,500 - SGD 5,500 / month",
    "SGD 5,000 - SGD 8,000 / month"
  ]
};

// Helper to format Markdown-style bold (**text**) and italics (*text*) into React elements
function renderFormattedMessage(content: string) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Parse bold **text** and italic *(text)* inside the line
        const parts: React.ReactNode[] = [];
        // Regex matches **bold**, *(italic)*, or plain text
        const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }
          const token = match[0];
          if (token.startsWith('**') && token.endsWith('**')) {
            const boldText = token.slice(2, -2);
            parts.push(
              <strong key={match.index} className="font-bold text-[#0E1F28]">
                {boldText}
              </strong>
            );
          } else if (token.startsWith('*') && token.endsWith('*')) {
            const italicText = token.slice(1, -1);
            parts.push(
              <span key={match.index} className="italic text-slate-500 font-medium">
                {italicText}
              </span>
            );
          }
          lastIndex = match.index + token.length;
        }

        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }

        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        
        return (
          <div key={lineIdx} className={isBullet ? "pl-2 leading-relaxed" : "leading-relaxed"}>
            {parts}
          </div>
        );
      })}
    </div>
  );
}

export default function AIAssistant({ messages, onSendMessage, onUndo, isTyping, jobData }: AIAssistantProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleSelectJobType = (label: string) => {
    onSendMessage(`Job Type: ${label}`);
  };

  const handleSelectSalary = (salaryText: string) => {
    onSendMessage(`Salary: ${salaryText}`);
  };

  const hasBasic = Boolean(jobData.title.trim() && jobData.company.trim());
  const hasSalary = Boolean(jobData.salaryMin && jobData.salaryMin !== "0");
  const currentSalaryPresets = SALARY_PRESETS_BY_JOB_TYPE[jobData.jobType] || SALARY_PRESETS_BY_JOB_TYPE.internship;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Clean Header */}
      <div className="flex-none px-5 py-4 border-b border-[#E8ECF0] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF4E0] text-[#F9A121] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0E1F28]">
              AI Job Assistant
            </h2>
            <p className="text-xs text-[#556570]">Creating & refining your job posting</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSendMessage("Restart: Let's create a new job ad.")}
          className="text-xs font-semibold text-[#556570] hover:text-[#0E1F28] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Start fresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          New Ad
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAFBFD]">
        {messages.map((msg, index) => {
          const isLatestAIMsg = msg.role === 'ai' && index === messages.length - 1;
          const isUser = msg.role === 'user';
          const contentLower = msg.content.toLowerCase();

          // Conversational Next Step Detection for Interactive Buttons
          const isAskingJobType = isLatestAIMsg && !isTyping && contentLower.includes("job type");
          const isAskingSalary = isLatestAIMsg && !isTyping && contentLower.includes("salary") && !isAskingJobType;
          const isJobComplete = isLatestAIMsg && !isTyping && hasBasic && !isAskingJobType && !isAskingSalary;

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-xs ${
                  isUser 
                    ? 'bg-[#F9A121] text-white rounded-br-sm font-medium' 
                    : 'bg-white text-[#0E1F28] border border-[#E8ECF0] rounded-bl-sm'
                }`}
              >
                {isUser ? msg.content : renderFormattedMessage(msg.content)}
              </div>
              
              {/* Undo action pill */}
              {msg.role === 'ai' && msg.changes && Object.keys(msg.changes).length > 0 && (
                <div className="mt-1.5 ml-1 max-w-[88%]">
                  <div className="bg-white border border-[#E8ECF0] rounded-xl px-3 py-1.5 shadow-xs flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#556570] flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      Updated: <strong className="text-slate-800">{Object.keys(msg.changes).join(', ')}</strong>
                    </span>
                    <button 
                      onClick={() => onUndo(msg.id)}
                      className="text-xs font-bold text-[#E02B23] hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Undo
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Interactive Clickable Choices for Job Type */}
              {isAskingJobType && (
                <div className="mt-3 ml-1 max-w-[96%]">
                  <p className="text-[11px] font-bold text-[#556570] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span>👉</span> Select Job Type (Click to choose):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STEP_2_JOB_TYPES.map((typeOption) => (
                      <button
                        key={typeOption.id}
                        type="button"
                        onClick={() => handleSelectJobType(typeOption.label)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-full hover:border-[#F9A121] hover:text-amber-950 hover:bg-amber-50 shadow-xs hover:shadow transition-all cursor-pointer"
                      >
                        <span className="text-sm">{typeOption.icon}</span>
                        <span>{typeOption.fullLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Interactive Presets tailored to chosen Job Type + custom typing */}
              {isAskingSalary && (
                <div className="mt-3 ml-1 max-w-[96%]">
                  <p className="text-[11px] font-bold text-[#556570] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span>💰</span> Select Salary Preset (or type custom in chat):
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentSalaryPresets.map((salText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSalary(salText)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-full hover:border-[#F9A121] hover:text-amber-950 hover:bg-amber-50 shadow-xs hover:shadow transition-all cursor-pointer"
                      >
                        <span>💵</span>
                        <span>{salText}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Refinement suggestion chips when job ad is generated */}
              {isJobComplete && (
                <div className="mt-3 ml-1 max-w-[96%]">
                  <p className="text-[11px] font-bold text-[#556570] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A121]" /> Suggested Improvements:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSendMessage("Change better Requirement")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-full hover:bg-[#F9A121] hover:text-white hover:border-[#F9A121] transition-all shadow-xs cursor-pointer"
                    >
                      ✨ Change better Requirement
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendMessage("Better Responsibility")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-full hover:bg-[#F9A121] hover:text-white hover:border-[#F9A121] transition-all shadow-xs cursor-pointer"
                    >
                      📋 Better Responsibility
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendMessage("Suggest skills")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:border-[#F9A121] hover:text-[#F9A121] hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      💡 Suggest skills
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendMessage("Make it more attractive")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:border-[#F9A121] hover:text-[#F9A121] hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      🚀 Make more attractive
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-white text-[#0E1F28] border border-[#E8ECF0] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 shadow-xs">
              <div className="w-2 h-2 bg-[#F9A121] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#F9A121] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#F9A121] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="text-xs text-slate-500 font-medium ml-1">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Standard Chat Input Box */}
      <div className="flex-none p-4 bg-white border-t border-[#E8ECF0]">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your reply or ask to change anything..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F9A121]/30 focus:border-[#F9A121] text-[#0E1F28] text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-[#0E1F28] text-white flex items-center justify-center hover:bg-black transition-colors disabled:opacity-40 disabled:hover:bg-[#0E1F28] flex-shrink-0 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
