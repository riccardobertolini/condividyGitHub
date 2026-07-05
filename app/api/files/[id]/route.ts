import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { sql } from '@/lib/db';
import { del, getDownloadUrl } from '@vercel/blob';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const rows = await sql`SELECT url FROM files WHERE id = ${id}`;
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await del(rows[0].url);
  await sql`DELETE FROM files WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const rows = await sql`SELECT url FROM files WHERE id = ${id}`;
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const downloadUrl = await getDownloadUrl(rows[0].url);

  await sql`UPDATE files SET download_count = download_count + 1 WHERE id = ${id}`;

  return NextResponse.json({ ok: true, downloadUrl });
}
