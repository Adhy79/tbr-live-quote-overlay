import React, { useState } from 'react';
import { Radio, Copy, Check, ExternalLink, Hash } from 'lucide-react';

const PRESET_CHANNELS = ['tbr-default', 'tbr-room-01', 'tbr-room-02'];

export default function ChannelManager({
  currentChannel,
  onChannelChange
}) {
  const [customInput, setCustomInput] = useState('');
  const [copied, setCopied] = useState(false);

  const obsUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://DOMAIN.com'}/live?channel=${currentChannel}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(obsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      const clean = customInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      onChannelChange(clean);
      setCustomInput('');
    }
  };

  return (
    <div className="cyber-panel p-4 rounded-xl border border-cyber-border space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-border/50 pb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-cyber-cyan uppercase">
            Live Channel Manager
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-400">
          ACTIVE: <strong className="text-cyber-cyan font-bold">{currentChannel}</strong>
        </span>
      </div>

      {/* Preset Channels */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-gray-400">PRESETS:</span>
        {PRESET_CHANNELS.map(ch => (
          <button
            key={ch}
            onClick={() => onChannelChange(ch)}
            className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
              currentChannel === ch
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-neon-cyan/20 shadow-sm'
                : 'bg-cyber-surface border-cyber-border text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Custom Channel Form */}
      <form onSubmit={handleApplyCustom} className="flex gap-2">
        <div className="relative flex-1">
          <Hash className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom channel ID (e.g. tbr-vip-stream)"
            className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!customInput.trim()}
          className="px-3 py-1.5 bg-cyber-surface hover:bg-cyber-card border border-cyber-border hover:border-cyber-cyan text-xs font-mono text-gray-200 hover:text-white rounded disabled:opacity-40 transition-all"
        >
          SWITCH
        </button>
      </form>

      {/* OBS Studio URL Display */}
      <div className="p-3 rounded-lg bg-cyber-bg border border-cyber-border/70 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-400 font-semibold flex items-center gap-1.5">
            <span>OBS BROWSER SOURCE URL</span>
            <span className="text-[10px] text-cyber-cyan/70 font-normal">(1080x1920 @ 30 FPS)</span>
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-cyber-cyan hover:text-white bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 rounded transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'COPIED!' : 'COPY URL'}</span>
          </button>
        </div>
        <div className="font-mono text-xs text-cyber-cyan bg-black/40 p-2 rounded border border-cyber-border/50 break-all select-all flex items-center justify-between">
          <span>{obsUrl}</span>
          <a
            href={obsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-gray-500 hover:text-cyber-cyan shrink-0"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
