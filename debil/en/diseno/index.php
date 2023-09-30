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
      Siguiendo la tradición marcada por los discos anteriores, la portada y la contraportada del <a href="/debil">Débil</a>
      también las crea tu ordenador.
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
      // conTextoPortada: false
      // conMovimiento: false,
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