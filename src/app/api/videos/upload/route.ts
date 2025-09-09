import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAuthenticatedUser } from '../../../../lib/auth';
import { uploadToIPFS, getIPFSUrls } from '../../../../lib/ipfs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please provide a valid Bearer token.' 
      }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;
    const caption = formData.get('caption') as string;
    const tagsString = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ 
        error: 'Video file is required' 
      }, { status: 400 });
    }

    // Validate file type (videos only)
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ 
        error: 'Only video files are allowed' 
      }, { status: 400 });
    }

    // Validate file size (max 100MB as per IPFS service)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'Video file size must be less than 100MB' 
      }, { status: 400 });
    }

    console.log(`Uploading video: ${file.name} (${file.size} bytes, ${file.type})`);

    // Convert file to buffer for IPFS upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to IPFS
    const ipfsResult = await uploadToIPFS(buffer, file.name, file.type);

    if (!ipfsResult.success || !ipfsResult.file) {
      return NextResponse.json({ 
        error: 'Failed to upload video to IPFS: ' + (ipfsResult.error || 'Unknown error')
      }, { status: 500 });
    }

    // Parse tags
    let tags: string[] = [];
    if (tagsString) {
      try {
        tags = JSON.parse(tagsString);
      } catch {
        // If parsing fails, treat as comma-separated string
        tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    // Save video metadata to database
    const video = await prisma.video.create({
      data: {
        user_id: user.user_id,
        hash: ipfsResult.file.ipfsHash,
        caption: caption || null,
        tags: tags,
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

    // Get all access URLs
    const accessUrls = getIPFSUrls(ipfsResult.file.ipfsHash);

    return NextResponse.json({
      message: 'Video uploaded successfully to IPFS',
      video: {
        id: video.id,
        hash: video.hash,
        caption: video.caption,
        tags: video.tags,
        createdAt: video.createdAt,
        user: video.user,
        ipfs: {
          hash: ipfsResult.file.ipfsHash,
          size: ipfsResult.file.size,
          originalName: ipfsResult.file.originalName,
          mimetype: ipfsResult.file.mimetype,
          accessUrls: {
            primary: accessUrls.primary,
            ipfsIo: accessUrls.ipfsIo,
            cloudflare: accessUrls.cloudflare,
            dweb: accessUrls.dweb,
            torNetwork: accessUrls.torNetwork,
          },
          gatewayUrl: ipfsResult.file.gatewayUrl,
          link: ipfsResult.file.link,
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload video', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
