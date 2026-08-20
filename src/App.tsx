import { useState } from 'react';
import { JobData, ChatMessage, INITIAL_JOB_DATA } from './types';
import { generateAIResponse } from './lib/mockAI';

import EmailPreview from './components/EmailPreview';
import AIAssistant from './components/AIAssistant';
import JobPreview from './components/JobPreview';
import ManualEditor from './components/ManualEditor';
import SuccessScreen from './components/SuccessScreen';
import ContactConfirmModal from './components/ContactConfirmModal';
import { CheckCircle } from 'lucide-react';

type AppView = 'email' | 'editor' | 'success';

const VALID_JOB_TYPES: JobData['jobType'][] = ['internship', 'parttime', 'freelance', 'volunteer', 'singapore', 'highpay'];

// Infer the job type from the campaign title/hiring_inquiries text (e.g. "SOCIAL MEDIA INTERNSHIP" -> internship)
function inferJobType(title: string): JobData['jobType'] {
  const t = title.toLowerCase();
  if (/\bintern(ship)?\b/.test(t)) return 'internship';
  if (/part[\s-]?time/.test(t)) return 'parttime';
  if (/\bfreelance\b/.test(t)) return 'freelance';
  if (/\bvolunteer\b/.test(t)) return 'volunteer';
  if (/high[\s-]?pay/.test(t)) return 'highpay';
  if (/\bsingapore\b/.test(t)) return 'singapore';
  return '';
}

// Sensible defaults per job type, mirroring the values ManualEditor uses,
// so the recorded row always has a job type and salary instead of blanks.
function defaultsForJobType(jobType: JobData['jobType']): Pick<JobData, 'salaryMin' | 'salaryMax' | 'salaryPeriod' | 'employmentType'> {
  switch (jobType) {
    case 'parttime':
      return { salaryMin: '10', salaryMax: '25', salaryPeriod: 'hourly', employmentType: 'Part-time' };
    case 'freelance':
      return { salaryMin: '10', salaryMax: '25', salaryPeriod: 'hourly', employmentType: 'Freelance' };
    case 'volunteer':
      return { salaryMin: '0', salaryMax: '0', salaryPeriod: 'none', employmentType: 'Volunteer' };
    case 'internship':
      return { salaryMin: '800', salaryMax: '1200', salaryPeriod: 'monthly', employmentType: 'Internship' };
    case 'highpay':
      return { salaryMin: '8000', salaryMax: '12000', salaryPeriod: 'monthly', employmentType: 'High Pay (> RM8,000)' };
    case 'singapore':
      return { salaryMin: '3000', salaryMax: '5000', salaryPeriod: 'monthly', employmentType: 'Singapore Job (SGD)' };
    default:
      return { salaryMin: INITIAL_JOB_DATA.salaryMin, salaryMax: INITIAL_JOB_DATA.salaryMax, salaryPeriod: INITIAL_JOB_DATA.salaryPeriod, employmentType: INITIAL_JOB_DATA.employmentType };
  }
}

function getInitialJobData(): JobData {
  if (typeof window === 'undefined') return INITIAL_JOB_DATA;
  const params = new URLSearchParams(window.location.search);
  const rawTitle = params.get('hiring_inquiries') || params.get('title') || params.get('job_title') || '';
  const rawCompany = params.get('company') || params.get('firstname') || params.get('name') || '';
  const rawEmail = params.get('email') || '';
  const rawPhone = params.get('phone') || '';
  const rawLocation = params.get('location') || '';

  const cleanTitle = (rawTitle === '[HIRING_INQUIRIES]' || rawTitle === 'undefined' || rawTitle === 'null') ? '' : rawTitle;
  const cleanCompany = (rawCompany === '[FIRSTNAME]' || rawCompany === 'undefined' || rawCompany === 'null') ? '' : rawCompany;
  const cleanEmail = (rawEmail === '[EMAIL]' || rawEmail === 'undefined' || rawEmail === 'null') ? '' : rawEmail;

  // Resolve job type: explicit URL param wins, otherwise infer from the title text.
  const explicitType = (params.get('job_type') || params.get('jobType') || params.get('jobtype') || '').toLowerCase().trim();
  const jobType: JobData['jobType'] = (VALID_JOB_TYPES as string[]).includes(explicitType)
    ? (explicitType as JobData['jobType'])
    : inferJobType(cleanTitle);

  const typeDefaults = defaultsForJobType(jobType);

  // Salary: explicit URL params win, otherwise fall back to the job-type defaults.
  const urlSalaryMin = params.get('salaryMin') || params.get('salary_min') || params.get('salary') || '';
  const urlSalaryMax = params.get('salaryMax') || params.get('salary_max') || '';
  const urlSalaryPeriod = params.get('salaryPeriod') || params.get('salary_period') || '';

  return {
    ...INITIAL_JOB_DATA,
    jobType,
    employmentType: typeDefaults.employmentType,
    title: cleanTitle || INITIAL_JOB_DATA.title,
    company: cleanCompany || INITIAL_JOB_DATA.company,
    email: cleanEmail || INITIAL_JOB_DATA.email,
    phone: rawPhone || INITIAL_JOB_DATA.phone,
    location: rawLocation || INITIAL_JOB_DATA.location,
    salaryMin: urlSalaryMin || typeDefaults.salaryMin,
    salaryMax: urlSalaryMax || typeDefaults.salaryMax,
    salaryPeriod: (urlSalaryPeriod as JobData['salaryPeriod']) || typeDefaults.salaryPeriod
  };
}

export default function App() {
  const [view, setView] = useState<AppView>('email');
  const [jobData, setJobData] = useState<JobData>(getInitialJobData);
  const [history, setHistory] = useState<JobData[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submissionId, setSubmissionId] = useState<string>(() => `AJT-${Date.now().toString(36).toUpperCase()}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const initData = getInitialJobData();
    const isBlank = !initData.title.trim() || !initData.company.trim();
    if (isBlank) {
      return [
        {
          id: 'init-1',
          role: 'ai',
          content: `👋 Hi! Let's build your job ad step by step.

What is your **Company Name**, **Job Title**, and **Location**?
*(e.g. AJobThing Sdn Bhd, Marketing Executive, Petaling Jaya)*`,
          timestamp: Date.now()
        }
      ];
    }
    return [
      {
        id: 'init-1',
        role: 'ai',
        content: `👋 Hi! I've loaded your job ad for **${initData.title || 'this role'}** at **${initData.company || 'your company'}**.

You can review the preview on the right or use the quick buttons below to refine any section:`,
        timestamp: Date.now()
      }
    ];
  });
  const [isAITyping, setIsAITyping] = useState(false);

  // --- Handlers ---

  const validateJob = (data: JobData): string[] => {
    const errors: string[] = [];
    if (!data.company.trim()) errors.push("Company name is required.");
    if (!data.title.trim()) errors.push("Job title is required.");
    if (!data.location.trim()) errors.push("Location is required.");
    
    if (data.jobType === 'singapore' && data.location.toLowerCase() !== 'singapore') {
      errors.push("Singapore jobs must have location set to 'Singapore'.");
    }
    
    if (data.jobType === 'highpay') {
      const min = parseInt(data.salaryMin.replace(/\D/g, '')) || 0;
      if (min <= 8000) {
        errors.push("High Pay jobs must have a basic salary above RM8,000.");
      }
    }
    return errors;
  };

  const handleUpdateJobData = (updates: Partial<JobData>, saveHistory = true) => {
    if (saveHistory) {
      setHistory(prev => [...prev, { ...jobData }]);
    }
    setJobData(prev => {
      const newData = { ...prev, ...updates };
      // Clear errors on update
      if (validationErrors.length > 0) {
        setValidationErrors(validateJob(newData));
      }
      return newData;
    });
  };

  const handleUndo = (msgId: string) => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setJobData(previousState);
      setHistory(prev => prev.slice(0, -1));
      
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          content: "I've reverted the previous changes as requested. ↩️",
          timestamp: Date.now()
        }
      ]);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMsgId = Date.now().toString();
    setChatMessages(prev => [...prev, { id: userMsgId, role: 'user', content, timestamp: Date.now() }]);
    
    // Check if this was a restart command
    if (content.toLowerCase().startsWith("restart")) {
      setJobData({
        ...INITIAL_JOB_DATA,
        title: "",
        company: "",
        salaryMin: "0",
        salaryMax: "0"
      });
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: `🔄 Resetting! What is your **Company Name**, **Job Title**, and **Location**?
*(e.g. AJobThing Sdn Bhd, Marketing Executive, Petaling Jaya)*`,
          timestamp: Date.now()
        }
      ]);
      return;
    }

    setIsAITyping(true);
    
    // Call AI
    const response = await generateAIResponse(content, jobData);
    
    setIsAITyping(false);
    
    const aiMsgId = (Date.now() + 1).toString();
    setChatMessages(prev => [...prev, {
      id: aiMsgId,
      role: 'ai',
      content: response.message,
      timestamp: Date.now(),
      changes: response.updates
    }]);

    if (response.updates && Object.keys(response.updates).length > 0) {
      handleUpdateJobData(response.updates);
    }
  };

  const handlePostJobInit = () => {
    const errors = validateJob(jobData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setView('editor');
      setIsEditMode(true); // Force edit mode to show errors
      return;
    }
    // Open Contact Confirmation Modal
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAndPost = async (contactInfo: { email: string; phone: string; company: string }) => {
    setIsSubmitting(true);
    const updatedJobData: JobData = {
      ...jobData,
      email: contactInfo.email,
      phone: contactInfo.phone,
      company: contactInfo.company
    };
    setJobData(updatedJobData);

    const newSubmissionId = `AJT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmissionId(newSubmissionId);
    
    try {
      // Submit to server API endpoint (persists and forwards to Google Apps Script + Lark)
      const res = await fetch('/api/submit-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedJobData,
          submissionId: newSubmissionId
        })
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        console.warn('[submit-job] Recording not confirmed:', result);
      } else {
        console.log('[submit-job] Recorded:', {
          sheetRecorded: result.sheetRecorded,
          larkRecorded: result.larkRecorded,
        });
      }
    } catch (e) {
      console.warn('Google Sheets logging notification:', e);
    } finally {
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
      setView('success');
    }
  };

  const handleReset = () => {
    setView('editor');
    setJobData({
      ...INITIAL_JOB_DATA,
      title: "",
      company: "",
      salaryMin: "0",
      salaryMax: "0"
    });
    setHistory([]);
    setChatMessages([
      {
        id: Date.now().toString(),
        role: 'ai',
        content: `👋 Let's create another job posting! What is your **Company Name**, **Job Title**, and **Location**?
*(e.g. AJobThing Sdn Bhd, Marketing Executive, Petaling Jaya)*`,
        timestamp: Date.now()
      }
    ]);
  };

  // --- Views ---

  if (view === 'email') {
    return (
      <>
        <EmailPreview jobData={jobData} onEdit={() => setView('editor')} onPost={handlePostJobInit} />
        <ContactConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          jobData={jobData}
          onConfirm={handleConfirmAndPost}
          isSubmitting={isSubmitting}
        />
      </>
    );
  }

  if (view === 'success') {
    return (
      <SuccessScreen 
        jobData={jobData} 
        submissionId={submissionId}
        onReset={handleReset} 
        onEditAgain={() => setView('editor')}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      {/* Contact Confirmation Modal */}
      <ContactConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        jobData={jobData}
        onConfirm={handleConfirmAndPost}
        isSubmitting={isSubmitting}
      />
      {/* Navbar */}
      <header className="h-16 border-b border-[#E8ECF0] flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('email')}
            className="text-sm font-bold text-[#556570] hover:text-[#0E1F28] flex items-center gap-1 cursor-pointer"
          >
            ← Back
          </button>
          <img 
            src="https://files.ajobthing.com/employers/premium_logo_brand-119511-1759997194.jpeg" 
            alt="AJobThing" 
            className="h-11 sm:h-12 w-auto object-contain rounded-md" 
          />
        </div>
        
        <div className="font-bold text-[#0E1F28] text-lg hidden md:block">
          AI Job Ad Editor
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[#556570] hidden sm:inline-block">Draft saved</span>
          <button 
            onClick={handlePostJobInit}
            className="px-6 py-2 bg-[#F9A121] text-white text-sm font-bold rounded-lg hover:bg-[#EE9410] transition-colors shadow-md shadow-orange-500/20"
          >
            Post Job
          </button>
        </div>
      </header>

      {/* Main Editor Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: AI Assistant */}
        <div className="w-full md:w-[40%] xl:w-[35%] flex flex-col border-r border-[#E8ECF0] bg-white h-[50vh] md:h-auto">
          <AIAssistant 
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onUndo={handleUndo}
            isTyping={isAITyping}
            jobData={jobData}
          />
        </div>

        {/* Right Side: Live Preview / Manual Edit */}
        <div className="w-full md:w-[60%] xl:w-[65%] flex flex-col bg-[#F3F4F6] h-[50vh] md:h-auto">
          {isEditMode ? (
            <ManualEditor 
              jobData={jobData} 
              onUpdate={handleUpdateJobData}
              validationErrors={validationErrors}
              isEditMode={isEditMode}
              onToggleEdit={() => setIsEditMode(!isEditMode)}
              onPost={handlePostJobInit}
            />
          ) : (
            <JobPreview 
              jobData={jobData} 
              isEditMode={isEditMode} 
              onToggleEdit={() => setIsEditMode(!isEditMode)} 
              onPost={handlePostJobInit}
            />
          )}
          
          {/* Mobile Bottom Bar for switching */}
          <div className="md:hidden flex-none border-t border-[#E8ECF0] bg-white p-3 flex gap-2">
             <button 
               onClick={() => setIsEditMode(false)}
               className={`flex-1 py-2 text-sm font-bold rounded-lg border ${!isEditMode ? 'bg-[#F7F9FB] border-[#E8ECF0] text-[#0E1F28]' : 'border-transparent text-[#556570]'}`}
             >
               Preview
             </button>
             <button 
               onClick={() => setIsEditMode(true)}
               className={`flex-1 py-2 text-sm font-bold rounded-lg border ${isEditMode ? 'bg-[#F7F9FB] border-[#E8ECF0] text-[#0E1F28]' : 'border-transparent text-[#556570]'}`}
             >
               Edit
             </button>
          </div>
        </div>

      </main>
    </div>
  );
}

