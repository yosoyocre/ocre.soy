<?php
$idDisco = 'sucio';
$nombreDisco = 'sucio';

if (isset($_POST['generar'])) :

  require('../../../../_multipleCabecera.php');
?>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
  <script src="/vendor/bootstrap/js/bootstrap.js"></script>
  <script src="../js/p5.min.js"></script>
  <script src="../js/sucio.js"></script>

  <script>
    $(function() {
      let dedicatorias = <?= json_encode($dedicatorias) ?>;
      let n = <?= $nDiscos ?>;
      let i;

      for (i = 0; i < n; i++) {
        let matiz = Math.round(Math.random() * 255);

        let paramsPortada = {};
        paramsPortada.coverType = 'front';
        paramsPortada.matizGlobal = matiz;

        let paramsContra = {};
        paramsContra.coverType = 'back';
        paramsContra.matizGlobal = matiz;
        if (dedicatorias[i]) {
          paramsContra.textoCreditos = dedicatorias[i];
        }

        let portada = document.createElement('div');
        portada.className = 'portada front';
        let contra = document.createElement('div');
        contra.className = 'portada back';

        let front = new p5(sucio(paramsPortada), portada);
        let back = new p5(sucio(paramsContra), contra);

        let pagina = document.createElement('div');
        pagina.className = 'pagina';

        pagina.appendChild(portada);
        pagina.appendChild(contra);

        $('body').append(pagina);
      }
    });
  </script>

  <body>

  </body>

  </html>

<?php
else :
  require('../../../../_multiplePie.php');
endif;
?>