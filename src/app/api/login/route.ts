import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Set a session cookie
    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Set-Cookie': `isAdmin=true; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
      }
    );
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
