import Patron from "./patron.js";

export class Angulos extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    const tamanoLinea = 40;
    const pasoX = tamanoLinea;
    const pasoY = tamanoLinea / 2;
    p.fill(color);
    p.strokeWeight(5);
    for (let x = 0; x <= p.width; x += pasoX) {
      for (let y = 0; y <= p.height; y += pasoY) {
        p.line(x, y, x + tamanoLinea / 2, y + tamanoLinea);
        p.line(x + tamanoLinea, y, x + tamanoLinea / 2, y + tamanoLinea);
      }
    }
  }
}
