import Patron from "../patron.js";

export class Flechas extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    const tamanoLinea = 30;
    const pasoX = tamanoLinea * 1.25;
    const pasoY = tamanoLinea * 1.25;
    p.stroke(color);
    p.strokeWeight(5);
    for (let x = 0; x <= p.width; x += pasoX) {
      for (let y = 0; y <= p.height; y += pasoY) {
        p.push();
        p.translate(x + tamanoLinea, y + tamanoLinea);
        let angulo = p.noise(x * 0.01, y * 0.01) * p.TWO_PI;
        p.rotate(angulo);
        p.line(0, -tamanoLinea / 2, 0, tamanoLinea / 2);
        p.line(-tamanoLinea / 2, 0, 0, -tamanoLinea / 2);
        p.line(tamanoLinea / 2, 0, 0, -tamanoLinea / 2);
        p.pop();
      }
    }
  }
}
