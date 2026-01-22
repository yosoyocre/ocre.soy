import Patron from "../patron.js";

export class Puntos extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    p.fill(color);
    const tamanoLinea = 12;
    const paso = 18;
    p.strokeWeight(tamanoLinea);
    for (let x = tamanoLinea / -3; x <= p.width; x += paso) {
      for (let y = tamanoLinea / -3; y <= p.height; y += paso) {
        p.point(x, y);
      }
    }
  }
}
