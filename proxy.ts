import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSession } from '@/lib/session';

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const validSession = await verifyAdminSession(
      request.cookies.get('admin_session')?.value,
    );
    if (!validSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
