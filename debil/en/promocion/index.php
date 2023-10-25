<?php require('../../../_cabecera.php'); ?>

<style>
    /* #portada canvas {
        max-width: 100%;
        height: auto;
    } */
</style>

<div class="row">
    <div class="col-lg-8">
        <h1>
            <span class="separador">/</span> <a href="/debil">débil</a>
            <span class="separador">/</span> <a href="/debil/en">en</a>
            <span class="separador">/</span> <a href="/debil/en/diseno">diseño</a>
        </h1>
    </div>
</div>
<div class="row">
    <div class="col-lg-6">
        <a class="sin-hover js-portada-descargar" href="#">
            <div id="portada" style="display:none"></div>
            <img src="mascara.png" id="mascara" alt="" style="display:none">
            <canvas id="imagen" width="1024" height="492"></canvas>
        </a>
    </div>
</div>


<script type="module">
    import {
        crea
    } from "../diseno/js/promoDebil.js?v=2";

    let borrar;

    function generaPortada() {
        let portada = document.getElementById("portada");
        portada.innerHTML = "";

        if (borrar !== undefined) {
            borrar();
        }

        borrar = crea({
            portada: "#portada",
            // caracteresElegidos: [6],
            // color: {
            //     r: 0,
            //     g: 0,
            //     b: 0
            // },
            conMovimiento: false,
            // conPosicionInicialRandom: true,
            conTextoPortada: false,
            conAbismoCircular: true,
            conColorEnNegativo: true,
            // conEfecto: false
        });

        var config = {
            childList: true,
        };

        // var observer = new MutationObserver(callback);

        // observer.observe(portada, config);
    }

    // document.querySelector(".js-nuevoDiseno").addEventListener("click", function(e) {
    //     e.preventDefault();

    //     generaPortada();
    // });

    document.querySelector('.js-portada-descargar').addEventListener("click", function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-debil_portada.png';
        link.href = this.querySelector('canvas').toDataURL("image/png");
        link.click();
    });

    generaPortada();

    setTimeout(function() {
        let portada = document.getElementById("portada");
        let canvas = portada.querySelector('canvas');

        let imagen = document.getElementById("imagen");
        let imagenCtx = imagen.getContext('2d');

        let mascara = document.getElementById("mascara");

        imagenCtx.drawImage(canvas, 0, 0, 1024, 492);
        imagenCtx.drawImage(mascara, 0, 0, 1024, 492);

    }, 2000);
</script>
<?php require('../../../_pie.php'); ?>