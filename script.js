var ETypeOfRequest = 
{
	decryption = 1,
	encryption = 2
}

class Message()
{
	constructor(typeOfRequest, messageID)
	{
		this.typeOfRequest = typeOfRequest;
		this.messageID = messageID;
	}
	
	// The message in it's encrypted format
	this.encryptedMessage = "";
	// The message in it's decrypted format
	this.decryptedMessage = "";
	
	// The hashed format of the password
	this.passwordHash = "";
	
	// A reference to the place where we will store the message
	this.messageDiv = document.getElementById("messageContent");
}

thisMessage = new Message(
	// The type of request
	ETypeOfRequest.<?php echo(addslashes($_GET['decryption'])); ?>,
	// The id of the message
	<?php echo(addslashes($_GET['id'])); ?>
);

// When the page loads we check the type of request
if(typeOfRequest === ETypeOfRequest.DECRYPTION)
{
	// If it's a decryption then we fetch the encrypted message and the password hash
	var request = new XMLHttpRequest();
	
	// Send a request to the server's api, telling it that we want to decrypt the message at messageID
	request.open("GET", "https://www.cyruscook.co.uk/encrypt/api/?decryption&id=" + message.messageID);
	
	request.onreadystatechange = function()
	{
		// If the request has completed and the server has given us the 200 status letting us know that it went ok
		if(request.readyState == 4 && request.status == 200)
		{
			// Collect the data that was sent back and retrieve the encrypted message. Pass this to the message class.
			var data = JSON.parse(request.responseText);
			thisMessage.encryptedMessage = data.encryptedMessage;
			
			// Now that we have the encrypted text we can continue
			startDecryption(thisMessage);
		}
	}
	
	// Send the request
	request.send();
}

function startDecryption(theMessage){
	theMessage.messageDiv.innerHTML = theMessage.encryptedMessage;
}