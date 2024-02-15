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

    function setup() {
        folio = new Folio();

        let conFondo = true;
        let conContenido = true;
        let debug = true;

        let minLado = 200;
        let maxLado = 300;

        let limiteIzquierdo = folio.width / 4;
        let limiteDerecho = folio.width - limiteIzquierdo;
        let limiteSuperior = folio.height / 4;
        let limiteInferior = folio.height - limiteSuperior;

        // var p = new PoissonDiskSampling({
        //     shape: [limiteDerecho - limiteIzquierdo, limiteInferior - limiteSuperior],
        //     minDistance: maxLado / 3,
        //     maxDistance: maxLado * 2,
        //     tries: 10
        // });
        // var puntos = p.fill();

        // let nTriangulos = puntos.length;

        // let triangulos = [];
        // for (let i = 1; i <= nTriangulos; i++) {
        //     let coords = [];
        //     // En P5, los vectores se crean con base en el origen de coordenadas (0 , 0)
        //     v0 = createVector(random(minLado, maxLado), 0);
        //     v1 = p5.Vector.rotate(v0, random(PI / 2, PI / 3));

        //     coords.push(0);
        //     coords.push(0);

        //     coords.push(v0.x);
        //     coords.push(v0.y);

        //     coords.push(v1.x);
        //     coords.push(v1.y);

        //     triangulos.push(coords);
        // }

        // strokeWeight(5);
        // stroke(0);
        // fill(0);

        // if (debug) {
        //     push();
        //     tint(255, 255 / 4);
        //     image(img, 0, 0, folio.width, folio.height);
        //     pop();
        // }

        // for (let i = 0; i < triangulos.length; i++) {
        //     let triangulo = triangulos[i];

        //     let x = puntos[i][0] + limiteIzquierdo;
        //     let y = puntos[i][1] + limiteSuperior;
        //     let rotacion = random(0, TWO_PI);

        //     if (conFondo) {
        //         push();
        //         translate(x, y);
        //         rotate(rotacion);
        //         triangle(
        //             triangulo[0], triangulo[1],
        //             triangulo[2], triangulo[3],
        //             triangulo[4], triangulo[5]
        //         );
        //         pop();
        //     }

        //     if (conContenido) {
        //         let m = createGraphics(folio.width, folio.height);
        //         m.translate(x, y);
        //         m.rotate(rotacion);
        //         m.fill(0);
        //         m.triangle(
        //             triangulo[0], triangulo[1],
        //             triangulo[2], triangulo[3],
        //             triangulo[4], triangulo[5]
        //         );
        //         let nueva = img.get();
        //         nueva.mask(m);
        //         image(nueva, 0, 0, folio.width, folio.height);
        //     }
        // }

        // if (debug) {
        //     // DEBUG límites
        //     push();
        //     stroke(0);
        //     strokeWeight(1);
        //     line(limiteIzquierdo, 0, limiteIzquierdo, folio.height);
        //     line(limiteDerecho, 0, limiteDerecho, folio.height);
        //     line(0, limiteSuperior, folio.width, limiteSuperior);
        //     line(0, limiteInferior, folio.width, limiteInferior);
        //     pop();

        //     for (let i = 0; i < triangulos.length; i++) {
        //         let x = puntos[i][0] + limiteIzquierdo;
        //         let y = puntos[i][1] + limiteSuperior;

        //         // DEBUG de puntos de origen
        //         push();
        //         translate(x, y);
        //         stroke(0, 255, 0);
        //         strokeWeight(10);
        //         point(0, 0);
        //         pop();
        //     }
        // }

        function intersect_point(point1, point2, point3, point4) {
            const ua = ((point4[0] - point3[0]) * (point1[1] - point3[1]) -
                    (point4[1] - point3[1]) * (point1[0] - point3[0])) /
                ((point4[1] - point3[1]) * (point2[0] - point1[0]) -
                    (point4[0] - point3[0]) * (point2[1] - point1[1]));

            const ub = ((point2[0] - point1[0]) * (point1[1] - point3[1]) -
                    (point2[1] - point1[1]) * (point1[0] - point3[0])) /
                ((point4[1] - point3[1]) * (point2[0] - point1[0]) -
                    (point4[0] - point3[0]) * (point2[1] - point1[1]));

            const x = point1[0] + ua * (point2[0] - point1[0]);
            const y = point1[1] + ua * (point2[1] - point1[1]);

            return [x, y]
        }

        let lineas = [];
        let intersecciones = [];

        for (let i = 0; i < 4; i++) {
            let x1;
            let y1;

            let x2;
            let y2;
            if (random() > 0.5) {
                x1 = random(0, folio.width);
                y1 = 0;

                x2 = random(0, folio.width);
                y2 = folio.height;
            } else {
                x1 = 0;
                y1 = random(0, folio.height);

                x2 = folio.width;
                y2 = random(0, folio.height);
            }

            lineas.push([x1, y1, x2, y2]);
        }

        for (let i = 0; i < lineas.length; i++) {
            for (let j = i + 1; j < lineas.length; j++) {
                let interseccion = intersect_point([lineas[i][0], lineas[i][1]], [lineas[i][2], lineas[i][3]], [lineas[j][0], lineas[j][1]], [lineas[j][2], lineas[j][3]]);
                if (interseccion[0] > 0 && interseccion[0] < folio.width && interseccion[1] > 0 && interseccion[1] < folio.height) {
                    intersecciones.push(interseccion);
                }
            }
        }

        if (debug) {
            stroke(255, 255, 0);
            strokeWeight(5);
            for (let i = 0; i < lineas.length; i++) {
                line(lineas[i][0], lineas[i][1], lineas[i][2], lineas[i][3]);
            }
        }

        if (debug) {
            stroke(255, 0, 0);
            strokeWeight(10);
            for (let i = 0; i < intersecciones.length; i++) {
                point(intersecciones[i][0], intersecciones[i][1]);
            }
        }

        var p = new PoissonDiskSampling({
            shape: [limiteDerecho - limiteIzquierdo, limiteInferior - limiteSuperior],
            minDistance: maxLado / 3,
            maxDistance: maxLado * 2,
            tries: 10
        });
        var puntos = p.fill();

        if (debug) {
            stroke(0, 255, 0);
            strokeWeight(10);
            for (let i = 0; i < puntos.length; i++) {
                point(puntos[i][0] + limiteIzquierdo, puntos[i][1] + limiteSuperior);
            }
        }

        stroke(0, 0, 255);
        strokeWeight(10);

        let triangulos = [];
        let maxIntentos = 10;
        let intentos;

        for (let i = 0; i < puntos.length; i++) {
            let x1 = puntos[i][0] + limiteIzquierdo;
            let y1 = puntos[i][1] + limiteSuperior;

            let interseccion1 = random(intersecciones);
            let x2 = interseccion1[0];
            let y2 = interseccion1[1];

            let interseccion2;
            let x3;
            let y3;

            intentos = 0;
            do {
                interseccion2 = random(intersecciones);
                x3 = interseccion2[0];
                y3 = interseccion2[1];
                intentos++;
            } while (x2 == x3 && y2 == y3 && intentos < maxIntentos);

            triangulos.push([x1, y1, x2, y2, x3, y3]);

            if (debug) {
                triangle(
                    x1, y1,
                    x2, y2,
                    x3, y3
                );
            }
        }

        console.log(triangulos);

        stroke(0);
        strokeWeight(5);

        let margenMov = 10;

        for (let i = 0; i < triangulos.length; i++) {
            let triangulo = triangulos[i];
            let rotacion = random(0, TWO_PI);

            let x1 = triangulo[0] + random(-margenMov, margenMov);
            let y1 = triangulo[1] + random(-margenMov, margenMov);
            let x2 = triangulo[2] + random(-margenMov, margenMov);
            let y2 = triangulo[3] + random(-margenMov, margenMov);
            let x3 = triangulo[4] + random(-margenMov, margenMov);
            let y3 = triangulo[5] + random(-margenMov, margenMov);

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
        }
    }

    function draw() {

    }
</script>

<?php require('../../../../_pie.php'); ?>