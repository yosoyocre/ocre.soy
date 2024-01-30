<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego 1</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <script>
        function setup() {
            let width = 700;
            let height = width * 1.414;

            let cols = 16;
            let rows = 24;

            let minTira = 2
            let maxTira = 4;

            let wCuadrado = width / cols;
            let hCuadrado = height / rows;

            let negro = "131313";
            let paleta = ["DB898D", "005747", "4162AB", "E56C03", "582B5F", "DC3B26"];
            let blanco = "D8D6D7";

            shuffle(paleta, true);

            let colores = [paleta[0], paleta[1], blanco];

            createCanvas(width, height);

            noStroke();
            textSize(wCuadrado);

            let coloresPrincipales = [];
            let coloresSecundarios = [];
            let coloresLetras = [];
            let grados = [];

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

            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {

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

            for (let xL = 0; xL < cols; xL++) {
                for (let yL = 0; yL < rows; yL++) {
                    console.log(xL, yL);
                    fill('#' + coloresLetras[xL][yL]);
                    text('O', xL * wCuadrado + wCuadrado / 10, (yL + 1) * hCuadrado);
                }
            }
        }

        function draw() {}
    </script>
    <style>
        canvas {
            border: 1px solid black;
        }
    </style>
</head>

<body>
</body>

</html>