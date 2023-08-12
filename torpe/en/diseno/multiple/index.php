<?php
$idDisco = 'torpe';
$nombreDisco = 'torpe';

if (isset($_POST['generar'])) :

  require('../../../../_multipleCabecera.php');
?>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
  <script src="/vendor/bootstrap/js/bootstrap.js"></script>

  <script src="../js/torpe.js?v=17112100"></script>
  <script>
    $(function() {

      function formatDate(date) {
        function pad(n) {
          return n < 10 ? '0' + n : n;
        }

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
          textoPortada.onload = function() {
            portada.drawImage(this, 0, 0);

            $portada.attr('src', portada.getImageDataURI());
          };

          paleta = portada.getPalette();

          contra.options.palette = paleta;
          contra.options.minCombinedElements = 1;
          contra.draw();

          textoContra.onload = function() {
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
    for ($i = 0; $i < $nDiscos; $i++) :
    ?>

      <div class="pagina js-diseno" <?= isset($dedicatorias[$i]) ? 'data-dedicatoria="' . $dedicatorias[$i] . '"' : ''; ?>>
        <div class="portada front"><img class="canvas js-portada" alt="Esta es tu portada del Vago" /></div>
        <div class="portada back"><img class="canvas js-contra" alt="Esta es tu contraportada del Vago" /></div>
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