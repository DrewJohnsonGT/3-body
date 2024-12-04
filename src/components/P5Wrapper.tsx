/* eslint-disable max-lines */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { RgbColor } from 'react-colorful';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import P5 from 'p5';
import { Body } from '~/classes/Body';
import { Particle } from '~/classes/Particle';
import { generateStars, STAR_PARALLAX_FACTOR } from '~/classes/Star';
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
  rgbColorToP5Color,
} from '~/utils/color';
import { SYSTEMS_MAP } from '~/utils/systems';

interface Touch {
  x: number;
  y: number;
}

declare module 'p5' {
  interface p5InstanceExtensions {
    prevTouchDist?: number;
    prevTouchCenterX?: number;
    prevTouchCenterY?: number;
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
  P: P5;
  newBodyColor: RgbColor;
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
    : rgbColorToP5Color(P, newBodyColor);
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
  P: P5;
  mass?: number;
  vel?: P5.Vector;
  pos: P5.Vector;
  trailLength: number;
  showTrail: boolean;
  newBodyColorType: NewBodyColorType;
  newBodyMassType: NewBodyType;
  newBodyCustomMass: number;
  newBodyColor: RgbColor;
  newBodyColorPalette: ColorPaletteColor;
}) => {
  const color = getNewBodyColor({
    newBodyColor,
    newBodyColorPalette,
    newBodyColorType,
    P,
  });
  const newBodyMass =
    mass ||
    (newBodyMassType === 'random' ? P.random(10, 100) : newBodyCustomMass);
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

const calculateGravity = (
  P: P5,
  body1: Body,
  body2: Body,
  gravityMultiplier: number,
) => {
  const forceVector = P5.Vector.sub(body2.pos, body1.pos);
  const constrainedDistance = P.constrain(forceVector.mag(), 50, 10000);
  forceVector.normalize();

  const gravitationalForceStrength =
    (G * body1.mass * body2.mass) / Math.pow(constrainedDistance, 2);
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

    const [newBodies, newParticles] = newBodyResults.reduce<
      [Body[], Particle[]]
    >(
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
    if ((event.target as { className?: string }).className !== 'p5Canvas')
      return;
    if (!tapToCreate) return;

    // Calculate the adjusted position based on the zoom factor and centerOffset
    const adjustedX =
      (event.offsetX - centerOffset.x - P.width / 2) / zoom + P.width / 2;
    const adjustedY =
      (event.offsetY - centerOffset.y - P.height / 2) / zoom + P.height / 2;
    const pos = P.createVector(adjustedX, adjustedY);

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
  }, 50);

  const handlePinchZoomAndPan = (P: P5) => {
    if (P.touches.length === 2) {
      const touch1 = P.touches[0] as Touch;
      const touch2 = P.touches[1] as Touch;

      // Calculate the current center point between the two touches
      const currentCenterX = (touch1.x + touch2.x) / 2;
      const currentCenterY = (touch1.y + touch2.y) / 2;

      // Calculate the current distance between the two touches
      const currentDist = P.dist(touch1.x, touch1.y, touch2.x, touch2.y);

      if (
        P.prevTouchDist !== undefined &&
        P.prevTouchCenterX !== undefined &&
        P.prevTouchCenterY !== undefined
      ) {
        // Calculate zoom amount
        const zoomAmount = currentDist / P.prevTouchDist;
        // Define a threshold for zoom sensitivity
        const ZOOM_THRESHOLD = 0.08; // 8% change

        // Calculate the percentage change in distance
        const distChangeRatio = Math.abs(zoomAmount - 1);

        // Calculate pan offset due to movement of fingers
        // Adjust pan delta according to zoom level
        const deltaX = (currentCenterX - P.prevTouchCenterX) / zoom;
        const deltaY = (currentCenterY - P.prevTouchCenterY) / zoom;

        // Apply zoom if the change exceeds the threshold
        if (distChangeRatio > ZOOM_THRESHOLD) {
          const newZoom = zoom * zoomAmount;
          dispatch({
            payload: newZoom,
            type: ActionType.SetZoom,
          });

          // Since we're zooming relative to the origin (centerOffset),
          // we don't adjust the pan during zoom
          // Just apply the pan due to finger movement
          dispatch({
            payload: { deltaX, deltaY },
            type: ActionType.Pan,
          });
        } else {
          // No zoom applied, regular pan
          dispatch({
            payload: { deltaX, deltaY },
            type: ActionType.Pan,
          });
        }
      }

      // Update previous touch values
      P.prevTouchDist = currentDist;
      P.prevTouchCenterX = currentCenterX;
      P.prevTouchCenterY = currentCenterY;
    } else {
      // Reset when not touching with two fingers
      P.prevTouchDist = undefined;
      P.prevTouchCenterX = undefined;
      P.prevTouchCenterY = undefined;
    }
  };

  const draw = (P: P5) => {
    handlePinchZoomAndPan(P);

    P.background(0);

    P.push();
    P.translate(P.width / 2, P.height / 2);
    P.scale(zoom);
    if (showStars) {
      P.push();
      P.translate(
        centerOffset.x * STAR_PARALLAX_FACTOR,
        centerOffset.y * STAR_PARALLAX_FACTOR,
      );
      stars.forEach((star) => {
        star.display(P);
      });
      P.pop();
    }

    // Apply pan transformations for bodies
    P.translate(centerOffset.x, centerOffset.y);
    P.translate(-P.width / 2, -P.height / 2);

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

    // Apply all forces and update bodies
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

    // Restore the original transformation state
    P.pop();

    // Draw meta data (FPS) in bottom-left corner without transformations
    if (showData) {
      P.fill(255);
      P.noStroke();
      P.textSize(16); // Set desired text size
      P.textAlign(P.LEFT, P.BOTTOM);
      P.text(`Zoom: ${String(zoom.toFixed(2))}`, 10, P.height - 90);
      P.text(`X: ${String(centerOffset.x.toFixed(2))}`, 10, P.height - 70);
      P.text(`Y: ${String(centerOffset.y.toFixed(2))}`, 10, P.height - 50);
      P.text(`Bodies: ${String(bodies.length)}`, 10, P.height - 30);
      P.text(`Particles: ${String(particles.length)}`, 10, P.height - 10);
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
  }, [
    isRunning,
    bodies,
    particles,
    stars,
    gravityMultiplier,
    zoom,
    showStars,
    showData,
    centerOffset,
  ]);

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
