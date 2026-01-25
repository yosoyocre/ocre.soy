import Patron from "./patron.js";

export class AzulejosFlores2 extends Patron {
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

    p.noFill();
    for (let x = 0; x <= p.width; x += 70) {
      for (let y = 0; y <= p.height; y += 70) {
        p.circle(x + 35, y + 70 / 3, 20);
        p.arc(x + 35, y + 35, 70, 70, 0, Math.PI);
        // Dibujamos un arco en la esquina inferior izquierda del cuadrado
        p.arc(x, y + 70, 70, 70, -Math.PI / 2, 0);
        // Dibujamos un arco en la esquina inferior derecha del cuadrado
        p.arc(x + 70, y + 70, 70, 70, Math.PI, Math.PI * 1.5);
      }
    }
  }
}
