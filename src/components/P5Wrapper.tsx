/* eslint-disable max-lines */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { RgbaColor } from 'react-colorful';
import { IonContent } from '@ionic/react';
import P5 from 'p5';
import { Body } from '~/classes/Body';
import { Particle } from '~/classes/Particle';
import { Star } from '~/classes/Star';
import { CANVAS_CONTAINER_ID, G } from '~/constants';
import {
  ActionType,
  NewBodyColorType,
  NewBodyType,
  useAppContext,
} from '~/Context';
import { useThrottle } from '~/hooks/useThrottle';
import {
  COLOR_PALETTES,
  ColorPaletteColor,
  getRandomColor,
  hexToP5Color,
  rgbaColorToP5Color,
} from '~/utils/color';
import { SYSTEMS_MAP } from '~/utils/systems';

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

const getNewBodyColor = ({
  newBodyColor,
  newBodyColorPalette,
  newBodyColorType,
  P,
}: {
  P: P5;
  newBodyColor: RgbaColor;
  newBodyColorType: NewBodyColorType;
  newBodyColorPalette: ColorPaletteColor;
}) => {
  if (newBodyColorType === 'theme') {
    const paletteColors = COLOR_PALETTES[newBodyColorPalette];
    const randomColor =
      paletteColors[Math.floor(P.random(paletteColors.length))];
    return hexToP5Color(P, randomColor);
  }
  return newBodyColorType === 'random'
    ? getRandomColor(P)
    : rgbaColorToP5Color(P, newBodyColor);
};

const addNewBody = ({
  newBodyColor,
  newBodyColorPalette,
  newBodyColorType,
  newBodyMass,
  newBodyMassType,
  P,
  pos,
  showTrail,
  trailLength,
}: {
  P: P5;
  pos: P5.Vector;
  trailLength: number;
  showTrail: boolean;
  newBodyColorType: NewBodyColorType;
  newBodyMassType: NewBodyType;
  newBodyMass: number;
  newBodyColor: RgbaColor;
  newBodyColorPalette: ColorPaletteColor;
}) => {
  const color = getNewBodyColor({
    newBodyColor,
    newBodyColorPalette,
    newBodyColorType,
    P,
  });
  const mass = newBodyMassType === 'random' ? P.random(10, 100) : newBodyMass;

  const newBody = new Body({
    color,
    mass,
    pos,
    showTrail,
    trailLength,
    vel: P.createVector(P.random(-1, 1), P.random(-1, 1)),
  });

  const numParticles = mass;
  const newParticles = Array.from({ length: numParticles }, () => {
    const angle = P.random(P.TWO_PI);
    const speed = P.random(1, 3);
    const vel = P.createVector(P.cos(angle) * speed, P.sin(angle) * speed);
    return new Particle({
      color,
      lifespan: P.random(10, 100),
      pos,
      size: P.random(1, 8),
      vel,
    });
  });
  return { newBody, newParticles };
};

const calculateGravity = (
  P: P5,
  b1: Body,
  b2: Body,
  gravityMultiplier: number,
) => {
  const force = P5.Vector.sub(b2.pos, b1.pos);
  const distance = P.constrain(force.mag(), 50, 10000);
  force.normalize();
  const strength = (G * b1.mass * b2.mass) / (distance * distance);
  force.mult(strength);
  force.mult(gravityMultiplier);
  return force;
};

const generateStars = (P: P5, zoom: number): Star[] => {
  const numStars = 100;
  const starArray = Array.from(
    { length: numStars },
    () =>
      new Star({
        size: P.random(0.5, 2 / zoom),
        x: P.random(-P.width / 2 / zoom, P.width / 2 / zoom),
        y: P.random(-P.height / 2 / zoom, P.height / 2 / zoom),
      }),
  );
  return starArray;
};

let p: P5;

export const P5Wrapper = () => {
  const {
    dispatch,
    state: {
      bodies,
      gravityMultiplier,
      isRunning,
      newBodyColor,
      newBodyColorPalette,
      newBodyColorType,
      newBodyMass,
      newBodyMassType,
      particles,
      restartSelectedSystem,
      selectedSystem,
      showStars,
      showTrails,
      stars,
      tapToCreate,
      trailLength,
      zoom,
    },
  } = useAppContext();

  const canvasRef = useRef<HTMLDivElement>(null);

  const setup = (P: P5) => {
    setCanvasSize(P);
    P.frameRate(120);
    dispatch({
      payload: SYSTEMS_MAP[selectedSystem].systemFunction(P, {
        showTrail: showTrails,
        trailLength,
      }),
      type: ActionType.SetBodies,
    });
    dispatch({
      payload: generateStars(P, zoom),
      type: ActionType.SetStars,
    });
  };

  const mouseClicked = useThrottle((event: PointerEvent, P: P5) => {
    if (!tapToCreate) return;

    // Calculate the adjusted position based on the zoom factor
    const adjustedX = (event.offsetX - P.width / 2) / zoom + P.width / 2;
    const adjustedY = (event.offsetY - P.height / 2) / zoom + P.height / 2;
    const pos = P.createVector(adjustedX, adjustedY);

    const { newBody, newParticles } = addNewBody({
      newBodyColor,
      newBodyColorPalette,
      newBodyColorType,
      newBodyMass,
      newBodyMassType,
      P,
      pos,
      showTrail: showTrails,
      trailLength,
    });
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
    P.translate(P.width / 2, P.height / 2); // Move origin to center
    P.scale(zoom); // Apply zoom factor

    // Draw stars
    if (showStars) {
      stars.forEach((star) => {
        star.display(P);
      });
    }

    P.translate(-P.width / 2, -P.height / 2); // Move origin back
    // Initialize force accumulators
    const forces = bodies.map(() => P.createVector(0, 0));

    // Calculate all forces
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const force = calculateGravity(
          P,
          bodies[i],
          bodies[j],
          gravityMultiplier,
        );
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
    p.mouseClicked = (event: PointerEvent) => {
      mouseClicked(event, p);
    };
  }, [isRunning, bodies, particles, stars, gravityMultiplier, zoom, showStars]);

  // Re-draw stars when zoom changes
  useEffect(() => {
    dispatch({
      payload: generateStars(p, zoom),
      type: ActionType.SetStars,
    });
  }, [zoom]);

  // Re-initialize when selected system changes
  useEffect(() => {
    if (restartSelectedSystem) {
      p.setup = () => {
        setup(p);
      };
      setup(p);
      dispatch({ type: ActionType.SystemRestarted });
    }
  }, [restartSelectedSystem]);

  // Alter bodies when trail length changes
  useEffect(() => {
    bodies.forEach((body) => {
      body.setTrailLength(trailLength);
      body.setTrailVisibility(showTrails);
    });
    p.mouseClicked = (event: PointerEvent) => {
      mouseClicked(event, p);
    };
  }, [trailLength, showTrails]);

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
        P.windowResized = () => {
          setCanvasSize(P);
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
