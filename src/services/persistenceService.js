/**
 * State Recovery Persistence Service
 * Stores and recovers active overlay state across OBS scene remounts and page reloads.
 */

const STORAGE_PREFIX_LIVE = 'tbr_live_state_';
const STORAGE_PREFIX_EDITOR = 'tbr_editor_pushed_state_';

// In-memory fallback if storage is restricted
const memoryStore = new Map();

/**
 * Saves the latest active state for a given channel in Live overlay.
 * @param {string} channelId
 * @param {Object} state
 */
export function saveLiveState(channelId, state) {
  if (!channelId || !state || typeof state !== 'object') return;
  const key = `${STORAGE_PREFIX_LIVE}${channelId}`;
  const serialized = JSON.stringify(state);
  memoryStore.set(key, state);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, serialized);
    } catch (e) {
      console.warn('[PersistenceService] localStorage write error:', e);
    }
  }
}

/**
 * Retrieves the last active state for a given channel in Live overlay.
 * @param {string} channelId
 * @returns {Object|null}
 */
export function getSavedLiveState(channelId) {
  if (!channelId) return null;
  const key = `${STORAGE_PREFIX_LIVE}${channelId}`;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[PersistenceService] localStorage read error:', e);
    }
  }

  return memoryStore.get(key) || null;
}

/**
 * Saves the latest pushed state from Editor.
 * @param {string} channelId
 * @param {Object} state
 */
export function saveEditorPushedState(channelId, state) {
  if (!channelId || !state || typeof state !== 'object') return;
  const key = `${STORAGE_PREFIX_EDITOR}${channelId}`;
  const serialized = JSON.stringify(state);
  memoryStore.set(key, state);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, serialized);
    } catch (e) {
      console.warn('[PersistenceService] localStorage write error:', e);
    }
  }
}

/**
 * Retrieves the latest pushed state in Editor.
 * @param {string} channelId
 * @returns {Object|null}
 */
export function getSavedEditorState(channelId) {
  if (!channelId) return null;
  const key = `${STORAGE_PREFIX_EDITOR}${channelId}`;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[PersistenceService] localStorage read error:', e);
    }
  }

  return memoryStore.get(key) || null;
}
