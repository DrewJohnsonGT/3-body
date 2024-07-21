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
