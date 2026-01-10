<?php
$url = "http://python:5000/classify";
$response = file_get_contents($url);
echo $response;
