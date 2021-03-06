const ETypeOfRequest = 
{
	decryption: "decryption",
	encryption: "encryption"
}

class Message
{
	constructor(typeOfRequest, messageID, onDecryptionCallback, onEncryptionCallback)
	{
		this.typeOfRequest = typeOfRequest;
		this.messageID = messageID;
		
		this.onDecryptionCallback = onDecryptionCallback;
		this.onEncryptionCallback = onEncryptionCallback;
	
		// The message in it's encrypted format
		this.encryptedMessage = "";
		// The message in it's decrypted format
		this.decryptedMessage = "";
		
		// A reference to the place where we will store the message
		this.messageDiv = document.getElementById("messageContent");
		// A reference to the button used to action this message
		this.actionButton = document.getElementById("actionButton");

		this.changeReqestType(typeOfRequest);
		
		// An array of all of the (hashed) passwords the user has already tried that have failed
		this.knownBadPasswords = [];

		this.isEncrypting = false;
		this.isDecrypting = false;
	}

	changeReqestType(typeOfRequest)
	{
		if (typeOfRequest === ETypeOfRequest.decryption)
		{
			this.typeOfRequest = ETypeOfRequest.decryption;

			$("#actionButton").html("Decrypt");
			$("#decryptListButton").addClass("active");
			$("#encryptListButton").removeClass("active");
		}
		else
		{
			this.typeOfRequest = ETypeOfRequest.encryption;

			$("#actionButton").html("Encrypt");
			$("#encryptListButton").addClass("active");
			$("#decryptListButton").removeClass("active");
		}
	}
	
	decrypt(password)
	{
		if (this.isDecrypting)
		{
			return false;
		}
		this.isDecrypting = true;

		// Hash the password. The idea of these salts and embedded hashes is not to prevent bruteforce attacks which would largely still be possible, but to prevent script kiddies from plugging these into a website
		// These passwords are only stored client side anyway, so the chance of someone getting them and bruteforcing them are minimal
		// And anyway, they're the incorrect password, this is just in case someone tries a password that they use on other things
		console.groupCollapsed("Attemping Decrypt:");
		var salt = CryptoJS.SHA3("&L$895NAl0apYNe0!l47ye61r1dWEhsO#*" + password);
		console.log("Salt: " + salt);
		var hashedPwd = CryptoJS.HmacSHA256(password + "w6qI071*%q%XeoYVdIPKbBdOl9#N2Z3Mz&", salt);
		console.log("Hashed: " + hashedPwd);
		
		// If we know the user hasn't already tried it before
		if(!this.knownBadPasswords.includes(hashedPwd))
		{
			// Attempt to decrypt the message
			var maybeDecrypted = CryptoJS.AES.decrypt(this.encryptedMessage, password).toString(CryptoJS.enc.Utf8);

			var subString = maybeDecrypted.substring(0, 22);

			console.log("Maybe Decrypted: " + maybeDecrypted);
			console.assert(subString == "-- BEGIN MESSAGE --- ", { x: subString, y: "-- BEGIN MESSAGE --- ", message: "x != y"});
			console.groupEnd();
			
			// Check whether the message was succesfully decrypted (will always start with --- BEGIN MESSAGE --- )
			if (subString == "--- BEGIN MESSAGE --- ")
			{
				// If it was retrieve the message and store it in the class
				this.decryptedMessage = maybeDecrypted.substring(22);
				
				// The type of request has changed - it's now an encryption! let's switch it:
				this.changeReqestType(ETypeOfRequest.encryption);

				// Let the user know it was successfull
				this.onDecryptionCallback(this);
				this.isDecrypting = false;
				return true;
			}
			else
			{
				// If they got the password wrong, then we won't bother trying it again
				// Make sure there is only one instance of each password in the array (Thanks https://stackoverflow.com/a/21683507/7641587)
				if(!~this.knownBadPasswords.indexOf(hashedPwd))
				{
					this.knownBadPasswords.push(hashedPwd);
				}
			}
		}
		// The message was not successfully decrypted
		this.isDecrypting = false;
		return false;
	}

	encrypt(password)
	{
		if (this.isEncrypting)
		{
			return;
		}
		this.isEncrypting = true;

		this.decryptedMessage = this.messageDiv.value;
		
		// Encrypt the given text with the given password
		this.encryptedMessage = CryptoJS.AES.encrypt("--- BEGIN MESSAGE --- " + this.decryptedMessage, password).toString();

		// The type of request has changed - it's now a decryption! let's switch it:
		this.changeReqestType(ETypeOfRequest.decryption);

		// Let the user know it was successful
		this.onEncryptionCallback(this);
		this.isEncrypting = false;
		return true;
	}
}

var theMessage;
function createDefaultMessage(type)
{
	theMessage = new Message(
		// The type of request
		type,
		50,
		// On Decryption Function
		function (message)
		{
			// Set the message box to contain the decryted message
			message.messageDiv.value = message.decryptedMessage;
		},
		// On Encryption Function
		function (message)
		{
			// Set the message box to contain the encrypted message
			message.messageDiv.value = message.encryptedMessage;
		}
	);

	console.groupCollapsed("Default Message created:");
	console.dir(theMessage);
	console.groupEnd();
}

$(document).ready(
	// Called once the page loads
	function ()
	{
		// When the page loads we check the type of request
		if (theMessage.typeOfRequest === ETypeOfRequest.decryption)
		{
			// Request is a decryption
			theMessage.changeReqestType(ETypeOfRequest.decryption);

			/*// If it's a decryption then we fetch the encrypted message and the password hash
			var request = new XMLHttpRequest();

			// Send a request to the server's api, telling it that we want to decrypt the message at messageID
			request.open("GET", "https://www.cyruscook.co.uk/encrypt/api/?decryption&id=" + message.messageID);

			request.onreadystatechange = function ()
			{
				// If the request has completed and the server has given us the 200 status letting us know that it went ok
				if (request.readyState == 4 && request.status == 200)
				{
					// Collect the data that was sent back and retrieve the encrypted message. Pass this to the message class.
					var data = JSON.parse(request.responseText);
					theMessage.encryptedMessage = data.encryptedMessage;
					theMessage.messageDiv.value = theMessage.encryptedMessage;
				}
			}

			// Send the request
			request.send();*/
		}
		else
		{
			// Its an encryption
			theMessage.changeReqestType(ETypeOfRequest.encryption);
		}

		// Set up custom locales
		var eLocale = {
			OK: 'ENCRYPT',
			CONFIRM: 'ENCRYPT',
			CANCEL: 'CANCEL'
		};

		bootbox.addLocale('Encrypt', eLocale);

		var dLocale = {
			OK: 'DECRYPT',
			CONFIRM: 'DECRYPT',
			CANCEL: 'CANCEL'
		}

		bootbox.addLocale('Decrypt', dLocale);

		// Prevent form from being submitted and override it's action
		$('#encryptForm').submit(function (event)
		{
			event.preventDefault();
			actionButton();
			return false;
		});

		// Disable the button when there is text in the box, enable it when there isn't (Slightly modified from https://stackoverflow.com/a/41589301/7641587, thank you!)
		function replaceWithWrapper(obj, property, callback)
		{
			Object.defineProperty(obj, property, new function ()
			{
				var _value = obj[property];
				return {
					set: function (value)
					{
						_value = value;
						callback(obj, property, value)
					},
					get: function ()
					{
						return _value;
					}
				}
			});
		}

		replaceWithWrapper($("#messageContent")[0], "innerHTML", function (obj, property, value)
		{
			console.dir({ obj, property, value });
			obj.value = value;
			checkTextboxStatus();
		});

		function checkTextboxStatus()
		{
			if ($("#messageContent")[0].value != '')
			{
				$("#actionButton").prop("disabled", false);
			}
			else
			{
				$("#actionButton").prop("disabled", true);
			}
		}

		$("#messageContent").bind('input', checkTextboxStatus);




		// On type of request button clicks, change the type of request

		$("#encryptListButton").click(function ()
		{
			// Switch to encryption
			theMessage.changeReqestType(ETypeOfRequest.encryption);
		});

		$("#decryptListButton").click(function ()
		{
			// Switch to decryption
			theMessage.changeReqestType(ETypeOfRequest.decryption);
		});
	}
);

// Function fired by the form being submitted
function actionButton()
{
	function onRecievePassword(password)
	{
		// Called when we recieve the password
		console.log("Password submit callback has been recieved, attemping to perform action " + theMessage.typeOfRequest);
		if (theMessage.typeOfRequest === ETypeOfRequest.decryption)
		{
			// Decrypt the message with the given password
			if (theMessage.decrypt(password))
			{
				// If it was successful show the user the decrypted text
				theMessage.messageDiv.value = theMessage.decryptedMessage;
				return;
			}
			else
			{
				// Otherwise there was a failure - let's ask them for the password again and repeat the process
				_askForPassword(true);
				return;
			}
		}
		else
		{
			// Encrypt the message with the given password
			if (theMessage.encrypt(password))
			{
				// If it was successful show the user the encrypted text
				theMessage.messageDiv.value = theMessage.encryptedMessage;
				return;
			}
			else
			{
				// Otherwise there was a failure
				return;
			}
		}
	}

	// This will also get called from within the onRecievePassword function, let's not write the code twice
	function _askForPassword(secondGuess)
	{
		// Open a popup box to ask for the password to encrypt with
		askForPassword(
			// Whether we ask the user for a password to encrypt or decrypt
			theMessage.typeOfRequest,
			// The callback triggered when the user enters a password
			onRecievePassword,
			// Whether we reject an empty password
			false,
			// Whether this is the first try
			secondGuess
		);
	}

	_askForPassword(false);
	return false;
}

// Function fired by the form being submitted
function askForPassword(typeOfRequest, successCallback, rejectEmpty, secondGuess)
{
	// Whether we are asking the user for a password to encrypt or decrypt
	var thisLocale = "Encrypt";
	var thisTitle = "Please enter a password";
	var thisMessage = "A password is required to encrypt this message";
	if (typeOfRequest === ETypeOfRequest.decryption)
	{
		thisLocale = "Decrypt";
		thisTitle = "Please enter the password";
		thisMessage = "To decrypt this message you need the password that it was encrypted with";
	}
	console.dir({ thisLocale, typeOfRequest });

	// If this is the second guess we tell the user
	if (secondGuess)
	{
		thisTitle = "Incorrect, please try again:";
		thisMessage = "The password that you entered was incorrect";
	}

	console.groupCollapsed("Asking the user for password using following params:");
	console.dir(
		{
			"Type Of Request": typeOfRequest,
			"Success Callback": successCallback,
			"Reject Empty": rejectEmpty,
			"Second Guess": secondGuess
		}
	);
	console.groupEnd();

	bootbox.prompt({
		// The title of the prompt
		title: thisTitle,
		message: thisMessage,
		// The input type of the input
		inputType: 'password',
		// Allow the user to dismiss by clicking on the background
		backdrop: true,
		// The custom localisation, this changes the text of the buttons
		locale: thisLocale,
		callback: function (password)
		{
			// Function fired once the user submits the password popup
			if (password && (password != "" || !rejectEmpty))
			{
				// If the user entered a password
				successCallback(password);
			}
		}
	});
}