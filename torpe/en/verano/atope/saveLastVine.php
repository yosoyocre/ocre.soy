<?php

session_start();
$clipsDir = 'clips/' . session_id();

$buffer_name = isset($_GET['buffer']) ? $_GET['buffer'] : 'buffer_0';

define('VINE_URL', 'http://www.vpeeker.com/videos');

$ch = curl_init(VINE_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$vine_json = curl_exec($ch);
curl_close($ch);

if ($vine_json){
    $vine_json = json_decode($vine_json);

    if ($vine_json && $vine_json->video_url){
        $ch = curl_init($vine_json->video_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $video = curl_exec($ch);
        curl_close($ch);

        if (!is_dir($clipsDir)){
            mkdir($clipsDir, 0775);
        }

        $video_url = $clipsDir . '/' . $buffer_name . '.mp4';

        file_put_contents($video_url, $video);

        header('HTTP/1.0 201 Created');
        header('Content-type: application/json');

        echo '{
            "video_url": "' . $video_url .'"
        }';

        exit;
    }
}

header('HTTP/1.0 500 Internal Server Error')


 ?>
