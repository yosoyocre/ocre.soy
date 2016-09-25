<?php 
  $version = '15100700';
?>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ocre . soy <?php echo implode(' / ', explode('/', substr($_SERVER[REQUEST_URI], 0, -1))); ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="/css/style.css?v=<?php echo $version ?>">
  <link rel="shortcut icon" href="/img/favicon.png" class="js-favicon">
  <script src="https://use.typekit.net/wfj3ppv.js"></script>
  <script>try{Typekit.load({ });}catch(e){}</script>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
  <script src="/vendor/bootstrap/js/bootstrap.js"></script>
</head>
<body>

  <?php
    if ($_SERVER['SERVER_NAME'] != 'localhost') :
  ?>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-67516662-1', 'auto');
      ga('send', 'pageview');

    </script>
    
  <?php
    endif;
  ?>

  <div class="container">
    <?php
      if (!isset($ocultaNav) || !$ocultaNav) :
    ?>
      <header class="navbar navbar-static-top bd-navbar" role="banner">
        <div class="clearfix">
          <button class="navbar-toggler pull-right hidden-sm-up" type="button" data-toggle="collapse" data-target="#bd-main-nav">
            ☰
          </button>
          <a class="navbar-brand hidden-sm-up" href="/">
            ocre <span class="separador">.</span> soy
          </a>
        </div>
        <div class="collapse navbar-toggleable-xs" id="bd-main-nav">
          <nav class="nav navbar-nav">
            <a class="nav-item nav-link active hidden-xs-down" href="/">ocre <span class="separador">.</span> soy</a>
            <div class="pull-right">
              <a class="nav-item nav-link" href="/torpe"><span class="separador">/</span> torpe</a>
              <a class="nav-item nav-link " href="/vago"><span class="separador">/</span> vago</a>
            </div>
          </nav>
        </div>
      </header>
    <?php
      endif;
    ?>
