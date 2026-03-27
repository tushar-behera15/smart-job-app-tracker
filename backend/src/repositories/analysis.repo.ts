import { pool } from "../config/db";

export interface AnalysisResult {
  id?: number;
  job_id: number;
  resume_id: number;
  match_score: number;
  missing_skills: string[];
  suggestions: string[];
  created_at?: Date;
}

export const createAnalysisResult = async (result: Omit<AnalysisResult, "id" | "created_at">): Promise<AnalysisResult> => {
  const query = `
    INSERT INTO analysis_results (job_id, resume_id, match_score, missing_skills, suggestions)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [
    result.job_id,
    result.resume_id,
    result.match_score,
    result.missing_skills,
    result.suggestions,
  ];
  const dbResult = await pool.query(query, values);
  return dbResult.rows[0];
};

export const getAnalysisByJobId = async (jobId: number): Promise<AnalysisResult[]> => {
  const result = await pool.query(
    "SELECT * FROM analysis_results WHERE job_id = $1 ORDER BY created_at DESC",
    [jobId]
  );
  return result.rows;
};
