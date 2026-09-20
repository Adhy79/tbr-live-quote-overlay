/**
 * TBR Live Quote Overlay - Visual Themes Collection
 * 10 Distinct Visual Themes for 1080x1920 Transparent Canvas
 * 
 * CRITICAL: Canvas must remain 100% transparent.
 * NO full-screen background fills, gradients, or paper textures.
 */

// Helper to wrap text into lines fitting within maxWidth
export function wrapText(ctx, text, maxWidth) {
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

export const THEMES = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Radio',
    icon: '⚡',
    desc: 'Futuristic neon HUD, telemetry brackets & electric cyber glow',
    render: renderCyberRadio
  },
  {
    id: 'cinematic-night',
    name: 'Cinematic Night',
    icon: '🌙',
    desc: 'Minimal cinematic typography, widescreen rules & nocturnal space',
    render: renderCinematicNight
  },
  {
    id: 'minimal-aesthetic',
    name: 'Minimal Aesthetic',
    icon: '✦',
    desc: 'Clean modern layout, delicate geometric marks & generous whitespace',
    render: renderMinimalAesthetic
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    icon: '🌸',
    desc: 'Dusty pink, sage & lavender typography accents on pure transparent canvas',
    render: renderSoftPastel
  },
  {
    id: 'scrapbook',
    name: 'Scrapbook',
    icon: '✂',
    desc: 'Washi-tape strips, torn paper labels, stars & handmade collage accents',
    render: renderScrapbook
  },
  {
    id: 'handwritten-diary',
    name: 'Handwritten Diary',
    icon: '✍',
    desc: 'Intimate handwritten script accents, underline strokes & playful doodles',
    render: renderHandwrittenDiary
  },
  {
    id: 'editorial',
    name: 'Editorial',
    icon: '📰',
    desc: 'Modern magazine composition, bold serif hierarchy & architectural rules',
    render: renderEditorial
  },
  {
    id: 'dark-minimal',
    name: 'Dark Minimal',
    icon: '◼',
    desc: 'Ultra-restrained monochrome aesthetic with subtle off-white tones',
    render: renderDarkMinimal
  },
  {
    id: 'classic-radio',
    name: 'Classic Radio',
    icon: '📻',
    desc: 'Retro broadcast dials, frequency meters & vintage ON AIR indicators',
    render: renderClassicRadio
  },
  {
    id: 'diary-night',
    name: 'Diary Night',
    icon: '🌙',
    desc: 'TBR midnight session hybrid: handwritten intimacy meets nocturnal cinema',
    render: renderDiaryNight
  }
];

export function getTheme(themeId) {
  // Support legacy theme IDs as cyber-cyan fallbacks
  if (['void-blue', 'matrix-amber', 'glitch-neon', 'clean-studio'].includes(themeId)) {
    return THEMES[0]; // Cyber Radio
  }
  return THEMES.find(t => t.id === themeId) || THEMES[0];
}

/* ==========================================================================
   1. CYBER RADIO (Preserved original implementation)
   ========================================================================== */
function renderCyberRadio(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = 'NIGHT FREQUENCY',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    subHeader = 'LIVE BROADCAST // 104.8 FM',
    footerText = 'TRANSMITTING TO THE VOID',
    secondaryFooter = 'LIVE BROADCAST // 1080x1920',
  } = state;

  const primaryColor = '#00f3ff';
  const secondaryColor = '#0066ff';
  const accentColor = '#ffffff';

  // Frame
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha;
    const padX = 80, padY = 120;
    const frameW = width - padX * 2, frameH = height - padY * 2;

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

    // Top-Center notch
    ctx.fillStyle = primaryColor;
    ctx.fillRect(width / 2 - 60, padY - 6, 120, 4);

    // Crosshairs
    drawCrosshair(ctx, padX + 20, padY + 20, primaryColor);
    drawCrosshair(ctx, padX + frameW - 20, padY + 20, primaryColor);
    drawCrosshair(ctx, padX + 20, padY + frameH - 20, primaryColor);
    drawCrosshair(ctx, padX + frameW - 20, padY + frameH - 20, primaryColor);

    ctx.restore();
  }

  // Header
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 42px "Space Grotesk", "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 20 * glowAlpha;
  }
  ctx.letterSpacing = '6px';
  ctx.fillText(headerText.toUpperCase(), width / 2, headerPosY);

  // Equalizer bars
  const barWidth = 3, barGap = 4, numBars = 18;
  const totalW = numBars * (barWidth + barGap);
  const startX = (width - totalW) / 2;
  ctx.shadowBlur = 0;
  ctx.fillStyle = primaryColor;
  for (let i = 0; i < numBars; i++) {
    const h = 4 + Math.sin(i * 0.6) * 10;
    ctx.fillRect(startX + i * (barWidth + barGap), headerPosY + 32 - h / 2, barWidth, h);
  }
  ctx.restore();

  // Sub-Header & Badge
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillStyle = primaryColor;
  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 10 * glowAlpha;
  }
  ctx.fillText(subHeader.toUpperCase(), width / 2, subHeaderPosY);

  if (category) {
    const badgeText = `// ${category.toUpperCase()} //`;
    ctx.font = '700 18px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(badgeText).width;
    const badgeY = subHeaderPosY + 46;
    ctx.fillStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.fillRect(width / 2 - textWidth / 2 - 16, badgeY - 14, textWidth + 32, 28);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 - textWidth / 2 - 16, badgeY - 14, textWidth + 32, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(badgeText, width / 2, badgeY);
  }
  ctx.restore();

  // Quote
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;
    ctx.font = `600 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.35;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    const bracketPad = 40;
    const bracketTop = startY - lineHeight / 2 - 20;
    const bracketBottom = startY + totalBlockHeight - lineHeight / 2 + 20;

    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(width / 2 - maxQuoteWidth / 2 - bracketPad + 20, bracketTop);
    ctx.lineTo(width / 2 - maxQuoteWidth / 2 - bracketPad, bracketTop);
    ctx.lineTo(width / 2 - maxQuoteWidth / 2 - bracketPad, bracketBottom);
    ctx.lineTo(width / 2 - maxQuoteWidth / 2 - bracketPad + 20, bracketBottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2 + maxQuoteWidth / 2 + bracketPad - 20, bracketTop);
    ctx.lineTo(width / 2 + maxQuoteWidth / 2 + bracketPad, bracketTop);
    ctx.lineTo(width / 2 + maxQuoteWidth / 2 + bracketPad, bracketBottom);
    ctx.lineTo(width / 2 + maxQuoteWidth / 2 + bracketPad - 20, bracketBottom);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.fillStyle = accentColor;
    if (glowAlpha > 0) {
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 25 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  if (glowAlpha > 0) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 12 * glowAlpha;
  }
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '400 18px "JetBrains Mono", monospace';
  ctx.fillStyle = primaryColor;
  ctx.shadowBlur = 0;
  ctx.fillText(secondaryFooter.toUpperCase(), width / 2, footerPosY + 40);

  const dotX = width / 2 - 120;
  const dotY = footerPosY + 85;
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

/* ==========================================================================
   2. CINEMATIC NIGHT
   ========================================================================== */
function renderCinematicNight(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = 'NIGHT FREQUENCY',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    subHeader = 'LIVE BROADCAST // 104.8 FM',
    footerText = 'TRANSMITTING TO THE VOID',
    secondaryFooter = 'LIVE BROADCAST // 1080x1920',
  } = state;

  const cyanLight = '#93c5fd';
  const moonlight = '#f8fafc';

  // Widescreen letterbox cinematic rules
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.7;
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
    ctx.lineWidth = 1.5;

    // Top widescreen rule
    ctx.beginPath();
    ctx.moveTo(120, 140);
    ctx.lineTo(width - 120, 140);
    ctx.stroke();

    // Bottom widescreen rule
    ctx.beginPath();
    ctx.moveTo(120, height - 140);
    ctx.lineTo(width - 120, height - 140);
    ctx.stroke();

    // Center cross markers on rules
    ctx.strokeStyle = cyanLight;
    drawCrosshair(ctx, width / 2, 140, cyanLight);
    drawCrosshair(ctx, width / 2, height - 140, cyanLight);
    ctx.restore();
  }

  // Header: Elegant tracking with centered star
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = moonlight;
  if (glowAlpha > 0) {
    ctx.shadowColor = '#60a5fa';
    ctx.shadowBlur = 15 * glowAlpha;
  }
  ctx.letterSpacing = '10px';
  ctx.fillText(headerText.toUpperCase(), width / 2, headerPosY);

  // Subtitle rule with star
  ctx.fillStyle = cyanLight;
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('✦', width / 2, headerPosY + 32);

  ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, headerPosY + 32);
  ctx.lineTo(width / 2 - 24, headerPosY + 32);
  ctx.moveTo(width / 2 + 24, headerPosY + 32);
  ctx.lineTo(width / 2 + 140, headerPosY + 32);
  ctx.stroke();
  ctx.restore();

  // SubHeader
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '400 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.letterSpacing = '3px';
  ctx.fillText(`SCENE: NIGHT // ${category ? category.toUpperCase() : 'NOCTURNAL'}`, width / 2, subHeaderPosY);
  ctx.restore();

  // Quote: Luminous cinematic typography
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 860;
    ctx.font = `500 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.4;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = moonlight;
    if (glowAlpha > 0) {
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 20 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Widescreen subtitle / timecode format
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = moonlight;
  ctx.letterSpacing = '2px';
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '400 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`[ TBR 104.8 FM // 24-HOUR BROADCAST ]`, width / 2, footerPosY + 38);

  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`● REC 02:00:00 // NOCTURNAL FREQUENCY`, width / 2, footerPosY + 75);
  ctx.restore();
}

/* ==========================================================================
   3. MINIMAL AESTHETIC
   ========================================================================== */
function renderMinimalAesthetic(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  // Frame: 4 corner minimal crosshairs
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.6;
    drawCrosshair(ctx, 100, 140, 'rgba(255, 255, 255, 0.5)');
    drawCrosshair(ctx, width - 100, 140, 'rgba(255, 255, 255, 0.5)');
    drawCrosshair(ctx, 100, height - 140, 'rgba(255, 255, 255, 0.5)');
    drawCrosshair(ctx, width - 100, height - 140, 'rgba(255, 255, 255, 0.5)');
    ctx.restore();
  }

  // Header: Clean sans-serif with 3 geometric dots
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 32px "Space Grotesk", "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.letterSpacing = '5px';
  ctx.fillText(headerText.toUpperCase(), width / 2, headerPosY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '14px "Space Grotesk", sans-serif';
  ctx.fillText('· · ·', width / 2, headerPosY + 28);
  ctx.restore();

  // SubHeader / Category: Thin 1px rounded pill
  if (category) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    const text = category.toUpperCase();
    const tw = ctx.measureText(text).width;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 - tw / 2 - 16, subHeaderPosY - 14, tw + 32, 28);
    ctx.fillStyle = '#a1a1aa';
    ctx.fillText(text, width / 2, subHeaderPosY);
    ctx.restore();
  }

  // Quote: Crisp typography with vertical accent bar on left
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 820;
    ctx.font = `500 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.38;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    // Left vertical accent bar
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - maxQuoteWidth / 2 - 30, startY - lineHeight / 2);
    ctx.lineTo(width / 2 - maxQuoteWidth / 2 - 30, startY + totalBlockHeight - lineHeight / 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    if (glowAlpha > 0) {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 10 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Minimalist thin line & clean typography
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 160, footerPosY - 25);
  ctx.lineTo(width / 2 + 160, footerPosY - 25);
  ctx.stroke();

  ctx.font = '500 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#e4e4e7';
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '400 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#71717a';
  ctx.fillText('● THE BONTOT RADIO // MINIMAL FREQUENCY', width / 2, footerPosY + 35);
  ctx.restore();
}

/* ==========================================================================
   4. SOFT PASTEL
   ========================================================================== */
function renderSoftPastel(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  const pastelPink = '#fbcfe8';
  const pastelLavender = '#c084fc';
  const pastelCream = '#fef3c7';

  // Frame: Rounded pastel dashed border with corner blossoms
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.75;
    ctx.strokeStyle = pastelPink;
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    drawRoundedRect(ctx, 90, 130, width - 180, height - 260, 32);
    ctx.stroke();

    // Corner decorative flower icons
    ctx.font = '24px sans-serif';
    ctx.fillStyle = pastelLavender;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✿', 110, 150);
    ctx.fillText('✿', width - 110, 150);
    ctx.fillText('✿', 110, height - 150);
    ctx.fillText('✿', width - 110, height - 150);
    ctx.restore();
  }

  // Header: Warm pastel cream with flower accents
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 38px "Space Grotesk", sans-serif';
  ctx.fillStyle = pastelCream;
  if (glowAlpha > 0) {
    ctx.shadowColor = pastelPink;
    ctx.shadowBlur = 15 * glowAlpha;
  }
  ctx.fillText(`✿  ${headerText.toUpperCase()}  ✿`, width / 2, headerPosY);
  ctx.restore();

  // SubHeader / Category: Lavender rounded pill
  if (category) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    const text = `♥ ${category.toUpperCase()} ♥`;
    const tw = ctx.measureText(text).width;
    ctx.strokeStyle = pastelLavender;
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, width / 2 - tw / 2 - 18, subHeaderPosY - 15, tw + 36, 30, 15);
    ctx.stroke();
    ctx.fillStyle = pastelPink;
    ctx.fillText(text, width / 2, subHeaderPosY);
    ctx.restore();
  }

  // Quote: Warm cream with soft pink glow
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;
    ctx.font = `600 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.38;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = '#fffbeb';
    if (glowAlpha > 0) {
      ctx.shadowColor = pastelPink;
      ctx.shadowBlur = 18 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Wavy line and pastel heart on air
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wavy decorative line
  ctx.strokeStyle = pastelLavender;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const waveW = 200;
  const wStart = width / 2 - waveW / 2;
  ctx.moveTo(wStart, footerPosY - 25);
  for (let i = 0; i <= waveW; i += 20) {
    ctx.quadraticCurveTo(wStart + i + 5, footerPosY - 30, wStart + i + 10, footerPosY - 25);
    ctx.quadraticCurveTo(wStart + i + 15, footerPosY - 20, wStart + i + 20, footerPosY - 25);
  }
  ctx.stroke();

  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = pastelPink;
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = pastelCream;
  ctx.fillText('♥ ON AIR // SOFT SESSIONS // 104.8 FM', width / 2, footerPosY + 40);
  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/* ==========================================================================
   5. SCRAPBOOK
   ========================================================================== */
function renderScrapbook(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  // Frame: Washi tape strips on corners + hand-drawn wobbly frame
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.85;

    // Top-Left washi tape strip (translucent pastel yellow)
    drawWashiTape(ctx, 110, 140, 110, 26, -15, 'rgba(254, 240, 138, 0.7)');
    // Top-Right washi tape strip (translucent pastel pink)
    drawWashiTape(ctx, width - 110, 140, 110, 26, 15, 'rgba(244, 114, 182, 0.7)');
    // Bottom-Left tape strip
    drawWashiTape(ctx, 110, height - 140, 110, 26, 12, 'rgba(103, 232, 249, 0.7)');
    // Bottom-Right tape strip
    drawWashiTape(ctx, width - 110, height - 140, 110, 26, -12, 'rgba(254, 240, 138, 0.7)');

    // Wobbly hand-drawn border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    drawWobblyRect(ctx, 80, 120, width - 160, height - 240);

    // Cute scrapbook doodle stars & hearts in margins
    drawDoodleStar(ctx, 120, 280, 14, '#fef08a');
    drawDoodleStar(ctx, width - 120, 280, 14, '#fef08a');
    drawDoodleHeart(ctx, 120, height - 280, 14, '#f472b6');
    drawDoodleHeart(ctx, width - 120, height - 280, 14, '#f472b6');
    ctx.restore();
  }

  // Header: Tape-banner style header
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Center washi tape banner behind header
  drawWashiTape(ctx, width / 2, headerPosY, 440, 48, -0.8, 'rgba(254, 240, 138, 0.35)');

  ctx.font = '700 38px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`★ ${headerText.toUpperCase()} ★`, width / 2, headerPosY);
  ctx.restore();

  // SubHeader / Category: Torn-paper label effect
  if (category) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    const text = `// ${category.toUpperCase()} //`;
    const tw = ctx.measureText(text).width;
    // Small tape piece
    drawWashiTape(ctx, width / 2, subHeaderPosY, tw + 40, 30, 0.5, 'rgba(244, 114, 182, 0.4)');
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, width / 2, subHeaderPosY);
    ctx.restore();
  }

  // Quote: Expressive typography with doodle underline
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;
    ctx.font = `600 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.38;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = '#ffffff';
    if (glowAlpha > 0) {
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 12 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    // Hand-drawn wavy underline beneath the quote
    const underlineY = startY + totalBlockHeight - lineHeight / 2 + 25;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const uW = Math.min(maxQuoteWidth, 400);
    const uX = width / 2 - uW / 2;
    ctx.moveTo(uX, underlineY);
    ctx.quadraticCurveTo(uX + uW * 0.25, underlineY + 6, uX + uW * 0.5, underlineY - 2);
    ctx.quadraticCurveTo(uX + uW * 0.75, underlineY - 8, uX + uW, underlineY + 4);
    ctx.stroke();
    ctx.restore();
  }

  // Footer: Scrapbook ticket telemetry
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawWashiTape(ctx, width / 2, footerPosY, 380, 42, 1, 'rgba(103, 232, 249, 0.35)');

  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('★ ON AIR // CASSETTE NO. 104.8 ★', width / 2, footerPosY + 45);
  ctx.restore();
}

function drawWashiTape(ctx, centerX, centerY, w, h, angleDeg, color) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  // Serrated edges at both ends
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(-w / 2, -h / 2, 6, h);
  ctx.fillRect(w / 2 - 6, -h / 2, 6, h);
  ctx.restore();
}

function drawWobblyRect(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y + 2);
  ctx.lineTo(x + w - 2, y + h);
  ctx.lineTo(x + 1, y + h - 1);
  ctx.closePath();
  ctx.stroke();
}

function drawDoodleStar(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      cx + r * Math.cos(((18 + i * 72) * Math.PI) / 180),
      cy - r * Math.sin(((18 + i * 72) * Math.PI) / 180)
    );
    ctx.lineTo(
      cx + (r / 2) * Math.cos(((54 + i * 72) * Math.PI) / 180),
      cy - (r / 2) * Math.sin(((54 + i * 72) * Math.PI) / 180)
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDoodleHeart(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const d = size;
  ctx.moveTo(cx, cy + d / 4);
  ctx.quadraticCurveTo(cx, cy, cx - d / 2, cy);
  ctx.quadraticCurveTo(cx - d, cy, cx - d, cy + d / 2);
  ctx.quadraticCurveTo(cx - d, cy + (d * 3) / 4, cx, cy + d * 1.2);
  ctx.quadraticCurveTo(cx + d, cy + (d * 3) / 4, cx + d, cy + d / 2);
  ctx.quadraticCurveTo(cx + d, cy, cx + d / 2, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + d / 4);
  ctx.fill();
  ctx.restore();
}

/* ==========================================================================
   6. HANDWRITTEN DIARY
   ========================================================================== */
function renderHandwrittenDiary(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  // Frame: Notebook margin line on left & binder rings
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.7;

    // Vertical red notebook margin line
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(110, 100);
    ctx.lineTo(110, height - 100);
    ctx.stroke();

    // Notebook ring punch holes on far left
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let y = 180; y < height - 180; y += 160) {
      ctx.beginPath();
      ctx.arc(60, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Header: Handwritten diary header
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 44px "Caveat", cursive, sans-serif';
  ctx.fillStyle = '#fef08a';
  if (glowAlpha > 0) {
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10 * glowAlpha;
  }
  ctx.fillText(`dear midnight... ~ ${headerText}`, width / 2, headerPosY);
  ctx.restore();

  // SubHeader: Date / entry note with squiggly underline
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`[ DIARY ENTRY // ${category ? category.toUpperCase() : 'PERSONAL NOTE'} ]`, width / 2, subHeaderPosY);

  // Squiggly hand-drawn underline
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const squigW = 260;
  const sX = width / 2 - squigW / 2;
  ctx.moveTo(sX, subHeaderPosY + 18);
  for (let i = 0; i <= squigW; i += 16) {
    ctx.quadraticCurveTo(sX + i + 4, subHeaderPosY + 22, sX + i + 8, subHeaderPosY + 18);
    ctx.quadraticCurveTo(sX + i + 12, subHeaderPosY + 14, sX + i + 16, subHeaderPosY + 18);
  }
  ctx.stroke();
  ctx.restore();

  // Quote: Expressive handwritten font (Caveat) with high readability
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;
    // Caveat runs slightly smaller, so we boost size slightly for maximum impact
    const effectiveSize = Math.max(quoteFontSize, 52);
    ctx.font = `600 ${effectiveSize}px "Caveat", "Space Grotesk", cursive, sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = effectiveSize * 1.35;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = '#fef9c3';
    if (glowAlpha > 0) {
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 15 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Handwritten sign-off with heart
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 32px "Caveat", cursive, sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText(`— with love, the bontot radio ~ ♡`, width / 2, footerPosY);

  ctx.font = '400 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY + 42);
  ctx.restore();
}

/* ==========================================================================
   7. EDITORIAL
   ========================================================================== */
function renderEditorial(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  // Frame: High-fashion architectural rules & issue labels
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.8;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    // Top horizontal architectural double rule
    ctx.beginPath();
    ctx.moveTo(90, 140);
    ctx.lineTo(width - 90, 140);
    ctx.moveTo(90, 146);
    ctx.lineTo(width - 90, 146);
    ctx.stroke();

    // Top metadata text
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText('VOL. 26 // ISSUE 09', 90, 125);
    ctx.textAlign = 'right';
    ctx.fillText('THE BONTOT RADIO PRESS', width - 90, 125);

    // Bottom horizontal rule
    ctx.beginPath();
    ctx.moveTo(90, height - 140);
    ctx.lineTo(width - 90, height - 140);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillText('PAGE 104.8 // ARCHIVED BROADCAST', 90, height - 120);
    ctx.textAlign = 'right';
    ctx.fillText('EST. 2026 // UNFILTERED', width - 90, height - 120);
    ctx.restore();
  }

  // Header: Bold editorial serif masthead
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 44px "Playfair Display", "Space Grotesk", serif';
  ctx.fillStyle = '#ffffff';
  if (glowAlpha > 0) {
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 10 * glowAlpha;
  }
  ctx.letterSpacing = '4px';
  ctx.fillText(headerText.toUpperCase(), width / 2, headerPosY);
  ctx.restore();

  // SubHeader / Category: Architectural micro-label
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.letterSpacing = '5px';
  ctx.fillText(`ESSAY NO. 104.8 — ${category ? category.toUpperCase() : 'EDITORIAL'}`, width / 2, subHeaderPosY);
  ctx.restore();

  // Quote: Striking serif typography with giant watermark quotation mark
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;

    // Giant watermark quotation mark behind the quote
    ctx.font = '700 240px "Playfair Display", serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillText('“', width / 2 - maxQuoteWidth / 2 + 60, quotePosY - 60);

    ctx.font = `italic 600 ${quoteFontSize}px "Playfair Display", Georgia, serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.4;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = '#ffffff';
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Editorial credits line
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Thin separator line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, footerPosY - 25);
  ctx.lineTo(width / 2 + 200, footerPosY - 25);
  ctx.stroke();

  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.letterSpacing = '3px';
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('■ LIVE ON AIR // THE BONTOT RADIO EDITORIAL', width / 2, footerPosY + 38);
  ctx.restore();
}

/* ==========================================================================
   8. DARK MINIMAL
   ========================================================================== */
function renderDarkMinimal(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  // Frame: Ultra-restrained 1px subtle hairpins
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(140, 160);
    ctx.lineTo(width - 140, 160);
    ctx.moveTo(140, height - 160);
    ctx.lineTo(width - 140, height - 160);
    ctx.stroke();
    ctx.restore();
  }

  // Header: Quiet, dignified off-white
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 30px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#f4f4f5';
  ctx.letterSpacing = '8px';
  ctx.fillText(headerText.toUpperCase(), width / 2, headerPosY);
  ctx.restore();

  // SubHeader: Muted zinc
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '400 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#71717a';
  ctx.letterSpacing = '2px';
  ctx.fillText(`tbr 104.8 / ${category ? category.toLowerCase() : 'signal'}`, width / 2, subHeaderPosY);
  ctx.restore();

  // Quote: Pure, unadorned typography
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;
    ctx.font = `500 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.4;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = '#f4f4f5';
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Single line minimalist status
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 18px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '400 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#71717a';
  ctx.fillText('· ON AIR ·', width / 2, footerPosY + 32);
  ctx.restore();
}

/* ==========================================================================
   9. CLASSIC RADIO
   ========================================================================== */
function renderClassicRadio(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  const amberGold = '#fbbf24';
  const studioRed = '#ef4444';

  // Frame: Vintage radio dial scale at top & chassis brackets
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.85;

    // Analog frequency tuning ruler at Y = 130
    const dialY = 130;
    ctx.strokeStyle = amberGold;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, dialY);
    ctx.lineTo(width - 100, dialY);
    ctx.stroke();

    // Tuning tick marks
    const freqs = [88, 92, 96, 100, 104.8, 108];
    const dialW = width - 200;
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.textAlign = 'center';

    freqs.forEach((freq, idx) => {
      const fx = 100 + (idx / (freqs.length - 1)) * dialW;
      ctx.beginPath();
      ctx.moveTo(fx, dialY - 8);
      ctx.lineTo(fx, dialY + 8);
      ctx.stroke();
      ctx.fillText(`${freq}`, fx, dialY + 22);
    });

    // Red needle indicator at 104.8 MHz
    const needleX = 100 + (4 / (freqs.length - 1)) * dialW;
    ctx.strokeStyle = studioRed;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(needleX, dialY - 14);
    ctx.lineTo(needleX, dialY + 14);
    ctx.stroke();

    // Corner brass radio brackets
    drawChassisBracket(ctx, 80, 100, 30, amberGold);
    drawChassisBracket(ctx, width - 80, 100, 30, amberGold);
    drawChassisBracket(ctx, 80, height - 100, 30, amberGold);
    drawChassisBracket(ctx, width - 80, height - 100, 30, amberGold);
    ctx.restore();
  }

  // Header: Vintage radio station banner
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 42px "Space Grotesk", sans-serif';
  ctx.fillStyle = amberGold;
  if (glowAlpha > 0) {
    ctx.shadowColor = amberGold;
    ctx.shadowBlur = 15 * glowAlpha;
  }
  ctx.letterSpacing = '5px';
  ctx.fillText(headerText.toUpperCase(), width / 2, headerPosY);

  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('AM · FM STEREO BROADCAST // 104.8 MHz', width / 2, headerPosY + 32);
  ctx.restore();

  // SubHeader: VU Meter & category
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = amberGold;
  ctx.fillText(`SIGNAL: STEREO [||||||||  ] // ${category ? category.toUpperCase() : 'BROADCAST'}`, width / 2, subHeaderPosY);
  ctx.restore();

  // Quote: Warm broadcast typography
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;
    ctx.font = `600 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.38;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = '#fffbeb';
    if (glowAlpha > 0) {
      ctx.shadowColor = amberGold;
      ctx.shadowBlur = 15 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Vintage illuminated studio [ ● ON AIR ] box
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Illuminated red ON AIR box
  const boxW = 180, boxH = 40;
  ctx.strokeStyle = studioRed;
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
  ctx.fillRect(width / 2 - boxW / 2, footerPosY - 40, boxW, boxH);
  ctx.strokeRect(width / 2 - boxW / 2, footerPosY - 40, boxW, boxH);

  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = studioRed;
  ctx.shadowBlur = 10;
  ctx.fillText('● ON AIR', width / 2, footerPosY - 20);

  ctx.shadowBlur = 0;
  ctx.font = '600 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY + 20);

  ctx.font = '400 16px "JetBrains Mono", monospace';
  ctx.fillStyle = amberGold;
  ctx.fillText('TUNED TO 104.8 MHz // HI-FI TRANSMISSION', width / 2, footerPosY + 55);
  ctx.restore();
}

function drawChassisBracket(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.strokeRect(x - size / 2, y - size / 2, size, size);
  ctx.restore();
}

/* ==========================================================================
   10. DIARY NIGHT
   ========================================================================== */
function renderDiaryNight(ctx, width, height, state, glowAlpha, frameAlpha) {
  const {
    quote = '',
    category = '',
    quoteFontSize = 52,
    quotePosY = 960,
    headerPosY = 260,
    subHeaderPosY = 330,
    footerPosY = 1200,
    headerText = 'THE BONTOT RADIO',
    footerText = 'TRANSMITTING TO THE VOID',
  } = state;

  const starlightCyan = '#38bdf8';
  const twilightViolet = '#c084fc';
  const moonlightWhite = '#f8fafc';

  // Frame: Nocturnal constellation stars & moon doodle
  if (frameAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = frameAlpha * 0.8;

    // Corner 4-point stars
    drawCrossStar(ctx, 120, 140, 18, starlightCyan);
    drawCrossStar(ctx, width - 120, 140, 18, twilightViolet);
    drawCrossStar(ctx, 120, height - 140, 18, twilightViolet);
    drawCrossStar(ctx, width - 120, height - 140, 18, starlightCyan);

    // Crescent moon doodle in top right
    drawCrescentMoon(ctx, width - 180, 140, 16, '#fef08a');
    ctx.restore();
  }

  // Header: Midnight Echoes with Moon
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 42px "Space Grotesk", sans-serif';
  ctx.fillStyle = moonlightWhite;
  if (glowAlpha > 0) {
    ctx.shadowColor = twilightViolet;
    ctx.shadowBlur = 18 * glowAlpha;
  }
  ctx.letterSpacing = '6px';
  ctx.fillText(`${headerText.toUpperCase()}  ☾`, width / 2, headerPosY);
  ctx.restore();

  // SubHeader: Late Night frequency note
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillStyle = starlightCyan;
  ctx.fillText(`✦ MIDNIGHT SESSION // ${category ? category.toUpperCase() : 'NOCTURNAL RHYTHM'} ✦`, width / 2, subHeaderPosY);
  ctx.restore();

  // Quote: Expressive typography with starlight glow
  if (quote) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxQuoteWidth = 840;
    ctx.font = `600 ${quoteFontSize}px "Space Grotesk", "Inter", sans-serif`;
    const lines = wrapText(ctx, `“${quote}”`, maxQuoteWidth);
    const lineHeight = quoteFontSize * 1.38;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = quotePosY - (totalBlockHeight / 2) + (lineHeight / 2);

    ctx.fillStyle = moonlightWhite;
    if (glowAlpha > 0) {
      ctx.shadowColor = starlightCyan;
      ctx.shadowBlur = 22 * glowAlpha;
    }
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  // Footer: Intimate nocturnal sign-off
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = starlightCyan;
  if (glowAlpha > 0) {
    ctx.shadowColor = starlightCyan;
    ctx.shadowBlur = 12 * glowAlpha;
  }
  ctx.fillText(footerText.toUpperCase(), width / 2, footerPosY);

  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillStyle = twilightViolet;
  ctx.fillText('☾ YOU ARE NOT ALONE // 104.8 FM MIDNIGHT TRANSMISSION', width / 2, footerPosY + 40);
  ctx.restore();
}

function drawCrossStar(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx - r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r);
  ctx.fill();
  ctx.restore();
}

function drawCrescentMoon(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx + r * 0.45, cy - r * 0.2, r * 0.85, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();
}
