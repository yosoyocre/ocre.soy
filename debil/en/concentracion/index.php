<?php require('../../../_cabecera.php'); ?>

<div class="row">
    <div class="col-lg-8">
        <h1>
            <span class="separador">/</span> <a href="/debil">débil</a>
            <span class="separador">/</span> <a href="/debil/en">en</a>
            <span class="separador">/</span> <a href="/debil/en/concentracion">concentración</a>
        </h1>

        <p>Estos son los experimentos que he estado programando para ayudarme a darle contenido a mi cuenta de Instagram:</p>

        <?php
        // Leemos todas las subcarpetas de este directorio

        $subcarpetas = scandir('.');
        foreach ($subcarpetas as $archivo) {
            if (is_dir($archivo) && $archivo != '.' && $archivo != '..' && $archivo != 'css' && $archivo != 'js' && $archivo != '_plantilla') {
                $index = './' . $archivo . "/index.php";

                // Leemos el primer comentario del index.php de cada subcarpeta                
                $source = file_get_contents($index);

                $tokens = token_get_all($source);
                $comment = array(
                    T_COMMENT,      // All comments since PHP5
                    T_DOC_COMMENT   // PHPDoc comments      
                );
                foreach ($tokens as $token) {
                    if (!in_array($token[0], $comment))
                        continue;

                    $titulo = $token[1];
                    $titulo = str_replace('//', '', $titulo);
                    break;
                }
        ?>
                <p>
                    <a href="/debil/en/concentracion/<?= $archivo ?>"><span class="separador">/</span> <?= $archivo ?>. <?= $titulo ?></a>
                </p>
        <?php
            }
        }
        ?>

    </div>
</div>
<?php require('../../../_pie.php'); ?>