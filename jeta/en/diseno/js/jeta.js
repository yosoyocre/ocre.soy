function setup() {
  pixelDensity(1);

  createCanvas(1400, 1400);

  // Le quitamos el estilo al canvas para que se ajuste al contenedor
  document.querySelector("main canvas").removeAttribute("style");
}
function draw() {
  background(255);
  stroke(0);
  strokeWeight(5);
  // Para que las líneas queden nítidas movemos el origen medio píxel
  translate(0.5, 0.5);

  const margen = 70;

  for (let x = margen; x <= width - margen; x += margen) {
    line(x, margen, x, height - margen);
  }
  for (let y = margen; y <= height - margen; y += margen) {
    line(margen, y, width - margen, y);
  }
}
