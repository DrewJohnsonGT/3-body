import P5 from 'p5';
import { G } from '~/constants';

type SystemFunction = (P: P5) => {
  newBodiesConfig: { mass: number; pos: P5.Vector; vel: P5.Vector }[];
  zoom?: number;
  trailLength?: number;
};

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

  return {
    newBodiesConfig: [
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
    ],
    trailLength: 50,
  };
};

const INFINITY_SIGN: SystemFunction = (P) => {
  const width = P.windowWidth / 1000;

  const baseMass = 50 * Math.pow(width, 2);
  const baseVelocity = 1;

  const mass = baseMass * width;
  const velocityScale = baseVelocity * width;

  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const positionScale = P.windowWidth / 3;

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

  return {
    newBodiesConfig: [
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
    ],
    trailLength: 350,
  };
};

const FIGURE_EIGHT: SystemFunction = (P) => {
  const height = P.windowHeight / 1000;

  const baseMass = 50 * Math.pow(height, 2);
  const baseVelocity = 1;

  const mass = baseMass * height;
  const velocityScale = baseVelocity * height;

  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const positionScale = P.windowHeight / 3;

  const positions = [
    P.createVector(-0.24308753, 0.97000436).mult(positionScale).add(center),
    P.createVector(0.24308753, -0.97000436).mult(positionScale).add(center),
    P.createVector(0, 0).mult(positionScale).add(center),
  ];

  const velocities = [
    P.createVector(0.43236573, 0.466203685).mult(velocityScale),
    P.createVector(0.43236573, 0.466203685).mult(velocityScale),
    P.createVector(-0.86473146, -0.93240737).mult(velocityScale),
  ];

  return {
    newBodiesConfig: [
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
    ],
    trailLength: 350,
  };
};

const CENTRAL_BODY_ORBIT: SystemFunction = (P) => {
  const centralMass = 5000;
  const orbitingMass = 100;
  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const orbitRadius = Math.min(P.windowWidth, P.windowHeight) * 3.5;

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

  return {
    newBodiesConfig: [
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
    ],
    zoom: 0.125,
  };
};

const RANDOM: SystemFunction = (P) => {
  const numBodies = Math.ceil(Math.random() * 10);
  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const radius = Math.min(P.windowWidth, P.windowHeight) * 0.3;

  return {
    newBodiesConfig: Array.from({ length: numBodies }, () => ({
      mass: P.random(1, 50),
      pos: P.createVector(
        center.x + P.random(-radius, radius),
        center.y + P.random(-radius, radius),
      ),
      vel: P.createVector(P.random(-1, 1), P.random(-1, 1)),
    })),
  };
};

const RANDOM_3: SystemFunction = (P) => {
  const center = P.createVector(P.windowWidth / 2, P.windowHeight / 2);
  const radius = Math.min(P.windowWidth, P.windowHeight) * 0.3;

  return {
    newBodiesConfig: Array.from({ length: 3 }, () => ({
      mass: 25,
      pos: P.createVector(
        center.x + P.random(-radius, radius),
        center.y + P.random(-radius, radius),
      ),
      vel: P.createVector(P.random(-1, 1), P.random(-1, 1)),
    })),
  };
};

export enum System {
  CIRCLE = 'Circle',
  INFINITY_SIGN = 'Infinity Sign',
  FIGURE_EIGHT = 'Figure Eight',
  CENTRAL_BODY_ORBIT = 'Central Body',
  RANDOM = 'Random',
  RANDOM_3 = 'Random 3',
}

export const SYSTEMS_MAP: Record<
  System,
  {
    systemFunction: SystemFunction;
    title: string;
    description: string;
    stable: boolean;
  }
> = {
  [System.CIRCLE]: {
    description: 'Three bodies in a circular orbit',
    stable: true,
    systemFunction: CIRCLE,
    title: 'Circle',
  },
  [System.FIGURE_EIGHT]: {
    description: 'Three bodies in a vertical figure eight orbit',
    stable: true,
    systemFunction: FIGURE_EIGHT,
    title: 'Figure Eight',
  },
  [System.INFINITY_SIGN]: {
    description: 'Three bodies in a horizontal figure eight orbit',
    stable: true,
    systemFunction: INFINITY_SIGN,
    title: 'Infinity Sign',
  },
  [System.CENTRAL_BODY_ORBIT]: {
    description: 'Three bodies orbiting a larger central body',
    stable: true,
    systemFunction: CENTRAL_BODY_ORBIT,
    title: 'Central Body',
  },
  [System.RANDOM]: {
    description: 'A random system of up to 10 random mass bodies',
    stable: false,
    systemFunction: RANDOM,
    title: 'Random',
  },
  [System.RANDOM_3]: {
    description: 'A random system of 3 equal mass bodies',
    stable: false,
    systemFunction: RANDOM_3,
    title: 'Random 3',
  },
};
