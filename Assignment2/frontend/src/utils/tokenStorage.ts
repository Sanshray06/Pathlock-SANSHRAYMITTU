const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const saveUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): any | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};