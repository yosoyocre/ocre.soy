<?php require('../../../_cabecera.php'); ?>

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
            <canvas width="1024" height="683" id="fotoCanvas"></canvas>
            <img id="foto" src="eduvulnerable.png" alt="" style="display:none">
            <div class="portada" id="portada" style="display:none"></div>
        </a>
    </div>
</div>


<script type="module">
    import {
        crea
    } from "../diseno/js/debil.js?v=2";

    let borrar;

    function generaPortada() {
        let portada = document.getElementById("portada");
        portada.innerHTML = "";

        if (borrar !== undefined) {
            borrar();
        }

        borrar = crea({
            portada: "#portada",
            caracteresElegidos: [2],
            conMovimiento: false,
            conPosicionInicialRandom: true,
            conTextoPortada: false,
            conAbismoCircular: true,
            conColorEnNegativo: true
        });

        var config = {
            childList: true,
        };

        var callback = function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    const fotoAncho = 5184;
                    const fotoAlto = 3456;

                    const imagenAncho = 1024;
                    const imagenAlto = 683;

                    let canvas = portada.querySelector("canvas");

                    let fotoCanvas = document.getElementById("fotoCanvas");
                    let fotoCtx = fotoCanvas.getContext("2d");

                    const foto = document.getElementById("foto");

                    let grados = 0;
                    let proporcion = 0.1;

                    function pintarFoto() {
                        fotoCtx.drawImage(canvas, -100, 0 - (imagenAlto - imagenAncho / 2), imagenAncho + 200, imagenAncho);

                        fotoCtx.save();
                        fotoCtx.translate(imagenAncho / 2, imagenAlto / 2);
                        fotoCtx.rotate((Math.PI / 180) * grados);
                        fotoCtx.translate(-imagenAncho / 2, -imagenAlto / 2);

                        let ancho = imagenAncho / proporcion;
                        let alto = imagenAlto / proporcion;

                        fotoCtx.drawImage(foto, (imagenAncho - ancho) / 2, (imagenAlto - alto) / 2, ancho, alto);
                        fotoCtx.restore();

                        // fotoCtx.drawImage(foto, 3 * imagenAncho / 8, 3 * imagenAlto / 8, imagenAncho / 4, imagenAlto / 4);
                        window.requestAnimationFrame(pintarFoto);
                        grados += 10 % 360;
                        proporcion += 0.08;
                    }

                    pintarFoto();

                    // fotoCtx.drawImage(canvas, -100, 0 - (imagenAlto - imagenAncho / 2), imagenAncho + 200, imagenAncho);
                    // fotoCtx.drawImage(foto, imagenAncho / 4, imagenAlto / 4, imagenAncho / 2, imagenAlto / 2);

                    // fotoCtx.drawImage(canvas, 380 / fotoAncho * imagenAncho, 1800 / fotoAlto * imagenAlto, 900, 300);
                }
            }
        };

        var observer = new MutationObserver(callback);

        observer.observe(portada, config);
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
</script>
<?php require('../../../_pie.php'); ?>