<?php
// TITULO
?>
<?php require('../../../../_cabecera.php'); ?>

<link rel="stylesheet" href="../css/comun.css">

<div class="row">
    <div class="col-lg-12">
        <?php breadcrumb(); ?>
        <p>
            Me imagino conciertos. Luego me imagino sus carteles. Y luego los programo.
        </p>
        <p>
            Pulsa en el cartel para descargarlo. <br>Y si quieres generar otro cartel <a class="js-otro-poster" href="#">pulsa aquí</a>.
        </p>
    </div>
</div>
<div class="row">
    <div class="col-lg-8">
        <div id="cartel"></div>
    </div>
</div>

<?php
colofon([
    'Lenguajes de programación' => 'HTML, CSS y JavaScript',
    'Librerías' => '<a href="https://p5js.org">p5.js</a>',
    'Inspiración' => '<a href="#">Este cartel</a> del <a href="#">Instagram de XXX</a>'
]);
?>

<!-- Import maps polyfill -->
<!-- Remove this when import maps will be widely supported -->
<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

<script type="module">
    import {
        crea
    } from "./js/cartelDebil.js";

    let ancho = 700;
    let alto = ancho * 1.414;
    // Cuadrado para IG
    // let alto = ancho;

    let nuevoBorrar = crea({
        // conColorEnNegativo: false,
        ancho: ancho,
        alto: alto,
        proyector: "#cartel",
        conMovimiento: true,
        modelos: ['/debil/en/concentracion/6/cross/modelo.js']
    });
</script>

<?php require('../../../../_pie.php'); ?>