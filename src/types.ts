export type JobType = 
  | "internship" 
  | "parttime" 
  | "freelance" 
  | "volunteer" 
  | "singapore" 
  | "highpay";

export interface JobData {
  jobType: JobType;
  title: string;
  specialization: string;
  location: string;
  company: string;
  email: string;
  phone: string;
  whatsapp?: string;
  applyMethod?: "email" | "whatsapp" | "in_app";
  confidential: boolean;
  employmentType: string;
  contractPeriod: string;
  workingHours: string;
  hoursPerDay?: string;
  roleLocation?: string;
  workingHoursType?: string;
  hoursAmount?: string;
  hoursPeriod?: string;
  experience: string;
  languages: string[];
  education: string;
  skills: string[];
  salaryMin: string;
  salaryMax: string;
  salaryCurrency?: string;
  salaryPeriod: "monthly" | "hourly" | "none";
  compensation: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  vacancies: string;
  positionLevel: string;
  freshGraduates: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
  changes?: Partial<JobData>; // To track what the AI changed for 'Undo'
}

export const INITIAL_JOB_DATA: JobData = {
  jobType: "internship",
  title: "",
  specialization: "Advertising / Marketing",
  location: "Malaysia",
  company: "",
  email: "",
  phone: "",
  confidential: false,
  employmentType: "Internship",
  contractPeriod: "3",
  workingHours: "Fixed hours",
  experience: "No Experience",
  languages: ["English", "Bahasa Malaysia"],
  education: "Certificates / Vocational / Diploma",
  skills: ["Marketing", "Social Media", "Content Creation", "Communication"],
  salaryMin: "800",
  salaryMax: "1200",
  salaryPeriod: "monthly",
  compensation: [],
  description: "We are looking for an enthusiastic candidate to join our team. You will have the opportunity to learn and apply modern strategies in a fast-paced environment.",
  requirements: [
    "Good communication skills",
    "Basic knowledge of social media",
    "Creative mindset",
    "Able to work independently"
  ],
  responsibilities: [
    "Assist with campaigns",
    "Support content creation",
    "Assist with activities",
    "Conduct basic market research",
    "Support the team"
  ],
  benefits: [
    "Annual Leave",
    "Medical",
    "EPF",
    "SOCSO"
  ],
  vacancies: "2",
  positionLevel: "Entry Level",
  freshGraduates: true
};
