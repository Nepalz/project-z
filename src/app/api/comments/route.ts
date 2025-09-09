import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get('video_id');
    
    const whereClause = video_id ? { video_id: parseInt(video_id) } : {};
    
    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
          }
        },
        video: {
          select: {
            id: true,
            caption: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { video_id, user_id, content } = await request.json();
    
    if (!video_id || !user_id || !content) {
      return NextResponse.json({ 
        error: 'video_id, user_id, and content are required' 
      }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        video_id: parseInt(video_id),
        user_id: parseInt(user_id),
        content,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
          }
        },
        video: {
          select: {
            id: true,
            caption: true,
          }
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
