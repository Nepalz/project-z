// src/app/upload/page.tsx - Complete Desktop Responsive Version


import { useState } from 'react';
import { X, Image as ImageIcon, Zap, Upload, Camera, FileVideo, FileImage, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'video' | 'photo'>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

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

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }
    
    console.log('Uploading:', { content, file: selectedFile, mode });
    alert('Post uploaded! (Demo mode)');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Camera Interface */}
        <div className="relative h-[calc(100vh-180px)] bg-black">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
            <button onClick={() => router.back()}>
              <X size={28} className="text-white" />
            </button>
            <div className="flex space-x-4">
              <label className="cursor-pointer">
                <ImageIcon size={28} className="text-white"/>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <button>
                <Zap size={28} className="text-white" />
              </button>
            </div>
          </div>

          {/* Camera View / Preview */}
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            {selectedFile ? (
              <div className="text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-lg mb-4 mx-auto flex items-center justify-center">
                  {selectedFile.type.startsWith('video/') ? '🎥' : '📸'}
                </div>
                <p className="text-sm">{selectedFile.name}</p>
                <p className="text-xs opacity-75 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-white text-center">
                <div className="w-16 h-16 border-2 border-white rounded-lg mb-4 mx-auto flex items-center justify-center">
                  📷
                </div>
                <p>Tap to capture or select from gallery</p>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Record/Capture Button */}
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-20 h-20 border-4 border-white rounded-full flex items-center justify-center transition-all ${
                  isRecording ? 'border-red-500' : 'border-white'
                }`}
              >
                <div className={`w-16 h-16 rounded-full transition-all ${
                  isRecording ? 'bg-red-500' : 'bg-white'
                }`}></div>
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="bg-gray-800 rounded-full p-1 flex mb-4">
              <button
                onClick={() => setMode('video')}
                className={`flex-1 py-2 px-6 rounded-full text-center transition-colors ${
                  mode === 'video'
                    ? 'bg-white text-black font-medium'
                    : 'text-white'
                }`}
              >
                VIDEO
              </button>
              <button
                onClick={() => setMode('photo')}
                className={`flex-1 py-2 px-6 rounded-full text-center transition-colors ${
                  mode === 'photo'
                    ? 'bg-white text-black font-medium'
                    : 'text-white'
                }`}
              >
                PHOTO
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Content Input */}
        <div className="p-4 border-t bg-white">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening in Nepal? Share your story..."
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            rows={3}
          />
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              {selectedFile ? (
                <span className="flex items-center space-x-1">
                  {selectedFile.type.startsWith('video/') ? <FileVideo size={16} /> : <FileImage size={16} />}
                  <span>{selectedFile.name}</span>
                </span>
              ) : (
                'No media selected'
              )}
            </div>
            <Button onClick={handleSubmit} disabled={!content.trim()}>
              <Upload size={16} className="mr-2" />
              Post
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                  <p className="text-gray-600 mt-1">Share what&apos;s happening in Nepal</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Media Upload */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Media Upload</h3>
                    <p className="text-sm text-gray-600">Add photos or videos to your post</p>
                  </div>
                  
                  {/* File Drop Zone */}
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive 
                        ? 'border-red-400 bg-red-50' 
                        : selectedFile 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="w-24 h-24 bg-green-100 rounded-xl mx-auto flex items-center justify-center">
                          {selectedFile.type.startsWith('video/') ? (
                            <FileVideo size={32} className="text-green-600" />
                          ) : (
                            <FileImage size={32} className="text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                          </p>
                        </div>
                        <button
                          onClick={removeFile}
                          className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          <span>Remove file</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera size={48} className="mx-auto text-gray-400" />
                        <div>
                          <p className="text-gray-700 font-medium text-lg">Upload media</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Drag & drop your files here, or click to browse
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">JPG</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">PNG</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">MP4</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">MOV</span>
                        </div>
                      </div>
                    )}
                    
                    <label className="cursor-pointer absolute inset-0">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Media Type Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Content Type</label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setMode('photo')}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          mode === 'photo'
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Camera size={20} />
                          <span className="font-medium">Photo</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setMode('video')}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          mode === 'video'
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FileVideo size={20} />
                          <span className="font-medium">Video</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Content Input */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Post Content</h3>
                    <p className="text-sm text-gray-600">Write your message and share your thoughts</p>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's happening in Nepal? Share your story, updates, or thoughts..."
                      className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      rows={8}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Be respectful and truthful in your reporting</span>
                      <span>{content.length}/1000</span>
                    </div>
                  </div>

                  {/* Post Settings */}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Post Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-700">Enable sharing</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm text-gray-700">Mark as urgent/breaking news</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={() => router.back()}
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!content.trim()}
                      className="flex-1 bg-red-400 hover:bg-red-500"
                    >
                      <Upload size={16} className="mr-2" />
                      Publish Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📢 Posting Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Share accurate information and verify facts when possible</li>
              <li>• Respect privacy and avoid posting personal information of others</li>
              <li>• Use clear, descriptive content to help others understand the situation</li>
              <li>• Report urgent situations to appropriate authorities as well</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}