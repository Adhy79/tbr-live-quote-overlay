/**
 * HTML5 Canvas 1080x1920 Overlay Renderer
 * Designed for transparent OBS Studio Browser Source overlays.
 * 
 * CRITICAL: Canvas must remain 100% transparent.
 * NO full-screen background fills, gradients, or paper textures.
 */

import { getTheme } from './themes.js';

/**
 * Main render function
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} state - Complete overlay state
 * @param {Object} [options] - Optional settings, e.g. { showSafeZone: false }
 */
export function renderOverlay(canvas, state, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const width = 1080;
  const height = 1920;

  // Ensure internal dimensions are strictly 1080x1920
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // Clear canvas to full transparency
  ctx.clearRect(0, 0, width, height);

  const {
    styleId = 'cyber-cyan',
    glowIntensity = 80,
    frameOpacity = 85,
  } = state || {};

  const glowAlpha = Math.max(0, Math.min(100, glowIntensity)) / 100;
  const frameAlpha = Math.max(0, Math.min(100, frameOpacity)) / 100;

  // Get active visual theme
  const theme = getTheme(styleId);

  ctx.save();

  // 1. Render theme graphics and typography (100% transparent overlay)
  theme.render(ctx, width, height, state || {}, glowAlpha, frameAlpha);

  // 2. OPTIONAL SAFE ZONE GUIDELINES (Editor preview only, never in OBS /live)
  if (options.showSafeZone) {
    drawSafeZones(ctx, width, height);
  }

  ctx.restore();
}

/**
 * TikTok LIVE Safe Zone Guidelines (1080x1920)
 * Only rendered in editor preview when toggled ON.
 * Strictly omitted in Live/OBS output.
 */
function drawSafeZones(ctx, width, height) {
  ctx.save();

  // 1. TOP SYSTEM / PROFILE AREA (0 - 180px)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(0, 0, width, 180);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(0, 180);
  ctx.lineTo(width, 180);
  ctx.stroke();

  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
  ctx.textAlign = 'left';
  ctx.fillText('TOP UI ZONE (0 - 180px) // HOST PROFILE & LIVE STATS', 40, 45);

  // 2. TIKTOK LIVE BOTTOM UI & COMMENTS AREA (1450 - 1920px)
  ctx.fillStyle = 'rgba(255, 42, 95, 0.12)';
  ctx.fillRect(0, 1450, width, height - 1450);

  // Boundary line at 1450px
  ctx.strokeStyle = '#ff2a5f';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(0, 1450);
  ctx.lineTo(width, 1450);
  ctx.stroke();

  // Interaction bar sub-divider at 1720px
  ctx.strokeStyle = 'rgba(255, 42, 95, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, 1720);
  ctx.lineTo(width, 1720);
  ctx.stroke();

  // Labels for Bottom UI & Comments Area
  ctx.fillStyle = '#ff2a5f';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('⛔ BOTTOM UI & COMMENTS AREA (1450 - 1920px)', 40, 1485);
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(255, 150, 170, 0.9)';
  ctx.fillText('HIGH OCCLUSION // Viewer comments stream & interaction bar cover this zone', 40, 1510);
  ctx.fillText('INTERACTION BAR (1720 - 1920px) // Comment input, share & gift buttons', 40, 1750);

  // 3. TIKTOK LIVE WARNING AREA / BUFFER (1280 - 1450px)
  ctx.fillStyle = 'rgba(255, 180, 0, 0.08)';
  ctx.fillRect(0, 1280, width, 1450 - 1280);

  // Boundary line at 1280px
  ctx.strokeStyle = '#ffb300';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(0, 1280);
  ctx.lineTo(width, 1280);
  ctx.stroke();

  ctx.fillStyle = '#ffb300';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('⚠️ WARNING AREA (1280 - 1450px)', 40, 1315);
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(255, 220, 130, 0.9)';
  ctx.fillText('MODERATE OCCLUSION // Comment surge & gift animation zone', 40, 1340);

  // 4. TIKTOK LIVE SAFE AREA (180 - 1280px)
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(0, 1280);
  ctx.lineTo(width, 1280);
  ctx.stroke();

  ctx.fillStyle = '#00f3ff';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('✅ SAFE AREA (180 - 1280px) // OPTIMAL VISIBILITY', 40, 1250);

  // Side margins / action safe (54px on each side)
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.strokeRect(54, 180, width - 108, 1100);

  ctx.restore();
}
