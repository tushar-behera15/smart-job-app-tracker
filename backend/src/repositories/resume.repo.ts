import { pool } from "../config/db";

export interface Resume {
  id?: number;
  user_id: number;
  file_name: string;
  extracted_text: string;
  created_at?: Date;
}

export const createResume = async (resume: Omit<Resume, "id" | "created_at">): Promise<Resume> => {
  const result = await pool.query(
    "INSERT INTO resumes (user_id, file_name, extracted_text) VALUES ($1, $2, $3) RETURNING *",
    [resume.user_id, resume.file_name, resume.extracted_text]
  );
  return result.rows[0];
};

export const findResumeById = async (id: number, userId: number): Promise<Resume | null> => {
  const result = await pool.query(
    "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return result.rows[0] || null;
};

export const getLatestResumeByUserId = async (userId: number): Promise<Resume | null> => {
  const result = await pool.query(
    "SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
    [userId]
  );
  return result.rows[0] || null;
};
