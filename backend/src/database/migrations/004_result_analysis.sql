CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  missing_skills TEXT[],
  suggestions TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);