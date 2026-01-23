import Patron from "./patron.js";

export class LineasOndulantes extends Patron {
  dibujar(p, color) {
    p.fill(255);
    p.rect(0, 0, p.width, p.height);

    p.strokeWeight(3);
    const paso = 20;
    for (let y = 0; y <= p.height; y += paso) {
      p.beginShape();
      for (let x = 0; x <= p.width; x += 5) {
        let offset = p.noise(x * 0.02, y * 0.02) * paso;
        p.vertex(x, y + offset);
      }
      p.endShape();
    }
  }
}
