<?php
$versionCartel = $_GET && isset($_GET['version']) ? $_GET['version'] : 'vertical';
?>
<?php require('../../../_cabecera.php'); ?>

<link rel="stylesheet" href="../concentracion/css/comun.css">

<style>
    #cartel {
        cursor: pointer;
    }
</style>

<div class="row">
    <div class="col-lg-12">
        <?php breadcrumb(); ?>
        <p>
            El 25 de enero de 2025 daré un concierto con <a href="https://www.instagram.com/autosacramental/">Auto Sacramental</a> en <a href="https://www.instagram.com/acefala.colectivo/">Acéfala</a>, en A Coruña. <br>
        </p>
        <p>
            Para promocionarlo en redes sociales, creé un generador de carteles en los que se muestran los datos del concierto sobre un modelo en 3D de una cruz que gira 360º.
        </p>
        <p>
            Esta cruz se dibuja usando caracteres ASCII, tal y como hice con el diseño de portada de mi disco <a href="/debil">Débil</a>.
        </p>
        <p>
            Cada 5 segundos el sistema cambia varios parámetros del cartel: los carácteres ASCII usados para pintar la cruz, los 2 colores de la paleta, la posición de los textos y el tamaño de la propia cruz.
        </p>
        <p>
            Si quieres ver la versión <?= $versionCartel == 'cuadrada' ? 'vertical' : 'cuadrada' ?>, pulsa <a href="?version=<?= $versionCartel == 'cuadrada' ? 'vertical' : 'cuadrada' ?>">aquí</a>.
        </p>
        <p>
            Si quieres descargar una imagen fija, haz click sobre el cartel.
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

<script src="../concentracion/js/comun.js"></script>
<!-- Import maps polyfill -->
<!-- Remove this when import maps will be widely supported -->
<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

<script type="module">
    import {
        crea
    } from "./js/cartelDebil.js";

    let ancho = 700;
    let alto = <?= $versionCartel == 'cuadrada' ? 'ancho' : 'ancho * 1.414' ?>;

    let nuevoBorrar = crea({
        // conColorEnNegativo: false,
        ancho: ancho,
        alto: alto,
        proyector: "#cartel",
        conMovimiento: true,
        modelos: ['/debil/en/amistad/cross/modelo.js'],
        // Al utilizar el parámetro grabar, puedo guardar un vídeo de la animación 
        // indicando el número de cambios que quiero recoger
        // grabar: 10
    });
</script>

<?php require('../../../_pie.php'); ?>