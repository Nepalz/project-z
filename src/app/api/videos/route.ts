import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getAuthenticatedUser } from '../../../lib/auth';
import { getIPFSUrls } from '../../../lib/ipfs';

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

    // Add IPFS URLs to each video
    const videosWithIPFS = videos.map(video => ({
      ...video,
      ipfs: {
        hash: video.hash,
        accessUrls: getIPFSUrls(video.hash),
      }
    }));

    return NextResponse.json(videosWithIPFS);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please provide a valid Bearer token.' 
      }, { status: 401 });
    }

    const { hash, caption, tags } = await request.json();
    
    if (!hash) {
      return NextResponse.json({ 
        error: 'IPFS hash is required. Use /api/videos/upload to upload video files.' 
      }, { status: 400 });
    }

    // Validate IPFS hash format (basic check)
    if (!hash.startsWith('Qm') && !hash.startsWith('bafyb')) {
      return NextResponse.json({ 
        error: 'Invalid IPFS hash format. Hash should start with "Qm" or "bafyb".' 
      }, { status: 400 });
    }

    // Check if video with this hash already exists
    const existingVideo = await prisma.video.findUnique({
      where: { hash }
    });

    if (existingVideo) {
      return NextResponse.json({ 
        error: 'Video with this IPFS hash already exists' 
      }, { status: 409 });
    }

    const video = await prisma.video.create({
      data: {
        user_id: user.user_id,
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

    // Add IPFS URLs
    const videoWithIPFS = {
      ...video,
      ipfs: {
        hash: video.hash,
        accessUrls: getIPFSUrls(video.hash),
      }
    };

    return NextResponse.json(videoWithIPFS, { status: 201 });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}
