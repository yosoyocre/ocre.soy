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
      "telegrapher_boy.png",
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
    let cuadroPatron2;
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

      // Dibujamos el borde del patrón
      graphics.push();
      graphics.noStroke();
      graphics.fill(colorBase);
      graphics.rect(
        xPatron * MARGEN - 2,
        yPatron * MARGEN - 2,
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
      const imagen = graphics.random(imagenes);

      const xImagen = x || graphics.floor(graphics.random(1, 13));
      const yImagen = y || graphics.floor(graphics.random(1, 13));
      const anchoImagen = graphics.floor(graphics.random(8, 12));

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

    const pintaFrase = (graphics, x, y) => {
      const frase = solucion
        ? solucion.toUpperCase()
        : graphics.random(frases).toUpperCase();

      // Obtenemos la palabra más larga para calcular el ancho mínimo del cuadro
      const palabras = frase.split(" ");
      const palabraMasLarga = palabras.reduce((a, b) =>
        a.length > b.length ? a : b,
      );
      console.log("Palabra más larga", palabraMasLarga);

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

      // Calculamos el ancho mínimo del cuadro
      const anchoMinimo = graphics.ceil(
        graphics.drawingContext.measureText(palabraMasLarga).width,
      );
      console.log("Ancho mínimo del cuadro", anchoMinimo);
      let unidadesAnchoMinimo = graphics.ceil(anchoMinimo / MARGEN);
      console.log("Unidades de ancho mínimo del cuadro", unidadesAnchoMinimo);

      unidadesAnchoMinimo = Math.max(unidadesAnchoMinimo, 8);

      let xTexto = x || graphics.floor(graphics.random(1, 10));
      let yTexto = y || graphics.floor(graphics.random(1, 10));
      const wTexto = graphics.floor(
        graphics.random(unidadesAnchoMinimo, unidadesAnchoMinimo + 2),
      );

      let margenTexto = 10;
      let anchoMaximo = wTexto * MARGEN - 5;

      // Calculamos la altura del texto para ajustar el fondo
      let altura =
        alturaDeTexto(graphics, frase, anchoMaximo - 2 * margenTexto) +
        2 * margenTexto;
      let alturaRedondeada = Math.ceil(altura / MARGEN);

      let huboAjuste;
      do {
        [huboAjuste, xTexto, yTexto] = ajustaPosicionFrase(
          xTexto,
          yTexto,
          wTexto,
          alturaRedondeada,
        );
      } while (huboAjuste);

      let posicionX = xTexto * MARGEN + 3;
      let posicionY = yTexto * MARGEN + 3;

      // Cuadro que define el borde
      graphics.fill(colorBase);
      graphics.rect(
        posicionX - 5,
        posicionY - 5,
        anchoMaximo + 10,
        alturaRedondeada * MARGEN + 5,
      );

      // Fondo blanco del texto
      graphics.fill(255);
      graphics.rect(
        posicionX,
        posicionY,
        anchoMaximo,
        alturaRedondeada * MARGEN - 5,
      );

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

      let posiciones = [];
      for (let i = 0; i < 3; i++) {
        let xPosicion = p.floor(p.random(1, 15));
        let yPosicion;
        if (xPosicion > 8) {
          yPosicion = p.floor(p.random(1, 10));
        } else {
          yPosicion = p.floor(p.random(1, 15));
        }
        posiciones.push([xPosicion, yPosicion]);
      }

      // CUADRÍCULA
      cuadricula = p.createGraphics(p.width, p.height);
      pintaCuadricula(cuadricula);

      // PATRÓN
      cuadroPatron = p.createGraphics(p.width, p.height);
      console.log("posición patrón", posiciones[0]);
      pintaPatron(
        cuadroPatron,
        p.floor(posiciones[0][0]),
        p.floor(posiciones[0][1]),
      );

      // IMAGEN
      cuadroPatron2 = p.createGraphics(p.width, p.height);
      console.log("posición imagen", posiciones[1]);
      const probabilidadImagen = SOLO_IMAGENES ? 1 : 0.5;
      if (p.random() < probabilidadImagen) {
        pintaImagen(
          cuadroPatron2,
          p.floor(posiciones[1][0]),
          p.floor(posiciones[1][1]),
        );
      } else {
        pintaPatron(
          cuadroPatron2,
          p.floor(posiciones[1][0]),
          p.floor(posiciones[1][1]),
        );
      }
      // FRASE
      cuadroFrase = p.createGraphics(p.width, p.height);
      console.log("posición frase", posiciones[2]);
      pintaFrase(
        cuadroFrase,
        p.floor(posiciones[2][0]),
        p.floor(posiciones[2][1]),
      );

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

      p.tint(255, transparenciaCuadroImagen);
      p.image(cuadroPatron2, 0, 0);

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
