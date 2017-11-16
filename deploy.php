<?php

	namespace Deployer;

	require 'recipe/composer.php';

	host('188.166.156.92')
	    ->user('ocre')
	    ->forwardAgent(true)
	    ->stage('production')
	    ->set('branch', 'master')
	    ->set('deploy_path', '/var/www/ocre.soy/www');

	set('repository', 'git@github.com:yosoyocre/ocre.soy.git');

	set('shared_dirs', [
	    'vago/en/adelante/siempre/gifs',
	]);

	set('writable_dirs', [
	    'vago/en/adelante/siempre/gifs',
	]);
?>