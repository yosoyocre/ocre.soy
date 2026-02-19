import { patrones } from "./patrones.js";

export const jeta = (solucion, conAnimacion, despuesPintado) => {
  return function (p) {
    const PATRON = null;
    const CON_TEXTO = 1;
    const SOLO_IMAGENES = 1;

    const listaImagenes = [
      "a-brazilian-family-in-rio-de-janeiro-by-jean-baptiste-debret-1839.png",
      "adam_tills_the_soil.png",
      "at_the_close_of_the_day.png",
      "atlas.png",
      "the_death_of_louis_xvi.png",
      "death_with_worldly_vanities.png",
      "facepalm.png",
      "female_labourers.png",
      "grenade_woman.png",
      "hirakud_dam.png",
      "la_grant_danse_macabre.png",
      "mill_children_440.png",
      "monument_of_skulls.png",
      "ouvriers_sortant_de_lusine.png",
      "pennsylvania_penitentiary.png",
      "physical_training_for_business_men.png",
      "picking_slate.png",
      "rossums_universal_robots.png",
      "russell_lee.png",
      "russell_lee_2.png",
      "slave_trade.png",
      "spinner_in_cotton_mill.png",
      "the_tinsmiths.png",
      "triumph_of_labour.png",
      "utah_penitentiary.png",
      "worn_out.png",
    ];

    const MARGEN = 70;
    const MAX_LUMINANCE = 0.5;

    if (!!conAnimacion) {
      conAnimacion = true;
    }

    let imagenes;
    let frases;
    let colorBase;

    let tiempo = 0;

    let cuadricula;
    let marco;
    let transparenciaCuadricula = conAnimacion ? 0 : 255;
    let cuadroFrase;
    let transparenciaCuadroFrase = conAnimacion ? 0 : 255;
    let cuadroPatron;
    let transparenciaCuadroPatron = conAnimacion ? 0 : 255;
    let cuadroImagen;
    let transparenciaCuadroImagen = conAnimacion ? 0 : 255;
    let cuadroTitulo;
    let transparenciaCuadroTitulo = conAnimacion ? 0 : 255;

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

    const posicionAleatoria = () => {
      let xPosicion = p.floor(p.random(1, 15));
      let yPosicion;
      if (xPosicion > 8) {
        yPosicion = p.floor(p.random(1, 10));
      } else {
        yPosicion = p.floor(p.random(1, 15));
      }
      return { x: xPosicion, y: yPosicion };
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

    const pintaPatron = (graphics) => {
      const posicionPatron = posicionAleatoria();
      const anchoPatron = graphics.floor(
        graphics.random(10, 19 - posicionPatron.x),
      );
      const altoPatron = graphics.floor(
        graphics.random(10, 19 - posicionPatron.y),
      );

      // Dibujamos el borde del patrón
      graphics.push();
      graphics.noStroke();
      graphics.fill(colorBase);
      graphics.rect(
        posicionPatron.x * MARGEN - 2,
        posicionPatron.y * MARGEN - 2,
        anchoPatron * MARGEN + 5,
        altoPatron * MARGEN + 5,
      );
      graphics.pop();

      graphics.push();
      graphics.stroke(colorBase);
      graphics.strokeWeight(3);

      // Limitamos el área de dibujo al rectángulo
      graphics.drawingContext.save();
      graphics.drawingContext.beginPath();
      graphics.drawingContext.rect(
        posicionPatron.x * MARGEN + 3,
        posicionPatron.y * MARGEN + 3,
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

    const calculaSolapamiento = (x1, y1, w1, h1, x2, y2, w2, h2) => {
      const xOverlap = Math.max(
        0,
        Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2),
      );
      const yOverlap = Math.max(
        0,
        Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2),
      );
      const overlapArea = xOverlap * yOverlap;
      const area1 = w1 * h1;

      // Devolvemos el solapamiento como un porcentaje del área de la primera figura
      return overlapArea / area1;
    };

    const pintaImagen = (graphics, datosTitulo, datosFrase) => {
      const imagen = graphics.random(imagenes);
      let imagenPintada = false;

      const maxSolapamiento = 0.3;

      let xImagen;
      let yImagen;
      let anchoImagen;
      let alturaImagen;

      // Comprobamos que la imagen no quede más un maxSolapamiento solapada con la frase
      // y el título
      while (!imagenPintada) {
        xImagen = graphics.floor(graphics.random(1, 13));
        yImagen = graphics.floor(graphics.random(1, 13));
        anchoImagen = graphics.floor(graphics.random(8, 12));
        alturaImagen = anchoImagen;

        const solapamientoFrase = calculaSolapamiento(
          xImagen * MARGEN,
          yImagen * MARGEN,
          anchoImagen * MARGEN,
          alturaImagen * MARGEN,
          datosFrase.x,
          datosFrase.y,
          datosFrase.ancho,
          datosFrase.altura,
        );
        console.log("Solapamiento frase", solapamientoFrase);

        const solapamientoTitulo = calculaSolapamiento(
          xImagen * MARGEN,
          yImagen * MARGEN,
          anchoImagen * MARGEN,
          alturaImagen * MARGEN,
          datosTitulo.x,
          datosTitulo.y,
          datosTitulo.ancho,
          datosTitulo.altura,
        );
        console.log("Solapamiento título", solapamientoTitulo);

        const solapamientoTotal = solapamientoFrase + solapamientoTitulo;
        console.log("Solapamiento total", solapamientoTotal);

        if (solapamientoTotal < maxSolapamiento) {
          imagenPintada = true;
        }
      }

      graphics.push();
      graphics.noStroke();
      graphics.translate(0, 0);
      graphics.fill(colorBase);
      graphics.rect(
        xImagen * MARGEN - 2,
        yImagen * MARGEN - 2,
        anchoImagen * MARGEN + 5,
        anchoImagen * MARGEN + 5,
      );
      graphics.pop();

      graphics.push();
      // Recolocamos el origen medio píxel para que la imagen quede nítida
      graphics.translate(0, 0);
      graphics.fill(255);
      graphics.image(
        imagen,
        xImagen * MARGEN + 3,
        yImagen * MARGEN + 3,
        anchoImagen * MARGEN - 5,
        anchoImagen * MARGEN - 5,
      );
      graphics.pop();
    };

    const ajustaPosicionFrase = (xTexto, yTexto, wTexto, alturaRedondeada) => {
      let xFinal = xTexto + wTexto;
      let yFinal = yTexto + alturaRedondeada;
      let huboAjuste = false;

      // Ajustamos la posición si se sale del área
      if (xTexto < 1) {
        console.log("Texto sale por la izquierda");
        xTexto = 1;
        console.log("posición frase ajustada", xTexto, yTexto);
        huboAjuste = true;
      }

      if (yTexto < 1) {
        console.log("Texto sale por arriba");
        yTexto = 1;
        console.log("posición frase ajustada", xTexto, yTexto);
        huboAjuste = true;
      }

      if (xFinal > 19) {
        console.log("Texto sale por la derecha");
        xTexto = 19 - wTexto;
        console.log("posición frase ajustada", xTexto, yTexto);
        huboAjuste = true;
      }

      if (yFinal > 19) {
        console.log("Texto sale por abajo");
        yTexto = 19 - alturaRedondeada;
        console.log("posición frase ajustada", xTexto, yTexto);
        huboAjuste = true;
      }

      if (xFinal > 11 && yFinal > 11) {
        console.log("Texto se solapa con el título");
        xTexto = 11 - wTexto;
        yTexto = 11 - alturaRedondeada;
        console.log("posición frase ajustada", xTexto, yTexto);
        huboAjuste = true;
      }

      return [huboAjuste, xTexto, yTexto];
    };

    const defineTipografia = (graphics) => {
      graphics.noStroke();

      graphics.textLeading(65);
      graphics.drawingContext.letterSpacing = "-4px";

      graphics.textAlign(graphics.LEFT, graphics.TOP);
      graphics.textFont("futura-pt", 75);
      graphics.textStyle(graphics.BOLD);
    };

    const colocaFrase = (graphics) => {
      const posicionFrase = posicionAleatoria();
      const frase = solucion
        ? solucion.toUpperCase()
        : graphics.random(frases).toUpperCase();

      // Obtenemos la palabra más larga para calcular el ancho mínimo del cuadro
      const palabras = frase.split(" ");
      const palabraMasLarga = palabras.reduce((a, b) =>
        a.length > b.length ? a : b,
      );
      console.log("Palabra más larga", palabraMasLarga);

      defineTipografia(graphics);

      // Calculamos el ancho mínimo del cuadro
      const anchoMinimo = graphics.ceil(
        graphics.drawingContext.measureText(palabraMasLarga).width,
      );
      console.log("Ancho mínimo del cuadro", anchoMinimo);
      let unidadesAnchoMinimo = graphics.ceil(anchoMinimo / MARGEN);
      console.log("Unidades de ancho mínimo del cuadro", unidadesAnchoMinimo);

      unidadesAnchoMinimo = Math.max(unidadesAnchoMinimo, 8);

      let xTexto = posicionFrase.x;
      let yTexto = posicionFrase.y;
      const wTexto = graphics.floor(
        graphics.random(unidadesAnchoMinimo, unidadesAnchoMinimo + 2),
      );

      let margenTexto = 10;
      let ancho = wTexto * MARGEN - 5;

      // Calculamos la altura del texto para ajustar el fondo
      let alturaSinRedondear =
        alturaDeTexto(graphics, frase, ancho - 2 * margenTexto) +
        2 * margenTexto;
      let alturaRedondeada = Math.ceil(alturaSinRedondear / MARGEN);

      let huboAjuste;
      do {
        [huboAjuste, xTexto, yTexto] = ajustaPosicionFrase(
          xTexto,
          yTexto,
          wTexto,
          alturaRedondeada,
        );
      } while (huboAjuste);

      const x = xTexto * MARGEN + 3;
      const y = yTexto * MARGEN + 3;
      const altura = alturaRedondeada * MARGEN;

      return {
        frase,
        x,
        y,
        ancho,
        altura,
        margenTexto,
      };
    };

    const pintaFrase = (graphics, datos) => {
      const { frase, x, y, ancho, altura, margenTexto } = datos;

      defineTipografia(graphics);

      // Cuadro que define el borde
      graphics.fill(colorBase);
      graphics.rect(x - 5, y - 5, ancho + 10, altura + 5);

      // Fondo blanco del texto
      graphics.fill(255);
      graphics.rect(x, y, ancho, altura - 5);

      // Texto
      graphics.fill(colorBase);
      graphics.text(
        frase,
        x + margenTexto,
        y + margenTexto,
        ancho - 2 * margenTexto,
      );
    };

    const colocaTitulo = (graphics) => {
      const x = 11 * MARGEN;
      const y = 11 * MARGEN;
      const ancho = 8 * MARGEN;
      const altura = 8 * MARGEN;

      return { x, y, ancho, altura };
    };

    const pintaTitulo = (graphics, datosTitulo) => {
      graphics.noStroke();

      graphics.fill(colorBase);
      graphics.rect(
        datosTitulo.x - 2,
        datosTitulo.y - 2,
        datosTitulo.ancho + 5,
        datosTitulo.altura + 5,
      );
      graphics.fill(255);
      graphics.rect(
        datosTitulo.x + 3,
        datosTitulo.y + 3,
        datosTitulo.ancho,
        datosTitulo.altura,
      );

      graphics.fill(colorBase);
      graphics.rect(
        datosTitulo.x + MARGEN - 2,
        datosTitulo.y + MARGEN - 2,
        datosTitulo.ancho - MARGEN + 5,
        datosTitulo.altura - MARGEN + 5,
      );
      graphics.fill(255);
      graphics.rect(
        datosTitulo.x + MARGEN + 3,
        datosTitulo.y + MARGEN + 3,
        datosTitulo.ancho - MARGEN - 5,
        datosTitulo.altura - MARGEN - 5,
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

      // Reforzamos los límites de la cuadrícula para nada se pinte por encima
      // Para que las líneas queden nítidas movemos el origen medio píxel
      graphics.translate(0.5, 0.5);
      graphics.strokeCap(graphics.PROJECT);
      graphics.stroke(colorBase);
      graphics.strokeWeight(5);
      graphics.noFill();
      graphics.line(MARGEN, MARGEN, graphics.width - MARGEN, MARGEN);
      graphics.line(
        graphics.width - MARGEN,
        MARGEN,
        graphics.width - MARGEN,
        MARGEN * 11,
      );
      graphics.line(
        MARGEN,
        graphics.height - MARGEN,
        MARGEN * 11,
        graphics.height - MARGEN,
      );
      graphics.line(MARGEN, graphics.height - MARGEN, MARGEN, MARGEN);
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
      imagenes = [];

      for (const nombreImagen of listaImagenes) {
        imagenes.push(p.loadImage(`img/${nombreImagen}`));
      }

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

      // POSICIÓN DE LA FRASE
      cuadroFrase = p.createGraphics(p.width, p.height);
      const datosFrase = colocaFrase(cuadroFrase);

      // POSICION DEL TÍTULO
      cuadroTitulo = p.createGraphics(p.width, p.height);
      const datosTitulo = colocaTitulo(cuadroTitulo);

      // IMAGEN
      cuadroImagen = p.createGraphics(p.width, p.height);
      pintaImagen(cuadroImagen, datosTitulo, datosFrase);

      // FRASE
      pintaFrase(cuadroFrase, datosFrase);

      // TÍTULO
      pintaTitulo(cuadroTitulo, datosTitulo);

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

      p.tint(255, transparenciaCuadroImagen);
      p.image(cuadroImagen, 0, 0);

      if (CON_TEXTO) {
        p.tint(255, transparenciaCuadroFrase);
        p.image(cuadroFrase, 0, 0);

        p.tint(255, transparenciaCuadroTitulo);
        p.image(cuadroTitulo, 0, 0);
      }

      p.tint(255, 255);
      p.image(marco, 0, 0);

      if (conAnimacion) {
        transparenciaCuadroFrase = p.min(tiempo, 255);
        transparenciaCuadricula = p.max(0, p.min(tiempo - 1000, 255));
        transparenciaCuadroPatron = p.max(0, p.min(tiempo - 1500, 255));
        transparenciaCuadroImagen = p.max(0, p.min(tiempo - 2000, 255));
        transparenciaCuadroTitulo = p.max(0, p.min(tiempo - 3000, 255));

        if (tiempo > 3500) {
          console.log("¡Terminado!");
          if (!!despuesPintado) {
            despuesPintado();
          }
          p.noLoop();
        }

        tiempo = tiempo + 5;
      } else {
        if (!!despuesPintado) {
          despuesPintado();
        }
      }
    };
  };
};
