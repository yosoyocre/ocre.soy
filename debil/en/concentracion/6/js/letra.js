class Letra {
  constructor(letra, font, x, y, w, h, world) {
    this.letra = letra;
    this.font = font;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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
    var points = this.font.textToPoints(this.letra, 0, 0, 250, {
      sampleFactor: 0.1,
    });

    beginShape();
    stroke(112, 50, 126);
    fill(240, 99, 164);
    for (let i = 0; i < points.length; i++) {
      let pt = points[i];
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
  }
}
