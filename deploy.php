<?php

	require 'recipe/composer.php';

	server('prod', '188.166.156.92', 22)
	    ->user('ocre')
	    ->forwardAgent()
	    ->stage('production')
	    ->env('branch', 'master')
	    ->env('deploy_path', '/var/www/creoqueocre.es/www');

	set('repository', 'git@github.com:yosoyocre/creoqueocre.es.git');
?>