import Patron from "./patron.js";

export class DiagonalIzquierda extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    p.fill(color);
    const tamanoLinea = 10;
    const paso = (2 * tamanoLinea) / p.sin(p.radians(45));
    p.strokeWeight(tamanoLinea);
    for (let i = -p.height; i < p.width; i += paso) {
      p.line(i, 0, i + p.height, p.height);
    }
  }
}
