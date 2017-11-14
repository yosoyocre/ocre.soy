<?php 

	error_reporting(E_ERROR | E_PARSE);

	require_once '../../../../vendor/autoload.php';

	use GifFrameExtractor\GifFrameExtractor;
	use Unirest\Request;

	function deleteDir($dirPath) {
	    if (! is_dir($dirPath)) {
	        return;
	    }
	    if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
	        $dirPath .= '/';
	    }
	    $files = glob($dirPath . '*', GLOB_MARK);
	    foreach ($files as $file) {
	        if (is_dir($file)) {
	            deleteDir($file);
	        } else {
	            unlink($file);
	        }
	    }
	    rmdir($dirPath);
	}

	function getGif() {

		$gifsFolder = 'gifs';
		$canvasWidth = 600;

		$buffer = isset($_GET['buffer']) ? intval($_GET['buffer']) : 0;

		$response = [
			'code' => 'error'
		];

		session_start();

		$headers = ['Accept' => 'application/json'];

		$tags = [
			'pain',
			'collapse',
			'explotion',
			'bomb',
			'fight',
			'facepalm',
			'angry',
			'stressed',
			'falling',
			'scary',
			'disappointed',
			'no',
		];

		$tag = array_rand($tags);
		
		$query = [
			'api_key' => '306e9038fd99445085e5b6903f3f45ee', 
			'tag' => $tags[$tag], 
			'fmt' => 'json'
		];

		$apiResponse = Request::get('http://api.giphy.com/v1/gifs/random', $headers, $query);

		if ($apiResponse) {

			$url = $apiResponse->body->data->fixed_width_downsampled_url;

			$id_gif = session_id() . '-' . $buffer;
			$folder = $gifsFolder . '/' . $id_gif;

			deleteDir($folder);
			mkdir($folder);
			$path = $folder . '/gif.gif';

			copy($url, $path);
			$size = getimagesize($path);

			if ($size[1] > 1.3 * $size[0]) {
				return getGif();
			}

			$frames = [];

			if (GifFrameExtractor::isAnimatedGif($path)) {
			    
			    $gfe = new GifFrameExtractor();
			    $gfe->extract($path);

			    $i = 1;
			    
			    foreach ($gfe->getFrames() as $f) {

			    	$frame = [];
			    	$frameUrl = $gifsFolder . '/' . $id_gif . '/' . $i . '.png';

			    	$frame['duration'] = $f['duration'];
			    	$frame['url'] = $frameUrl;

			    	imagepng($f['image'], $frameUrl);

			        $frames[] = $frame;

			        $i++;
			    }
			}

			$gif = [];

			$gif['sizes'] = [];
			$gif['sizes'][0] = $size[0];
			$gif['sizes'][1] = $size[1];
			$gif['sizes'][2] = max($size[0], $canvasWidth);
			$gif['sizes'][3] = round($size[1] / $size[0] * $gif['sizes'][2]);

			$gif['frames'] = $frames;

			$response = [
				'code' => 'ok',
				'gif' => $gif
			];

		}

		return json_encode($response);
	}

	echo getGif();
?>