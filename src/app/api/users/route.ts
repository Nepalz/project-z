import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { generateUniqueUsername } from '../../../lib/username-generator';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        username: true,
        createdAt: true,
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Generate unique revolutionary username
    const username = await generateUniqueUsername(prisma);

    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
      select: {
        user_id: true,
        username: true,
        createdAt: true,
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
