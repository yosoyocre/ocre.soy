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
    var paleta;
    var negro;
    var fondo;
    var colorLlama;
    var colorLetras;
    let anchoVideo;
    let altoVideo;
    let initY;
    let initX;

    function setup() {
        folio = new Folio();

        anchoVideo = folio.width * 4;
        altoVideo = anchoVideo * altoRealVideo / anchoRealVideo;

        vid = createVideo("fuego_144p.mp4");
        vid.size(anchoVideo, altoVideo);
        vid.volume(0);
        vid.loop();
        vid.hide(); // hides the html video loader

        textFont('futura-pt', 800);
        textStyle(BOLD);
        drawingContext.letterSpacing = "-3px";

        initY = 300;
        initX = floor(random(500, 1500));
    }

    function draw() {
        if (FUENTES_CARGADAS) {

            if (!IMAGEN_DIBUJADA) {
                paleta = random(PALETAS_CHULAS).slice(0);
                negro = paleta.shift();

                shuffle(paleta, true);

                fondo = color(paleta[0]);
                colorLlama = color(paleta[1]);
                colorLetras = brightness(fondo) > 80 ? negro : color(255);

                IMAGEN_DIBUJADA = true;
            }

            select('canvas').elt.style.letterSpacing = "10px";

            fill(fondo);
            rect(0, 0, folio.width, folio.height);

            vid.loadPixels();
            const stepSize = TAMANO_PIXEL;

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

            let posicionTexto;
            push();
            stroke(colorLetras);
            fill(colorLetras);
            textSize(70);
            textLeading(60);
            posicionTexto = folio.height / 5;
            text('SUFJAN STEVENS\n+ OCRE', TAMANO_PIXEL, posicionTexto);

            textSize(40);
            textLeading(38);
            posicionTexto = posicionTexto + 150;
            text('1 DE MARZO DE 2024\nA REVOLT-EIRA', TAMANO_PIXEL, posicionTexto);
            pop();
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>