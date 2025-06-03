'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/utils/gtm';

/**
 * Custom hook to automatically track page views in Google Tag Manager
 * when the user navigates between pages in the Next.js app
 */
export const useGTMPageView = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Track the page view when the pathname changes
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);
};

export default useGTMPageView; 