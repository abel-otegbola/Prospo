import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Cookie cleared successfully' },
      { status: 200 }
    );

    // Clear the user cookie
    response.cookies.set({
      name: 'user',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear cookie', details: String(error) },
      { status: 500 }
    );
  }
}
