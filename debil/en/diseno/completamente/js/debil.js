import * as THREE from "./three.module.js";

import Stats from "./stats.module.js";

import { AsciiEffectDebil } from "./AsciiEffectDebil.js";
import { OrbitControls } from "./OrbitControls.js";
import { ImprovedNoise } from "./ImprovedNoise.js";

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

export function creaPortada(opciones) {
  loadScript("node_modules/seedrandom/seedrandom.min.js")
    .then((data) => {
      loadScript("node_modules/qrcodejs/qrcode.min.js")
        .then((data) => {
          let portada = opciones.portada;
          let contra = opciones.contra;
          let conMovimiento =
            opciones.conMovimiento !== undefined
              ? opciones.conMovimiento
              : true;

          let container, globalContainer, stats;

          let camera, controls, scene, renderer, effect;

          let mesh, texture;

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

          let searchParams = new URLSearchParams("");
          searchParams.set("seed", seed);

          const forma = generator() * 100;

          console.log("seed", seed);
          console.log("forma", forma);

          function luminance(r, g, b) {
            var a = [r, g, b].map(function (v) {
              v /= 255;
              return v <= 0.03928
                ? v / 12.92
                : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
          }

          function randomColor() {
            let color = [];
            color["r"] = generator() * 255;
            color["g"] = generator() * 255;
            color["b"] = generator() * 255;
            return color;
          }

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
            globalContainer = document.querySelector(portada);
            container = document.createElement("div");
            container.innerHTML = "";

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(windowWidth, windowHeight);
            // container.appendChild(renderer.domElement);

            // Sacar de https://theasciicode.com.ar/extended-ascii-code/black-square-ascii-code-254.html
            // y https://en.wikipedia.org/wiki/List_of_Unicode_characters

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

            // caracteres = "↯⇊⇩⇓⇟↡↧↓⇂⇣ "; // negativo
            // caracteres = "▣▩▦▨▥◫▢ "; // negativo
            // caracteres = "😠💪 "; // negativo
            // caracteres = "܁܃܀܊܍  ";
            // caracteres = "௵௸ௐ௯௨௦ ";

            // Invertir
            if (generator() > 0.5) {
              caracteres = caracteres.split("").reverse().join("");
            }

            // let caracteres = ".'`^,:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"; // positivo largo
            // let caracteres = ".'`^,:;!~+_-?][}{)(|/rcOe*#&%@$"; // positivo
            // let caracteres = " ON"; // positivo
            // let caracteres = "eOcr "; // negativo

            let debilCanvas = document.createElement("canvas");
            debilCanvas.width = 1400;
            debilCanvas.height = 1400;

            effect = new AsciiEffectDebil(
              debilCanvas,
              renderer,
              colorBase,
              caracteres,
              {
                resolution: 0.1,
                scale: 1,
                color: "rgb(0,255,0)",
              }
            );
            effect.setSize(windowWidth, windowHeight);

            if (conEfecto) {
              container.appendChild(effect.domElement);
            } else {
              container.appendChild(renderer.domElement);
            }

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);

            camera = new THREE.PerspectiveCamera(
              30,
              windowWidth / windowHeight,
              10,
              20000
            );

            if (conEfecto) {
              controls = new OrbitControls(camera, effect.domElement);
            } else {
              controls = new OrbitControls(camera, renderer.domElement);
            }
            controls.minDistance = 1000;
            controls.maxDistance = 10000;
            controls.maxPolarAngle = Math.PI / 2;
            controls.autoRotate = true;

            //

            const data = generateHeight(worldWidth, worldDepth);

            controls.target.y =
              data[worldHalfWidth + worldHalfDepth * worldWidth] + 500;
            camera.position.y = controls.target.y + 10000;
            camera.position.x = 2000;
            camera.position.z = 3000;
            controls.update();

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

            //

            texture = new THREE.CanvasTexture(
              generateTexture(data, worldWidth, worldDepth)
            );
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            mesh = new THREE.Mesh(
              geometry,
              new THREE.MeshBasicMaterial({ map: texture })
            );
            scene.add(mesh);

            const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
            geometryHelper.translate(0, 50, 0);
            geometryHelper.rotateX(Math.PI / 2);
            helper = new THREE.Mesh(
              geometryHelper,
              new THREE.MeshNormalMaterial()
            );
            scene.add(helper);

            container.addEventListener("pointermove", onPointerMove);

            stats = new Stats();
            // container.appendChild(stats.dom);

            //

            window.addEventListener("resize", onWindowResize);

            const urlSeed = baseUrl + "?" + searchParams.toString();

            console.log(urlSeed);

            globalContainer.appendChild(debilCanvas);

            // QR

            if (contra !== undefined) {
              let contenedorContra = document.querySelector(contra);

              var qrcode = new QRCode(contenedorContra, {
                text: urlSeed,
                width: 256,
                height: 256,
                colorDark:
                  "rgb(" +
                  colorBase.r +
                  "," +
                  colorBase.g +
                  "," +
                  colorBase.b +
                  ")",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L,
              });
            }
          }

          function onWindowResize() {
            camera.aspect = windowWidth / windowHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(windowWidth, windowHeight);
          }

          function distancia(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
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

            // Creamos un círculo en el centro
            // y al resto de puntos les sumamos una altura base
            // for (let i = 0; i < size; i++) {
            //   const x = i % width,
            //     y = ~~(i / width);

            //   const d = distancia(x, y, width / 2, height / 2);
            //   if (d < radius) {
            //     data[i] = 0;
            //   } else {
            //     data[i] += base;
            //   }
            // }

            // Creamos una línea que atraviese el centro
            // y al resto de puntos les sumamos una altura base

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
            // controls.position.z = controls.position.z + 0.1;
            // controls.update();
            // stats.update();
            if (conMovimiento) {
              controls.update();
            }
          }

          function render() {
            if (conEfecto) {
              effect.render(scene, camera);
            } else {
              renderer.render(scene, camera);
            }
          }

          function onPointerMove(event) {
            pointer.x =
              (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            pointer.y =
              -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);

            // See if the ray from the camera into the world hits one of our meshes
            const intersects = raycaster.intersectObject(mesh);

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
