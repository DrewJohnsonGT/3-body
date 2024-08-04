import P5 from 'P5';

export class Star {
  public x: number;
  public y: number;
  public size: number;

  constructor({ size, x, y }: { x: number; y: number; size: number }) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  display(P: P5) {
    P.push();
    P.fill(255);
    P.noStroke();
    P.ellipse(this.x, this.y, this.size);
    P.pop();
  }
}
