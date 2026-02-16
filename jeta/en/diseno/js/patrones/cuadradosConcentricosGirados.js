import Patron from "./patron.js";

export class CuadradosConcentricosGirados extends Patron {
  dibujar(p, color) {
    p.background(255);
    // Para que las líneas queden nítidas movemos el origen medio píxel
    p.translate(0.5, 0.5);

    p.stroke(color);
    p.strokeWeight(5);

    p.noFill();

    const ladoCuadradoGrande = p.sqrt(p.pow(35, 2) + p.pow(35, 2));

    const ladoCuadradoMediano = p.sqrt(
      p.pow(ladoCuadradoGrande / 2, 2) + p.pow(ladoCuadradoGrande / 2, 2),
    );
    const desplazamientoCuadradoMediano = ladoCuadradoMediano / 2;

    const ladoCuadradoPequeno = p.sqrt(
      p.pow(ladoCuadradoMediano / 2, 2) + p.pow(ladoCuadradoMediano / 2, 2),
    );
    const desplazamientoCuadradoPequeno = ladoCuadradoPequeno / 2;

    for (let x = 0; x <= p.width; x += 70) {
      for (let y = 0; y <= p.height; y += 70) {
        p.rect(x, y, 70, 70);
        // // Para girar el cuadrado, movemos el origen al centro del cuadrado, lo giramos y luego lo movemos de vuelta
        p.push();
        p.translate(-0.5, -0.5);
        p.translate(x + 35, y + 35);
        p.rotate(Math.PI / 4);
        p.rect(
          -ladoCuadradoGrande / 2,
          -ladoCuadradoGrande / 2,
          ladoCuadradoGrande,
          ladoCuadradoGrande,
        );
        p.pop();
        // Siguiente cuadradro concéntrico
        p.push();
        p.translate(-0.5, -0.5);
        p.strokeWeight(3);
        p.rect(
          x + desplazamientoCuadradoMediano,
          y + desplazamientoCuadradoMediano,
          ladoCuadradoMediano,
          ladoCuadradoMediano,
        );
        p.pop();
        // Siguiente cuadrado concéntrico
        p.push();
        p.strokeWeight(2);
        p.translate(x + 35, y + 35);
        p.rotate(Math.PI / 4);
        p.rect(
          -ladoCuadradoPequeno / 2,
          -ladoCuadradoPequeno / 2,
          ladoCuadradoPequeno,
          ladoCuadradoPequeno,
        );
        p.pop();
      }
    }
  }
}
