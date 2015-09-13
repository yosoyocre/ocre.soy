<?php require('../../../_cabecera.php'); ?>

<script src="js/jquery.vago.js"></script>
	<script>
		$(function() {
      function nuevoDiseno() {
					var $portada = $('.js-portada');

			    $portada.removeData('plugin_vago').vago({ stepByStep: true });
					var portada = $.data($portada.get(0), 'plugin_vago');

					var $favicon = $('<canvas width="16" height="16">');

					$favicon.vago({
						background: portada.settings.background,
						color: portada.settings.color,
						maxRadius: 4,
						points: 1,
						degradationLevel: 1,
						addTitle: false,
					});

					$('.js-favicon').attr('href', $favicon.get(0).toDataURL());
      }

      nuevoDiseno();

      $('.js-nuevoDiseno').click(function(e) {
        e.preventDefault();

        nuevoDiseno();
      });

      $('.js-descargar').click(function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-vago_portada.png';
        link.href = $('.js-portada').get(0).toDataURL("image/png");
        link.click();
      });
		});
	</script>
<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/vago">vago</a>
      <span class="separador">/</span> <a href="/vago/en">en</a>
      <span class="separador">/</span> <a href="/vago/en/diseno">diseño</a>
    </h1>
    <p>
      En la línea del <a href="/torpe">pimero</a>, la portada del <a href="/vago">próximo EP</a>
      también se generará por ordenador, pero esta vez jugando con puntos de
			distintos tamaños. En un lienzo vacío, el algoritmo escoge un color de fondo al azar. Luego esparce
			puntos de otro tono y los extiende sin demasiado control.
    </p>
		<p>
			Hay tantas combinaciones posibles de colores y tamaños que es casi imposible
			conseguir dos diseños iguales.
		</p>
    <p>
      Por ejemplo, aquí tienes uno que se acaba de crear. <br>
      Haz click sobre la imagen para descargártela o pulsa <a class="js-nuevoDiseno" href="/vago/en/diseno">aquí</a> para producir otra.
    </p>
  </div>
</div>

<div class="row">
  <div class="col-lg-6">
    <a class="sin-hover js-descargar" href="#">
      <canvas class="portada js-portada" width="1400" height="1400" alt="Esta es tu portada del Vago"></canvas>
    </a>
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
      <span class="dato"><a href="https://github.com/yosoyocre/disenoVago">Github</a></span>
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
      <span class="dato"><a href="https://es.wikipedia.org/wiki/Semitonos_(inform%C3%A1tica)">Semitonos</a></span>
    </div>
  </div>
</div>
<?php require('../../../_pie.php'); ?>
