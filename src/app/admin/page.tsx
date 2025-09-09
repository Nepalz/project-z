
'use client';

import { useState } from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { STATIC_POSTS } from '@/lib/static-data';
import { formatTimestamp } from '@/lib/utils';
import { Post } from '@/types';

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>(STATIC_POSTS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleToggleVisibility = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isVisible: !post.isVisible }
        : post
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Demo password: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Content Management</h1>
          <Button 
            onClick={() => setIsAuthenticated(false)}
            variant="secondary"
          >
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">All Posts ({posts.length})</h2>
          </div>
          
          <div className="divide-y">
            {posts.map((post) => (
              <div key={post.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{post.username}</span>
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(post.timestamp)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        post.mediaType === 'video' ? 'bg-purple-100 text-purple-800' :
                        post.mediaType === 'image' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.mediaType.toUpperCase()}
                      </span>
                      {!post.isVisible && (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{post.content}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>👍 {post.likes}</span>
                      <span>� {post.dislikes}</span>
                      <span>�📤 {post.shares}</span>
                      <span>🚩 {post.reports}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleVisibility(post.id)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title={post.isVisible ? 'Hide post' : 'Show post'}
                    >
                      {post.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}