<?php require('../../../_cabecera.php'); ?>

<style>
    #imagenPromo canvas {
        width: 100%;
        height: auto;
    }
</style>

<div class="row">
    <div class="col-lg-8">
        <h1>
            <span class="separador">/</span> <a href="/debil">débil</a>
            <span class="separador">/</span> <a href="/debil/en">en</a>
            <span class="separador">/</span> <a href="/debil/en/promocion">promoción</a>
        </h1>
    </div>
</div>
<div class="row">
    <div class="col-lg-8">
        <a class="sin-hover js-imagen-descargar" href="#">
            <div id="imagenPromo"></div>
        </a>
    </div>
</div>


<script type="module">
    import {
        crea
    } from "../diseno/js/promoDebil.js?v=25";

    let borrar;

    function generaImagen() {
        if (borrar !== undefined) {
            borrar();
        }

        borrar = crea({
            imagen: "#imagenPromo",
            // caracteresElegidos: [0],
            // color: {
            //     r: 0,
            //     g: 0,
            //     b: 0
            // },
            conColorEnNegativo: true,
            // conEfecto: false
        });
    }

    document.querySelector('.js-imagen-descargar').addEventListener("click", function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-debil_promocion.png';
        link.href = this.querySelector('#imagen').toDataURL("image/png");
        link.click();
    });

    generaImagen();
</script>
<?php require('../../../_pie.php'); ?>