<?php
// Generador de imágenes alteradas por cubos
?>
<?php require('../../../../_cabecera.php'); ?>

<link rel="stylesheet" href="../css/comun.css">

<div class="row">
    <div class="col-lg-12">
        <?php breadcrumb(); ?>
        <p>
            Pruebo ideas para fotos promocionales. <br>En este caso, altero una foto mía con una especie de efecto caleidoscópico.
        </p>
        <p>
            Pulsa en la imagen para descargarla. <br>Y si quieres generar otra <a class="js-otro-poster" href="#">pulsa aquí</a>.
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
    'Foto' => '<a href="https://www.instagram.com/calisadas/">Calís</a>, <a href="https://www.instagram.com/goodnight.mr.martinez/">Jorge</a> y Mamá',
    'Inspiración' => '<a href="https://www.instagram.com/reel/C1owf3Fr9Nv/">Este vídeo</a> del <a href="https://www.instagram.com/kensukekoike">Instagram de Kensuke Koike</a>'
]);
?>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<script src="../js/comun.js"></script>
<script>
    var folio;
    var img;
    var nRombos = 9;
    var copias = [];
    var imagenes = [];

    function preload() {
        // Cargamos todos las posibles imágenes
        for (i = 1; i <= 3; i++) {
            let nombreImg = 'edu_' + i + '.png';

            let copiasImagenes = [];
            for (let j = 0; j < nRombos + 1; j++) {
                copiasImagenes.push(loadImage(nombreImg));
            }

            imagenes.push(copiasImagenes);
        }
    }

    var ladoRombo;
    var anguloPeq;
    var anchoRombo;
    var altoRombo;

    var operaciones = [];
    var nuevasOperaciones = [];

    /**
     * Crea una máscara vacía
     * 
     * @returns {p5.Graphics}
     */
    function mascara() {
        let m = createGraphics(folio.width, folio.height);
        m.fill(0);

        return m;
    }

    /**
     * Recorta un rombo en una máscara
     * 
     * @param {p5.Graphics} maskImage
     * 
     * @returns {void}
     */
    function recortaRombo(maskImage) {
        maskImage.push();
        maskImage.translate(0, altoRombo / -2);
        maskImage.quad(anchoRombo / 2, 0, anchoRombo, altoRombo / 2, anchoRombo / 2, altoRombo, 0, altoRombo / 2);
        maskImage.pop();
    }

    /**
     * Aplica una serie de operaciones a la imagen
     * 
     * @param {Array} operaciones
     * @param {boolean} alReves Si es true, se aplican las operaciones en orden inverso
     * 
     * @returns {void}
     */
    function transforma(operaciones, alReves = false) {
        let signo = alReves ? -1 : 1;
        if (alReves) {
            operaciones = operaciones.slice().reverse();
        }

        for (let o = 0; o < operaciones.length; o++) {
            let operacion = operaciones[o];
            if (operacion[0] === 't') {
                translate(signo * operacion[1], signo * operacion[2]);
            } else {
                rotate(signo * operacion[1]);
            }
        }
    }

    function setup() {
        folio = new Folio();

        ladoRombo = 120;
        anguloPeq = PI / 3;
        anguloGrande = 2 * PI - 2 * anguloPeq;
        anchoRombo = cos(anguloPeq / 2) * ladoRombo * 2;
        altoRombo = sin(anguloPeq / 2) * ladoRombo * 2;
    }

    function draw() {
        if (!IMAGEN_DIBUJADA) {
            copias = random(imagenes).slice();
            img = copias.shift();

            function ordenaDistintos(lista) {
                let nuevaLista = shuffle(lista);

                for (let i = 0; i < lista.length; i++) {
                    if (lista[i] === nuevaLista[i]) {
                        return ordenaDistintos(lista);
                    }
                }

                return nuevaLista;
            }

            let maskImage;

            let xCentro = folio.width / 2;
            let yCentro = folio.height / 2;

            let xInicial = xCentro - anchoRombo;
            let yInicial = yCentro - altoRombo;

            // Máscara 1
            maskImage = mascara();
            maskImage.translate(xInicial, yInicial);
            recortaRombo(maskImage);
            copias[0].mask(maskImage);

            // Máscara 2
            maskImage = mascara();
            maskImage.translate(xInicial + anchoRombo, yInicial);
            recortaRombo(maskImage);
            copias[1].mask(maskImage);

            // Máscara 3
            maskImage = mascara();
            maskImage.translate(xInicial, yInicial);
            maskImage.rotate(anguloPeq);
            recortaRombo(maskImage);
            copias[2].mask(maskImage);

            // Máscara 4
            maskImage = mascara();
            maskImage.translate(xInicial, yInicial);
            maskImage.rotate(2 * anguloPeq);
            maskImage.translate(-anchoRombo / 2, -3 * altoRombo / 2);
            recortaRombo(maskImage);
            copias[3].mask(maskImage);

            // Máscara 5
            maskImage = mascara();
            maskImage.translate(xInicial, yInicial);
            maskImage.rotate(anguloPeq);
            maskImage.translate(anchoRombo / 2, -3 * altoRombo / 2);
            recortaRombo(maskImage);
            copias[4].mask(maskImage);

            // Máscara 6
            maskImage = mascara();
            maskImage.translate(xInicial, yInicial);
            maskImage.rotate(2 * anguloPeq);
            maskImage.translate(-anchoRombo, -3 * altoRombo);
            recortaRombo(maskImage);
            copias[5].mask(maskImage);

            // Máscara 7
            maskImage = mascara();
            maskImage.translate(xInicial + anchoRombo / 2, yInicial + ladoRombo + altoRombo / 2);
            recortaRombo(maskImage);
            copias[6].mask(maskImage);

            // Máscara 8
            maskImage = mascara();
            maskImage.translate(xInicial, yInicial);
            maskImage.rotate(anguloPeq);
            maskImage.translate(anchoRombo, 0);
            recortaRombo(maskImage);
            copias[7].mask(maskImage);

            // Máscara 9
            maskImage = mascara();
            maskImage.translate(xInicial, yInicial);
            maskImage.rotate(2 * anguloPeq);
            maskImage.translate(0, -3 * altoRombo);
            recortaRombo(maskImage);
            copias[8].mask(maskImage);

            operaciones = [];

            // Rombo 1
            operaciones.push([
                ['t', -xInicial, -yInicial],
                ['t', -anchoRombo / 2, 0],
            ]);

            // Rombo 2
            operaciones.push([
                ['t', -xInicial, -yInicial],
                ['t', -3 * anchoRombo / 2, 0],
            ]);

            // Rombo 3
            operaciones.push([
                ['r', -PI / 3],
                ['t', -xInicial, -yInicial],
                ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))],
            ]);

            // Rombo 4        
            operaciones.push([
                ['r', PI / 3],
                ['t', -xInicial, -yInicial],
                ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
            ]);

            // Rombo 5
            operaciones.push([
                ['r', -PI / 3],
                ['t', -xInicial, -yInicial],
                ['t', -anchoRombo, 0],
                ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))],
            ]);

            // Rombo 6
            operaciones.push([
                ['r', PI / 3],
                ['t', -xInicial, -yInicial],
                ['t', -anchoRombo, 0],
                ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
            ]);

            // Rombo 7
            operaciones.push([
                ['t', -xInicial, -yInicial],
                ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
                ['t', -anchoRombo / 2, 0],
            ]);

            // Rombo 8
            operaciones.push([
                ['r', (-PI / 3)],
                ['t', -xInicial, -yInicial],
                ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
                ['t', -(cos(PI / 2 - anguloPeq / 2) * anchoRombo / 2), -(anchoRombo / 2 * cos(anguloPeq / 2))]
            ]);

            // Rombo 9
            operaciones.push([
                ['r', PI / 3],
                ['t', -xInicial, -yInicial],
                ['t', -anchoRombo / 2, -altoRombo / 2 - ladoRombo],
                ['t', -(anchoRombo / 2 + sin(anguloGrande / 2) * altoRombo / 2), -(altoRombo / 2 - cos(anguloGrande / 2) * altoRombo / 2)],
            ]);

            nuevasOperaciones = ordenaDistintos(operaciones);

            image(img, 0, 0, folio.width, folio.height);

            for (let i = 0; i < nRombos; i++) {
                push();
                transforma(nuevasOperaciones[i], true);
                // rotate(map(mouseX, 0, width, 0, 2 * PI));
                if (random() > 0.5) {
                    rotate(PI);
                }
                transforma(operaciones[i]);
                image(copias[i], 0, 0, folio.width, folio.height);
                pop();
            }

            IMAGEN_DIBUJADA = true;
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>