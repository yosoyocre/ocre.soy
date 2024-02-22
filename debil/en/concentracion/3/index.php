<?php
// Generador de carteles con fuego
?>
<?php require('../../../../_cabecera.php'); ?>

<link rel="stylesheet" href="../css/comun.css">

<div class="row">
    <div class="col-lg-12">
        <?php breadcrumb(); ?>
        <p>
            Generador de carteles motivacionales con la letra de "Estoy fatal".
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
    'Inspiración' => '<a href="https://www.instagram.com/p/CuDwiv_Jstb/?img_index=3">Este cartel</a> del <a href="https://www.instagram.com/mccarthydesign">Instagram de McCarthy Design studio</a>'
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

    let frases = [
        'SI NO TE GUSTA\nTU VIDA\n\nDEBERÍAS CAMBIAR\nDE BEBIDA',
        'SI TE PARECE\nUNA PESADILLA\n\nDEBERÍAS\nAPROVECHAR\nMIS CUCHILLAS',
        'SI TE INUNDA\nEL RIDÍCULO\n\nDEBERÍAS ROMPER\nALGO BONITO',
        'SI NO SABES BIEN\nCÓMO TE SIENTES\n\nPOR NADA\nDEL MUNDO\nLO COMPARTAS\nCON LA GENTE'
    ]
    let nFrase = -1;

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
                // negro = paleta.shift();

                shuffle(paleta, true);

                fondo = color(paleta[0]);
                colorLlama = color(paleta[1]);
                colorLetras = color(paleta[1]);
                // colorLetras = brightness(fondo) > 88 ? negro : color(255);

                nFrase = (nFrase + 1) % frases.length;

                IMAGEN_DIBUJADA = true;
            }

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
            text(frases[nFrase], TAMANO_PIXEL, posicionTexto);
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>