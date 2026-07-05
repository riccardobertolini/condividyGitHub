import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export { sql };

export interface FileRecord {
  id: string;
  name: string;
  original_name: string;
  size: number;
  mime_type: string;
  url: string;
  upload_date: string;
  download_count: number;
}
