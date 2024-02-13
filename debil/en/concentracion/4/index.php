<?php
// Generador de carteles pixelando imágenes
?>
<?php require('../../../../_cabecera.php'); ?>

<link rel="stylesheet" href="../css/comun.css">

<div class="row">
    <div class="col-lg-12">
        <?php breadcrumb(); ?>
        <p>
            Me imagino conciertos. Luego me imagino sus carteles. Y luego los programo.
        </p>
        <p>
            Pulsa en el cartel para descargarlo. <br>Y si quieres generar otro cartel <a class="js-otro-poster" href="#">pulsa aquí</a>.
        </p>
    </div>
</div>
<div class="row">
    <div class="col-lg-8">
        <main></main>
    </div>
</div>

<?php
colofon([
    'Lenguajes de programación' => 'HTML, CSS y JavaScript',
    'Librerías' => '<a href="https://p5js.org">p5.js</a>',
    'Inspiración' => '<a href="#">Este cartel</a> del <a href="#">Instagram de XXX</a>'
]);
?>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<script src="../js/comun.js"></script>
<script>
    var folio;
    var img;
    var nRombos = 9;
    var copias = [];

    function preload() {
        let nombreImg = 'edu.png'
        img = loadImage(nombreImg);

        for (let i = 0; i < nRombos; i++) {
            copias.push(loadImage(nombreImg));
        }
    }

    var escala = 2.5;
    var ladoRombo;
    var anguloPeq;
    var anchoRombo;
    var altoRombo;

    var operaciones = [];
    var nuevasOperaciones = [];

    function mascara() {
        let m = createGraphics(folio.width, folio.height);
        m.fill(0);

        return m;
    }

    function recortaRombo(maskImage) {
        maskImage.push();
        maskImage.translate(0, altoRombo / -2);
        maskImage.quad(anchoRombo / 2, 0, anchoRombo, altoRombo / 2, anchoRombo / 2, altoRombo, 0, altoRombo / 2);
        maskImage.pop();
    }

    function transforma(operaciones, alReves = false) {
        let signo = alReves ? -1 : 1;
        if (alReves) {
            operaciones = operaciones.slice().reverse();
        }

        for (let o = 0; o < operaciones.length; o++) {
            let operacion = operaciones[o];
            if (operacion[0] === 't') {
                translate(signo * operacion[1], signo * operacion[2]);
            } else {
                rotate(signo * operacion[1]);
            }
        }
    }

    function setup() {
        folio = new Folio();

        ladoRombo = 120;
        anguloPeq = PI / 3;
        anguloGrande = 2 * PI - 2 * anguloPeq;
        anchoRombo = cos(anguloPeq / 2) * ladoRombo * 2;
        altoRombo = sin(anguloPeq / 2) * ladoRombo * 2;

        function ordenaDistintos(lista) {
            let nuevaLista = shuffle(lista);

            for (let i = 0; i < lista.length; i++) {
                if (lista[i] === nuevaLista[i]) {
                    return ordenaDistintos(lista);
                }
            }

            return nuevaLista;
        }

        console.log(anchoRombo, altoRombo, ladoRombo);

        let maskImage;

        let xCentro = folio.width / 2;
        let yCentro = folio.height / 2;

        let xInicial = xCentro - anchoRombo;
        let yInicial = yCentro - altoRombo;

        // Máscara 1
        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        recortaRombo(maskImage);
        copias[0].mask(maskImage);

        // Máscara 2
        maskImage = mascara();
        maskImage.translate(xInicial + anchoRombo, yInicial);
        recortaRombo(maskImage);
        copias[1].mask(maskImage);

        // Máscara 3
        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(anguloPeq);
        recortaRombo(maskImage);
        copias[2].mask(maskImage);

        // Máscara 4
        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(2 * anguloPeq);
        maskImage.translate(-anchoRombo / 2, -3 * altoRombo / 2);
        recortaRombo(maskImage);
        copias[3].mask(maskImage);

        // Máscara 5
        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(anguloPeq);
        maskImage.translate(anchoRombo / 2, -3 * altoRombo / 2);
        recortaRombo(maskImage);
        copias[4].mask(maskImage);

        // Máscara 6
        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(2 * anguloPeq);
        maskImage.translate(-anchoRombo, -3 * altoRombo);
        recortaRombo(maskImage);
        copias[5].mask(maskImage);

        // Máscara 7
        maskImage = mascara();
        maskImage.translate(xInicial + anchoRombo / 2, yInicial + ladoRombo + altoRombo / 2);
        recortaRombo(maskImage);
        copias[6].mask(maskImage);

        // Máscara 8
        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(anguloPeq);
        maskImage.translate(anchoRombo, 0);
        recortaRombo(maskImage);
        copias[7].mask(maskImage);

        // Máscara 9
        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(2 * anguloPeq);
        maskImage.translate(0, -3 * altoRombo);
        recortaRombo(maskImage);
        copias[8].mask(maskImage);

        // Rombo 1
        operaciones.push([
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, 0],
        ]);

        // Rombo 2
        operaciones.push([
            ['t', -xInicial, -yInicial],
            ['t', -3 * anchoRombo / 2, 0],
        ]);

        // Rombo 3
        operaciones.push([
            ['r', -PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))],
        ]);

        // Rombo 4        
        operaciones.push([
            ['r', PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
        ]);

        // Rombo 5
        operaciones.push([
            ['r', -PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo, 0],
            ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))],
        ]);

        // Rombo 6
        operaciones.push([
            ['r', PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo, 0],
            ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
        ]);

        // Rombo 7
        operaciones.push([
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
            ['t', -anchoRombo / 2, 0],
        ]);

        // Rombo 8
        operaciones.push([
            ['r', (-PI / 3)],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
            ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))]
        ]);

        // Rombo 9
        operaciones.push([
            ['r', PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
            ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
        ]);

        nuevasOperaciones = ordenaDistintos(operaciones);

        image(img, 0, 0, folio.width, folio.height);

        for (let i = 0; i < nRombos; i++) {
            push();
            transforma(nuevasOperaciones[i], true);
            // rotate(map(mouseX, 0, width, 0, 2 * PI));
            if (random() > 0.5) {
                rotate(PI);
            }
            transforma(operaciones[i]);
            image(copias[i], 0, 0, folio.width, folio.height);
            pop();
        }
    }

    function draw() {}
</script>

<?php require('../../../../_pie.php'); ?>