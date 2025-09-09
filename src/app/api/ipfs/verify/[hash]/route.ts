import { NextRequest, NextResponse } from 'next/server';
import { verifyIPFSHash, getIPFSMediaInfo, getIPFSUrls } from '../../../../../lib/ipfs';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const { hash } = params;

    if (!hash) {
      return NextResponse.json({ 
        error: 'IPFS hash is required' 
      }, { status: 400 });
    }

    // Verify if hash is accessible and get media info
    const [isAccessible, mediaInfo] = await Promise.all([
      verifyIPFSHash(hash),
      getIPFSMediaInfo(hash)
    ]);

    const accessUrls = getIPFSUrls(hash);

    return NextResponse.json({
      hash,
      accessible: isAccessible,
      mediaInfo: mediaInfo.success ? mediaInfo.media : null,
      accessUrls,
      status: isAccessible ? 'available' : 'not_accessible',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('IPFS verification error:', error);
    return NextResponse.json({
      hash: params.hash,
      accessible: false,
      error: error instanceof Error ? error.message : 'Verification failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
