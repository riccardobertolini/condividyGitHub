const { neon } = require('@neondatabase/serverless');

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  
  await sql`
    CREATE TABLE IF NOT EXISTS files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      size BIGINT NOT NULL,
      mime_type TEXT NOT NULL,
      url TEXT NOT NULL,
      upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      download_count INTEGER NOT NULL DEFAULT 0
    )
  `;
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
