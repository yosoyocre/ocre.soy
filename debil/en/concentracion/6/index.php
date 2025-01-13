<?php
// TITULO
?>
<?php require('../../../../_cabecera.php'); ?>

<link rel="stylesheet" href="../css/comun.css">

<div class="row">
    <div class="col-lg-12">
        <?php breadcrumb(); ?>
        <p>
            Este cartel es de un concierto real: <br>
            del que di con <a href="https://www.instagram.com/autosacramental/">Auto Sacramental</a> en <a href="https://www.instagram.com/acefala.colectivo/">Acéfala</a>, A Coruña, el 25 de enero de 2025.
        </p>
        <p>
            Pulsa en el cartel para descargarlo.
        </p>
    </div>
</div>
<div class="row">
    <div class="col-lg-8">
        <div id="cartel"></div>
        <div class="js-otro-poster"></div>
    </div>
</div>

<?php
colofon([
    'Lenguajes de programación' => 'HTML, CSS y JavaScript',
    'Librerías' => '<a href="https://threejs.org/">three.js</a>',
]);
?>

<script src="../js/comun.js"></script>
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
        modelos: ['/debil/en/concentracion/6/cross/modelo.js'],
        // grabar: 10
    });
</script>

<?php require('../../../../_pie.php'); ?>