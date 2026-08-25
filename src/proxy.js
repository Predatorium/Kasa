import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('token');

  return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
  matcher: '/',
};