<?php
if (isset($_POST['generar'])) :
?>

  <html lang="es">

  <head>
    <meta charset="UTF-8">
    <title>Débil Múltiple</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css">

    <style>
      .pagina {
        position: relative;
        height: 100vh;
      }

      .portada canvas {
        width: 12cm !important;
        height: auto !important;
      }

      .portada.front canvas {
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
      }

      .portada.back canvas {
        border-right: 1px solid #ddd;
        border-top: 1px solid #ddd;
      }

      @media print {
        .pagina {
          page-break-after: always;
        }

        .portada.back canvas {
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    </style>

    <?php
    $dedicatorias = [];

    if ($_POST['dedicatorias']) {
      $dedicatorias = preg_split('/\r\n|[\r\n]/', trim($_POST['dedicatorias']));
    }
    ?>

  </head>

  <body>

    <div id="disenos"></div>

    <script type="module">
      import {
        crea
      } from "../js/debil.js";

      let dedicatorias = <?= json_encode($dedicatorias) ?>;
      let n = <?= intval($_POST['n']) ?>;
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
        });
      }
    </script>

  </body>

  </html>

<?php
else :
?>

  <?php require('../../../../_cabecera.php'); ?>

  <div class="row">
    <div class="col-lg-8">
      <h1>
        <span class="separador">/</span> <a href="/debil">débil</a>
        <span class="separador">/</span> <a href="/debil/en">en</a>
        <span class="separador">/</span> <a href="/debil/en/diseno">diseño</a>
        <span class="separador">/</span> <a href="/debil/en/diseno/multiple">multiple</a>
      </h1>

      <p>
        Este es un sistema para generar varios diseños del <a href="/debil/en/diseno">débil</a> a la vez. <br>
        Para que quede bien, hay que convertirla a <b>CMYK</b> e imprimirla a color <b>mate</b> en un papel de <b>180grs</b>.
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