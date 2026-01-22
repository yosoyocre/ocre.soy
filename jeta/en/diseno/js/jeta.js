import { patrones } from "./patrones.js";

const jeta = (p) => {
  function textHeight(text, maxWidth) {
    var words = text.split(" ");
    var line = "";
    var h = p.textLeading();

    for (var i = 0; i < words.length; i++) {
      var testLine = line + words[i] + " ";
      var testWidth = p.drawingContext.measureText(testLine).width;

      if (testWidth > maxWidth && i > 0) {
        line = words[i] + " ";
        h += p.textLeading();
      } else {
        line = testLine;
      }
    }

    return h;
  }

  function colorAleatorio() {
    let color = [];
    color["r"] = p.random(0, 255);
    color["g"] = p.random(0, 255);
    color["b"] = p.random(0, 255);
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

  let CON_IMAGEN = true;
  let CON_FUENTES = true;

  function pintaPatron() {
    p.push();
    p.stroke(colorBase);
    p.strokeWeight(3);

    // Limitar el área de dibujo al rectángulo
    p.drawingContext.save();
    p.drawingContext.beginPath();
    p.drawingContext.rect(
      xPatron * margen + 3,
      yPatron * margen + 3,
      anchoPatron * margen - 5,
      altoPatron * margen - 5,
    );
    p.drawingContext.clip();

    p.beginShape();

    let patron = p.random(patrones);
    patron.dibujar(p, colorBase);

    p.endShape();

    p.drawingContext.restore();
    p.pop();
  }

  p.preload = () => {
    referencia = p.loadImage("jeta.png");
    facepalm = p.loadImage("facepalm.png");
  };

  p.setup = () => {
    p.pixelDensity(1);

    p.createCanvas(1400, 1400);

    // Le quitamos el estilo al canvas para que se ajuste al contenedor
    document.querySelector("main canvas").removeAttribute("style");

    // Tomamos x e y aleatorios
    xTexto = p.floor(p.random(1, 10));
    yTexto = p.floor(p.random(1, 10));
    wTexto = p.floor(p.random(8, 10));
    //   xTexto = 2;
    //   yTexto = 3;
    //   wTexto = 8;

    xPatron = p.floor(p.random(1, 13));
    yPatron = p.floor(p.random(1, 13));
    anchoPatron = p.floor(p.random(10, 19 - xPatron));
    altoPatron = p.floor(p.random(10, 19 - yPatron));

    xFacepalm = p.floor(p.random(1, 13));
    yFacepalm = p.floor(p.random(1, 13));
    anchoFacepalm = p.floor(p.random(5, 19 - xFacepalm));

    let colorBaseAux = colorAleatorio();

    let luminanceBase = luminosidad(
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

    colorBase = p.color(
      colorBaseAux["r"],
      colorBaseAux["g"],
      colorBaseAux["b"],
    );

    p.background(255);

    //   image(referencia, 0, 0);

    // Para que las líneas queden nítidas movemos el origen medio píxel
    p.translate(0.5, 0.5);

    // CUADRÍCULA
    //   p.stroke(0, 0, 0, 255 * transparencia);
    p.stroke(colorBase);
    p.strokeWeight(5);
    for (let x = 0; x <= p.width; x += margen) {
      p.line(x, 0, x, p.height);
    }
    for (let y = 0; y <= p.height; y += margen) {
      p.line(0, y, p.width, y);
    }

    // PATRÓN
    pintaPatron();

    // IMAGEN
    if (CON_IMAGEN) {
      p.fill(colorBase);
      p.rect(
        xFacepalm * margen,
        yFacepalm * margen,
        anchoFacepalm * margen,
        anchoFacepalm * margen,
      );
      // Recolocamos el origen medio píxel para que la imagen quede nítida
      p.translate(-0.5, -0.5);
      p.fill(255);
      p.image(
        facepalm,
        xFacepalm * margen + 3,
        yFacepalm * margen + 3,
        anchoFacepalm * margen - 5,
        anchoFacepalm * margen - 5,
      );
    }

    p.translate(0.5, 0.5);

    if (FUENTES_CARGADAS && CON_FUENTES) {
      // Escribimos la frase
      p.noStroke();

      // p.textLeading(70);
      // p.drawingContext.letterSpacing = "-4px";

      p.textLeading(65);
      p.drawingContext.letterSpacing = "-4px";

      // p.textLeading(80);
      // p.drawingContext.letterSpacing = "-2px";

      p.textAlign(p.LEFT, p.TOP);
      p.textFont("futura-pt", 75);
      p.textStyle(p.BOLD);

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

      p.fill(colorBase);
      p.rect(
        posicionX - 5,
        posicionY - 5,
        anchoMaximo + 10,
        alturaRedondeada + 5,
      );
      p.fill(255);
      p.rect(posicionX, posicionY, anchoMaximo, alturaRedondeada - 5);

      p.fill(colorBase);
      p.text(
        frase,
        posicionX + margenTexto,
        posicionY + margenTexto,
        anchoMaximo - 2 * margenTexto,
      );

      p.fill(colorBase);
      p.rect(11 * margen - 2, 11 * margen - 2, 8 * margen + 5, 8 * margen + 5);
      p.fill(255);
      p.rect(11 * margen + 3, 11 * margen + 3, 8 * margen, 8 * margen);

      p.fill(colorBase);
      p.rect(12 * margen - 2, 12 * margen - 2, 7 * margen + 5, 7 * margen + 5);
      p.fill(255);
      p.rect(12 * margen + 3, 12 * margen + 3, 7 * margen - 5, 7 * margen - 5);

      p.fill(colorBase);
      p.drawingContext.letterSpacing = "4px";
      p.textAlign(p.CENTER, p.TOP);
      p.textStyle(p.NORMAL);

      const centroTitulo = 15 * margen + margen / 2 + 0.5;

      p.stroke(colorBase);
      p.strokeWeight(1);
      // p.line(centroTitulo, 0, centroTitulo, p.height);

      p.textAlign(p.CENTER, p.TOP);
      p.textFont("futura-pt", 180);
      // p.text("OCRE", centroTitulo + 2, 12 * margen + 30);
      p.text("OCRE", centroTitulo, 12 * margen + 30);
      p.textAlign(p.CENTER, p.TOP);
      p.textFont("futura-pt", 60);
      p.text("ES UN", centroTitulo + 2, 15 * margen + 11);
      p.textAlign(p.CENTER, p.TOP);
      p.textFont("futura-pt", 180);
      p.text("JETA", centroTitulo + 7, 16 * margen + 34);

      // Creamos un margen blanco alrededor
      // para que las terminaciones de las líneas queden limpias
      p.translate(-0.5, -0.5);
      p.strokeWeight(0);
      p.fill(255);
      p.rect(0, 0, p.width, margen - 2);
      p.rect(0, p.height - margen + 3, p.width, margen);
      p.rect(0, 0, margen - 2, p.height);
      p.rect(p.width - margen + 3, 0, margen, p.height);
    }

    p.draw = () => {};
  };
};

new p5(jeta);
