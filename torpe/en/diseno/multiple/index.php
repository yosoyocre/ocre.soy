<?php 
  if (isset($_POST['generar'])) :
?>

  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Torpe Múltiple</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

      <style>
        .portada {
            width: 12cm;
            margin-bottom: 1.3rem;
        }
      </style>
      
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
      <script src="/vendor/bootstrap/js/bootstrap.js"></script>

      <script src="../js/torpe.js?v=17112100"></script>
      <script>
        $(function() {

          function formatDate(date) {
              function pad(n) { return n < 10 ? '0' + n : n; }

              return 'el ' +
                  pad(date.getDate()) + '/' +
                  pad(date.getMonth() + 1) + '/' +
                  pad(date.getFullYear()) + ' a las ' +
                  pad(date.getHours()) + ':' +
                  pad(date.getMinutes());
          }

          var $disenos = $('.js-diseno');

          if ($disenos.length) {
            $disenos.each(function() {
              var $this = $(this);
              var $portada = $this.find('.js-portada');
              var $contra = $this.find('.js-contra');
              var dedicatoria = $this.data('dedicatoria') ? $this.data('dedicatoria') : null;

              var portada = new Torpe(),
                  contra = new Torpe(),
                  textoPortada = new Image(),
                  textoContra = new Image(),
                  paleta;

              textoPortada.src = '../img/front.png';
              textoContra.src = '../img/back.png';

              portada.draw();
              textoPortada.onload = function () {
                  portada.drawImage(this, 0, 0);

                  $portada.attr('src', portada.getImageDataURI());
              };

              paleta = portada.getPalette();

              contra.options.palette = paleta;
              contra.options.minCombinedElements = 1;
              contra.draw();

              textoContra.onload = function () {
                  contra.drawImage(this, 0, 0);

                  var text = '';

                  if (dedicatoria) {
                    text = dedicatoria + ', ';
                  }

                  text = text + formatDate(new Date());

                  contra.writeText(text, 19 * 70, 19 * 70);

                  $contra.attr('src', contra.getImageDataURI());
              };

            });
          }
        });
      </script>

    </head>
    <body>     

      <?php 
        $n = intval($_POST['n']);
        $dedicatorias = [];

        if ($_POST['dedicatorias']) {
          $dedicatorias = preg_split('/\r\n|[\r\n]/', trim($_POST['dedicatorias']));
        }

        for ($i = 0; $i < $n; $i++) :
      ?>

          <div class="js-diseno" <?= isset($dedicatorias[$i]) ? 'data-dedicatoria="' . $dedicatorias[$i] . '"' : ''; ?> >
            <img class="portada js-portada" alt="Esta es tu portada del Vago" />
            <img class="portada js-contra" alt="Esta es tu contraportada del Vago" />
          </div>

      <?php
        endfor;
      ?>
    </body>
  </html>

<?php 
  else :
?>

  <?php require('../../../../_cabecera.php'); ?>

  <div class="row">
    <div class="col-lg-8">
      <h1>
        <span class="separador">/</span> <a href="/torpe">torpe</a>
        <span class="separador">/</span> <a href="/torpe/en">en</a>
        <span class="separador">/</span> <a href="/torpe/en/diseno">diseño</a>
        <span class="separador">/</span> <a href="/torpe/en/diseno/multiple">multiple</a>
      </h1>

      <p>
        Este es un sistema para generar varios diseños del <a href="/torpe/en/diseno">Torpe</a> a la vez.
      </p>

      <form method="post">
        <div class="form-group">
          <label for="n">Número de diseños</label>
          <input style="max-width: 100px;" type="number" class="form-control" id="n" name="n">
        </div>
        <div class="form-group">
          <label for="dedicatorias">Dedicatorias</label>
          <textarea class="form-control" id="dedicatorias" name="dedicatorias" rows="5"></textarea>
        </div>
        <button name="generar" type="submit" class="btn btn-default">Generar</button>
      </form>

    </div>
  </div>


  <?php require('../../../../_pie.php'); ?>

<?php 
  endif;
?>