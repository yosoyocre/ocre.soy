import Patron from "../patron.js";

export class Cruzado extends Patron {
  dibujar(p, color) {
    p.fill(color);
    p.rect(0, 0, p.width, p.height);

    p.stroke(255);
    const tamanoLinea = 4;
    const paso = (4 * tamanoLinea) / p.sin(p.radians(45));
    p.strokeWeight(tamanoLinea);
    for (let i = -p.height; i < p.width; i += paso) {
      p.line(i, 0, i + p.height, p.height);
    }
    for (let i = 0; i < p.width + p.height; i += paso) {
      p.line(i, 0, i - p.height, p.height);
    }
  }
}
