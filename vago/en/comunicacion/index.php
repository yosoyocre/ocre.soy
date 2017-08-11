<?php require('../../../_cabecera.php'); ?>

<script src="/vendor/bower-asset/jspdf/dist/jspdf.min.js"></script>
<script src="/vendor/bower-asset/moment/min/moment-with-locales.min.js"></script>
<script src="/vago/en/diseno/js/jquery.vago.js"></script>
	<script>
		$(function() {
      function nuevoDiseno() {
					var $icono = $('.js-icono');
          
			    $icono.removeData('plugin_vago').vago({ 
            background: 'white', 
            stepByStep: false,
            addTitle: false,
            maxRadius: 10,
            minRadius: 5,      
            border: 0      
          });
					var icono = $.data($icono.get(0), 'plugin_vago');

          var $favicon = $('<canvas width="16" height="16">');

					$favicon.vago({
						background: 'white',
						color: icono.settings.color,
						maxRadius: 4,
						points: 1,
						degradationLevel: 1,
						addTitle: false,
            border: 0
					});

					$('.js-favicon').attr('href', $favicon.get(0).toDataURL());

          var doc = new jsPDF();

          doc.addImage($icono.get(0).toDataURL(), 'PNG', 78, 20, 53, 53);

          doc.save('nota-de-prensa.pdf');
      }

      nuevoDiseno();

		});
	</script>
<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/vago">vago</a>
      <span class="separador">/</span> <a href="/vago/en">en</a>
      <span class="separador">/</span> <a href="/vago/en/comunicacion">comunicación</a>
    </h1>
  </div>
</div>

<div class="row">
  <div class="col-lg-6">
    <canvas class="icono js-icono" width="240" height="240"></canvas>
  </div>
</div>

<?php require('../../../_pie.php'); ?>
