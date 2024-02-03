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

    let planos = [];
    let cajasPlanos = [];
    let limitesPlanos = [];

    function setup() {
        let N_PLANOS = 2;
        let N_CAJAS = 150;

        let paletas = [
            ["#131313", "#DB898D", "#005747", "#4162AB", "#E56C03", "#582B5F", "#DC3B26", "#D8D6D7"],
            ['#010000', '#de2723', '#0a634f', '#f38e00', '#f29294', '#014874'],
            ['#060606', '#420002', '#e84149', '#f081a2', '#209ed1', '#fdf2d4', '#02664e', '#fcbc34']
            // ['#000002', '#0053a1', '#de090f', '#fff8de'];
            // ['#1f1f1f', '#e24e47', '#035699', '#d6b12c'];
        ];

        let paleta = random(paletas);

        folio = new Folio();
        let tamanoLimite = 50;
        let negro = color(paleta[0]);

        let unColor = color(random(paleta));
        let esMonocromo = random() > 0.75;
        // let esMonocromo = false;

        for (let i = 0; i < N_PLANOS; i++) {
            let engine = Engine.create();
            let world = engine.world;
            let cajas = [];
            let limites = [];

            // Límite izquierda
            limites.push(new Limite(tamanoLimite / -2 + 2, folio.height / 2, tamanoLimite, folio.height * 2, 0, world));
            // Límite derecha
            limites.push(new Limite(folio.width + tamanoLimite / 2 - 2, folio.height / 2, tamanoLimite, folio.height * 2, 0, world));
            // Límite abajo
            limites.push(new Limite(folio.width / 2, folio.height + tamanoLimite / 2, folio.width, tamanoLimite, 0, world));

            for (let c = 0; c < N_CAJAS; c++) {
                let anchoCaja = random(50, 100);
                let largoCaja = random(50, 100);

                let colorCaja;

                if (esMonocromo) {
                    colorCaja = unColor;
                } else {
                    colorCaja = color(random(paleta));
                }

                cajas.push(new Caja(random(folio.width), random(-500, -1000), anchoCaja, largoCaja, colorCaja, negro, world));
            }

            planos.push(engine);
            cajasPlanos.push(cajas);
            limitesPlanos.push(limites);
        }

        textFont('futura-pt', 800);
        textStyle(BOLD);
    }

    function draw() {
        let MARGEN_TEXTO = 50;

        if (FUENTES_CARGADAS) {
            background(255);

            for (let i = 0; i < planos.length; i++) {
                Engine.update(planos[i]);
                for (let j = 0; j < cajasPlanos[i].length; j++) {
                    cajasPlanos[i][j].show();
                }
                // for (let j = 0; j < limitesPlanos[i].length; j++) {
                //     limitesPlanos[i][j].show();
                // }
            }

            let posicionTexto;

            push();
            stroke(255);
            fill(255);
            textAlign(LEFT, BOTTOM);
            textSize(25);
            textLeading(30);
            // posicionTexto = posicionTexto + 100;
            posicionTexto = folio.height - MARGEN_TEXTO;
            text('1 de marzo de 2024\nAcéfala', MARGEN_TEXTO, posicionTexto);

            textSize(50);
            textLeading(45);
            posicionTexto = posicionTexto - 100;
            // posicionTexto = 3 * folio.height / 4;
            text('Sufjan Stevens\n+ Ocre', MARGEN_TEXTO, posicionTexto);
            pop();
        }
    }
</script>

<?php require('../../../../_pie.php'); ?>