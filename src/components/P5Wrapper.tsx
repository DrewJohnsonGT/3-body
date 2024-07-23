import { useEffect, useLayoutEffect, useRef } from 'react';
import { IonContent } from '@ionic/react';
import P5 from 'p5';
import { CANVAS_CONTAINER_ID, G } from '~/constants';
import { ActionType, useAppContext } from '~/Context';
import { useThrottle } from '~/hooks/useThrottle';
import { Body } from '~/utils/Body';
import { getRandomColor } from '~/utils/color';
import { Particle } from '~/utils/Particle';
import { SYSTEMS_MAP } from '~/utils/systems';

const getCanvasSize = () => {
  const element = document.getElementById(CANVAS_CONTAINER_ID);
  if (!element) {
    return { height: 0, width: 0 };
  }
  const { height, width } = element.getBoundingClientRect();
  return { height, width };
};

export const setCanvasSize = (P: P5) => {
  const { height, width } = getCanvasSize();
  P.resizeCanvas(width || P.windowWidth, height || P.windowHeight);
};

const addRandomBody = (P: P5, pos: P5.Vector) => {
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

let p: P5;

export const P5Wrapper = () => {
  const {
    dispatch,
    state: { bodies, isRunning, particles, selectedSystem },
  } = useAppContext();

  const canvasRef = useRef<HTMLDivElement>(null);

  const setup = (P: P5) => {
    setCanvasSize(P);
    P.frameRate(60);
    dispatch({
      payload: SYSTEMS_MAP[selectedSystem](P),
      type: ActionType.SetBodies,
    });
  };

  const mouseClicked = useThrottle((event: PointerEvent, P: P5) => {
    const pos = P.createVector(event.offsetX, event.offsetY);
    const { newBody, newParticles } = addRandomBody(P, pos);
    dispatch({
      payload: newBody,
      type: ActionType.AddBody,
    });
    dispatch({
      payload: newParticles,
      type: ActionType.SetParticles,
    });
  }, 50);

  const draw = (P: P5) => {
    P.background(0);
    if (!isRunning) {
      P.fill(255);
      P.text('Paused', 50, 50);
    }
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
      if (isRunning) {
        bodies[i].applyForce(forces[i]);
        bodies[i].update();
      }
      bodies[i].display(P);
    }

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      if (isRunning) {
        particle.update();
      }
      particle.display(P);
      if (particle.isDead()) {
        particles.splice(i, 1);
      }
    }
  };

  // Re-draw when drawing state changes
  useEffect(() => {
    p.draw = () => {
      draw(p);
    };
  }, [isRunning, bodies, particles]);

  // Re-initialize when selected system changes
  useEffect(() => {
    p.setup = () => {
      setup(p);
    };
  }, [selectedSystem]);

  // Initialize P5
  useLayoutEffect(() => {
    if (canvasRef.current) {
      const myP5 = new P5((P: P5) => {
        P.setup = () => {
          setup(P);
        };
        P.draw = () => {
          draw(P);
        };
        P.mouseClicked = (event: PointerEvent) => {
          mouseClicked(event, P);
        };
      }, canvasRef.current);
      p = myP5;
      return () => {
        p.remove();
      };
    }
  }, []);

  return (
    <IonContent>
      <div
        ref={canvasRef}
        id={CANVAS_CONTAINER_ID}
        style={{ height: '100%', overflow: 'hidden' }}
      />
    </IonContent>
  );
};
