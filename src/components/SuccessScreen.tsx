import { useState, useEffect } from "react";
import { JobData } from "../types";
import { 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Eye,
  FileText
} from "lucide-react";
import confetti from "canvas-confetti";
import { JobCardPreview, JobDetailsPreview } from "./JobPreview";

interface SuccessScreenProps {
  jobData: JobData;
  submissionId?: string;
  onReset: () => void;
  onEditAgain?: () => void;
}

export default function SuccessScreen({ 
  jobData, 
  submissionId = `AJT-${Date.now().toString(36).toUpperCase()}`, 
  onReset
}: SuccessScreenProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'details'>('card');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Confetti burst on load
    const end = Date.now() + 800;
    const colors = ['#F9A121', '#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const handleCopySummary = () => {
    const text = `🎉 JOB POSTING SUMMARY\n` +
      `----------------------------------------\n` +
      `📌 Job Title: ${jobData.title}\n` +
      `🏢 Company: ${jobData.company}\n` +
      `📍 Location: ${jobData.location}\n` +
      `💼 Job Type: ${jobData.jobType.toUpperCase()}\n` +
      `💰 Salary: ${jobData.salaryCurrency || 'RM'} ${jobData.salaryMin} - ${jobData.salaryMax} / ${jobData.salaryPeriod}\n` +
      `🔑 Key Skills: ${jobData.skills.join(', ')}\n` +
      `----------------------------------------\n` +
      `Reference ID: ${submissionId}\n` +
      `Live status: Ready in account within 15 minutes.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] p-3 sm:p-5 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden my-auto">
        
        {/* Compact & Clean Top Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-[#F9A121] to-amber-600 px-5 py-4 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="inline-flex items-center justify-center w-7 h-7 bg-white/20 rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              🎉 Job Ad Submitted Successfully!
            </h1>
          </div>
          <p className="text-amber-100 text-xs font-medium">
            Your job ad will be ready in your account within <strong className="text-white underline decoration-white/60 underline-offset-2">15 minutes</strong> (Ref: <span className="font-mono text-white">{submissionId}</span>)
          </p>
        </div>

        {/* Compact Status Progress Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold bg-amber-100/70 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>1. Sending to Maukerja & Ricebowl (~5 mins)</span>
            </div>
            <span className="hidden sm:inline text-slate-300">→</span>
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-full border border-slate-200">
              <Check className="w-3.5 h-3.5 text-slate-400" />
              <span>2. Ready to Manage Applicants (~5 mins)</span>
            </div>
          </div>
        </div>

        {/* Main Body: Preview & Controls */}
        <div className="p-4 sm:p-5 bg-[#FAFBFD]">
          
          {/* Header Row for Tab switcher and Copy button */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Preview:</span>
              <div className="bg-white p-0.5 rounded-lg flex border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'card' 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Job Card
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'details' 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  Full Details
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
          </div>

          {/* Job Preview Display (Job Card default) */}
          <div className="max-h-[340px] overflow-y-auto rounded-xl">
            {activeTab === 'card' ? (
              <JobCardPreview jobData={jobData} />
            ) : (
              <JobDetailsPreview jobData={jobData} showCTA={false} />
            )}
          </div>

          {/* Publishing Channels Strip */}
          <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-center gap-4 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Distributing To:
            </span>
            <div className="flex items-center gap-1.5">
              <img src="https://play-lh.googleusercontent.com/7rf_1MBBxNpDJjFljfBUkxOAxADMCj-cAiE9Td1HOYstdsf1vJCKrRIgyuZLlCUgleptjnDdu_mS0kd-DbAPvg" alt="Maukerja" className="h-5 w-5 rounded-md object-contain" />
              <span className="font-bold text-slate-800">Maukerja</span>
            </div>
            <div className="flex items-center gap-1.5">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyto1zSaqTi_kCiicvvF2J_Nsw_WI9o4is2kjyApDidg&s=10" alt="Ricebowl" className="h-5 w-5 rounded-md object-contain" />
              <span className="font-bold text-slate-800">Ricebowl</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 mt-3.5 pt-3.5 border-t border-slate-200">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ← Post Another Job
            </button>

            <a
              href="https://www.ajobthing.com/job-manager?statuses=published&page=1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#F9A121] hover:bg-[#EE9410] text-white font-bold rounded-xl shadow-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              Login to Account to View Job Ad <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
