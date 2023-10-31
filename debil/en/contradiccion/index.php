<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Débil</title>
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
            letter-spacing: -0.1em;
            font-size: 16rem;
            line-height: 0.9 !important;
        }

        #portada canvas {
            height: 100vh;
        }
    </style>
</head>

<body class="h-screen text-black font-bold bg-black text-center uppercase">
    <div class="flex items-center h-full">
        <div class="mx-auto relative z-10">
            <span id="letra"></span>
        </div>
        <div id="portada" class="absolute"></div>
        <audio controls id="audio" src="audio/no_debil.mp3" class="z-50 w-screen absolute bottom-0"></audio>
    </div>

    <!-- Import maps polyfill -->
    <!-- Remove this when import maps will be widely supported -->
    <script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
    <script src="/debil/node_modules/liricle/dist/liricle.min.js"></script>

    <script type="module">
        import {
            crea
        } from "./js/videoDebil.js";

        crea({
            portada: "#portada",
            conTextoPortada: false,
            // color: {
            //     r: 255,
            //     g: 255,
            //     b: 255
            // },
            margen: 0,
            ancho: 1400,
            alto: 782,
            conColorEnNegativo: true
        });

        let audio = document.getElementById("audio");
        let letra = document.getElementById("letra");

        const liricle = new Liricle();

        // listen to on sync event
        liricle.on("sync", (line, word) => {
            letra.innerHTML = line.text.replace(/\s+/g, "<br />");
        });

        // load lyric
        liricle.load({
            url: "audio/no_debil.lrc"
        });

        audio.addEventListener("timeupdate", () => {
            const time = audio.currentTime;

            // sync lyric when the audio time updated
            liricle.sync(time, false);
        });

        setTimeout(() => {
            audio.play();
        }, 1000);
    </script>
</body>

</html>