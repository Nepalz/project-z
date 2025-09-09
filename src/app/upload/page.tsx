
'use client';

import { useState, useEffect } from 'react';
import { X, Upload, FileVideo, Trash2, CheckCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { saveDemoPost, getDemoUser } from '@/lib/demo-storage';

export default function UploadPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [user, setUser] = useState<{ username: string; sessionId: string; createdAt: string } | null>(null);

  useEffect(() => {
    setUser(getDemoUser());
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    setIsUploading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await saveDemoPost(content, selectedFile);
      
      setUploadSuccess(true);
      
      setTimeout(() => {
        setContent('');
        setSelectedFile(null);
        setUploadSuccess(false);
        router.push('/');
      }, 2000);
      
    } catch (error) {
      alert('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Shared Successfully!</h2>
          <p className="text-gray-600">Your voice has been heard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* User Info Bar */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || ''}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.username || 'Loading...'}</p>
            <p className="text-sm text-gray-500">Share your voice with the world</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                <p className="text-gray-600 mt-1">Share what&apos;s happening • Be the voice of truth</p>
              </div>
              <button 
                onClick={() => router.back()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What&apos;s happening?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your story, report news, or voice your thoughts..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  rows={4}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">Be respectful and truthful</p>
                  <span className="text-sm text-gray-400">{content.length}/1000</span>
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Add Media (Optional)
                </label>
                
                {selectedFile ? (
                  /* File Selected View */
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {/* Preview */}
                      <div className="flex-shrink-0">
                        {selectedFile.type.startsWith('video/') ? (
                          <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileVideo size={32} className="text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                            <Image
                              src={URL.createObjectURL(selectedFile)}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type.split('/')[1].toUpperCase()}
                        </p>
                        <button
                          onClick={removeFile}
                          className="mt-2 inline-flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Upload Zone */
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                      dragActive 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <Plus size={32} className="text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">Add photos or videos</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Drag & drop your files here, or click to browse
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">JPG</span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">PNG</span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">MP4</span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">MOV</span>
                      </div>
                    </div>
                    
                    <label className="cursor-pointer absolute inset-0">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => router.back()}
                  variant="secondary"
                  className="flex-1 py-3"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isUploading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white font-semibold"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="mr-2" />
                      Share Your Voice
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-gradient-to-r from-red-50 to-blue-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="mr-2">📢</span>
            Community Guidelines
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Share accurate information and verify facts when possible</li>
            <li>• Respect privacy and avoid sharing personal information of others</li>
            <li>• Use clear, descriptive content to help others understand</li>
            <li>• Report urgent situations to authorities as well</li>
          </ul>
        </div>
      </div>
    </div>
  );
}