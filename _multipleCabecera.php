<html lang="es">

<head>
    <meta charset="UTF-8">
    <title><?= $idDisco ?>Multiple</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css">

    <style>
        .pagina {
            position: relative;
            height: 100vh;
        }

        .portada canvas,
        .portada .canvas {
            width: 12cm !important;
            height: auto !important;
        }

        .portada.front canvas,
        .portada.front .canvas {
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
        }

        .portada.back canvas,
        .portada.back .canvas {
            border-right: 1px solid #ddd;
            border-top: 1px solid #ddd;
        }

        .portada.front.centrado canvas,
        .portada.front.centrado .canvas,
        .portada.back.centrado canvas,
        .portada.back.centrado .canvas {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid #ddd;
        }

        @media print {
            .pagina {
                page-break-after: always;
            }

            .portada.back canvas,
            .portada.back .canvas {
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
    </style>

    <?php
    $nDiscos = intval($_POST['n']);

    $dedicatorias = [];

    if ($_POST['dedicatorias']) {
        $dedicatorias = preg_split('/\r\n|[\r\n]/', trim($_POST['dedicatorias']));
    }
    ?>

</head>