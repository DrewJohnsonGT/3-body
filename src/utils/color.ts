import { RgbaColor } from 'react-colorful';
import P5 from 'p5';

export enum ColorPaletteColor {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  ORANGE = 'ORANGE',
  PINK = 'PINK',
  PURPLE = 'PURPLE',
  RED = 'RED',
  YELLOW = 'YELLOW',
}
export const COLOR_PALETTES: Record<ColorPaletteColor, string[]> = {
  [ColorPaletteColor.BLUE]: [
    '#1E3A8A',
    '#3B82F6',
    '#93C5FD',
    '#60A5FA',
    '#2563EB',
  ],
  [ColorPaletteColor.GREEN]: [
    '#1B4332',
    '#2D6A4F',
    '#4CAF50',
    '#81C784',
    '#A5D6A7',
  ],
  [ColorPaletteColor.ORANGE]: [
    '#FFBA08',
    '#FAA307',
    '#F48C06',
    '#E85D04',
    '#DC2F02',
  ],
  [ColorPaletteColor.PINK]: [
    '#FF69B4',
    '#FFB6C1',
    '#FF1493',
    '#FFC0CB',
    '#DB7093',
  ],
  [ColorPaletteColor.PURPLE]: [
    '#800080',
    '#8A2BE2',
    '#9370DB',
    '#BA55D3',
    '#DDA0DD',
  ],
  [ColorPaletteColor.RED]: [
    '#FF0000',
    '#FF6347',
    '#FF4500',
    '#DC143C',
    '#B22222',
  ],
  [ColorPaletteColor.YELLOW]: [
    '#FFFF00',
    '#FFD700',
    '#FFA500',
    '#FF8C00',
    '#FFA07A',
  ],
};

export const getDarkerColor = (P: P5, color: P5.Color, amount: number) => {
  return P.lerpColor(color, P.color(0), amount);
};

export const getLighterColor = (P: P5, color: P5.Color, amount: number) => {
  return P.lerpColor(color, P.color(255), amount);
};

export const getRandomColor = (P: P5) => {
  return P.color(P.random(255), P.random(255), P.random(255));
};

// Returns either white or black depending on hex color
export const getBackgroundColor = (rgbaColor: RgbaColor) => {
  const { b, g, r } = rgbaColor;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? 'black' : 'white';
};

export const rgbaColorToP5Color = (p: P5, rgbaColor: RgbaColor) => {
  const { a, b, g, r } = rgbaColor;
  return p.color(r, g, b, a);
};

export const hexToP5Color = (p: P5, hex: string) => {
  return p.color(hex);
}

export const rgbaColorToString = (rgbaColor: RgbaColor) => {
  const { a, b, g, r } = rgbaColor;
  return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(a)})`;
};
