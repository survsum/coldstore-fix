import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = body.password || '';

    if (email === 'admin@store.com' && password === 'admin123') {
      const res = NextResponse.json({ success: true });
      res.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return res;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
