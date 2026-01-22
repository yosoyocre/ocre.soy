import Patron from "./patron.js";

export class Laberinto extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    // Dibujamos líneas cortas con ángulos variables y que no se toquen
    const tamanoLinea = 14;
    const paso = 14;
    p.fill(color);
    p.strokeCap(p.PROJECT);
    p.strokeWeight(8);
    for (let x = 0; x <= p.width; x += paso) {
      for (let y = 0; y <= p.height; y += paso) {
        let angulo = p.floor(p.random(0, 4)) * 90;
        let xFin = x + tamanoLinea * p.cos(p.radians(angulo));
        let yFin = y + tamanoLinea * p.sin(p.radians(angulo));
        p.line(x, y, xFin, yFin);
      }
    }
  }
}
