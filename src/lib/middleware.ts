import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from './auth';

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
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
  handler: (request: NextRequest, context: any, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: any) => {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please provide a valid Bearer token.' 
      }, { status: 401 });
    }

    return handler(request, context, user);
  };
}
