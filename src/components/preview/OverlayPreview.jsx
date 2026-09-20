import React, { useRef, useEffect } from 'react';
import { renderOverlay } from '../../canvas/overlayRenderer';
import { Maximize2, Shield, Eye } from 'lucide-react';

export default function OverlayPreview({
  state,
  showSafeZone,
  onToggleSafeZone
}) {
  const canvasRef = useRef(null);

  // Render whenever state or safezone changes
  useEffect(() => {
    if (canvasRef.current) {
      renderOverlay(canvasRef.current, state, { showSafeZone });
    }
  }, [state, showSafeZone]);

  return (
    <div className="cyber-panel p-4 rounded-xl border border-cyber-border flex flex-col h-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/50 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-cyber-cyan uppercase">
            Live Canvas Preview
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400 bg-cyber-surface px-2 py-0.5 rounded border border-cyber-border">
            1080 × 1920 (9:16)
          </span>
          <span className="text-[10px] font-mono text-cyber-green bg-cyber-green/10 px-2 py-0.5 rounded border border-cyber-green/30">
            TRANSPARENT
          </span>
        </div>
      </div>

      {/* Preview Viewport */}
      <div className="relative flex-1 flex items-center justify-center min-h-[520px] max-h-[750px] p-2 bg-black/40 rounded-lg overflow-hidden border border-cyber-border/60">
        {/* Subtle cyber grid/checkerboard to demonstrate transparency */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #1b2438 25%, transparent 25%), 
              linear-gradient(-45deg, #1b2438 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #1b2438 75%), 
              linear-gradient(-45deg, transparent 75%, #1b2438 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />

        {/* Scaled Canvas Container */}
        <div className="relative h-full aspect-[9/16] shadow-2xl flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={1080}
            height={1920}
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          />

          {/* Corner frame markers */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan pointer-events-none" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan pointer-events-none" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan pointer-events-none" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan pointer-events-none" />
        </div>
      </div>

      {/* Preview Footer Telemetry */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
          <span>REAL-TIME CANVAS VIEWPORT</span>
        </div>
        <div className="flex items-center gap-3">
          <span>THEME: <strong className="text-gray-300">{state.styleId}</strong></span>
          <span>FONT: <strong className="text-gray-300">{state.quoteFontSize}px</strong></span>
        </div>
      </div>
    </div>
  );
}
