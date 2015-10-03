<?php require('../../../../_cabecera.php'); ?>

<link rel="stylesheet" href="css/torpe-en-verano.css" media="screen" charset="utf-8">
<script src="js/meanwhile.js"></script>
<script src="/torpe/en/diseno/js/torpe.js"></script>

<script type="text/javascript">
    $(function () {
        function placeTorpe() {
            var clipTorpe = new Torpe({
                width: 750,
                height: 750,
                elementSize: 680,
                margin: 35,
                minCombinedElements: 3,
                maxCombinedElements: 4,
                lineWidth: 60,
                thickLineWidth: 3,
                border: 0
            }),
            $img = $('<img />');

            clipTorpe.draw();
            $img.attr('src', clipTorpe.getImageDataURI());
            $('#clipTorpe').html($img);
        }

        function formatDate(date) {
            function pad(n) { return n < 10 ? '0' + n : n; }

            return 'el ' +
                pad(date.getDate()) + '/' +
                pad(date.getMonth() + 1) + '/' +
                pad(date.getFullYear()) +
                ' a las ' +
                pad(date.getHours()) + ':' +
                pad(date.getMinutes());
        }

        var isPlaying = false,
            audio = $('audio').get(0),
            options = {
                sourceUrl: 'saveLastVine.php',
                effect: 'grayscale',
                // effect: 'blackAndWhite',
                onDraw: function (data) {
                    placeTorpe();
                    if (!isPlaying) {
                        $('#clipDate').text(formatDate(new Date()));
                        audio.play();
                        isPlaying = true;
                    } else {
                        if (audio.paused) {
                            $('#credits').show();
                        }
                    }
                }
            },
            $meanwhile = $('#screen').meanwhile(options);
    });
</script>
</head>
<body>
<div id="background" class="fullscreen"></div>
<div id="screen" class="fullscreen"></div>
<div id="loading">
    tu videoclip de 'veranos' se está generando... <br>
    necesitas utilizar el navegador Google Chrome <br>
    mola más si lo visualizas a pantalla completa
</div>
<div id="clipTorpe" class="fullscreen"></div>
<div id="credits" class="fullscreen">
    <div id="creditsText">
        este videoclip fue generado especialmente para ti<br>
        <span id="clipDate"></span><br>
        combinando los últimos vídeos subidos a <a href="https://vine.co/">vine.co</a><br>
        y símbolos aleatorios del diseño de <a href="/torpe/en/diseno">torpe</a>.
        para más información, pulsa <a href="/torpe/en/verano">aquí</a>.
    </div>
</div>
<audio src="audio/veranos.mp3">
  <p>Ups! Parece que tu navegador no implementa el elemento audio.</p>
</audio>

<?php require('../../../../_pie.php'); ?>
