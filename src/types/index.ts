
export interface User {
  username: string;
  sessionId: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  mediaHash?: string;
  mediaType: 'image' | 'video' | 'none';
  username: string;
  timestamp: number;
  reports: number;
  isVisible: boolean;
  likes: number;
  dislikes: number;
  shares: number;
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  hash?: string;
  error?: string;
}

export interface Report {
  id: string;
  postId: string;
  reason: string;
  timestamp: number;
  resolved: boolean;
}
