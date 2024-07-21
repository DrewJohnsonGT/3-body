import P5 from 'p5';
import { getDarkerColor } from '~/utils/color';

const MAX_TRAIL_LENGTH = 500;
const SIZE_MULTIPLIER = 4;

export class Body {
  public mass: number;
  public pos: P5.Vector;
  public vel: P5.Vector;
  public color: P5.Color;
  public trail: P5.Vector[];

  constructor({
    color = new P5.Color(),
    mass = 1,
    pos = new P5.Vector(),
    vel = new P5.Vector(),
  }: {
    mass?: number;
    pos?: P5.Vector;
    vel?: P5.Vector;
    color?: P5.Color;
  }) {
    this.mass = mass;
    this.pos = pos;
    this.vel = vel;
    this.color = color;
    this.trail = [];
  }

  applyForce(force: P5.Vector) {
    force.div(this.mass);
    this.vel.add(force);
  }

  update() {
    this.pos.add(this.vel);
    this.updateTrail();
  }

  getSize() {
    return Math.cbrt(this.mass) * SIZE_MULTIPLIER;
  }

  updateTrail() {
    this.trail.push(this.pos.copy());
    if (this.trail.length > MAX_TRAIL_LENGTH) {
      this.trail.shift();
    }
  }

  display(P: P5) {
    // Glow effect
    const glowSize = 15;
    const glowAlpha = 30;
    P.noStroke();
    for (let i = glowSize; i > 0; i -= 5) {
      P.fill(
        P.red(this.color),
        P.green(this.color),
        P.blue(this.color),
        glowAlpha,
      );
      P.ellipse(this.pos.x, this.pos.y, this.getSize() + i);
    }

    // Trail display with fading effect
    P.noFill();
    for (let i = 1; i < this.trail.length; i++) {
      const alpha = P.map(i, 0, this.trail.length, 0, 255);
      const vector = this.trail[i];
      const prevVector = this.trail[i - 1];

      const r = P.red(this.color);
      const g = P.green(this.color);
      const b = P.blue(this.color);

      P.stroke(r, g, b, alpha);
      P.strokeWeight(this.getSize() / 4);
      P.line(prevVector.x, prevVector.y, vector.x, vector.y);
    }

    // Main body
    P.strokeWeight(2);
    P.stroke(getDarkerColor(P, this.color, 0.4));
    P.fill(this.color);
    P.ellipse(this.pos.x, this.pos.y, this.getSize());
  }
}
