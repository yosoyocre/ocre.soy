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
<script src="js/boundary.js"></script>
<script src="js/circle.js"></script>
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
    let circles = [];
    let boundaries = [];

    function setup() {
        folio = new Folio();
        engine = Engine.create();
        world = engine.world;
        boundaries.push(new Boundary(0, folio.height / 2, 50, folio.height, 0));
        boundaries.push(new Boundary(folio.width, folio.height / 2, 50, folio.height, 0));
        boundaries.push(new Boundary(folio.width / 2, folio.height, folio.width, 50, 0));
    }

    function mouseDragged() {
        circles.push(new Circle(mouseX, mouseY, random(5, 10)));
    }

    function draw() {
        background(51);
        Engine.update(engine);
        for (let i = 0; i < circles.length; i++) {
            circles[i].show();
        }
        for (let i = 0; i < boundaries.length; i++) {
            boundaries[i].show();
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>