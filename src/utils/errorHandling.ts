// Error handling utilities for user-friendly error messages

export interface ApiError {
  message?: string;
  status?: number;
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
}

export const getUserFriendlyError = (error: ApiError | any, context: string): string => {
  // Log the full error for debugging (but don't show to user)
  console.error(`Error in ${context}:`, error);

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Handle HTTP status codes
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'You need to log in to perform this action.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with existing data. Please try a different approach.';
    case 422:
      return 'The provided information is invalid. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server is temporarily unavailable. Please try again later.';
    default:
      break;
  }

  // Try to extract user-friendly message from response
  const responseMessage = error?.response?.data?.message || 
                        error?.response?.data?.detail || 
                        error?.message;

  // If we have a response message, sanitize it to remove technical details
  if (responseMessage) {
    // Remove common technical prefixes/suffixes
    let cleanMessage = responseMessage
      .replace(/^Error:\s*/i, '')
      .replace(/^API Error:\s*/i, '')
      .replace(/^Validation Error:\s*/i, '')
      .replace(/^Database Error:\s*/i, '')
      .replace(/^Supabase Error:\s*/i, '')
      .replace(/^Axios Error:\s*/i, '')
      .replace(/^Network Error:\s*/i, '');

    // Remove common technical details
    cleanMessage = cleanMessage
      .replace(/\[.*?\]/g, '') // Remove brackets content
      .replace(/\(.*?\)/g, '') // Remove parentheses content
      .replace(/at\s+.*$/gm, '') // Remove stack trace lines
      .replace(/Error:\s*\d+/g, '') // Remove error codes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // If the message is still too technical, provide a generic one
    if (cleanMessage.length > 0 && 
        !cleanMessage.includes('SQL') && 
        !cleanMessage.includes('database') &&
        !cleanMessage.includes('connection') &&
        !cleanMessage.includes('timeout') &&
        !cleanMessage.includes('ECONN') &&
        !cleanMessage.includes('ENOTFOUND')) {
      return cleanMessage;
    }
  }

  // Context-specific fallback messages
  switch (context) {
    case 'login':
      return 'Login failed. Please check your credentials and try again.';
    case 'signup':
      return 'Signup failed. Please check your information and try again.';
    case 'payment':
      return 'Payment processing failed. Please try again or contact support.';
    case 'trip-creation':
      return 'Failed to create trip. Please try again.';
    case 'trip-loading':
      return 'Unable to load trip information. Please refresh the page.';
    case 'circle-creation':
      return 'Failed to create circle. Please try again.';
    case 'circle-loading':
      return 'Unable to load circle information. Please refresh the page.';
    case 'profile-loading':
      return 'Unable to load profile information. Please refresh the page.';
    case 'booking':
      return 'Booking failed. Please try again.';
    case 'search':
      return 'Search failed. Please try again.';
    case 'file-upload':
      return 'File upload failed. Please try again.';
    case 'verification':
      return 'Verification failed. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

// Specific error handlers for common operations
export const getAuthError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'login');
};

export const getSignupError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'signup');
};

export const getPaymentError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'payment');
};

export const getTripError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'trip-loading');
};

export const getCircleError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'circle-loading');
};

export const getProfileError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'profile-loading');
};

export const getBookingError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'booking');
};

export const getSearchError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'search');
};

export const getUploadError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'file-upload');
};

export const getVerificationError = (error: ApiError | any): string => {
  return getUserFriendlyError(error, 'verification');
}; 