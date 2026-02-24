<?php

$text = "";
$debug = isset($_GET['debug']) && $_GET['debug'] == "1";
$sonPruebas = isset($_GET['text']) && $_GET['text'] == "todos";

if (!isset($_GET['text'])) {
    $posiblesProblemas = [];
} else {
    if ($sonPruebas) {
        $posiblesProblemas = json_decode(file_get_contents("posiblesProblemas.json"), true);
    } else {
        $text = $_GET['text'];
        $posiblesProblemas = [$text];
    }
}
?>
<html>

<head>
    <title>Pruebas</title>
    <style>
        body {
            background-color: #f0f0f0;
        }

        main {
            max-width: 800px;
            margin: auto;
            font-family: monospace;
            font-size: 14px;
            background-color: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        input {
            margin-top: 10px;
            padding: 5px;
            font-size: 14px;
        }

        .enlace {
            display: block;
            margin-top: 10px;
        }

        .enlace:visited {
            color: blue;
        }

        h2 {
            margin-top: 30px;
        }

        hr {
            margin: 40px 0;
        }
    </style>
</head>

<body>
    <main>
        <?php
        echo "Describe tu problema";
        echo '<input type="text" size="80" value="' . htmlspecialchars($text) . '" onchange="location.href=\'?text=\'+this.value;">';
        echo '<a class="enlace" href="?text=todos&debug=1">Ver todos los problemas</a>';

        foreach ($posiblesProblemas as $problema) {
            $url = "http://python:5000/classify?text=" . urlencode($problema);
            $response = file_get_contents($url);

            $respuestaEstructurada = json_decode($response, true);
            // Ordenamos los pesos de mayor a menor
            $pesos = $respuestaEstructurada['scores'];
            arsort($pesos);

            $soluciones = json_decode(file_get_contents("soluciones.json"), true);
            $posiblesSoluciones = $soluciones[$respuestaEstructurada['solution']];
            $solucion = $posiblesSoluciones[array_rand($posiblesSoluciones)];

            echo "<hr>";

            if ($sonPruebas) {
                echo "<h2>Problema</h2><p>" . htmlspecialchars($problema) . "</p>";
            }

            echo '<div';
            if (!$debug) {
                echo ' style="display:none;"';
            }
            echo '>';
            echo "<h2>Ganadora</h2><p>" . htmlspecialchars($respuestaEstructurada['label']) . "</p>";
            echo "<h2>Pesos</h2>";
            foreach ($pesos as $label => $peso) {
                echo "<p>" . htmlspecialchars($label) . ": " . round($peso, 4) . "</p>";
            }
            echo "</div>";

            echo "<h2>Solución</h2>";
            echo "<p>" . htmlspecialchars($solucion) . "</p>";
        }
        ?>

    </main>
</body>

</html>