<?php require('../_cabecera.php'); ?>

<script src="/vendor/bower-asset/jquery.countdown/dist/jquery.countdown.min.js"></script>
<script>
  $(function() {
    $('.js-cuentaAtras').countdown("2017/11/28 12:00:00", function(event) {
      $(this).text(
        event.strftime('%D días y %H:%M:%S horas')
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
      3 años después del <a href="/torpe">Torpe</a>, <a href="https://discosdekirlian.com/">Discos de Kirlian</a> publicará la segunda pieza del puzzle, el EP Vago, el 28 de noviembre de 2017. 
    </p>    

    <p>
      Estad atentas y atentos a esta web porque solo quedan <br>
      <b><span class="js-cuentaAtras"></span></b>.
    </p>

    <p>
      Una serie de experimentos acompañarán al disco. Se trata de jugar
      con la aleatoriedad y las posibilidades tecnológicas de la web.
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
