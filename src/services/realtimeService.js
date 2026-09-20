import { getSupabaseClient } from '../config/supabase';

// Map of active channel subscriptions: channelId -> { channel, status, listeners }
const activeSubscriptions = new Map();

/**
 * Returns formatted channel name
 */
export function getChannelName(channelId) {
  const cleanId = (channelId || 'tbr-default').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  return `tbr_overlay_${cleanId}`;
}

/**
 * Subscribes to a broadcast channel for the specified channelId.
 * @param {string} channelId 
 * @param {Function} onUpdate - callback(payload)
 * @param {Function} onStatusChange - callback(statusText, error?)
 * @returns {Function} unsubscribe cleanup function
 */
export function subscribeToOverlay(channelId, onUpdate, onStatusChange) {
  const supabase = getSupabaseClient();
  const channelName = getChannelName(channelId);

  if (!supabase) {
    if (onStatusChange) onStatusChange('NOT_CONFIGURED');
    return () => {};
  }

  if (onStatusChange) onStatusChange('CONNECTING');

  // Create channel with broadcast ack enabled
  const channel = supabase.channel(channelName, {
    config: {
      broadcast: { ack: true, self: false }
    }
  });

  // Listen for broadcast events
  channel.on(
    'broadcast',
    { event: 'overlay_update' },
    (eventData) => {
      if (eventData && eventData.payload) {
        if (onUpdate) onUpdate(eventData.payload);
      }
    }
  );

  // Subscribe and monitor lifecycle status
  channel.subscribe((status, err) => {
    if (onStatusChange) {
      onStatusChange(status, err);
    }
  });

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch (e) {
      console.warn('[RealtimeService] Error removing channel:', e);
    }
  };
}

/**
 * Publishes an overlay update to the specified channel.
 * @param {string} channelId 
 * @param {Object} payload 
 * @param {RealtimeChannel} [existingChannel] - Optional pre-subscribed channel
 * @returns {Promise<{ success: boolean, status: string, error?: any }>}
 */
export async function publishOverlayUpdate(channelId, payload, existingChannel = null) {
  const supabase = getSupabaseClient();
  const channelName = getChannelName(channelId);

  if (!supabase) {
    return { success: false, status: 'NOT_CONFIGURED', error: new Error('Supabase is not configured') };
  }

  // If a ready channel was passed in, send through it directly
  if (existingChannel) {
    try {
      const resp = await existingChannel.send({
        type: 'broadcast',
        event: 'overlay_update',
        payload: {
          ...payload,
          channelId,
          timestamp: Date.now()
        }
      });
      return { success: resp === 'ok', status: resp };
    } catch (err) {
      return { success: false, status: 'ERROR', error: err };
    }
  }

  // Otherwise create a temporary channel
  return new Promise((resolve) => {
    const channel = supabase.channel(channelName, {
      config: { broadcast: { ack: true } }
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          const resp = await channel.send({
            type: 'broadcast',
            event: 'overlay_update',
            payload: {
              ...payload,
              channelId,
              timestamp: Date.now()
            }
          });
          supabase.removeChannel(channel);
          resolve({ success: resp === 'ok', status: resp });
        } catch (err) {
          supabase.removeChannel(channel);
          resolve({ success: false, status: 'ERROR', error: err });
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        supabase.removeChannel(channel);
        resolve({ success: false, status });
      }
    });
  });
}
