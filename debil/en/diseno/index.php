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
      Siguiendo la tradición marcada por los discos anteriores, la portada del <a href="/debil">Débil</a>
      también la crea tu ordenador.
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
  crea({
    portada: "#portada",
    contra: "#contra",
    // conMovimiento: false,
  });
</script>
<?php require('../../../_pie.php'); ?>