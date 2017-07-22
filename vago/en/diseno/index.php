<?php require('../../../_cabecera.php'); ?>

<script src="js/jquery.vago.js"></script>
	<script>
		$(function() {
      function nuevoDiseno() {
					var $portada = $('.js-portada');
          var $contra = $('.js-contra');

			    $portada.removeData('plugin_vago').vago({ 
            background: 'white', 
            stepByStep: true,
          });
					var portada = $.data($portada.get(0), 'plugin_vago');

          $contra.removeData('plugin_vago').vago({ 
            background: 'white', 
            color: portada.settings.color,  
            stepByStep: true,
            addTitle: false,
            addCredits: true 
          });
          var contra = $.data($contra.get(0), 'plugin_vago');

					var $favicon = $('<canvas width="16" height="16">');

					$favicon.vago({
						background: 'white',
						color: portada.settings.color,
						maxRadius: 4,
						points: 1,
						degradationLevel: 1,
						addTitle: false,
            border: 0
					});

					$('.js-favicon').attr('href', $favicon.get(0).toDataURL());
      }

      nuevoDiseno();

      $('.js-nuevoDiseno').click(function(e) {
        e.preventDefault();

        nuevoDiseno();
      });

      $('.js-portada-descargar').click(function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-vago_portada.png';
        link.href = $('.js-portada').get(0).toDataURL("image/png");
        link.click();
      });

      $('.js-contra-descargar').click(function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-vago_contra.png';
        link.href = $('.js-contra').get(0).toDataURL("image/png");
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
      En la línea del <a href="/torpe">pimero</a>, la portada del <a href="/vago">Vago</a>
      también se genera por ordenador, pero esta vez jugando con puntos de
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
    <a class="sin-hover js-portada-descargar" href="#">
      <canvas class="portada js-portada" width="1400" height="1400" alt="Esta es tu portada del Vago"></canvas>
    </a>
  </div>

  <div class="col-lg-6">
    <a class="sin-hover js-contra-descargar" href="#">
      <canvas class="portada js-contra" width="1400" height="1400" alt="Esta es tu contraportada del Vago"></canvas>
    </a>
  </div>
</div>

<div class="row">
  <div class="col-lg-8">
    <p>
      De esta forma, cualquiera puede descargarse una portada del Vago, imprimírsela
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
      <span class="dato"><a href="https://github.com/yosoyocre/ocre.soy/blob/master/vago/en/diseno/js/jquery.vago.js">Github</a></span>
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
