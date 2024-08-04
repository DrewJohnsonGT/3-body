import P5 from 'p5';
import { G } from '~/constants';

type SystemFunction = (
  P: P5,
) => { mass: number; pos: P5.Vector; vel: P5.Vector }[];

const CIRCLE: SystemFunction = (P) => {
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
    {
      mass,
      pos: positions[0],
      vel: P.createVector(
        velocityMagnitude * Math.sin(0),
        -velocityMagnitude * Math.cos(0),
      ),
    },
    {
      mass,
      pos: positions[2],
      vel: P.createVector(
        velocityMagnitude * Math.sin(-P.TWO_PI / 3),
        -velocityMagnitude * Math.cos(-P.TWO_PI / 3),
      ),
    },
    {
      mass,
      pos: positions[1],
      vel: P.createVector(
        velocityMagnitude * Math.sin(P.TWO_PI / 3),
        -velocityMagnitude * Math.cos(P.TWO_PI / 3),
      ),
    },
  ];
};

const FIGURE_EIGHT: SystemFunction = (P) => {
  const aspectRatio = P.windowWidth / P.windowHeight;

  const baseAspectRatio = 1;
  const baseMass = 79;
  const baseVelocity = 1;

  const mass = baseMass * (aspectRatio / baseAspectRatio);
  const velocityScale = baseVelocity * (aspectRatio / baseAspectRatio);

  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const positionScale = (aspectRatio / baseAspectRatio) * 350;

  const positions = [
    P.createVector(0.97000436, -0.24308753).mult(positionScale).add(center),
    P.createVector(-0.97000436, 0.24308753).mult(positionScale).add(center),
    P.createVector(0, 0).mult(positionScale).add(center),
  ];

  const velocities = [
    P.createVector(0.466203685, 0.43236573).mult(velocityScale),
    P.createVector(0.466203685, 0.43236573).mult(velocityScale),
    P.createVector(-0.93240737, -0.86473146).mult(velocityScale),
  ];

  return [
    {
      mass,
      pos: positions[0],
      vel: velocities[0],
    },
    {
      mass,
      pos: positions[1],
      vel: velocities[1],
    },
    {
      mass,
      pos: positions[2],
      vel: velocities[2],
    },
  ];
};

const CENTRAL_BODY_ORBIT: SystemFunction = (P) => {
  const centralMass = 1000;
  const orbitingMass = 10;
  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const orbitRadius = Math.min(P.windowWidth, P.windowHeight) * 0.2;

  const velocityMagnitude = Math.sqrt((G * centralMass) / orbitRadius);

  const positions = Array.from({ length: 3 }, (_, i) => {
    const angle = (P.TWO_PI / 3) * i;
    const x = center.x + orbitRadius * Math.cos(angle);
    const y = center.y + orbitRadius * Math.sin(angle);
    return P.createVector(x, y);
  });

  const velocities = positions.map((_pos, i) => {
    const angle = (P.TWO_PI / 3) * i;
    return P.createVector(
      -velocityMagnitude * Math.sin(angle),
      velocityMagnitude * Math.cos(angle),
    );
  });

  return [
    {
      mass: centralMass,
      pos: center,
      vel: P.createVector(0, 0),
    },
    ...positions.map((pos, i) => ({
      mass: orbitingMass,
      pos,
      vel: velocities[i],
    })),
  ];
};

export enum System {
  CIRCLE = 'Circle',
  FIGURE_EIGHT = 'Figure Eight',
  CENTRAL_BODY_ORBIT = 'Central Body',
}

export const SYSTEMS_MAP: Record<
  System,
  {
    systemFunction: SystemFunction;
    title: string;
    description: string;
    bodies: number;
  }
> = {
  [System.CIRCLE]: {
    bodies: 3,
    description: 'Three bodies in a circular orbit',
    systemFunction: CIRCLE,
    title: 'Circle',
  },
  [System.FIGURE_EIGHT]: {
    bodies: 3,
    description: 'Three bodies in a figure eight orbit',
    systemFunction: FIGURE_EIGHT,
    title: 'Figure Eight',
  },
  [System.CENTRAL_BODY_ORBIT]: {
    bodies: 4,
    description: 'Three bodies orbiting a larger central body',
    systemFunction: CENTRAL_BODY_ORBIT,
    title: 'Central Body',
  },
};
