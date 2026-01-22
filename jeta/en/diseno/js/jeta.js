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

const margen = 70;

let xTexto, yTexto, wTexto;
let xPatron, yPatron, anchoPatron, altoPatron;
let xFacepalm, yFacepalm, anchoFacepalm;
let referencia;
let facepalm;
let colorBase;

let patrones = [
  "diagonal-izquierda",
  "diagonal-derecha",
  "cruzado",
  "puntos",
  "puntos-ondas",
  "puntos-perlin",
  "laberinto",
];
let patron;

function pintaPatron() {
  push();
  stroke(colorBase);
  strokeWeight(3);

  // Limitar el área de dibujo al rectángulo
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(
    xPatron * margen + 3,
    yPatron * margen + 3,
    anchoPatron * margen - 5,
    altoPatron * margen - 5,
  );
  drawingContext.clip();

  beginShape();

  let tamanoLinea;
  let paso;

  switch (patron) {
    case "diagonal-izquierda":
      fill(255);
      rect(0, 0, width, height);

      fill(colorBase);
      tamanoLinea = 10;
      paso = (2 * tamanoLinea) / sin(radians(45));
      strokeWeight(tamanoLinea);
      for (let i = -height; i < width; i += paso) {
        line(i, 0, i + height, height);
      }
      break;
    case "diagonal-derecha":
      fill(255);
      rect(0, 0, width, height);

      fill(colorBase);
      tamanoLinea = 10;
      paso = (2 * tamanoLinea) / sin(radians(45));
      strokeWeight(tamanoLinea);
      for (let i = 0; i < width + height; i += paso) {
        line(i, 0, i - height, height);
      }
      break;
    case "cruzado":
      fill(colorBase);
      rect(0, 0, width, height);

      stroke(255);
      tamanoLinea = 4;
      paso = (4 * tamanoLinea) / sin(radians(45));
      strokeWeight(tamanoLinea);
      for (let i = -height; i < width; i += paso) {
        line(i, 0, i + height, height);
      }
      for (let i = 0; i < width + height; i += paso) {
        line(i, 0, i - height, height);
      }
      break;
    case "puntos":
      fill(255);
      rect(0, 0, width, height);

      fill(colorBase);
      tamanoLinea = 12;
      paso = 18;
      strokeWeight(tamanoLinea);
      for (let x = tamanoLinea / -3; x <= width; x += paso) {
        for (let y = tamanoLinea / -3; y <= height; y += paso) {
          point(x, y);
        }
      }
      break;
    case "puntos-ondas":
      fill(255);
      rect(0, 0, width, height);

      fill(colorBase);
      tamanoLinea = 12;
      paso = 18;
      strokeWeight(tamanoLinea);
      for (let x = tamanoLinea / -3; x <= width; x += paso) {
        for (let y = tamanoLinea / -3; y <= height; y += paso) {
          point(
            x + noise(x * 0.01, y * 0.01) * 20,
            y + noise(x * 0.01, y * 0.01) * 20,
          );
        }
      }
      break;
    case "puntos-perlin":
      fill(255);
      rect(0, 0, width, height);

      fill(colorBase);
      // Llenamos el cuadrado de puntos siguiendo una distribución por perlin noise
      tamanoLinea = 12;
      paso = 18;
      strokeWeight(tamanoLinea);
      for (let x = tamanoLinea / -3; x <= width; x += paso) {
        for (let y = tamanoLinea / -3; y <= height; y += paso) {
          if (noise(x * 0.01, y * 0.01) > 0.5) {
            point(x, y);
          }
        }
      }
      break;

    case "laberinto":
      fill(255);
      rect(0, 0, width, height);

      // Dibujamos líneas cortas con ángulos variables y que no se toquen
      tamanoLinea = 14;
      paso = 14;
      strokeCap(PROJECT);
      strokeWeight(8);
      for (let x = 0; x <= width; x += paso) {
        for (let y = 0; y <= height; y += paso) {
          let angulo = floor(random(0, 4)) * 90;
          let xFin = x + tamanoLinea * cos(radians(angulo));
          let yFin = y + tamanoLinea * sin(radians(angulo));
          line(x, y, xFin, yFin);
        }
      }
      break;
  }
  endShape();

  drawingContext.restore();
  pop();
}

function preload() {
  referencia = loadImage("jeta.png");
  facepalm = loadImage("facepalm.png");
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

  xPatron = floor(random(1, 13));
  yPatron = floor(random(1, 13));
  anchoPatron = floor(random(10, 19 - xPatron));
  altoPatron = floor(random(10, 19 - yPatron));
  patron = random(patrones);
  // patron = "laberinto";

  xFacepalm = floor(random(1, 13));
  yFacepalm = floor(random(1, 13));
  anchoFacepalm = floor(random(5, 19 - xFacepalm));

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

  background(255);

  //   image(referencia, 0, 0);

  // Para que las líneas queden nítidas movemos el origen medio píxel
  translate(0.5, 0.5);

  // CUADRÍCULA
  //   stroke(0, 0, 0, 255 * transparencia);
  stroke(colorBase);
  strokeWeight(5);
  for (let x = 0; x <= width; x += margen) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += margen) {
    line(0, y, width, y);
  }

  // PATRÓN
  pintaPatron();

  // IMAGEN
  fill(colorBase);
  rect(
    xFacepalm * margen,
    yFacepalm * margen,
    anchoFacepalm * margen,
    anchoFacepalm * margen,
  );
  // Recolocamos el origen medio píxel para que la imagen quede nítida
  translate(-0.5, -0.5);
  fill(255);
  image(
    facepalm,
    xFacepalm * margen + 3,
    yFacepalm * margen + 3,
    anchoFacepalm * margen - 5,
    anchoFacepalm * margen - 5,
  );

  translate(0, 0);

  if (FUENTES_CARGADAS) {
    // if (false) {
    // Escribimos la frase
    noStroke();

    // textLeading(70);
    // drawingContext.letterSpacing = "-4px";

    textLeading(65);
    drawingContext.letterSpacing = "-4px";

    // textLeading(80);
    // drawingContext.letterSpacing = "-2px";

    textAlign(LEFT, TOP);
    textFont("futura-pt", 75);
    textStyle(BOLD);

    // let frase =
    //   "DE AQUEL QUE OPINA QUE EL DINERO PUEDE HACERLO TODO, CABE SOSPECHAR CON FUNDAMENTO QUE SERÁ CAPAZ DE HACER CUALQUIER COSA POR DINERO";

    let frase =
      "EL DINERO PUEDE SER UN ALIADO PODEROSO SI LO USAS CON PROPÓSITO Y GRATITUD";

    // let frase =
    //   "TRABAJAR DURO, UNA MENTE POSITIVA Y LEVANTARSE TEMPRANO SON LAS CLAVES PARA TENER UN GRAN DÍA";

    let margenTexto = 10;
    let posicionX = xTexto * margen + 3;
    let posicionY = yTexto * margen + 3;
    let anchoMaximo = wTexto * margen - 5;

    let altura =
      textHeight(frase, anchoMaximo - 2 * margenTexto) + 2 * margenTexto;
    let alturaRedondeada = Math.ceil(altura / margen) * margen;

    fill(colorBase);
    rect(posicionX - 5, posicionY - 5, anchoMaximo + 10, alturaRedondeada + 5);
    fill(255);
    rect(posicionX, posicionY, anchoMaximo, alturaRedondeada - 5);

    fill(colorBase);
    text(
      frase,
      posicionX + margenTexto,
      posicionY + margenTexto,
      anchoMaximo - 2 * margenTexto,
    );

    fill(colorBase);
    rect(11 * margen - 2, 11 * margen - 2, 8 * margen + 5, 8 * margen + 5);
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
    // text("OCRE", centroTitulo + 2, 12 * margen + 30);
    text("OCRE", centroTitulo, 12 * margen + 30);
    textAlign(CENTER, TOP);
    textFont("futura-pt", 60);
    text("ES UN", centroTitulo + 2, 15 * margen + 11);
    textAlign(CENTER, TOP);
    textFont("futura-pt", 180);
    text("JETA", centroTitulo + 7, 16 * margen + 34);

    // Creamos un margen blanco alrededor
    // para que las terminaciones de las líneas queden limpias
    translate(-0.5, -0.5);
    strokeWeight(0);
    fill(255);
    rect(0, 0, width, margen - 2);
    rect(0, height - margen + 3, width, margen);
    rect(0, 0, margen - 2, height);
    rect(width - margen + 3, 0, margen, height);
  }

  function draw() {}
}
