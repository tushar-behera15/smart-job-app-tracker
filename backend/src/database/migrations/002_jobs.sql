CREATE TYPE job_status AS ENUM ('applied', 'interview', 'offer', 'rejected');
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  status job_status DEFAULT 'applied',
  created_at TIMESTAMP DEFAULT NOW()
);