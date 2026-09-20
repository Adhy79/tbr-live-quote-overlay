import React from 'react';
import { Radio, Settings, Tv, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function HeaderBar({
  channelId,
  supabaseConfigured,
  channelStatus,
  onOpenSettings
}) {
  const liveOverlayUrl = `${window.location.origin}/live?channel=${channelId}`;

  return (
    <header className="border-b border-cyber-border/70 bg-cyber-bg/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Station Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyber-surface border border-cyber-cyan/40 flex items-center justify-center shadow-neon-cyan/20 shadow-md">
            <Radio className="w-5 h-5 text-cyber-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display tracking-wider text-white">
                THE BONTOT RADIO
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded">
                OVERLAY SYSTEM v2.0
              </span>
            </div>
            <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyber-red animate-ping" />
              <span>TRANSMITTING FREQUENCY: <strong className="text-cyber-cyan">104.8 FM</strong></span>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Supabase Status */}
          <StatusBadge
            label="SUPABASE"
            status={supabaseConfigured ? 'CONNECTED' : 'NOT_CONFIGURED'}
          />

          {/* Channel / Realtime Status */}
          <StatusBadge
            label="REALTIME"
            status={channelStatus}
          />

          {/* Active Channel Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan bg-cyber-cyan/5">
            <span className="opacity-70">CHANNEL:</span>
            <strong className="font-bold">{channelId}</strong>
          </div>

          {/* OBS Live View Link */}
          <a
            href={`/live?channel=${channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-cyber-border hover:border-cyber-cyan text-xs font-mono text-gray-300 hover:text-white bg-cyber-surface transition-all"
            title="Open OBS Live Canvas in new tab"
          >
            <Tv className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="hidden md:inline">OBS SOURCE</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded border border-cyber-border hover:border-cyber-cyan text-gray-400 hover:text-white bg-cyber-surface transition-all"
            title="Configure Supabase Credentials"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
