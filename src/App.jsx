import React, { useState, useEffect } from 'react';
import EditorPage from './pages/EditorPage';
import LiveOverlayPage from './pages/LiveOverlayPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      // Support both pathname (/live) and hash routing (#/live)
      if (window.location.pathname.startsWith('/live')) return '/live';
      if (window.location.hash.startsWith('#/live')) return '/live';
      return '/';
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname.startsWith('/live')) {
        setCurrentPath('/live');
      } else if (window.location.hash.startsWith('#/live')) {
        setCurrentPath('/live');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  if (currentPath === '/live') {
    return <LiveOverlayPage />;
  }

  return <EditorPage />;
}
