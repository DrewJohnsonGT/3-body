import P5 from 'p5';

const MAX_TRAIL_LENGTH = 100;

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

  updateTrail() {
    this.trail.push(this.pos.copy());
    if (this.trail.length > MAX_TRAIL_LENGTH) {
      this.trail.shift();
    }
  }

  display(P: P5) {
    // Glow effect
    const glowSize = 15; // Adjust size for more/less glow
    const glowAlpha = 30; // Adjust alpha for more/less intensity

    P.noStroke(); // No border for the glow to ensure smoothness
    for (let i = glowSize; i > 0; i -= 5) {
      // Gradual decrease in size
      P.fill(
        P.red(this.color),
        P.green(this.color),
        P.blue(this.color),
        glowAlpha,
      );
      P.ellipse(this.pos.x, this.pos.y, 20 + i); // Increase size for glow
    }

    // Trail display
    P.stroke(this.color);
    P.noFill();
    P.beginShape();
    for (const vector of this.trail) {
      P.vertex(vector.x, vector.y);
    }
    P.endShape();

    // Main body
    P.stroke(P.lerpColor(this.color, P.color(0, 0, 0), 0.4));
    P.fill(this.color);
    P.ellipse(this.pos.x, this.pos.y, 20);
  }
}
