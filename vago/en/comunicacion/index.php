<?php require('../../../_cabecera.php'); ?>

<script src="/vendor/bower-asset/jspdf/dist/jspdf.min.js"></script>
<script src="/vendor/bower-asset/moment/min/moment-with-locales.min.js"></script>
<script src="/vago/en/diseno/js/jquery.vago.js"></script>
	<script>
		$(function() {
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

        var doc = new jsPDF({lineHeight: 1.5});
        var lineas;
        var fechaDoc = moment().format('YYYY-MM-DD_HH-mm-ss');
        var fechaFirma = moment().format('D [de] MMMM [de] YYYY [a las] HH:mm');
        var fecha = moment().format('D [de] MMMM [de] YYYY');

        var margenIzq = 22;
        var y = 95;
        var tamanoParrafo = 165;
        var tamanoLinea = 5.6;
        var p = 10;


        doc.setFont('Arial', 'bold');
        doc.setFontSize(14);

        doc.text('Ocre presenta su segundo EP de pop, "Vago"', 50, 15);
        doc.text('en el sello barcelonés Discos de Kirlian', 57, 21);

        doc.addImage($icono.get(0).toDataURL(), 'PNG', 78, 28, 53, 53);

        doc.setFontSize(10);
        doc.text('A Coruña, 28 de noviembre de 2017', margenIzq, y);
        
        y = y + p;
        doc.setFont('Arial', 'normal');
        lineas = doc.splitTextToSize('La frustración como motor creativo. La apropiación como metodología. La mediocridad como celebración. \nEsta semana se publica el segundo disco de Ocre, "Vago", bajo el sello barcelonés Discos de Kirlian, formado por 6 canciones de pop electrónico en las que canta al fracaso, la rabia y la nostalgia. \n\nMediante el uso de melodías y ritmos aleatorios, la acumulación de múltiples capas de samples de baterías kraut y la reiteración de loops de voces y guitarras, Ocre crea un sonido que es al mismo tiempo intenso y cercano, sucio y definido, oscuro y brillante, y que evoca a otros grupos estatales, como Family o Hidrogenesse, e internacionales, como New Order o Ladytron.\n\nOcre continúa la línea de su primer disco, "Torpe" (EP en Discos de Kirlian, 2014) al acompañar sus canciones de experimentos audiovisuales en la web. Por ejemplo, cada copia de Vago contiene una portada y una contraportada que se generan por ordenador, mediante el dibujo al azar de círculos, para crear una mancha geométrica, única para cada oyente.\n\nOcre es el proyecto musical de Edu Poch (Viveiro, 1985) que forma en 2013 tras haber integrado otras bandas como Nouvelle Cuisine y Elvis Negro. En estos cuatro años Edu Poch ha presentado en directo sus temas dentro de carteles como el del Festival Noroeste Estrella Galicia de A Coruña, el Festival Ao Compaz de Saumede o el Melonafest de Santiago de Compostela.', tamanoParrafo);          
        doc.text(margenIzq, y, lineas);

        y = y + lineas.length * tamanoLinea;
        doc.setFont('Arial', 'bold');
        doc.text(margenIzq, y, 'Para ampliar información o concertar entrevistas');

        y = y + tamanoLinea;
        doc.setFont('Arial', 'normal');          
        lineas = doc.splitTextToSize('Teléfono: 658 068 665\nCorreo: yosoyocre@gmail.com', tamanoParrafo);          
        doc.text(margenIzq, y, lineas);

        y = y + lineas.length * tamanoLinea + 5;
        doc.setFont('Arial', 'bold');
        doc.text(margenIzq, y, 'Enlaces de interés');

        y = y + tamanoLinea;
        doc.setFont('Arial', 'normal');          
        lineas = doc.splitTextToSize('Bandcamp: https://discosdekirlian.bandcamp.com/album/dk55-vago \nFacebook: https://www.facebook.com/yosoyocre \nWeb: https://ocre.soy \nGenerador de portadas del "Vago": https://ocre.soy/vago/en/diseno/', tamanoParrafo);          
        doc.text(margenIzq, y, lineas);

        y = y + lineas.length * tamanoLinea + 5;
        doc.setFont('Courier', 'normal'); 
        doc.setFontSize(8);  
        lineas = doc.splitTextToSize('La imagen de esta nota de prensa también es aleatoria\ny fue generada el ' + fechaFirma, tamanoParrafo);          
        doc.text(margenIzq, y, lineas);

        $('.js-descargar').click(function(e) {
          e.preventDefault();

          doc.save('ocre_nota-de-prensa_' + fechaDoc + '.pdf');
        });

		});
	</script>
<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/vago">vago</a>
      <span class="separador">/</span> <a href="/vago/en">en</a>
      <span class="separador">/</span> <a href="/vago/en/comunicacion">comunicación</a>
    </h1>

    <p>
      La nota de prensa que acompaña al <a href="/vago">Vago</a> también la genera un programa de ordenador, añadiendo a su encabezado una imagen aleatoria con la estética del disco.
    </p>

    <p class="m-t-md">
      <a class="js-descargar" href="#">Pulsa aquí para descargar la nota de prensa</a>
    </p>

    <canvas style="display:none" class="icono js-icono" width="240" height="240"></canvas>
  </div>
</div>

<?php require('../../../_pie.php'); ?>
