import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // If it's an API watch request, rewrite to the catch-all
  if (url.pathname.startsWith('/api/watch/')) {
    // Keep the full path but force it through serverless
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/watch/:path*',
};
