import Patron from "./patron.js";

export class AzulejosFlores extends Patron {
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
        // Dibujamos un arco en la mita superior del cuadrado
        p.arc(x + 35, y, 70, 70, 0, Math.PI);

        p.arc(x + 70 / 4, y, 70, 70, 0, Math.PI / 3);
        p.arc(x + (3 * 70) / 4, y, 70, 70, (2 * Math.PI) / 3, Math.PI);
        // Dibujamos un arco en la esquina inferior izquierda del cuadrado
        p.arc(x, y + 70, 70, 70, -Math.PI / 2, 0);
        // Dibujamos un arco en la esquina inferior derecha del cuadrado
        p.arc(x + 70, y + 70, 70, 70, Math.PI, Math.PI * 1.5);
        // Dibujamos una línea vertical en la mitad del cuadrado
        p.line(x + 35, y, x + 35, y + 70);
      }
    }
  }
}
