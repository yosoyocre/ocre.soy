import * as THREE from "./three.module.js";

import { AsciiEffectDebil } from "./AsciiEffectDebil.js";
import { OrbitControls } from "./OrbitControls.js";
import { ImprovedNoise } from "./ImprovedNoise.js";
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

const fecha = (date) => {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  return (
    "el " +
    pad(date.getDate()) +
    "/" +
    pad(date.getMonth() + 1) +
    "/" +
    pad(date.getFullYear()) +
    " a las " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
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
 * @param   {Object}  opciones.objeto                    Objeto a cargar en lugar del terreno
 * @param   {string}  opciones.objeto.path               Path del archivo glTF (.glb) a cargar
 * @param   {int}     opciones.objeto.tamano             Tamaño del objeto
 * @param   {boolean} opciones.objeto.posicionZ          Posición Z de la cámara
 * @returns {void}
 * @public
 */
export function crea(opciones) {
  const DOMINIO_ACTUAL = window.location.origin;
  const URL_BASE = DOMINIO_ACTUAL + "/debil/en/diseno/";

  let renderer;
  let efectoAscii;
  let detenido = false;

  // Cargamos los scripts necesarios
  // TODO Igual esto no lo tenemos que cargar en cada llamada. Podemos tener una variable modulosCargados
  loadScript(URL_BASE + "node_modules/seedrandom/seedrandom.min.js")
    .then((data) => {
      let proceso = Math.random();
      let portada = opciones.portada;
      let contra = opciones.contra;
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
      let conTextoPortada =
        opciones.conTextoPortada !== undefined
          ? opciones.conTextoPortada
          : true;
      let conColorEnNegativo = opciones.conColorEnNegativo;
      let conEfecto =
        opciones.conEfecto !== undefined ? opciones.conEfecto : true;

      let contenedor3d, contenedorPortada;

      let camara, controles, escena;

      const anchoImagen = opciones.ancho ? opciones.ancho : 1400;
      const altoImagen = anchoImagen * 0.48;
      //   const altoImagen = opciones.alto ? opciones.alto : 1400;

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
        // para que el texto en gris tenga contraste sufienciente
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
        contenedorPortada = document.querySelector(portada);
        contenedor3d = document.createElement("div");
        contenedor3d.innerHTML = "";

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(anchoImagen, altoImagen);

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

        // Specify the portion of the scene visiable at any time (in degrees)
        var fieldOfView = 75;

        // Specify the camera's aspect ratio
        var aspectRatio = window.innerWidth / window.innerHeight;

        // Specify the near and far clipping planes. Only objects
        // between those planes will be rendered in the scene
        // (these values help control the number of items rendered
        // at any given time)
        var nearPlane = 0.1;
        var farPlane = 1000;

        // Use the values specified above to create a camera
        camara = new THREE.PerspectiveCamera(
          fieldOfView,
          aspectRatio,
          nearPlane,
          farPlane
        );

        // Finally, set the camera's position in the z-dimension
        camara.position.z = 5;

        // console.log("Cargando imagen");
        // let loader = new THREE.TextureLoader();

        // // Load an image file into a custom material
        // let imagenMaterial = new THREE.MeshLambertMaterial({
        //   map: loader.load("/debil/en/promocion/eduvulnerable2.png"),
        //   transparent: true,
        //   // opacity: 0.5,
        //   // color: 0xffffff,
        // });

        // // create a plane geometry for the image with a width of 10
        // // and a height that preserves the image's aspect ratio
        // let tamanoImagen = 2500;
        // let imagenGeometry = new THREE.PlaneGeometry(
        //   tamanoImagen,
        //   tamanoImagen * 0.75
        // );

        // // combine our image geometry and material into a mesh
        // let imagenMesh = new THREE.Mesh(imagenGeometry, imagenMaterial);

        // // set the position of the image mesh in the x,y,z dimensions
        // imagenMesh.position.set(1200, 6000, 1600);

        // // add the image to the scene
        // escena.add(imagenMesh);

        // var imageLight = new THREE.PointLight(0xffffff, 1, 0);

        // let luzX = 1;
        // let luzY = 9000;
        // let luzZ = 100;

        // // Specify the light's position
        // imageLight.position.set(luzX, luzY, luzZ);
        // // imageLight.rotateX(-20);

        // // Add the light to the scene
        // escena.add(imageLight);

        /**
         * Image
         **/

        // Create a texture loader so we can load our image file
        var loader = new THREE.TextureLoader();

        // Load an image file into a custom material
        var material = new THREE.MeshLambertMaterial({
          map: loader.load(
            // "https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg"
            "/debil/en/promocion/foto_byn_sombra.png"
          ),
          transparent: true,
        });

        // create a plane geometry for the image with a width of 10
        // and a height that preserves the image's aspect ratio
        var geometry = new THREE.PlaneGeometry(10, 10 * 0.75);

        // combine our image geometry and material into a mesh
        var mesh = new THREE.Mesh(geometry, material);

        // set the position of the image mesh in the x,y,z dimensions
        mesh.position.set(0, 0, 0);

        // add the image to the scene
        escena.add(mesh);

        /**
         * Lights
         **/

        // Add a point light with #fff color, .7 intensity, and 0 distance
        var light = new THREE.PointLight(0xffffff, 1, 0);

        // Specify the light's position
        light.position.set(1, 1, 100);

        // Add the light to the scene
        escena.add(light);

        // const boxGeometry = new THREE.BoxGeometry(100, 100, 100);

        // const boxObject = new THREE.Mesh(
        //   boxGeometry,
        //   new THREE.MeshLambertMaterial({
        //     color: 0xff0000,
        //   })
        // );

        // boxObject.position.x = luzX;
        // boxObject.position.y = luzY;
        // boxObject.position.z = luzZ;

        // escena.add(boxObject);

        // Hacemos que la cámara gire alrededor del abismo

        if (conEfecto) {
          contenedorPortada.appendChild(canvasPortada);
        } else {
          contenedorPortada.appendChild(renderer.domElement);
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
    })
    .catch((err) => {
      console.error(err);
    });

  let borrables = [renderer, efectoAscii];

  return function () {
    borrables.forEach((e) => {
      if (e !== undefined) {
        e.dispose();
      }
    });
    detenido = true;
  };
}

// console.log("Cargando imagen");
// let loader = new THREE.TextureLoader();

// // Load an image file into a custom material
// let imagenMaterial = new THREE.MeshLambertMaterial({
//     map: loader.load("/debil/en/promocion/eduvulnerable2.png"),
//     transparent: true,
//     // opacity: 0.5,
//     // color: 0xffffff,
// });

// // create a plane geometry for the image with a width of 10
// // and a height that preserves the image's aspect ratio
// let tamanoImagen = 2500;
// let imagenGeometry = new THREE.PlaneGeometry(
//     tamanoImagen,
//     tamanoImagen * 0.75
// );
// // geometriaHelper.translate(0, 50, 0);
// // imagenGeometry.rotateX(Math.PI / -2);
// // imagenGeometry.rotateY(Math.PI / 8);

// // combine our image geometry and material into a mesh
// let imagenMesh = new THREE.Mesh(imagenGeometry, imagenMaterial);

// // set the position of the image mesh in the x,y,z dimensions
// imagenMesh.position.set(1200, 6000, 1600);

// // add the image to the scene
// escena.add(imagenMesh);

// var imageLight = new THREE.PointLight(0xffffff, 1, 0);

// let luzX = 1;
// let luzY = 9000;
// let luzZ = 100;

// // Specify the light's position
// imageLight.position.set(luzX, luzY, luzZ);
// // imageLight.rotateX(-20);

// // Add the light to the scene
// escena.add(imageLight);

// const boxGeometry = new THREE.BoxGeometry(100, 100, 100);

// const boxObject = new THREE.Mesh(
//     boxGeometry,
//     new THREE.MeshLambertMaterial({
//     color: 0xff0000,
//     })
// );

// boxObject.position.x = luzX;
// boxObject.position.y = luzY;
// boxObject.position.z = luzZ;

// // escena.add(boxObject);
