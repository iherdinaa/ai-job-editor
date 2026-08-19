import { JobData } from "../types";
import { ArrowRight, Sparkles } from "lucide-react";

interface EmailPreviewProps {
  jobData: JobData;
  onEdit: () => void;
  onPost: () => void;
}

export default function EmailPreview({ jobData, onEdit, onPost }: EmailPreviewProps) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Email Content */}
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <img 
              src="https://files.ajobthing.com/assets/landing/a-job-thing-with-tagline.png" 
              alt="AJobThing" 
              className="h-10 sm:h-12 w-auto object-contain" 
            />
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF4E0] text-[#F9A121] mb-6 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0E1F28] mb-3">Your AI Job Ad Is Ready 🎉</h2>
            <p className="text-[#556570] text-lg max-w-md mx-auto leading-relaxed">
              We've created a job ad for you. Review it, make changes with AI, and post it when you're ready.
            </p>
          </div>

          {/* Compact Job Card */}
          <div className="bg-[#F7F9FB] border border-[#E8ECF0] rounded-xl p-6 mb-10">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src="https://files.ajobthing.com/brightan-assets/images/company-logo/company_default_5.png" 
                  alt="Company Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0E1F28] mb-0.5">
                  {jobData.title || <span className="text-gray-400 italic font-normal">Job Title (Not specified)</span>}
                </h3>
                {jobData.company && (
                  <p className="text-[#556570] font-medium text-sm">
                    {jobData.company}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-[#0E1F28] font-medium">
                <span className="text-lg">📍</span> {jobData.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#0E1F28] font-medium">
                <span className="text-lg">💼</span> {jobData.employmentType}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#E02B23] font-bold">
                <span className="text-lg">💰</span> RM{jobData.salaryMin} – RM{jobData.salaryMax} / {jobData.salaryPeriod === 'monthly' ? 'Month' : 'Hour'}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-bold text-[#556570] uppercase tracking-wider mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {jobData.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white border border-[#E8ECF0] rounded-full text-xs font-semibold text-[#0E1F28]">
                    {skill}
                  </span>
                ))}
                {jobData.skills.length > 4 && (
                  <span className="px-3 py-1 bg-white border border-[#E8ECF0] rounded-full text-xs font-semibold text-[#556570]">
                    +{jobData.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-[#556570] uppercase tracking-wider mb-2">About the role</h4>
              <p className="text-sm text-[#556570] line-clamp-2">
                {jobData.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onEdit}
              className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-[#E8ECF0] text-[#0E1F28] font-bold rounded-lg hover:border-[#F9A121] hover:text-[#F9A121] transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Edit Job Ad
            </button>
            <button 
              onClick={onPost}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#F9A121] text-white font-bold rounded-lg hover:bg-[#EE9410] transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              Post This Job
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mt-6">
             <button onClick={onEdit} className="text-sm font-semibold text-[#556570] hover:text-[#F9A121] underline underline-offset-4">
                View full job ad
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
