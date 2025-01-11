import * as THREE from "../../../../js/three.module.js";

import { AsciiEffectProyeccionDebil } from "./AsciiEffectProyeccionDebil.js";
import { OrbitControls } from "../../../../js/OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

/**
 * Carga un script de forma asíncrona
 *
 * @param   {string}    FILE_URL  URL del script
 * @param   {boolean}   async     Si es asíncrono o no
 * @param   {string}    type      Tipo de script
 * @returns {Promise}             Promesa con el resultado de la carga
 * @private
 */
const loadScript = (FILE_URL, async = true, type = "text/javascript") => {
  return new Promise((resolve, reject) => {
    try {
      const scriptEle = document.createElement("script");
      scriptEle.type = type;
      scriptEle.async = async;
      scriptEle.src = FILE_URL;

      scriptEle.addEventListener("load", (ev) => {
        resolve({ status: true });
      });

      scriptEle.addEventListener("error", (ev) => {
        reject({
          status: false,
          message: `Failed to load the script ＄{FILE_URL}`,
        });
      });

      document.body.appendChild(scriptEle);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Calcula la luminosidad de un color
 *
 * @param   {number} r Valor de rojo
 * @param   {number} g Valor de verde
 * @param   {number} b Valor de azul
 * @returns {number}   Luminosidad del color
 * @private
 */
const luminosidad = (r, g, b) => {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Crea una proyección del disco Débil
 *
 * @param   {Object}  opciones                           Opciones para crear la proyección
 * @param   {string}  opciones.proyector                 Selector CSS que especifica el elemento donde se creará la proyección
 * @param   {array}   opciones.caracteresElegidos        Array con los índices de los caracteres a utilizar
 * @param   {Object}  opciones.color                     Objeto con el color del diseño en formato rgb, indexado por r, g y b
 * @param   {boolean} opciones.conMovimiento             Si la proyección tiene movimiento o no
 * @param   {boolean} opciones.conPosicionInicialRandom  Si la proyección se genera en una posición random o no
 * @param   {boolean} opciones.conColorEnNegativo        Si se debe pintar la proyección en negativo o no
 * @param   {boolean} opciones.conEfecto                 Si se debe usar el efecto ASCII o no
 * @param   {boolean} opciones.conVariacionTamano        Si en cada visualización se varía el tamaño del modelo
 * @param   {Object}  opciones.ancho                     Ancho de la imagen en píxeles
 * @param   {Object}  opciones.alto                      Alto de la imagen en píxeles
 * @returns {void}
 * @public
 */
export function crea(opciones) {
  const DOMINIO_ACTUAL = window.location.origin;
  const URL_LIBRERIAS = DOMINIO_ACTUAL + "/debil/";
  const URL_BASE = DOMINIO_ACTUAL + "/debil/en/diseno/";

  const blanco = { r: 255, g: 255, b: 255 };

  let renderer;
  let textura;
  let efectoAscii;
  let detenido = false;
  let contenedorProyector;

  let modelos;
  let modelosCargados = [];
  let nModelos;
  let nModelosCargados = 0;
  let hayModelosCargados = false;
  let modeloMostrado;

  let contenedorContador = document.createElement("div");
  contenedorContador.classList.add(
    "absolute",
    "w-screen",
    "h-screen",
    "text-center",
    "text-2xl",
    "bg-white"
  );
  let contador = document.createElement("div");
  contador.style = "margin-top: 50vh;";
  contenedorContador.appendChild(contador);

  const actualizaContador = () => {
    contador.innerHTML =
      nModelosCargados + " de " + nModelos + " modelos cargados";
  };

  // Cargamos los scripts necesarios
  // TODO Igual esto no lo tenemos que cargar en cada llamada. Podemos tener una variable modulosCargados
  loadScript(URL_LIBRERIAS + "node_modules/seedrandom/seedrandom.min.js")
    .then((data) => {
      modelos = opciones.modelos;
      nModelos = modelos.length;

      // Las posibles cadenas de caracteres que se usarán para el efecto ASCII
      let posiblesCaracteres = [
        "#@%=*+-:·  ",
        "██⣿⣿  ",
        "█▛▚▝ ",
        "╬╠║╗┐- ",
        "●ø•:· ",
        "✺✹✸✷✶✦· ",
        "⣿⣷⣶⣦⣤⣄⣀⡀  ",
      ];

      let proyector = opciones.proyector;
      let caracteresElegidos =
        opciones.caracteresElegidos !== undefined
          ? opciones.caracteresElegidos
          : [];
      let conMovimiento =
        opciones.conMovimiento !== undefined ? opciones.conMovimiento : true;
      let conPosicionInicialRandom =
        opciones.conPosicionInicialRandom !== undefined
          ? opciones.conPosicionInicialRandom
          : false;
      let conColorEnNegativo = opciones.conColorEnNegativo;
      let conEfecto =
        opciones.conEfecto !== undefined ? opciones.conEfecto : true;
      let conVariacionTamano =
        opciones.conVariacionTamano !== undefined
          ? opciones.conVariacionTamano
          : true;

      let contenedor3d;

      let camara, controles, escena;

      let objeto;

      const anchoImagen = opciones.ancho ? opciones.ancho : 1400;
      const altoImagen = opciones.alto ? opciones.alto : 782;

      let canvasProyector;
      let alturaTexto;
      let alturaSubtexto;
      let alignTexto;
      let alignSubtexto;
      let posiblesAligns = ["left", "center", "right"];
      let tamanoBorde = 19;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const seed = Math.random().toString(36).slice(2);
      // Creamos el generador de números aleatorios con la seed
      const generador = new Math.seedrandom(seed);

      /**
       * Obtener un color aleatorio
       *
       * @returns {Array} Color aleatorio
       * @private
       */
      const colorAleatorio = () => {
        let color = [];
        color["r"] = generador() * 255;
        color["g"] = generador() * 255;
        color["b"] = generador() * 255;
        return color;
      };

      const colorAleatorioConContraste = () => {
        let color = colorAleatorio();

        luminanceBase = luminosidad(color["r"], color["g"], color["b"]);
        const maxLuminance = 0.1;

        // El color debe tener una liminosidad menor que maxLuminance
        // para que el texto en gris tenga contraste sufienciente
        while (luminanceBase > maxLuminance) {
          color = colorAleatorio();
          luminanceBase = luminosidad(color["r"], color["g"], color["b"]);
        }

        return color;
      };

      function colocaTextos() {
        // Colocamos los textos dentro de los márgenes del folio
        let margenEntreTextos = 10;

        // Primero colocamos el texto principal
        let minAlturaTexto = tamanoBorde + 84;
        let maxAlturaTexto = altoImagen - 83;
        alturaTexto =
          Math.random() * (maxAlturaTexto - minAlturaTexto) + minAlturaTexto;

        // Redondeamos la altura a la mínima o máxima para que no queden espacios pequeños en blanco
        if (alturaTexto < minAlturaTexto + margenEntreTextos) {
          alturaTexto = minAlturaTexto;
        } else {
          if (alturaTexto > maxAlturaTexto - margenEntreTextos) {
            alturaTexto = maxAlturaTexto;
          }
        }

        // En función del hueco que quede antes o después del texto principal, colocamos el subtexto
        let posicionSubtextoAntes;

        if (alturaTexto < tamanoBorde + 124 + margenEntreTextos) {
          posicionSubtextoAntes = false;
        } else {
          if (
            alturaTexto >
            altoImagen - tamanoBorde - 103 - margenEntreTextos
          ) {
            posicionSubtextoAntes = true;
          } else {
            posicionSubtextoAntes = Math.random() > 0.5;
          }
        }

        let minAlturaSubtexto = tamanoBorde;
        let maxAlturaSubTexto = altoImagen - tamanoBorde - 34;
        let minAlturaSubtextoConTexto = alturaTexto + 69 + margenEntreTextos;
        let maxAlturaSubtextoConTexto = alturaTexto - 119 - margenEntreTextos;

        if (posicionSubtextoAntes) {
          alturaSubtexto =
            Math.random() * (maxAlturaSubtextoConTexto - minAlturaSubtexto) +
            minAlturaSubtexto;
        } else {
          alturaSubtexto =
            Math.random() * (maxAlturaSubTexto - minAlturaSubtextoConTexto) +
            minAlturaSubtextoConTexto;
        }

        // Redondeamos la altura a la mínima o máxima para que no queden espacios pequeños en blanco
        if (alturaSubtexto < minAlturaSubtexto + margenEntreTextos) {
          alturaSubtexto = minAlturaSubtexto;
        } else {
          if (alturaSubtexto > maxAlturaSubTexto - margenEntreTextos) {
            alturaSubtexto = maxAlturaSubTexto;
          }
        }

        // Escogemos las alineaciones de los textos

        alignTexto =
          posiblesAligns[Math.floor(Math.random() * posiblesAligns.length)];

        // Solo permitimos o todo centrado o todo a un lado, aunque sea alternado
        if (alignTexto === "center") {
          alignSubtexto = "center";
        } else {
          alignSubtexto = Math.random() > 0.5 ? "left" : "right";
        }
      }

      const forma = generador() * 100;

      let colorBase;
      let colorFondo;
      let luminanceBase;

      if (opciones.color !== undefined) {
        colorBase = opciones.color;
      } else {
        colorBase = colorAleatorioConContraste();
      }
      colorFondo = blanco;

      luminanceBase = luminosidad(
        colorBase["r"],
        colorBase["g"],
        colorBase["b"]
      );

      init();
      animate();

      function init() {
        contenedorProyector = document.querySelector(proyector);
        contenedor3d = document.createElement("div");
        contenedor3d.innerHTML = "";

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(anchoImagen, altoImagen);

        if (caracteresElegidos.length > 0) {
          let posiblesCaracteresElegidos = [];

          caracteresElegidos.forEach((e) => {
            posiblesCaracteresElegidos.push(posiblesCaracteres[e]);
          });

          posiblesCaracteres = posiblesCaracteresElegidos;
        }

        // Tomamos una cadena aleatoria de caracteres
        let caracteres =
          posiblesCaracteres[
            Math.floor(generador() * posiblesCaracteres.length)
          ];

        canvasProyector = document.createElement("canvas");
        canvasProyector.width = anchoImagen;
        canvasProyector.height = altoImagen;

        // Al hacer click en el carte, se descarga una imagen
        canvasProyector.addEventListener("click", function (e) {
          e.preventDefault();

          var link = document.createElement("a");
          link.download = "cartel.png";
          link.href = this.toDataURL("image/png");
          link.click();
        });

        // Creamos el efecto ASCII
        efectoAscii = new AsciiEffectProyeccionDebil(
          URL_BASE,
          canvasProyector,
          renderer,
          colorBase,
          caracteres,
          {
            resolution: 0.1,
            scale: 1,
            color: "rgb(0,255,0)",
            invert:
              conColorEnNegativo === undefined
                ? generador() > 0.5
                : conColorEnNegativo,
          }
        );
        efectoAscii.setSize(anchoImagen, altoImagen);

        if (conEfecto) {
          contenedor3d.appendChild(efectoAscii.domElement);
        } else {
          contenedor3d.appendChild(renderer.domElement);
        }

        contenedorProyector.appendChild(contenedorContador);

        escena = new THREE.Scene();
        escena.background = new THREE.Color(0xffffff);

        // Hacemos que la cámara gire alrededor del abismo

        camara = new THREE.PerspectiveCamera(
          75,
          anchoImagen / altoImagen,
          10,
          20000
        );

        if (conEfecto) {
          controles = new OrbitControls(camara, efectoAscii.domElement);
        } else {
          controles = new OrbitControls(camara, renderer.domElement);
        }
        controles.minDistance = 1000;
        controles.maxDistance = 10000;
        controles.maxPolarAngle = Math.PI / 2;
        controles.autoRotate = true;
        controles.autoRotateSpeed = 8;

        controles.target.y = 500;
        camara.position.y = controles.target.y;

        let posiblePosicionInicialRandom = generador() * 4000;

        camara.position.x = conPosicionInicialRandom
          ? posiblePosicionInicialRandom
          : 2000;
        camara.position.z = 3000;
        controles.update();

        modelos.forEach((path) => {
          import(path).then((modelo) => {
            const objeto = modelo.default;
            const loader = new GLTFLoader();
            // Si no se indica en la propiedad "path" se asume que el archivo se llama scene.gltf
            const pathModelo =
              objeto.path !== undefined
                ? objeto.path
                : path.replace("modelo.js", "scene.gltf");
            loader.load(pathModelo, function (gltf) {
              nModelosCargados++;

              let modeloCargado = gltf.scene;
              modeloCargado.scale.setScalar(objeto.tamano);
              modeloCargado.position.set(
                objeto.posicion[0],
                objeto.posicion[1],
                objeto.posicion[2]
              );

              modelosCargados.push(modeloCargado);
              actualizaContador();
            });
          });
        });

        // Aplicamos sombras

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.target.position.set(0, 10, -1);
        dirLight.add(dirLight.target);
        dirLight.lookAt(-1, -10, 0);
        dirLight.name = "DirectionalLight";
        escena.add(dirLight);

        // Añadimos los listeners de los eventos

        contenedor3d.addEventListener("pointermove", onPointerMove);
        window.addEventListener("resize", onWindowResize);

        // Añadimos la proyección al canvas

        if (conEfecto) {
          contenedorProyector.appendChild(canvasProyector);
        } else {
          contenedorProyector.appendChild(renderer.domElement);
        }

        colocaTextos();
      }

      function onWindowResize() {
        camara.aspect = anchoImagen / altoImagen;
        camara.updateProjectionMatrix();

        renderer.setSize(anchoImagen, altoImagen);
      }

      /**
       * Anima la escena
       *
       * @returns {void}
       * @private
       */
      function animate() {
        if (!detenido) {
          requestAnimationFrame(animate);
        }

        if (!hayModelosCargados) {
          if (nModelosCargados === nModelos) {
            hayModelosCargados = true;
            contenedorProyector.removeChild(contenedorContador);
            mostrarModelo();
          }
        }

        render();
        if (conMovimiento) {
          controles.update();
        }
      }

      function mostrarModelo() {
        if (modeloMostrado !== undefined) {
          escena.remove(modeloMostrado);
        }
        modeloMostrado =
          modelosCargados[Math.floor(Math.random() * nModelos)].clone();

        // Variamos su escala entre 1 y 3
        if (conVariacionTamano) {
          let variacionEscala = Math.random() * 2 + 1;
          modeloMostrado.scale.setScalar(
            modeloMostrado.scale.x * variacionEscala
          );
        }

        escena.add(modeloMostrado);

        // Alternamos entre color/blanco y 2 colores de una paleta
        if (Math.random() > 0.5) {
          let paleta =
            PALETAS_CHULAS[Math.floor(Math.random() * PALETAS_CHULAS.length)];

          shuffle(paleta);

          paleta.colorBase = hexToRgb(paleta[0]);
          colorFondo = hexToRgb(paleta[1]);
        } else {
          if (Math.random() > 0.5) {
            colorBase = blanco;
            colorFondo = colorAleatorioConContraste();
          } else {
            colorBase = colorAleatorioConContraste();
            colorFondo = blanco;
          }
        }

        efectoAscii.colorBaseGlobal = colorBase;
        efectoAscii.colorFondo = colorFondo;
        efectoAscii.invert =
          conColorEnNegativo === undefined
            ? generador() > 0.5
            : conColorEnNegativo;
        efectoAscii.caracteres =
          posiblesCaracteres[
            Math.floor(generador() * posiblesCaracteres.length)
          ];

        colocaTextos();

        setTimeout(mostrarModelo, 5000);
      }

      /**
       * Renderiza la escena
       *
       * @returns {void}
       * @private
       */
      function render() {
        if (conEfecto) {
          efectoAscii.render(escena, camara);
        } else {
          renderer.render(escena, camara);
        }

        let context = canvasProyector.getContext("2d");

        // Dibujamos bordes en la imagen con el color base
        context.fillStyle = colorBase;
        context.fillRect(0, 0, anchoImagen, tamanoBorde);
        context.fillRect(0, 0, tamanoBorde, altoImagen);
        context.fillRect(0, altoImagen - tamanoBorde, anchoImagen, tamanoBorde);
        context.fillRect(anchoImagen - tamanoBorde, 0, tamanoBorde, altoImagen);

        let fontInicial = context.font;
        let textAlignInicial = context.textAlign;
        let fillStyleInicial = context.fillStyle;
        let letterSpacingInicial = context.letterSpacing;

        let x;
        let y = alturaTexto;

        let lineheight = 74;
        let lines = [
          ["AUTO SACRAMENTAL", 565],
          ["+ OCRE", 203],
        ];
        lines.reverse();

        context.font = "bold 60px futura-pt";
        context.letterSpacing = "-3px";

        context.textAlign = alignTexto;

        switch (alignTexto) {
          case "left":
            x = 20;
            for (let i = 0; i < lines.length; i++) {
              context.fillStyle = fillStyleInicial;
              let tamanoRect = lines[i][1];
              context.fillRect(10, y - i * lineheight - 10, tamanoRect, 75);
            }

            break;

          case "center":
            x = anchoImagen / 2;
            for (let i = 0; i < lines.length; i++) {
              context.fillStyle = fillStyleInicial;
              let tamanoRect = lines[i][1];
              context.fillRect(
                anchoImagen / 2 - tamanoRect / 2,
                y - i * lineheight - 10,
                tamanoRect,
                75
              );
            }
            break;

          case "right":
            x = anchoImagen - 20;
            for (let i = 0; i < lines.length; i++) {
              context.fillStyle = fillStyleInicial;
              let tamanoRect = lines[i][1];
              context.fillRect(
                x - tamanoRect + 10,
                y - i * lineheight - 10,
                tamanoRect,
                75
              );
            }
            break;
        }

        for (let i = 0; i < lines.length; i++) {
          context.fillStyle =
            "rgb(" +
            colorFondo["r"] +
            "," +
            colorFondo["g"] +
            "," +
            colorFondo["b"] +
            ")";
          context.fillText(lines[i][0], x, y - i * lineheight);
        }

        context.font = "bold 35px futura-pt";
        context.letterSpacing = "-2px";
        context.textAlign = alignSubtexto;

        let sx;
        let sy = alturaSubtexto;
        let slineheight = 25;
        let slines = [
          ["25 DE XANEIRO + 21H + ACÉFALA", 490],
          // ["25 DE XANEIRO", 170],
          // ["21H", 55],
          // ["ACÉFALA", 102],
        ];
        slines.reverse();

        switch (alignSubtexto) {
          case "left":
            sx = 20;
            for (let i = 0; i < slines.length; i++) {
              context.fillStyle = fillStyleInicial;
              let tamanoRect = slines[i][1];
              context.fillRect(10, sy - i * slineheight - 5, tamanoRect, 40);
            }

            break;

          case "center":
            sx = anchoImagen / 2;
            for (let i = 0; i < slines.length; i++) {
              context.fillStyle = fillStyleInicial;
              let tamanoRect = slines[i][1];
              context.fillRect(
                anchoImagen / 2 - tamanoRect / 2,
                sy - i * slineheight - 5,
                tamanoRect,
                40
              );
            }
            break;

          case "right":
            sx = anchoImagen - 20;
            for (let i = 0; i < slines.length; i++) {
              context.fillStyle = fillStyleInicial;
              let tamanoRect = slines[i][1];
              context.fillRect(
                sx - tamanoRect + 10,
                sy - i * slineheight - 5,
                tamanoRect,
                40
              );
            }
            break;
        }

        for (let i = 0; i < slines.length; i++) {
          context.fillStyle =
            "rgb(" +
            colorFondo["r"] +
            "," +
            colorFondo["g"] +
            "," +
            colorFondo["b"] +
            ")";
          context.fillText(slines[i][0], sx, sy - i * slineheight);
        }

        context.font = fontInicial;
        context.textAlign = textAlignInicial;
        context.fillStyle = fillStyleInicial;
        context.letterSpacing = letterSpacingInicial;
      }

      function onPointerMove(event) {
        pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camara);

        const intersects = raycaster.intersectObject(objeto);
      }
    })
    .catch((err) => {
      console.error(err);
    });

  let borrables = [renderer, textura, efectoAscii];

  return function () {
    borrables.forEach((e) => {
      if (e !== undefined) {
        e.dispose();
      }
    });
    detenido = true;
    contenedorProyector.innerHTML = "";
  };
}
