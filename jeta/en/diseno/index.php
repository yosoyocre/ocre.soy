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

echo "Describe tu problema<br>";
echo '<input type="text" size="80" value="' . htmlspecialchars($text) . '" onchange="location.href=\'?text=\'+this.value;">';
echo "<br><br>";

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

    if ($sonPruebas) {
        echo "Problema:<br>" . htmlspecialchars($problema) . "<br><br>";
    }

    if ($debug) {
        echo "Ganadora:<br>" . htmlspecialchars($respuestaEstructurada['label']) . "<br><br>";
        echo "Pesos: ";
        foreach ($pesos as $label => $peso) {
            echo htmlspecialchars($label) . ": " . round($peso, 4) . ". ";
        }
        echo "<br><br>";
    }
    echo "Solución:<br>";
    echo $solucion;
    echo "<hr>";
}
