<?php
    $hayImagen = false;
		if ($_FILES['imagen']) {
			$filename = 'uploads/' . $_FILES['imagen']['name'];
			move_uploaded_file($_FILES['imagen']["tmp_name"], $filename);
      $hayImagen = true;
    }
?>

<?php require('../../../_cabecera.php'); ?>

<script type="text/javascript" src="js/jquery.vago-en-punto.js"></script>
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
        videoVagoEnEsencia.draw();
    }
  });

  $('.js-selecciona-imagen').click(function(e) {
    e.preventDefault();

    $('.js-primer-paso').fadeOut(function() {
      $('.js-con-imagen').fadeIn();
    });

    $('.js-imagen').click();
  });

  $('.js-descargar').click(function(e) {
    e.preventDefault();

    var tiempo = 3;

    $('.js-tiempo').text(tiempo);
    $('.js-cuenta-atras').css('display', 'inline');

    function sacaFoto() {
        if (tiempo) {
          $('.js-tiempo').text(tiempo);
          tiempo = tiempo - 1;
          setTimeout(sacaFoto, 1000);
        } else {
          var link = document.createElement("a");

          link.download = 'ocre-vago_en_esencia.png';
          link.href = $('.js-portada').get(0).toDataURL("image/png");
          link.click();

          $('.js-cuenta-atras').fadeOut();
        }
    }

    sacaFoto();

  });

  $('.js-sube-imagen').click(function(e) {
    e.preventDefault();

    $('.js-imagen-en-punto').submit();
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

      <?php
        if (!$hayImagen) :
      ?>

        <!-- Imagen de cámara -->
        <div class="row js-primer-paso">
          <div class="col-lg-12">
              <button type="button" class="btn btn-default btn-en-linea js-punto-de-camara"><i class="fa fa-video-camera"></i></button>
            Enciende tu cámara
          </div>
        </div>

        <div class="row js-cargando" style="display:none">
          <div class="col-lg-12">
              <i class="fa fa-spinner fa-pulse"></i> Obteniendo datos de cámara
          </div>
        </div>

        <div class="row js-con-camara" style="display:none">
          <div class="col-lg-12">
            <button type="button" class="btn btn-default btn-en-linea js-descargar"><i class="fa fa-camera"></i></button>
            Saca foto <div class="js-cuenta-atras" style="display:none">en <span class="js-tiempo">3</span></div>
          </div>
        </div>

        <!-- Imagen de fichero -->

        <form method="post" class="js-imagen-en-punto" enctype="multipart/form-data">

          <div class="row js-primer-paso">
            <div class="col-lg-12">
                <button type="button" class="btn btn-default btn-en-linea js-selecciona-imagen"><i class="fa fa-picture-o"></i></button>
                Selecciona una imagen en tu ordenador
              <input type="file" name="imagen" value="" style="display:none" class="js-imagen">
            </div>
          </div>

          <div class="row js-con-imagen" style="display:none">
            <div class="col-lg-12">
              <button type="button" class="btn btn-default btn-en-linea js-sube-imagen"><i class="fa fa-upload"></i></button>
                Sube la imagen
            </div>
          </div>
        </form>
      <?php
        endif;
      ?>
    </div>
  </div>
  <div class="col-lg-6">
    <?php
      if (!$hayImagen) :
    ?>
      <canvas style="display:none" class="portada js-portada" width="504" height="504"></canvas>
  		<video style="display:none"></video>
    <?php
      else :
    ?>
      <img src="<?php echo $filename; ?>" class="img-fluid portada" alt="" />
    <?php
      endif;
    ?>
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
