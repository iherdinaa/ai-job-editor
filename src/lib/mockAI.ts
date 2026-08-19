import { JobData, JobType } from "../types";

export function generateRoleBasedDetails(jobTitle: string, jobType: JobType): {
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  benefits: string[];
} {
  const title = (jobTitle || "").toLowerCase();

  // Marketing roles
  if (title.includes("market") || title.includes("social") || title.includes("content") || title.includes("media") || title.includes("seo") || title.includes("copywriter")) {
    return {
      skills: ["Digital Marketing", "Social Media Management", "Content Creation", "Canva / Adobe Suite", "Copywriting", "SEO Basics", "Google Analytics"],
      responsibilities: [
        "Plan, execute, and monitor engaging social media campaigns across TikTok, Instagram, and LinkedIn.",
        "Produce creative copy, visual assets, and marketing collateral aligned with brand guidelines.",
        "Analyze monthly campaign performance metrics and present actionable growth recommendations.",
        "Collaborate closely with internal sales and product teams to drive inbound lead generation."
      ],
      requirements: [
        jobType === "internship" ? "Currently pursuing or recently graduated with a Diploma/Degree in Marketing, Mass Comm, or related field." : "Minimum 1-2 years of relevant experience in digital marketing or social media.",
        "Strong command of written and spoken English and Bahasa Malaysia.",
        "Familiarity with graphic design tools (Canva/Photoshop) and video editing apps (CapCut).",
        "Creative mindset with strong attention to visual detail and engagement trends."
      ],
      benefits: ["Performance-based Bonuses", "Flexible Working Hours", "Company Laptop Provided", "Team Lunches & Outings"]
    };
  }

  // Software / Tech / IT roles
  if (title.includes("software") || title.includes("developer") || title.includes("engineer") || title.includes("frontend") || title.includes("backend") || title.includes("full stack") || title.includes("web") || title.includes("it") || title.includes("tech")) {
    return {
      skills: ["JavaScript / TypeScript", "React / Node.js", "RESTful APIs", "Git Version Control", "SQL / Database Design", "Problem Solving", "CI/CD Basics"],
      responsibilities: [
        "Develop, test, and deploy clean, maintainable, and well-documented web or mobile applications.",
        "Participate in agile sprint ceremonies, code reviews, and architectural planning discussions.",
        "Troubleshoot, debug, and optimize application performance across diverse browsers and devices.",
        "Integrate external APIs and microservices to ensure smooth data synchronization."
      ],
      requirements: [
        jobType === "internship" ? "Currently pursuing a Degree in Computer Science, Software Engineering, or Information Technology." : "Bachelor's degree in Computer Science or equivalent practical development experience.",
        "Hands-on experience with modern web frameworks (React, Vue, Node.js or Python).",
        "Solid understanding of database queries, object-oriented concepts, and Git workflow.",
        "Strong analytical problem-solving skills and a proactive drive to learn new technologies."
      ],
      benefits: ["Hybrid Work Arrangement", "Tech Allowance / Equipment Budget", "Medical & Optical Insurance", "Learning & Certification Sponsorship"]
    };
  }

  // Sales / Business Development / Account Exec
  if (title.includes("sale") || title.includes("business dev") || title.includes("bd") || title.includes("account") || title.includes("client")) {
    return {
      skills: ["B2B Sales", "Client Relationship Management", "Negotiation", "Lead Generation", "Cold Calling / Pitching", "CRM Tools (Hubspot/Salesforce)", "Communication"],
      responsibilities: [
        "Identify and prospect new potential business clients through active outbound outreach and networking.",
        "Conduct compelling product demonstrations and prepare customized sales proposals.",
        "Nurture enduring relationships with existing corporate clients to ensure high retention.",
        "Meet and exceed quarterly sales revenue targets and pipeline milestones."
      ],
      requirements: [
        jobType === "internship" ? "Enthusiastic student or fresh graduate in Business, Marketing, or Communications with great communication skills." : "Proven track record in sales, business development, or customer success.",
        "Excellent interpersonal, persuasive negotiation, and presentation abilities.",
        "High self-motivation, goal-driven mindset, and resilience in closing deals.",
        "Possess own transport and willingness to travel within the region when necessary."
      ],
      benefits: ["High Uncapped Commission Structure", "Transport & Mileage Allowance", "Annual Overseas Incentive Trip", "Comprehensive Medical Coverage"]
    };
  }

  // Admin / HR / Operations / Finance
  if (title.includes("admin") || title.includes("hr") || title.includes("human resource") || title.includes("operation") || title.includes("finance") || title.includes("accountant")) {
    return {
      skills: ["Office Administration", "Microsoft Excel / Google Sheets", "Data Entry & Filing", "Communication", "Time Management", "HR Onboarding", "Confidentiality"],
      responsibilities: [
        "Manage day-to-day administrative tasks, documentation, and organized database filing.",
        "Coordinate staff schedules, meetings, travel arrangements, and office supply requisitions.",
        "Assist in basic bookkeeping, invoice verification, and tracking operational expenditure.",
        "Support HR in scheduling candidate interviews, onboarding preparations, and staff inquiries."
      ],
      requirements: [
        jobType === "internship" ? "Diploma or Degree in Business Administration, Human Resources, Finance, or related discipline." : "1+ years of experience in administrative, HR support, or office operations role.",
        "High proficiency in Microsoft Office (Excel, Word) and Google Workspace.",
        "Meticulous attention to detail and strong organizational skills.",
        "Friendly demeanor with strong verbal and written communication."
      ],
      benefits: ["Annual Leave & Medical Coverage", "Parking Allowance", "Regular Office Snacks & Drinks", "Supportive Work Environment"]
    };
  }

  // Customer Service / Retail / F&B
  if (title.includes("customer") || title.includes("service") || title.includes("retail") || title.includes("barista") || title.includes("waiter") || title.includes("cashier") || title.includes("support")) {
    return {
      skills: ["Customer Service", "Active Listening", "Complaint Resolution", "POS System", "Communication", "Teamwork", "Patience"],
      responsibilities: [
        "Warmly greet and assist customers with inquiries, product recommendations, and purchases.",
        "Handle customer requests and resolve complaints promptly with professionalism and patience.",
        "Maintain cleanliness, organized product displays, and inventory accuracy on the floor.",
        "Process payments accurately using POS terminals and manage daily cash reconciliation."
      ],
      requirements: [
        "SPM / STPM / Diploma or equivalent qualification.",
        "Pleasant personality, customer-centric attitude, and good interpersonal communication.",
        "Willingness to work on shifts, weekends, or public holidays as required.",
        "Prior experience in retail, F&B, or hospitality is an added advantage."
      ],
      benefits: ["Shift & Attendance Allowance", "Staff Discount on Products", "Overtime (OT) Pay", "Medical Insurance"]
    };
  }

  // Default Universal Fallback
  return {
    skills: ["Communication", "Team Collaboration", "Problem Solving", "Time Management", "Attention to Detail", "Adaptability"],
    responsibilities: [
      `Execute core operational and project milestones for the ${jobTitle || 'assigned'} role with high accuracy.`,
      "Collaborate with team members to streamline internal workflows and deliver positive outcomes.",
      "Participate actively in team meetings, progress reporting, and task follow-ups.",
      "Identify opportunities to enhance efficiency and maintain high quality standards."
    ],
    requirements: [
      jobType === "internship" ? "Currently pursuing or recently completed Diploma / Degree in a relevant discipline." : "Relevant academic background or equivalent practical experience in this field.",
      "Good command of English and Bahasa Malaysia.",
      "Proactive, disciplined, and eager to learn in a fast-paced environment.",
      "Strong team player with positive work ethics and problem-solving skills."
    ],
    benefits: ["Competitive Salary Package", "Career Progression Opportunities", "Medical Benefits", "Annual Performance Bonus"]
  };
}

export async function generateAIResponse(
  userMessage: string,
  currentJobData: JobData
): Promise<{ message: string; updates: Partial<JobData> }> {
  // First try server Gemini if available
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, currentJobData })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.updates && Object.keys(data.updates).length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Using smart client-side conversational AI:", err);
  }

  const msg = userMessage;
  const lowerMsg = userMessage.toLowerCase();
  const updates: Partial<JobData> = {};

  const currentTitle = currentJobData.title || "";
  const currentCompany = currentJobData.company || "";
  const currentType = (currentJobData.jobType || "fulltime") as JobType;

  // 1. Quick refinement commands
  if (lowerMsg.includes("better requirement") || lowerMsg.includes("change better requirement")) {
    const roleDetails = generateRoleBasedDetails(currentTitle || "Job Role", currentType);
    const enhancedReqs = [
      ...roleDetails.requirements,
      "Demonstrated ability to think critically and solve problems proactively.",
      "Passionate, adaptable team player with a strong learning orientation."
    ];
    return {
      message: `I've upgraded and refined the job requirements for **${currentTitle || 'this role'}** to make them more comprehensive, professional, and appealing to top candidates! ✨`,
      updates: { requirements: enhancedReqs }
    };
  }

  if (lowerMsg.includes("better responsibility") || lowerMsg.includes("change better responsibility")) {
    const roleDetails = generateRoleBasedDetails(currentTitle || "Job Role", currentType);
    const enhancedResps = [
      ...roleDetails.responsibilities,
      "Lead and contribute to impactful team milestones while driving high work quality.",
      "Actively communicate project progress and provide proactive recommendations."
    ];
    return {
      message: `I've polished the responsibilities for **${currentTitle || 'this role'}** with stronger action verbs and clear, impactful deliverables! 📋`,
      updates: { responsibilities: enhancedResps }
    };
  }

  if (lowerMsg.includes("suggest skills")) {
    const roleDetails = generateRoleBasedDetails(currentTitle || "Job Role", currentType);
    return {
      message: `I've updated the skill tags to match top industry demands for **${currentTitle || 'this role'}**! 💡`,
      updates: { skills: roleDetails.skills }
    };
  }

  if (lowerMsg.includes("more attractive") || lowerMsg.includes("attractive")) {
    const roleDetails = generateRoleBasedDetails(currentTitle || "Job Role", currentType);
    return {
      message: `I've polished the job overview, emphasized company perks & culture, and made the job posting more engaging for top talent! 🚀`,
      updates: {
        description: `Are you ready to accelerate your career as our ${currentTitle || 'team member'}? At ${currentCompany || 'our team'}, you will work on exciting projects with great mentors, enjoy a collaborative environment, and make a tangible impact from day one.`,
        benefits: [...roleDetails.benefits, "Fast-track Career Growth", "Supportive & Fun Team Culture"]
      }
    };
  }

  // 2. Extract Fields from user message
  const companyMatch = msg.match(/(?:1\.?\s*company\s*name|company\s*name|company)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const titleMatch = msg.match(/(?:2\.?\s*job\s*title|job\s*title|title)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const locationMatch = msg.match(/(?:3\.?\s*location|location)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const jobTypeMatch = msg.match(/(?:4\.?\s*job\s*type|job\s*type|type)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const salaryMatch = msg.match(/(?:5\.?\s*salary|salary)\s*[:=-]\s*([^,\n\r\.]+)/i);

  if (companyMatch && companyMatch[1].trim()) updates.company = companyMatch[1].trim();
  if (titleMatch && titleMatch[1].trim()) updates.title = titleMatch[1].trim();
  if (locationMatch && locationMatch[1].trim()) updates.location = locationMatch[1].trim();

  // If user sent comma separated e.g. "ABC Sdn Bhd, Marketing Executive, Kuala Lumpur"
  if (!companyMatch && !titleMatch && msg.includes(',')) {
    const parts = msg.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      updates.company = parts[0];
      updates.title = parts[1];
      updates.location = parts[2];
    } else if (parts.length === 2) {
      if (!currentCompany) updates.company = parts[0];
      if (!currentTitle) updates.title = parts[1];
    }
  } else if (!companyMatch && !titleMatch && !locationMatch && !jobTypeMatch && !salaryMatch && !currentTitle) {
    // If user just typed text e.g. "Google Software Engineer Singapore"
    const words = msg.split(/\s+/);
    if (words.length >= 3 && !lowerMsg.includes("rm") && !lowerMsg.includes("sgd")) {
      updates.company = words[0];
      updates.title = words.slice(1, -1).join(" ");
      updates.location = words[words.length - 1];
    }
  }

  // Detect Job Type
  let detectedType: JobType | null = null;
  const rawType = (jobTypeMatch ? jobTypeMatch[1] : msg).toLowerCase();
  if (rawType.includes("intern")) detectedType = "internship";
  else if (rawType.includes("part")) detectedType = "parttime";
  else if (rawType.includes("free")) detectedType = "freelance";
  else if (rawType.includes("volun")) detectedType = "volunteer";
  else if (rawType.includes("singapore")) detectedType = "singapore";
  else if (rawType.includes("high")) detectedType = "highpay";

  if (detectedType) {
    updates.jobType = detectedType;
    if (detectedType === "singapore") {
      updates.location = "Singapore";
      updates.salaryCurrency = "SGD";
    } else {
      updates.salaryCurrency = "RM";
    }
  }

  // Detect Salary
  const salStr = salaryMatch ? salaryMatch[1] : (msg.toLowerCase().includes("rm") || msg.toLowerCase().includes("sgd") || msg.toLowerCase().includes("salary") || /\d{3,}/.test(msg) ? msg : "");
  if (salStr) {
    const numbers = salStr.replace(/,/g, '').match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      updates.salaryMin = numbers[0];
      updates.salaryMax = numbers[1];
    } else if (numbers && numbers.length === 1) {
      updates.salaryMin = numbers[0];
      updates.salaryMax = (parseInt(numbers[0]) * 1.4).toFixed(0);
    }
    if (salStr.toLowerCase().includes("sgd") || (detectedType === "singapore")) {
      updates.salaryCurrency = "SGD";
    } else {
      updates.salaryCurrency = "RM";
    }
    if (salStr.toLowerCase().includes("hour")) {
      updates.salaryPeriod = "hourly";
    } else if (salStr.toLowerCase().includes("unpaid") || salStr.toLowerCase().includes("free")) {
      updates.salaryMin = "0";
      updates.salaryMax = "0";
      updates.salaryPeriod = "none";
    } else {
      updates.salaryPeriod = "monthly";
    }
  }

  const effectiveTitle = updates.title || currentJobData.title;
  const effectiveCompany = updates.company || currentJobData.company;
  const effectiveLocation = updates.location || currentJobData.location;
  const effectiveType = (updates.jobType || currentJobData.jobType) as JobType;

  if (effectiveTitle) {
    const roleDetails = generateRoleBasedDetails(effectiveTitle, effectiveType);
    updates.responsibilities = roleDetails.responsibilities;
    updates.requirements = roleDetails.requirements;
    updates.skills = roleDetails.skills;
    updates.benefits = roleDetails.benefits;
    updates.description = `We are looking for a passionate ${effectiveTitle} to join ${effectiveCompany || 'our team'} in ${effectiveLocation || 'Malaysia'}. You will play a key role in driving impactful work and collaborating with great teammates.`;
  }

  // 3. Conversational Next Step Detection
  const hasBasicNow = Boolean((effectiveTitle && effectiveTitle.trim()) && (effectiveCompany && effectiveCompany.trim()));
  const actualType = updates.jobType || currentJobData.jobType;
  const actualSalaryMin = updates.salaryMin || currentJobData.salaryMin;

  // Ask STEP 2: Job Type
  if (hasBasicNow && !actualType) {
    return {
      message: `Great! I've noted down **${effectiveTitle}** at **${effectiveCompany}** (${effectiveLocation || 'Malaysia'}).

What is the **Job Type** for this role?`,
      updates
    };
  }

  // Ask STEP 3: Salary
  if (hasBasicNow && actualType && !actualSalaryMin) {
    const typeLabelMap: Record<string, string> = {
      internship: "Internship (🎓)",
      parttime: "Part-time (⏱️)",
      freelance: "Freelance (💻)",
      highpay: "High Pay (> RM8,000 💰)",
      volunteer: "Volunteer (🤝)",
      singapore: "Singapore Job (🇸🇬)"
    };
    const typeLabel = typeLabelMap[actualType] || actualType;

    const sampleExample = actualType === "internship" 
      ? "RM 1,000 - RM 1,800 / month, or Unpaid" 
      : actualType === "highpay"
        ? "RM 8,500 - RM 14,000 / month"
        : actualType === "singapore"
          ? "SGD 3,000 - SGD 4,500 / month"
          : actualType === "parttime"
            ? "RM 15 - RM 25 / hour, or RM 1,500 / month"
            : "RM 1,500 - RM 3,500 / month";

    return {
      message: `Got it, **${typeLabel}**!

What is the **Salary** or allowance for this position?
*(e.g. ${sampleExample})*`,
      updates
    };
  }

  // If Salary provided / All steps completed -> Finished!
  const salDisplay = updates.salaryMin && updates.salaryMin !== "0"
    ? `${updates.salaryCurrency || 'RM'} ${updates.salaryMin} - ${updates.salaryMax} / ${updates.salaryPeriod || 'month'}`
    : currentJobData.salaryMin && currentJobData.salaryMin !== "0"
      ? `${currentJobData.salaryCurrency || 'RM'} ${currentJobData.salaryMin} - ${currentJobData.salaryMax} / ${currentJobData.salaryPeriod || 'month'}`
      : "Salary configured";

  return {
    message: `🎉 Great! I've prepared your complete job ad for **${effectiveTitle || 'this role'}** at **${effectiveCompany || 'your company'}** (${salDisplay})!

✨ **Tailored requirements, responsibilities, skills, and benefits** have been automatically generated.

You can preview the ad on the right or tell me if you'd like to refine anything!`,
    updates
  };
}
