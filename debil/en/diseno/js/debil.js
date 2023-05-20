// TODO Hacer que URL_BASE se adapte a la ruta del archivo
const URL_BASE = "http://localhost/debil/en/diseno/";

import * as THREE from "./three.module.js";

import { AsciiEffectDebil } from "./AsciiEffectDebil.js";
import { OrbitControls } from "./OrbitControls.js";
import { ImprovedNoise } from "./ImprovedNoise.js";

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
 * Crea una portada y contraportada del disco Débil
 *
 * @param   {Object}  opciones                Opciones para crear la portada y contraportada
 * @param   {string}  opciones.portada        Selector CSS que especifica el elemento donde se creará la portada
 * @param   {string}  opciones.contra         Selector CSS que especifica el elemento donde se creará la contraportada
 * @param   {boolean} opciones.conMovimiento  Si la portada tiene movimiento o no
 * @returns {void}
 * @public
 */
export function crea(opciones) {
  // Cargamos los scripts necesarios
  loadScript(URL_BASE + "node_modules/seedrandom/seedrandom.min.js")
    .then((data) => {
      loadScript(URL_BASE + "node_modules/qrious/dist/qrious.min.js")
        .then((data) => {
          let portada = opciones.portada;
          let contra = opciones.contra;
          let conMovimiento =
            opciones.conMovimiento !== undefined
              ? opciones.conMovimiento
              : true;

          let contenedor3d, contenedorPortada;

          let camara, controles, escena, renderer, efectoAscii;

          let terreno, textura;

          const conEfecto = true;
          const conAbismo = true;

          const anchoMundo = 800,
            profundidadMundo = 800,
            medioAnchoMundo = anchoMundo / 2,
            mediaProfundidadMundo = profundidadMundo / 2;

          const anchoImagen = 1400;
          const altoImagen = 1400;

          let helper;

          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();

          const baseUrl = new URL(window.location.href);

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

          // Establecemos la seed en la URL que se usará en el QR
          let searchParams = new URLSearchParams("");
          searchParams.set("seed", seed);

          const urlSeed = baseUrl + "?" + searchParams.toString();

          const forma = generador() * 100;

          console.log("seed", seed);
          console.log("forma", forma);
          console.log("urlSeed", urlSeed);

          let colorBase = colorAleatorio();

          let luminanceBase = luminosidad(
            colorBase["r"],
            colorBase["g"],
            colorBase["b"]
          );
          const maxLuminance = 0.1;

          // El color debe tener una liminosidad menor que maxLuminance
          // para que el texto en gris tenga contraste sufienciente
          while (luminanceBase > maxLuminance) {
            colorBase = colorAleatorio();
            luminanceBase = luminosidad(
              colorBase["r"],
              colorBase["g"],
              colorBase["b"]
            );
          }

          console.log(
            "colorBase",
            colorBase["r"],
            colorBase["g"],
            colorBase["b"],
            luminanceBase
          );

          init();
          animate();

          function init() {
            contenedorPortada = document.querySelector(portada);
            contenedor3d = document.createElement("div");
            contenedor3d.innerHTML = "";

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(anchoImagen, altoImagen);

            // Las posibles cadenas de caracteres que se usarán para el efecto ASCII
            let posiblesCaracteres = [
              "#@%=*+-:·  ",
              "█▓▒░ ",
              "█▛▚▝ ",
              "╬╠║╗┐- ",
              "●ø•:· ",
              "✺✹✸✷✶✦· ",
              "⣿⣷⣶⣦⣤⣄⣀⡀  ",
              "█▓▒░⣿⣷⣶⣦⣤⣄⣀⡀ ",
            ];

            // Tomamos una cadena aleatoria de caracteres
            let caracteres =
              posiblesCaracteres[
                Math.floor(generador() * posiblesCaracteres.length)
              ];

            // Invertir el efecto ASCII?
            if (generador() > 0.5) {
              caracteres = caracteres.split("").reverse().join("");
            }

            let canvasPortada = document.createElement("canvas");
            canvasPortada.width = anchoImagen;
            canvasPortada.height = altoImagen;

            // Creamos el efecto ASCII
            efectoAscii = new AsciiEffectDebil(
              URL_BASE,
              canvasPortada,
              renderer,
              colorBase,
              caracteres,
              {
                resolution: 0.1,
                scale: 1,
                color: "rgb(0,255,0)",
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
            camara.position.x = 2000;
            camara.position.z = 3000;
            controles.update();

            // Generamos el terreno

            const geometry = new THREE.PlaneGeometry(
              7500,
              7500,
              anchoMundo - 1,
              profundidadMundo - 1
            );
            geometry.rotateX(-Math.PI / 2);

            const vertices = geometry.attributes.position.array;

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
              geometry,
              new THREE.MeshBasicMaterial({ map: textura })
            );
            escena.add(terreno);

            // Creamos un helper que nos permita girar la cámara mirando siempre al centro

            const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
            geometryHelper.translate(0, 50, 0);
            geometryHelper.rotateX(Math.PI / 2);
            helper = new THREE.Mesh(
              geometryHelper,
              new THREE.MeshNormalMaterial()
            );
            escena.add(helper);

            // Añadimos los listeners de los eventos

            contenedor3d.addEventListener("pointermove", onPointerMove);
            window.addEventListener("resize", onWindowResize);

            // Añadimos la portada al canvas

            contenedorPortada.appendChild(canvasPortada);

            // Generamos la contraportada si se indica en las opciones

            if (contra !== undefined) {
              const imgContra = new Image();
              imgContra.src = URL_BASE + "img/back.png";
              imgContra.onload = function () {
                let contenedorContra = document.querySelector(contra);

                let canvasContra = document.createElement("canvas");
                canvasContra.width = anchoImagen;
                canvasContra.height = altoImagen;

                let ctxContra = canvasContra.getContext("2d");

                ctxContra.drawImage(imgContra, 0, 0);

                let contenedorQR = document.createElement("canvas");

                let tamanoQR = 218;

                new QRious({
                  element: contenedorQR,
                  value: urlSeed,
                  size: tamanoQR,
                  foreground:
                    "rgb(" +
                    colorBase.r +
                    "," +
                    colorBase.g +
                    "," +
                    colorBase.b +
                    ")",
                  background: "#ffffff",
                  level: "L",
                });

                let imgQR = contenedorQR;
                let margenQR = 46;

                // Imprimos el QR en 2 esquinas
                ctxContra.drawImage(
                  imgQR,
                  anchoImagen - tamanoQR - margenQR,
                  margenQR
                );
                ctxContra.drawImage(
                  imgQR,
                  margenQR,
                  altoImagen - tamanoQR - margenQR
                );

                contenedorContra.appendChild(canvasContra);
              };
            }
          }

          function onWindowResize() {
            camara.aspect = anchoImagen / altoImagen;
            camara.updateProjectionMatrix();

            renderer.setSize(anchoImagen, altoImagen);
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
            requestAnimationFrame(animate);

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

            // Toggle rotation bool for meshes that we clicked
            if (intersects.length > 0) {
              helper.position.set(0, 0, 0);
              helper.lookAt(intersects[0].face.normal);

              helper.position.copy(intersects[0].point);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
}
