<?php
// Generador de carteles con cajas y físicas
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
    'Inspiración' => '<a href="https://www.instagram.com/p/CoqyfDwyrMY/">Este cartel</a> del <a href="https://www.instagram.com/hdu23_lab/">Instagram de HDU²³ Lab</a>'
]);
?>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<script src="../js/comun.js"></script>
<script src="../js/matter.min.js"></script>
<script src="js/limite.js"></script>
<script src="js/caja.js"></script>
<script>
    var folio;

    const {
        Engine,
        World,
        Bodies,
        Composite
    } = Matter;

    let engine;
    let world;
    let cajas = [];
    let limites = [];

    function setup() {
        folio = new Folio();
        engine = Engine.create();
        world = engine.world;

        let tamanoLimite = 50;

        // Límite izquierda
        limites.push(new Limite(tamanoLimite / -2, folio.height / 2, tamanoLimite, folio.height * 2, 0));
        // Límite derecha
        limites.push(new Limite(folio.width + tamanoLimite / 2, folio.height / 2, tamanoLimite, folio.height * 2, 0));
        // Límite abajo
        limites.push(new Limite(folio.width / 2, folio.height + tamanoLimite / 2, folio.width, tamanoLimite, 0));

        let paleta = ["131313", "DB898D", "005747", "4162AB", "E56C03", "582B5F", "DC3B26", "D8D6D7"];

        for (i = 0; i < 100; i++) {
            let anchoCaja = random(50, 100);
            let largoCaja = random(50, 100);
            cajas.push(new Caja(random(folio.width), random(-500, -1000), anchoCaja, largoCaja, random(paleta)));
        }

        textFont('futura-pt', 800);
        textSize(50);
        textStyle(BOLD);
    }

    function draw() {
        if (FUENTES_CARGADAS) {
            background(255);
            Engine.update(engine);
            for (let i = 0; i < cajas.length; i++) {
                cajas[i].show();
            }
            for (let i = 0; i < limites.length; i++) {
                limites[i].show();
            }

            push();
            stroke(255);
            fill(255);
            text('Sufjan Stevens + Ocre', 50, 2 * folio.height / 3);
            pop();
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>