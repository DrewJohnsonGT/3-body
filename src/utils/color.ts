import P5 from 'p5';

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
export const getBackgroundColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? 'black' : 'white';
};

export const hexColorToP5Color = (p: P5, hexColor: string) => {
  const color = p.color(hexColor);
  return color;
};
