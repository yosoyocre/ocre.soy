import Patron from "./patron.js";

export class CirculosTachados extends Patron {
  dibujar(p, color) {
    p.background(255);
    // Para que las líneas queden nítidas movemos el origen medio píxel
    p.translate(0.5, 0.5);

    p.stroke(color);
    p.strokeWeight(5);

    p.noFill();
    for (let x = 0; x <= p.width; x += 70) {
      for (let y = 0; y <= p.height; y += 70) {
        // Centramos el cículo en el centro del cuadrado
        p.circle(x + 35, y + 35, 40);
        // Cerramos el círculo en un cuadrado
        p.line(x, y, x + 70, y);
        p.line(x, y, x, y + 70);
        // Dibujamos líneas que atraviesen el círculo verticial y horizontalmente
        p.line(x + 35, y, x + 35, y + 70);
        p.line(x, y + 35, x + 70, y + 35);
        // Dibujamos líneas que atraviesen el círculo diagonalmente
        p.line(x, y, x + 70, y + 70);
        p.line(x + 70, y, x, y + 70);
      }
    }
  }
}
