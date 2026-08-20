import React, { useState } from "react";
import { JobData, JobType } from "../types";
import { Sparkles, AlertCircle, X, List, ListOrdered, Undo, Plus, MapPin, Check, Mail, Phone, MessageSquare, Eye, Edit3 } from "lucide-react";

interface ManualEditorProps {
  jobData: JobData;
  onUpdate: (updates: Partial<JobData>) => void;
  validationErrors: string[];
  isEditMode: boolean;
  onToggleEdit: () => void;
  onPost?: () => void;
}

const MALAYSIAN_STATES = [
  "Wilayah Persekutuan Kuala Lumpur",
  "Selangor",
  "Johor",
  "Penang (Pulau Pinang)",
  "Perak",
  "Kedah",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Sabah",
  "Sarawak",
  "Terengganu",
  "Kelantan",
  "Perlis",
  "Wilayah Persekutuan Putrajaya",
  "Wilayah Persekutuan Labuan"
];

const SPECIALIZATIONS = [
  "Accounting / Tax Services",
  "Admin / Clerical",
  "Advertising / Marketing",
  "Agriculture / Poultry / Fisheries",
  "Apparel",
  "Architecture / Interior Design",
  "Arts / Design / Fashion",
  "Automobile / Automotive",
  "Aviation / Airline",
  "Banking / Finance",
  "Beauty / Fitness",
  "BioTech / Pharmaceutical",
  "Business / Mgmt Consulting",
  "Call Center / BPO",
  "Chemical / Fertilizers",
  "Construction / Building",
  "Consumer Products / FMCG",
  "Customer Service / Helpdesk",
  "Education / Training",
  "Electrical & Electronics",
  "Engineering / Technical Consulting",
  "Entertainment / Media",
  "Environment / Health / Safety",
  "Exhibitions / Event Mgmt",
  "Food & Beverage",
  "Gems / Jewellery",
  "General & Wholesale Trading",
  "Government / Defence",
  "Healthcare / Medical",
  "Heavy Industrial / Machinery",
  "Hotel / Hospitality",
  "HR Mgmt / Consulting",
  "Insurance",
  "IT / Hardware",
  "IT / Software",
  "Journalism",
  "Law / Legal",
  "Library / Museum",
  "Manufacturing / Production",
  "Marine / Aquaculture",
  "Mining",
  "Oil / Gas / Petroleum",
  "Other industries",
  "Polymer / Rubber",
  "Printing / Publishing",
  "Property / Real Estate",
  "Purchase / Supply Chain",
  "R&D",
  "Repair / Maintenance",
  "Retail / Merchandise",
  "Sales / Biz Development",
  "Science & Technology",
  "Security / Law Enforcement",
  "Semiconductor",
  "Social Services / NGO",
  "Sports",
  "Stockbroking / Securities",
  "Telecommunication",
  "Textiles / Garment",
  "Tobacco",
  "Transportation / Logistics",
  "Travel / Tourism",
  "Utilities / Power",
  "Wood / Fibre / Paper"
];

const Toggle = ({ checked, onChange, color = "bg-[#F9A121]" }: { checked: boolean, onChange: (v: boolean) => void, color?: string }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${checked ? color : 'bg-gray-300'}`}
  >
    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
  </div>
);

const RichTextToolbar = () => (
  <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50 rounded-t-md">
    <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-500"><Undo className="w-4 h-4" /></button>
    <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transform scale-x-[-1]"><Undo className="w-4 h-4" /></button>
    <div className="w-px h-4 bg-gray-300 mx-1"></div>
    <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold">B</button>
    <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 italic font-serif">I</button>
    <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 underline">U</button>
    <div className="w-px h-4 bg-gray-300 mx-1"></div>
    <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
    <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><ListOrdered className="w-4 h-4" /></button>
  </div>
);

const Tag = ({ text, onRemove }: { text: string, onRemove?: () => void, key?: React.Key }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFF4E0] text-[#B45309] text-xs font-semibold border border-[#FDE68A]">
    {text}
    {onRemove && <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-600" onClick={onRemove} />}
  </span>
);

export default function ManualEditor({ jobData, onUpdate, validationErrors, isEditMode, onToggleEdit, onPost }: ManualEditorProps) {
  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState(jobData.location || "");
  const [selectedState, setSelectedState] = useState("");
  const [activeLangTab, setActiveLangTab] = useState<"en" | "bm" | "zh">("en");
  const [isTranslating, setIsTranslating] = useState(false);

  // Cached translation store
  const [translations, setTranslations] = useState<{
    en: { requirements: string[]; responsibilities: string[]; benefits: string[] };
    bm?: { requirements: string[]; responsibilities: string[]; benefits: string[] };
    zh?: { requirements: string[]; responsibilities: string[]; benefits: string[] };
  }>({
    en: {
      requirements: jobData.requirements,
      responsibilities: jobData.responsibilities,
      benefits: jobData.benefits
    }
  });

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!jobData.skills.includes(newSkill)) {
        onUpdate({ skills: [...jobData.skills, newSkill] });
      }
      setSkillInput("");
    }
  };

  const handleAddSkillDirect = (skill: string) => {
    if (!jobData.skills.includes(skill)) {
      onUpdate({ skills: [...jobData.skills, skill] });
    }
  };

  const handleAddBenefit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && benefitInput.trim()) {
      e.preventDefault();
      const newBenefit = benefitInput.trim();
      if (!jobData.benefits.includes(newBenefit)) {
        onUpdate({ benefits: [...jobData.benefits, newBenefit] });
      }
      setBenefitInput("");
    }
  };

  const handleAddBenefitDirect = (benefit: string) => {
    if (!jobData.benefits.includes(benefit)) {
      onUpdate({ benefits: [...jobData.benefits, benefit] });
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as JobType;
    const updates: Partial<JobData> = { 
      jobType: newType,
      workingHoursType: jobData.workingHoursType || "Fixed hours",
      hoursAmount: jobData.hoursAmount || "20",
      hoursPeriod: jobData.hoursPeriod || "per day"
    };
    
    if (newType === 'parttime') {
      updates.salaryPeriod = 'hourly';
      updates.employmentType = 'Part-time';
    } else if (newType === 'freelance') {
      updates.salaryPeriod = 'hourly';
      updates.employmentType = 'Freelance';
    } else if (newType === 'volunteer') {
      updates.salaryPeriod = 'none';
      updates.employmentType = 'Volunteer';
    } else if (newType === 'internship') {
      updates.salaryPeriod = 'monthly';
      updates.employmentType = 'Internship';
      updates.contractPeriod = jobData.contractPeriod || '3 months';
    } else {
      updates.salaryPeriod = 'monthly';
      updates.employmentType = newType === 'highpay' ? 'High Pay (> RM8,000)' : newType === 'singapore' ? 'Singapore Job (SGD)' : newType;
    }

    if (newType === 'singapore') {
      updates.location = 'Singapore';
    }
    onUpdate(updates);
  };

  const AI_SKILLS = [
    "Social Media Marketing",
    "Content Creation",
    "Market Research",
    "Campaign Management",
    "Communication Skills",
    "Teamwork",
    "Problem Solving",
    "Time Management",
    "Digital Marketing",
    "Brand Awareness",
    "Copywriting",
    "Canva",
    "Search Engine Optimization (SEO)",
    "Customer Relationship Management"
  ];
  
  const AI_REQUIREMENTS = [
    "Currently pursuing or recently completed a Diploma in Marketing, Business, Communications, or a related field.",
    "Strong interest in marketing and advertising.",
    "Excellent written and verbal communication skills.",
    "Proficient in Microsoft Office Suite (Word, Excel, PowerPoint).",
    "Ability to work independently and as part of a team.",
    "Eager to learn and take on new challenges.",
    "Basic understanding of social media platforms is a plus."
  ];

  const AI_RESPONSIBILITIES = [
    "Assist in the development and execution of marketing campaigns.",
    "Conduct market research and competitor analysis.",
    "Support social media management and content creation.",
    "Help organize and coordinate marketing events and activities.",
    "Contribute to the creation of marketing materials and presentations.",
    "Track and report on campaign performance metrics.",
    "Collaborate with the marketing team on various projects."
  ];

  const AI_BENEFITS = [
    "EPF",
    "SOCSO",
    "Annual Leave",
    "Medical Leave",
    "Health Insurance",
    "Medical and Hospitalisation Leave",
    "EIS",
    "Annual Bonus",
    "Medical Insurance",
    "Training Provided",
    "Allowance Provided",
    "Performance Bonus",
    "Flexible Working Hours",
    "Free Snacks / Drinks"
  ];

  const handleAutoGenerateAll = () => {
    onUpdate({
      title: jobData.title || "Marketing Specialist",
      specialization: jobData.specialization || "Advertising / Marketing",
      experience: jobData.experience || "No Experience",
      education: jobData.education || "Certificates / Vocational / Diploma",
      skills: jobData.skills.length ? jobData.skills : AI_SKILLS.slice(0, 5),
      salaryMin: jobData.salaryMin || (jobData.jobType === 'parttime' ? "10" : "800"),
      salaryMax: jobData.salaryMax || (jobData.jobType === 'parttime' ? "25" : "1200"),
      salaryPeriod: jobData.jobType === 'parttime' ? 'hourly' : (jobData.salaryPeriod !== 'none' ? 'monthly' : 'none'),
      requirements: jobData.requirements.length ? jobData.requirements : AI_REQUIREMENTS,
      responsibilities: jobData.responsibilities.length ? jobData.responsibilities : AI_RESPONSIBILITIES,
      benefits: jobData.benefits.length ? jobData.benefits : AI_BENEFITS.slice(0, 5)
    });
  };

  const handleSuggestSkills = () => {
    onUpdate({ skills: [...new Set([...jobData.skills, ...AI_SKILLS.slice(0, 6)])] });
  };

  const handleSuggestSalary = () => {
    if (jobData.jobType === 'parttime') {
      onUpdate({ salaryMin: "10", salaryMax: "25", salaryPeriod: "hourly" });
    } else {
      onUpdate({ salaryMin: "800", salaryMax: "1200", salaryPeriod: "monthly" });
    }
  };

  const handleGenerateDescription = () => {
    onUpdate({ 
      requirements: AI_REQUIREMENTS, 
      responsibilities: AI_RESPONSIBILITIES, 
      benefits: AI_BENEFITS.slice(0, 4) 
    });
  };

  // Translation handler
  const handleTranslateTo = async (targetLang: "en" | "bm" | "zh") => {
    setActiveLangTab(targetLang);

    if (targetLang === "en") {
      if (translations.en) {
        onUpdate({
          requirements: translations.en.requirements,
          responsibilities: translations.en.responsibilities,
          benefits: translations.en.benefits
        });
      }
      return;
    }

    if (translations[targetLang]) {
      onUpdate({
        requirements: translations[targetLang]!.requirements,
        responsibilities: translations[targetLang]!.responsibilities,
        benefits: translations[targetLang]!.benefits
      });
      return;
    }

    setIsTranslating(true);
    try {
      const langName = targetLang === "bm" ? "Bahasa Malaysia" : "Mandarin (Simplified Chinese)";
      const res = await fetch('/api/translate-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirements: jobData.requirements,
          responsibilities: jobData.responsibilities,
          benefits: jobData.benefits,
          targetLang: langName
        })
      });
      const data = await res.json();
      if (data.requirements && data.responsibilities && data.benefits) {
        setTranslations(prev => ({
          ...prev,
          [targetLang]: {
            requirements: data.requirements,
            responsibilities: data.responsibilities,
            benefits: data.benefits
          }
        }));
        onUpdate({
          requirements: data.requirements,
          responsibilities: data.responsibilities,
          benefits: data.benefits
        });
      }
    } catch (err) {
      console.error("Translation error", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveLocation = () => {
    let loc = customLocation.trim();
    if (selectedState && !loc.includes(selectedState)) {
      loc = loc ? `${loc}, ${selectedState}, Malaysia` : `${selectedState}, Malaysia`;
    }
    if (!loc) {
      loc = "Malaysia";
    }
    onUpdate({ location: loc });
    setIsEditingLocation(false);
  };

  const getJobTitlePrefix = () => {
    switch (jobData.jobType) {
      case 'internship': return 'Internship for';
      case 'parttime': return 'Part-time';
      case 'freelance': return 'Freelance';
      case 'volunteer': return 'Volunteer';
      default: return null;
    }
  };

  const jobTitlePrefix = getJobTitlePrefix();

  return (
    <div className="h-full flex flex-col bg-[#F3F4F6] overflow-hidden w-full">
      <div className="flex-none px-6 py-3.5 flex justify-between items-center bg-white border-b border-[#E8ECF0] sticky top-0 z-10 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-[#0E1F28]">Manual Edit Form</h2>
          <p className="text-xs text-[#556570]">Edit full job fields manually</p>
        </div>
        <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200/80">
          <button 
            type="button"
            onClick={() => onToggleEdit()}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-bold transition-all cursor-pointer ${!isEditMode ? 'bg-white text-[#0E1F28] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Eye className="w-5 h-5 text-amber-500" />
            Preview
          </button>
          <button 
            type="button"
            onClick={() => {}}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-bold transition-all cursor-pointer ${isEditMode ? 'bg-white text-[#0E1F28] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Edit3 className="w-5 h-5 text-slate-500" />
            Edit Form
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post a New Job</h1>
        </div>

        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-2">
              <AlertCircle className="w-4 h-4" /> Action Required
            </h4>
            <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
              {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        {/* Card 1: Job Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
              <div className="flex">
                {jobTitlePrefix && (
                  <div className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-600 text-sm flex items-center shrink-0">
                    {jobTitlePrefix}
                  </div>
                )}
                <input 
                  type="text" 
                  value={jobData.title}
                  placeholder="e.g., Marketing Specialist"
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className={`flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500 w-full ${jobTitlePrefix ? 'rounded-r-md' : 'rounded-md'}`}
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization <span className="text-red-500">*</span></label>
              <select 
                value={jobData.specialization}
                onChange={(e) => onUpdate({ specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1.5">Choose specialization based on the Job Position.</p>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employment Type <span className="text-red-500">*</span></label>
              <select 
                value={jobData.jobType}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="internship">Internship</option>
                <option value="parttime">Part-time</option>
                <option value="freelance">Freelance</option>
                <option value="highpay">High Pay (&gt; RM8,000)</option>
                <option value="volunteer">Volunteer</option>
                <option value="singapore">Singapore Job (SGD)</option>
              </select>
            </div>

            {/* Primary Role Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Role Location <span className="text-red-500">*</span></label>
              <select 
                value={jobData.roleLocation || 'On-site'} 
                onChange={(e) => onUpdate({ roleLocation: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Fully Remote / Work From Home">Fully Remote / Work From Home</option>
              </select>
            </div>

            {/* Contract Duration - ONLY FOR INTERNSHIP */}
            {jobData.jobType === 'internship' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">How long is the contract? <span className="text-red-500">*</span></label>
                <div className="flex">
                  <input 
                    type="number" 
                    value={parseInt(jobData.contractPeriod) || 3}
                    onChange={(e) => onUpdate({ contractPeriod: `${e.target.value} months` })}
                    className="flex-1 px-3 py-2 border border-gray-300 border-r-0 rounded-l-md text-sm focus:outline-none focus:border-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 text-sm focus:outline-none shrink-0 w-28">
                    <option>Month(s)</option>
                    <option>Year(s)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Working Hours & Hours - FOR PART TIME */}
            {jobData.jobType === 'parttime' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Working Hours <span className="text-red-500">*</span></label>
                  <select 
                    value={jobData.workingHoursType || "Fixed hours"}
                    onChange={(e) => onUpdate({ workingHoursType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Fixed hours">Fixed hours</option>
                    <option value="Range">Range</option>
                    <option value="Maximum">Maximum</option>
                    <option value="Minimum">Minimum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hours <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input 
                      type="number"
                      value={jobData.hoursAmount || "20"}
                      onChange={(e) => onUpdate({ hoursAmount: e.target.value })}
                      placeholder="e.g. 20"
                      className="flex-1 px-3 py-2 border border-gray-300 border-r-0 rounded-l-md text-sm focus:outline-none focus:border-blue-500"
                    />
                    <select 
                      value={jobData.hoursPeriod || "per day"}
                      onChange={(e) => onUpdate({ hoursPeriod: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-700 text-sm focus:outline-none shrink-0 w-32"
                    >
                      <option value="per day">per day</option>
                      <option value="per week">per week</option>
                      <option value="per month">per month</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Required Languages */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Required Language(s) <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['English', 'Mandarin', 'Other', 'Bahasa Malaysia', 'Tamil'].map((lang) => (
                  <label key={lang} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#F9A121] rounded border-gray-300 focus:ring-[#F9A121]" 
                      checked={jobData.languages.includes(lang)}
                      onChange={(e) => {
                        const newLangs = e.target.checked 
                          ? [...jobData.languages, lang]
                          : jobData.languages.filter(l => l !== lang);
                        onUpdate({ languages: newLangs });
                      }}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            {/* Experience & Education */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years of Experience <span className="text-red-500">*</span></label>
                <select 
                  value={jobData.experience}
                  onChange={(e) => onUpdate({ experience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="No Experience">No Experience</option>
                  <option value="1 - 3 Years">1 - 3 Years</option>
                  <option value="3 - 5 Years">3 - 5 Years</option>
                  <option value="+6 Years">+6 Years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Minimum Education <span className="text-red-500">*</span></label>
                <select 
                  value={jobData.education}
                  onChange={(e) => onUpdate({ education: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="No Limit">No Limit</option>
                  <option value="Primary School">Primary School</option>
                  <option value="Secondary School">Secondary School</option>
                  <option value="Certificates / Vocational / Diploma">Certificates / Vocational / Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Location</h2>
            {!isEditingLocation && (
              <button 
                type="button"
                onClick={() => {
                  setCustomLocation(jobData.location || "");
                  setIsEditingLocation(true);
                }} 
                className="text-blue-600 text-sm font-bold hover:underline"
              >
                Edit Location
              </button>
            )}
          </div>

          {!isEditingLocation ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F8F9FA] border border-gray-200 rounded-lg gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{jobData.location || "Malaysia"}</span>
              </div>
              <div className="flex gap-4 shrink-0">
                <button 
                  type="button"
                  onClick={() => {
                    setCustomLocation(jobData.location || "");
                    setIsEditingLocation(true);
                  }} 
                  className="text-blue-600 text-sm font-bold hover:underline"
                >
                  Edit
                </button>
                <button 
                  type="button"
                  onClick={() => onUpdate({ location: "Malaysia" })} 
                  className="text-red-500 text-sm font-bold hover:underline"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Select State (Malaysia)</label>
                <select 
                  value={selectedState} 
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    if (e.target.value) {
                      setCustomLocation(prev => prev ? `${prev.replace(/,.*Malaysia/, '')}, ${e.target.value}, Malaysia` : `${e.target.value}, Malaysia`);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose a State --</option>
                  {MALAYSIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Specific Address / Area / Landmark</label>
                <input 
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g., Mid Valley City, Kuala Lumpur or Ayer Baloi, Johor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsEditingLocation(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveLocation}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#F9A121] hover:bg-[#EE9410] rounded-md transition-colors shadow-sm"
                >
                  Save Location
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <button type="button" className="px-6 py-2.5 border border-[#F9A121] text-[#F9A121] font-bold rounded-lg hover:bg-orange-50 transition-colors">
            Save as Draft
          </button>
          <button 
            type="button"
            onClick={() => onToggleEdit()} 
            className="px-8 py-2.5 bg-[#F9A121] text-white font-bold rounded-lg shadow-sm hover:bg-[#EE9410] transition-colors"
          >
            Preview Job
          </button>
        </div>

        {/* AI Generator Action */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            type="button"
            onClick={handleAutoGenerateAll} 
            className="flex items-center gap-2 bg-[#5B50FF] hover:bg-[#4a40e0] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors"
          >
            <Sparkles className="w-5 h-5" /> Auto Generate All
          </button>
        </div>

        {/* Card 3: Required Skills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Required Skills</h2>
              <p className="text-sm text-gray-600 mt-1">Add required skills for this role. Click any suggestion to add or type your own.</p>
            </div>
            <button 
              type="button"
              onClick={handleSuggestSkills} 
              className="flex items-center gap-2 bg-[#5B50FF] hover:bg-[#4a40e0] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4" /> Suggest Skills with AI
            </button>
          </div>

          {/* Suggestions */}
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Suggestions (Click to add):</div>
            <div className="flex flex-wrap gap-2">
              {AI_SKILLS.map(s => {
                const isAdded = jobData.skills.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkillDirect(s)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isAdded 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default' 
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-gray-500" />} {s}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Selected Skills ({jobData.skills.length})</label>
            <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white">
              <div className="flex flex-wrap gap-2">
                {jobData.skills.map((skill) => (
                  <Tag key={skill} text={skill} onRemove={() => onUpdate({ skills: jobData.skills.filter(s => s !== skill) })} />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and press Enter to add..." 
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400" 
                />
                <button
                  type="button"
                  onClick={() => {
                    if (skillInput.trim()) {
                      handleAddSkillDirect(skillInput.trim());
                      setSkillInput("");
                    }
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Salary & Compensation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900">Salary & Compensation</h2>
            <button 
              type="button"
              onClick={handleSuggestSalary} 
              className="flex items-center gap-2 bg-[#5B50FF] hover:bg-[#4a40e0] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Suggest Salary with AI
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Basic Salary Range <span className="text-red-500">*</span>
                {jobData.jobType === 'parttime' && <span className="text-xs font-normal text-blue-600 ml-2">(Hourly rate for Part-Time)</span>}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none">
                  <option>RM</option>
                </select>
                <input 
                  type="number" 
                  value={jobData.salaryMin} 
                  onChange={(e) => onUpdate({ salaryMin: e.target.value })} 
                  className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500" 
                />
                <span className="text-gray-400 font-medium">—</span>
                <input 
                  type="number" 
                  value={jobData.salaryMax} 
                  onChange={(e) => onUpdate({ salaryMax: e.target.value })} 
                  className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500" 
                />
                <select 
                  value={jobData.salaryPeriod} 
                  onChange={(e) => onUpdate({ salaryPeriod: e.target.value as any })} 
                  className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none"
                >
                  <option value="monthly">Per Month</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>
              <label className="flex items-center gap-2 mt-3 text-sm text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" 
                  checked={jobData.salaryPeriod === 'none'} 
                  onChange={(e) => onUpdate({ salaryPeriod: e.target.checked ? 'none' : (jobData.jobType === 'parttime' ? 'hourly' : 'monthly') })} 
                />
                This job has no basic salary.
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Compensation (Optional)</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-[#F9A121] rounded border-gray-300" /> Commission Pay</label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-[#F9A121] rounded border-gray-300" /> Overtime Pay</label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-[#F9A121] rounded border-gray-300" /> Performance Bonus</label>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Job Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
            <button 
              type="button"
              onClick={handleGenerateDescription} 
              className="flex items-center gap-2 bg-[#5B50FF] hover:bg-[#4a40e0] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Generate with AI
            </button>
          </div>

          {/* Language Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              <button 
                type="button"
                onClick={() => handleTranslateTo("en")}
                className={`pb-3 text-sm font-bold transition-colors ${activeLangTab === "en" ? 'text-gray-900 border-b-2 border-[#F9A121]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                English
              </button>
              <button 
                type="button"
                onClick={() => handleTranslateTo("bm")}
                className={`pb-3 text-sm font-bold transition-colors ${activeLangTab === "bm" ? 'text-gray-900 border-b-2 border-[#F9A121]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Bahasa Malaysia
              </button>
              <button 
                type="button"
                onClick={() => handleTranslateTo("zh")}
                className={`pb-3 text-sm font-bold transition-colors ${activeLangTab === "zh" ? 'text-gray-900 border-b-2 border-[#F9A121]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Mandarin (中文)
              </button>
            </div>
          </div>

          {isTranslating && (
            <div className="p-3 mb-4 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4" /> Translating job description with AI...
            </div>
          )}

          <div className="space-y-6">
            {/* Requirements */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Job Requirements <span className="text-red-500">*</span></label>
                <button 
                  type="button"
                  onClick={() => handleTranslateTo(activeLangTab === "en" ? "bm" : "en")} 
                  className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5"/> Translate
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                <RichTextToolbar />
                <textarea 
                  value={jobData.requirements.map(r => `• ${r}`).join('\n')}
                  onChange={(e) => onUpdate({ requirements: e.target.value.split('\n').map(l => l.replace(/^•\s*/, '')).filter(l => l.trim() !== '') })}
                  className="w-full p-4 min-h-[140px] text-sm text-gray-700 leading-relaxed outline-none resize-y"
                  placeholder="Enter requirements line by line..."
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Job Responsibilities <span className="text-red-500">*</span></label>
                <button 
                  type="button"
                  onClick={() => handleTranslateTo(activeLangTab === "en" ? "bm" : "en")} 
                  className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5"/> Translate
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                <RichTextToolbar />
                <textarea 
                  value={jobData.responsibilities.map(r => `• ${r}`).join('\n')}
                  onChange={(e) => onUpdate({ responsibilities: e.target.value.split('\n').map(l => l.replace(/^•\s*/, '')).filter(l => l.trim() !== '') })}
                  className="w-full p-4 min-h-[140px] text-sm text-gray-700 leading-relaxed outline-none resize-y"
                  placeholder="Enter responsibilities line by line..."
                />
              </div>
            </div>

            {/* Benefits */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Benefits <span className="text-red-500">*</span></label>
                <button 
                  type="button"
                  onClick={() => handleTranslateTo(activeLangTab === "en" ? "bm" : "en")} 
                  className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5"/> Translate
                </button>
              </div>
              
              {/* Benefit Suggestions */}
              <div className="mb-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Suggestions (Click to add):</div>
                <div className="flex flex-wrap gap-2">
                  {AI_BENEFITS.map((b) => {
                    const isAdded = jobData.benefits.includes(b);
                    return (
                      <button 
                        key={b} 
                        type="button"
                        onClick={() => handleAddBenefitDirect(b)} 
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isAdded 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default' 
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 cursor-pointer'
                        }`}
                      >
                        {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-gray-500" />} {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Benefits Tag Container */}
              <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white">
                <div className="flex flex-wrap gap-2">
                  {jobData.benefits.map((b) => (
                    <Tag key={b} text={b} onRemove={() => onUpdate({ benefits: jobData.benefits.filter(item => item !== b) })} />
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <input 
                    type="text" 
                    value={benefitInput} 
                    onChange={(e) => setBenefitInput(e.target.value)} 
                    onKeyDown={handleAddBenefit} 
                    placeholder="Type a custom benefit and press Enter to add..." 
                    className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (benefitInput.trim()) {
                        handleAddBenefitDirect(benefitInput.trim());
                        setBenefitInput("");
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Extra Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Extra Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Number of Vacancies</label>
              <select 
                value={jobData.vacancies}
                onChange={(e) => onUpdate({ vacancies: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="10+">10+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Position Level</label>
              <select 
                value={jobData.positionLevel || 'Entry Level'}
                onChange={(e) => onUpdate({ positionLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Junior Executive">Junior Executive</option>
                <option value="Senior Executive">Senior Executive</option>
                <option value="Manager">Manager</option>
                <option value="Senior Manager">Senior Manager</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700 font-medium">Accept Fresh Graduates?</span>
            <Toggle checked={jobData.freshGraduates} onChange={(v) => onUpdate({ freshGraduates: v })} color="bg-[#10B981]" />
          </div>
        </div>

        {/* CTA Card below Accept Fresh Graduates */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/90 rounded-2xl p-6 text-center shadow-xs">
          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#0E1F28] mb-1">
            Done reviewing your job details?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto leading-relaxed">
            If you have finished editing, publish your job ad now to start receiving applicants across <strong>Maukerja</strong> and <strong>Ricebowl</strong>, or switch to live preview.
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
            <button
              type="button"
              onClick={onToggleEdit}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Eye className="w-4 h-4 text-amber-500" />
              View Live Preview
            </button>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
