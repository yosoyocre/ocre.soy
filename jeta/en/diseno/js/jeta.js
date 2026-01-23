import { patrones } from "./patrones.js";

export const jeta = (p) => {
  const CON_IMAGEN = true;
  const CON_TEXTO = true;
  const PATRON = null;
  const CON_ANIMACION = true;

  const MARGEN = 70;
  const MAX_LUMINANCE = 0.5;

  let imagenes;
  let frases;
  let colorBase;

  let cuadricula;
  let marco;
  let transparenciaCuadricula = CON_ANIMACION ? 0 : 255;
  let cuadroFrase;
  let transparenciaCuadroFrase = CON_ANIMACION ? 0 : 255;
  let cuadroPatron;
  let transparenciaCuadroPatron = CON_ANIMACION ? 0 : 255;
  let cuadroImagen;
  let transparenciaCuadroImagen = CON_ANIMACION ? 0 : 255;
  let cuadroTitulo;
  let transparenciaCuadroTitulo = CON_ANIMACION ? 0 : 255;

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

  const alturaDeTexto = (graphics, text, maxWidth) => {
    var words = text.split(" ");
    var line = "";
    var h = graphics.textLeading();

    for (var i = 0; i < words.length; i++) {
      var testLine = line + words[i] + " ";
      var testWidth = graphics.drawingContext.measureText(testLine).width;
      if (testWidth > maxWidth && i > 0) {
        line = words[i] + " ";
        h += graphics.textLeading();
      } else {
        line = testLine;
      }
    }

    return h;
  };

  const pintaCuadricula = (graphics) => {
    // Para que las líneas queden nítidas movemos el origen medio píxel
    graphics.translate(0.5, 0.5);

    graphics.stroke(colorBase);
    graphics.strokeWeight(5);
    for (let x = 0; x <= graphics.width; x += MARGEN) {
      graphics.line(x, 0, x, graphics.height);
    }
    for (let y = 0; y <= graphics.height; y += MARGEN) {
      graphics.line(0, y, graphics.width, y);
    }
  };

  const pintaPatron = (graphics, x, y) => {
    const xPatron = x || graphics.floor(graphics.random(1, 13));
    const yPatron = y || graphics.floor(graphics.random(1, 13));
    const anchoPatron = graphics.floor(graphics.random(10, 19 - xPatron));
    const altoPatron = graphics.floor(graphics.random(10, 19 - yPatron));
    graphics.push();
    graphics.stroke(colorBase);
    graphics.strokeWeight(3);

    // Limitar el área de dibujo al rectángulo
    graphics.drawingContext.save();
    graphics.drawingContext.beginPath();
    graphics.drawingContext.rect(
      xPatron * MARGEN + 3,
      yPatron * MARGEN + 3,
      anchoPatron * MARGEN - 5,
      altoPatron * MARGEN - 5,
    );
    graphics.drawingContext.clip();

    graphics.beginShape();

    let patron;
    if (PATRON !== null) {
      patron = patrones[PATRON];
    } else {
      patron = graphics.random(patrones);
    }
    patron.dibujar(graphics, colorBase);

    graphics.endShape();

    graphics.drawingContext.restore();
    graphics.pop();
  };

  const pintaImagen = (graphics, x, y) => {
    graphics.noStroke();
    const imagen = graphics.random(imagenes);

    const xImagen = x || graphics.floor(graphics.random(1, 13));
    const yImagen = y || graphics.floor(graphics.random(1, 13));
    const anchoImagen = graphics.floor(graphics.random(5, 19 - xImagen));

    graphics.translate(0.5, 0.5);
    graphics.fill(colorBase);
    graphics.rect(
      xImagen * MARGEN,
      yImagen * MARGEN,
      anchoImagen * MARGEN,
      anchoImagen * MARGEN,
    );
    // Recolocamos el origen medio píxel para que la imagen quede nítida
    graphics.translate(-0.5, -0.5);
    graphics.fill(255);
    graphics.image(
      imagen,
      xImagen * MARGEN + 3,
      yImagen * MARGEN + 3,
      anchoImagen * MARGEN - 5,
      anchoImagen * MARGEN - 5,
    );
    graphics.translate(0.5, 0.5);
  };

  const pintaFrase = (graphics, x, y) => {
    const frase = graphics.random(frases).toUpperCase();

    const xTexto = x || graphics.floor(graphics.random(1, 10));
    const yTexto = y || graphics.floor(graphics.random(1, 10));
    const wTexto = graphics.floor(graphics.random(8, 10));

    graphics.noStroke();

    // graphics.textLeading(70);
    // graphics.drawingContext.letterSpacing = "-4px";

    graphics.textLeading(65);
    graphics.drawingContext.letterSpacing = "-4px";

    // graphics.textLeading(80);
    // graphics.drawingContext.letterSpacing = "-2px";

    graphics.textAlign(graphics.LEFT, graphics.TOP);
    graphics.textFont("futura-pt", 75);
    graphics.textStyle(graphics.BOLD);

    let margenTexto = 10;
    let posicionX = xTexto * MARGEN + 3;
    let posicionY = yTexto * MARGEN + 3;
    let anchoMaximo = wTexto * MARGEN - 5;

    // Calculamos la altura del texto para ajustar el fondo
    let altura =
      alturaDeTexto(graphics, frase, anchoMaximo - 2 * margenTexto) +
      2 * margenTexto;
    let alturaRedondeada = Math.ceil(altura / MARGEN) * MARGEN;

    // Cuadro que define el borde
    graphics.fill(colorBase);
    graphics.rect(
      posicionX - 5,
      posicionY - 5,
      anchoMaximo + 10,
      alturaRedondeada + 5,
    );

    // Fondo blanco del texto
    graphics.fill(255);
    graphics.rect(posicionX, posicionY, anchoMaximo, alturaRedondeada - 5);

    // Texto
    graphics.fill(colorBase);
    graphics.text(
      frase,
      posicionX + margenTexto,
      posicionY + margenTexto,
      anchoMaximo - 2 * margenTexto,
    );
  };

  const pintaTitulo = (graphics) => {
    graphics.noStroke();

    graphics.fill(colorBase);
    graphics.rect(
      11 * MARGEN - 2,
      11 * MARGEN - 2,
      8 * MARGEN + 5,
      8 * MARGEN + 5,
    );
    graphics.fill(255);
    graphics.rect(11 * MARGEN + 3, 11 * MARGEN + 3, 8 * MARGEN, 8 * MARGEN);

    graphics.fill(colorBase);
    graphics.rect(
      12 * MARGEN - 2,
      12 * MARGEN - 2,
      7 * MARGEN + 5,
      7 * MARGEN + 5,
    );
    graphics.fill(255);
    graphics.rect(
      12 * MARGEN + 3,
      12 * MARGEN + 3,
      7 * MARGEN - 5,
      7 * MARGEN - 5,
    );

    graphics.fill(colorBase);
    graphics.drawingContext.letterSpacing = "4px";
    graphics.textAlign(graphics.CENTER, graphics.TOP);
    graphics.textStyle(graphics.NORMAL);

    const centroTitulo = 15 * MARGEN + MARGEN / 2 + 0.5;

    graphics.stroke(colorBase);
    graphics.strokeWeight(1);
    // Referencia del centro
    // p.line(centroTitulo, 0, centroTitulo, p.height);

    graphics.textAlign(graphics.CENTER, graphics.TOP);
    graphics.textFont("futura-pt", 180);
    // graphics.text("OCRE", centroTitulo + 2, 12 * margen + 30);
    graphics.text("OCRE", centroTitulo, 12 * MARGEN + 30);
    graphics.textAlign(graphics.CENTER, graphics.TOP);
    graphics.textFont("futura-pt", 60);
    graphics.text("ES UN", centroTitulo + 2, 15 * MARGEN + 11);
    graphics.textAlign(graphics.CENTER, graphics.TOP);
    graphics.textFont("futura-pt", 180);
    graphics.text("JETA", centroTitulo + 7, 16 * MARGEN + 34);
  };

  const pintaMarco = (graphics) => {
    // Creamos un margen blanco alrededor
    // para que las terminaciones de las líneas queden limpias
    graphics.strokeWeight(0);
    graphics.fill(255);
    graphics.rect(0, 0, graphics.width, MARGEN - 2);
    graphics.rect(0, graphics.height - MARGEN + 3, graphics.width, MARGEN);
    graphics.rect(0, 0, MARGEN - 2, graphics.height);
    graphics.rect(graphics.width - MARGEN + 3, 0, MARGEN, graphics.height);
  };

  p.preload = () => {
    imagenes = [p.loadImage("img/facepalm.png"), p.loadImage("img/elon.png")];
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
    cuadricula = p.createGraphics(p.width, p.height);
    pintaCuadricula(cuadricula);

    // PATRÓN
    cuadroPatron = p.createGraphics(p.width, p.height);
    pintaPatron(cuadroPatron);

    // IMAGEN
    cuadroImagen = p.createGraphics(p.width, p.height);
    pintaImagen(cuadroImagen);

    // FRASE
    cuadroFrase = p.createGraphics(p.width, p.height);
    pintaFrase(cuadroFrase);

    // TÍTULO
    cuadroTitulo = p.createGraphics(p.width, p.height);
    pintaTitulo(cuadroTitulo);

    // MARCO
    marco = p.createGraphics(p.width, p.height);
    pintaMarco(marco);
  };

  p.draw = () => {
    p.background(255);

    p.tint(255, transparenciaCuadricula);
    p.image(cuadricula, 0, 0);

    p.tint(255, transparenciaCuadroPatron);
    p.image(cuadroPatron, 0, 0);

    if (CON_IMAGEN) {
      p.tint(255, transparenciaCuadroImagen);
      p.image(cuadroImagen, 0, 0);
    }

    if (CON_TEXTO) {
      p.tint(255, transparenciaCuadroFrase);
      p.image(cuadroFrase, 0, 0);

      p.tint(255, transparenciaCuadroTitulo);
      p.image(cuadroTitulo, 0, 0);
    }

    p.tint(255, 255);
    p.image(marco, 0, 0);

    if (CON_ANIMACION) {
      if (transparenciaCuadroFrase < 255) {
        transparenciaCuadroFrase += 5;
      } else {
        if (transparenciaCuadricula < 255) {
          transparenciaCuadricula += 5;
        } else {
          if (transparenciaCuadroPatron < 255) {
            transparenciaCuadroPatron += 5;
          } else {
            if (transparenciaCuadroImagen < 255) {
              transparenciaCuadroImagen += 5;
            } else {
              if (transparenciaCuadroTitulo < 255) {
                transparenciaCuadroTitulo += 5;
              } else {
                document.querySelector("main").classList.add("terminado");
                console.log("¡Terminado!");
                p.noLoop();
              }
            }
          }
        }
      }
    }
  };
};
