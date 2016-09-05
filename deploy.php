<?php

	require 'recipe/composer.php';

	server('prod', 'http://188.166.156.92/', 22)
	    ->user('ocre')
	    ->forwardAgent()
	    ->stage('prod')
	    ->env('branch', 'master')
	    ->env('deploy_path', '/var/www/creoqueocre.es/www');

	set('repository', 'git@github.com:yosoyocre/creoqueocre.es.git');
?>