<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Ocre - La Fatiga de los Materiales</title>

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
	<link rel="shortcut icon" href="/img/favicon.png" class="js-favicon">
	<script src="https://use.typekit.net/wfj3ppv.js"></script>
	<script>try{Typekit.load({ });}catch(e){}</script>

	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-67516662-1', 'auto');
	  ga('send', 'pageview');

	</script>

	<style>
		body {
			background: black;
			color: white;
			font-family: 'futura-pt', sans-serif;
			font-size: 1.5rem;
		}
		img {
		    position: absolute;
		    margin: auto;
		    top: 0;
		    left: 0;
		    right: 0;
		    bottom: 0;
		}

		a {
			color: white;
			text-decoration: underline;
		}

		.info {
			width: 350px;
			height: 30px;
			position: absolute;
			top: calc(50vh - 15px);
			text-align: center;
			display: block;
			left: calc(50vw - 175px);
		}

		.creditos {
			width: 510px;
			position: absolute;
			top: calc(50vh - 132px);
			text-align: center;
			display: block;
			left: calc(50vw - 255px);
		}
	</style>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script type="text/javascript" src="/vendor/bower-asset/imagesloaded/imagesloaded.pkgd.min.js"></script>
	<script type="text/javascript" src="js/jquery.fatigaClip.js?v=17102701"></script>
	<script type="text/javascript">

	$(function() {

		window.requestAnimFrame = (function(){
		  return  window.requestAnimationFrame       ||
		          window.webkitRequestAnimationFrame ||
		          window.mozRequestAnimationFrame    ||
		          window.oRequestAnimationFrame      ||
		          window.msRequestAnimationFrame     ||
		          function( callback ){
		            window.setTimeout(callback, 1000 / 60);
		          };
		})();


		var $img = $('img');
		var audio = $('audio').get(0);
		var video1 = $('.js-video-edu').get(0);
		var video2 = $('.js-video-bita').get(0);

		$img.fatigaClip({audio: audio, video1: video1, video2: video2, info: $('.js-info'), credits: $('.js-creditos')});
		var fatigaClip = $.data($img.get(0), 'plugin_fatigaClip');

		function step() {
			fatigaClip.step();
			
			requestAnimFrame(step);
		}

		step();

	});
	</script>
</head>
<body>
	<audio src="fatiga.mp3">
	  <p>Ups! Parece que tu navegador no implementa el elemento audio.</p>
	</audio>

	<video preload="auto" muted class="js-video-edu" src="videos/edu.mp4" style="display: none">
	  <p>Ups! Parece que tu navegador no implementa el elemento video.</p>
	</video>

	<video preload="auto" muted class="js-video-bita" src="videos/bita.mp4" style="display: none">
	  <p>Ups! Parece que tu navegador no implementa el elemento video.</p>
	</video>

	<img src="" alt="">
	<div class="info js-info">Estamos generando tu videoclip <br>
		<span>Cargando tu videoclip</span>
	</div>
	<div class="creditos js-creditos" style="display:none">
		<p>
			Ocre - La Fatiga de los Materiales <br>
			del EP <i>Vago</i> (Discos de Kirlian, 2017)
		</p>
	<?php 
		$ahora = new DateTime();
	?>
		<p>
			Este videoclip lo ha generado tu ordenador el <?= $ahora->format('d/m/Y') ?> a las <?= $ahora->format('H:i') ?> combinando nuestras caras con gifs aleatorios recién descargados de <a href="https://giphy.com/">Giphy</a>
		</p>

		<p>
			<a href="https://ocre.soy/vago/en/adelante">https://ocre.soy/vago/en/adelante</a>
		</p>
	</div>
</body>
</html>