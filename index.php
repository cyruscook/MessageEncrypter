<?php

// Set the default type of request
$typeOfRequest = "encryption";
if(isset($_GET['decrypt']) || isset($_GET['decryption']))
{
	$typeOfRequest = "decryption";
}

// If we have been given some text in the url to automatically encrypt / decrypt then we'll get it here
$keys = array_keys($_GET);
$defaultText = "";

// If we actually have been provided some text
if(count($keys) > 1)
{
	// In case the text gets split up by a "/" inside of it, then let's join it back together
	//$defaultText = htmlentities(urldecode(implode("", array_slice($keys, 1))));
}

// If the user has gone to a subfolder like /decrypt/ then we need to make any external dependencies come back out
$dirCount = str_repeat("../", count($_GET));
?>

<!DOCTYPE html>
<html>
<head>
	<title>Encrypted Message</title>
	
	<base href="<?php echo($dirCount); ?>">
	
	<!-- Bootstrap -->
	<link rel="stylesheet" href="lib/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T">

	<!-- Our stylesheet -->
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<div class="container" id="containerBody">
		<div class="vertical-input-group outer">
			<div class="input-group inner_fixed" id="listGroupContainer">
				<div class="btn-group" role="group" id="listBtnGroup">
					<button class="btn btn-secondary requestTypeBtn" id="encryptListButton">ENCRYPT</button>
					<button class="btn btn-secondary requestTypeBtn" id="decryptListButton">DECRYPT</button>
				</div>
			</div>
			<div class="input-group inner_remaining">
				<textarea class="form-control" id="messageContent" placeholder="Enter your message here"><?php echo($defaultText); ?></textarea>
			</div>
			<div class="input-group inner_fixed">
				<button id="actionButton" type="submit" class="btn btn-primary form-control" onclick="actionButton(); return false;" disabled></button>
			</div>
		</div>
	</div>

	<!-- Jquery -->
	<script src="lib/jquery.min.js"></script>

	<!-- Popper -->
	<script src="lib/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>

	<!-- Bootstrap -->
	<script src="lib/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

	<!-- Bootbox -->
	<script src="lib/bootbox.all.min.js"></script>

	<!-- CryptoJS (https://code.google.com/archive/p/crypto-js/). This is the library with which encryptions will be made -->
	<!-- AES -->
	<script src="lib/aes.js"></script>
	<!-- SHA-3 -->
	<script src="lib/sha3.js"></script>
	<!-- HMAC SHA-3 -->
	<script src="lib/hmac-sha256.js"></script>


	<!-- Our Javascript -->
	<script src="script.js"></script>
	<script>
	createDefaultMessage(ETypeOfRequest.<?php echo($typeOfRequest); ?>);
	</script>
</body>
</html>