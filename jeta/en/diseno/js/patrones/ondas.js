import Patron from "./patron.js";

export class Ondas extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    const tamanoLinea = 20;
    const pasoX = tamanoLinea;
    const pasoY = tamanoLinea / 2;
    p.fill(color);
    p.strokeWeight(3);
    for (let x = 0; x <= p.width; x += pasoX) {
      for (let y = 0; y <= p.height; y += pasoY) {
        // let offset = (y / height) * p.PI * 2;
        let offset = p.noise(x * 0.01, y * 0.01) * p.PI;
        let xFin = x + tamanoLinea * p.cos(offset);
        let yFin = y + tamanoLinea * p.sin(offset);
        p.line(x, y, xFin, yFin);
      }
    }
  }
}
