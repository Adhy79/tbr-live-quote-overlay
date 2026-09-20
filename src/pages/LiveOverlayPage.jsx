import React, { useEffect, useRef, useState } from 'react';
import { getSupabaseConfig, getSupabaseClient } from '../config/supabase';
import { getChannelName } from '../services/realtimeService';
import { getDefaultOverlayState } from '../services/quotesService';
import { renderOverlay } from '../canvas/overlayRenderer';

export default function LiveOverlayPage() {
  const canvasRef = useRef(null);

  // Extract channel from query params (e.g. /live?channel=tbr-default)
  const [channelId, setChannelId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('channel') || 'tbr-default';
    }
    return 'tbr-default';
  });

  const [overlayState, setOverlayState] = useState(() => getDefaultOverlayState(channelId));
  const [status, setStatus] = useState('CONNECTING');
  const [configVersion, setConfigVersion] = useState(0);

  // Listen for storage changes (e.g. when credentials are saved in Editor)
  useEffect(() => {
    const handleStorage = () => {
      setConfigVersion(v => v + 1);
    };
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setChannelId(params.get('channel') || 'tbr-default');
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 1. Initial Render & Redraw whenever overlayState changes
  useEffect(() => {
    if (canvasRef.current) {
      renderOverlay(canvasRef.current, overlayState, { showSafeZone: false });
    }
  }, [overlayState]);

  // 2. Persistent Independent Supabase Realtime Subscription
  useEffect(() => {
    const config = getSupabaseConfig();
    if (!config.isConfigured) {
      setStatus('NOT_CONFIGURED');
      console.warn('[LiveOverlay] Supabase is not configured.');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus('NOT_CONFIGURED');
      return;
    }

    const channelName = getChannelName(channelId);
    setStatus('CONNECTING');

    // Subscribe to channel
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: true }
      }
    });

    // Listen for broadcast overlay updates
    channel.on(
      'broadcast',
      { event: 'overlay_update' },
      (eventData) => {
        if (eventData && eventData.payload) {
          const payload = eventData.payload;

          // 1. Validate payload has valid quote or required fields
          if (typeof payload === 'object' && payload !== null) {
            // 2. Replace active state
            // 3. Trigger immediate canvas redraw
            setOverlayState(prev => ({
              ...prev,
              ...payload
            }));
          }
        }
      }
    );

    // Subscribe
    channel.subscribe((subStatus, err) => {
      setStatus(subStatus);
      if (err) {
        console.error('[LiveOverlay] Subscription error:', err);
      }
    });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('[LiveOverlay] Error removing channel:', e);
      }
    };
  }, [channelId, configVersion]);

  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none select-none"
      style={{
        background: 'transparent',
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none'
      }}
    >
      {/* Logical 1080x1920 Canvas */}
      <canvas
        ref={canvasRef}
        width={1080}
        height={1920}
        className="w-full h-full block object-contain"
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none'
        }}
      />
    </div>
  );
}
