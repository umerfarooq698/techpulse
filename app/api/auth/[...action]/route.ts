import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, createSessionToken, setAuthCookie, removeAuthCookie, getAuthSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { action: string[] } }) {
  const action = params.action?.[0];

  if (action === 'login') {
    try {
      const { email, password } = await req.json();
      const user = await db.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const token = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as any,
      });

      await setAuthCookie(token);

      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Login failed' }, { status: 500 });
    }
  }

  if (action === 'logout') {
    await removeAuthCookie();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Action not found' }, { status: 404 });
}

export async function GET(req: NextRequest, { params }: { params: { action: string[] } }) {
  const action = params.action?.[0];

  if (action === 'me') {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, user: session });
  }

  return NextResponse.json({ error: 'Action not found' }, { status: 404 });
}
