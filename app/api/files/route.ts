import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { sql } from '@/lib/db';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await sql`SELECT * FROM files ORDER BY upload_date DESC`;
  return NextResponse.json(files);
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const uniqueName = `${uuidv4()}.${ext}`;

  const blob = await put(uniqueName, file, {
    access: 'private',
  });

  await sql`
    INSERT INTO files (name, original_name, size, mime_type, url)
    VALUES (${uniqueName}, ${file.name}, ${file.size}, ${file.type}, ${blob.url})
  `;

  return NextResponse.json({ ok: true, url: blob.url });
}
