import { JobData } from "../types";
import { ArrowRight, Sparkles } from "lucide-react";

interface EmailPreviewProps {
  jobData: JobData;
  onEdit: () => void;
  onPost: () => void;
}

export default function EmailPreview({ jobData, onEdit, onPost }: EmailPreviewProps) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Branded header band — gives the page a clear top-of-page anchor instead of flat white */}
      <div className="bg-gradient-to-br from-[#0E1F28] to-[#16303F] pt-9 pb-24 sm:pb-28 px-4 text-center shrink-0">
        <img
          src="https://files.ajobthing.com/assets/landing/a-job-thing-with-tagline.png"
          alt="AJobThing"
          className="h-8 sm:h-9 w-auto object-contain mx-auto"
        />
        <p className="text-white/50 text-[11px] sm:text-xs font-bold uppercase tracking-widest mt-2.5">
          AI Job Ad Assistant
        </p>
      </div>

      {/* Card overlaps the band seam so it reads as the one thing to focus on */}
      <div className="flex-1 flex justify-center px-4 -mt-16 sm:-mt-20 pb-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-gray-100 h-fit">
        {/* Accent bar makes the card's top edge pop against the header */}
        <div className="h-1.5 bg-gradient-to-r from-[#F9A121] to-[#FFC65C]" />

        {/* Email Content */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4E0] text-[#B9700A] text-[11px] font-bold uppercase tracking-wide mb-4">
              <Sparkles className="w-3 h-3" />
              Draft ready for review
            </span>
            <h2 className="text-2xl font-extrabold text-[#0E1F28] mb-2">Your AI Job Ad Is Ready 🎉</h2>
            <p className="text-[#556570] text-sm md:text-base max-w-md mx-auto leading-relaxed">
              We've created a job ad for you. Review it, make changes with AI, and post it when you're ready.
            </p>
          </div>

          {/* Compact Job Card */}
          <div className="bg-[#F7F9FB] border border-[#E8ECF0] rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src="https://files.ajobthing.com/brightan-assets/images/company-logo/company_default_5.png" 
                  alt="Company Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0E1F28] mb-0.5">
                  {jobData.title || <span className="text-gray-400 italic font-normal">Job Title (Not specified)</span>}
                </h3>
                {jobData.company && (
                  <p className="text-[#556570] font-medium text-xs sm:text-sm">
                    {jobData.company}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#0E1F28] font-medium">
                <span className="text-base">📍</span> {jobData.location}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#0E1F28] font-medium">
                <span className="text-base">💼</span> {jobData.employmentType}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#E02B23] font-bold">
                <span className="text-base">💰</span> RM{jobData.salaryMin} – RM{jobData.salaryMax} / {jobData.salaryPeriod === 'monthly' ? 'Month' : 'Hour'}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-[10px] sm:text-xs font-bold text-[#556570] uppercase tracking-wider mb-1.5">Key Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {jobData.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-white border border-[#E8ECF0] rounded-full text-[10px] sm:text-xs font-semibold text-[#0E1F28]">
                    {skill}
                  </span>
                ))}
                {jobData.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-white border border-[#E8ECF0] rounded-full text-[10px] sm:text-xs font-semibold text-[#556570]">
                    +{jobData.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] sm:text-xs font-bold text-[#556570] uppercase tracking-wider mb-1.5">About the role</h4>
              <p className="text-xs sm:text-sm text-[#556570] line-clamp-2">
                {jobData.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onPost}
              className="w-full px-6 py-3.5 bg-[#F9A121] text-white text-base font-bold rounded-lg hover:bg-[#EE9410] transition-colors shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              Post This Job
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="w-full px-6 py-2 bg-transparent text-[#556570] font-semibold text-sm rounded-lg hover:text-[#0E1F28] transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Edit job ad before posting
            </button>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
}
