<?php require('../../../_cabecera.php'); ?>

<script type="text/javascript" src="js/torpe.js"></script>
<script type="text/javascript">
  $(function () {

    function formatDate(date) {
        function pad(n) { return n < 10 ? '0' + n : n; }

        return pad(date.getHours()) + ':' +
            pad(date.getMinutes()) + ' ' +
            pad(date.getDate()) + '/' +
            pad(date.getMonth() + 1) + '/' +
            pad(date.getFullYear());
    }

    function nuevoDiseno() {

      var portada = new Torpe(),
          contra = new Torpe(),
          favicon = new Torpe({
              width: 16,
              height: 16,
              elementSize: 12,
              margin: 2,
              minCombinedElements: 1,
              lineWidth: 2,
              thickLineWidth: 2,
              border: 0
          }),
          textoPortada = new Image(),
          textoContra = new Image(),
          paleta;

      textoPortada.src = 'img/front.png';
      textoContra.src = 'img/back.png';

      portada.draw();
      textoPortada.onload = function () {
          portada.drawImage(this, 0, 0);

          $('.js-portada').attr('src', portada.getImageDataURI());
          $('.js-portada-descarga').attr('href', portada.getImageDataURI());
      };

      paleta = portada.getPalette();

      contra.options.palette = paleta;
      contra.options.minCombinedElements = 1;
      contra.draw();

      textoContra.onload = function () {
          contra.drawImage(this, 0, 0);
          contra.writeText(formatDate(new Date()), 19 * 70, 19 * 70);

          $('.js-contra').attr('src', contra.getImageDataURI());
          $('.js-contra-descarga').attr('href', contra.getImageDataURI());
      };

      favicon.options.palette = paleta;
      favicon.draw();

      $('.js-favicon').attr('href', favicon.getImageDataURI());
    }

    nuevoDiseno();

    $('.js-nuevoDiseno').click(function(e) {
      e.preventDefault();

      nuevoDiseno();
    })
  });
</script>

<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/torpe">torpe</a>
      <span class="separador">/</span> <a href="/torpe/en">en</a>
      <span class="separador">/</span> <a href="/torpe/en/diseno">diseño</a>
    </h1>
    <p>
      La portada del primer <a href="/torpe">EP</a> se genera por ordenador en cada visualización.
      El algoritmo divide el espacio en varias regiones y superpone distintas figuras geométricas,
      cuyo número, forma y color se escogen al azar.
    </p>
    <p>
      Hay tantas combinaciones posibles que cada diseño es prácticamente único.
    </p>
    <p>
      Por ejemplo, aquí tienes un par de imágenes que se acaban
      de crear. <br>
      Haz click sobre ellas para descargártelas o pulsa <a class="js-nuevoDiseno" href="/torpe/en/diseno">aquí</a> para generar otras.
    </p>
  </div>
</div>

<div class="row">
  <div class="col-lg-6">
    <a class="sin-hover js-portada-descarga" download="ocre-torpe_portada.png" href="#">
      <img class="portada con-sombra js-portada"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wkLEjQ36ZjAzAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAFZklEQVR42u3UQREAAAjDMMC/56EAA1wioY92kgLgl5EAwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3CUAMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB+CyLLkG5SMjgeEAAAAASUVORK5CYII="
        alt="Esta es tu portada del torpe" />
    </a>
  </div>

  <div class="col-lg-6">
    <a class="sin-hover js-contra-descarga" download="ocre-torpe_contra.png" href="#">
      <img class="portada con-sombra js-contra"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wkLEjQ36ZjAzAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAFZklEQVR42u3UQREAAAjDMMC/56EAA1wioY92kgLgl5EAwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3CUAMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB+CyLLkG5SMjgeEAAAAASUVORK5CYII="
        alt="Esta es tu contraportada del torpe" />
    </a>
  </div>
</div>

<div class="row">
  <div class="col-lg-8">
    <p>
      De esta forma, cualquiera puede descargarse una portada del Torpe, imprimírsela
      y fabricar una edición de la que no habrá otra copia.
    </p>
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
      Código fuente
      <span class="dato"><a href="https://github.com/yosoyocre/disenoTorpe">Github</a></span>
    </div>

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
    <div class="col-lg-4">
      Inspiración
      <span class="dato"><a href="https://vimeo.com/31486228">Karel Martens</a></span>
    </div>
  </div>
</div>
<?php require('../../../_pie.php'); ?>
