import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get('video_id');
    const user_id = searchParams.get('user_id');
    
    let whereClause: any = {};
    if (video_id) whereClause.video_id = parseInt(video_id);
    if (user_id) whereClause.user_id = parseInt(user_id);
    
    const dislikes = await prisma.dislike.findMany({
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
            hash: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(dislikes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dislikes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { video_id, user_id } = await request.json();
    
    if (!video_id || !user_id) {
      return NextResponse.json({ 
        error: 'video_id and user_id are required' 
      }, { status: 400 });
    }

    // Check if dislike already exists
    const existingDislike = await prisma.dislike.findUnique({
      where: {
        video_id_user_id: {
          video_id: parseInt(video_id),
          user_id: parseInt(user_id),
        }
      }
    });

    if (existingDislike) {
      return NextResponse.json({ 
        error: 'User has already disliked this video' 
      }, { status: 409 });
    }

    // Remove like if exists (user switching from like to dislike)
    await prisma.like.deleteMany({
      where: {
        video_id: parseInt(video_id),
        user_id: parseInt(user_id),
      }
    });

    const dislike = await prisma.dislike.create({
      data: {
        video_id: parseInt(video_id),
        user_id: parseInt(user_id),
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
            hash: true,
          }
        }
      }
    });

    return NextResponse.json(dislike, { status: 201 });
  } catch (error) {
    console.error('Create dislike error:', error);
    return NextResponse.json({ error: 'Failed to create dislike' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get('video_id');
    const user_id = searchParams.get('user_id');
    
    if (!video_id || !user_id) {
      return NextResponse.json({ 
        error: 'video_id and user_id are required' 
      }, { status: 400 });
    }

    const deletedDislike = await prisma.dislike.deleteMany({
      where: {
        video_id: parseInt(video_id),
        user_id: parseInt(user_id),
      }
    });

    if (deletedDislike.count === 0) {
      return NextResponse.json({ 
        error: 'Dislike not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ message: 'Dislike removed successfully' });
  } catch (error) {
    console.error('Delete dislike error:', error);
    return NextResponse.json({ error: 'Failed to remove dislike' }, { status: 500 });
  }
}
