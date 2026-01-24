<?php

if ($_POST && isset($_POST['problema'])) {
    $problema = $_POST['problema'];

    $url = "http://python:5000/classify?text=" . urlencode($problema);
    $response = file_get_contents($url);

    $respuestaEstructurada = json_decode($response, true);
    // Ordenamos los pesos de mayor a menor
    $pesos = $respuestaEstructurada['scores'];
    arsort($pesos);

    $soluciones = json_decode(file_get_contents("soluciones.json"), true);
    $posiblesSoluciones = $soluciones[$respuestaEstructurada['solution']];
    $solucion = $posiblesSoluciones[array_rand($posiblesSoluciones)];

    $respuesta = [
        "label" => $respuestaEstructurada['label'],
        "pesos" => $pesos,
        "solucion" => $solucion
    ];

    header('Content-Type: application/json');
    echo json_encode($respuesta);
}
