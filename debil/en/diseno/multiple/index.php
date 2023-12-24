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
        portada.className = 'portada front centrado';
        portada.id = 'portada_' + i;

        let contra = document.createElement('div');
        contra.className = 'portada back centrado';
        contra.id = 'contra_' + i;

        let pagina1 = document.createElement('div');
        pagina1.className = 'pagina';
        pagina1.appendChild(portada);

        let pagina2 = document.createElement('div');
        pagina2.className = 'pagina';
        pagina2.appendChild(contra);

        disenos.appendChild(pagina1);
        disenos.appendChild(pagina2);

        crea({
          portada: "#portada_" + i,
          contra: "#contra_" + i,
          conMovimiento: false,
          conPosicionInicialRandom: true,
          textoCreditos: dedicatorias[i]
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