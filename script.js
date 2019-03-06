var ETypeOfRequest = 
{
	decryption: 1,
	encryption: 2
}

class Message
{
	constructor(typeOfRequest, messageID)
	{
		this.typeOfRequest = typeOfRequest;
		this.messageID = messageID;
	
		// The message in it's encrypted format
		this.encryptedMessage = "";
		// The message in it's decrypted format
		this.decryptedMessage = "";
		
		// A reference to the place where we will store the message
		this.messageDiv = document.getElementById("messageContent");
		
		// An array of all of the passwords the user has already tried that have failed
		this.knownBadPasswords = [];
	}
}

thisMessage = new Message(
	// The type of request
	//ETypeOfRequest.<?php echo(addslashes($_GET['decryption'])); ?>,
	ETypeOfRequest.encryption,
	// The id of the message
	//<?php echo(addslashes($_GET['id'])); ?>
	50
);

// When the page loads we check the type of request
if(thisMessage.typeOfRequest === ETypeOfRequest.decryption)
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
			thisMessage.messageHash = data.messageHash;
			
			// Now that we have the encrypted text we can continue
			startDecryption(thisMessage);
		}
	}
	
	// Send the request
	request.send();
}

function startDecryption(theMessage)
{
	// Set the message box to contain the encrypted message (looks cool)
	theMessage.messageDiv.innerHTML = theMessage.encryptedMessage;
	
	// The callback when the user gives us the password
	function tryPassword(password)
	{
		// If we know the user hasn't already tried it before
		if(!thisMessage.knownBadPasswords.includes(password))
		{
			// Attempt to decrypt the message
			var bytes = CryptoJS.AES.decrypt(theMessage.encryptedMessage, password);
			var maybeDecrypted = bytes.toString(CryptoJS.enc.Utf8);
			
			// Check whether the message was succesfully decrypted (will always start with --- BEGIN MESSAGE --- )
			if(maybeDecrypted.substring(0,21) == "--- BEGIN MESSAGE --- ")
			{
				// If it was retrieve the message
				theMessage.decryptedMessage = maybeDecrypted.substring(22);
				onDecryption(theMessage);
				return;
			}
			else
			{
				// If they got the password wrong, then we won't bother trying it again
				// Make sure there is only one instance of each password in the array (Thanks https://stackoverflow.com/a/21683507/7641587)
				if(!~thisMessage.knownBadPasswords.indexOf(password))
				{
					thisMessage.knownBadPasswords.push(password);
				}
			}
		}
		// Ask the user for the password again
		askForPassword(
			// The callback when the user gives us the password
			tryPassword,
			// This is not the user's first guess
			true
		);
	}
	
	// Ask the user for the password
	askForPassword(
		// The callback when the user gives us the password
		tryPassword,
		// This is the user's first guess
		false
	);
}

function onDecryption(theMessage)
{
	// When the user successfully decrypts a message
	// Set the message box to contain the decrypted message
	theMessage.messageDiv.innerHTML = theMessage.decryptedMessage;
}

function askForPassword(callback, repeated)
{
	// Popup box stuff
	callback(password);
}

function startEncryption(theMessage, password)
{
	// Encrypt the given text with the given password
	theMessage.encryptedMessage = CryptoJS.AES.encrypt(theMessage.decryptedMessage, password).toString();
}

function onEncryption(theMessage)
{
	// When the user successfully encrypts a message
	// Set the message box to contain the encrypted message
	theMessage.messageDiv.innerHTML = thisMessage.encryptedMessage;
}