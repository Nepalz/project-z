import { NextRequest, NextResponse } from 'next/server';
import { getDemoPosts } from '../../../lib/demo-storage';

export async function GET() {
  try {
    const posts = getDemoPosts();
    
    // Convert posts to video format for compatibility
    const videos = posts
      .filter(post => post.mediaType === 'video')
      .map(post => ({
        id: post.id,
        hash: post.id, // Using post ID as hash for demo
        caption: post.content,
        tags: [],
        user: {
          user_id: 1,
          username: post.username,
        },
        createdAt: new Date(post.timestamp).toISOString(),
        _count: {
          comments: 0,
          likes: post.likes,
          dislikes: post.dislikes,
          reports: post.reports,
        },
        ipfs: {
          hash: post.id,
          accessUrls: {
            gateway: post.mediaHash || '', // base64 data for demo
            ipfs: post.mediaHash || '',
            local: post.mediaHash || '',
          },
        }
      }));
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Fetch videos error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // For demo purposes, just return success
    const newVideo = {
      id: Date.now(),
      hash,
      caption: caption || null,
      tags: tags || [],
      user: {
        user_id: 1,
        username: 'demo_user',
      },
      createdAt: new Date().toISOString(),
      _count: {
        comments: 0,
        likes: 0,
        dislikes: 0,
        reports: 0,
      },
      ipfs: {
        hash: hash,
        accessUrls: {
          gateway: `https://gateway.pinata.cloud/ipfs/${hash}`,
          ipfs: `https://ipfs.io/ipfs/${hash}`,
          local: `http://localhost:8080/ipfs/${hash}`,
        },
      }
    };

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}