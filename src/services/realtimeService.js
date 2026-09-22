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
    return () => { };
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
 * Always generates a fresh timestamp so the Live page never ignores new state.
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

  // Always use a fresh timestamp so /live never skips this push
  const enrichedPayload = {
    ...payload,
    channelId,
    timestamp: Date.now()
  };

  console.info('[RealtimeService] PUSH TO LIVE started — channel:', channelId, '| channelName:', channelName);
  console.info('[RealtimeService] broadcast event: overlay_update | timestamp:', enrichedPayload.timestamp);

  // 1. Upsert the current state into Supabase persistence table
  console.info('[RealtimeService] database upsert started');
  try {
    const { error: upsertError } = await supabase
      .from('overlay_state')
      .upsert({ channel: channelId, state: enrichedPayload }, { onConflict: 'channel' });
    if (upsertError) {
      console.error('[RealtimeService] database upsert ERROR:', upsertError);
    } else {
      console.info('[RealtimeService] database upsert SUCCESS');
    }
  } catch (e) {
    console.error('[RealtimeService] database upsert EXCEPTION:', e);
  }

  // 2. Broadcast overlay update via existing subscribed channel (preferred path)
  console.info('[RealtimeService] broadcast started');
  if (existingChannel) {
    try {
      const resp = await existingChannel.send({
        type: 'broadcast',
        event: 'overlay_update',
        payload: enrichedPayload
      });
      console.info('[RealtimeService] broadcast SUCCESS, response:', resp);
      return { success: resp === 'ok', status: resp };
    } catch (err) {
      console.error('[RealtimeService] broadcast ERROR:', err);
      return { success: false, status: 'ERROR', error: err };
    }
  }

  // 3. Fallback: create a temporary channel, subscribe, send, then clean up
  console.info('[RealtimeService] no existingChannel — creating temp channel:', channelName);
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
            payload: enrichedPayload
          });
          console.info('[RealtimeService] temp channel broadcast SUCCESS, response:', resp);
          supabase.removeChannel(channel);
          resolve({ success: resp === 'ok', status: resp });
        } catch (err) {
          console.error('[RealtimeService] temp channel broadcast ERROR:', err);
          supabase.removeChannel(channel);
          resolve({ success: false, status: 'ERROR', error: err });
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn('[RealtimeService] temp channel error status:', status);
        supabase.removeChannel(channel);
        resolve({ success: false, status });
      }
    });
  });
}
