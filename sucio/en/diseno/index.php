<?php require('../../../_cabecera.php'); ?>

  <style>
    .portada canvas {
      width: 100% !important;
      height: auto !important;
    }
  </style>

  <script src="js/p5.min.js"></script>
  <script src="js/sucio.js"></script>
  <script>
		$(function() {
      function nuevoDiseno() {        
        $('#portada').html('');
        $('#contra').html('');
        $('#favicon').html('');
        
        let matiz = Math.round(Math.random() * 255);
        
        let paramsPortada = {};
        paramsPortada.matizGlobal = matiz;        
        paramsPortada.coverType = 'front';
        paramsPortada.callback = function() {
          let $diseno = $('#portada');
          $diseno.css('width', $diseno.width()).css('height', $diseno.height());          
        };
        let front = new p5(sucio(paramsPortada), 'portada');
        
        let paramsContra = {};
        paramsContra.matizGlobal = matiz;
        paramsContra.coverType = 'back';
        paramsContra.callback = function() {
          let $diseno = $('#contra');
          $diseno.css('width', $diseno.width()).css('height', $diseno.height());          
        };
        let back = new p5(sucio(paramsContra), 'contra');
        
        let paramsFavicon = {};
        paramsFavicon.matizGlobal = matiz;
        paramsFavicon.coverType = null;
        paramsFavicon.callback = function() {
          $('.js-favicon').attr('href', $('#favicon').find('canvas').get(0).toDataURL());
        };
        let favicon = new p5(sucio(paramsFavicon), 'favicon');
      }

      nuevoDiseno();

      $('.js-nuevoDiseno').click(function(e) {
        e.preventDefault();

        nuevoDiseno();
      });

      $('.js-portada-descargar').click(function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-sucio_portada.png';
        link.href = $(this).find('canvas').get(0).toDataURL("image/png");
        link.click();
      });

      $('.js-contra-descargar').click(function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-sucio_contra.png';
        link.href = $(this).find('canvas').get(0).toDataURL("image/png");
        link.click();
      });
		});
	</script>
<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/sucio">sucio</a>
      <span class="separador">/</span> <a href="/sucio/en">en</a>
      <span class="separador">/</span> <a href="/sucio/en/diseno">diseño</a>
    </h1>
    <p>
      Siguiendo la tradición marcada por el <a href="/torpe">Torpe</a> y el <a href="/torpe">Vago</a>, la portada del <a href="/sucio">Sucio</a>
      también la crea tu ordenador generando una especie de confeti con una forma más o menos definida.
    </p>
		<p>
			Hay tantas combinaciones posibles de colores y distribuciones que es casi imposible
			conseguir dos diseños iguales.
		</p>
    <p>
      Por ejemplo, aquí tienes uno que se acaba de crear. <br>
      Haz click sobre la imagen para descargártela o pulsa <a class="js-nuevoDiseno" href="/sucio/en/diseno">aquí</a> para producir otra.
    </p>
  </div>
</div>

<div class="row">
  <div class="col-lg-6">
    <a class="sin-hover js-portada-descargar" href="#">
      <div class="portada" id="portada"></div>      
    </a>
  </div>

  <div class="col-lg-6">
    <a class="sin-hover js-contra-descargar" href="#">
      <div class="portada" id="contra"></div>
    </a>
  </div>
</div>

<div id="favicon" style="display:none"></div>

<div class="row">
  <div class="col-lg-8">
    <p>
      Así, cualquiera puede descargarse una portada del Sucio, imprimírsela
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
      <span class="dato"><a href="https://github.com/yosoyocre/ocre.soy/blob/master/sucio/en/diseno/js/sucio.js">Github</a></span>
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
      <span class="dato"><a href="https://p5js.org/">p5.js</a></span>
    </div>
    <div class="col-lg-4">
      Inspiración
      <span class="dato"><a href="https://edupoch.github.io/felices42/">Felicitación para Bita</a></span>
    </div>
  </div>
</div>
<?php require('../../../_pie.php'); ?>
