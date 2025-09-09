
'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface MediaDisplayProps {
  mediaHash: string;
  mediaType: 'image' | 'video' | 'none';
  className?: string;
}

export function MediaDisplay({ mediaHash, mediaType, className = '' }: MediaDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (mediaType === 'none' || !mediaHash) {
    return (
      <div className={`bg-gray-900 flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-6xl mb-4">📝</div>
          <p>Text Post</p>
        </div>
      </div>
    );
  }

  if (mediaType === 'video') {
    return (
      <div className={`relative bg-black flex items-center justify-center ${className}`}>
        <video
          className="w-full h-full object-cover"
          controls={false}
          muted
          loop
          playsInline
          onLoadedData={() => setIsLoading(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={mediaHash} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {!isPlaying && (
            <div className="bg-black/50 rounded-full p-4">
              <Play size={48} className="text-white" />
            </div>
          )}
        </button>
      </div>
    );
  }

  if (mediaType === 'image') {
    return (
      <div className={`relative bg-gray-100 flex items-center justify-center ${className}`}>
        <Image
          src={mediaHash}
          alt="Post content"
          fill
          className="object-cover"
          onLoad={() => setIsLoading(false)}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        )}
      </div>
    );
  }

  return null;
}