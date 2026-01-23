import Patron from "./patron.js";

export class LineasDiskSampling extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    p.fill(color);

    const pds = new PoissonDiskSampling({
      shape: [p.width, p.height],
      minDistance: 20,
      maxDistance: 30,
      tries: 10,
    });
    const points = pds.fill();

    const tamanoLinea = 8;

    p.strokeWeight(6);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      p.push();
      p.translate(x, y);
      p.rotate(p.random(p.TWO_PI));
      p.line(-tamanoLinea, 0, tamanoLinea, 0);
      p.pop();
    }
  }
}
