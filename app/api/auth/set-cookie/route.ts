import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing uid or email' },
        { status: 400 }
      );
    }

    // Create response with user cookie
    const response = NextResponse.json(
      { success: true, message: 'Cookie set successfully' },
      { status: 200 }
    );

    // Set HTTP-only secure cookie that expires in 7 days
    response.cookies.set({
      name: 'user',
      value: JSON.stringify({ uid, email }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set cookie', details: String(error) },
      { status: 500 }
    );
  }
}
