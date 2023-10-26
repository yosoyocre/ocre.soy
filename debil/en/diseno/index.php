<?php require('../../../_cabecera.php'); ?>

<style>
  .portada canvas {
    width: 100% !important;
    height: auto !important;
  }
</style>

<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/debil">débil</a>
      <span class="separador">/</span> <a href="/debil/en">en</a>
      <span class="separador">/</span> <a href="/debil/en/diseno">diseño</a>
    </h1>
    <p>
      <i>Estuve en el abismo y me acordé de ti</i>
    </p>
    <p>
      Siguiendo la tradición marcada por los discos anteriores, la portada y la contraportada del <a href="/debil">Débil</a>
      también las crea tu ordenador.
    </p>
    <p>
      Esta vez cada disco será como una postal enviada desde el mismísimo abismo (es decir, el abismismísimo). Y al acceder al QR de la contraportada se podrá ver esa misma imagen en movimiento.
    </p>
    <p>
      Por ejemplo, aquí tienes unos diseños que se acaban de generar. <br>
      Haz click sobre la imagen para descargártela o pulsa <a class="js-nuevoDiseno" href="/debil/en/diseno">aquí</a> para producir otras.
    </p>
  </div>
</div>
<div class="row">
  <div class="col-lg-6">
    <a class="sin-hover js-portada-descargar" href="#">
      <div class="portada" id="portada"></div>
    </a>
  </div>

  <div class="col-lg-6">
    <a class="sin-hover js-contra-descargar" href="#">
      <div class="portada" id="contra"></div>
    </a>
  </div>
</div>

<div class="row">
  <div class="col-lg-8">
    <p>
      De esta forma, cualquiera puede descargarse una portada del Débil, imprimírsela
      y fabricar una edición de la que no habrá otra copia.
    </p>
  </div>
</div>

<div class="ficha">
  <div class="row">
    <div class="col-lg-12">
      <h3>Colofón</h3>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-4">
      Código fuente
      <span class="dato"><a href="https://github.com/yosoyocre/ocre.soy/blob/master/debil/en/diseno/js/debil.js">Github</a></span>
    </div>

    <div class="col-lg-4">
      Lenguajes de programación
      <span class="dato">HTML, CSS y JavaScript</span>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-4">
      Librerías
      <span class="dato"><a href="https://threejs.org/">three.js</a></span>
      <span class="dato"><a href="https://github.com/davidbau/seedrandom">seedrandom.js</a></span>
      <span class="dato"><a href="https://github.com/neocotic/qrious">QRious</a></span>
    </div>
    <div class="col-lg-4">
      Inspiración
      <span class="dato"><a href="https://threejs.org/examples/webgl_effects_ascii.html">Efecto ASCII</a></span>
      <span class="dato"><a href="https://threejs.org/examples/#webgl_geometry_terrain_raycast">Terreno</a></span>
    </div>
  </div>
</div>


<script type="module">
  import {
    crea
  } from "./js/debil.js";

  let borrar;

  function generaPortadaYContra() {
    document.getElementById("portada").innerHTML = "";
    document.getElementById("contra").innerHTML = "";

    if (borrar !== undefined) {
      borrar();
    }

    borrar = crea({
      portada: "#portada",
      contra: "#contra",
      // color: {
      //   r: 58,
      //   g: 138,
      //   b: 201
      // },
      // conTextoPortada: false,
      // conMovimiento: false,
      // conAbismoCircular: false,
      // caracteresElegidos: [2],
      // conColorEnNegativo: true,
      // conPosicionInicialRandom: true
    });
  }

  document.querySelector(".js-nuevoDiseno").addEventListener("click", function(e) {
    e.preventDefault();

    generaPortadaYContra();
  });

  document.querySelector('.js-portada-descargar').addEventListener("click", function(e) {
    e.preventDefault();

    var link = document.createElement("a");
    link.download = 'ocre-debil_portada.png';
    link.href = this.querySelector('canvas').toDataURL("image/png");
    link.click();
  });

  document.querySelector('.js-contra-descargar').addEventListener("click", function(e) {
    e.preventDefault();

    var link = document.createElement("a");
    link.download = 'ocre-debil_contra.png';
    link.href = this.querySelector('canvas').toDataURL("image/png");
    link.click();
  });

  generaPortadaYContra();
</script>
<?php require('../../../_pie.php'); ?>