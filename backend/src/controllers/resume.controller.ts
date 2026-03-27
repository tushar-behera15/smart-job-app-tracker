import { Response } from "express";
const { PDFParse } = require("pdf-parse");
import * as resumeRepo from "../repositories/resume.repo";

export const uploadResume = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const fileName = req.file.originalname;

    // Extract text using the PDFParse class (specific to pdf-parse v2.4.5+)
    const parser = new PDFParse({ data: req.file.buffer });
    const data = await parser.getText();
    const extractedText = data.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from PDF" });
    }

    const resume = await resumeRepo.createResume({
      user_id: userId,
      file_name: fileName,
      extracted_text: extractedText,
    });

    res.status(201).json({
      message: "Resume uploaded and text extracted successfully",
      resumeId: resume.id,
      fileName: resume.file_name,
    });
  } catch (error: any) {
    console.error("Resume upload error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getLatestResume = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const resume = await resumeRepo.getLatestResumeByUserId(userId);
    
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    res.json(resume);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
