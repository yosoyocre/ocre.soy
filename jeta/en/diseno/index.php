<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./css/output.css" rel="stylesheet">

    <script src="https://use.typekit.net/wfj3ppv.js"></script>

    <script src="./js/p5.min.js"></script>
    <script src="./js/poisson-disk-sampling.min.js"></script>
    <script type="module" src="./js/jeta.js"></script>
    <script type="module">
        import {
            jeta
        } from "./js/jeta.js";

        try {
            Typekit.load({
                active: function() {
                    new p5(jeta);
                },
            });
        } catch (e) {}
    </script>
    <style>
        main canvas {
            max-width: 100%;
        }
    </style>
</head>

<body class="bg-white text-slate-800">
    <div class="absolute top-0 left-0 p-4 text-4xl">
        Sloke.ai
    </div>

    <div class="hidden flex pt-72 justify-center min-h-screen text-3xl">
        <div class="max-w-2xl w-full text-center">
            <div class="px-4">
                <p>
                    Sloke.ai te ayuda a resolver tus problemas laborales con <b>inteligencia artificial</b>
                </p>
                <input type="text" placeholder="¿Qué es lo que te preocupa hoy en tu trabajo?" class="text-xl w-full rounded-full px-6 pt-3 pb-4 border border-slate-300 mt-8 focus:outline-none shadow-lg">
            </div>
        </div>
    </div>
    <div class="hidden flex pt-72 justify-center min-h-screen text-3xl">
        <div class="max-w-2xl w-full text-center">
            <div class="px-4">
                <p class="animate-pulse">
                    Sloke.ai está pensando una solución para ti...
                </p>
            </div>
        </div>
    </div>
    <div class="flex items-center justify-center  min-h-screen">
        <main class="js-portada w-[500px] h-[500px]"></main>
    </div>

</body>



</html>