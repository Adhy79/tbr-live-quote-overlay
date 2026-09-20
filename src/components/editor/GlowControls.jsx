import React from 'react';
import { Sliders, Sun, Shield, Type } from 'lucide-react';

export default function GlowControls({
  state,
  onChange,
  showSafeZone,
  onToggleSafeZone
}) {
  return (
    <div className="cyber-panel p-4 rounded-xl border border-cyber-border space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-border/50 pb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-cyber-cyan uppercase">
            Typography, Glow & Frame
          </h2>
        </div>
        {/* Safe Zone Toggle */}
        <button
          onClick={() => onToggleSafeZone(!showSafeZone)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
            showSafeZone
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-neon-cyan/30 shadow-sm'
              : 'bg-cyber-surface border-cyber-border text-gray-400 hover:text-white'
          }`}
          title="Toggle broadcast safe zone margins (preview only)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>SAFE ZONES: {showSafeZone ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quote Font Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300 flex items-center gap-1">
              <Type className="w-3 h-3 text-cyber-cyan" />
              <span>FONT SIZE</span>
            </span>
            <span className="text-cyber-cyan font-bold">{state.quoteFontSize} px</span>
          </div>
          <input
            type="range"
            min="32"
            max="80"
            step="2"
            value={state.quoteFontSize}
            onChange={(e) => onChange({ quoteFontSize: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>32 px</span>
            <span>Standard (52)</span>
            <span>80 px</span>
          </div>
        </div>

        {/* Glow Intensity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300 flex items-center gap-1">
              <Sun className="w-3 h-3 text-cyber-cyan" />
              <span>GLOW INTENSITY</span>
            </span>
            <span className="text-cyber-cyan font-bold">{state.glowIntensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={state.glowIntensity}
            onChange={(e) => onChange({ glowIntensity: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>0% (Off)</span>
            <span>80%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Frame Opacity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300 flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyber-cyan" />
              <span>FRAME OPACITY</span>
            </span>
            <span className="text-cyber-cyan font-bold">{state.frameOpacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={state.frameOpacity}
            onChange={(e) => onChange({ frameOpacity: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>0% (Hidden)</span>
            <span>85%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
