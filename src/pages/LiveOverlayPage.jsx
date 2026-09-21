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

  // 1. Enforce strict background transparency on HTML and BODY for OBS Studio Browser Source
  useEffect(() => {
    const prevHtmlBg = document.documentElement.style.background;
    const prevHtmlBgColor = document.documentElement.style.backgroundColor;
    const prevBodyBg = document.body.style.background;
    const prevBodyBgColor = document.body.style.backgroundColor;

    document.documentElement.style.setProperty('background', 'transparent', 'important');
    document.documentElement.style.setProperty('background-color', 'transparent', 'important');
    document.body.style.setProperty('background', 'transparent', 'important');
    document.body.style.setProperty('background-color', 'transparent', 'important');
    document.body.classList.remove('bg-cyber-bg');

    return () => {
      document.documentElement.style.background = prevHtmlBg;
      document.documentElement.style.backgroundColor = prevHtmlBgColor;
      document.body.style.background = prevBodyBg;
      document.body.style.backgroundColor = prevBodyBgColor;
    };
  }, []);

  // 2. Initial Render & Redraw whenever overlayState changes
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

    // Subscribe to channel (broadcast only)
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
          if (typeof payload === 'object' && payload !== null) {
            setOverlayState(prev => ({
              ...prev,
              ...payload
            }));
          }
        }
      }
    );

    // Subscribe and handle initial state fetch
    channel.subscribe(async (subStatus, err) => {
      setStatus(subStatus);
      if (err) {
        console.error('[LiveOverlay] Subscription error:', err);
      }
      if (subStatus === 'SUBSCRIBED') {
        try {
          const { data, error } = await supabase
            .from('overlay_state')
            .select('state')
            .eq('channel', channelId)
            .single();
          if (!error && data && data.state) {
            // Merge fetched state, preferring newer timestamp
            setOverlayState(prev => {
              const fetched = data.state;
              if (fetched.timestamp && prev.timestamp && fetched.timestamp <= prev.timestamp) {
                return prev;
              }
              return { ...prev, ...fetched };
            });
          }
        } catch (e) {
          console.warn('[LiveOverlay] Error fetching persisted state:', e);
        }
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
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none select-none flex items-center justify-center bg-transparent"
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
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
        className="w-full h-full block object-contain bg-transparent"
        style={{
          background: 'transparent',
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none'
        }}
      />
    </div>
  );
}
