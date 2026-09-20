import React from 'react';
import { MoveVertical, RotateCcw } from 'lucide-react';

export default function PositionControls({
  state,
  onChange
}) {
  const resetPositions = () => {
    onChange({
      quotePosY: 960,
      headerPosY: 260,
      subHeaderPosY: 330,
      footerPosY: 1700
    });
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
        <button
          onClick={resetPositions}
          className="flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-cyber-cyan transition-colors"
          title="Reset positions to default coordinates"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET DEFAULTS</span>
        </button>
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

        {/* Footer Y Position */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300">FOOTER POSITION Y</span>
            <span className="text-cyber-cyan font-bold">{state.footerPosY} px</span>
          </div>
          <input
            type="range"
            min="1300"
            max="1850"
            step="10"
            value={state.footerPosY}
            onChange={(e) => onChange({ footerPosY: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>1300 px</span>
            <span>Default (1700)</span>
            <span>1850 px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
