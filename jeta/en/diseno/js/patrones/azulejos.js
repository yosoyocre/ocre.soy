import Patron from "./patron.js";

export class Azulejos extends Patron {
  dibujar(p, color) {
    p.background(255);
    // Para que las líneas queden nítidas movemos el origen medio píxel
    p.translate(0.5, 0.5);

    p.stroke(color);
    p.strokeWeight(5);
    for (let x = 0; x <= p.width; x += 70) {
      p.line(x, 0, x, p.height);
    }
    for (let y = 0; y <= p.height; y += 70) {
      p.line(0, y, p.width, y);
    }

    // Dibujamos círuclos en las intersecciones
    p.noFill();
    for (let x = 0; x <= p.width; x += 70) {
      for (let y = 0; y <= p.height; y += 70) {
        p.circle(x, y, 70);
      }
    }
  }
}
