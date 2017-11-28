<?php 
  if (isset($_POST['generar'])) :
?>

  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Vago Múltiple</title>
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

      <script src="../js/jquery.vago.js?v=17112100"></script>
      <script>
        $(function() {
          var $disenos = $('.js-diseno');

          if ($disenos.length) {
            $disenos.each(function() {
              var $this = $(this);
              var $portada = $this.find('.js-portada');
              var $contra = $this.find('.js-contra');
              var dedicatoria = $this.data('dedicatoria') ? $this.data('dedicatoria') : null;

              $portada.vago({ 
                background: 'white',                   
                coverSrc: '../img/front.png'
              });
              var portada = $.data($portada.get(0), 'plugin_vago');

              $contra.vago({ 
                background: 'white', 
                color: portada.settings.color,  
                addTitle: false,
                addCredits: true,
                creditsSrc: '../img/back.png',
                creditsText: dedicatoria
              });
              var contra = $.data($contra.get(0), 'plugin_vago');
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
            <canvas class="portada js-portada" width="1400" height="1400" alt="Esta es tu portada del Vago"></canvas>
            <canvas class="portada js-contra" width="1400" height="1400" alt="Esta es tu contraportada del Vago"></canvas>
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
        <span class="separador">/</span> <a href="/vago">vago</a>
        <span class="separador">/</span> <a href="/vago/en">en</a>
        <span class="separador">/</span> <a href="/vago/en/diseno">diseño</a>
        <span class="separador">/</span> <a href="/vago/en/diseno/multiple">multiple</a>
      </h1>

      <p>
        Este es un sistema para generar varios diseños del <a href="/vago/en/diseno">Vago</a> a la vez.
      </p>

      <form method="post">
        <div class="form-inline">
          <div class="form-group">
            <label for="n">Número de diseños</label>
            <input style="max-width: 100px;" type="number" class="form-control m-l-lg" id="n" name="n">
          </div>
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