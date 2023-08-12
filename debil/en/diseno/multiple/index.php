<?php
$idDisco = 'debil';
$nombreDisco = 'débil';

if (isset($_POST['generar'])) :

  require('../../../../_multipleCabecera.php');
?>

  <body>

    <div id="disenos"></div>

    <script type="module">
      import {
        crea
      } from "../js/debil.js";

      let dedicatorias = <?= json_encode($dedicatorias) ?>;
      let n = <?= $nDiscos ?>;
      let i;

      let disenos = document.getElementById("disenos");

      for (i = 0; i < n; i++) {

        let portada = document.createElement('div');
        portada.className = 'portada front';
        portada.id = 'portada_' + i;

        let contra = document.createElement('div');
        contra.className = 'portada back';
        contra.id = 'contra_' + i;

        let pagina = document.createElement('div');
        pagina.className = 'pagina';

        pagina.appendChild(portada);
        pagina.appendChild(contra);
        disenos.appendChild(pagina);

        crea({
          portada: "#portada_" + i,
          contra: "#contra_" + i,
          conMovimiento: false,
          conPosicionInicialRandom: true
        });
      }
    </script>

  </body>

  </html>

<?php
else :
  require('../../../../_multiplePie.php');
endif;
?>