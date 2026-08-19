import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';

// Load the standard env cascade so project variables (GEMINI_API_KEY, AIEDITOR,
// GOOGLE_APPS_SCRIPT_URL, LARK_WEBHOOK_URL, etc.) are available. Plain `.env` alone
// misses `.env.development.local`/`.env.local`, which is where these are injected.
// Earlier files in the list take precedence for a given key.
dotenv.config({ path: ['.env.development.local', '.env.local', '.env'], quiet: true });

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function generateWithModelFallback(params: {
  contents: any;
  config?: any;
}) {
  const models = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.7-flash'];
  let lastErr: any = null;

  for (const model of models) {
    try {
      return await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          ...params.config,
          maxOutputTokens: 800,
          temperature: 0.3
        }
      });
    } catch (err: any) {
      lastErr = err;
      console.warn(`[AI Engine] Model ${model} fallback trigger:`, err?.status || err?.message || err);
    }
  }
  throw lastErr;
}

function getRoleFallback(jobTitle: string, jobType: string) {
  const title = (jobTitle || "").toLowerCase();
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

function handleFallbackChat(message: string, currentJobData: any) {
  const msg = message || "";
  const lowerMsg = msg.toLowerCase();
  const updates: any = {};
  const currentTitle = currentJobData?.title || "";
  const currentCompany = currentJobData?.company || "";
  const currentLocation = currentJobData?.location || "";
  const currentType = currentJobData?.jobType || "";

  if (lowerMsg.includes("better requirement") || lowerMsg.includes("change better requirement")) {
    const role = getRoleFallback(currentTitle, currentType || "fulltime");
    return {
      message: `I've upgraded and refined the job requirements for **${currentTitle || 'this role'}** to make them more comprehensive and attractive to top candidates! ✨`,
      updates: { requirements: [...role.requirements, "Demonstrated ability to solve problems proactively and think critically."] }
    };
  }

  if (lowerMsg.includes("better responsibility")) {
    const role = getRoleFallback(currentTitle, currentType || "fulltime");
    return {
      message: `I've polished the responsibilities for **${currentTitle || 'this role'}** with impactful action verbs and clearer deliverables! 📋`,
      updates: { responsibilities: [...role.responsibilities, "Lead and contribute to key milestones while driving high work quality."] }
    };
  }

  if (lowerMsg.includes("suggest skills")) {
    const role = getRoleFallback(currentTitle, currentType || "fulltime");
    return {
      message: `I've updated the skill tags to match top industry demands for **${currentTitle || 'this role'}**! 💡`,
      updates: { skills: role.skills }
    };
  }

  if (lowerMsg.includes("attractive")) {
    const role = getRoleFallback(currentTitle, currentType || "fulltime");
    return {
      message: `I've polished the job overview and emphasized company perks and team culture for **${currentTitle || 'this role'}**! 🚀`,
      updates: {
        description: `Are you ready to accelerate your career as our ${currentTitle || 'team member'}? At ${currentCompany || 'our company'}, you will work on exciting projects with supportive teammates and make a tangible impact from day one.`,
        benefits: [...role.benefits, "Fast-track Career Growth", "Supportive & Fun Team Culture"]
      }
    };
  }

  // 1. Extract Company, Title, Location
  const companyMatch = msg.match(/(?:1\.?\s*company\s*name|company\s*name|company)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const titleMatch = msg.match(/(?:2\.?\s*job\s*title|job\s*title|title)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const locationMatch = msg.match(/(?:3\.?\s*location|location)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const jobTypeMatch = msg.match(/(?:4\.?\s*job\s*type|job\s*type|type)\s*[:=-]\s*([^,\n\r\.]+)/i);
  const salaryMatch = msg.match(/(?:5\.?\s*salary|salary)\s*[:=-]\s*([^,\n\r\.]+)/i);

  if (companyMatch && companyMatch[1].trim()) updates.company = companyMatch[1].trim();
  if (titleMatch && titleMatch[1].trim()) updates.title = titleMatch[1].trim();
  if (locationMatch && locationMatch[1].trim()) updates.location = locationMatch[1].trim();

  // Comma separated e.g. "AJobThing Sdn Bhd, Marketing Executive, Petaling Jaya"
  if (!companyMatch && !titleMatch && msg.includes(',')) {
    const parts = msg.split(',').map((p: string) => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      updates.company = parts[0];
      updates.title = parts[1];
      updates.location = parts[2];
    } else if (parts.length === 2) {
      if (!currentCompany) updates.company = parts[0];
      if (!currentTitle) updates.title = parts[1];
    }
  } else if (!companyMatch && !titleMatch && !locationMatch && !jobTypeMatch && !salaryMatch && !currentTitle) {
    const words = msg.split(/\s+/);
    if (words.length >= 3 && !lowerMsg.includes("rm") && !lowerMsg.includes("sgd")) {
      updates.company = words[0];
      updates.title = words.slice(1, -1).join(" ");
      updates.location = words[words.length - 1];
    }
  }

  // 2. Detect Job Type (Only Free Job Ads categories allowed)
  let detectedType: string | null = null;
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
      updates.location = updates.location || "Singapore";
      updates.salaryCurrency = "SGD";
    } else {
      updates.salaryCurrency = "RM";
    }
  }

  // 3. Detect Salary
  const salStr = salaryMatch ? salaryMatch[1] : (lowerMsg.includes("rm") || lowerMsg.includes("sgd") || lowerMsg.includes("salary") || /\d{3,}/.test(msg) ? msg : "");
  if (salStr) {
    const numbers = salStr.replace(/,/g, '').match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      updates.salaryMin = numbers[0];
      updates.salaryMax = numbers[1];
    } else if (numbers && numbers.length === 1) {
      updates.salaryMin = numbers[0];
      updates.salaryMax = (parseInt(numbers[0]) * 1.4).toFixed(0);
    }
    if (salStr.toLowerCase().includes("sgd") || detectedType === "singapore" || currentType === "singapore") {
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

  const effectiveTitle = updates.title || currentTitle;
  const effectiveCompany = updates.company || currentCompany;
  const effectiveLocation = updates.location || currentLocation || "Petaling Jaya, Selangor";
  const effectiveType = updates.jobType || currentType || "internship";

  if (effectiveTitle) {
    const role = getRoleFallback(effectiveTitle, effectiveType);
    updates.responsibilities = role.responsibilities;
    updates.requirements = role.requirements;
    updates.skills = role.skills;
    updates.benefits = role.benefits;
    updates.description = `We are looking for a passionate ${effectiveTitle} to join ${effectiveCompany || 'our team'} in ${effectiveLocation}. You will play a key role in driving impactful work.`;
  }

  const actualType = updates.jobType || currentType;
  const actualSalaryMin = updates.salaryMin || currentJobData?.salaryMin;

  // Ask STEP 2: Job Type
  if (hasBasicNow && !actualType) {
    return {
      message: `Great! I've noted down **${effectiveTitle}** at **${effectiveCompany}** (${effectiveLocation}).

What is the **Job Type** for this role?
*(e.g. Internship, Part-time, Freelance, High Pay, Volunteer, Singapore Job)*`,
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

  // STEP 3 / All info completed -> Complete ad!
  const salDisplay = updates.salaryMin && updates.salaryMin !== "0"
    ? `${updates.salaryCurrency || 'RM'} ${updates.salaryMin} - ${updates.salaryMax} / ${updates.salaryPeriod || 'month'}`
    : currentJobData?.salaryMin && currentJobData?.salaryMin !== "0"
      ? `${currentJobData.salaryCurrency || 'RM'} ${currentJobData.salaryMin} - ${currentJobData.salaryMax} / ${currentJobData.salaryPeriod || 'month'}`
      : "Salary configured";

  return {
    message: `🎉 Great! I've prepared your complete job ad for **${effectiveTitle || 'this role'}** at **${effectiveCompany || 'your company'}** (${salDisplay})!

✨ **Tailored requirements, responsibilities, skills, and benefits** have been automatically generated.

You can preview the ad on the right or tell me if you'd like to refine anything!`,
    updates
  };
}

app.post('/api/chat', async (req, res) => {
  const { message, currentJobData } = req.body;
  try {
    const prompt = `
You are an AI assistant helping an employer create and refine a Malaysian job posting step-by-step.
The user just sent a message: "${message}"

Here is the current job data:
${JSON.stringify(currentJobData, null, 2)}

FREE JOB AD CATEGORIES ONLY:
The platform offers FREE job ads strictly for these 6 categories:
1. Internship
2. Part-time
3. Freelance
4. High Pay (> RM8,000)
5. Volunteer
6. Singapore Job (SGD)
(Do NOT offer standard Full-time).

STRICT CONVERSATIONAL STEP-BY-STEP WORKFLOW:
- Step 1: If Company Name, Job Title, or Location is provided, extract them. If Job Type is NOT yet specified in the current job data (it is "") or user message, YOU MUST reply asking Step 2:
  "Great! I've noted down **[Job Title]** at **[Company Name]** in **[Location]**.\n\nWhat is the **Job Type** for this role?\n*(e.g. Internship, Part-time, Freelance, High Pay, Volunteer, Singapore Job)*"
  (DO NOT skip to Step 3 or generate a completed ad yet!).

- Step 2: If Job Type is provided or exists. If Salary is NOT yet specified in the current job data (it is "") or user message, YOU MUST reply asking Step 3:
  "Got it, **[Job Type]**!\n\nWhat is the **Salary** or monthly allowance for this position?\n*(e.g. RM 3,000 - RM 4,500 / month, or Unpaid)*"
  (DO NOT conclude or finish yet!).

- Step 3: When Salary is provided or all 3 steps are complete (none of the fields are ""), generate the tailored job details and reply:
  "🎉 Great! I've generated your complete job ad for **[Job Title]** at **[Company Name]**! I have tailored the requirements, responsibilities, skills, and benefits. You can preview the ad on the right or tell me what to refine."

CRITICAL INSTRUCTIONS FOR JOB DETAILS GENERATION:
Whenever the Job Title is known:
1. Extract and map:
   - title: string
   - company: string
   - location: string
   - jobType: "internship" | "parttime" | "freelance" | "volunteer" | "singapore" | "highpay"
   - salaryMin: string (numeric string e.g. "1000")
   - salaryMax: string (numeric string e.g. "2000")
   - salaryPeriod: "monthly" | "hourly" | "none"
   - salaryCurrency: string (e.g. "RM" or "SGD")

2. AUTOMATICALLY GENERATE tailored content specifically matching the Job Title & Job Type:
   - responsibilities: array of 4 to 6 specific, actionable, professional duty bullet points directly relevant to this job title
   - requirements: array of 4 to 6 clear qualification/requirement bullet points tailored to this job title and role seniority
   - skills: array of 4 to 6 key technical and soft skill tags strictly matching this job title
   - benefits: array of 2 to 4 attractive benefits suitable for this role type
   - description: a concise 2-3 sentence overview introducing the role.

3. HANDLING REFINEMENT REQUESTS:
   - "Change better Requirement": Upgrade and refine 'requirements' with comprehensive qualifications.
   - "Better Responsibility": Upgrade and refine 'responsibilities' with impactful action verbs.
   - "Suggest skills": Provide 5-6 top industry-standard skill tags matching this role.
   - "Make it more attractive": Enhance description, company perks, and culture highlights.

Return valid JSON only in this format:
{
  "updates": { ...fields to update... },
  "message": "Assistant reply message with bold tags using **like this**"
}
`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    const fallbackResult = handleFallbackChat(message, currentJobData);
    res.json(fallbackResult);
  }
});

app.post('/api/suggest-skills', async (req, res) => {
  const { title, specialization, description } = req.body;
  try {
    const prompt = `
Suggest 5 relevant skills for a job with:
Title: ${title}
Specialization: ${specialization}
Description: ${description}

Return a JSON object with a 'skills' array of 5 strings.
`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{"skills":[]}';
    const result = JSON.parse(text);
    res.json(result);
  } catch (error) {
    const role = getRoleFallback(title, "fulltime");
    res.json({ skills: role.skills });
  }
});

app.post('/api/translate-skill', async (req, res) => {
  const { skill } = req.body;
  try {
    const prompt = `Translate the following skill into English if it is in Bahasa Malaysia or Mandarin. If it is already in English or another language, just return it as is. Do not provide any explanation, only the translated skill name:\n${skill}`;
    
    const response = await generateWithModelFallback({
      contents: prompt,
    });
    
    const text = response.text?.trim() || skill;
    res.json({ translated: text });
  } catch (error) {
    res.json({ translated: skill });
  }
});

app.post('/api/translate-job', async (req, res) => {
  const { requirements, responsibilities, benefits, targetLang } = req.body;
  try {
    const prompt = `Translate the following job description sections into ${targetLang}.
Return a JSON object containing the translated 'requirements' (array of strings), 'responsibilities' (array of strings), and 'benefits' (array of strings). Do not use markdown formatting.
Original Requirements: ${JSON.stringify(requirements)}
Original Responsibilities: ${JSON.stringify(responsibilities)}
Original Benefits: ${JSON.stringify(benefits)}`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error) {
    res.json({ requirements, responsibilities, benefits });
  }
});

app.post('/api/generate-all', async (req, res) => {
  const { currentJobData } = req.body;
  try {
    const prompt = `
Generate complete details for this job ad based on what we have so far:
${JSON.stringify(currentJobData, null, 2)}

Fill out 'requirements' (array of strings), 'responsibilities' (array of strings), and 'benefits' (array of strings).
Return a JSON object containing these 3 fields.
`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch (error) {
    const role = getRoleFallback(currentJobData?.title || "", currentJobData?.jobType || "fulltime");
    res.json({
      requirements: role.requirements,
      responsibilities: role.responsibilities,
      benefits: role.benefits
    });
  }
});

// Storage for job submissions
const submissions: Array<{
  submissionId: string;
  timestamp: string;
  jobData: any;
}> = [];

// Reliably forward a payload to a webhook with a timeout and retries.
// Returns true only when the destination actually accepts the request (HTTP 2xx/3xx).
// Google Apps Script responds with a 302 redirect to script.googleusercontent.com
// after doPost() has already executed, so a followed redirect ending in 2xx means success.
async function forwardWebhook(url: string, payload: unknown, label: string, attempts = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.ok) {
        console.log(`[${label}] Recorded successfully (HTTP ${resp.status}) on attempt ${attempt}`);
        return true;
      }
      console.warn(`[${label}] Non-OK response (HTTP ${resp.status}) on attempt ${attempt}`);
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[${label}] Request failed on attempt ${attempt}:`, err instanceof Error ? err.message : err);
    }
    if (attempt < attempts) {
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
  console.error(`[${label}] Failed to record after ${attempts} attempts`);
  return false;
}

app.post('/api/submit-job', async (req, res) => {
  try {
    const jobData = req.body;
    const submissionId = jobData.submissionId || `AJT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();
    
    const record = {
      submissionId,
      timestamp,
      jobData
    };
    
    submissions.push(record);

    // Sanitize phone number for Google Sheets:
    // In Google Sheets, a value starting with '+' (like +60123456789) is parsed as a mathematical formula, causing #ERROR! Formula parse error.
    // Prefixing with a single quote (') forces Google Sheets to store and display it as plain text without formula evaluation.
    const rawPhone = String(jobData.phone || '').trim();
    const safePhone = rawPhone ? (rawPhone.startsWith("'") ? rawPhone : `'${rawPhone}`) : '';

    // Forward to Webhooks asynchronously (Google Apps Script + Lark Base Automation)
    const scriptUrl = process.env.AIEDITOR || process.env.GOOGLE_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL;
    const larkWebhookUrl = process.env.LARK_WEBHOOK_URL || "https://ajobthing.sg.larksuite.com/base/automation/webhook/event/T5q1a7hPAwoVIwhGBI6lHaDNggd";

    const payload = {
      submissionId,
      timestamp,
      location: jobData.location,
      jobTitle: jobData.title,
      title: jobData.title,
      company: jobData.company,
      companyName: jobData.company,
      'Company Name': jobData.company,
      'Company': jobData.company,
      jobType: jobData.jobType,
      salary: `${jobData.salaryCurrency || 'RM'} ${jobData.salaryMin} - ${jobData.salaryMax} / ${jobData.salaryPeriod || 'month'}`,
      hiringCount: jobData.vacancies || "1",
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements.map((r: string) => `• ${r}`).join('\n') : (jobData.requirements || ''),
      responsibility: Array.isArray(jobData.responsibilities) ? jobData.responsibilities.map((r: string) => `• ${r}`).join('\n') : (jobData.responsibilities || ''),
      benefit: Array.isArray(jobData.benefits) ? jobData.benefits.join(', ') : (jobData.benefits || ''),
      skills: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : (jobData.skills || ''),
      email: jobData.email,
      phone: safePhone,
      contactEmail: jobData.email,
      contactPhone: safePhone,
      'Contact Email': jobData.email,
      'Contact Phone': safePhone,
      positionLevel: jobData.positionLevel || 'Entry Level',
      education: jobData.education || 'No Limit',
      experience: jobData.experience || 'No Experience',
      freshGraduates: jobData.freshGraduates ? 'Yes' : 'No',
      description: jobData.description
    };

    // Forward to both destinations and wait for confirmation so we can report
    // the true recording status instead of optimistically assuming success.
    const [sheetRecorded, larkRecorded] = await Promise.all([
      scriptUrl
        ? forwardWebhook(scriptUrl, payload, `Google Sheets ${submissionId}`)
        : Promise.resolve(false),
      larkWebhookUrl
        ? forwardWebhook(larkWebhookUrl, payload, `Lark ${submissionId}`)
        : Promise.resolve(false),
    ]);

    if (!scriptUrl) {
      console.warn('[Google Sheets] No Apps Script URL configured (AIEDITOR / GOOGLE_APPS_SCRIPT_URL).');
    }

    res.json({
      success: sheetRecorded || larkRecorded,
      submissionId,
      recordedAt: timestamp,
      sheetRecorded,
      larkRecorded
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Failed to record job submission' });
  }
});

app.get('/api/submissions', (req, res) => {
  res.json({ count: submissions.length, submissions });
});

async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      // Share the same HTTP server for Vite's HMR WebSocket so it uses the
      // exposed port instead of the default standalone port (24678), which is
      // not reachable in the preview and causes "WebSocket closed without opened".
      server: { middlewareMode: true, hmr: { server: httpServer } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
