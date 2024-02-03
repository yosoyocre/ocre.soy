class Caja {
  constructor(x, y, w, h, c, world) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.world = world;
    let options = {
      friction: 1,
      restitution: 0,
    };
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    Composite.add(this.world, this.body);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    stroke("#131313");
    fill(this.c);
    rect(0, 0, this.w, this.h);
    pop();
  }
}
