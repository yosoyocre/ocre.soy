<?php require('../../../_cabecera.php'); ?>

<script type="text/javascript" src="js/jquery.vago-en-esencia.js"></script>
<script type="text/javascript">
$(function() {
  var video = document.querySelector('video');

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

  $('.js-esencia-de-camara').click(function(e) {
    e.preventDefault();

    $('.js-cargando').fadeIn();
    gumInit();

    video.addEventListener('loadedmetadata', function () {
      $('.js-cargando').hide();
      $('.js-portada').fadeIn();
      draw();
    });

    var $videoVagoEnEsencia = $('.js-portada').vagoenesencia();
    var videoVagoEnEsencia = $.data($videoVagoEnEsencia.get(0), 'plugin_vagoenesencia');

    function draw() {
        requestAnimFrame(draw);
        videoVagoEnEsencia.draw();
    }
  });

  $('.js-descargar').click(function(e) {
    e.preventDefault();

    var link = document.createElement("a");
    link.download = 'ocre-vago_en_esencia.png';
    link.href = $('.js-portada').get(0).toDataURL("image/png");
    link.click();
  });

});
</script>

<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/vago">vago</a>
      <span class="separador">/</span> <a href="/vago/en">en</a>
      <span class="separador">/</span> <a href="/vago/en/esencia">esencia</a>
    </h1>
    <p>
    </p>
  </div>
</div>

<div class="row">
  <div class="col-lg-6">
    <div class="ficha">
      <div class="row">
        <div class="col-lg-12">
          <h3>Panel de control</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          Encender cámara
          <span class="dato">
            <button type="button" class="btn btn-default js-esencia-de-camara"><i class="fa fa-video-camera"></i></button>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          Sacar foto
          <span class="dato">
            <button type="button" class="btn btn-default js-descargar"><i class="fa fa-camera"></i></button>
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="col-lg-6">
    <p style="display:none" class="js-cargando">
      <i class="fa fa-spinner fa-pulse"></i> Obteniendo datos de cámara
    </p>
    <canvas style="display:none" class="portada js-portada" width="504" height="504"></canvas>
		<video style="display:none"></video>
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
      Lenguajes de programación
      <span class="dato">HTML, CSS y JavaScript</span>
    </div>
  </div>

	<div class="row">
    <div class="col-lg-4">
      Librerías
      <span class="dato"><a href="https://jquery.com/">jQuery</a></span>
    </div>
  </div>
</div>
<?php require('../../../_pie.php'); ?>
