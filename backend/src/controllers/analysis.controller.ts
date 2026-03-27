import { Response } from "express";
import * as jobRepo from "../repositories/job.repo";
import * as resumeRepo from "../repositories/resume.repo";
import * as analysisRepo from "../repositories/analysis.repo";
import { analyzeResume } from "../services/openai.service";

export const runAnalysis = async (req: any, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // 1. Fetch Job
    const job = await jobRepo.findJobById(Number(jobId), userId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Fetch Latest Resume
    const resume = await resumeRepo.getLatestResumeByUserId(userId);
    if (!resume) {
      return res.status(404).json({ message: "No resume found. Please upload one first." });
    }

    // 3. Run AI Analysis
    const analysisResult = await analyzeResume(job.description, resume.extracted_text);

    // 4. Save analysis result to DB
    const savedResult = await analysisRepo.createAnalysisResult({
      job_id: job.id as number,
      resume_id: resume.id as number,
      match_score: analysisResult.match_score,
      missing_skills: analysisResult.missing_skills,
      suggestions: analysisResult.suggestions,
    });

    res.json(savedResult);
  } catch (error: any) {
    console.error("Analysis Controller Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
