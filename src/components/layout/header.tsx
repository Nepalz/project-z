import Link from 'next/link';
import Image from 'next/image';
import { Edit3, PenTool, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-200 group">
            {/* Your SpeakUp Logo */}
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo/logo-light.svg"
                alt="SpeakUp Logo"
                width={40}
                height={40}
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent tracking-tight">
                SpeakUp
              </span>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block font-medium tracking-wide">
                Now or Never
              </p>
            </div>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Admin Link (Desktop) */}
          <Link href="/admin" className="hidden md:block">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm font-medium group">
              <Settings size={16} className="group-hover:rotate-12 transition-transform duration-200" />
              <span>Admin</span>
            </button>
          </Link>

          {/* Create Post Button */}
          <Link href="/upload">
            <button className="bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 group">
              {/* Desktop Icon */}
              <PenTool size={16} className="hidden sm:block group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Create Post</span>
              
              {/* Mobile Icon */}
              <Edit3 size={18} className="sm:hidden group-hover:scale-110 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}