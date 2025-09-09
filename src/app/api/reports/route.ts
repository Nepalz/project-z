import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getAuthenticatedUser } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get('video_id');
    const user_id = searchParams.get('user_id');
    
    const whereClause: { video_id?: number; user_id?: number } = {};
    if (video_id) whereClause.video_id = parseInt(video_id);
    if (user_id) whereClause.user_id = parseInt(user_id);
    
    const reports = await prisma.report.findMany({
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
            user: {
              select: {
                user_id: true,
                username: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(reports);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
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

    const { video_id, reason } = await request.json();
    
    if (!video_id || !reason) {
      return NextResponse.json({ 
        error: 'video_id and reason are required' 
      }, { status: 400 });
    }

    // Check if user has already reported this video
    const existingReport = await prisma.report.findUnique({
      where: {
        video_id_user_id: {
          video_id: parseInt(video_id),
          user_id: user.user_id,
        }
      }
    });

    if (existingReport) {
      return NextResponse.json({ 
        error: 'User has already reported this video' 
      }, { status: 409 });
    }

    const report = await prisma.report.create({
      data: {
        video_id: parseInt(video_id),
        user_id: user.user_id, // Use authenticated user's ID
        reason,
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
            user: {
              select: {
                user_id: true,
                username: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
