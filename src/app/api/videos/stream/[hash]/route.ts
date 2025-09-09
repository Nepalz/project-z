import { NextRequest, NextResponse } from 'next/server';

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

    // Redirect to primary IPFS gateway for video streaming
    const ipfsUrl = `https://ipfs.nepalz.xyz/api/ipfs/${hash}`;
    
    // For video streaming, we redirect to the IPFS gateway
    // The client can handle the video stream directly
    return NextResponse.redirect(ipfsUrl);

  } catch (error) {
    console.error('Video stream error:', error);
    return NextResponse.json({
      error: 'Failed to stream video',
      hash: params.hash
    }, { status: 500 });
  }
}
