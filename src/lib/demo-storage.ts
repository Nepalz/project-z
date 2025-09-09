
import { Post } from '@/types';
import { generateId, generateUsername } from './utils';

// Demo user management
export const getDemoUser = () => {
  if (typeof window === 'undefined') return null;
  
  const user = localStorage.getItem('demo_user');
  if (user) {
    return JSON.parse(user);
  }
  
  // Create new demo user
  const newUser = {
    username: generateUsername(),
    sessionId: generateId(),
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('demo_user', JSON.stringify(newUser));
  return newUser;
};

// Convert file to base64 for demo storage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Demo posts management
export const getDemoPosts = (): Post[] => {
  if (typeof window === 'undefined') return [];
  
  const posts = localStorage.getItem('demo_posts');
  return posts ? JSON.parse(posts) : [];
};

export const saveDemoPost = async (content: string, file: File | null): Promise<Post> => {
  const user = getDemoUser();
  if (!user) throw new Error('No user found');

  let mediaData: string | undefined = undefined;
  let mediaType: 'image' | 'video' | 'none' = 'none';

  if (file) {
    mediaData = await fileToBase64(file);
    mediaType = file.type.startsWith('video/') ? 'video' : 'image';
  }

  const newPost: Post = {
    id: generateId(),
    content,
    mediaHash: mediaData, // Using base64 instead of IPFS hash for demo
    mediaType,
    username: user.username,
    timestamp: Date.now(),
    reports: 0,
    isVisible: true,
    likes: 0,
    dislikes: 0,
    shares: 0
  };

  const existingPosts = getDemoPosts();
  const updatedPosts = [newPost, ...existingPosts];
  
  localStorage.setItem('demo_posts', JSON.stringify(updatedPosts));
  return newPost;
};

export const updatePostLikes = (postId: string, increment: boolean): void => {
  const posts = getDemoPosts();
  const updatedPosts = posts.map(post => 
    post.id === postId 
      ? { ...post, likes: post.likes + (increment ? 1 : -1) }
      : post
  );
  localStorage.setItem('demo_posts', JSON.stringify(updatedPosts));
};

export const reportPost = (postId: string): void => {
  const posts = getDemoPosts();
  const updatedPosts = posts.map(post => 
    post.id === postId 
      ? { ...post, reports: post.reports + 1 }
      : post
  );
  localStorage.setItem('demo_posts', JSON.stringify(updatedPosts));
};