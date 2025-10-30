import { format, parseISO, formatDistanceToNow, isPast, isFuture } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const isOverdue = (dueDate: string | Date | null | undefined): boolean => {
  if (!dueDate) return false;
  try {
    const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    return isPast(dateObj);
  } catch {
    return false;
  }
};

export const isDueSoon = (dueDate: string | Date | null | undefined, days: number = 3): boolean => {
  if (!dueDate) return false;
  try {
    const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return isFuture(dateObj) && dateObj <= futureDate;
  } catch {
    return false;
  }
};

export const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};