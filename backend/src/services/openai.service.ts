// ❌ Remove if using Node 18+
// import fetch from "node-fetch";
import Bottleneck from "bottleneck";

export interface AnalysisResult {
  match_score: number;
  missing_skills: string[];
  suggestions: string[];
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

// =============================
// 🔹 RATE LIMITER (Gemini Free Tier: 15 RPM)
// =============================
const limiter = new Bottleneck({
  minTime: 6000, // 10 requests per minute (one every 6 seconds)
  maxConcurrent: 1
});



// =============================
// 🔹 MAIN FUNCTION
// =============================
export const analyzeResume = async (
  jobDescription: string,
  resumeText: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  // ✅ Normalize text (VERY IMPORTANT FIX)
  const cleanJD = normalizeText(jobDescription);
  const cleanResume = normalizeText(resumeText);

  try {
    const aiResult = await limiter.schedule(() => 
      analyzeWithGemini(apiKey, cleanJD, cleanResume)
    );

    // ✅ Fix AI mistakes (critical)
    aiResult.missing_skills = fixMissingSkills(
      aiResult.missing_skills,
      cleanResume
    );

    // ✅ Hybrid correction (fallback logic)
    const fallback = fallbackAnalysis(cleanJD, cleanResume);

    if (
      aiResult.match_score > 85 &&
      fallback.match_score < 60
    ) {
      return fallback;
    }

    return aiResult;

  } catch (error) {
    console.error("Gemini failed → using fallback:", error);
    return fallbackAnalysis(cleanJD, cleanResume);
  }
};



// =============================
// 🔹 GEMINI CALL
// =============================
const analyzeWithGemini = async (
  apiKey: string,
  jobDescription: string,
  resumeText: string
): Promise<AnalysisResult> => {
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = buildPrompt(jobDescription, resumeText);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.3
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty Gemini response");
  }

  return safeParseJSON(text);
};



// =============================
// 🔹 PROMPT (FIXED VERSION)
// =============================
const buildPrompt = (jd: string, resume: string) => `
You are a strict ATS (Applicant Tracking System).

IMPORTANT RULES:
- Extract skills EXACTLY from resume text.
- If a skill exists → DO NOT include in missing_skills.
- Treat "node" and "node.js" as SAME.
- Treat "express" and "express.js" as SAME.
- Be strict and realistic (NO fake perfect scores).

SCORING:
- 80-100 → strong match
- 50-79 → partial match
- 20-49 → weak match
- 0-19 → no match

Return ONLY JSON:
{
  "match_score": number,
  "missing_skills": string[],
  "suggestions": string[]
}

JOB DESCRIPTION:
${jd}

RESUME:
${resume}
`;



// =============================
// 🔹 TEXT NORMALIZATION
// =============================
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\.js/g, "")        // express.js → express
    .replace(/,/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
};



// =============================
// 🔹 FIX AI MISSING SKILLS
// =============================
const fixMissingSkills = (
  missing: string[],
  resume: string
): string[] => {
  return missing.filter(skill => {
    const normalized = skill.toLowerCase().replace(".js", "");
    return !resume.includes(normalized);
  });
};



// =============================
// 🔹 SAFE JSON PARSER
// =============================
const safeParseJSON = (text: string): AnalysisResult => {
  try {
    const result = JSON.parse(text);

    return {
      match_score: clampScore(result.match_score),
      missing_skills: Array.isArray(result.missing_skills)
        ? result.missing_skills
        : [],
      suggestions: Array.isArray(result.suggestions)
        ? result.suggestions
        : [],
    };
  } catch {
    throw new Error("Invalid JSON from AI");
  }
};



// =============================
// 🔹 SCORE SAFETY
// =============================
const clampScore = (score: number): number => {
  if (typeof score !== "number") return 0;
  return Math.max(0, Math.min(100, score));
};



// =============================
// 🔹 FALLBACK LOGIC
// =============================
const fallbackAnalysis = (
  jobDescription: string,
  resumeText: string
): AnalysisResult => {
  const jobWords = new Set(jobDescription.match(/\w+/g) || []);
  const resumeWords = new Set(resumeText.match(/\w+/g) || []);

  const commonSkills = [
    "javascript",
    "typescript",
    "node",
    "express",
    "postgresql",
    "docker",
    "react",
    "angular",
    "aws",
  ];

  const skillsInJob = commonSkills.filter(skill => jobWords.has(skill));
  const missing = skillsInJob.filter(skill => !resumeWords.has(skill));

  const score = Math.max(0, 100 - missing.length * 15);

  return {
    match_score: score,
    missing_skills: missing,
    suggestions: missing.map(s => `Add ${s} to your resume`),
  };
};