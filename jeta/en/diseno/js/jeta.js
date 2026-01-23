import { patrones } from "./patrones.js";

export const jeta = (p) => {
  const MARGEN = 70;
  const MAX_LUMINANCE = 0.5;

  const CON_IMAGEN = true;
  const CON_TEXTO = true;

  let imagenes;
  let frases;
  let colorBase;

  const colorAleatorio = () => {
    return p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255));
  };

  const luminosidad = (color) => {
    const r = p.red(color);
    const g = p.green(color);
    const b = p.blue(color);

    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const alturaDeTexto = (text, maxWidth) => {
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
  };

  const pintaCuadricula = () => {
    p.stroke(colorBase);
    p.strokeWeight(5);
    for (let x = 0; x <= p.width; x += MARGEN) {
      p.line(x, 0, x, p.height);
    }
    for (let y = 0; y <= p.height; y += MARGEN) {
      p.line(0, y, p.width, y);
    }
  };

  const pintaPatron = () => {
    const xPatron = p.floor(p.random(1, 13));
    const yPatron = p.floor(p.random(1, 13));
    const anchoPatron = p.floor(p.random(10, 19 - xPatron));
    const altoPatron = p.floor(p.random(10, 19 - yPatron));

    p.push();
    p.stroke(colorBase);
    p.strokeWeight(3);

    // Limitar el área de dibujo al rectángulo
    p.drawingContext.save();
    p.drawingContext.beginPath();
    p.drawingContext.rect(
      xPatron * MARGEN + 3,
      yPatron * MARGEN + 3,
      anchoPatron * MARGEN - 5,
      altoPatron * MARGEN - 5,
    );
    p.drawingContext.clip();

    p.beginShape();

    const patron = p.random(patrones);
    // const patron = patrones[8];
    patron.dibujar(p, colorBase);

    p.endShape();

    p.drawingContext.restore();
    p.pop();
  };

  const pintaImagen = () => {
    const imagen = p.random(imagenes);

    const xImagen = p.floor(p.random(1, 13));
    const yImagen = p.floor(p.random(1, 13));
    const anchoImagen = p.floor(p.random(5, 19 - xImagen));

    if (CON_IMAGEN) {
      p.fill(colorBase);
      p.rect(
        xImagen * MARGEN,
        yImagen * MARGEN,
        anchoImagen * MARGEN,
        anchoImagen * MARGEN,
      );
      // Recolocamos el origen medio píxel para que la imagen quede nítida
      p.translate(-0.5, -0.5);
      p.fill(255);
      p.image(
        imagen,
        xImagen * MARGEN + 3,
        yImagen * MARGEN + 3,
        anchoImagen * MARGEN - 5,
        anchoImagen * MARGEN - 5,
      );
      p.translate(0.5, 0.5);
    }
  };

  const pintaFrase = () => {
    if (CON_TEXTO) {
      const frase = p.random(frases).toUpperCase();

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

      const xTexto = p.floor(p.random(1, 10));
      const yTexto = p.floor(p.random(1, 10));
      const wTexto = p.floor(p.random(8, 10));

      let margenTexto = 10;
      let posicionX = xTexto * MARGEN + 3;
      let posicionY = yTexto * MARGEN + 3;
      let anchoMaximo = wTexto * MARGEN - 5;

      // Calculamos la altura del texto para ajustar el fondo
      let altura =
        alturaDeTexto(frase, anchoMaximo - 2 * margenTexto) + 2 * margenTexto;
      let alturaRedondeada = Math.ceil(altura / MARGEN) * MARGEN;

      // Cuadro que define el borde
      p.fill(colorBase);
      p.rect(
        posicionX - 5,
        posicionY - 5,
        anchoMaximo + 10,
        alturaRedondeada + 5,
      );

      // Fondo blanco del texto
      p.fill(255);
      p.rect(posicionX, posicionY, anchoMaximo, alturaRedondeada - 5);

      // Texto
      p.fill(colorBase);
      p.text(
        frase,
        posicionX + margenTexto,
        posicionY + margenTexto,
        anchoMaximo - 2 * margenTexto,
      );
    }
  };

  const pintaTitulo = () => {
    if (CON_TEXTO) {
      p.fill(colorBase);
      p.rect(11 * MARGEN - 2, 11 * MARGEN - 2, 8 * MARGEN + 5, 8 * MARGEN + 5);
      p.fill(255);
      p.rect(11 * MARGEN + 3, 11 * MARGEN + 3, 8 * MARGEN, 8 * MARGEN);

      p.fill(colorBase);
      p.rect(12 * MARGEN - 2, 12 * MARGEN - 2, 7 * MARGEN + 5, 7 * MARGEN + 5);
      p.fill(255);
      p.rect(12 * MARGEN + 3, 12 * MARGEN + 3, 7 * MARGEN - 5, 7 * MARGEN - 5);

      p.fill(colorBase);
      p.drawingContext.letterSpacing = "4px";
      p.textAlign(p.CENTER, p.TOP);
      p.textStyle(p.NORMAL);

      const centroTitulo = 15 * MARGEN + MARGEN / 2 + 0.5;

      p.stroke(colorBase);
      p.strokeWeight(1);
      // Referencia del centro
      // p.line(centroTitulo, 0, centroTitulo, p.height);

      p.textAlign(p.CENTER, p.TOP);
      p.textFont("futura-pt", 180);
      // p.text("OCRE", centroTitulo + 2, 12 * margen + 30);
      p.text("OCRE", centroTitulo, 12 * MARGEN + 30);
      p.textAlign(p.CENTER, p.TOP);
      p.textFont("futura-pt", 60);
      p.text("ES UN", centroTitulo + 2, 15 * MARGEN + 11);
      p.textAlign(p.CENTER, p.TOP);
      p.textFont("futura-pt", 180);
      p.text("JETA", centroTitulo + 7, 16 * MARGEN + 34);
    }
  };

  const pintaMarco = () => {
    // Creamos un margen blanco alrededor
    // para que las terminaciones de las líneas queden limpias
    p.translate(-0.5, -0.5);
    p.strokeWeight(0);
    p.fill(255);
    p.rect(0, 0, p.width, MARGEN - 2);
    p.rect(0, p.height - MARGEN + 3, p.width, MARGEN);
    p.rect(0, 0, MARGEN - 2, p.height);
    p.rect(p.width - MARGEN + 3, 0, MARGEN, p.height);
  };

  p.preload = () => {
    imagenes = [p.loadImage("img/facepalm.png")];
    const frasesObject = p.loadJSON("soluciones.json", (data) => {
      frases = [];
      // Iteramos por los atributos del objeto para crear un array con las frases de cada atributo
      for (const [key, value] of Object.entries(data)) {
        frases.push(...value);
      }
    });
  };

  p.setup = () => {
    p.pixelDensity(1);

    p.createCanvas(1400, 1400);

    // Le quitamos el estilo al canvas para que se ajuste al contenedor
    document.querySelector("main canvas").removeAttribute("style");

    // COLOR BASE
    let luminanceBase = 1;

    // El color debe tener una liminosidad menor que MAX_LUMINANCE
    // para que tenga contraste sufienciente con el fondo blanco
    while (luminanceBase > MAX_LUMINANCE) {
      colorBase = colorAleatorio();
      luminanceBase = luminosidad(colorBase);
    }

    console.log("luminance", luminanceBase);

    // FONDO
    p.background(255);

    // CUADRÍCULA
    // Para que las líneas queden nítidas movemos el origen medio píxel
    p.translate(0.5, 0.5);

    pintaCuadricula();

    // PATRÓN
    pintaPatron();

    // IMAGEN
    pintaImagen();

    // FRASE
    pintaFrase();

    // TÍTULO
    pintaTitulo();

    pintaMarco();
  };
};
