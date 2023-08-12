<?php
$idDisco = 'vago';
$nombreDisco = 'vago';

if (isset($_POST['generar'])) :

  require('../../../../_multipleCabecera.php');
?>

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
    for ($i = 0; $i < $nDiscos; $i++) :
    ?>

      <div class="js-diseno pagina" <?= isset($dedicatorias[$i]) ? 'data-dedicatoria="' . $dedicatorias[$i] . '"' : ''; ?>>
        <div class="portada front">
          <canvas class="js-portada" width="1400" height="1400" alt="Esta es tu portada del Vago"></canvas>
        </div>
        <div class="portada back">
          <canvas class="js-contra" width="1400" height="1400" alt="Esta es tu contraportada del Vago"></canvas>
        </div>
      </div>

    <?php
    endfor;
    ?>
  </body>

  </html>

<?php
else :
  require('../../../../_multiplePie.php');
endif;
?>