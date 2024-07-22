import { useCallback, useEffect, useRef, useState } from 'react';
import { IonContent } from '@ionic/react';
import P5 from 'p5';
import { CANVAS_CONTAINER_ID, G } from '~/constants';
import { ActionType, useAppContext } from '~/Context';
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

export const setCanvasSize = (P: P5) => {
  const { height, width } = getCanvasSize();
  console.log('resizeCanvas', width, height);
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
    const color = newBodyColor;
    return new Particle({ color, pos, vel });
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

export const P5Wrapper = () => {
  const {
    dispatch,
    state: { bodies, isRunning, particles },
  } = useAppContext();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState<P5 | null>(null);

  const draw = useCallback(() => {
    if (!p) {
      return;
    }
    p.background(255);

    // Initialize force accumulators
    const forces = bodies.map(() => p.createVector(0, 0));

    // Calculate all forces
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const force = calculateGravity(p, bodies[i], bodies[j]);
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
      bodies[i].display(p);
    }

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      if (isRunning) {
        particle.update();
      }
      particle.display(p);
      if (particle.isDead()) {
        particles.splice(i, 1);
      }
    }
  }, []);

  const setup = useCallback(() => {
    console.log('setup');
    if (!p) {
      return;
    }
    console.log('setup with p');
    console.log(p);
    setCanvasSize(p);
    p.frameRate(60);
    dispatch({
      payload: SYSTEM_FIGURE_EIGHT(p),
      type: ActionType.SetBodies,
    });
  }, [dispatch, p]);

  const mouseClicked = (event: PointerEvent, P: P5) => {
    const pos = P.createVector(event.offsetX, event.offsetY);
    const { newBody, newParticles } = addRandomBody(P, pos);
    dispatch({
      payload: newBody,
      type: ActionType.AddBody,
    });
    particles.push(...newParticles);
  };

  useEffect(() => {
    if (canvasRef.current) {
      console.log('mount P5');
      const myP5 = new P5(() => ({}), canvasRef.current);
      setP(myP5);
      return () => {
        console.log('unmount P5');
        myP5.remove();
      };
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (p) {
      console.log('set p5');
      p.setup = setup;
      p.draw = draw;
      p.mouseClicked = (event: PointerEvent) => {
        mouseClicked(event, p);
      };
      p.windowResized = () => {
        setCanvasSize(p);
      };
      console.log(p);
    }
  }, [p]);

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
