
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { TabNavigation } from '@/components/layout/tab-navigation';
import { VerticalFeed } from '@/components/feed/vertical-feed';
import { GridExplore } from '@/components/feed/grid-explore';
import { useDemoPosts } from '@/hooks/useDemoPosts';
import { STATIC_POSTS } from '@/lib/static-data';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'explore' | 'feed'>('feed');
  const { posts: demoPosts, loading } = useDemoPosts();

  const handleTabChange = (tab: 'explore' | 'feed') => {
    setActiveTab(tab);
  };

  // Combine demo posts with static posts
  const allPosts = [...demoPosts, ...STATIC_POSTS];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Sidebar - Desktop Navigation */}
        <div className="w-64 border-r border-gray-200 min-h-screen bg-gray-50 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'bg-red-400 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              📺 Feed
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'explore'
                  ? 'bg-red-400 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔍 Explore
            </button>
            <Link href="/upload">
              <button className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                📱 Create Post
              </button>
            </Link>
            <Link href="/admin">
              <button className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                ⚙️ Admin
              </button>
            </Link>
          </nav>
        </div>

        {/* Main Content - Desktop */}
        <div className="flex-1 flex">
          <main className="flex-1 max-w-4xl">
            {activeTab === 'feed' && <VerticalFeed posts={allPosts} />}
            {activeTab === 'explore' && <GridExplore posts={allPosts} />}
          </main>

          {/* Right Sidebar - Trending/Stats */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-lg mb-3">🔥 Live Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Posts</span>
                    <span className="font-medium">{allPosts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demo Posts</span>
                    <span className="font-medium text-green-600">{demoPosts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sample Posts</span>
                    <span className="font-medium">{STATIC_POSTS.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="relative">
          {activeTab === 'feed' && <VerticalFeed posts={allPosts} />}
          {activeTab === 'explore' && <GridExplore posts={allPosts} />}
        </main>

        {/* Mobile Floating Button */}
        {activeTab === 'feed' && (
          <Link href="/upload">
            <button className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg z-50 hover:bg-gray-800 transition-colors">
              <Plus size={24} />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}