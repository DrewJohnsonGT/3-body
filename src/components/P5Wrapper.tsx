/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useLayoutEffect, useRef } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import P5 from 'p5';
import { RgbColor } from 'react-colorful';
import { Body } from '~/classes/Body';
import { Particle } from '~/classes/Particle';
import { generateStars } from '~/classes/Star';
import { CANVAS_CONTAINER_ID, G, STAR_PARALLAX_FACTOR } from '~/constants';
import { ActionType, NewBodyColorType, NewBodyType, useAppContext } from '~/Context';
import { useThrottle } from '~/hooks/useThrottle';
import { COLOR_PALETTES, ColorPaletteColor, getRandomColor, hexToP5Color, rgbColorToP5Color } from '~/utils/color';
import { SYSTEMS_MAP } from '~/utils/systems';

interface Touch {
  x: number;
  y: number;
}

declare module 'p5' {
  interface p5InstanceExtensions {
    prevTouchCenterX?: number;
    prevTouchCenterY?: number;
    prevTouchDist?: number;
    prevTouchX?: number;
    prevTouchY?: number;
  }
}

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
  return { height, width };
};

const getNewBodyColor = ({
  newBodyColor,
  newBodyColorPalette,
  newBodyColorType,
  P,
}: {
  newBodyColor: RgbColor;
  newBodyColorPalette: ColorPaletteColor;
  newBodyColorType: NewBodyColorType;
  P: P5;
}) => {
  if (newBodyColorType === 'theme') {
    const paletteColors = COLOR_PALETTES[newBodyColorPalette];
    const randomColor = paletteColors[Math.floor(P.random(paletteColors.length))];
    return hexToP5Color(P, randomColor);
  }
  return newBodyColorType === 'random' ? getRandomColor(P) : rgbColorToP5Color(P, newBodyColor);
};

const addNewBody = ({
  mass,
  newBodyColor,
  newBodyColorPalette,
  newBodyColorType,
  newBodyCustomMass,
  newBodyMassType,
  P,
  pos,
  showTrail,
  trailLength,
  vel,
}: {
  mass?: number;
  newBodyColor: RgbColor;
  newBodyColorPalette: ColorPaletteColor;
  newBodyColorType: NewBodyColorType;
  newBodyCustomMass: number;
  newBodyMassType: NewBodyType;
  P: P5;
  pos: P5.Vector;
  showTrail: boolean;
  trailLength: number;
  vel?: P5.Vector;
}) => {
  const color = getNewBodyColor({
    newBodyColor,
    newBodyColorPalette,
    newBodyColorType,
    P,
  });
  const newBodyMass = mass || (newBodyMassType === 'random' ? P.random(10, 100) : newBodyCustomMass);
  const newBody = new Body({
    color,
    mass: newBodyMass,
    pos,
    showTrail,
    trailLength,
    vel,
  });

  const numParticles = Math.min(newBodyMass, 500);
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
  Haptics.impact({ style: ImpactStyle.Light }).catch((e: unknown) => {
    console.error(e);
  });
  return { newBody, newParticles };
};

const calculateGravity = (P: P5, body1: Body, body2: Body, gravityMultiplier: number) => {
  const forceVector = P5.Vector.sub(body2.pos, body1.pos);
  const constrainedDistance = P.constrain(forceVector.mag(), 50, 10000);
  forceVector.normalize();

  const gravitationalForceStrength = (G * body1.mass * body2.mass) / Math.pow(constrainedDistance, 2);
  forceVector.mult(gravitationalForceStrength);
  forceVector.mult(gravityMultiplier);

  return forceVector;
};

let p: P5;

export const P5Wrapper = () => {
  const {
    dispatch,
    state: {
      bodies,
      centerOffset,
      gravityMultiplier,
      isRunning,
      loading,
      newBodyColor,
      newBodyColorPalette,
      newBodyColorType,
      newBodyCustomMass,
      newBodyMassType,
      particles,
      restartSelectedSystem,
      selectedSystem,
      showBodyGlow,
      showData,
      showStars,
      showTrails,
      starCount,
      stars,
      starSize,
      tapToCreate,
      trailLength,
      zoom,
    },
  } = useAppContext();
  const divRef = useRef<HTMLDivElement>(null);

  const setup = (P: P5) => {
    const { height, width } = setCanvasSize(P);
    dispatch({
      payload: { height, width },
      type: ActionType.SetScreenSize,
    });
    P.frameRate(120);
    const {
      newBodiesConfig,
      trailLength: newSystemTrailLength,
      zoom: newSystemZoom,
    } = SYSTEMS_MAP[selectedSystem].systemFunction(P);
    const newBodyResults = newBodiesConfig.map((config) =>
      addNewBody({
        mass: config.mass,
        newBodyColor,
        newBodyColorPalette,
        newBodyColorType,
        newBodyCustomMass,
        newBodyMassType,
        P,
        pos: config.pos,
        showTrail: showTrails,
        trailLength,
        vel: config.vel,
      }),
    );

    const [newBodies, newParticles] = newBodyResults.reduce<[Body[], Particle[]]>(
      (acc, { newBody, newParticles }) => {
        acc[0].push(newBody);
        acc[1].push(...newParticles);
        return acc;
      },
      [[], []],
    );
    dispatch({
      payload: newBodies,
      type: ActionType.SetBodies,
    });
    dispatch({
      payload: newParticles,
      type: ActionType.SetParticles,
    });
    dispatch({
      payload: generateStars({
        centerOffset,
        P,
        starCount,
        starSize,
        zoom,
      }),
      type: ActionType.SetStars,
    });
    if (newSystemZoom) {
      dispatch({
        payload: newSystemZoom,
        type: ActionType.SetZoom,
      });
    }
    if (newSystemTrailLength) {
      dispatch({
        payload: newSystemTrailLength,
        type: ActionType.SetTrailLength,
      });
    }
  };

  const mouseClicked = useThrottle((event: PointerEvent, P: P5) => {
    if ((event.target as { className?: string }).className !== 'p5Canvas') return;
    if (!tapToCreate) return;
    const sx = event.offsetX;
    const sy = event.offsetY;

    // Step 1: Move so that the center of the canvas is the origin
    const sxCentered = sx - P.width / 2;
    const syCentered = sy - P.height / 2;

    // Step 2: Since we scaled by zoom, to go back we divide by zoom
    const worldXBeforeOffset = sxCentered / zoom;
    const worldYBeforeOffset = syCentered / zoom;

    // Step 3: We previously translated by -centerOffset, so now we add it back
    const worldX = worldXBeforeOffset + centerOffset.x;
    const worldY = worldYBeforeOffset + centerOffset.y;

    const pos = P.createVector(worldX, worldY);

    const { newBody, newParticles } = addNewBody({
      newBodyColor,
      newBodyColorPalette,
      newBodyColorType,
      newBodyCustomMass,
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
  }, 100);

  const handlePinchZoomAndPan = (P: P5) => {
    if (P.touches.length === 1) {
      const touch = P.touches[0] as Touch;

      if (P.prevTouchX !== undefined && P.prevTouchY !== undefined) {
        // Calculate deltaX and deltaY as difference between current and previous touch positions
        const deltaX = -(touch.x - P.prevTouchX) / zoom;
        const deltaY = -(touch.y - P.prevTouchY) / zoom;

        // Dispatch pan action
        dispatch({
          payload: { deltaX, deltaY },
          type: ActionType.Pan,
        });
      }

      // Update previous touch positions
      P.prevTouchX = touch.x;
      P.prevTouchY = touch.y;

      // Reset previous multi-touch values
      P.prevTouchDist = undefined;
    } else if (P.touches.length === 2) {
      const touch1 = P.touches[0] as Touch;
      const touch2 = P.touches[1] as Touch;

      // Calculate the current distance between the two touches
      const currentDist = P.dist(touch1.x, touch1.y, touch2.x, touch2.y);

      if (P.prevTouchDist !== undefined) {
        // Calculate zoom amount
        const zoomAmount = currentDist / P.prevTouchDist;

        // Update zoom level
        const newZoom = zoom * zoomAmount;
        dispatch({
          payload: newZoom,
          type: ActionType.SetZoom,
        });
      }

      // Update previous touch distance
      P.prevTouchDist = currentDist;

      // Reset previous single-touch values
      P.prevTouchX = undefined;
      P.prevTouchY = undefined;
    } else {
      // Reset when not touching with one or two fingers
      P.prevTouchDist = undefined;
      P.prevTouchX = undefined;
      P.prevTouchY = undefined;
    }
  };

  const draw = (P: P5) => {
    P.background(0);

    P.push();
    // Move the origin to the center of the canvas
    P.translate(P.width / 2, P.height / 2);

    // Apply zoom (scale)
    P.scale(zoom);

    // Now apply the offset
    P.translate(-centerOffset.x, -centerOffset.y);

    if (showStars) {
      P.push();
      P.translate(-centerOffset.x * STAR_PARALLAX_FACTOR, -centerOffset.y * STAR_PARALLAX_FACTOR);
      stars.forEach((star) => {
        star.display(P);
      });
      P.pop();
    }
    // Initialize force accumulators
    const forces = bodies.map(() => P.createVector(0, 0));

    // Calculate all forces
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const force = calculateGravity(P, bodies[i], bodies[j], gravityMultiplier);
        forces[i].add(force);
        forces[j].sub(force); // Equivalent to force.mult(-1) and then adding to j
      }
    }

    // Apply all forces and update bodies
    for (let i = 0; i < bodies.length; i++) {
      if (isRunning) {
        bodies[i].applyForce(forces[i]);
        bodies[i].update();
      }
      bodies[i].display(P, showBodyGlow);
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

    P.pop();
    if (showData) {
      P.fill(255);
      P.noStroke();
      P.textSize(12);
      P.text(`Zoom: ${String(zoom.toFixed(2))}`, 10, P.height * 0.75 - 100);
      P.text(`X: ${String(centerOffset.x.toFixed(2))}`, 10, P.height * 0.75 - 80);
      P.text(`Y: ${String(centerOffset.y.toFixed(2))}`, 10, P.height * 0.75 - 60);
      P.text(`Bodies: ${String(bodies.length)}`, 10, P.height * 0.75 - 40);
      P.text(`Particles: ${String(particles.length)}`, 10, P.height * 0.75 - 20);
    }

    handlePinchZoomAndPan(P);
  };

  // Re-draw when drawing state changes
  useEffect(() => {
    p.draw = () => {
      draw(p);
    };
    p.mouseClicked = (event: PointerEvent) => {
      mouseClicked(event, p);
    };
  }, [isRunning, bodies, particles, stars, gravityMultiplier, zoom, showStars, showData, centerOffset, showBodyGlow]);

  // Re-draw stars when zoom changes
  useEffect(() => {
    dispatch({
      payload: generateStars({
        centerOffset,
        P: p,
        starCount,
        starSize,
        zoom,
      }),
      type: ActionType.SetStars,
    });
  }, [zoom, starCount, starSize, centerOffset]);

  // Re-initialize when selected system changes
  useEffect(() => {
    if (restartSelectedSystem) {
      p.setup = () => {
        setup(p);
      };
      setup(p);
      dispatch({ type: ActionType.SystemRestarted });
    }
  }, [restartSelectedSystem, loading]);

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
    if (divRef.current) {
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
          P.setup = () => {
            setup(P);
          };
          setup(P);
        };
      }, divRef.current);
      p = myP5;

      return () => {
        p.remove();
      };
    }
  }, [loading]);

  useLayoutEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault(); // Prevent the default pinch zoom behavior
      }
    };

    const container = document.getElementById(CANVAS_CONTAINER_ID);
    if (container) {
      container.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <div
      ref={divRef}
      id={CANVAS_CONTAINER_ID}
      style={{
        display: loading ? 'none' : 'block',
        height: '100%',
        overflow: 'hidden',
      }}
    />
  );
};
