import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || error.response.data?.title || 'An error occurred';
    
    // Handle validation errors
    if (error.response.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors).flat();
      return validationErrors.join(', ');
    }
    
    return message;
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export const showErrorToast = (error: any): void => {
  const message = handleApiError(error);
  toast.error(message);
};

export const showSuccessToast = (message: string): void => {
  toast.success(message);
};

export const showInfoToast = (message: string): void => {
  toast.info(message);
};