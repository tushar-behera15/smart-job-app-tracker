CREATE TABLE resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT,
  extracted_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);