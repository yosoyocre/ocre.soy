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
        let debug = 1;

        let minLado = 100;
        let maxLado = 300;
        let nLineas = 3;
        let nTriangulosPorLinea = 3;

        let limiteIzquierdo = folio.width / 4;
        let limiteDerecho = folio.width - limiteIzquierdo;
        let limiteSuperior = folio.height / 4;
        let limiteInferior = folio.height - limiteSuperior;

        let lineas = [];
        let intersecciones = [];
        let triangulos = [];

        while (lineas.length < nLineas) {
            let x1;
            let y1;

            let x2;
            let y2;
            if (random() > 0.5) {
                x1 = random(limiteIzquierdo, limiteDerecho);
                y1 = 0;

                x2 = random(limiteIzquierdo, limiteDerecho);
                y2 = folio.height;
            } else {
                x1 = 0;
                y1 = random(limiteSuperior, limiteInferior);

                x2 = folio.width;
                y2 = random(limiteSuperior, limiteInferior);
            }

            let m = (x2 - x1) / (y2 - y1);

            if (abs(m) < 0.2) {
                continue;
            }

            console.log(m);

            lineas.push([x1, y1, x2, y2]);

            if (debug) {
                let i = lineas.length - 1;
                if (i == 0) {
                    stroke(255, 0, 0);
                } else if (i == 1) {
                    stroke(0, 255, 0);
                } else if (i == 2) {
                    stroke(0, 0, 255);
                }
                line(x1, y1, x2, y2);
            }
        }


        for (let i = 0; i < lineas.length; i++) {
            let linea = lineas[i];

            let xs = [];

            let nIntentos = 0;
            let maxIntentos = 10;
            while (xs.length < nTriangulosPorLinea && nIntentos < maxIntentos) {
                nIntentos++;
                let x = random(limiteIzquierdo, limiteDerecho);
                let y = yEnLinea(linea, x);

                if (y < limiteSuperior || y > limiteInferior) {
                    continue;
                }
                xs.push(x);
            }

            xs.sort((a, b) => a - b);

            console.log(xs);

            for (let j = 0; j < nTriangulosPorLinea; j++) {
                let v1 = createVector(xs[j], yEnLinea(linea, xs[j]));

                let v2 = createVector(v1.x, v1.y);
                let v2p = createVector(linea[0] - v1.x, linea[1] - v1.y);
                push();
                translate(v2.x, v2.y);
                v2p.setMag(random(minLado, maxLado));
                v2.add(v2p);
                pop();

                let v3;
                if (random() > 0.5) {
                    v3 = createVector(v1.x, v1.y);
                } else {
                    v3 = createVector(v2.x, v2.y);
                }

                push();
                translate(v3.x, v3.y);
                let v3p = createVector(v2.x - v1.x, v2.y - v1.y);
                if (random() > 0.5) {
                    v3p.rotate(HALF_PI);
                } else {
                    v3p.rotate(-HALF_PI);
                }

                v3.add(v3p);
                pop();

                triangulos.push([v1.x, v1.y, v2.x, v2.y, v3.x, v3.y]);
            }
        }

        stroke(0);
        strokeWeight(5);

        for (let i = 0; i < triangulos.length; i++) {
            let triangulo = triangulos[i];
            let rotacion = random(0, TWO_PI);

            let x1 = triangulo[0];
            let y1 = triangulo[1];
            let x2 = triangulo[2];
            let y2 = triangulo[3];
            let x3 = triangulo[4];
            let y3 = triangulo[5];

            stroke(0);
            push();
            triangle(
                x1, y1,
                x2, y2,
                x3, y3
            );
            pop();

            let m = createGraphics(folio.width, folio.height);
            // m.translate(x, y);
            // m.rotate(rotacion);
            m.fill(0);
            m.triangle(
                x1, y1,
                x2, y2,
                x3, y3
            );
            let nueva = img.get();
            nueva.mask(m);
            image(nueva, 0, 0, folio.width, folio.height);

            stroke(255, 0, 0);
            point(x1, y1);
            stroke(0, 255, 0);
            point(x2, y2);
            stroke(0, 0, 255);
            point(x3, y3);
        }
    }

    function draw() {

    }
</script>

<?php require('../../../../_pie.php'); ?>