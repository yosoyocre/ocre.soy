import Patron from "./patron.js";

export class CuadradosConcentricos extends Patron {
  dibujar(p, color) {
    p.background(255);
    // Para que las líneas queden nítidas movemos el origen medio píxel
    p.translate(0.5, 0.5);

    p.stroke(color);
    p.strokeWeight(5);

    p.noFill();
    for (let x = 0; x <= p.width; x += 70) {
      for (let y = 0; y <= p.height; y += 70) {
        p.rect(x, y, 70, 70);
        p.rect(x + 10, y + 10, 70 - 20, 70 - 20);
        p.rect(x + 20, y + 20, 70 - 40, 70 - 40);
        p.rect(x + 30, y + 30, 70 - 60, 70 - 60);
      }
    }
  }
}
