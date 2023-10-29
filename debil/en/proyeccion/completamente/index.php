<?php

// Leemos las subcarpetas de la carpeta modelos

$directorioModelos = opendir('./modelos');
$modelos = [];

while ($archivo = readdir($directorioModelos)) {
    if ($archivo != "." && $archivo != "..") {
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

    <script type="module">
        import {
            crea
        } from "../../diseno/js/proyeccionDebil.js";

        let modelos = <?= json_encode($modelos); ?>;

        let borrar;

        async function mostrarModelo() {
            let nuevoBorrar = crea({
                proyector: "#proyector",
                conMovimiento: true,
                // conEfecto: false,
                // conColorEnNegativo: false,
                alto: 782,
                margen: 0,
                modelos: modelos
            });

            if (borrar) {
                console.log('Borrando');
                borrar();
            }

            borrar = nuevoBorrar;

            // setTimeout(() => {
            //     mostrarModelo();
            // }, 5000);
        }

        await mostrarModelo();
    </script>
</body>

</html>