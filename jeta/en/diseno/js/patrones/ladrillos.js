import Patron from "./patron.js";

export class Ladrillos extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    const tamanoLinea = 40;
    const paso = 70 / 4;
    p.fill(color);
    p.strokeWeight(5);
    for (let y = 0; y <= p.height; y += paso) {
      p.line(0, y, p.width, y);
    }
    for (let x = 0; x <= p.width; x += tamanoLinea) {
      for (let y = 0; y <= p.height; y += paso) {
        if (y % (paso * 2) === 0) {
          p.line(x, y, x, y + paso);
        } else {
          p.line(x - tamanoLinea / 2, y, x - tamanoLinea / 2, y + paso);
        }
      }
    }
  }
}
