import FormData from 'form-data';

const IPFS_SERVICE_URL = 'https://ipfs.nepalz.xyz';

export interface IPFSUploadResponse {
  success: boolean;
  file?: {
    id: number;
    originalName: string;
    size: number;
    mimetype: string;
    ipfsHash: string;
    link: {
      id: string;
      url: string;
      ipfsUrl: string;
      hash: string;
      filename: string;
    };
    gatewayUrl: string;
  };
  error?: string;
}

export interface IPFSMediaInfo {
  success: boolean;
  media?: {
    id: number;
    ipfs_hash: string;
    original_filename: string;
    file_size: number;
    mime_type: string;
    upload_date: string;
    access_count: number;
    last_accessed: string | null;
    user_ip: string;
    file_extension: string;
    metadata: any;
  };
  error?: string;
}

/**
 * Upload a file buffer to IPFS
 */
export async function uploadToIPFS(
  fileBuffer: Buffer, 
  filename: string, 
  mimetype: string
): Promise<IPFSUploadResponse> {
  try {
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename,
      contentType: mimetype,
    });

    const response = await fetch(`${IPFS_SERVICE_URL}/api/upload`, {
      method: 'POST',
      body: form as any,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('IPFS upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Get file information from IPFS service
 */
export async function getIPFSMediaInfo(ipfsHash: string): Promise<IPFSMediaInfo> {
  try {
    const response = await fetch(`${IPFS_SERVICE_URL}/api/media/info/${ipfsHash}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('IPFS media info error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get media info'
    };
  }
}

/**
 * Get IPFS file access URLs
 */
export function getIPFSUrls(ipfsHash: string) {
  return {
    primary: `${IPFS_SERVICE_URL}/api/ipfs/${ipfsHash}`,
    ipfsIo: `https://ipfs.io/ipfs/${ipfsHash}`,
    cloudflare: `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
    dweb: `https://dweb.link/ipfs/${ipfsHash}`,
    torNetwork: `http://6hfckp4suncoyum2dhvspm36m7bx2ga5gb4atlprw56sqdxa5qgw2zyd.onion/api/ipfs/${ipfsHash}`
  };
}

/**
 * Verify if an IPFS hash is accessible
 */
export async function verifyIPFSHash(ipfsHash: string): Promise<boolean> {
  try {
    const response = await fetch(`${IPFS_SERVICE_URL}/api/ipfs/${ipfsHash}`, {
      method: 'HEAD', // Only check if file exists, don't download
    });
    
    return response.ok;
  } catch (error) {
    console.error('IPFS verification error:', error);
    return false;
  }
}

/**
 * Get IPFS service statistics
 */
export async function getIPFSStats() {
  try {
    const response = await fetch(`${IPFS_SERVICE_URL}/api/media/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('IPFS stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats'
    };
  }
}

/**
 * Check IPFS service health
 */
export async function checkIPFSHealth() {
  try {
    const response = await fetch(`${IPFS_SERVICE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('IPFS health check error:', error);
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Health check failed'
    };
  }
}
