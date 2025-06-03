import { sendGTMEvent } from '@next/third-parties/google';

// Type definitions for GTM events
export interface GTMEvent {
  event: string;
  [key: string]: any;
}

// Common event types for the application
export const GTM_EVENTS = {
  PAGE_VIEW: 'page_view',
  USER_REGISTER: 'user_register',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  API_KEY_CREATED: 'api_key_created',
  API_KEY_DELETED: 'api_key_deleted',
  AUTOMATION_ENABLED: 'automation_enabled',
  AUTOMATION_DISABLED: 'automation_disabled',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  DOC_PAGE_VIEWED: 'doc_page_viewed',
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted',
} as const;

/**
 * Send a custom event to Google Tag Manager
 * @param event - The event object to send
 */
export const trackEvent = (event: GTMEvent): void => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GTM_ID) {
    try {
      sendGTMEvent(event);
    } catch (error) {
      console.warn('Failed to send GTM event:', error);
    }
  }
};

/**
 * Track page views
 * @param pagePath - The path of the page
 * @param pageTitle - The title of the page
 */
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  trackEvent({
    event: GTM_EVENTS.PAGE_VIEW,
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
};

/**
 * Track user authentication events
 * @param action - The authentication action (login, register, logout)
 * @param userId - Optional user ID
 */
export const trackAuth = (action: 'login' | 'register' | 'logout', userId?: string): void => {
  const eventMap = {
    login: GTM_EVENTS.USER_LOGIN,
    register: GTM_EVENTS.USER_REGISTER,
    logout: GTM_EVENTS.USER_LOGOUT,
  };

  trackEvent({
    event: eventMap[action],
    user_id: userId,
  });
};

/**
 * Track API key management events
 * @param action - The API key action (created, deleted)
 * @param keyName - The name of the API key
 */
export const trackApiKey = (action: 'created' | 'deleted', keyName: string): void => {
  const eventMap = {
    created: GTM_EVENTS.API_KEY_CREATED,
    deleted: GTM_EVENTS.API_KEY_DELETED,
  };

  trackEvent({
    event: eventMap[action],
    key_name: keyName,
  });
};

/**
 * Track automation toggle events
 * @param enabled - Whether automation was enabled or disabled
 * @param sessionDuration - The session duration setting
 */
export const trackAutomation = (enabled: boolean, sessionDuration?: number): void => {
  trackEvent({
    event: enabled ? GTM_EVENTS.AUTOMATION_ENABLED : GTM_EVENTS.AUTOMATION_DISABLED,
    session_duration: sessionDuration,
  });
};

/**
 * Track chat interactions
 * @param messageLength - Length of the message
 * @param model - Model used for the chat
 */
export const trackChatMessage = (messageLength: number, model?: string): void => {
  trackEvent({
    event: GTM_EVENTS.CHAT_MESSAGE_SENT,
    message_length: messageLength,
    model: model,
  });
};

/**
 * Track documentation page views
 * @param docSection - The documentation section
 * @param docPage - The specific documentation page
 */
export const trackDocumentation = (docSection: string, docPage: string): void => {
  trackEvent({
    event: GTM_EVENTS.DOC_PAGE_VIEWED,
    doc_section: docSection,
    doc_page: docPage,
  });
};

/**
 * Track button clicks
 * @param buttonName - Name or identifier of the button
 * @param buttonLocation - Where the button is located
 */
export const trackButtonClick = (buttonName: string, buttonLocation?: string): void => {
  trackEvent({
    event: GTM_EVENTS.BUTTON_CLICKED,
    button_name: buttonName,
    button_location: buttonLocation,
  });
};

/**
 * Track form submissions
 * @param formName - Name of the form
 * @param formSuccess - Whether the form submission was successful
 */
export const trackFormSubmission = (formName: string, formSuccess: boolean): void => {
  trackEvent({
    event: GTM_EVENTS.FORM_SUBMITTED,
    form_name: formName,
    form_success: formSuccess,
  });
}; 