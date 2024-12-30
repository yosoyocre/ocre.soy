<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>No débil</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://use.typekit.net/wfj3ppv.js"></script>
    <script>
        try {
            Typekit.load({});
        } catch (e) {}
    </script>
    <style>
        body {
            font-family: 'futura-pt', sans-serif;
            overflow: hidden;
        }

        #portada canvas {
            width: 100vw;
        }
    </style>
</head>

<body class="h-screen font-bold text-center uppercase text-black bg-black" style="font-size: 25vh; line-height: 24vh; letter-spacing: -0.1em;">
    <div class="flex items-center h-full">
        <div id="comienzo" class="w-1/2 mx-auto z-20 text-white text-2xl relative tracking-normal font-normal">
            <a href="#">Pulsa aquí para comenzar</a>
        </div>
        <div id="advertencia" class="w-1/2 mx-auto z-20 text-white text-2xl relative tracking-normal font-normal hidden">
            <b>Advertencia Importante</b><br>Este vídeo contiene cambios de intensidad en la luz<br>y colores brillantes
        </div>
        <div id="contenedor-letra" class="mx-auto relative z-10 hidden">
            <span id="letra"></span>
        </div>
        <div id="portada" class="absolute mx-auto"></div>
        <!-- <audio controls id="audio" src="audio/no_debil.mp3" class="z-50 w-screen absolute bottom-0"></audio> -->
        <audio id="audio" src="audio/no_debil.mp3" class="z-50 w-screen absolute bottom-0"></audio>
    </div>

    <!-- Import maps polyfill -->
    <!-- Remove this when import maps will be widely supported -->
    <script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
    <script src="/debil/node_modules/liricle/dist/liricle.min.js"></script>

    <script type="module">
        import {
            crea
        } from "./js/videoDebil.js";

        let audio = document.getElementById("audio");

        document.getElementById('comienzo').addEventListener('click', (e) => {
            e.preventDefault();

            document.getElementById("comienzo").remove();
            document.getElementById("advertencia").classList.remove("hidden");

            setTimeout(() => {
                document.getElementById("advertencia").remove();
                document.getElementById("contenedor-letra").classList.remove("hidden");

                audio.play();

                let borrar = crea({
                    portada: "#portada",
                    conTextoPortada: false,
                    // color: {
                    //     r: 255,
                    //     g: 255,
                    //     b: 255
                    // },
                    margen: 0,
                    ancho: window.innerWidth,
                    alto: window.innerHeight,
                    conColorEnNegativo: true,
                    conAbismoCircular: false
                });
            }, 5000);
        });
    </script>
</body>

</html>