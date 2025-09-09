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
    
    const likes = await prisma.like.findMany({
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
    
    return NextResponse.json(likes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
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

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        video_id_user_id: {
          video_id: parseInt(video_id),
          user_id: parseInt(user_id),
        }
      }
    });

    if (existingLike) {
      return NextResponse.json({ 
        error: 'User has already liked this video' 
      }, { status: 409 });
    }

    // Remove dislike if exists (user switching from dislike to like)
    await prisma.dislike.deleteMany({
      where: {
        video_id: parseInt(video_id),
        user_id: parseInt(user_id),
      }
    });

    const like = await prisma.like.create({
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

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error('Create like error:', error);
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 });
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

    const deletedLike = await prisma.like.deleteMany({
      where: {
        video_id: parseInt(video_id),
        user_id: parseInt(user_id),
      }
    });

    if (deletedLike.count === 0) {
      return NextResponse.json({ 
        error: 'Like not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Delete like error:', error);
    return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 });
  }
}
