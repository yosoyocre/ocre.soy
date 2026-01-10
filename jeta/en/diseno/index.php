<?php
$url = "http://python:5000/health";
$response = file_get_contents($url);
echo $response;
