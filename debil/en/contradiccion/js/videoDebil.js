import * as THREE from "../../../js/three.module.js";

import { AsciiVideoDebil } from "./AsciiVideoDebil.js";
import { OrbitControls } from "../../../js/OrbitControls.js";
import { ImprovedNoise } from "../../diseno/js/ImprovedNoise.js";

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

const fecha = (date) => {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  return (
    "el <b>" +
    pad(date.getDate()) +
    "." +
    pad(date.getMonth() + 1) +
    "." +
    pad(date.getFullYear().toString().substr(-2)) +
    "</b> a las <b>" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    "</b>"
  );
};

/**
 * Crea una portada y contraportada del disco Débil
 *
 * @param   {Object}  opciones                           Opciones para crear la portada y contraportada
 * @param   {string}  opciones.portada                   Selector CSS que especifica el elemento donde se creará la portada
 * @param   {string}  opciones.contra                    Selector CSS que especifica el elemento donde se creará la contraportada
 * @param   {array}   opciones.caracteresElegidos        Array con los índices de los caracteres a utilizar
 * @param   {Object}  opciones.color                     Objeto con el color del diseño en formato rgb, indexado por r, g y b
 * @param   {boolean} opciones.conMovimiento             Si la portada tiene movimiento o no
 * @param   {boolean} opciones.conPosicionInicialRandom  Si la portada se genera en una posición random o no
 * @param   {boolean} opciones.conTextoPortada           Si se muestra texto en la portada
 * @param   {boolean} opciones.conAbismoCircular         Si el abismo es circular o no
 * @param   {boolean} opciones.conColorEnNegativo        Si se debe pintar la portada en negativo o no
 * @param   {boolean} opciones.conEfecto                 Si se debe usar el efecto ASCII o no
 * @param   {Object}  opciones.ancho                     Ancho de la imagen en píxeles
 * @param   {Object}  opciones.alto                      Alto de la imagen en píxeles
 * @param   {Object}  opciones.margen                    Margen alrededor de la imagen en píxeles
 * @returns {void}
 * @public
 */
export function crea(opciones) {
  const DOMINIO_ACTUAL = window.location.origin;
  const URL_LIBRERIAS = DOMINIO_ACTUAL + "/debil/";
  const URL_BASE = DOMINIO_ACTUAL + "/debil/en/diseno/";

  let renderer;
  let geometria;
  let textura;
  let geometriaHelper;
  let efectoAscii;
  let detenido = false;
  let trallaFinal = false;

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

  // Cargamos los scripts necesarios
  // TODO Igual esto no lo tenemos que cargar en cada llamada. Podemos tener una variable modulosCargados
  loadScript(URL_LIBRERIAS + "node_modules/seedrandom/seedrandom.min.js")
    .then((data) => {
      loadScript(URL_LIBRERIAS + "node_modules/qrious/dist/qrious.min.js")
        .then((data) => {
          let proceso = Math.random();
          let portada = opciones.portada;
          let contra = opciones.contra;
          let caracteresElegidos =
            opciones.caracteresElegidos !== undefined
              ? opciones.caracteresElegidos
              : [];
          let conMovimiento =
            opciones.conMovimiento !== undefined
              ? opciones.conMovimiento
              : true;
          let conPosicionInicialRandom =
            opciones.conPosicionInicialRandom !== undefined
              ? opciones.conPosicionInicialRandom
              : false;
          let conTextoPortada =
            opciones.conTextoPortada !== undefined
              ? opciones.conTextoPortada
              : true;
          let conColorEnNegativo = opciones.conColorEnNegativo;
          let conEfecto =
            opciones.conEfecto !== undefined ? opciones.conEfecto : true;

          let contenedor3d, contenedorPortada;

          let camara, controles, escena;

          let terreno;

          const conAbismo = true;

          const anchoMundo = 800,
            profundidadMundo = 800,
            medioAnchoMundo = anchoMundo / 2,
            mediaProfundidadMundo = profundidadMundo / 2;

          const anchoImagen = opciones.ancho ? opciones.ancho : 1400;
          const altoImagen = opciones.alto ? opciones.alto : 1400;

          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();

          // Permitimos que una seed se pueda pasar por la URL
          const urlParams = new URLSearchParams(window.location.search);
          const seed =
            urlParams.get("seed") !== null
              ? urlParams.get("seed")
              : Math.random().toString(36).slice(2);

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
            const minLuminance = 0.4;

            while (luminanceBase < minLuminance) {
              colorBase = colorAleatorio();
              luminanceBase = luminosidad(
                colorBase["r"],
                colorBase["g"],
                colorBase["b"]
              );
            }

            return color;
          };

          // Establecemos la seed en la URL que se usará en el QR
          let searchParams = new URLSearchParams("");
          searchParams.set("seed", seed);

          const urlSeed =
            URL_BASE + "completamente/" + "?" + searchParams.toString();

          const forma = generador() * 100;

          console.log("seed", seed);
          console.log("forma", forma);
          console.log("urlSeed", urlSeed);

          let colorBase;
          let luminanceBase;

          if (opciones.color !== undefined) {
            colorBase = opciones.color;
          } else {
            colorBase = colorAleatorioConContraste();
          }

          luminanceBase = luminosidad(
            colorBase["r"],
            colorBase["g"],
            colorBase["b"]
          );

          console.log(
            "colorBase",
            colorBase["r"],
            colorBase["g"],
            colorBase["b"],
            luminanceBase
          );

          let conAbismoCircular =
            opciones.conAbismoCircular !== undefined
              ? opciones.conAbismoCircular
              : generador() > 0.5;

          console.log("conAbismoCircular", conAbismoCircular);

          init();
          animate();

          function init() {
            contenedorPortada = document.querySelector(portada);
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

            // Invertir el efecto ASCII?
            if (conColorEnNegativo !== undefined) {
              if (conColorEnNegativo) {
                caracteres = caracteres.split("").reverse().join("");
              }
            } else {
              if (generador() > 0.5) {
                caracteres = caracteres.split("").reverse().join("");
              }
            }

            let canvasPortada = document.createElement("canvas");
            canvasPortada.width = anchoImagen;
            canvasPortada.height = altoImagen;

            // Creamos el efecto ASCII
            efectoAscii = new AsciiVideoDebil(
              URL_BASE,
              canvasPortada,
              renderer,
              colorBase,
              caracteres,
              {
                resolution: 0.1,
                scale: 1,
                color: "rgb(0,255,0)",
                margen: opciones.margen,
                conTextoPortada: conTextoPortada,
              }
            );
            efectoAscii.setSize(anchoImagen, altoImagen);

            if (conEfecto) {
              contenedor3d.appendChild(efectoAscii.domElement);
            } else {
              contenedor3d.appendChild(renderer.domElement);
            }

            escena = new THREE.Scene();
            escena.background = new THREE.Color(0xffffff);

            // Hacemos que la cámara gire alrededor del abismo

            camara = new THREE.PerspectiveCamera(
              30,
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

            const data = generarAlturas(anchoMundo, profundidadMundo);

            controles.target.y =
              data[medioAnchoMundo + mediaProfundidadMundo * anchoMundo] + 500;
            camara.position.y = controles.target.y + 10000;

            let posiblePosicionInicialRandom = generador() * 4000;

            camara.position.x = conPosicionInicialRandom
              ? posiblePosicionInicialRandom
              : 2000;
            camara.position.z = 3000;
            controles.update();

            // Generamos el terreno

            geometria = new THREE.PlaneGeometry(
              7500,
              7500,
              anchoMundo - 1,
              profundidadMundo - 1
            );
            geometria.rotateX(-Math.PI / 2);

            const vertices = geometria.attributes.position.array;

            for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
              // Este multiplicador hace que las diferencias de altura sean más grandes
              vertices[j + 1] = data[i] * 20;
            }

            // Aplicamos sombras

            textura = new THREE.CanvasTexture(
              generarTextura(data, anchoMundo, profundidadMundo)
            );
            textura.wrapS = THREE.ClampToEdgeWrapping;
            textura.wrapT = THREE.ClampToEdgeWrapping;

            terreno = new THREE.Mesh(
              geometria,
              new THREE.MeshBasicMaterial({ map: textura })
            );
            escena.add(terreno);

            // Creamos un helper que nos permita girar la cámara mirando siempre al centro

            geometriaHelper = new THREE.ConeGeometry(20, 100, 3);
            geometriaHelper.translate(0, 50, 0);
            geometriaHelper.rotateX(Math.PI / 2);

            // Añadimos los listeners de los eventos

            contenedor3d.addEventListener("pointermove", onPointerMove);
            window.addEventListener("resize", onWindowResize);

            // Añadimos la portada al canvas

            if (conEfecto) {
              contenedorPortada.appendChild(canvasPortada);
            } else {
              contenedorPortada.appendChild(renderer.domElement);
            }

            let body = document.querySelector("body");
            let audio = document.getElementById("audio");
            let letra = document.getElementById("letra");
            let esFinal = false;

            const liricle = new Liricle();
            // El audio cuenta con 6 segundos de silencio al principio
            // para poder lanzarlo en el evento del click (nos obliga Safari)
            // y que dé tiempo a mostrar la portada. Así que tenemos que desplazar
            // la letra 6 segundos hacia adelante.
            liricle.offset = -6000;

            // listen to on sync event
            liricle.on("sync", (line, word) => {
              contenedorPortada.classList.remove("hidden");

              if (!trallaFinal) {
                efectoAscii.colorGlobal = colorAleatorioConContraste();
                efectoAscii.caracteres =
                  posiblesCaracteres[
                    Math.floor(generador() * posiblesCaracteres.length)
                  ];
              }
              let texto = line.text;

              if (texto.toLowerCase() == "no mujer") {
                contenedorPortada.remove();
                body.classList.remove("bg-black");
                body.classList.add("bg-white");
              } else if (texto.toLowerCase() == "fin") {
                // body.classList.remove("uppercase");
                body.style.fontSize = "1.5em";
                body.style.lineHeight = "1.2";
                body.style.letterSpacing = "-0.05em";
                body.classList.remove("font-bold");
                esFinal = true;
                texto =
                  "Vídeo generado " +
                  fecha(new Date()) +
                  " <br>para la canción <b>No débil</b><br>del disco <b>Débil</b> de <b>Ocre</b><br>Autoeditado en <b>2023</b><br><br>" +
                  "Letra y Música de <b>Edu Poch</b> y <b>Bita Barbadillo</b><br>Grabada y producida por <b>Edu Poch</b><br>Mezclada y masterizada por <b>Jahel Piñeiro</b><br>Código del vídeo programado por <b>Edu Poch</b>";
              }

              if (!esFinal) {
                letra.innerHTML = texto.replace(/\s+/g, "<br />");
              } else {
                letra.innerHTML = texto;
              }
            });

            // load lyric
            liricle.load({
              url: "audio/no_debil.lrc",
            });

            audio.addEventListener("timeupdate", () => {
              const time = audio.currentTime;

              if (time > 3 * 60 + 55) {
                trallaFinal = true;
              }

              // sync lyric when the audio time updated
              liricle.sync(time, false);
            });

            // audio.currentTime = 3 * 60 + 50;
          }

          function onWindowResize() {
            camara.aspect = anchoImagen / altoImagen;
            camara.updateProjectionMatrix();

            renderer.setSize(anchoImagen, altoImagen);
          }

          function distancia(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
          }

          /**
           * Genera un array con las alturas del terreno
           *
           * @param   {number}      ancho Ancho de la superficie sobre la que generar alturas
           * @param   {number}      alto  Alto de la superficie sobre la que generar alturas
           * @returns {Uint8Array}        Array de bytes con las alturas generadas
           */
          function generarAlturas(ancho, alto) {
            const tamano = ancho * alto,
              data = new Uint8Array(tamano),
              perlin = new ImprovedNoise();

            let calidad = 1;
            let base = 100;

            for (let j = 0; j < 4; j++) {
              for (let i = 0; i < tamano; i++) {
                const x = i % ancho,
                  y = ~~(i / ancho);

                data[i] += Math.abs(
                  perlin.noise(x / calidad, y / calidad, forma) * calidad * 1.75
                );
              }

              calidad *= 5;
            }

            if (conAbismoCircular) {
              let tamanoAbismo = ancho / 4;
              // Creamos un círculo en el centro
              // y al resto de puntos les sumamos una altura base
              for (let i = 0; i < tamano; i++) {
                const x = i % ancho,
                  y = ~~(i / ancho);
                const d = distancia(x, y, ancho / 2, ancho / 2);
                if (d < tamanoAbismo) {
                  data[i] = 0;
                } else {
                  data[i] += base;
                }
              }
            } else {
              // En ese terreno, generamos un abismo que lo atraviese
              let tamanoAbismo = 60;

              if (conAbismo) {
                for (let i = 0; i < tamano; i++) {
                  const x = i % ancho,
                    y = ~~(i / ancho);

                  if (
                    x > ancho / 2 - tamanoAbismo &&
                    x < ancho / 2 + tamanoAbismo
                  ) {
                    data[i] = 0;
                  } else {
                    data[i] += base;
                  }
                }
              }
            }

            return data;
          }

          /**
           *  Genera una textura a partir de un array de bytes con las alturas del terreno
           *
           * @param {Uint8array} data Array de bytes con las alturas del terreno
           * @param {number} ancho Ancho del terreno
           * @param {number} alto Alto del terreno
           * @returns {*} El canvas con la textura generada
           */
          function generarTextura(data, ancho, alto) {
            // Aplicamos luz y sombra al terreno
            let context, imagen, imagenData, sombra;

            const vector3 = new THREE.Vector3(0, 0, 0);

            const sol = new THREE.Vector3(1, 1, 10);
            sol.normalize();

            const canvas = document.createElement("canvas");
            canvas.width = ancho;
            canvas.height = alto;

            context = canvas.getContext("2d");
            context.fillStyle = "#000";
            context.fillRect(0, 0, canvas.width, canvas.height);

            imagen = context.getImageData(0, 0, canvas.width, canvas.height);
            imagenData = imagen.data;

            for (let i = 0, j = 0, l = imagenData.length; i < l; i += 4, j++) {
              vector3.x = data[j - 2] - data[j + 2];
              vector3.y = 2;
              vector3.z =
                data[j - canvas.width * 2] - data[j + canvas.width * 2];
              vector3.normalize();

              sombra = vector3.dot(sol);

              imagenData[i] = (96 + sombra * 128) * (0.5 + data[j] * 0.007);
              imagenData[i + 1] = (32 + sombra * 96) * (0.5 + data[j] * 0.007);
              imagenData[i + 2] = sombra * 96 * (0.5 + data[j] * 0.007);
            }

            context.putImageData(imagen, 0, 0);

            // Escalamos la imagen x4

            const canvasEscalado = document.createElement("canvas");
            canvasEscalado.width = canvas.width * 4;
            canvasEscalado.height = canvas.height * 4;

            context = canvasEscalado.getContext("2d");
            context.scale(4, 4);
            context.drawImage(canvas, 0, 0);

            imagen = context.getImageData(
              0,
              0,
              canvasEscalado.width,
              canvasEscalado.height
            );
            imagenData = imagen.data;

            for (let i = 0, l = imagenData.length; i < l; i += 4) {
              const v = ~~(generador() * 5);

              imagenData[i] += v;
              imagenData[i + 1] += v;
              imagenData[i + 2] += v;
            }

            context.putImageData(imagen, 0, 0);

            return canvasEscalado;
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

            render();
            if (conMovimiento) {
              controles.update();
            }
          }

          /**
           * Renderiza la escena
           *
           * @returns {void}
           * @private
           */
          function render() {
            if (trallaFinal) {
              efectoAscii.colorGlobal = colorAleatorioConContraste();
              efectoAscii.caracteres =
                posiblesCaracteres[
                  Math.floor(generador() * posiblesCaracteres.length)
                ];
            }

            if (conEfecto) {
              efectoAscii.render(escena, camara);
            } else {
              renderer.render(escena, camara);
            }
          }

          function onPointerMove(event) {
            pointer.x =
              (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            pointer.y =
              -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camara);

            // See if the ray from the camara into the world hits one of our meshes
            const intersects = raycaster.intersectObject(terreno);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });

  let borrables = [renderer, geometria, textura, geometriaHelper, efectoAscii];

  return function () {
    borrables.forEach((e) => {
      if (e !== undefined) {
        e.dispose();
      }
    });
    detenido = true;
  };
}
