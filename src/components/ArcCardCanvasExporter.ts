export interface ArcCardExportData {
  handle: string;
  name: string;
  avatar: string;
  cardImage?: string;
  archetypeId: string;
  archetypeTitle: string;
  archetypeLore: string;
  rarity: string;
  impressions: number;
  wave: string;
  glowColor: string;
}

export async function exportArcCardPNG(data: ArcCardExportData): Promise<Blob | null> {
  const width = 600;
  const height = 860;
  const canvas = document.createElement('canvas');
  canvas.width = width * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(2, 2);

  // Background atmosphere
  ctx.fillStyle = '#060913';
  ctx.fillRect(0, 0, width, height);

  // Holographic outer border glow
  const cx = 35;
  const cy = 35;
  const cw = width - 70;
  const ch = height - 70;
  const cr = 32;

  ctx.save();
  ctx.strokeStyle = data.glowColor || '#00E5FF';
  ctx.lineWidth = 8;
  ctx.shadowColor = data.glowColor || 'rgba(0, 229, 255, 0.6)';
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.roundRect(cx, cy, cw, ch, cr);
  ctx.stroke();
  ctx.restore();

  // Card Inner Background (White / Light Holographic surface like Monad Cards)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cx + 4, cy + 4, cw - 8, ch - 8, cr - 4);
  ctx.clip();

  // Crisp Monad-style white/silvery holographic surface
  const surfaceGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  surfaceGrad.addColorStop(0, '#FFFFFF');
  surfaceGrad.addColorStop(0.5, '#F8FAFC');
  surfaceGrad.addColorStop(1, '#F1F5F9');
  ctx.fillStyle = surfaceGrad;
  ctx.fillRect(cx, cy, cw, ch);

  // Nameplate Pill Box (Top)
  const hbx = cx + 24;
  const hby = cy + 24;
  const hbw = cw - 48;
  const hbh = 54;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(hbx, hby, hbw, hbh, 14);
  ctx.fill();
  ctx.stroke();

  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.textBaseline = 'middle';
  const cleanHandle = data.handle.startsWith('@') ? data.handle : '@' + data.handle;
  ctx.fillText(cleanHandle, hbx + 18, hby + hbh / 2);

  // Top Right Star / Diamond
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillStyle = data.glowColor || '#3B82F6';
  ctx.textAlign = 'right';
  ctx.fillText('✦', hbx + hbw - 18, hby + hbh / 2);
  ctx.textAlign = 'left';

  // Center Character Artwork Frame
  const artx = cx + 24;
  const arty = hby + hbh + 18;
  const artw = cw - 48;
  const arth = 420;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(artx, arty, artw, arth, 18);
  ctx.clip();

  // Try drawing the high-res card artwork image
  let imageDrawn = false;
  if (data.cardImage) {
    try {
      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      artImg.src = data.cardImage;
      await new Promise((resolve) => {
        artImg.onload = resolve;
        artImg.onerror = resolve;
      });
      if (artImg.complete && artImg.naturalWidth > 0) {
        ctx.drawImage(artImg, artx, arty, artw, arth);
        imageDrawn = true;
      }
    } catch (e) {
      console.warn('Card image error:', e);
    }
  }

  // Fallback if card image not loaded
  if (!imageDrawn) {
    const fallbackGrad = ctx.createLinearGradient(artx, arty, artx + artw, arty + arth);
    fallbackGrad.addColorStop(0, '#1E1B4B');
    fallbackGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = fallbackGrad;
    ctx.fillRect(artx, arty, artw, arth);
  }

  ctx.restore();

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(artx, arty, artw, arth, 18);
  ctx.stroke();

  // Trait Box (Monad Cards Style)
  const tbx = cx + 24;
  const tby = arty + arth + 18;
  const tbw = cw - 48;
  const tbh = 126;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(tbx, tby, tbw, tbh, 16);
  ctx.fill();
  ctx.stroke();

  // Trait Icon Badge (Left Square)
  const iconSize = 64;
  const ix = tbx + 14;
  const iy = tby + 16;
  ctx.fillStyle = data.glowColor || '#A855F7';
  ctx.beginPath();
  ctx.roundRect(ix, iy, iconSize, iconSize, 14);
  ctx.fill();

  ctx.font = '32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  const badgeEmoji = data.archetypeId === 'hater' ? '👊' : data.archetypeId === 'true_og' ? '👑' : data.archetypeId === 'architect' ? '⚙️' : data.archetypeId === 'pioneer' ? '🚀' : '🎯';
  ctx.fillText(badgeEmoji, ix + iconSize / 2, iy + iconSize / 2);
  ctx.textAlign = 'left';

  // Trait Text Content
  const textLeft = ix + iconSize + 16;
  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.textBaseline = 'top';
  ctx.fillText(data.archetypeTitle, textLeft, iy + 2);

  ctx.font = '500 13px "DM Sans", sans-serif';
  ctx.fillStyle = '#475569';
  
  // Wrap lore text into lines
  const words = data.archetypeLore.split(' ');
  let line = '';
  let lineY = iy + 26;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > tbw - iconSize - 60 && n > 0) {
      ctx.fillText(line, textLeft, lineY);
      line = words[n] + ' ';
      lineY += 18;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, textLeft, lineY);

  // Footer: Arc Cards & Wave A
  ctx.font = '700 11px "Space Mono", monospace';
  ctx.fillStyle = '#64748B';
  ctx.fillText('Arc Cards', cx + 28, cy + ch - 16);

  // Wave Stamp Badge
  const wx = cx + cw - 44;
  const wy = cy + ch - 22;
  ctx.beginPath();
  ctx.arc(wx, wy, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();

  ctx.font = '800 10px "Space Mono", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W1', wx, wy);

  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
