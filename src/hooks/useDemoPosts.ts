
'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { getDemoPosts, updatePostLikes, reportPost } from '@/lib/demo-storage';

export function useDemoPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPosts = () => {
    const demoPosts = getDemoPosts();
    setPosts(demoPosts);
    setLoading(false);
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const likePost = (postId: string, increment: boolean) => {
    updatePostLikes(postId, increment);
    refreshPosts();
  };

  const reportPostAction = (postId: string) => {
    reportPost(postId);
    refreshPosts();
    alert('Post reported successfully');
  };

  return {
    posts,
    loading,
    refreshPosts,
    likePost,
    reportPost: reportPostAction
  };
}
