<?php require('../../../_cabecera.php'); ?>

<script src="js/jquery.vago-publico.js"></script>

<script src="https://use.typekit.net/oam3avu.js"></script>
<script>
  try {
    Typekit.load({
      active: function() {
        var options = {
          addTitle: false,
          background: 'white',
        };      

        var $poster = $('.js-poster');

        $poster.vaguizable(options);

        $('.js-otro-poster').click(function(e) {
          e.preventDefault();

          $poster.removeData('plugin_vaguizable').vaguizable(options);
        });
      }
    })
  } catch(e) {}
</script>

<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/vago">vago</a>
      <span class="separador">/</span> <a href="/vago/en">en</a>
      <span class="separador">/</span> <a href="/vago/en/publico">público</a>
    </h1>
    <p>
      Para promocionar mi primer concierto en la <a href="http://nave1839.org/">Nave 1839</a>, teloneando a la banda viguesa <a href="https://www.facebook.com/igmigmusic/">IGMIG</a> el <a href="https://www.facebook.com/yosoyocre/posts/524765537692144">24 de octubre de 2015</a> en A Coruña, 
      programé un generador de carteles que mostrasen los datos del evento con un degradado de colores aleatorios, siguiendo la estética del <a href="/vago">Vago</a>.
    </p>
    <p>
      Y aquí está el resultado. Si quieres generar otro cartel <a class="js-otro-poster" href="#">pulsa aquí</a>.
    </p>        
  </div>
</div>

<div class="row">
  <div class="col-lg-8">
    <canvas class="js-poster img-fluid" width="1240" height="1754"></canvas>
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
      <span class="dato"><a href="https://github.com/yosoyocre/ocre.soy/tree/master/vago/en/publico">Github</a></span>
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
      Tipografía del cartel
      <span class="dato"><a href="https://typekit.com/fonts/fatfrank">FatFrank</a> de <a href="https://www.jeffreyschreiber.nl/">Jeff Schreiber</a></span>
    </div>  
  </div>
</div>
<?php require('../../../_pie.php'); ?>
