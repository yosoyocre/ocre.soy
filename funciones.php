<?php

/**
 * Imprime la ruta de carpetas en la que se encuentra el archivo actual.
 * 
 * @return void
 */
function breadcrumb()
{
    $correcciones = [
        'debil' => 'débil',
        'concentracion' => 'concentración'
    ];

    $path = $_SERVER['PHP_SELF'];
    $path = explode("/", $path);
    array_pop($path); // Quitamos el último elemento (el nombre del archivo actual
    $path = array_filter($path);

    $acumulado = '/';

    echo '<h1>';
    foreach ($path as $carpeta) {
        $acumulado .= $carpeta . '/';
        echo '<span class="separador">/</span> <a href="' . $acumulado . '">'
            . (isset($correcciones[$carpeta]) ? $correcciones[$carpeta] : $carpeta)
            . '</a> ';
    }
    echo '</h1>';
}

/**
 * Devuelve un enlace al código fuente del archivo actual en Github.
 * 
 * @return string
 */
function enlace_codigo_fuente()
{
    $path = $_SERVER['PHP_SELF'];
    return '<a href="https://github.com/yosoyocre/ocre.soy/tree/master' . $path . '">Github</a></span>';
}

/**
 * Imprime un colofón con los datos que se le pasen en un array asociativo.
 * 
 * @param array $datos
 * 
 * @return void
 */
function colofon($datos)
{
    $datos = ['Código fuente ' => enlace_codigo_fuente()] + $datos;
?>
    <div class="ficha">
        <div class="row">
            <div class="col-lg-12">
                <h3>Colofón</h3>
            </div>
        </div>
        <div class="row">
            <?php
            $etiquetas = array_keys($datos);
            for ($i = 0; $i < count($datos); $i++) :
                if ($i > 0 && $i % 2 == 0) :
            ?>
        </div>
        <div class="row">
        <?php
                endif;
        ?>

        <div class="col-lg-4">
            <?= $etiquetas[$i] ?>
            <span class="dato">
                <?= $datos[$etiquetas[$i]] ?>
            </span>
        </div>
    <?php
            endfor;
    ?>
        </div>
    </div>
<?php
}
