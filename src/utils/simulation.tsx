import P5 from 'p5';
import { CANVAS_CONTAINER_ID, G } from '~/constants';
import { ActionType, Dispatch, State } from '~/Context';
import { Body } from '~/utils/Body';
import { getRandomColor } from '~/utils/color';
import { Particle } from '~/utils/Particle';
import { SYSTEM_FIGURE_EIGHT } from '~/utils/systems';

const getCanvasSize = () => {
  const element = document.getElementById(CANVAS_CONTAINER_ID);
  if (!element) {
    return { height: 0, width: 0 };
  }
  const { height, width } = element.getBoundingClientRect();
  return { height, width };
};

const setCanvasSize = (P: P5) => {
  const { height, width } = getCanvasSize();
  P.resizeCanvas(width || P.windowWidth, height || P.windowHeight);
};

const addRandomBody = (P: P5, pos: P5.Vector) => {
  console.log('addRandomBody');
  const newBodyColor = getRandomColor(P);
  const newBody = new Body({
    color: newBodyColor,
    mass: P.random(10, 100),
    pos,
    vel: P.createVector(P.random(-1, 1), P.random(-1, 1)),
  });

  const numParticles = 20;
  const newParticles = Array.from({ length: numParticles }, () => {
    const angle = P.random(P.TWO_PI);
    const speed = P.random(1, 3);
    const vel = P.createVector(P.cos(angle) * speed, P.sin(angle) * speed);
    return new Particle({
      color: newBodyColor,
      lifespan: P.random(10, 100),
      pos,
      vel,
    });
  });
  return { newBody, newParticles };
};

const calculateGravity = (P: P5, b1: Body, b2: Body) => {
  const force = P5.Vector.sub(b2.pos, b1.pos);
  const distance = P.constrain(force.mag(), 50, 10000);
  force.normalize();
  const strength = (G * b1.mass * b2.mass) / (distance * distance);
  force.mult(strength);
  return force;
};

export const simulation = (P: P5, state: State, dispatch: Dispatch) => {
  const { bodies, particles } = state;
  P.setup = () => {
    setCanvasSize(P);
    P.frameRate(60);
    bodies.push(...SYSTEM_FIGURE_EIGHT(P));
  };

  P.windowResized = () => {
    setCanvasSize(P);
  };

  P.mouseClicked = (event: PointerEvent) => {
    const pos = P.createVector(event.offsetX, event.offsetY);
    const { newBody, newParticles } = addRandomBody(P, pos);
    dispatch({
      payload: newBody,
      type: ActionType.AddBody,
    });
    particles.push(...newParticles);
  };

  P.draw = () => {
    P.background(0);

    // Initialize force accumulators
    const forces = bodies.map(() => P.createVector(0, 0));

    // Calculate all forces
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const force = calculateGravity(P, bodies[i], bodies[j]);
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

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.display(P);
      if (p.isDead()) {
        particles.splice(i, 1);
      }
    }
  };
};
