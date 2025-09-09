import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { comparePassword, generateToken } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ 
        error: 'Username and password are required' 
      }, { status: 400 });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        user_id: true,
        username: true,
        password: true,
      }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid username or password' 
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ 
        error: 'Invalid username or password' 
      }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
