<?php

// Leemos las subcarpetas de la carpeta modelos

$directoriosModelos = scandir('./modelos');
$modelos = [];

// $esTest = 1;
// $modeloAProbar = 'skull';

foreach ($directoriosModelos as $archivo) {
    if ((isset($modeloAProbar) && $modeloAProbar && $archivo == $modeloAProbar) || (!(isset($modeloAProbar) && $modeloAProbar) && $archivo != "." && $archivo != "..")) {
        array_push($modelos, '/debil/en/proyeccion/completamente/modelos/' . $archivo . '/modelo.js');
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Débil</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        #proyector canvas {
            width: 100vw;
            height: 100vh;
        }
    </style>
</head>

<body class="h-screen">
    <div class="flex items-center h-full">
        <div class="w-screen h-screen" id="proyector"></div>
    </div>

    <!-- Import maps polyfill -->
    <!-- Remove this when import maps will be widely supported -->
    <script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

    <script src="../../concentracion/js/comun.js"></script>

    <script type="module">
        import {
            crea
        } from "./js/proyeccionDebil.js";

        let nuevoBorrar = crea({
            // conColorEnNegativo: false,
            proyector: "#proyector",
            conMovimiento: true,
            <?php if (isset($esTest) && $esTest) : ?>
                conEfecto: false,
                conVariacionTamano: false,
            <?php endif; ?>
            modelos: <?= json_encode($modelos); ?>
        });
    </script>
</body>

</html>