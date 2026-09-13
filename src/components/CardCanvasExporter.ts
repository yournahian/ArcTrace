export interface CardExportData {
  name: string;
  handle: string;
  avatar: string;
  impressions: number;
  postCount: number;
  series: Array<{ t: string; v: number }>;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function formatDateMonthYear(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export async function generateProofOfWorkPNG(data: CardExportData): Promise<Blob | null> {
  const width = 1080;
  const height = 620;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Background (Arc Protocol Deep Obsidian & Ambient Glow)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#060913');
  bgGrad.addColorStop(0.5, '#0A1224');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Arc radial glow in top center
  const radGlow = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 450);
  radGlow.addColorStop(0, 'rgba(37, 99, 235, 0.28)');
  radGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate grid overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. Main White Container Card
  const cardPadX = 64;
  const cardPadY = 54;
  const cardW = width - cardPadX * 2;
  const cardH = height - cardPadY * 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 20;

  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(cardPadX, cardPadY, cardW, cardH, 28);
  } else {
    ctx.rect(cardPadX, cardPadY, cardW, cardH);
  }
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Clip within card for inner graphics
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(cardPadX, cardPadY, cardW, cardH, 28);
  } else {
    ctx.rect(cardPadX, cardPadY, cardW, cardH);
  }
  ctx.clip();

  // 3. User Avatar
  const avatarSize = 72;
  const avatarX = cardPadX + 44;
  const avatarY = cardPadY + 38;

  const userImg = await loadImage(data.avatar);

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.clip();

  if (userImg) {
    ctx.drawImage(userImg, avatarX, avatarY, avatarSize, avatarSize);
  } else {
    ctx.fillStyle = '#eff3f4';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.handle.slice(0, 2).toUpperCase(), avatarX + avatarSize / 2, avatarY + avatarSize / 2);
  }
  ctx.restore();

  // User Name & Handle
  ctx.fillStyle = '#0f1419';
  ctx.font = 'bold 26px "DM Sans", -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(data.name, avatarX + avatarSize + 18, avatarY + 30);

  ctx.fillStyle = '#536471';
  ctx.font = '500 18px "DM Sans", -apple-system, sans-serif';
  ctx.fillText(`@${data.handle}`, avatarX + avatarSize + 18, avatarY + 60);

  // 4. Arc Pill Badge (Top Right)
  const badgeW = 90;
  const badgeH = 36;
  const badgeX = cardPadX + cardW - badgeW - 44;
  const badgeY = avatarY + 16;

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18);
  } else {
    ctx.rect(badgeX, badgeY, badgeW, badgeH);
  }
  ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
  ctx.fill();

  ctx.fillStyle = '#2563EB';
  ctx.font = 'bold 15px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('arc', badgeX + badgeW / 2, badgeY + badgeH / 2);
  ctx.restore();

  // 5. Stat Counter (Impressions generated for arc)
  const statY = avatarY + avatarSize + 52;
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 64px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(data.impressions.toLocaleString(), cardPadX + 44, statY);

  ctx.fillStyle = '#536471';
  ctx.font = '500 18px "DM Sans", sans-serif';
  ctx.fillText('Impressions generated for arc', cardPadX + 46, statY + 30);

  // 6. Cumulative Curve Chart
  if (data.series && data.series.length > 1) {
    const chartY = statY + 64;
    const chartH = 120;
    const chartW = cardW - 88;
    const chartX = cardPadX + 44;

    const values = data.series.map((p) => p.v);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    const points = data.series.map((p, idx) => {
      const px = chartX + (idx / (data.series.length - 1)) * chartW;
      const py = chartY + chartH - ((p.v - minVal) / range) * (chartH - 24) - 12;
      return [px, py];
    });

    // Gradient Fill
    ctx.save();
    ctx.beginPath();
    points.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.lineTo(chartX + chartW, chartY + chartH);
    ctx.lineTo(chartX, chartY + chartH);
    ctx.closePath();

    const chartGrad = ctx.createLinearGradient(0, chartY, 0, chartY + chartH);
    chartGrad.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
    chartGrad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
    ctx.fillStyle = chartGrad;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    points.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Endpoint Indicator
    const [lastX, lastY] = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#2563EB';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // 7. Footer metadata
  const footerY = cardPadY + cardH - 24;
  ctx.fillStyle = '#64748B';
  ctx.font = '500 14px "DM Sans", sans-serif';
  ctx.textAlign = 'left';
  const startStr = formatDateMonthYear(data.series[0]?.t || '');
  const endStr = formatDateMonthYear(data.series[data.series.length - 1]?.t || '');
  ctx.fillText(`${startStr} - ${endStr}`, cardPadX + 46, footerY);

  ctx.textAlign = 'right';
  ctx.fillText('Arc Network • arc.io', cardPadX + cardW - 46, footerY);

  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
