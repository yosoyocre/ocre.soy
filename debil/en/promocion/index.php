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
            <!-- <img src="mascara.png" id="mascara" alt="" style="display:none"> -->
            <img src="foto_byn_sombra.png" id="foto" alt="" style="display:none">
            <canvas id="canvasAux" width="1024" height="492" style="display:none"></canvas>
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
    }

    document.querySelector('.js-portada-descargar').addEventListener("click", function(e) {
        e.preventDefault();

        var link = document.createElement("a");
        link.download = 'ocre-debil_promocion.png';
        link.href = this.querySelector('#imagen').toDataURL("image/png");
        link.click();
    });

    generaPortada();

    setTimeout(function() {
        let ancho = 1024;
        let alto = 492;

        let portada = document.getElementById("portada");
        let canvas = portada.querySelector('canvas');

        let imagen = document.getElementById("imagen");
        let imagenCtx = imagen.getContext('2d');

        // let mascara = document.getElementById("mascara");
        let foto = document.getElementById("foto");

        let canvasAux = document.getElementById('canvasAux');
        let ctxAux = canvasAux.getContext('2d');

        ctxAux.drawImage(foto, 0, 0, ancho, alto);
        ctxAux.globalCompositeOperation = 'destination-out';
        ctxAux.beginPath();
        // for (let i = 0; i < 2; i++) {
        // ctxAux.lineTo(Math.random() * ancho, Math.random() * alto);
        // }

        // ctxAux.moveTo(Math.random() * ancho, 0);
        // ctxAux.lineTo(Math.random() * ancho, alto);

        ctxAux.moveTo(0, 0);
        let coordenada1 = 200 + Math.random() * (ancho - 400);
        // let coordenada1 = ancho - 400;
        ctxAux.lineTo(coordenada1, 0);
        let coordenada2 = 200 + Math.random() * (ancho - 400);
        // let coordenada2 = ancho;
        ctxAux.lineTo(coordenada2, alto);
        ctxAux.lineTo(0, alto);

        // ctxAux.moveTo(0, 0);
        ctxAux.closePath();
        ctxAux.fill();
        // ctxAux.clearRect(0, 0, ancho / 2, alto);

        imagenCtx.drawImage(canvas, 0, 0, ancho, alto);
        imagenCtx.drawImage(ctxAux.canvas, 0, 0, ancho, alto);

    }, 2000);
</script>
<?php require('../../../_pie.php'); ?>