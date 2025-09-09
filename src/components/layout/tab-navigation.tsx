
interface TabNavigationProps {
  activeTab: 'explore' | 'feed';
  onTabChange: (tab: 'explore' | 'feed') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex">
        <button
          onClick={() => onTabChange('feed')}
          className={`flex-1 py-4 text-center font-semibold text-sm uppercase tracking-wide transition-all ${
            activeTab === 'feed'
              ? 'text-red-500 border-b-2 border-red-500 bg-red-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          📺 Feed
        </button>
        <button
          onClick={() => onTabChange('explore')}
          className={`flex-1 py-4 text-center font-semibold text-sm uppercase tracking-wide transition-all ${
            activeTab === 'explore'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          🔍 Explore
        </button>
      </div>
    </div>
  );
}
