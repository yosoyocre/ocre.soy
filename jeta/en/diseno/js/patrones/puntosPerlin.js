import Patron from "../patron.js";

export class PuntosPerlin extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    p.fill(color);
    // Llenamos el cuadrado de puntos siguiendo una distribución por perlin noise
    const tamanoLinea = 12;
    const paso = 18;
    p.strokeWeight(tamanoLinea);
    for (let x = tamanoLinea / -3; x <= p.width; x += paso) {
      for (let y = tamanoLinea / -3; y <= p.height; y += paso) {
        if (p.noise(x * 0.01, y * 0.01) > 0.5) {
          p.point(x, y);
        }
      }
    }
  }
}
