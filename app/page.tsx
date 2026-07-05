import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { sql } from '@/lib/db';
import type { FileRecord } from '@/lib/db';
import FilesPage from '@/components/FilesPage';

export default async function Home() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login');
  }

  const files = await sql<FileRecord[]>`
    SELECT * FROM files ORDER BY upload_date DESC
  `;

  return <FilesPage files={files} />;
}
