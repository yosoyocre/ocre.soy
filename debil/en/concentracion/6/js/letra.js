class Letra {
  constructor(letra, font, x, y, tamanoLetra, world) {
    this.letra = letra;
    this.font = font;
    this.x = x;
    this.y = y;
    this.tamanoLetra = tamanoLetra;
    this.world = world;

    this.points = this.font.textToPoints(this.letra, 0, 0, this.tamanoLetra, {
      sampleFactor: 0.1,
    });

    let options = {
      friction: 1,
      restitution: 0,
    };
    this.body = Bodies.fromVertices(
      this.x,
      this.y,
      Vertices.create(this.points),
      options
    );
    Composite.add(this.world, this.body);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);

    beginShape();
    noStroke();
    fill(228, 63, 41);
    for (let i = 0; i < this.points.length; i++) {
      let pt = this.points[i];
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
  }
}
