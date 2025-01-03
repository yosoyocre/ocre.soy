import * as THREE from "../../../../js/three.module.js";

import { AsciiEffectProyeccionDebil } from "./AsciiEffectProyeccionDebil.js";
import { OrbitControls } from "../../../../js/OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";

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

  let renderer;
  let geometria;
  let textura;
  let geometriaHelper;
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

      const anchoMundo = 800,
        profundidadMundo = 800;

      const anchoImagen = opciones.ancho ? opciones.ancho : 1400;
      const altoImagen = opciones.alto ? opciones.alto : 782;

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
        const maxLuminance = 0.1;

        // El color debe tener una liminosidad menor que maxLuminance
        // para que el texto en gris tenga contraste sufienciente
        while (luminanceBase > maxLuminance) {
          color = colorAleatorio();
          luminanceBase = luminosidad(color["r"], color["g"], color["b"]);
        }

        return color;
      };

      const forma = generador() * 100;

      console.log("seed", seed);
      console.log("forma", forma);

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

        let canvasProyector = document.createElement("canvas");
        canvasProyector.width = anchoImagen;
        canvasProyector.height = altoImagen;

        if (conColorEnNegativo === undefined) {
          conColorEnNegativo = generador() > 0.5;
        }

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
            invert: conColorEnNegativo,
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

        // Generamos el terreno

        geometria = new THREE.PlaneGeometry(
          7500,
          7500,
          anchoMundo - 1,
          profundidadMundo - 1
        );
        geometria.rotateX(-Math.PI / 2);

        modelos.forEach((path) => {
          import(path).then((modelo) => {
            const objeto = modelo.default;
            const loader = new GLTFLoader();
            loader.load(objeto.path, function (gltf) {
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

        // const ambientLight = new THREE.AmbientLight(0xcccccc);
        // ambientLight.name = "AmbientLight";
        // escena.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.target.position.set(0, 10, -1);
        dirLight.add(dirLight.target);
        dirLight.lookAt(-1, -10, 0);
        dirLight.name = "DirectionalLight";
        escena.add(dirLight);

        // Creamos un helper que nos permita girar la cámara mirando siempre al centro

        geometriaHelper = new THREE.ConeGeometry(20, 100, 3);
        geometriaHelper.translate(0, 50, 0);
        geometriaHelper.rotateX(Math.PI / 2);

        // Añadimos los listeners de los eventos

        contenedor3d.addEventListener("pointermove", onPointerMove);
        window.addEventListener("resize", onWindowResize);

        // Añadimos la proyección al canvas

        if (conEfecto) {
          contenedorProyector.appendChild(canvasProyector);
        } else {
          contenedorProyector.appendChild(renderer.domElement);
        }
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
        modeloMostrado = modelosCargados[Math.floor(Math.random() * nModelos)];

        // Variamos su escala entre 0.5 y 2
        if (conVariacionTamano) {
          let variacionEscala = Math.random() * 1.5 + 0.5;
          modeloMostrado.scale.setScalar(
            modeloMostrado.scale.x * variacionEscala
          );
        }

        escena.add(modeloMostrado);

        efectoAscii.colorBaseGlobal = colorAleatorioConContraste();
        efectoAscii.invert = generador() > 0.5;
        efectoAscii.caracteres =
          posiblesCaracteres[
            Math.floor(generador() * posiblesCaracteres.length)
          ];

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

  let borrables = [renderer, geometria, textura, geometriaHelper, efectoAscii];

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
