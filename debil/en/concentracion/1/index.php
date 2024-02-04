<?php
// Generador de carteles con cuadrados
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
    'Inspiración' => '<a href="https://www.instagram.com/p/CwNbI3CtjTV/">Este cartel</a> del <a href="https://www.instagram.com/extraset.ch/">Instagram de Extraset</a>'
]);
?>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<script src="../js/comun.js"></script>
<script>
    var folio;

    function setup() {
        folio = new Folio();
    }

    function draw() {
        if (!IMAGEN_DIBUJADA) {
            if (FUENTES_CARGADAS) {
                let cols = 16;
                let rows = 24;

                let minTira = 2
                let maxTira = 4;

                let wCuadrado = folio.width / cols;
                let hCuadrado = folio.height / rows;

                let negro = "131313";
                let paleta = ["DB898D", "005747", "4162AB", "E56C03", "582B5F", "DC3B26"];
                let blanco = "D8D6D7";

                let posiblesFrases = [
                    ['sufjan stevens + ocre', 'concerto', 'acéfala', '1 MARZO', '2024'],
                    ['Laurie Anderson + ocre', 'concerto', 'a revolteira', '1 MARZO', '2024'],
                    ['Bon Iver + ocre', 'concerto', 'liceo mutante', '1 MARZO', '2024']
                ];

                let frases = random(posiblesFrases);

                shuffle(paleta, true);

                let colores = [paleta[0], paleta[1], blanco];

                noStroke();
                textFont('futura-pt', 800);
                textSize(wCuadrado);
                textAlign(CENTER);
                textStyle(BOLD);


                let coloresPrincipales = [];
                let coloresSecundarios = [];
                let coloresLetras = [];
                let grados = [];

                // Elegimos los colores y los grados de mezcla de los cuadrados
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        if (!coloresPrincipales[i]) {
                            coloresPrincipales[i] = [];
                            coloresSecundarios[i] = [];
                            coloresLetras[i] = [];
                            grados[i] = [];
                        }
                        let color = coloresPrincipales[i][j];

                        let coloresCuadrado = shuffle(colores);

                        if (!color) {
                            if (i == 0 || coloresPrincipales[i - 1][j] != negro) {
                                if (j == 0 || coloresPrincipales[i][j - 1] != negro) {
                                    if (random() > .75) {
                                        // Si toca negro, pintamos una línea negra hacia abajo de tamaño random
                                        color = negro;
                                        let tamano = random(minTira, maxTira);
                                        for (let k = 0; k < tamano; k++) {
                                            if (j + k >= rows) {
                                                break;
                                            }
                                            coloresPrincipales[i][j + k] = color;
                                            grados[i][j + k] = k + 1;
                                        }
                                    }
                                }
                            }
                        }

                        if (!color) {
                            color = coloresCuadrado[0];
                        }

                        if (!grados[i][j]) {
                            grados[i][j] = 1;
                        }

                        coloresPrincipales[i][j] = color;
                        coloresSecundarios[i][j] = coloresCuadrado[1];
                        coloresLetras[i][j] = coloresCuadrado[2];
                    }
                }

                // Pintamos los cuadrados
                for (let i = 0; i < folio.width; i++) {
                    for (let j = 0; j < folio.height; j++) {

                        let x = floor(i / wCuadrado);
                        let y = floor(j / hCuadrado);

                        let grado = grados[x][y];
                        let colorPrincipal = coloresPrincipales[x][y];
                        let colorSecundario = coloresSecundarios[x][y];

                        let proporcion = grado / (4 * maxTira);

                        if (random() > proporcion) {
                            fill('#' + colorPrincipal);
                        } else {
                            fill('#' + colorSecundario);
                        }
                        rect(i, j, 1, 1);
                    }
                }

                // Situamos los textos en los cuadrados
                let x = 0;
                let y = 0;

                let arrayLetras = [];
                for (let i = 0; i < cols; i++) {
                    arrayLetras[i] = [];
                    for (let j = 0; j < rows; j++) {
                        arrayLetras[i][j] = '';
                    }
                }

                for (let f = 0; f < frases.length; f++) {
                    let arrayLetrasCopia = copiaArray(arrayLetras);

                    let frase = frases[f];
                    console.log(frase);

                    let fraseEscrita = false;

                    // Por si acaso, limitamos el número de ciclos que puede dar el loop
                    let ciclos = 0;

                    while (!fraseEscrita && ciclos < 1000) {

                        ciclos++;
                        fraseEscrita = true;

                        x = floor(random(0, cols - 1));
                        y = floor(random(0, rows - 1));

                        cambiamosX = random() > .5;

                        for (let i = 0; i < frase.length; i++) {
                            console.log(x, y, frase[i]);

                            if (x >= 0 && x <= cols - 1 && y >= 0 && y <= rows - 1 &&
                                arrayLetras[x][y] == '' &&
                                // Las letras de palabras distintas no pueden tocarse
                                (x == 0 || arrayLetras[x - 1][y] == '') &&
                                (y == 0 || arrayLetras[x][y - 1] == '') &&
                                (x == cols - 1 || arrayLetras[x + 1][y] == '') &&
                                (y == rows - 1 || arrayLetras[x][y + 1] == '')) {

                                arrayLetrasCopia[x][y] = frase[i];

                                // Para evitar demasiado zigzagueo, usamos una distribución normal
                                // para decidir si cambiamos de eje o no
                                if (randomGaussian() > .5) {
                                    cambiamosX = !cambiamosX;
                                }

                                if (cambiamosX) {
                                    x = x + 1;
                                } else {
                                    y = y + 1;
                                }
                            } else {
                                // Si la frase no cabe en un determinado momento, la descartamos y
                                // volvemos a empezar
                                fraseEscrita = false;
                                arrayLetrasCopia = copiaArray(arrayLetras);
                                break;
                            }
                        }
                    }

                    arrayLetras = arrayLetrasCopia;
                }

                // Pintamos las letras
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        if (arrayLetras[i][j] != '') {
                            fill('#' + coloresLetras[i][j]);
                            text(arrayLetras[i][j].toUpperCase(), (i) * wCuadrado + wCuadrado / 2, (j + 1) * hCuadrado);
                        }
                    }
                }

                IMAGEN_DIBUJADA = true;

            }
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>