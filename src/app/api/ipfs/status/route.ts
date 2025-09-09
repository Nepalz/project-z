import { NextResponse } from 'next/server';
import { checkIPFSHealth, getIPFSStats } from '../../../../lib/ipfs';

export async function GET() {
  try {
    // Check IPFS service health and get stats
    const [healthCheck, stats] = await Promise.all([
      checkIPFSHealth(),
      getIPFSStats()
    ]);

    return NextResponse.json({
      service: {
        name: 'IPFS Video Storage Service',
        url: 'https://ipfs.nepalz.xyz',
        torUrl: 'http://6hfckp4suncoyum2dhvspm36m7bx2ga5gb4atlprw56sqdxa5qgw2zyd.onion',
        health: healthCheck,
        stats: stats.success ? stats.stats : null,
      },
      endpoints: {
        upload: '/api/videos/upload',
        primaryAccess: 'https://ipfs.nepalz.xyz/api/ipfs/{hash}',
        globalIPFS: 'https://ipfs.io/ipfs/{hash}',
        cloudflare: 'https://cloudflare-ipfs.com/ipfs/{hash}',
        dweb: 'https://dweb.link/ipfs/{hash}',
        torNetwork: 'http://6hfckp4suncoyum2dhvspm36m7bx2ga5gb4atlprw56sqdxa5qgw2zyd.onion/api/ipfs/{hash}'
      },
      limits: {
        maxFileSize: '100MB',
        supportedTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/webm', 'video/mkv', 'video/flv'],
        features: ['Decentralized storage', 'Global access', 'Permanent hosting', 'Anonymous upload via Tor']
      }
    });
  } catch (error) {
    console.error('IPFS status error:', error);
    return NextResponse.json({
      service: {
        name: 'IPFS Video Storage Service',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
