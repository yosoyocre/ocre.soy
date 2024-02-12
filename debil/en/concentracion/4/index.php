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
    var imgCopia1;
    var imgCopia2;
    var tamanoCuadrado = 125;

    function preload() {
        img = loadImage('edu_oso_cartel.png');
        imgCopia1 = loadImage('edu_oso_cartel.png');
        imgCopia2 = loadImage('edu_oso_cartel.png');
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
    var anchoRombo = 376 / escala;
    var altoRombo = 220 / escala;
    var ladoRombo;

    console.log(anchoRombo, altoRombo, ladoRombo);

    function mascara() {
        let m = createGraphics(folio.width, folio.height);
        m.fill(0);

        return m;
    }

    function recortaRombo(maskImage) {
        maskImage.quad(anchoRombo / 2, 0, anchoRombo, altoRombo / 2, anchoRombo / 2, altoRombo, 0, altoRombo / 2);
    }

    function setup() {
        folio = new Folio();

        ladoRombo = dist(0, altoRombo / 2, anchoRombo / 2, altoRombo);

        let maskImage;

        maskImage = mascara();
        maskImage.translate(200, 200);
        recortaRombo(maskImage);
        imgCopia1.mask(maskImage);

        maskImage = mascara();
        maskImage.translate(200 + anchoRombo, 200);
        recortaRombo(maskImage);
        imgCopia2.mask(maskImage);

        image(img, 0, 0, folio.width, folio.height);
        image(imgCopia1, -50, -80, folio.width, folio.height);
        image(imgCopia2, -50, -80 + ladoRombo, folio.width, folio.height);
        // fill(255, 0, 0);
        // square(200, 200, 10);

    }

    function draw() {

    }
</script>

<?php require('../../../../_pie.php'); ?>