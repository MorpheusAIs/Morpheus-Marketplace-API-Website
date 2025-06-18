'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useGTMPageView } from '@/lib/hooks/useGTMPageView';
import { 
  trackEvent, 
  trackAuth, 
  trackApiKey, 
  trackAutomation, 
  trackChatMessage, 
  trackDocumentation, 
  trackButtonClick, 
  trackFormSubmission,
  GTMEvent 
} from '@/lib/utils/gtm';

interface GTMContextType {
  trackEvent: (event: GTMEvent) => void;
  trackAuth: (action: 'login' | 'register' | 'logout', userId?: string) => void;
  trackApiKey: (action: 'created' | 'deleted', keyName: string) => void;
  trackAutomation: (enabled: boolean, sessionDuration?: number) => void;
  trackChatMessage: (messageLength: number, model?: string) => void;
  trackDocumentation: (docSection: string, docPage: string) => void;
  trackButtonClick: (buttonName: string, buttonLocation?: string) => void;
  trackFormSubmission: (formName: string, formSuccess: boolean) => void;
}

const GTMContext = createContext<GTMContextType | undefined>(undefined);

interface GTMProviderProps {
  children: ReactNode;
}

export const GTMProvider = ({ children }: GTMProviderProps) => {
  // Automatically track page views
  useGTMPageView();

  const contextValue: GTMContextType = {
    trackEvent,
    trackAuth,
    trackApiKey,
    trackAutomation,
    trackChatMessage,
    trackDocumentation,
    trackButtonClick,
    trackFormSubmission,
  };

  return (
    <GTMContext.Provider value={contextValue}>
      {children}
    </GTMContext.Provider>
  );
};

/**
 * Hook to access both Google Analytics and Google Tag Manager tracking functions from any component
 */
export const useGTM = (): GTMContextType => {
  const context = useContext(GTMContext);
  if (context === undefined) {
    throw new Error('useGTM must be used within a GTMProvider');
  }
  return context;
};

export default GTMProvider; 