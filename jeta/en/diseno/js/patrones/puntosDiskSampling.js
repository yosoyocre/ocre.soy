import Patron from "./patron.js";

export class PuntosDiskSampling extends Patron {
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

    p.strokeWeight(12);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      p.point(x, y);
    }
  }
}
