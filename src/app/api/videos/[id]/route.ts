import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getIPFSUrls } from '../../../../lib/ipfs';
import { getAuthenticatedUser } from '../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videoId = parseInt(id);
    
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

    // Add IPFS URLs
    const videoWithIPFS = {
      ...video,
      ipfs: {
        hash: video.hash,
        accessUrls: getIPFSUrls(video.hash),
      }
    };

    return NextResponse.json(videoWithIPFS);
  } catch (error) {
    console.error('Get video error:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videoId = parseInt(id);
    
    if (isNaN(videoId)) {
      return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
    }

    // Get video before deletion to check ownership
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: {
        id: true,
        hash: true,
        user_id: true,
        user: {
          select: {
            username: true
          }
        }
      }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Check if user is authenticated and owns the video
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required to delete videos' 
      }, { status: 401 });
    }

    if (user.user_id !== video.user_id) {
      return NextResponse.json({ 
        error: 'You can only delete your own videos' 
      }, { status: 403 });
    }

    // Delete video from database (IPFS files remain permanent)
    const deletedVideo = await prisma.video.delete({
      where: { id: videoId }
    });

    return NextResponse.json({ 
      message: 'Video deleted from database successfully',
      note: 'IPFS files remain permanently stored on the network',
      deletedVideo: {
        id: deletedVideo.id,
        hash: deletedVideo.hash,
        ipfsNote: 'Video still accessible via IPFS hash: ' + deletedVideo.hash
      }
    });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
