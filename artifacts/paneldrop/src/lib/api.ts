/**
 * Silent fetch wrapper for API calls
 * Hides network requests from console in production
 */

const originalFetch = window.fetch;

// Override console methods in production
if (import.meta.env.PROD) {
  const noop = () => {};
  
  // Suppress console logs/errors for API requests in production
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  console.error = (...args: any[]) => {
    const str = args.join(' ');
    if (str.includes('/api/') || str.includes('fetch')) return;
    originalError.apply(console, args);
  };
  
  console.warn = (...args: any[]) => {
    const str = args.join(' ');
    if (str.includes('/api/') || str.includes('fetch')) return;
    originalWarn.apply(console, args);
  };
  
  console.log = (...args: any[]) => {
    const str = args.join(' ');
    if (str.includes('/api/') || str.includes('fetch')) return;
    originalLog.apply(console, args);
  };
}

/**
 * Silent fetch that doesn't log to console
 */
export async function silentFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return originalFetch(input, init);
}

/**
 * Build API URL helper
 */
export function buildApiUrl(path: string): string {
  const apiBaseUrl = (import.meta.env.VITE_MIRURO_API_URL || '').trim().replace(/\/$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  
  if (apiBaseUrl) return `${apiBaseUrl}/${cleanPath}`;
  if (typeof window !== 'undefined') return `${window.location.origin}/${cleanPath}`;
  return `/${cleanPath}`;
}

export default silentFetch;
