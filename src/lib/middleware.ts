import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, JWTPayload } from './auth';

export function requireAuth(handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please provide a valid Bearer token.' 
      }, { status: 401 });
    }

    return handler(request, user);
  };
}

export function requireAuthWithParams(
  handler: (request: NextRequest, context: { params: Promise<Record<string, string>> }, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please provide a valid Bearer token.' 
      }, { status: 401 });
    }

    return handler(request, context, user);
  };
}
