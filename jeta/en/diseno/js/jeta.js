function textHeight(text, maxWidth) {
  var words = text.split(" ");
  var line = "";
  var h = textLeading();

  for (var i = 0; i < words.length; i++) {
    var testLine = line + words[i] + " ";
    var testWidth = drawingContext.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      line = words[i] + " ";
      h += textLeading();
    } else {
      line = testLine;
    }
  }

  return h;
}

function colorAleatorio() {
  let color = [];
  color["r"] = random(0, 255);
  color["g"] = random(0, 255);
  color["b"] = random(0, 255);
  return color;
}

function luminosidad(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

let xTexto, yTexto, wTexto;
let referencia;
let colorBase;

function preload() {
  referencia = loadImage("jeta.png");
}

function setup() {
  pixelDensity(1);

  createCanvas(1400, 1400);

  // Le quitamos el estilo al canvas para que se ajuste al contenedor
  document.querySelector("main canvas").removeAttribute("style");

  // Tomamos x e y aleatorios
  xTexto = floor(random(1, 10));
  yTexto = floor(random(1, 10));
  wTexto = floor(random(8, 10));
  //   xTexto = 2;
  //   yTexto = 3;
  //   wTexto = 8;

  let colorBaseAux = colorAleatorio();

  luminanceBase = luminosidad(
    colorBaseAux["r"],
    colorBaseAux["g"],
    colorBaseAux["b"],
  );
  const maxLuminance = 0.1;

  // El color debe tener una liminosidad menor que maxLuminance
  // para que el texto en gris tenga contraste sufienciente
  while (luminanceBase > maxLuminance) {
    colorBaseAux = colorAleatorio();
    luminanceBase = luminosidad(
      colorBaseAux["r"],
      colorBaseAux["g"],
      colorBaseAux["b"],
    );
  }

  colorBase = color(colorBaseAux["r"], colorBaseAux["g"], colorBaseAux["b"]);
}
function draw() {
  background(255);

  //   image(referencia, 0, 0);

  // Para que las líneas queden nítidas movemos el origen medio píxel
  translate(0.5, 0.5);

  //   stroke(0, 0, 0, 255 * transparencia);
  stroke(colorBase);
  strokeWeight(5);

  const margen = 70;

  for (let x = 0; x <= width; x += margen) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += margen) {
    line(0, y, width, y);
  }

  // Creamos un margen blanco alrededor
  // para que las terminaciones de las líneas queden limpias
  translate(-0.5, -0.5);
  strokeWeight(0);
  fill(255);
  rect(0, 0, width, margen - 2);
  rect(0, height - margen + 3, width, margen);
  rect(0, 0, margen - 2, height);
  rect(width - margen + 3, 0, margen, height);

  if (FUENTES_CARGADAS) {
    // Escribimos la frase
    noStroke();
    textLeading(70);

    drawingContext.letterSpacing = "-4px";
    textAlign(LEFT, TOP);
    textFont("futura-pt", 75);
    textStyle(BOLD);

    // Reducimos el kerning para que quepa más texto

    //let frase =
    //"DE AQUEL QUE OPINA QUE EL DINERO PUEDE HACERLO TODO, CABE SOSPECHAR CON FUNDAMENTO QUE SERÁ CAPAZ DE HACER CUALQUIER COSA POR DINERO";

    let frase =
      "TRABAJAR DURO, UNA MENTE POSITIVA Y LEVANTARSE TEMPRANO SON LAS CLAVES PARA TENER UN GRAN DÍA";

    let margenTexto = 10;
    let posicionX = xTexto * margen + 3;
    let posicionY = yTexto * margen + 3;
    let anchoMaximo = wTexto * margen - 5;

    let altura =
      textHeight(frase, anchoMaximo - 2 * margenTexto) + 2 * margenTexto;
    let alturaRedondeada = Math.ceil(altura / margen) * margen;
    fill(255);
    rect(posicionX, posicionY, anchoMaximo, alturaRedondeada - 5);

    fill(colorBase);
    text(
      frase,
      posicionX + margenTexto,
      posicionY + margenTexto,
      anchoMaximo - 2 * margenTexto,
    );

    fill(255);
    rect(11 * margen + 3, 11 * margen + 3, 8 * margen, 8 * margen);

    fill(colorBase);
    rect(12 * margen - 2, 12 * margen - 2, 7 * margen + 5, 7 * margen + 5);
    fill(255);
    rect(12 * margen + 3, 12 * margen + 3, 7 * margen - 5, 7 * margen - 5);

    fill(colorBase);
    drawingContext.letterSpacing = "4px";
    textAlign(CENTER, TOP);
    textStyle(NORMAL);

    const centroTitulo = 15 * margen + margen / 2 + 0.5;

    stroke(colorBase);
    strokeWeight(1);
    // line(centroTitulo, 0, centroTitulo, height);

    textAlign(CENTER, TOP);
    textFont("futura-pt", 180);
    text("OCRE", centroTitulo + 2, 12 * margen + 30);
    textAlign(CENTER, TOP);
    textFont("futura-pt", 60);
    text("ES UN", centroTitulo + 2, 15 * margen + 11);
    textAlign(CENTER, TOP);
    textFont("futura-pt", 180);
    text("JETA", centroTitulo + 7, 16 * margen + 34);
  }
}
