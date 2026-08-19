import { JobData } from "../types";
import { 
  MapPin, 
  Briefcase, 
  Share2, 
  Heart, 
  MoreVertical, 
  DollarSign, 
  Users,
  Eye,
  Edit3,
  Sparkles,
  Lock
} from "lucide-react";

interface JobPreviewProps {
  jobData: JobData;
  isEditMode?: boolean;
  onToggleEdit?: () => void;
  onPost?: () => void;
  hideToggle?: boolean;
}

export const COMPANY_DEFAULT_LOGO = "https://files.ajobthing.com/brightan-assets/images/company-logo/company_default_5.png";

// Company Logo Avatar component
export function CompanyAvatar({ size = "w-12 h-12" }: { size?: string }) {
  return (
    <div className={`${size} rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0`}>
      <img 
        src={COMPANY_DEFAULT_LOGO} 
        alt="Company Logo" 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// 2nd Image: Job Card Preview (Shown on Success Screen)
export function JobCardPreview({ jobData }: { jobData: JobData }) {
  const formattedSalary = jobData.salaryMin && jobData.salaryMin !== "0"
    ? `${jobData.salaryCurrency || 'RM'} ${Number(jobData.salaryMin).toLocaleString()} - ${jobData.salaryCurrency || 'RM'} ${Number(jobData.salaryMax || jobData.salaryMin).toLocaleString()} Per ${jobData.salaryPeriod === 'hourly' ? 'Hour' : 'Month'}`
    : "Salary Negotiable";

  const typeDisplay = jobData.jobType === 'internship' ? 'Internship'
    : jobData.jobType === 'parttime' ? 'Part-time'
    : jobData.jobType === 'freelance' ? 'Freelance'
    : jobData.jobType === 'volunteer' ? 'Volunteer'
    : jobData.jobType === 'singapore' ? 'Singapore Job (SGD)'
    : jobData.jobType === 'highpay' ? 'High Pay (> RM8,000)'
    : 'Internship';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 relative hover:shadow-md transition-shadow">
      {/* Top row: Avatar, Title, Company, Heart */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <CompanyAvatar size="w-11 h-11" />
          <div>
            <h3 className="text-base font-bold text-[#0E1F28] leading-snug">
              {jobData.title || "Job Title"}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mt-0.5">
              <span>{jobData.company || "Company Name"}</span>
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#1877F2] text-white rounded-full text-[9px] font-bold">
                ✓
              </span>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          aria-label="Save Job"
          title="Available once job is posted"
          className="text-slate-300 hover:text-slate-400 transition-colors p-1 cursor-not-allowed"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Salary row */}
      <div className="mt-2.5 flex items-center gap-1 text-[#E02B23] font-bold text-sm">
        <DollarSign className="w-4 h-4 text-[#E02B23] stroke-[2.5]" />
        <span>{formattedSalary}</span>
      </div>

      {/* Job Type row */}
      <div className="mt-1.5 flex items-center gap-2 text-slate-700 font-semibold text-xs">
        <Briefcase className="w-3.5 h-3.5 text-slate-600 stroke-[2]" />
        <span>{typeDisplay}</span>
      </div>

      {/* Location row */}
      <div className="mt-1.5 flex items-start gap-2 text-slate-600 text-xs leading-relaxed">
        <MapPin className="w-3.5 h-3.5 text-slate-600 stroke-[2] shrink-0 mt-0.5" />
        <span>{jobData.location || "KLCC, Bandar Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, 50450, Malaysia"}</span>
      </div>

      {/* Highlights / Requirements bullet preview */}
      {jobData.requirements && jobData.requirements.length > 0 && (
        <ul className="mt-2.5 space-y-1 text-xs text-slate-600 pl-5 list-disc marker:text-slate-400">
          {jobData.requirements.slice(0, 2).map((req, i) => (
            <li key={i} className="leading-snug">{req}</li>
          ))}
        </ul>
      )}

      {/* Skill tags */}
      {jobData.skills && jobData.skills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {jobData.skills.slice(0, 3).map((skill, i) => (
            <span 
              key={i} 
              className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-semibold shadow-2xs"
            >
              {skill}
            </span>
          ))}
          {jobData.skills.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-full text-xs font-bold">
              +{jobData.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom Footer: Timestamp & Apply Now button */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] italic text-slate-400">
          Posted just now
        </span>
        <button
          type="button"
          className="bg-[#E02B23] hover:bg-[#c9241d] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

// 3rd Image: Full Job Details Preview (Used for Live Preview in Editor)
export function JobDetailsPreview({ 
  jobData,
  onPost,
  onToggleEdit,
  showCTA = true
}: { 
  jobData: JobData;
  onPost?: () => void;
  onToggleEdit?: () => void;
  showCTA?: boolean;
}) {
  const formattedSalary = jobData.salaryMin && jobData.salaryMin !== "0"
    ? `${jobData.salaryCurrency || 'RM'} ${Number(jobData.salaryMin).toLocaleString()} - ${jobData.salaryCurrency || 'RM'} ${Number(jobData.salaryMax || jobData.salaryMin).toLocaleString()} Per ${jobData.salaryPeriod === 'hourly' ? 'Hour' : 'Month'}`
    : "Salary Negotiable";

  const typeDisplay = jobData.jobType === 'internship' ? 'Internship'
    : jobData.jobType === 'parttime' ? 'Part-time'
    : jobData.jobType === 'freelance' ? 'Freelance'
    : jobData.jobType === 'volunteer' ? 'Volunteer'
    : jobData.jobType === 'singapore' ? 'Singapore Job (SGD)'
    : jobData.jobType === 'highpay' ? 'High Pay (> RM8,000)'
    : 'Internship';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header with avatar & locked candidate actions */}
      <div className="flex items-start justify-between">
        <CompanyAvatar size="w-14 h-14" />
        <div className="flex items-center gap-3 text-slate-400">
          <span 
            title="Available once the job is posted" 
            className="text-xs sm:text-sm font-semibold text-slate-400 opacity-60 cursor-not-allowed flex items-center gap-1"
          >
            Ask Employer
          </span>
          <button 
            type="button" 
            aria-label="Share" 
            title="Available once the job is posted"
            className="text-slate-300 opacity-60 cursor-not-allowed p-1"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            aria-label="Save" 
            title="Available once the job is posted"
            className="text-slate-300 opacity-60 cursor-not-allowed p-1"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            aria-label="More" 
            title="Available once the job is posted"
            className="text-slate-300 opacity-60 cursor-not-allowed p-1"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Company */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0E1F28] leading-tight">
          {jobData.title || "Job Title"}
        </h1>
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mt-1">
          <span>{jobData.company || "Company Name"}</span>
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#1877F2] text-white rounded-full text-[9px] font-bold">
            ✓
          </span>
        </div>
        <div className="mt-2.5">
          <button 
            type="button" 
            title="Available once the job is posted"
            className="px-3.5 py-1 text-xs font-semibold text-slate-400 border border-slate-200 rounded-md bg-slate-50 opacity-60 cursor-not-allowed"
          >
            Follow
          </button>
        </div>
      </div>

      {/* Meta Specs (Salary, Job Type, Location) */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-[#E02B23] font-bold">
          <DollarSign className="w-4 h-4 text-[#E02B23] stroke-[2.5]" />
          <span>{formattedSalary}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs sm:text-sm">
          <Briefcase className="w-4 h-4 text-slate-600 stroke-[2]" />
          <span>{typeDisplay}</span>
        </div>
        <div className="flex items-start gap-2 text-slate-600 text-xs sm:text-sm">
          <MapPin className="w-4 h-4 text-slate-600 stroke-[2] shrink-0 mt-0.5" />
          <span>{jobData.location || "KLCC, Bandar Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, 50450, Malaysia"}</span>
        </div>
      </div>

      {/* Timestamp & Locked Apply Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-400 italic">
          Posted just now • Closing in 30 days
        </span>
        <button
          type="button"
          title="Available once the job is posted"
          className="bg-slate-200 text-slate-500 text-sm font-bold px-8 py-2.5 rounded-xl shadow-none cursor-not-allowed opacity-75 self-start sm:self-auto flex items-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          Apply
        </button>
      </div>

      {/* Early applicant banner */}
      <div 
        title="Available once the job is posted"
        className="py-2.5 px-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-500"
      >
        <div className="flex items-center gap-2 font-semibold">
          <Users className="w-4 h-4 text-slate-400" />
          <span>Be an early applicant!</span>
        </div>
        <span className="text-[11px] text-slate-400 italic font-medium">Candidate feature unlocks on post</span>
      </div>

      <hr className="border-slate-100" />

      {/* Job Description Sections */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[#0E1F28]">
          Job Description
        </h2>

        {/* Requirements */}
        {jobData.requirements && jobData.requirements.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 marker:text-slate-400">
              {jobData.requirements.map((req, i) => (
                <li key={i} className="leading-relaxed">{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Responsibilities */}
        {jobData.responsibilities && jobData.responsibilities.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 marker:text-slate-400">
              {jobData.responsibilities.map((resp, i) => (
                <li key={i} className="leading-relaxed">{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {jobData.benefits && jobData.benefits.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 marker:text-slate-400">
              {jobData.benefits.map((ben, i) => (
                <li key={i} className="leading-relaxed">{ben}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {jobData.skills && jobData.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {jobData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-semibold shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Below Skills: Call-To-Action to Post this job or Edit by themselves (only when showCTA is true) */}
        {showCTA && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/90 rounded-2xl p-5 sm:p-6 text-center shadow-xs">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#0E1F28] mb-1">
                Finished reviewing your job ad?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto leading-relaxed">
                If everything looks good, post your job now to start reaching thousands of qualified applicants on <strong>Maukerja</strong> and <strong>Ricebowl</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {onPost && (
                  <button
                    type="button"
                    onClick={onPost}
                    className="w-full sm:w-auto px-7 py-3 bg-[#F9A121] hover:bg-[#EE9410] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Post This Job Now
                  </button>
                )}
                {onToggleEdit && (
                  <button
                    type="button"
                    onClick={onToggleEdit}
                    className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" />
                    Edit by Myself
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function JobPreview({ jobData, isEditMode, onToggleEdit, onPost, hideToggle }: JobPreviewProps) {
  return (
    <div className="h-full flex flex-col bg-[#F4F6F8]">
      {/* Top Header with Edit / Preview Switcher */}
      <div className="flex-none px-6 py-3.5 flex justify-between items-center bg-white border-b border-[#E8ECF0] sticky top-0 z-10 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-[#0E1F28]">Live Preview</h2>
          <p className="text-xs text-[#556570]">This is how jobseekers view your job ad</p>
        </div>

        {!hideToggle && onToggleEdit && (
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                if (isEditMode) onToggleEdit();
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isEditMode
                  ? 'bg-white text-[#0E1F28] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isEditMode) onToggleEdit();
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-white text-[#0E1F28] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              Edit Form
            </button>
          </div>
        )}
      </div>

      {/* Main Preview Scroll Area - Always Full Details */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <JobDetailsPreview 
          jobData={jobData} 
          onPost={onPost}
          onToggleEdit={onToggleEdit}
        />
      </div>
    </div>
  );
}
