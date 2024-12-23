<?php require('../../../_cabecera.php'); ?>

<style>
  .portada.pantalla-completa {
    width: 578px;
    position: fixed;
    top: calc(50% - 289px);
    left: calc(50% - 289px);    
    z-index: 100;
  }

  .telon {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 90;
    background: white;
  }
</style>

<script type="text/javascript" src="js/jquery.vago-en-punto.js"></script>
<script type="text/javascript">
$(function() {
  var video = document.querySelector('video');
  var color = true;

  function gumSuccess(stream) {
    window.stream = stream;
    if ('mozSrcObject' in video) {
      video.mozSrcObject = stream;
    } else if (window.webkitURL) {
      video.src = window.webkitURL.createObjectURL(stream);
    } else {
      video.src = stream;
    }
    video.play();
  }

  function gumError(error) {
    console.error('Error on getUserMedia', error);
  }

  function gumInit() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true }, gumSuccess, gumError);
    }
  }

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  $('.js-punto-de-camara').click(function(e) {
    e.preventDefault();

    $('.js-primer-paso').fadeOut(function() {
      $('.js-cargando').fadeIn();
    });

    gumInit();

    video.addEventListener('loadedmetadata', function () {
      $('.js-cargando').hide();
      $('.js-portada').fadeIn();
      $('.js-con-camara').fadeIn();
      draw();
    });

    var $videoVagoEnEsencia = $('.js-portada').vagoenpunto({
      reverse: true
    });
    var videoVagoEnEsencia = $.data($videoVagoEnEsencia.get(0), 'plugin_vagoenpunto');

    function draw() {
        requestAnimFrame(draw);

        if (color) {
          videoVagoEnEsencia.settings.color = videoVagoEnEsencia.getRandomColor();
          color = false;
        }
        videoVagoEnEsencia.draw();
    }
  });

  function sacaFoto() {
    var link = document.createElement("a");

    link.download = 'ocre-vago_en_esencia.png';
    link.href = $('.js-portada').get(0).toDataURL("image/png");
    link.click();
  }

  $('.js-descargar').click(function(e) {
    e.preventDefault();

    sacaFoto();

  });

  $('.js-temporizador').click(function(e) {
    e.preventDefault();

    var tiempo = 3;

    $('.js-tiempo').text(tiempo);
    $('.js-cuenta-atras').css('display', 'inline');

    function cuentaAtras() {
        if (tiempo) {
          $('.js-tiempo').text(tiempo);
          tiempo = tiempo - 1;
          setTimeout(cuentaAtras, 1000);
        } else {

          sacaFoto();

          $('.js-cuenta-atras').fadeOut();
        }
    }

    cuentaAtras();

  });

  $('.js-cambiar-color').click(function (e) {
      e.preventDefault();

      color = true;
  });

  function modoPantallaCompleta() {
    $('.js-portada').toggleClass('pantalla-completa');
    $('.js-telon').toggle();
  }

  $('.js-pantalla-completa').click(function (e) {
      e.preventDefault();

      modoPantallaCompleta();

      setTimeout(function() {
        $('html').one('click', function() {
          modoPantallaCompleta();
        });
      }, 1000);
  }); 
});
</script>

<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/vago">vago</a>
      <span class="separador">/</span> <a href="/vago/en">en</a>
      <span class="separador">/</span> <a href="/vago/en/punto">punto</a>
    </h1>
    <p>
      Este es el primero de una serie de experimentos que transforman el entorno
      digital en una colección de puntos de colores.
    </p>
    <p>
      Mediante una <a href="https://es.wikipedia.org/wiki/Semitonos_(inform%C3%A1tica)">técnica</a>
      similar a la de impresión de imágenes en periódicos antiguos,
      el algoritmo convierte el vídeo capturado por la cámara web
      del usuario en círculos de diferentes tamaños.
    </p>
    <p>
      Si quieres probarlo, sigue estos pasos:
    </p>
  </div>
</div>

<div class="row">
  <div class="col-lg-6">
    <div class="ficha">
        <div class="row js-primer-paso">
          <div class="col-lg-12">
              <button type="button" class="btn btn-primary btn-en-linea js-punto-de-camara"><i class="fa fa-video-camera"></i></button>
            Pulsa para encender tu cámara
          </div>
        </div>

        <div class="row js-cargando" style="display:none">
          <div class="col-lg-1">
            <i class="fa fa-spinner fa-pulse"></i>
          </div>
          <div class="col-lg-11">
              Obteniendo datos de tu cámara <br>
              Pulsa en "Permitir" para poder acceder a ella.
          </div>
        </div>

        <div class="row js-con-camara con-separacion" style="display:none">
          <div class="col-lg-12">
            <button type="button" class="btn btn-primary btn-en-linea js-descargar"><i class="fa fa-camera"></i></button>
            Saca foto
          </div>
        </div>
        <div class="row js-con-camara con-separacion" style="display:none">
          <div class="col-lg-12">
            <button type="button" class="btn btn-primary btn-en-linea js-temporizador"><i class="fa fa-clock-o"></i></button>
            Saca foto con temporizador <div class="js-cuenta-atras" style="display:none">en <span class="js-tiempo">3</span></div>
          </div>
        </div>
        <div class="row js-con-camara con-separacion" style="display:none">
          <div class="col-lg-12">
            <button type="button" class="btn btn-primary btn-en-linea js-cambiar-color"><i class="fa fa-paint-brush"></i></button>
            Cambia el color
          </div>
        </div>
        <div class="row js-con-camara" style="display:none">
          <div class="col-lg-12">
            <button type="button" class="btn btn-primary btn-en-linea js-pantalla-completa"><i class="fa fa-television"></i></button>
            Ver a pantalla completa
          </div>
        </div>
    </div>
  </div>
  <div class="col-lg-6">
      <canvas style="display:none" class="portada js-portada" width="504" height="504"></canvas>
  		<video style="display:none"></video>
      <div class="telon js-telon"></div>
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
      <span class="dato"><a href="https://github.com/yosoyocre/ocre.soy/tree/master/vago/en/punto">Github</a></span>
    </div>

    <div class="col-lg-4">
      Lenguajes de programación
      <span class="dato">HTML, CSS y JavaScript</span>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-4">
      Librerías
      <span class="dato"><a href="https://jquery.com/">jQuery</a></span>
    </div>

    <div class="col-lg-4">
      Inspiración
      <span class="dato"><a href="https://es.wikipedia.org/wiki/Semitonos_(inform%C3%A1tica)">Semitonos</a></span>
    </div>
  </div>
</div>
<?php require('../../../_pie.php'); ?>
