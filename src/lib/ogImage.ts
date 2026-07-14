import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO_WIDTH = 600;

interface OgImageOptions {
  name: string;
  pullQuote: string;
  /** Path relative to public/, e.g. "images/stories/<slug>/cover.jpg" */
  photoPath: string;
  accent?: string;
}

export async function generateOgImage({ name, pullQuote, photoPath, accent = '#b3441e' }: OgImageOptions): Promise<Buffer> {
  const absolutePhotoPath = path.join(process.cwd(), 'public', photoPath);
  const photoBuffer = await readFile(absolutePhotoPath);

  const photo = await sharp(photoBuffer)
    .resize(PHOTO_WIDTH, HEIGHT, { fit: 'cover' })
    .png()
    .toBuffer();

  const textPanel = Buffer.from(
    buildTextPanelSvg({ name, pullQuote, width: WIDTH - PHOTO_WIDTH, height: HEIGHT, accent })
  );

  return sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: '#fdfcfb' },
  })
    .composite([
      { input: photo, left: 0, top: 0 },
      { input: textPanel, left: PHOTO_WIDTH, top: 0 },
    ])
    .png()
    .toBuffer();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildTextPanelSvg({
  name,
  pullQuote,
  width,
  height,
  accent,
}: {
  name: string;
  pullQuote: string;
  width: number;
  height: number;
  accent: string;
}): string {
  const quoteLines = wrapText(pullQuote, 26);
  const lineHeight = 44;
  const quoteStartY = height / 2 - (quoteLines.length * lineHeight) / 2;

  const quoteTspans = quoteLines
    .map((line, i) => `<tspan x="60" y="${quoteStartY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#fdfcfb" />
  <text x="60" y="${quoteStartY - 60}" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="${accent}">${escapeXml(name)}</text>
  <text font-family="Georgia, serif" font-style="italic" font-size="34" fill="#1a1a1a">${quoteTspans}</text>
  <text x="60" y="${height - 50}" font-family="sans-serif" font-size="22" fill="#6b6b6b">Humans of Chennai</text>
</svg>`;
}
