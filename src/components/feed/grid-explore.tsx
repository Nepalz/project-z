
'use client';

import { Post } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import Link from 'next/link';

interface GridExploreProps {
  posts: Post[];
}

export function GridExplore({ posts }: GridExploreProps) {
  return (
    <>
      {/* Mobile Grid */}
      <div className="lg:hidden pb-20">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={`bg-gray-100 rounded-lg overflow-hidden relative ${
                  index % 5 === 0 ? 'row-span-2' : ''
                }`}
                style={{ 
                  aspectRatio: index % 5 === 0 ? '1/2' : '1/1',
                  minHeight: '120px'
                }}
              >
                <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-gray-200 to-gray-300">
                  {/* Content based on media type */}
                  {post.mediaType === 'video' ? (
                    <>
                      <div className="w-0 h-0 border-l-[30px] border-l-gray-600 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent"></div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        VIDEO
                      </div>
                    </>
                  ) : post.mediaType === 'image' ? (
                    <>
                      <span className="text-gray-600 text-2xl">📸</span>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        PHOTO
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-600 text-2xl">📝</span>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        TEXT
                      </div>
                    </>
                  )}

                  {/* Post info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                    <div className="text-xs font-medium">{post.username}</div>
                    <div className="text-xs opacity-75">{formatTimestamp(post.timestamp)}</div>
                  </div>

                  {/* Engagement stats */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <div className="bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      👍 {post.likes}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Fixed Post Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t p-4">
          <Link href="/upload">
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium">
              📱 Post
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:block p-6">
        <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`bg-gray-100 rounded-lg overflow-hidden relative group hover:shadow-lg transition-all cursor-pointer ${
                index % 7 === 0 ? 'col-span-2 row-span-2' : 
                index % 7 === 3 ? 'row-span-2' : ''
              }`}
              style={{ 
                aspectRatio: 
                  index % 7 === 0 ? '2/2' : 
                  index % 7 === 3 ? '1/2' : '1/1',
                minHeight: '200px'
              }}
            >
              <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-all">
                {/* Content based on media type */}
                {post.mediaType === 'video' ? (
                  <>
                    <div className="w-0 h-0 border-l-[40px] border-l-gray-600 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent group-hover:scale-110 transition-transform"></div>
                    <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded font-medium">
                      VIDEO
                    </div>
                  </>
                ) : post.mediaType === 'image' ? (
                  <>
                    <span className="text-gray-600 text-3xl group-hover:scale-110 transition-transform">📸</span>
                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                      PHOTO
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600 text-3xl group-hover:scale-110 transition-transform">📝</span>
                    <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded font-medium">
                      TEXT
                    </div>
                  </>
                )}

                {/* Hover overlay with content preview */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <div className="text-white text-center">
                    <p className="text-sm font-medium mb-2">{post.username}</p>
                    <p className="text-xs line-clamp-3">{post.content}</p>
                  </div>
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <div className="font-medium">{post.username}</div>
                      <div className="opacity-75">{formatTimestamp(post.timestamp)}</div>
                    </div>
                    <div className="flex space-x-2 text-xs">
                      <span>👍 {post.likes}</span>
                      <span>👎 {post.dislikes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
