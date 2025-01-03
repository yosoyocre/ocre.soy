<?php require('_cabecera.php'); ?>

<div class="row">
  <div class="col-lg-8">
    <h1>
      <span class="separador">/</span> <a href="/<?= $idDisco ?>"><?= $nombreDisco ?></a>
      <span class="separador">/</span> <a href="/<?= $idDisco ?>/en">en</a>
      <span class="separador">/</span> <a href="/<?= $idDisco ?>/en/diseno">diseño</a>
      <span class="separador">/</span> <a href="/<?= $idDisco ?>/en/diseno/multiple">multiple</a>
    </h1>

    <p>
      Este es un sistema para generar varios diseños del <a href="/<?= $idDisco ?>/en/diseno"><?= $nombreDisco ?></a> a la vez. <br>
    </p>

    <form method="post">
      <div class="form-inline">
        <div class="form-group">
          <label for="n">Número de diseños</label>
          <input style="max-width: 100px;" type="number" class="form-control m-l-lg" id="n" name="n" min="1" value="1">
        </div>
      </div>
      <div class="form-group">
        <label for="dedicatorias">Dedicatorias</label>
        <textarea class="form-control" id="dedicatorias" name="dedicatorias" rows="5"></textarea>
      </div>
      <button name="generar" type="submit" class="btn btn-default">Generar</button>
    </form>

    <p>
      Para que quede bien, hay que convertirla a <b>CMYK</b>. Para ello:
    </p>
    <p>
      <code>gs -sDEVICE=pdfwrite -sProcessColorModel=DeviceCMYK -sColorConversionStrategy=CMYK -sColorConversionStrategyForImages=CMYK -dEncodeColorImages=false -o <?= $idDisco ?>MultipleCYMK.pdf <?= $idDisco ?>Multiple.pdf</code>
    </p>
    <p>
      Luego, imprimirla a color <b>mate</b> en un papel <b>estucado</b> de <b>170grs</b>.
    </p>

  </div>
</div>


<?php require('_pie.php'); ?>