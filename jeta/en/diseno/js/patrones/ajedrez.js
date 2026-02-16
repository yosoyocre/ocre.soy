import Patron from "./patron.js";

export class Ajedrez extends Patron {
  dibujar(p, color) {
    p.background(255);
    // Para que las líneas queden nítidas movemos el origen medio píxel
    // p.translate(0.5, 0.5);

    let lado;

    // p.stroke(color);
    // p.strokeWeight(5);
    // lado = 70;

    // for (let x = 0; x < p.width; x += lado) {
    //   for (let y = 0; y < p.height; y += lado) {
    //     p.rect(x, y, lado, lado);
    //   }
    // }

    p.noStroke();
    p.fill(color);
    lado = 70 / 4;

    for (let x = 0; x < p.width; x += lado) {
      for (let y = 0; y < p.height; y += lado) {
        if ((x / lado + y / lado) % 2 === 0) {
          continue;
        }
        p.rect(x, y, lado, lado);
      }
    }
  }
}
