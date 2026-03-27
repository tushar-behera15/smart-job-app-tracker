import { pool } from "../config/db";
import fs from "fs";
import path from "path";

const migrate = async () => {
  try {
    const migrationsPath = path.join(__dirname, "migrations");

    // 1. Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Get executed migrations
    const result = await pool.query("SELECT filename FROM migrations");
    const executedFiles = result.rows.map((row) => row.filename);

    // 3. Read all migration files
    const files = fs.readdirSync(migrationsPath).sort();

    for (const file of files) {
      if (executedFiles.includes(file)) {
        console.log(`Skipping ${file} (already executed)`);
        continue;
      }

      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Running ${file}...`);

      await pool.query(sql);

      // 4. Save migration record
      await pool.query(
        "INSERT INTO migrations (filename) VALUES ($1)",
        [file]
      );

      console.log(`Executed ${file} ✅`);
    }

    console.log("All migrations done 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed ❌", error);
    process.exit(1);
  }
};

migrate();