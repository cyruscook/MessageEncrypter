<?php
$typeOfRequest = "encryption";
if(isset($_GET['decrypt']) || isset($_GET['decryption']))
{
	$typeOfRequest = "decryption";
}

$dirCount = str_repeat("../", count($_GET));
?>

<!DOCTYPE html>
<html>
<head>
	<title>Encrypted Message</title>

	<!-- Bootstrap -->
	<link rel="stylesheet" href="<?php echo($dirCount); ?>lib/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T">

	<!-- Our stylesheet -->
	<link rel="stylesheet" href="<?php echo($dirCount); ?>style.css">
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
				<textarea class="form-control" id="messageContent"></textarea>
			</div>
			<div class="input-group inner_fixed">
				<button id="actionButton" type="submit" class="btn btn-primary form-control" disabled></button>
			</div>
		</div>
	</div>

	<!-- Jquery -->
	<script src="<?php echo($dirCount); ?>lib/jquery.min.js"></script>

	<!-- Popper -->
	<script src="<?php echo($dirCount); ?>lib/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>

	<!-- Bootstrap -->
	<script src="<?php echo($dirCount); ?>lib/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

	<!-- Bootbox -->
	<script src="<?php echo($dirCount); ?>lib/bootbox.all.min.js"></script>

	<!-- CryptoJS (https://code.google.com/archive/p/crypto-js/). This is the library with which encryptions will be made -->
	<!-- AES -->
	<script src="<?php echo($dirCount); ?>lib/aes.js"></script>
	<!-- SHA-3 -->
	<script src="<?php echo($dirCount); ?>lib/sha3.js"></script>
	<!-- HMAC SHA-3 -->
	<script src="<?php echo($dirCount); ?>lib/hmac-sha256.js"></script>


	<!-- Our Javascript -->
	<script src="<?php echo($dirCount); ?>wscript.js"></script>
	<script>
	createDefaultMessage(ETypeOfRequest.<?php echo($typeOfRequest); ?>);
	</script>
</body>
</html>