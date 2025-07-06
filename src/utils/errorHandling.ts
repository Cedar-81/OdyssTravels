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

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for auth specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      // For login, 401 means invalid credentials
      return 'Invalid email or password. Please check your credentials and try again.';
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
  const responseMessage = error?.message;

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

  // Default login error message
  return 'Login failed. Please check your credentials and try again.';
};

export const getSignupError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for signup specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Authentication failed. Please check your credentials.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This email is already registered. Please use a different email or try logging in.';
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

  // Default signup error message
  return 'Signup failed. Please check your information and try again.';
};

export const getPaymentError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for payment specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid payment request. Please check your payment details and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to perform this payment.';
    case 404:
      return 'Payment service not found. Please contact support.';
    case 409:
      return 'Payment conflict. Please try again or contact support.';
    case 422:
      return 'Invalid payment information. Please check your details.';
    case 429:
      return 'Too many payment attempts. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Payment service is temporarily unavailable. Please try again later.';
    default:
      break;
  }

  // Default payment error message
  return 'Payment processing failed. Please try again or contact support.';
};

export const getTripError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for trip operations specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid trip request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'Trip not found.';
    case 409:
      return 'Trip conflict. Please try again.';
    case 422:
      return 'Invalid trip information. Please check your details.';
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

  // Default trip error message
  return 'Unable to load trip information. Please refresh the page.';
};

export const getCircleError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for circle operations specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid circle request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'Circle not found.';
    case 409:
      return 'Circle conflict. Please try again.';
    case 422:
      return 'Invalid circle information. Please check your details.';
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

  // Default circle error message
  return 'Unable to load circle information. Please refresh the page.';
};

export const getProfileError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for profile operations specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid profile request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'Profile not found.';
    case 409:
      return 'Profile conflict. Please try again.';
    case 422:
      return 'Invalid profile information. Please check your details.';
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

  // Default profile error message
  return 'Unable to load profile information. Please refresh the page.';
};

export const getBookingError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for booking operations specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid booking request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'Trip not found for booking.';
    case 409:
      return 'Booking conflict. This seat may already be taken.';
    case 422:
      return 'Invalid booking information. Please check your details.';
    case 429:
      return 'Too many booking attempts. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server is temporarily unavailable. Please try again later.';
    default:
      break;
  }

  // Default booking error message
  return 'Booking failed. Please try again.';
};

export const getSearchError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for search operations specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid search request. Please check your search criteria and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to perform this search.';
    case 404:
      return 'Search service not found.';
    case 409:
      return 'Search conflict. Please try again.';
    case 422:
      return 'Invalid search parameters. Please check your input.';
    case 429:
      return 'Too many search requests. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Search service is temporarily unavailable. Please try again later.';
    default:
      break;
  }

  // Default search error message
  return 'Search failed. Please try again.';
};

export const getUploadError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for upload operations specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid file upload request. Please check your file and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to upload files.';
    case 404:
      return 'Upload service not found.';
    case 409:
      return 'Upload conflict. Please try again.';
    case 422:
      return 'Invalid file format or size. Please check your file.';
    case 429:
      return 'Too many upload attempts. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Upload service is temporarily unavailable. Please try again later.';
    default:
      break;
  }

  // Default upload error message
  return 'File upload failed. Please try again.';
};

export const getVerificationError = (error: ApiError | any): string => {

  // Handle network errors
  if (!error || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // First, try to get the backend error message
  const backendError = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.response?.data?.detail;

  if (backendError) {
    return backendError;
  }

  // Handle HTTP status codes for verification operations specifically
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 400:
      return 'Invalid verification request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to perform this verification.';
    case 404:
      return 'Verification service not found.';
    case 409:
      return 'Verification conflict. Please try again.';
    case 422:
      return 'Invalid verification information. Please check your details.';
    case 429:
      return 'Too many verification attempts. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Verification service is temporarily unavailable. Please try again later.';
    default:
      break;
  }

  // Default verification error message
  return 'Verification failed. Please try again.';
}; 