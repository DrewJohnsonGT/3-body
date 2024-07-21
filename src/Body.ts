import P5 from 'p5';

export class Body {
  public mass: number;
  public pos: P5.Vector;
  public vel: P5.Vector;
  public color: P5.Color;

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
  }

  applyForce(force: P5.Vector) {
    force.div(this.mass);
    this.vel.add(force);
  }

  update() {
    this.pos.add(this.vel);
  }

  display(P: P5) {
    P.stroke(P.lerpColor(this.color, P.color(0, 0, 0), 0.1));
    P.fill(this.color);
    P.ellipse(this.pos.x, this.pos.y, 20);
  }
}
