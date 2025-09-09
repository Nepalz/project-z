import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getIPFSMediaInfo, getIPFSUrls } from '../../../../../lib/ipfs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;

    if (!hash) {
      return NextResponse.json({ 
        error: 'IPFS hash is required' 
      }, { status: 400 });
    }

    // Get video from our database
    const video = await prisma.video.findUnique({
      where: { hash },
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
      }
    });

    // Get IPFS media info
    const ipfsMediaInfo = await getIPFSMediaInfo(hash);

    if (!video && !ipfsMediaInfo.success) {
      return NextResponse.json({ 
        error: 'Video not found in database or IPFS network' 
      }, { status: 404 });
    }

    // Get IPFS access URLs
    const accessUrls = getIPFSUrls(hash);

    const response = {
      hash,
      database: video ? {
        id: video.id,
        caption: video.caption,
        tags: video.tags,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        user: video.user,
        stats: video._count,
      } : null,
      ipfs: ipfsMediaInfo.success ? {
        originalFilename: ipfsMediaInfo.media?.original_filename,
        fileSize: ipfsMediaInfo.media?.file_size,
        mimeType: ipfsMediaInfo.media?.mime_type,
        uploadDate: ipfsMediaInfo.media?.upload_date,
        accessCount: ipfsMediaInfo.media?.access_count,
        lastAccessed: ipfsMediaInfo.media?.last_accessed,
        fileExtension: ipfsMediaInfo.media?.file_extension,
      } : null,
      accessUrls,
      available: {
        inDatabase: !!video,
        onIPFS: ipfsMediaInfo.success,
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Video metadata error:', error);
    return NextResponse.json({
      hash: 'unknown',
      error: error instanceof Error ? error.message : 'Failed to get metadata'
    }, { status: 500 });
  }
}
