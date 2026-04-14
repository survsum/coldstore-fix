// NextAuth is not used in this project.
// Admin auth: cookie-based (/api/admin/login)
// User auth:  custom JWT (/api/auth/user/*)
// This file exists only to prevent 404 on /api/auth/* calls.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Not configured' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ error: 'Not configured' }, { status: 404 });
}
