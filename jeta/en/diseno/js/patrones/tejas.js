import Patron from "../patron.js";

export class Tejas extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    const tamanoLinea = 30;
    const pasoX = tamanoLinea;
    const pasoY = tamanoLinea / 2 + 5;
    p.stroke(color);
    p.strokeWeight(5);
    for (let x = 0; x <= p.width; x += pasoX) {
      for (let y = 0; y <= p.height; y += pasoY) {
        let offsetX = p.floor(y / pasoY) % 2 === 0 ? tamanoLinea / 2 : 0;
        p.arc(
          x + tamanoLinea / 2 + offsetX,
          y + tamanoLinea / 2,
          tamanoLinea,
          tamanoLinea,
          0,
          p.PI,
        );
      }
    }
  }
}
