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

const luminance = (r, g, b) => {
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

          const worldWidth = 800,
            worldDepth = 800,
            worldHalfWidth = worldWidth / 2,
            worldHalfDepth = worldDepth / 2;

          const windowWidth = 1400;
          const windowHeight = 1400;

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
          const generator = new Math.seedrandom(seed);

          const randomColor = () => {
            let color = [];
            color["r"] = generator() * 255;
            color["g"] = generator() * 255;
            color["b"] = generator() * 255;
            return color;
          };

          let searchParams = new URLSearchParams("");
          searchParams.set("seed", seed);

          const forma = generator() * 100;

          console.log("seed", seed);
          console.log("forma", forma);

          let colorBase = randomColor();

          let luminanceBase = luminance(
            colorBase["r"],
            colorBase["g"],
            colorBase["b"]
          );
          const maxLuminance = 0.1;

          while (luminanceBase > maxLuminance) {
            colorBase = randomColor();
            luminanceBase = luminance(
              colorBase["r"],
              colorBase["g"],
              colorBase["b"]
            );
          }

          console.log(
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
            renderer.setSize(windowWidth, windowHeight);

            let posiblesCaracteres = [
              "#@%=*+-:·   ",
              "█▓▒░ ",
              "█▛▚▝ ",
              "╬╠║╗┐- ",
              "●ø•:·  ",
              "✺✹✸✷✶✦· ",
              "⣿⣷⣶⣦⣤⣄⣀⡀  ",
              "█▓▒░⣿⣷⣶⣦⣤⣄⣀⡀ ",
            ];

            let caracteres =
              posiblesCaracteres[
                Math.floor(generator() * posiblesCaracteres.length)
              ];

            // Invertir?
            if (generator() > 0.5) {
              caracteres = caracteres.split("").reverse().join("");
            }

            let canvasPortada = document.createElement("canvas");
            canvasPortada.width = windowWidth;
            canvasPortada.height = windowHeight;

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
            efectoAscii.setSize(windowWidth, windowHeight);

            if (conEfecto) {
              contenedor3d.appendChild(efectoAscii.domElement);
            } else {
              contenedor3d.appendChild(renderer.domElement);
            }

            escena = new THREE.Scene();
            escena.background = new THREE.Color(0xffffff);

            camara = new THREE.PerspectiveCamera(
              30,
              windowWidth / windowHeight,
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

            const data = generateHeight(worldWidth, worldDepth);

            controles.target.y =
              data[worldHalfWidth + worldHalfDepth * worldWidth] + 500;
            camara.position.y = controles.target.y + 10000;
            camara.position.x = 2000;
            camara.position.z = 3000;
            controles.update();

            // Generamos el terreno

            const geometry = new THREE.PlaneGeometry(
              7500,
              7500,
              worldWidth - 1,
              worldDepth - 1
            );
            geometry.rotateX(-Math.PI / 2);

            const vertices = geometry.attributes.position.array;

            for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
              // Este multiplicador hace que las diferencias de altura sean más grandes
              vertices[j + 1] = data[i] * 20;
            }

            textura = new THREE.CanvasTexture(
              generateTexture(data, worldWidth, worldDepth)
            );
            textura.wrapS = THREE.ClampToEdgeWrapping;
            textura.wrapT = THREE.ClampToEdgeWrapping;

            terreno = new THREE.Mesh(
              geometry,
              new THREE.MeshBasicMaterial({ map: textura })
            );
            escena.add(terreno);

            const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
            geometryHelper.translate(0, 50, 0);
            geometryHelper.rotateX(Math.PI / 2);
            helper = new THREE.Mesh(
              geometryHelper,
              new THREE.MeshNormalMaterial()
            );
            escena.add(helper);

            contenedor3d.addEventListener("pointermove", onPointerMove);

            window.addEventListener("resize", onWindowResize);

            const urlSeed = baseUrl + "?" + searchParams.toString();

            console.log(urlSeed);

            contenedorPortada.appendChild(canvasPortada);

            // Generamos la contraportada si se indica en las opciones

            if (contra !== undefined) {
              const imgContra = new Image();
              imgContra.src = URL_BASE + "img/back.png";
              imgContra.onload = function () {
                let contenedorContra = document.querySelector(contra);

                let canvasContra = document.createElement("canvas");
                canvasContra.width = windowWidth;
                canvasContra.height = windowHeight;

                let ctxContra = canvasContra.getContext("2d");

                ctxContra.drawImage(imgContra, 0, 0);

                let contenedorQR = document.createElement("canvas");

                let tamanoQR = 218;

                let qrcode = new QRious({
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
                  windowWidth - tamanoQR - margenQR,
                  margenQR
                );
                ctxContra.drawImage(
                  imgQR,
                  margenQR,
                  windowHeight - tamanoQR - margenQR
                );

                contenedorContra.appendChild(canvasContra);
              };
            }
          }

          function onWindowResize() {
            camara.aspect = windowWidth / windowHeight;
            camara.updateProjectionMatrix();

            renderer.setSize(windowWidth, windowHeight);
          }

          function generateHeight(width, height) {
            const size = width * height,
              radius = width / 6,
              data = new Uint8Array(size),
              perlin = new ImprovedNoise();

            let quality = 1;
            let base = 100;

            for (let j = 0; j < 4; j++) {
              for (let i = 0; i < size; i++) {
                const x = i % width,
                  y = ~~(i / width);

                data[i] += Math.abs(
                  perlin.noise(x / quality, y / quality, forma) * quality * 1.75
                );
              }

              quality *= 5;
            }

            let tamanoAbismo = 60;

            if (conAbismo) {
              for (let i = 0; i < size; i++) {
                const x = i % width,
                  y = ~~(i / width);

                if (
                  x > width / 2 - tamanoAbismo &&
                  x < width / 2 + tamanoAbismo
                ) {
                  // if (x > width / 2 - tamanoAbismo) {
                  data[i] = 0;
                } else {
                  data[i] += base;
                }
              }
            }

            return data;
          }

          function generateTexture(data, width, height) {
            // bake lighting into texture

            let context, image, imageData, shade;

            const vector3 = new THREE.Vector3(0, 0, 0);

            const sun = new THREE.Vector3(1, 1, 10);
            sun.normalize();

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            context = canvas.getContext("2d");
            context.fillStyle = "#000";
            context.fillRect(0, 0, width, height);

            image = context.getImageData(0, 0, canvas.width, canvas.height);
            imageData = image.data;

            for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
              vector3.x = data[j - 2] - data[j + 2];
              vector3.y = 2;
              vector3.z = data[j - width * 2] - data[j + width * 2];
              vector3.normalize();

              shade = vector3.dot(sun);

              imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
              imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
              imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
            }

            context.putImageData(image, 0, 0);

            // Scaled 4x

            const canvasScaled = document.createElement("canvas");
            canvasScaled.width = width * 4;
            canvasScaled.height = height * 4;

            context = canvasScaled.getContext("2d");
            context.scale(4, 4);
            context.drawImage(canvas, 0, 0);

            image = context.getImageData(
              0,
              0,
              canvasScaled.width,
              canvasScaled.height
            );
            imageData = image.data;

            for (let i = 0, l = imageData.length; i < l; i += 4) {
              const v = ~~(generator() * 5);

              imageData[i] += v;
              imageData[i + 1] += v;
              imageData[i + 2] += v;
            }

            context.putImageData(image, 0, 0);

            return canvasScaled;
          }

          //

          function animate() {
            requestAnimationFrame(animate);

            render();
            if (conMovimiento) {
              controles.update();
            }
          }

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
