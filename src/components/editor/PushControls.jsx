import React from 'react';
import { Send, Zap, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function PushControls({
  onPush,
  isPushing,
  lastPushedTime,
  channelStatus,
  autoPush,
  onToggleAutoPush
}) {
  const isSubscribed = channelStatus === 'SUBSCRIBED';

  return (
    <div className="cyber-panel p-4 rounded-xl border border-cyber-border space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Auto Push Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={autoPush}
              onChange={(e) => onToggleAutoPush(e.target.checked)}
              className="sr-only"
            />
            <div className={clsx(
              'w-10 h-5 rounded-full transition-colors border',
              autoPush ? 'bg-cyber-cyan border-cyber-cyan' : 'bg-cyber-surface border-cyber-border'
            )} />
            <div className={clsx(
              'absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
              autoPush && 'transform translate-x-5'
            )} />
          </div>
          <span className="text-xs font-mono text-gray-300 font-semibold flex items-center gap-1">
            <Zap className={clsx('w-3.5 h-3.5', autoPush ? 'text-cyber-cyan' : 'text-gray-500')} />
            <span>AUTO-PUSH LIVE</span>
          </span>
        </label>

        {/* Last Pushed Feedback */}
        {lastPushedTime && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
            <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>LAST BROADCAST: {new Date(lastPushedTime).toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* PUSH TO LIVE Master Action Button */}
      <button
        onClick={onPush}
        disabled={!isSubscribed || isPushing}
        className={clsx(
          'w-full py-3.5 px-6 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden',
          isSubscribed
            ? 'bg-gradient-to-r from-cyber-cyan via-cyan-400 to-cyber-blue text-black shadow-neon-glow hover:brightness-110 active:scale-[0.99] cursor-pointer'
            : 'bg-cyber-surface/60 border border-cyber-border text-gray-500 cursor-not-allowed'
        )}
      >
        <Send className={clsx('w-4 h-4', isPushing && 'animate-bounce')} />
        <span>{isPushing ? 'BROADCASTING...' : 'PUSH TO LIVE'}</span>
      </button>

      {/* Status warning if not ready */}
      {!isSubscribed && (
        <div className="flex items-center gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Channel not subscribed. Publishing is locked until Realtime connects.</span>
        </div>
      )}
    </div>
  );
}
