<?php
  $ocultaNav = true;
  require('_cabecera.php');
?>

<script type="text/javascript" src="torpe/en/diseno/js/torpe.js"></script>
<script type="text/javascript">
  $(function() {
    var i;
    var $contenido = $('.js-contenido');
    var $fila = $('.js-al-infinito');
    var $modelo = $fila.clone();
    var $clon;

    function vuelveTorpe($fila) {
      var torpe = new Torpe({
        width: 110,
        height: 110,
        elementSize: 90,
        margin: 10,
        thickLineWidth: 2,
        border: 0
      });
      var $imagenTorpe;

      torpe.draw();

      $imagenTorpe = $('<img class="sin-sombra img-fluid">');
      $imagenTorpe
        .attr('src', torpe.getImageDataURI());

      $($fila.find('.js-icono').get(Math.floor(Math.random() * 4))).append($imagenTorpe);
    }

    function mas50() {
      var $filas;
      for (i = 0; i < 50; i++) {
        $clon = $modelo.clone();
        $filas = $clon.find('.row');
        vuelveTorpe($($filas.get(0)));
        vuelveTorpe($($filas.get(1)));
        $contenido.append($clon);
      }
    }

    vuelveTorpe($fila);
    mas50();

    $(window).scroll(function() {
      if(($(window).scrollTop() + window.innerWidth) > ($(document).height() - 100)) {
           mas50();
      }
    });
  });
</script>

<div style="margin-top:50px" class="js-contenido">
  <div class="js-al-infinito">
    <div class="row">
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-4">
        <p>
          Hola, yo soy Ocre, <br>
          un músico-informático <br>
          un poco <a href="/torpe"><span class="separador">/</span> torpe</a>
        </p>
      </div>
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-2 js-icono"></div>
    </div>
    <div class="row">
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-4">
        <p>
          Hola, yo soy Ocre, <br>
          un músico-informático <br>
          un poco <a href="/vago"><span class="separador">/</span> vago</a>
        </p>
      </div>
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-2 js-icono"></div>
    </div>
    <div class="row">
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-4">
        <p>
          Hola, yo soy Ocre, <br>
          un músico-informático <br>
          un poco <a href="/sucio"><span class="separador">/</span> sucio</a>
        </p>
      </div>
      <div class="col-lg-2 js-icono"></div>
      <div class="col-lg-2 js-icono"></div>
    </div>
  </div>
</div>

<?php require('_pie.php'); ?>
