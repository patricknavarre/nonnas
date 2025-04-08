'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Client component to force refresh when settings change
export default function RefreshHandler({ lastUpdate }: { lastUpdate: number }) {
  const router = useRouter();
  // Track if we've already refreshed
  const [hasRefreshed, setHasRefreshed] = useState(false);
  
  useEffect(() => {
    // Store the timestamp in localStorage to track when we last refreshed
    const lastRefresh = localStorage.getItem('last_refresh_timestamp');
    const currentTimestamp = lastUpdate.toString();
    
    // Only refresh if we haven't refreshed for this component instance
    // AND the timestamp is different from the last refresh
    if (!hasRefreshed && (!lastRefresh || lastRefresh !== currentTimestamp)) {
      console.log('RefreshHandler: Storing timestamp:', currentTimestamp);
      
      // Update localStorage with the current timestamp
      localStorage.setItem('last_refresh_timestamp', currentTimestamp);
      
      // Mark this instance as having been refreshed
      setHasRefreshed(true);
    }
  }, [lastUpdate, router, hasRefreshed]);
  
  return null; // This component doesn't render anything
} 