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

  const [isDebug, setIsDebug] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('debug') === '1';
    }
    return false;
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

  // 3. Persistent Independent Supabase Realtime Subscription
  useEffect(() => {
    console.info('[LIVE] initializing');

    const config = getSupabaseConfig();
    console.info('[LIVE] Supabase config isConfigured:', config.isConfigured);

    if (!config.isConfigured) {
      setStatus('NOT_CONFIGURED');
      console.warn('[LIVE] Supabase is not configured.');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus('NOT_CONFIGURED');
      console.warn('[LIVE] Supabase client failed to initialize.');
      return;
    }

    const channelName = getChannelName(channelId);
    console.info('[LIVE] channel:', channelId);
    console.info('[LIVE] realtime channel:', channelName);
    console.info('[LIVE] subscribing');

    setStatus('CONNECTING');

    // Create channel — broadcast only, no self-echo needed on Live side
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: false }
      }
    });

    // Listen for broadcast overlay updates — MUST be registered before .subscribe()
    channel.on(
      'broadcast',
      { event: 'overlay_update' },
      (eventData) => {
        console.info('[LIVE] BROADCAST RECEIVED');
        console.info('[LIVE] broadcast payload:', eventData && eventData.payload);

        if (eventData && eventData.payload) {
          const payload = eventData.payload;
          if (typeof payload === 'object' && payload !== null) {
            console.info('[LIVE] applying broadcast state');
            setOverlayState(prev => {
              // Timestamp guard: never apply older state over newer
              if (
                payload.timestamp &&
                prev.timestamp &&
                payload.timestamp <= prev.timestamp
              ) {
                console.warn('[LIVE] broadcast timestamp older than current — skipping');
                return prev;
              }
              return { ...prev, ...payload };
            });
          }
        }
      }
    );

    // Subscribe and handle initial persisted state fetch on SUBSCRIBED
    channel.subscribe(async (subStatus, err) => {
      console.info('[LIVE] subscription status:', subStatus);
      setStatus(subStatus);

      if (err) {
        console.error('[LIVE] SUBSCRIPTION ERROR:', err);
      }

      if (subStatus === 'CHANNEL_ERROR') {
        console.error('[LIVE] CHANNEL ERROR');
      }

      if (subStatus === 'CLOSED') {
        console.warn('[LIVE] CHANNEL CLOSED');
      }

      if (subStatus === 'SUBSCRIBED') {
        console.info('[LIVE] SUBSCRIBED — fetching persisted state from DB');
        try {
          const { data, error } = await supabase
            .from('overlay_state')
            .select('state')
            .eq('channel', channelId)
            .single();

          if (error) {
            console.warn('[LIVE] DB fetch error:', error);
          } else if (data && data.state) {
            console.info('[LIVE] DB state loaded, applying');
            setOverlayState(prev => {
              const fetched = data.state;
              // Prefer the already-in-memory state if it's newer (e.g. arrived via broadcast before DB settled)
              if (fetched.timestamp && prev.timestamp && fetched.timestamp <= prev.timestamp) {
                console.info('[LIVE] DB state is older than current — skipping');
                return prev;
              }
              return { ...prev, ...fetched };
            });
          }
        } catch (e) {
          console.warn('[LIVE] Error fetching persisted state:', e);
        }
        // Channel stays alive — DO NOT removeChannel here
      }
    });

    return () => {
      console.info('[LIVE] cleanup — removing channel', channelName);
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('[LIVE] Error removing channel:', e);
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

      {/* Non-intrusive diagnostic badge (ONLY visible if ?debug=1 is in URL) */}
      {isDebug && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 999999,
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#00f3ff',
            border: '1px solid rgba(0,243,255,0.6)',
            padding: '6px 10px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '11px',
            lineHeight: '1.4',
            pointerEvents: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          <div><strong>TBR LIVE DEBUG</strong></div>
          <div>STATUS: <span style={{ color: status === 'SUBSCRIBED' ? '#00ff88' : '#ffaa00' }}>{status}</span></div>
          <div>CHANNEL: {channelId}</div>
          <div>TIMESTAMP: {overlayState?.timestamp || 'none'}</div>
        </div>
      )}
    </div>
  );
}
