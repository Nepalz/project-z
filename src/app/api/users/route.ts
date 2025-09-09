import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { generateUniqueUsername } from '../../../lib/username-generator';
import { hashPassword, generateToken } from '../../../lib/auth';

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

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Generate unique revolutionary username
    const username = await generateUniqueUsername(prisma);

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        user_id: true,
        username: true,
        createdAt: true,
      }
    });

    // Generate token for immediate login after registration
    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
    });

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        createdAt: user.createdAt,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
