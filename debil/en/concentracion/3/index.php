<?php
// Generador de carteles con fuego
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
    var particles = [];
    let anchoRealVideo = 256;
    let altoRealVideo = 144;
    var TAMANO_PIXEL = 25;
    var fondo;
    var colorLlama;
    let anchoVideo;
    let altoVideo;

    function setup() {
        fondo = color('#ba58fe');
        colorLlama = color('#ff5fc7');
        folio = new Folio();

        anchoVideo = folio.width * 4;
        altoVideo = anchoVideo * altoRealVideo / anchoRealVideo;

        vid = createVideo("fuego_144p.mp4");
        vid.size(anchoVideo, altoVideo);
        vid.volume(0);
        vid.loop();
        vid.hide(); // hides the html video loader
        let img = vid.get();
        console.log(img);
    }

    function draw() {
        fill(fondo);
        rect(0, 0, folio.width, folio.height);

        vid.loadPixels();
        const stepSize = TAMANO_PIXEL;

        let initY = 300;
        let initX = 500;

        noStroke();
        fill(colorLlama);

        for (let y = initY; y < (initY + folio.height); y += stepSize) {
            for (let x = initX; x < (initX + folio.width); x += stepSize) {
                const i = y * anchoVideo + x;
                const darkness = (255 - vid.pixels[i * 4]) / 255;

                if (darkness < 0.5) {
                    rect(x - initX, y - initY, stepSize, stepSize);
                }
            }
        }

        // Márgenes
        fill(fondo);
        // Izquierda
        rect(0, 0, TAMANO_PIXEL, folio.height);
        // Arriba
        rect(TAMANO_PIXEL, 0, folio.width, TAMANO_PIXEL);
        // Derecha
        rect(folio.width - TAMANO_PIXEL, 0, TAMANO_PIXEL, folio.height);
        // Abajo
        rect(TAMANO_PIXEL, folio.height - TAMANO_PIXEL, folio.width, TAMANO_PIXEL);
    }
</script>

<?php require('../../../../_pie.php'); ?>