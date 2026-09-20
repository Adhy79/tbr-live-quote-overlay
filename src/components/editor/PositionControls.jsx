import React from 'react';
import { MoveVertical, RotateCcw, Shield } from 'lucide-react';

export default function PositionControls({
  state,
  onChange,
  showSafeZone,
  onToggleSafeZone
}) {
  const resetPositions = () => {
    onChange({
      quotePosY: 960,
      headerPosY: 260,
      subHeaderPosY: 330,
      footerPosY: 1200
    });
  };

  // Determine current footer zone for live feedback
  const getFooterZoneBadge = (posY) => {
    if (posY <= 1280) {
      return (
        <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/30">
          SAFE ZONE
        </span>
      );
    }
    if (posY <= 1450) {
      return (
        <span className="text-[10px] font-mono text-cyber-yellow bg-cyber-yellow/10 px-2 py-0.5 rounded border border-cyber-yellow/30">
          WARNING ZONE
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/30">
        COMMENTS OCCLUSION
      </span>
    );
  };

  return (
    <div className="cyber-panel p-4 rounded-xl border border-cyber-border space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-border/50 pb-2">
        <div className="flex items-center gap-2">
          <MoveVertical className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-cyber-cyan uppercase">
            Vertical Positioning (Y-Axis)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onToggleSafeZone && (
            <button
              onClick={() => onToggleSafeZone(!showSafeZone)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                showSafeZone
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-neon-cyan/30 shadow-sm'
                  : 'bg-cyber-surface border-cyber-border text-gray-400 hover:text-white'
              }`}
              title="Toggle TikTok LIVE Safe Zone guidelines on preview canvas"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>SAFE ZONE: {showSafeZone ? 'ON' : 'OFF'}</span>
            </button>
          )}
          <button
            onClick={resetPositions}
            className="flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-cyber-cyan transition-colors"
            title="Reset positions to default coordinates"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET DEFAULTS</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quote Y Position */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300">QUOTE POSITION Y</span>
            <span className="text-cyber-cyan font-bold">{state.quotePosY} px</span>
          </div>
          <input
            type="range"
            min="400"
            max="1500"
            step="10"
            value={state.quotePosY}
            onChange={(e) => onChange({ quotePosY: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>400 px</span>
            <span>Center (960)</span>
            <span>1500 px</span>
          </div>
        </div>

        {/* Header Y Position */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300">HEADER POSITION Y</span>
            <span className="text-cyber-cyan font-bold">{state.headerPosY} px</span>
          </div>
          <input
            type="range"
            min="100"
            max="600"
            step="10"
            value={state.headerPosY}
            onChange={(e) => onChange({ headerPosY: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>100 px</span>
            <span>Default (260)</span>
            <span>600 px</span>
          </div>
        </div>

        {/* SubHeader Y Position */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300">SUB-HEADER POSITION Y</span>
            <span className="text-cyber-cyan font-bold">{state.subHeaderPosY} px</span>
          </div>
          <input
            type="range"
            min="150"
            max="700"
            step="10"
            value={state.subHeaderPosY}
            onChange={(e) => onChange({ subHeaderPosY: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>150 px</span>
            <span>Default (330)</span>
            <span>700 px</span>
          </div>
        </div>

        {/* Footer Y Position with TikTok Safe Zone integration */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-300">FOOTER POSITION Y</span>
            <div className="flex items-center gap-2">
              {getFooterZoneBadge(state.footerPosY)}
              <span className="text-cyber-cyan font-bold">{state.footerPosY} px</span>
            </div>
          </div>
          <input
            type="range"
            min="800"
            max="1800"
            step="10"
            value={state.footerPosY}
            onChange={(e) => onChange({ footerPosY: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-cyber-cyan">800 px (Safe)</span>
            <span className="text-cyber-cyan font-bold">Default (1200)</span>
            <span className="text-cyber-yellow">1280 (Warn)</span>
            <span className="text-red-400">1800 (Blocked)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
