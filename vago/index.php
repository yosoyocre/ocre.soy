<?php require('../_cabecera.php'); ?>

<script src="/vendor/bower-asset/jquery.countdown/dist/jquery.countdown.min.js"></script>
<script>
  $(function() {
    $('.js-cuentaAtras').countdown("2017/11/28 12:00:00", function(event) {
      $(this).text(
        event.strftime('%-D días, %-H horas, %-M minutos y %-S segundos')
      );
    });
  });
</script>

<div class="row">
  <div class="col-lg-8">

    <h1>
      <span class="separador">/</span> <a href="/vago">vago</a>
    </h1>

    <p>
      3 años después del <a href="/torpe">Torpe</a>, <a href="https://discosdekirlian.com/">Discos de Kirlian</a> publicó la segunda pieza del puzzle, el EP Vago, el 28 de noviembre de 2017. 
    </p>    

    <p>
      El disco lo forman 6 canciones de pop electrónico en las que canto al fracaso, a la rabia y a la nostalgia. 
    </p>

    <p>
      Puedes escucharlo aquí o en el <a href="https://discosdekirlian.bandcamp.com/album/dk55-vago">el bandcamp de DK</a>.
    </p>

  </div>
</div>

<div class="row">
  <div class="col-lg-6">
    <img class="img-fluid" src="https://f4.bcbits.com/img/a1484615383_10.jpg" alt="Portada de Vago en Bandcamp" />
  </div>
  <div class="col-lg-6">
    <iframe style="border: 0; width: 100%; height: 340px;" src="https://bandcamp.com/EmbeddedPlayer/album=3362568844/size=large/bgcol=ffffff/linkcol=0687f5/artwork=none/transparent=true/" seamless></iframe>
  </div>
</div>

<div class="ficha">
  <div class="row">
    <div class="col-lg-12">
      <h3>Créditos</h3>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-4">
      Grabación, producción y masterización
      <span class="dato"><a href="http://www.8estudios.com/">Jahel Piñeiro</a></span>
    </div>

    <div class="col-lg-4">
      Asistencia técnica
      <span class="dato">Córdulo David Merino y Leti Gordo</span>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-4">
      Letra de "Egoísmo"
      <span class="dato">Xoansinho Daviña</span>
    </div>
  
    <div class="col-lg-4">
      Letra de "La fatiga de los materiales"
      <span class="dato">Bita Barbadillo</span>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-4">
      Letra de "Toda la ciudad ardiendo"
      <span class="dato">Quintana Carter</span>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-lg-8">
    <p>
      Una serie de experimentos acompañan al disco. 
      Se trata de jugar con la aleatoriedad y las posibilidades tecnológicas de la web.
      Todo el código desarrollado es abierto y puede
      ser consultado, descargado y modificado sin ninguna limitación.
    </p>
  </div>
</div>


<div class="ficha">
  <div class="row">
    <div class="col-lg-12">
      <h3>Experimentos web</h3>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-4">
      Generador de portadas
      <span class="dato">
        <a href="/vago/en/diseno">
          <span class="separador">/</span> vago
          <span class="separador">/</span> en
          <span class="separador">/</span> diseño
        </a>
      </span>
    </div>
    <div class="col-lg-4">
      Semitonos en cámara web
      <span class="dato">
        <a href="/vago/en/punto">
          <span class="separador">/</span> vago
          <span class="separador">/</span> en
          <span class="separador">/</span> punto
        </a>
      </span>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-4">
      Generador del videoclips
      <span class="dato">
        <a href="/vago/en/adelante">
          <span class="separador">/</span> vago
          <span class="separador">/</span> en
          <span class="separador">/</span> adelante
        </a>
      </span>
    </div>
  </div>
</div>

<?php require('../_pie.php'); ?>
