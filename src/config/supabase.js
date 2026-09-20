import { createClient } from '@supabase/supabase-js';

// Local storage key for dynamic runtime override if env vars are not set
const STORAGE_KEY_URL = 'tbr_supabase_url';
const STORAGE_KEY_KEY = 'tbr_supabase_key';

let cachedClient = null;
let currentUrl = null;
let currentKey = null;

/**
 * Retrieves the current Supabase configuration.
 * Checks import.meta.env first, then falls back to localStorage runtime config.
 */
export function getSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : null;

  const url = (envUrl && envUrl.trim() !== '') ? envUrl.trim() : (localUrl || '');
  const key = (envKey && envKey.trim() !== '') ? envKey.trim() : (localKey || '');

  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.startsWith('http'))
  };
}

/**
 * Saves runtime configuration and resets the client.
 */
export function saveSupabaseConfig(url, key) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (key) localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);
  }
  // Invalidate cached client
  cachedClient = null;
  currentUrl = null;
  currentKey = null;
}

/**
 * Returns a singleton Supabase client or null if not configured.
 */
export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (cachedClient && currentUrl === url && currentKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    currentUrl = url;
    currentKey = key;
    return cachedClient;
  } catch (err) {
    console.error('[SupabaseConfig] Failed to create Supabase client:', err);
    return null;
  }
}
