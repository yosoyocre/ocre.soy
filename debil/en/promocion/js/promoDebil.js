import * as THREE from "../../../js/three.module.js";

import { AsciiEffectDebil } from "../../diseno/js/AsciiEffectDebil.js";

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
 * @param   {Object}  opciones                           Opciones para crear la portada y contraportada
 * @param   {string}  opciones.imagen                    Selector CSS que especifica el elemento donde se creará la imagen
 * @param   {array}   opciones.caracteresElegidos        Array con los índices de los caracteres a utilizar
 * @param   {Object}  opciones.color                     Objeto con el color del diseño en formato rgb, indexado por r, g y b
 * @param   {boolean} opciones.conColorEnNegativo        Si se debe pintar la portada en negativo o no
 * @param   {boolean} opciones.conEfecto                 Si se debe usar el efecto ASCII o no
 * @param   {Object}  opciones.ancho                     Ancho de la imagen en píxeles
 * @param   {Object}  opciones.alto                      Alto de la imagen en píxeles
 * @returns {void}
 * @public
 */
export function crea(opciones) {
  const DOMINIO_ACTUAL = window.location.origin;
  const URL_BASE = DOMINIO_ACTUAL + "/debil/en/diseno/";

  let renderer;
  let efectoAscii;
  let detenido = false;
  let contenedorImagen;

  let imagen = opciones.imagen;
  let contenedorFinal = document.querySelector(imagen);

  contenedorFinal.innerHTML = "<p>Generando imagen...</p>";

  var foto = new Image();
  foto.onload = function () {
    // Cargamos los scripts necesarios
    // TODO Igual esto no lo tenemos que cargar en cada llamada. Podemos tener una variable modulosCargados
    loadScript(URL_BASE + "node_modules/seedrandom/seedrandom.min.js")
      .then((data) => {
        let caracteresElegidos =
          opciones.caracteresElegidos !== undefined
            ? opciones.caracteresElegidos
            : [];
        let conColorEnNegativo = opciones.conColorEnNegativo;
        let conEfecto =
          opciones.conEfecto !== undefined ? opciones.conEfecto : true;

        let contenedor3d;

        let camara, controles, escena;

        const anchoImagen = opciones.ancho ? opciones.ancho : 1400;
        const altoImagen = opciones.alto ? opciones.alto : 933;

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

        const forma = generador() * 100;

        console.log("seed", seed);
        console.log("forma", forma);

        let colorBase;
        let luminanceBase;

        if (opciones.color !== undefined) {
          colorBase = opciones.color;
        } else {
          colorBase = colorAleatorio();

          luminanceBase = luminosidad(
            colorBase["r"],
            colorBase["g"],
            colorBase["b"]
          );
          const maxLuminance = 0.1;

          // El color debe tener una liminosidad menor que maxLuminance
          // para tener coherencia con el diseño del disco
          // TODO Podríamos llevar esta función a su propio módulo, utils.js, y que lo usasen tanto debil.js como esta
          while (luminanceBase > maxLuminance) {
            colorBase = colorAleatorio();
            luminanceBase = luminosidad(
              colorBase["r"],
              colorBase["g"],
              colorBase["b"]
            );
          }
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

        init();
        animate();

        function init() {
          contenedorImagen = document.createElement("div");
          contenedor3d = document.createElement("div");
          contenedor3d.innerHTML = "";

          renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.setSize(anchoImagen, altoImagen);

          // Las posibles cadenas de caracteres que se usarán para el efecto ASCII
          // TODO Llevar la elección de posibles caracteres a AsciiEffectDebil.js, tanto aquí como en debil.js
          let posiblesCaracteres = [
            "#@%=*+-:·  ",
            "██⣿⣿  ",
            "█▛▚▝ ",
            "╬╠║╗┐- ",
            "●ø•:· ",
            "✺✹✸✷✶✦· ",
            "⣿⣷⣶⣦⣤⣄⣀⡀  ",
          ];

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

          let canvasImagen = document.createElement("canvas");
          canvasImagen.width = anchoImagen;
          canvasImagen.height = altoImagen;

          // Creamos el efecto ASCII
          efectoAscii = new AsciiEffectDebil(
            URL_BASE,
            canvasImagen,
            renderer,
            colorBase,
            caracteres,
            {
              resolution: 0.1,
              scale: 1,
              color: "rgb(0,255,0)",
              conTextoPortada: false,
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

          /*
           * Pintamos la imagen en el canvas para aplicarle el efecto ASCII
           */

          var campoDeVision = 67;
          var ratioAspectoCamara = anchoImagen / altoImagen;
          // Especificamos los límites del plano de recorte. Solo se
          // renderizarán objetos entre estos planos en la escena
          var inicioPlano = 0.1;
          var finPlano = 1000;

          camara = new THREE.PerspectiveCamera(
            campoDeVision,
            ratioAspectoCamara,
            inicioPlano,
            finPlano
          );
          camara.position.z = 5;

          // Creamos el cargador de texturas para cargar la imagen
          // TODO Si luego vamos a cargar esta misma imagen sin efecto, igual podríamos cargarla una vez
          var cargadorImagenes = new THREE.TextureLoader();

          // Cargamos la imagen en un material personalizado
          var materialImagen = new THREE.MeshLambertMaterial({
            map: cargadorImagenes.load(
              "/debil/en/promocion/img/foto_byn_sombra.png"
            ),
            transparent: true,
          });

          // Creamos un plano para la imagen con un ancho de 10
          // y un alto que preserva la relación de aspecto de la imagen
          var geometriaImagen = new THREE.PlaneGeometry(
            10,
            (10 * altoImagen) / anchoImagen
          );

          // Combinamos la geometría de la imagen y el material en un mesh
          var meshImagen = new THREE.Mesh(geometriaImagen, materialImagen);
          meshImagen.position.set(0, 0, 0);
          escena.add(meshImagen);

          /**
           * Luces para visualizar la imagen
           **/

          var light = new THREE.PointLight(0xffffff, 1, 0);
          light.position.set(1, 1, 100);
          escena.add(light);

          if (conEfecto) {
            contenedorImagen.appendChild(canvasImagen);
          } else {
            contenedorImagen.appendChild(renderer.domElement);
          }
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
      })
      .catch((err) => {
        console.error(err);
      });

    let borrables = [renderer, efectoAscii];

    setTimeout(function () {
      let ancho = 1400;
      let alto = 933;

      let canvasAscii = contenedorImagen.querySelector("canvas");

      let imagenPromocional = document.createElement("canvas");
      imagenPromocional.width = ancho;
      imagenPromocional.height = alto;
      let imagenCtx = imagenPromocional.getContext("2d");

      // Usamos un canvas auxiliar para un trozo de la foto sin efecto
      let canvasAux = document.createElement("canvas");
      canvasAux.width = ancho;
      canvasAux.height = alto;
      let ctxAux = canvasAux.getContext("2d");

      // Dibujamos la foto en el canvas auxiliar
      ctxAux.drawImage(foto, 0, 0, ancho, alto);

      // Recortamos un polígono aleatorio
      ctxAux.save();
      ctxAux.globalCompositeOperation = "destination-out";
      ctxAux.beginPath();
      ctxAux.moveTo(0, 0);
      let coordenada1 = 200 + Math.random() * (ancho - 400);
      ctxAux.lineTo(coordenada1, 0);
      let coordenada2 = 200 + Math.random() * (ancho - 400);
      ctxAux.lineTo(coordenada2, alto);
      ctxAux.lineTo(0, alto);
      ctxAux.closePath();
      ctxAux.fill();
      ctxAux.restore();

      // Dibujamos una línea justo en el borde
      let tamanoLinea = 15;
      ctxAux.fillStyle = "#fff";
      ctxAux.beginPath();
      ctxAux.moveTo(coordenada1, 0);
      ctxAux.lineTo(coordenada1 - tamanoLinea, 0);
      ctxAux.lineTo(coordenada2 - tamanoLinea, alto);
      ctxAux.lineTo(coordenada2, alto);
      ctxAux.closePath();
      ctxAux.fill();

      // Dibujamos la imagen con el efecto ASCII en la imagen final
      imagenCtx.drawImage(canvasAscii, 0, 0, ancho, alto);
      // Dibujamos por encima la imagen sin el efecto ASCII recortada
      imagenCtx.drawImage(ctxAux.canvas, 0, 0, ancho, alto);

      console.log("Añadiendo imagen promocional");
      contenedorFinal.innerHTML = "";
      contenedorFinal.appendChild(imagenPromocional);

      detenido = true;
    }, 2000);

    return function () {
      borrables.forEach((e) => {
        if (e !== undefined) {
          e.dispose();
        }
      });
      detenido = true;
    };
  };

  foto.src = "/debil/en/promocion/img/foto_byn_sombra.png";
}
