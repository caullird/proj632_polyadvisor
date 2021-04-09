

<form action="" method="post">
	<input name="url_trip">

	<button type="submit">Submit</button>
</form>


<?php

if(isset($_POST['url_trip'])){
	exec("node.exe main.js " . $_POST['url_trip'],$return);
	$path = current_url() . $return[0];
	header('Location :' . $path );
}

function current_url()
{
    $url      = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    $validURL = str_replace("&", "&amp", $url);
    return $validURL;
}


