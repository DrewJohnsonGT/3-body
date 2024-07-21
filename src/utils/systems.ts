import P5 from 'p5';
import { G } from '~/constants';
import { Body } from '~/utils/Body';

export const SYSTEM_1 = (P: P5) => {
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
      color: P.color(255, 0, 0),
      mass,
      pos: positions[0],
      vel: P.createVector(
        velocityMagnitude * Math.sin(0),
        -velocityMagnitude * Math.cos(0),
      ),
    }),
    new Body({
      color: P.color(0, 0, 255),
      mass,
      pos: positions[2],
      vel: P.createVector(
        velocityMagnitude * Math.sin(-P.TWO_PI / 3),
        -velocityMagnitude * Math.cos(-P.TWO_PI / 3),
      ),
    }),
    new Body({
      color: P.color(0, 255, 0),
      mass,
      pos: positions[1],
      vel: P.createVector(
        velocityMagnitude * Math.sin(P.TWO_PI / 3),
        -velocityMagnitude * Math.cos(P.TWO_PI / 3),
      ),
    }),
  ];
};
