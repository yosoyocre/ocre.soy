import Patron from "./patron.js";

export class Ruido extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    p.fill(color);

    for (let x = 0; x <= p.width; x += 1) {
      for (let y = 0; y <= p.height; y += 1) {
        if (p.random() < 0.05) {
          p.point(x, y);
        }
      }
    }
  }
}
