import P5 from 'p5';

export class Particle {
  public pos: P5.Vector;
  public vel: P5.Vector;
  public color: P5.Color;
  public lifespan: number;

  constructor({
    color,
    lifespan,
    pos,
    vel,
  }: {
    pos: P5.Vector;
    vel: P5.Vector;
    color: P5.Color;
    lifespan: number;
  }) {
    this.pos = pos.copy();
    this.vel = vel.copy();
    this.color = color;
    this.lifespan = lifespan;
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 1;
  }

  display(P: P5) {
    P.push();
    P.strokeWeight(4);
    P.stroke(
      P.red(this.color),
      P.green(this.color),
      P.blue(this.color),
      this.lifespan,
    );
    P.point(this.pos.x, this.pos.y);
    P.pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
