import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const correctPassword = process.env.APP_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: 'Password errata' }, { status: 401 });
  }

  await setSession();
  return NextResponse.json({ ok: true });
}
