export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (username.length > 100) {
    return 'Username must not exceed 100 characters';
  }
  return null;
};

export const validateProjectTitle = (title: string): string | null => {
  if (title.length < 3) {
    return 'Title must be at least 3 characters long';
  }
  if (title.length > 100) {
    return 'Title must not exceed 100 characters';
  }
  return null;
};

export const validateProjectDescription = (description: string): string | null => {
  if (description.length > 500) {
    return 'Description must not exceed 500 characters';
  }
  return null;
};

export const validateTaskTitle = (title: string): string | null => {
  if (title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.length > 200) {
    return 'Title must not exceed 200 characters';
  }
  return null;
};