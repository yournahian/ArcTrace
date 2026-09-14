export interface ArcCardExportData {
  handle: string;
  name: string;
  avatar: string;
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
  const glowGrad = ctx.createLinearGradient(0, 0, width, height);
  glowGrad.addColorStop(0, data.glowColor || '#00E5FF');
  glowGrad.addColorStop(0.5, '#A855F7');
  glowGrad.addColorStop(1, '#3B82F6');

  // Outer frame
  const cx = 30;
  const cy = 30;
  const cw = width - 60;
  const ch = height - 60;
  const cr = 28;

  ctx.save();
  ctx.strokeStyle = glowGrad;
  ctx.lineWidth = 6;
  ctx.shadowColor = data.glowColor || 'rgba(0, 229, 255, 0.5)';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(cx, cy, cw, ch, cr);
  ctx.stroke();
  ctx.restore();

  // Card Inner Background
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cx + 3, cy + 3, cw - 6, ch - 6, cr - 3);
  ctx.clip();

  const innerGrad = ctx.createLinearGradient(0, 0, 0, height);
  innerGrad.addColorStop(0, '#0F172A');
  innerGrad.addColorStop(0.5, '#090E1A');
  innerGrad.addColorStop(1, '#05070D');
  ctx.fillStyle = innerGrad;
  ctx.fillRect(cx, cy, cw, ch);

  // Arc Grid Pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 32;
  for (let x = cx; x <= cx + cw; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, cy);
    ctx.lineTo(x, cy + ch);
    ctx.stroke();
  }
  for (let y = cy; y <= cy + ch; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(cx + cw, y);
    ctx.stroke();
  }

  // Header Box
  const hbx = cx + 24;
  const hby = cy + 24;
  const hbw = cw - 48;
  const hbh = 52;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(hbx, hby, hbw, hbh, 14);
  ctx.fill();
  ctx.stroke();

  ctx.font = '700 20px " Space Grotesk\, sans-serif';
 ctx.fillStyle = '#FFFFFF';
 ctx.textBaseline = 'middle';
 const cleanHandle = data.handle.startsWith('@') ? data.handle : '@' + data.handle;
 ctx.fillText(cleanHandle, hbx + 18, hby + hbh / 2);

 ctx.font = '700 16px \Space Mono\, monospace';
 ctx.fillStyle = data.glowColor || '#00E5FF';
 ctx.textAlign = 'right';
 ctx.fillText('✦ ' + data.rarity, hbx + hbw - 18, hby + hbh / 2);
 ctx.textAlign = 'left';

 // Center Art Frame
 const artx = cx + 24;
 const arty = hby + hbh + 18;
 const artw = cw - 48;
 const arth = 380;

 ctx.save();
 ctx.beginPath();
 ctx.roundRect(artx, arty, artw, arth, 18);
 ctx.clip();

 const artGrad = ctx.createLinearGradient(artx, arty, artx + artw, arty + arth);
 artGrad.addColorStop(0, '#1E1B4B');
 artGrad.addColorStop(0.5, '#0F172A');
 artGrad.addColorStop(1, '#0A0F1D');
 ctx.fillStyle = artGrad;
 ctx.fillRect(artx, arty, artw, arth);

 // Avatar drawing
 try {
 const img = new Image();
 img.crossOrigin = 'anonymous';
 img.src = data.avatar;
 await new Promise((resolve) => {
 img.onload = resolve;
 img.onerror = resolve;
 });
 if (img.complete && img.naturalWidth > 0) {
 const imgSize = 220;
 const ix = artx + (artw - imgSize) / 2;
 const iy = arty + (arth - imgSize) / 2 - 10;
 ctx.save();
 ctx.beginPath();
 ctx.arc(ix + imgSize / 2, iy + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
 ctx.clip();
 ctx.drawImage(img, ix, iy, imgSize, imgSize);
 ctx.restore();

 ctx.strokeStyle = data.glowColor || '#00E5FF';
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.arc(ix + imgSize / 2, iy + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
 ctx.stroke();
 }
 } catch (e) {
 console.warn('Image load error:', e);
 }

 // Holographic sheen
 const sheenGrad = ctx.createLinearGradient(artx, arty, artx + artw, arty);
 sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
 sheenGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.15)');
 sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.04)');
 ctx.fillStyle = sheenGrad;
 ctx.fillRect(artx, arty, artw, arth);

 ctx.restore();

 ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.roundRect(artx, arty, artw, arth, 18);
 ctx.stroke();

 // Trait Box (Bottom Section)
 const tbx = cx + 24;
 const tby = arty + arth + 20;
 const tbw = cw - 48;
 const tbh = 140;

 ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
 ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.roundRect(tbx, tby, tbw, tbh, 18);
 ctx.fill();
 ctx.stroke();

 // Trait Badge Icon
 const icx = tbx + 18;
 const icy = tby + 20;
 const icSize = 56;
 const badgeGrad = ctx.createLinearGradient(icx, icy, icx + icSize, icy + icSize);
 badgeGrad.addColorStop(0, data.glowColor || '#00E5FF');
 badgeGrad.addColorStop(1, '#3B82F6');

 ctx.fillStyle = badgeGrad;
 ctx.beginPath();
 ctx.roundRect(icx, icy, icSize, icSize, 14);
 ctx.fill();

 ctx.font = '700 24px \Space Grotesk\, sans-serif';
 ctx.fillStyle = '#060913';
 ctx.textAlign = 'center';
 ctx.textBaseline = 'middle';
 ctx.fillText(data.archetypeTitle.charAt(0), icx + icSize / 2, icy + icSize / 2);
 ctx.textAlign = 'left';

 // Archetype Title
 ctx.font = '700 20px \Space Grotesk\, sans-serif';
 ctx.fillStyle = '#FFFFFF';
 ctx.fillText(data.archetypeTitle, icx + icSize + 16, icy + 16);

 // Archetype Lore Text
 ctx.font = '400 13px \DM Sans\, sans-serif';
 ctx.fillStyle = '#94A3B8';
 const words = data.archetypeLore.split(' ');
 let line = '';
 let ly = icy + 40;
 for (const n of words) {
 const testLine = line + n + ' ';
 const metrics = ctx.measureText(testLine);
 if (metrics.width > tbw - icSize - 40 && line !== '') {
 ctx.fillText(line, icx + icSize + 16, ly);
 line = n + ' ';
 ly += 18;
 } else {
 line = testLine;
 }
 }
 ctx.fillText(line, icx + icSize + 16, ly);

 // Footer: Arc Cards & Wave Stamp
 ctx.font = '600 12px \Space Mono\, monospace';
 ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
 ctx.fillText('ARC CARDS • PROOF OF WORK', cx + 24, cy + ch - 18);

 ctx.textAlign = 'right';
 ctx.fillStyle = data.glowColor || '#00E5FF';
 ctx.fillText(data.wave || 'WAVE 1 • MAINNET', cx + cw - 24, cy + ch - 18);

 ctx.restore();

 return new Promise((resolve) => {
 canvas.toBlob((blob) => resolve(blob), 'image/png');
 });
}
