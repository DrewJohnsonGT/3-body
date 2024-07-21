import P5 from 'p5';
import { Body } from '~/Body';
import { P5Wrapper } from '~/components/P5Wrapper';
import { G, WINDOW_SCALE } from '~/constants';
import { SYSTEM_1 } from '~/utils/systems';

const addRandomBody = (P: P5, pos: P5.Vector) => {
  return new Body({
    color: P.color(P.random(255), P.random(255), P.random(255)),
    mass: P.random(10, 100),
    pos,
    vel: P.createVector(P.random(-1, 1), P.random(-1, 1)),
  });
};

const threeBodySimulation = (P: P5) => {
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
    // Calculate all forces
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const force = calculateGravity(bodies[i], bodies[j]);
        bodies[i].applyForce(force);
        force.mult(-1);
        bodies[j].applyForce(force);
      }
    }

    // Update and display all bodies
    for (const body of bodies) {
      body.update();
      body.display(P);
    }
  };
};

export const App = () => {
  return (
    <div className="App">
      <P5Wrapper sketch={threeBodySimulation} />
    </div>
  );
};
