import { pool } from "../config/db";

export interface Job {
  id?: number;
  user_id: number;
  company: string;
  role: string;
  description: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  created_at?: Date;
}

export const createJob = async (job: Omit<Job, "id" | "created_at">): Promise<Job> => {
  const result = await pool.query(
    `INSERT INTO jobs (user_id, company, role, description, status) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [job.user_id, job.company, job.role, job.description, job.status || 'applied']
  );
  return result.rows[0];
};

export const getAllJobs = async (userId: number): Promise<Job[]> => {
  const result = await pool.query(
    "SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

export const updateJob = async (id: number, userId: number, job: Partial<Omit<Job, "id" | "user_id" | "created_at">>): Promise<Job | null> => {
  const fields = Object.keys(job);
  if (fields.length === 0) return null;

  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
  const values = Object.values(job);

  const result = await pool.query(
    `UPDATE jobs SET ${setClause} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`,
    [...values, id, userId]
  );
  return result.rows[0] || null;
};

export const deleteJob = async (id: number, userId: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM jobs WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
};

export const findJobById = async (id: number, userId: number): Promise<Job | null> => {
  const result = await pool.query(
    "SELECT * FROM jobs WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return result.rows[0] || null;
};
