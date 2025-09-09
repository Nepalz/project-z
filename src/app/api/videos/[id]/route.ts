import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);
    
    if (isNaN(videoId)) {
      return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
          }
        },
        comments: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        likes: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
              }
            }
          }
        },
        dislikes: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
              }
            }
          }
        },
        reports: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
              }
            }
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
      }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);
    
    if (isNaN(videoId)) {
      return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
    }

    const deletedVideo = await prisma.video.delete({
      where: { id: videoId }
    });

    return NextResponse.json({ 
      message: 'Video deleted successfully',
      deletedVideo: {
        id: deletedVideo.id,
        hash: deletedVideo.hash
      }
    });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
