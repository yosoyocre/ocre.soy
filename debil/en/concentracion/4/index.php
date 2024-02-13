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

<style>
    canvas {
        border: 1px solid black;
    }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<script src="../js/comun.js"></script>
<script>
    var folio;
    var img;
    var imgCopia1;
    var imgCopia2;
    var imgCopia3;
    var imgCopia4;
    var imgCopia5;
    var imgCopia6;
    var imgCopia7;
    var imgCopia8;
    var imgCopia9;
    var tamanoCuadrado = 125;

    function preload() {
        img = loadImage('edu_oso_cartel.png');

        imgCopia1 = loadImage('edu_oso_cartel.png');
        imgCopia2 = loadImage('edu_oso_cartel.png');
        imgCopia3 = loadImage('edu_oso_cartel.png');
        imgCopia4 = loadImage('edu_oso_cartel.png');
        imgCopia5 = loadImage('edu_oso_cartel.png');
        imgCopia6 = loadImage('edu_oso_cartel.png');
        imgCopia7 = loadImage('edu_oso_cartel.png');
        imgCopia8 = loadImage('edu_oso_cartel.png');
        imgCopia9 = loadImage('edu_oso_cartel.png');
    }

    function izquierda(x, y) {
        return [x - tamanoCuadrado, y];
    }

    function derecha(x, y) {
        return [x + tamanoCuadrado, y];
    }

    function arriba(x, y) {
        return [x, y - tamanoCuadrado];
    }

    function abajo(x, y) {
        return [x, y + tamanoCuadrado];
    }

    function girarDerecha(x, y) {
        return [floor(x + PI / 2), floor(y + PI / 2)];
    }

    // function setup() {
    //     folio = new Folio();

    //     let tamanoCuadrado = 31;

    //     let inicioX = img.width / 2 - 70;
    //     let finX = img.width;

    //     let inicioY = 0;
    //     let finY = img.height;

    //     img.loadPixels();

    //     for (let x = inicioX; x < finX; x += tamanoCuadrado) {
    //         for (let y = inicioY; y < finY; y += tamanoCuadrado) {
    //             let mediaRojos = 0;
    //             let mediaVerdes = 0;
    //             let mediaAzules = 0;

    //             let cuadrados = 0;

    //             for (let i = 0; i < tamanoCuadrado; i++) {
    //                 for (let j = 0; j < tamanoCuadrado; j++) {
    //                     if (x + i >= img.width || y + j >= img.height) {
    //                         continue;
    //                     }
    //                     let pixel = img.get(x + i, y + j);
    //                     let r = red(pixel);
    //                     let g = green(pixel);
    //                     let b = blue(pixel);

    //                     mediaRojos += r;
    //                     mediaVerdes += g;
    //                     mediaAzules += b;

    //                     cuadrados++;
    //                 }
    //             }

    //             mediaRojos /= cuadrados;
    //             mediaVerdes /= cuadrados;
    //             mediaAzules /= cuadrados;

    //             for (let i = 0; i < tamanoCuadrado; i++) {
    //                 for (let j = 0; j < tamanoCuadrado; j++) {
    //                     if (x + i >= img.width || y + j >= img.height) {
    //                         continue;
    //                     }
    //                     img.set(x + i, y + j, color(mediaRojos, mediaVerdes, mediaAzules));
    //                 }
    //             }
    //         }
    //     }

    //     img.updatePixels();

    //     image(img, 0, 0, folio.width, folio.height);
    // }

    var escala = 2.5;
    var ladoRombo;
    var anguloPeq;
    var anchoRombo;
    var altoRombo;


    function mascara() {
        let m = createGraphics(folio.width, folio.height);
        m.fill(0);

        return m;
    }

    function recortaRombo(maskImage) {
        maskImage.push();
        // maskImage.translate(anchoRombo / -2, altoRombo / -2);
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

        ladoRombo = 88;
        anguloPeq = PI / 3;
        anguloGrande = 2 * PI - 2 * anguloPeq;
        anchoRombo = cos(anguloPeq / 2) * ladoRombo * 2;
        altoRombo = sin(anguloPeq / 2) * ladoRombo * 2;
        console.log(anchoRombo, altoRombo, ladoRombo);

        let maskImage;

        let xInicial = 120;
        let yInicial = 130;

        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        recortaRombo(maskImage);
        imgCopia1.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial + anchoRombo, yInicial);
        recortaRombo(maskImage);
        imgCopia2.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(anguloPeq);
        recortaRombo(maskImage);
        imgCopia3.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(2 * anguloPeq);
        maskImage.translate(-anchoRombo / 2, -3 * altoRombo / 2);
        recortaRombo(maskImage);
        imgCopia4.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(anguloPeq);
        maskImage.translate(anchoRombo / 2, -3 * altoRombo / 2);
        recortaRombo(maskImage);
        imgCopia5.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(2 * anguloPeq);
        maskImage.translate(-anchoRombo, -3 * altoRombo);
        recortaRombo(maskImage);
        imgCopia6.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial + anchoRombo / 2, yInicial + ladoRombo + altoRombo / 2);
        recortaRombo(maskImage);
        imgCopia7.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(anguloPeq);
        maskImage.translate(anchoRombo, 0);
        recortaRombo(maskImage);
        imgCopia8.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(xInicial, yInicial);
        maskImage.rotate(2 * anguloPeq);
        maskImage.translate(0, -3 * altoRombo);
        recortaRombo(maskImage);
        imgCopia9.mask(maskImage);

        // image(img, 0, 0, folio.width, folio.height);
        // image(imgCopia1, 0, 0, folio.width, folio.height);
        // image(imgCopia2, 0, 0, folio.width, folio.height);
        // image(imgCopia3, 0, 0, folio.width, folio.height);
        // image(imgCopia4, 0, 0, folio.width, folio.height);
        // image(imgCopia5, 0, 0, folio.width, folio.height);
        // image(imgCopia6, 0, 0, folio.width, folio.height);
        // image(imgCopia7, 0, 0, folio.width, folio.height);
        // image(imgCopia8, 0, 0, folio.width, folio.height);
        // image(imgCopia9, 0, 0, folio.width, folio.height);

        let operaciones = [];

        // Copia 1
        operaciones.push([
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, 0],
        ]);

        // Copia 2
        operaciones.push([
            ['t', -xInicial, -yInicial],
            ['t', -3 * anchoRombo / 2, 0],
        ]);

        // Copia 3
        operaciones.push([
            ['r', -PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))],
        ]);

        // Copia 4        
        operaciones.push([
            ['r', PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
        ]);

        // Copia 5
        operaciones.push([
            ['r', -PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo, 0],
            ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))],
        ]);

        // Copia 6
        operaciones.push([
            ['r', PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo, 0],
            ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
        ]);

        // Copia 7
        operaciones.push([
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
            ['t', -anchoRombo / 2, 0],
        ]);

        // Copia 8
        operaciones.push([
            ['r', (-PI / 3)],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
            ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))]
        ]);

        // Copia 9
        operaciones.push([
            ['r', PI / 3],
            ['t', -xInicial, -yInicial],
            ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
            ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
        ]);

        // push();
        // transforma(operaciones[0]);
        // image(imgCopia1, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[1]);
        // image(imgCopia2, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[2]);
        // image(imgCopia3, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[3]);
        // image(imgCopia4, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[4]);
        // image(imgCopia5, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[5]);
        // image(imgCopia6, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[6]);
        // image(imgCopia7, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[7]);
        // image(imgCopia8, 0, 0, folio.width, folio.height);
        // pop();

        // push();
        // transforma(operaciones[8]);
        // image(imgCopia9, 0, 0, folio.width, folio.height);
        // pop();


        // fill(255, 0, 0);
        // strokeWeight(5);
        // point(xInicial, yInicial);

    }

    function draw() {

    }
</script>

<?php require('../../../../_pie.php'); ?>