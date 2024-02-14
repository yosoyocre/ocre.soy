<?php
// Generador de fotos con triángulos
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

    function preload() {
        img = loadImage('edu_oso.png');
    }

    let v0, v1, v2;

    function setup() {
        folio = new Folio();

        let nTriangulos = 9;
        // let nTriangulos = 1;
        let minLado = 150;
        let maxLado = 180;

        let triangulos = [];
        for (let i = 1; i <= nTriangulos; i++) {
            let coords = [];
            v0 = createVector(random(minLado, maxLado), 0);
            v1 = p5.Vector.rotate(v0, random(PI / 2, PI / 3));

            coords.push(0);
            coords.push(0);

            coords.push(v0.x);
            coords.push(v0.y);

            coords.push(v1.x);
            coords.push(v1.y);

            triangulos.push(coords);
        }

        console.log(triangulos);

        strokeWeight(5);
        stroke(0);
        fill(0);

        for (let i = 0; i < triangulos.length; i++) {
            let triangulo = triangulos[i];

            let x = random(folio.width / 3, folio.width * 2 / 3);
            let y = random(folio.height / 3, folio.height * 2 / 3);
            let rotacion = random(0, TWO_PI);

            push();
            translate(x, y);
            rotate(rotacion);
            triangle(
                triangulo[0], triangulo[1],
                triangulo[2], triangulo[3],
                triangulo[4], triangulo[5]
            );
            pop();

            let m = createGraphics(folio.width, folio.height);
            m.translate(x, y);
            m.rotate(rotacion);
            m.fill(0);
            m.triangle(
                triangulo[0], triangulo[1],
                triangulo[2], triangulo[3],
                triangulo[4], triangulo[5]
            );
            let nueva = img.get();
            nueva.mask(m);
            image(nueva, 0, 0, folio.width, folio.height);


            // push();
            // strokeWeight(5);
            // stroke(0, 255, 0);
            // line(triangulo[0], triangulo[1], triangulo[2], triangulo[3]);
            // stroke(0, 0, 255);
            // line(triangulo[0], triangulo[1], triangulo[4], triangulo[5]);
            // stroke(255, 0, 0);
            // point(triangulo[0], triangulo[1]);
            // pop();

        }
    }

    function draw() {

    }
</script>

<?php require('../../../../_pie.php'); ?>