<?php
$url = "http://python:5000/classify?text=me%20duele%20la%20cabeza%20mucho";
$response = file_get_contents($url);
echo $response;
