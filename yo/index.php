<?php
$ocultaNav = true;
require('../_cabecera.php');
?>

<style>
    .row {
        margin-bottom: 50px;
        text-align: center;
    }

    .icono img {
        margin: 0 auto;
    }
</style>

<script type="text/javascript" src="/torpe/en/diseno/js/torpe.js"></script>
<script type="text/javascript">
    $(function() {
        $('.js-icono').each(function() {
            var torpe = new Torpe({
                width: 110,
                height: 110,
                elementSize: 90,
                margin: 10,
                thickLineWidth: 2,
                border: 0,
                minCombinedElements: 1
            });
            var $imagenTorpe;

            torpe.draw();

            $imagenTorpe = $('<img class="sin-sombra img-fluid">');
            $imagenTorpe
                .attr('src', torpe.getImageDataURI());

            $(this).append($imagenTorpe);
        });
    });
</script>

<div style="margin-top:50px" class="js-contenido">
    <div class="row">
        <div class="col-lg-12 icono js-icono"></div>
    </div>
    <div class="row">
        <div class="col-lg-4"></div>
        <div class="col-lg-4">
            <h2>Hola, yo soy Ocre</h2>
            <p>y estos son algunos enlaces<br>que te pueden interesar</p>
        </div>
        <div class="col-lg-4"></div>
    </div>
    <div class="row">
        <div class="col-lg-4"></div>
        <div class="col-lg-4">
            <p style="margin-bottom: 50px">
                <a href="https://youtu.be/qXcyCIJjvOA">
                    Ve el anti-lyric video de "No débil"
                </a>
            </p>
            <p>
                <a href="https://open.spotify.com/album/4TJyHW1TUP2XYWKTPZyipQ?si=jW4FPYXtQtyWq8LnfK3XBw">
                    Escucha mi último disco "Débil"
                </a>
            </p>
            <p>
                <a href="https://claro.ocre.soy">
                    Lee mis notas sobre mi trabajo
                </a>
            </p>
            <p>
                <a href="https://arieuger.itch.io/destrucciones-martinez">
                    Juega a "Destrucciones Martínez"
                </a>
            </p>
            <p>
                <a href="https://ocre.soy">
                    Pásate por mi web oficial
                </a>
            </p>
        </div>
        <div class="col-lg-4"></div>
    </div>
    <div class="row">
        <div class="col-lg-12 icono js-icono"></div>
    </div>
</div>

<?php require('../_pie.php'); ?>