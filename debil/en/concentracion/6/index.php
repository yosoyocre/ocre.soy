<?php
// Generador de carteles con letras cayendo
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
    <div class="col-lg-6">
        <main></main>
    </div>
    <div class="col-lg-6">
        <div id="matter"></div>
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
<script src="../js/matter.min.js"></script>
<script src="js/letra.js"></script>
<script src="js/limite.js"></script>
<script>
    var folio;
    var font;

    const {
        Engine,
        World,
        Bodies,
        Body,
        Composite,
        Vertices,
        Render
    } = Matter;

    var engine;
    var world;
    var palabra = 'ocre';
    var limites = [];
    var letras = [];

    function preload() {
        font = loadFont('Fredoka-SemiBold.ttf');
    }

    function setup() {
        folio = new Folio();
    }

    function draw() {
        if (!IMAGEN_DIBUJADA) {
            let tamanoLimite = 50;

            engine = Engine.create();
            world = engine.world;

            // create renderer
            var render = Render.create({
                element: document.getElementById('matter'),
                engine: engine,
                options: {
                    width: folio.width,
                    height: folio.height,
                }
            });

            Render.run(render);

            limites = [];
            // Límite izquierda
            limites.push(new Limite(tamanoLimite / -2 + 2, folio.height / 2, tamanoLimite, folio.height * 2, 0, world));
            // Límite derecha
            limites.push(new Limite(folio.width + tamanoLimite / 2 - 2, folio.height / 2, tamanoLimite, folio.height * 2, 0, world));
            // Límite abajo
            limites.push(new Limite(folio.width / 2, folio.height + tamanoLimite / 2, folio.width, tamanoLimite, 0, world));

            letras = [];

            for (let i = 0; i < palabra.length; i++) {
                let letra = new Letra(palabra[i], font, random(0, folio.width), 400, 250, world);
                letras.push(letra);
            }

            IMAGEN_DIBUJADA = true;
        }

        background(255);
        Engine.update(engine);
        for (let letra of letras) {
            letra.show();
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>