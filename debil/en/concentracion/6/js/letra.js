class Letra {
  constructor(letra, font, x, y, tamanoLetra, world) {
    this.letra = letra;
    this.font = font;
    this.x = x;
    this.y = y;
    this.tamanoLetra = tamanoLetra;
    this.world = world;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    this.points = this.font.textToPoints(
      this.letra,
      200,
      200,
      this.tamanoLetra,
      {
        sampleFactor: 1,
      }
    );

    for (let i = 0; i < this.points.length; i++) {
      let pt = this.points[i];
      if (pt.x < minX) {
        minX = pt.x;
      }
      if (pt.x > maxX) {
        maxX = pt.x;
      }
      if (pt.y < minY) {
        minY = pt.y;
      }
      if (pt.y > maxY) {
        maxY = pt.y;
      }
    }

    this.centerX = (minX + maxX) / 2;
    this.centerY = (minY + maxY) / 2;

    let options = {
      friction: 1,
      restitution: 0,
    };
    this.body = Bodies.fromVertices(
      this.x,
      this.y,
      Vertices.create(this.points),
      options,
      true
    );

    let primeraDifX = this.points[0].x - this.body.vertices[0].x;
    let primeraDifY = this.points[0].y - this.body.vertices[0].y;

    this.pointsMapped = this.points.map((pt) => {
      let verticeMasCercano = null;
      let posicionVertice = null;
      let minDistancia = Infinity;

      for (let i = 0; i < this.body.vertices.length; i++) {
        let vt = this.body.vertices[i];
        let distancia = dist(
          vt.x,
          vt.y,
          pt.x - primeraDifX,
          pt.y - primeraDifY
        );
        if (distancia < minDistancia) {
          minDistancia = distancia;
          verticeMasCercano = vt;
          posicionVertice = i;
        }
      }

      return [
        posicionVertice,
        createVector(verticeMasCercano.x, verticeMasCercano.y),
      ];
    });

    // console.log(this.pointsMapped);

    // Body.setPosition(this.body, {
    //   x: this.x - this.centerX,
    //   y: this.y - this.centerY,
    //   // x: this.centerX,
    //   // y: this.centerY,
    // });

    Composite.add(this.world, this.body);

    // Función para dibujar un cuerpo de Matter.js en el lienzo de p5.js
    this.drawMatterBody = function (body) {
      const vertices = body.vertices;

      // console.log(this.pointsMapped[0]);
      // console.log(this.pointsMapped[0][0].x, this.pointsMapped[0][0].y);
      // line(0, 0, this.pointsMapped[0][1].x, this.pointsMapped[0][1].y);
      // line(0, 0, 200, 200);

      beginShape();
      noStroke();
      fill(228, 63, 41);

      // for (let i = 0; i < this.pointsMapped.length; i++) {
      //   let pt = this.pointsMapped[i];
      //   let verticeOrginal = pt[1];
      //   let vertice = vertices[pt[0]];

      //   // Convertimos los vertices en vectores
      //   let vectorOrginal = createVector(verticeOrginal.x, verticeOrginal.y);
      //   let vectorActual = createVector(vertice.x, vertice.y);
      //   let vectorPunto = createVector(this.points[i].x, this.points[i].y);

      //   // console.log(vector.x, vector.y);

      //   stroke(255, 0, 0);
      //   line(0, 0, vectorActual.x, vectorActual.y);

      //   let vectorDiferencia = p5.Vector.sub(vectorPunto, vectorOrginal);

      //   let vectorPuntoFinal = p5.Vector.add(vectorDiferencia, vectorActual);

      //   stroke(0, 255, 0);
      //   line(vectorPunto.x, vectorPunto.y, vectorOrginal.x, vectorOrginal.y);

      //   // vertex(pt.x * relacionX, pt.y * relacionY);
      //   vertex(vectorPuntoFinal.x, vectorPuntoFinal.y);
      // }

      for (let i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
      }
      endShape(CLOSE);
    };
  }

  show() {
    push();
    this.drawMatterBody(this.body);

    // translate(pos.x, pos.y);
    // rotate(angle);

    // beginShape();
    // noStroke();
    // fill(228, 63, 41);
    // for (let i = 0; i < this.points.length; i++) {
    //   let pt = this.points[i];
    //   vertex(pt.x, pt.y);
    // }
    // endShape(CLOSE);
    pop();
  }
}
