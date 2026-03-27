import { Response } from "express";
import { z } from "zod";
import * as jobRepo from "../repositories/job.repo";

const jobSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["applied", "interview", "offer", "rejected"]).optional(),
});

export const createJob = async (req: any, res: Response) => {
  try {
    const validatedData = jobSchema.parse(req.body);
    const userId = req.user.id;

    const job = await jobRepo.createJob({
      ...validatedData,
      user_id: userId,
      status: validatedData.status || "applied",
    });

    res.status(201).json(job);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getJobs = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const jobs = await jobRepo.getAllJobs(userId);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateJob = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const validatedData = jobSchema.partial().parse(req.body);

    const updatedJob = await jobRepo.updateJob(Number(id), userId, validatedData);
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.json(updatedJob);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteJob = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const success = await jobRepo.deleteJob(Number(id), userId);
    if (!success) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
