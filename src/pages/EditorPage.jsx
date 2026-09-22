import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabaseConfig, getSupabaseClient } from '../config/supabase';
import { getChannelName, publishOverlayUpdate } from '../services/realtimeService';
import { getDefaultOverlayState } from '../services/quotesService';
import HeaderBar from '../components/editor/HeaderBar';
import QuoteControls from '../components/editor/QuoteControls';
import StyleControls from '../components/editor/StyleControls';
import PositionControls from '../components/editor/PositionControls';
import GlowControls from '../components/editor/GlowControls';
import ChannelManager from '../components/editor/ChannelManager';
import PushControls from '../components/editor/PushControls';
import SupabaseModal from '../components/editor/SupabaseModal';
import OverlayPreview from '../components/preview/OverlayPreview';

export default function EditorPage() {
  // Channel state
  const [channelId, setChannelId] = useState('tbr-default');
  const [channelStatus, setChannelStatus] = useState('CONNECTING');
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [configVersion, setConfigVersion] = useState(0);
  const [quoteLanguage, setQuoteLanguage] = useState('id');

  // Overlay state
  const [overlayState, setOverlayState] = useState(() => getDefaultOverlayState('tbr-default'));
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [autoPush, setAutoPush] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [lastPushedTime, setLastPushedTime] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // References
  const activeChannelRef = useRef(null);
  const autoPushTimeoutRef = useRef(null);

  // Check Supabase config
  const checkConfig = useCallback(() => {
    const config = getSupabaseConfig();
    setSupabaseConfigured(config.isConfigured);
    return config.isConfigured;
  }, []);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorage = () => {
      checkConfig();
      setConfigVersion(v => v + 1);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [checkConfig]);

  // Connect to channel
  useEffect(() => {
    const isConfigured = checkConfig();
    if (!isConfigured) {
      setChannelStatus('NOT_CONFIGURED');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setChannelStatus('NOT_CONFIGURED');
      return;
    }

    setChannelStatus('CONNECTING');
    const channelName = getChannelName(channelId);

    // Clean up previous channel if any
    if (activeChannelRef.current) {
      try {
        supabase.removeChannel(activeChannelRef.current);
      } catch (e) {
        console.warn('Error removing channel:', e);
      }
      activeChannelRef.current = null;
    }

    // Create persistent channel with broadcast ack
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: true, self: false }
      }
    });

    // Listen for broadcast events from other sessions/producers
    channel.on(
      'broadcast',
      { event: 'overlay_update' },
      (eventData) => {
        if (eventData && eventData.payload) {
          setOverlayState(prev => ({
            ...prev,
            ...eventData.payload
          }));
        }
      }
    );

    // Subscribe to channel
    channel.subscribe((status, err) => {
      setChannelStatus(status);
      if (err) {
        console.error('[Editor] Realtime subscription error:', err);
      }
    });

    activeChannelRef.current = channel;

    return () => {
      if (activeChannelRef.current) {
        try {
          supabase.removeChannel(activeChannelRef.current);
        } catch (e) {
          console.warn('Error removing channel on cleanup:', e);
        }
        activeChannelRef.current = null;
      }
    };
  }, [channelId, configVersion, checkConfig]);

  // Handle Push to Live
  const handlePushToLive = useCallback(async (stateToPush = overlayState) => {
    if (channelStatus !== 'SUBSCRIBED') {
      console.warn('[EDITOR] cannot push, not SUBSCRIBED');
      return;
    }

    console.info('[EDITOR] PUSH TO LIVE started');
    setIsPushing(true);
    try {
      const res = await publishOverlayUpdate(
        channelId,
        stateToPush,
        activeChannelRef.current
      );
      if (res.success) {
        console.info('[EDITOR] database upsert SUCCESS');
        console.info('[EDITOR] broadcast SUCCESS');
        setLastPushedTime(Date.now());
      } else {
        console.error('[EDITOR] Push failed:', res);
      }
    } catch (err) {
      console.error('[EDITOR] Push error:', err);
    } finally {
      setIsPushing(false);
    }
  }, [channelId, channelStatus, overlayState]);

  // Handle overlay state updates
  const handleStateChange = useCallback((partial) => {
    setOverlayState(prev => {
      const next = { ...prev, ...partial };

      // If auto-push is enabled, debounce publish
      if (autoPush && channelStatus === 'SUBSCRIBED') {
        if (autoPushTimeoutRef.current) {
          clearTimeout(autoPushTimeoutRef.current);
        }
        autoPushTimeoutRef.current = setTimeout(() => {
          handlePushToLive(next);
        }, 300);
      }

      return next;
    });
  }, [autoPush, channelStatus, handlePushToLive]);

  // Handle channel change
  const handleChannelChange = (newChannelId) => {
    if (newChannelId !== channelId) {
      setChannelId(newChannelId);
      setOverlayState(prev => ({ ...prev, channelId: newChannelId }));
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid-bg text-white flex flex-col">
      {/* Top Cyber Navigation Bar */}
      <HeaderBar
        channelId={channelId}
        supabaseConfigured={supabaseConfigured}
        channelStatus={channelStatus}
        onOpenSettings={() => setIsModalOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Canvas Preview */}
        <section className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20">
          <OverlayPreview
            state={overlayState}
            showSafeZone={showSafeZone}
            onToggleSafeZone={setShowSafeZone}
          />
        </section>

        {/* Right Column: Control Panels */}
        <section className="lg:col-span-7 xl:col-span-7 space-y-5">
          {/* Master Push Action Panel */}
          <PushControls
            onPush={() => handlePushToLive(overlayState)}
            isPushing={isPushing}
            lastPushedTime={lastPushedTime}
            channelStatus={channelStatus}
            autoPush={autoPush}
            onToggleAutoPush={setAutoPush}
          />

          {/* Quote Editor */}
          <QuoteControls
            state={overlayState}
            onChange={handleStateChange}
            language={quoteLanguage}
            onLanguageChange={setQuoteLanguage}
          />

          {/* Category & Style Presets */}
          <StyleControls
            state={overlayState}
            onChange={handleStateChange}
            language={quoteLanguage}
          />

          {/* Vertical Coordinate Sliders */}
          <PositionControls
            state={overlayState}
            onChange={handleStateChange}
            showSafeZone={showSafeZone}
            onToggleSafeZone={setShowSafeZone}
          />

          {/* Typography, Glow & Frame Controls */}
          <GlowControls
            state={overlayState}
            onChange={handleStateChange}
            showSafeZone={showSafeZone}
            onToggleSafeZone={setShowSafeZone}
          />

          {/* Channel Manager */}
          <ChannelManager
            currentChannel={channelId}
            onChannelChange={handleChannelChange}
          />
        </section>
      </main>

      {/* Supabase Configuration Modal */}
      <SupabaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfigUpdated={() => {
          checkConfig();
          setConfigVersion(v => v + 1);
        }}
      />
    </div>
  );
}
