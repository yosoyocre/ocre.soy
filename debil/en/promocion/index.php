<?php require('../../../_cabecera.php'); ?>

<style>
    #imagenPromo canvas {
        width: 100%;
        height: auto;
    }

    img {
        max-width: 100%;
    }
</style>

<div class="row">
    <div class="col-lg-8">
        <h1>
            <span class="separador">/</span> <a href="/debil">débil</a>
            <span class="separador">/</span> <a href="/debil/en">en</a>
            <span class="separador">/</span> <a href="/debil/en/promocion">promoción</a>
        </h1>
        <p>
            Las fotos promocionales que acompañan al Débil se generan aleatoriamente, aplicando el filtro ASCII que uso en la portada a una parte, también escogida al azar, de la foto que me sacó <a href="https://www.instagram.com/rosalia_hhay/">Rosalía</a>.
        </p>
        <p>
            Por ejemplo, aquí tienes una imagen que se acaba de generar. <br>
            Haz click sobre ella para descargártela o pulsa <a class="js-nuevaImagen" href="/debil/en/diseno">aquí</a> para producir otra.
        </p>
    </div>
</div>
<div class="row">
    <div class="col-lg-8">
        <a class="sin-hover js-imagen-descargar" href="#">
            <div id="imagenPromo"></div>
        </a>
    </div>
</div>

<div class="row">
    <div class="col-lg-8">
        <p>
            Aparte de la imagen generada por ordenador, también estoy utilizando estas otras fotos de <a href="https://www.instagram.com/rosalia_hhay/">Rosalía</a> para promocionar el disco:
        </p>
    </div>
</div>
<div class="row">
    <div class="col-lg-8">
        <p>
            <a class="sin-hover" href="img/promo1.jpg"><img src="img/promo1_web.jpg" alt="Ocre abrazando"></a>
            <a class="sin-hover" href="img/promo2.jpg"><img src="img/promo2_web.jpg" alt="Ocre dando la mano"></a>
            <a class="sin-hover" href="img/promo3.jpg"><img src="img/promo3_web.jpg" alt="Ocre y osito de peluche"></a>
            <a class="sin-hover" href="img/promo4.jpg"><img src="img/promo4_web.jpg" alt="Ocre y el abismo"></a>
        </p>
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
            <span class="dato"><a href="https://github.com/yosoyocre/ocre.soy/blob/master/debil/en/diseno/js/promoDebil.js">Github</a></span>
        </div>

        <div class="col-lg-4">
            Lenguajes de programación
            <span class="dato">HTML, CSS y JavaScript</span>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-4">
            Librerías
            <span class="dato"><a href="https://threejs.org/">three.js</a></span>
            <span class="dato"><a href="https://github.com/davidbau/seedrandom">seedrandom.js</a></span>
        </div>
        <div class="col-lg-4">
            Fotografías
            <span class="dato"><a href="https://www.instagram.com/rosalia_hhay/">Rosalía Martínez</a></span>
        </div>
    </div>
</div>


<script type="module">
    import {
        crea
    } from "../diseno/js/promoDebil.js?v=33";

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

    document.querySelector(".js-nuevaImagen").addEventListener("click", function(e) {
        e.preventDefault();

        generaImagen();
    });

    generaImagen();
</script>
<?php require('../../../_pie.php'); ?>