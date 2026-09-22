import { createClient } from '@supabase/supabase-js';

// Local storage key for dynamic runtime override if env vars are not set
const STORAGE_KEY_URL = 'tbr_supabase_url';
const STORAGE_KEY_KEY = 'tbr_supabase_key';

// Project default Supabase credentials (for OBS Browser Source, Incognito, and zero-config runtimes)
const DEFAULT_SUPABASE_URL = 'https://nlglojpmlhgsrougzxux.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_cYxBP_-RwE5mzqy_JqTU2w_4RwuvgpI';

let cachedClient = null;
let currentUrl = null;
let currentKey = null;

/**
 * Retrieves the current Supabase configuration.
 * Checks localStorage first, then import.meta.env, then falls back to project defaults.
 */
export function getSupabaseConfig() {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  let localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : null;

  // Auto-heal known typo if persisted in localStorage
  if (localUrl && localUrl.includes('nlglojpmhgsrougzxux.supabase.co')) {
    localUrl = localUrl.replace('nlglojpmhgsrougzxux.supabase.co', 'nlglojpmlhgsrougzxux.supabase.co');
    try {
      localStorage.setItem(STORAGE_KEY_URL, localUrl);
    } catch (e) {
      // ignore storage error
    }
  }

  // Priority: 1. localStorage explicit override, 2. build-time env var, 3. project default credentials
  const rawUrl = (localUrl && localUrl.trim() !== '')
    ? localUrl.trim()
    : (envUrl || DEFAULT_SUPABASE_URL);
  const rawKey = (localKey && localKey.trim() !== '')
    ? localKey.trim()
    : (envKey || DEFAULT_SUPABASE_KEY);

  const url = rawUrl.replace(/\/+$/, '');
  const key = rawKey;

  return {
    url,
    key,
    isConfigured: Boolean(url && key && (url.startsWith('http://') || url.startsWith('https://')))
  };
}

/**
 * Saves runtime configuration and resets the client.
 */
export function saveSupabaseConfig(url, key) {
  const cleanUrl = url ? url.trim().replace(/\/+$/, '') : '';
  const cleanKey = key ? key.trim() : '';

  if (typeof window !== 'undefined') {
    if (cleanUrl) localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (cleanKey) localStorage.setItem(STORAGE_KEY_KEY, cleanKey);
    else localStorage.removeItem(STORAGE_KEY_KEY);
  }

  // Disconnect and invalidate cached client
  if (cachedClient) {
    try {
      cachedClient.realtime?.disconnect();
    } catch (e) {
      console.warn('[SupabaseConfig] Error disconnecting cached client:', e);
    }
  }
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
