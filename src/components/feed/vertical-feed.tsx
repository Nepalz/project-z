
'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share, Flag, MoreVertical } from 'lucide-react';
import { Post } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { MediaDisplay } from '@/components/media/media-display';

interface VerticalFeedProps {
  posts: Post[];
}

export function VerticalFeed({ posts }: VerticalFeedProps) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [dislikedPosts, setDislikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        // Remove from dislikes if present
        setDislikedPosts(prevDislikes => {
          const newDislikeSet = new Set(prevDislikes);
          newDislikeSet.delete(postId);
          return newDislikeSet;
        });
      }
      return newSet;
    });
  };

  const handleDislike = (postId: string) => {
    setDislikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        // Remove from likes if present
        setLikedPosts(prevLikes => {
          const newLikeSet = new Set(prevLikes);
          newLikeSet.delete(postId);
          return newLikeSet;
        });
      }
      return newSet;
    });
  };

  const handleReport = (postId: string) => {
    alert(`Post reported: ${postId}`);
  };

  return (
    <>
      {/* Mobile Vertical Feed */}
      <div className="lg:hidden h-[calc(100vh-140px)] overflow-y-scroll snap-y snap-mandatory">
        {posts.map((post) => (
          <div key={post.id} className="h-full snap-start relative bg-black">
            {/* Media */}
            <MediaDisplay 
              mediaHash={post.mediaHash || ''} 
              mediaType={post.mediaType} 
              className="absolute inset-0"
            />

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col space-y-4 z-10">
              <button 
                onClick={() => handleLike(post.id)}
                className="bg-black/30 backdrop-blur p-3 rounded-full flex flex-col items-center"
              >
                <ThumbsUp 
                  size={24} 
                  className={`${likedPosts.has(post.id) ? 'text-green-500 fill-current' : 'text-white'}`} 
                />
                <span className="text-white text-xs mt-1 font-medium">
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </span>
              </button>

              <button 
                onClick={() => handleDislike(post.id)}
                className="bg-black/30 backdrop-blur p-3 rounded-full flex flex-col items-center"
              >
                <ThumbsDown 
                  size={24} 
                  className={`${dislikedPosts.has(post.id) ? 'text-red-500 fill-current' : 'text-white'}`} 
                />
                <span className="text-white text-xs mt-1 font-medium">
                  {dislikedPosts.has(post.id) ? 1 : 0}
                </span>
              </button>
              
              <button className="bg-black/30 backdrop-blur p-3 rounded-full flex flex-col items-center">
                <Share size={24} className="text-white" />
                <span className="text-white text-xs mt-1 font-medium">{post.shares}</span>
              </button>
              
              <button 
                onClick={() => handleReport(post.id)}
                className="bg-black/30 backdrop-blur p-3 rounded-full"
              >
                <Flag size={20} className="text-white" />
              </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {post.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-semibold">{post.username}</span>
                <span className="text-sm opacity-75">•</span>
                <span className="text-sm opacity-75">{formatTimestamp(post.timestamp)}</span>
              </div>
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Card Feed */}
      <div className="hidden lg:block p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {post.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.username}</h3>
                    <p className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
              </div>

              {/* Media */}
              {post.mediaType !== 'none' && (
                <div className="aspect-video">
                  <MediaDisplay 
                    mediaHash={post.mediaHash || ''} 
                    mediaType={post.mediaType} 
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                    >
                      <ThumbsUp 
                        size={20} 
                        className={likedPosts.has(post.id) ? 'text-green-500 fill-current' : ''} 
                      />
                      <span className="text-sm font-medium">
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </span>
                    </button>

                    <button 
                      onClick={() => handleDislike(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <ThumbsDown 
                        size={20} 
                        className={dislikedPosts.has(post.id) ? 'text-red-500 fill-current' : ''} 
                      />
                      <span className="text-sm font-medium">
                        {dislikedPosts.has(post.id) ? 1 : 0}
                      </span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <Share size={20} />
                      <span className="text-sm font-medium">{post.shares}</span>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleReport(post.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Flag size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}