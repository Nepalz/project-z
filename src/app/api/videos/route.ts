import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            dislikes: true,
            reports: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, hash, caption, tags } = await request.json();
    
    if (!user_id || !hash) {
      return NextResponse.json({ error: 'user_id and hash are required' }, { status: 400 });
    }

    const video = await prisma.video.create({
      data: {
        user_id: parseInt(user_id),
        hash,
        caption: caption || null,
        tags: tags || [],
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
          }
        }
      }
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}
