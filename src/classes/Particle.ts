import P5 from 'p5';

export class Particle {
  public pos: P5.Vector;
  public vel: P5.Vector;
  public size: number;
  public color: P5.Color;
  public lifespan: number;

  constructor({
    color,
    lifespan,
    pos,
    size,
    vel,
  }: {
    color: P5.Color;
    lifespan: number;
    pos: P5.Vector;
    size: number;
    vel: P5.Vector;
  }) {
    this.pos = pos.copy();
    this.vel = vel.copy();
    this.size = size;
    this.color = color;
    this.lifespan = lifespan;
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 1;
  }

  display(P: P5) {
    P.push();
    P.strokeWeight(this.size);
    P.stroke(
      P.red(this.color),
      P.green(this.color),
      P.blue(this.color),
      this.lifespan + 25,
    );
    P.point(this.pos.x, this.pos.y);
    P.pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
