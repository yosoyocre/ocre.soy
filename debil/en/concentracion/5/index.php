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
<script src="https://cdn.jsdelivr.net/gh/kchapelier/poisson-disk-sampling@2.3.1/build/poisson-disk-sampling.min.js"></script>
<script src="https://unpkg.com/delaunator@5.0.0/delaunator.min.js"></script>

<script>
    var folio;
    var img;

    function preload() {
        img = loadImage('edu_ampliado.png');
    }

    let v0, v1, v2;

    function yEnLinea(linea, x) {
        let m = (linea[3] - linea[1]) / (linea[2] - linea[0]);
        let n = linea[1] - m * linea[0];
        return m * x + n;
    }

    function setup() {
        folio = new Folio();

        let conFondo = true;
        let conContenido = true;
        let debug = 0;

        let minLado = 200;
        let maxLado = 300;
        let nLineas = 3;
        let nPuntosPorLinea = 3;

        let limiteIzquierdo = folio.width / 6;
        // let limiteIzquierdo = 0;
        let limiteDerecho = folio.width - limiteIzquierdo;
        let limiteSuperior = folio.height / 6;
        // let limiteSuperior = 0;
        let limiteInferior = folio.height - limiteSuperior;

        let puntos = [];
        let triangulos = [];

        let p = new PoissonDiskSampling({
            shape: [limiteDerecho - limiteIzquierdo, limiteInferior - limiteSuperior],
            minDistance: minLado,
            maxDistance: maxLado,
            tries: 10
        });
        let puntosPds = p.fill();

        for (let i = 0; i < puntosPds.length; i++) {
            let x = puntosPds[i][0] + limiteIzquierdo;
            let y = puntosPds[i][1] + limiteSuperior;
            puntos.push([x, y]);
        }

        if (debug) {
            stroke(0);
            strokeWeight(10);
            for (let i = 0; i < puntos.length; i++) {
                point(puntos[i][0], puntos[i][1]);
            }
        }

        const delaunay = Delaunator.from(puntos);

        stroke(0);
        strokeWeight(5);

        let maxMargen = 10;

        for (let i = 0; i < delaunay.triangles.length; i = i + 3) {
            let rotacion = random(0, PI / 20);
            // let rotacion = 0;
            let margenX = random(-maxMargen, maxMargen);
            let margenY = random(-maxMargen, maxMargen);

            let x1 = puntos[delaunay.triangles[i]][0];
            let y1 = puntos[delaunay.triangles[i]][1];
            let x2 = puntos[delaunay.triangles[i + 1]][0];
            let y2 = puntos[delaunay.triangles[i + 1]][1];
            let x3 = puntos[delaunay.triangles[i + 2]][0];
            let y3 = puntos[delaunay.triangles[i + 2]][1];

            if (debug) {
                console.log(x1, y1, x2, y2, x3, y3);
                push();
                stroke(200, 200, 200);
                noFill();
                triangle(
                    x1, y1,
                    x2, y2,
                    x3, y3
                );
                pop();
            }

            push();
            stroke(0);
            translate(x1, y1);
            rotate(rotacion);
            translate(-x1, -y1);
            translate(-margenX, -margenY);
            triangle(
                x1, y1,
                x2, y2,
                x3, y3
            );
            pop();

            let m = createGraphics(folio.width, folio.height);
            m.translate(x1, y1);
            m.rotate(rotacion);
            m.translate(-x1, -y1);
            m.translate(-margenX, -margenY);
            m.fill(0);
            m.triangle(
                x1, y1,
                x2, y2,
                x3, y3
            );
            let nueva = img.get();
            nueva.mask(m);
            image(nueva, 0, 0, folio.width, folio.height);

            if (debug) {
                stroke(255, 0, 0);
                point(x1, y1);
                stroke(0, 255, 0);
                point(x2, y2);
                stroke(0, 0, 255);
                point(x3, y3);
            }
        }
    }

    function draw() {

    }
</script>

<?php require('../../../../_pie.php'); ?>