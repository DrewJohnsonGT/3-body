import { G, WINDOW_SCALE } from '~/constants';
import { SYSTEM_1 } from '~/utils/systems';
import P5 from 'p5';
import { Body } from '~/Body';

const addRandomBody = (P: P5, pos: P5.Vector) => {
  return new Body({
    color: P.color(P.random(255), P.random(255), P.random(255)),
    mass: P.random(10, 100),
    pos,
    vel: P.createVector(P.random(-1, 1), P.random(-1, 1)),
  });
};

export const simulation = (P: P5) => {
  let bodies: Body[];

  P.setup = () => {
    P.createCanvas(P.windowWidth * WINDOW_SCALE, P.windowHeight * WINDOW_SCALE);
    P.frameRate(60);
    bodies = SYSTEM_1(P);
  };

  P.windowResized = () => {
    P.resizeCanvas(P.windowWidth * WINDOW_SCALE, P.windowHeight * WINDOW_SCALE);
  };

  P.mouseClicked = (event: PointerEvent) => {
    const pos = P.createVector(event.offsetX, event.offsetY);
    bodies.push(addRandomBody(P, pos));
  };

  const calculateGravity = (b1: Body, b2: Body) => {
    const force = P5.Vector.sub(b2.pos, b1.pos);
    let distance = force.mag();
    distance = P.constrain(distance, 20, 1000); // Avoid extreme values
    force.normalize();
    const strength = (G * b1.mass * b2.mass) / (distance * distance);
    force.mult(strength);
    return force;
  };

  P.draw = () => {
    P.background(0);

    // Initialize force accumulators
    const forces = bodies.map(() => P.createVector(0, 0));

    // Calculate all forces
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const force = calculateGravity(bodies[i], bodies[j]);
        forces[i].add(force);
        forces[j].sub(force); // Equivalent to force.mult(-1) and then adding to j
      }
    }

    // Apply all forces and update
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].applyForce(forces[i]);
      bodies[i].update();
      bodies[i].display(P);
    }
  };
};