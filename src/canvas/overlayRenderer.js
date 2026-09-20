/**
 * HTML5 Canvas 1080x1920 Overlay Renderer
 * Designed for transparent OBS Studio Browser Source overlays.
 */

// Helper to wrap text into lines fitting within maxWidth
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Main render function
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} state - Complete overlay state
 * @param {Object} [options] - Optional settings, e.g. { showSafeZone: false }
 */
export function renderOverlay(canvas, state, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
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
    quote = '',
    category = 'NIGHT FREQUENCY',
    styleId = 'cyber-cyan',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1700,
    glowIntensity = 80,
    frameOpacity = 85,
    headerText = 'THE BONTOT RADIO',
    subHeader = 'LIVE BROADCAST // 104.8 FM',
    footerText = 'TRANSMITTING TO THE VOID',
    secondaryFooter = 'LIVE BROADCAST // 1080x1920',
  } = state || {};

  const glowAlpha = Math.max(0, Math.min(100, glowIntensity)) / 100;
  const frameAlpha = Math.max(0, Math.min(100, frameOpacity)) / 100;

  // Style color definitions
  let primaryColor = '#00f3ff';
  let secondaryColor = '#0066ff';
  let accentColor = '#ffffff';

  if (styleId === 'void-blue') {
    primaryColor = '#0088ff';
    secondaryColor = '#0033cc';
    accentColor = '#e0f0ff';
  } else if (styleId === 'matrix-amber') {
    primaryColor = '#ffb300';
    secondaryColor = '#00f3ff';
    accentColor = '#fff8e7';
  } else if (styleId === 'glitch-neon') {
    primaryColor = '#ff2a85';
    secondaryColor = '#00f3ff';
    accentColor = '#ffffff';
  } else if (styleId === 'clean-studio') {
    primaryColor = '#ffffff';
    secondaryColor = '#88a0c0';
    accentColor = '#e2e8f0';
  }

  ctx.save();

  // 1. RENDER FRAME & HUD ACCENTS
  drawCyberFrame(ctx, width, height, primaryColor, secondaryColor, frameAlpha, glowAlpha, styleId);

  // 2. RENDER HEADER (STATION TITLE)
  drawHeader(ctx, width, headerPosY, headerText, primaryColor, accentColor, glowAlpha);

  // 3. RENDER SUB-HEADER & CATEGORY BADGE
  drawSubHeader(ctx, width, subHeaderPosY, subHeader, category, primaryColor, secondaryColor, glowAlpha);

  // 4. RENDER QUOTE (CENTERED & WRAPPED)
  drawQuote(ctx, width, quotePosY, quote, quoteFontSize, accentColor, primaryColor, glowAlpha);

  // 5. RENDER FOOTER & TELEMETRY
  drawFooter(ctx, width, footerPosY, footerText, secondaryFooter, primaryColor, secondaryColor, glowAlpha);

  // 6. OPTIONAL SAFE ZONE GUIDELINES (Preview only)
  if (options.showSafeZone) {
    drawSafeZones(ctx, width, height);
  }

  ctx.restore();
}

function drawCyberFrame(ctx, width, height, primaryColor, secondaryColor, frameAlpha, glowAlpha, styleId) {
  if (frameAlpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = frameAlpha;

  const padX = 80;
  const padY = 120;
  const frameW = width - padX * 2;
  const frameH = height - padY * 2;

  // Outer border with subtle glow
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 15 * glowAlpha;
  }
  ctx.strokeRect(padX, padY, frameW, frameH);

  // Corner HUD Brackets
  const cornerSize = 40;
  ctx.lineWidth = 4;
  ctx.strokeStyle = primaryColor;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(padX - 4, padY + cornerSize);
  ctx.lineTo(padX - 4, padY - 4);
  ctx.lineTo(padX + cornerSize, padY - 4);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(padX + frameW - cornerSize, padY - 4);
  ctx.lineTo(padX + frameW + 4, padY - 4);
  ctx.lineTo(padX + frameW + 4, padY + cornerSize);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(padX - 4, padY + frameH - cornerSize);
  ctx.lineTo(padX - 4, padY + frameH + 4);
  ctx.lineTo(padX + cornerSize, padY + frameH + 4);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(padX + frameW - cornerSize, padY + frameH + 4);
  ctx.lineTo(padX + frameW + 4, padY + frameH + 4);
  ctx.lineTo(padX + frameW + 4, padY + frameH - cornerSize);
  ctx.stroke();

  // Style-specific decorations
  if (styleId === 'cyber-cyan' || styleId === 'matrix-amber') {
    // Top-Center notch
    ctx.fillStyle = primaryColor;
    ctx.fillRect(width / 2 - 60, padY - 6, 120, 4);

    // Crosshairs
    drawCrosshair(ctx, padX + 20, padY + 20, primaryColor);
    drawCrosshair(ctx, padX + frameW - 20, padY + 20, primaryColor);
    drawCrosshair(ctx, padX + 20, padY + frameH - 20, primaryColor);
    drawCrosshair(ctx, padX + frameW - 20, padY + frameH - 20, primaryColor);
  } else if (styleId === 'glitch-neon') {
    // Glitch chromatic offset line
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(padX + 4, padY - 4, frameW, frameH);
  }

  ctx.restore();
}

function drawCrosshair(ctx, x, y, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 8);
  ctx.stroke();
  ctx.restore();
}

function drawHeader(ctx, width, posY, text, primaryColor, accentColor, glowAlpha) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Station name
  ctx.font = '700 42px "Space Grotesk", "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';

  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 20 * glowAlpha;
  }

  ctx.letterSpacing = '6px';
  ctx.fillText(text.toUpperCase(), width / 2, posY);

  // Decorative radio wave bars under header
  const barWidth = 3;
  const barGap = 4;
  const numBars = 18;
  const totalW = numBars * (barWidth + barGap);
  let startX = (width - totalW) / 2;

  ctx.shadowBlur = 0;
  ctx.fillStyle = primaryColor;
  for (let i = 0; i < numBars; i++) {
    const h = 4 + Math.sin(i * 0.6) * 10;
    ctx.fillRect(startX + i * (barWidth + barGap), posY + 32 - h / 2, barWidth, h);
  }

  ctx.restore();
}

function drawSubHeader(ctx, width, posY, subHeader, category, primaryColor, secondaryColor, glowAlpha) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Subheader text
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillStyle = primaryColor;
  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 10 * glowAlpha;
  }
  ctx.fillText(subHeader.toUpperCase(), width / 2, posY);

  // Category Pill Badge
  if (category) {
    const badgeText = `// ${category.toUpperCase()} //`;
    ctx.font = '700 18px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(badgeText).width;
    const badgeY = posY + 46;

    // Badge Background
    ctx.fillStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.fillRect(width / 2 - textWidth / 2 - 16, badgeY - 14, textWidth + 32, 28);

    // Badge border
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 - textWidth / 2 - 16, badgeY - 14, textWidth + 32, 28);

    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(badgeText, width / 2, badgeY);
  }

  ctx.restore();
}

function drawQuote(ctx, width, posY, quote, fontSize, accentColor, primaryColor, glowAlpha) {
  if (!quote) return;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxQuoteWidth = 840;
  ctx.font = `600 ${fontSize}px "Space Grotesk", "Inter", sans-serif`;

  const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
  const lineHeight = fontSize * 1.35;
  const totalBlockHeight = lines.length * lineHeight;
  const startY = posY - (totalBlockHeight / 2) + (lineHeight / 2);

  // Draw decorative quote brackets
  const bracketPad = 40;
  const bracketTop = startY - lineHeight / 2 - 20;
  const bracketBottom = startY + totalBlockHeight - lineHeight / 2 + 20;

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  
  // Left bracket
  ctx.beginPath();
  ctx.moveTo(width / 2 - maxQuoteWidth / 2 - bracketPad + 20, bracketTop);
  ctx.lineTo(width / 2 - maxQuoteWidth / 2 - bracketPad, bracketTop);
  ctx.lineTo(width / 2 - maxQuoteWidth / 2 - bracketPad, bracketBottom);
  ctx.lineTo(width / 2 - maxQuoteWidth / 2 - bracketPad + 20, bracketBottom);
  ctx.stroke();

  // Right bracket
  ctx.beginPath();
  ctx.moveTo(width / 2 + maxQuoteWidth / 2 + bracketPad - 20, bracketTop);
  ctx.lineTo(width / 2 + maxQuoteWidth / 2 + bracketPad, bracketTop);
  ctx.lineTo(width / 2 + maxQuoteWidth / 2 + bracketPad, bracketBottom);
  ctx.lineTo(width / 2 + maxQuoteWidth / 2 + bracketPad - 20, bracketBottom);
  ctx.stroke();

  // Render text lines
  ctx.globalAlpha = 1;
  ctx.fillStyle = accentColor;
  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 25 * glowAlpha;
  }

  lines.forEach((line, index) => {
    const currentY = startY + index * lineHeight;
    ctx.fillText(line, width / 2, currentY);
  });

  ctx.restore();
}

function drawFooter(ctx, width, posY, footerText, secondaryFooter, primaryColor, secondaryColor, glowAlpha) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Primary footer text
  ctx.font = '600 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 12 * glowAlpha;
  }
  ctx.fillText(footerText.toUpperCase(), width / 2, posY);

  // Secondary footer telemetry
  ctx.font = '400 18px "JetBrains Mono", monospace';
  ctx.fillStyle = primaryColor;
  ctx.shadowBlur = 0;
  ctx.fillText(secondaryFooter.toUpperCase(), width / 2, posY + 40);

  // Live on-air pulse dot
  const dotX = width / 2 - 120;
  const dotY = posY + 85;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ff2a5f';
  ctx.shadowColor = '#ff2a5f';
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ff2a5f';
  ctx.textAlign = 'left';
  ctx.shadowBlur = 0;
  ctx.fillText('ON AIR // TBR LIVE STREAM', dotX + 14, dotY);

  ctx.restore();
}

function drawSafeZones(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 42, 95, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 8]);

  // Action Safe (93%)
  const actionMarginX = width * 0.035;
  const actionMarginY = height * 0.035;
  ctx.strokeRect(actionMarginX, actionMarginY, width - actionMarginX * 2, height - actionMarginY * 2);

  // Title Safe (90%)
  const titleMarginX = width * 0.05;
  const titleMarginY = height * 0.05;
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
  ctx.strokeRect(titleMarginX, titleMarginY, width - titleMarginX * 2, height - titleMarginY * 2);

  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
  ctx.fillText('TITLE SAFE (90%)', titleMarginX + 8, titleMarginY + 20);

  ctx.fillStyle = 'rgba(255, 42, 95, 0.6)';
  ctx.fillText('ACTION SAFE (93%)', actionMarginX + 8, actionMarginY + 20);

  ctx.restore();
}
