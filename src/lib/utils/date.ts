/**
 * Format date consistently for both server and client rendering
 * This prevents hydration mismatches by using a consistent format
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Use ISO date format and extract parts to ensure consistency
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Format date to a human-readable string
 * Safe for server-side rendering
 */
export function formatDateHuman(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  return `${month} ${day}, ${year}`;
}
