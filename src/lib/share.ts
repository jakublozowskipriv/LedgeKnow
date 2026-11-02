/** Generuje grafikę karty (1080×1350, format na Instagram/Messengera) i udostępnia ją. */
import type { Card } from '../shared/schema';
import { CATEGORIES } from '../shared/categories';

const DISPLAY = '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
const BODY = '"Inter Variable", Inter, system-ui, sans-serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderShareImage(card: Card): Promise<Blob> {
  await Promise.all([document.fonts.load(`700 80px ${DISPLAY}`), document.fonts.load(`400 40px ${BODY}`)]).catch(() => undefined);
  const W = 1080;
  const H = 1350;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d')!;
  const [c1, c2] = CATEGORIES[card.category].colors;

  // niebo
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0b0618');
  sky.addColorStop(0.45, '#1a0b3a');
  sky.addColorStop(0.62, c2);
  sky.addColorStop(0.7, c1);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // słońce z paskami
  const horizon = 900;
  const sunR = 260;
  const sun = ctx.createLinearGradient(0, horizon - sunR * 2, 0, horizon);
  sun.addColorStop(0, '#fffb96');
  sun.addColorStop(0.5, '#ff9e64');
  sun.addColorStop(1, c1);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, horizon);
  ctx.clip();
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(W / 2, horizon - 60, sunR, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(0, horizon - 60 - 40 + i * 34, W, 4 + i * 3);
  }
  ctx.restore();

  // podłoga + siatka
  ctx.fillStyle = 'rgba(11,6,24,0.82)';
  ctx.fillRect(0, horizon, W, H - horizon);
  ctx.strokeStyle = 'rgba(255,42,109,0.8)';
  ctx.lineWidth = 2;
  let y = horizon;
  let step = 8;
  while (y < H) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    y += step;
    step *= 1.3;
  }
  for (let i = -10; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + i * 30, horizon);
    ctx.lineTo(W / 2 + i * 260, H);
    ctx.stroke();
  }

  // panel z tekstem
  const pad = 80;
  ctx.fillStyle = 'rgba(11,6,24,0.72)';
  roundRect(ctx, pad - 30, 110, W - 2 * (pad - 30), 700, 36);
  ctx.fill();
  ctx.strokeStyle = 'rgba(5,217,232,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = c1;
  ctx.font = `600 30px ${BODY}`;
  ctx.fillText(CATEGORIES[card.category].name.toUpperCase(), pad, 190);

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 74px ${DISPLAY}`;
  let ty = 290;
  for (const line of wrap(ctx, card.title, W - 2 * pad).slice(0, 4)) {
    ctx.fillText(line, pad, ty);
    ty += 84;
  }
  ctx.fillStyle = '#d9cff5';
  ctx.font = `400 40px ${BODY}`;
  ty += 20;
  for (const line of wrap(ctx, card.hook, W - 2 * pad).slice(0, 6)) {
    ctx.fillText(line, pad, ty);
    ty += 56;
  }

  // stopka
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 46px ${DISPLAY}`;
  ctx.fillText('LedgeKnow', pad, H - 90);
  ctx.fillStyle = '#05d9e8';
  ctx.font = `400 30px ${BODY}`;
  ctx.fillText('codzienna porcja losowej wiedzy', pad, H - 48);

  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('Nie udało się wygenerować obrazu'))), 'image/png'));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function shareCard(card: Card): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const blob = await renderShareImage(card);
  const file = new File([blob], `${card.id}.png`, { type: 'image/png' });
  const text = `${card.title}\n\n${card.hook}`;
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: card.title, text });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'downloaded';
}
