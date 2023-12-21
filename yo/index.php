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
            <p>
                <a href="https://ocre.bandcamp.com/album/d-bil">
                    Escucha mi último disco "Débil"
                </a>
            </p>
            <p>
                <a href="https://open.spotify.com/artist/4vaAG0GM8Bb96kbuZJ7tqG?si=01-MJPz9S2aqf6pXtFl6xA">
                    El resto de mi música en Spotify
                </a>
            </p>
            <p>
                <a href="https://ocre.soy">
                    Mi web oficial
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