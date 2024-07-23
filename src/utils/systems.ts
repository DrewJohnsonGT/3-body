import P5 from 'p5';
import { G } from '~/constants';
import { Body } from '~/utils/Body';
import { getRandomColor } from '~/utils/color';

const CIRCLE = (P: P5) => {
  const mass = 52;
  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const size = Math.min(P.windowWidth, P.windowHeight) * 0.3; // Length of the side of the equilateral triangle

  const velocityMagnitude = Math.sqrt((G * 10 * 3) / size); // Simplified orbital velocity for stability

  // Generate positions
  const positions = Array.from({ length: 3 }, (_, i) => {
    const angle = (P.TWO_PI / 3) * i;
    const x = center.x + size * Math.cos(angle);
    const y = center.y + size * Math.sin(angle);
    return P.createVector(x, y);
  });

  return [
    new Body({
      color: getRandomColor(P),
      mass,
      pos: positions[0],
      vel: P.createVector(
        velocityMagnitude * Math.sin(0),
        -velocityMagnitude * Math.cos(0),
      ),
    }),
    new Body({
      color: getRandomColor(P),
      mass,
      pos: positions[2],
      vel: P.createVector(
        velocityMagnitude * Math.sin(-P.TWO_PI / 3),
        -velocityMagnitude * Math.cos(-P.TWO_PI / 3),
      ),
    }),
    new Body({
      color: getRandomColor(P),
      mass,
      pos: positions[1],
      vel: P.createVector(
        velocityMagnitude * Math.sin(P.TWO_PI / 3),
        -velocityMagnitude * Math.cos(P.TWO_PI / 3),
      ),
    }),
  ];
};

const FIGURE_EIGHT = (P: P5) => {
  const mass = 5;
  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const scale = Math.min(P.windowWidth, P.windowHeight) * 0.1; // Adjusted scale

  const positions = [
    P.createVector(-1, 0).mult(scale).add(center),
    P.createVector(1, 0).mult(scale).add(center),
    P.createVector(0, 0).mult(scale).add(center),
  ];

  const velocities = [
    P.createVector(0.347111, 0.532728).mult(scale / 178),
    P.createVector(0.347111, 0.532728).mult(scale / 178),
    P.createVector(-0.694222, -1.065456).mult(scale / 178),
  ];

  return [
    new Body({
      color: getRandomColor(P),
      mass,
      pos: positions[0],
      vel: velocities[0],
    }),
    new Body({
      color: getRandomColor(P),
      mass,
      pos: positions[1],
      vel: velocities[1],
    }),
    new Body({
      color: getRandomColor(P),
      mass,
      pos: positions[2],
      vel: velocities[2],
    }),
  ];
};

export enum System {
  CIRCLE = 'Circle',
  FIGURE_EIGHT = 'Figure Eight',
}

export const SYSTEMS_MAP: Record<System, (P: P5) => Body[]> = {
  [System.CIRCLE]: CIRCLE,
  [System.FIGURE_EIGHT]: FIGURE_EIGHT,
};
