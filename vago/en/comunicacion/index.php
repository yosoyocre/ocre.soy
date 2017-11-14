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

          moment.locale('es');

          var doc = new jsPDF();
          var lineas;
          var fechaDoc = moment().format('YYYY-MM-DD_HH-mm-ss');
          var fecha = moment().format('D [de] MMMM [de] YYYY');

          var margenIzq = 22;
          var y = 100;
          var tamanoParrafo = 160;
          var p = 10;


          doc.setFont('Arial', 'bold');
          doc.setFontSize(14);

          lineas = doc.splitTextToSize('Ocre presenta su segundo EP de pop, Vago, en el sello barcelonés Discos de Kirlian', tamanoParrafo);
          doc.text(100, 15, lineas, 'center');

          doc.addImage($icono.get(0).toDataURL(), 'PNG', 78, 20, 53, 53);

          doc.setFontSize(11);
          doc.text('A Coruña, ' + fecha, margenIzq, y);
          
          doc.setFont('Arial', 'normal');
          y = y + p;

          lineas = doc.splitTextToSize('De ese sistema, Edu Poch (Viveiro, 1985) ha creado su segundo EP, Vago (Discos de Kirlian, 2017).', tamanoParrafo);
          
          doc.text(margenIzq, y, lineas);

          doc.save('ocre_nota-de-prensa_' + fechaDoc + '.pdf');
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
