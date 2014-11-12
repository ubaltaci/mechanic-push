
````javascript

var MechanicSms = require("mechanic-sms");

// initialize mechanic-sms
var mechanicSms = new MechanicSms("{SENDER_ALIAS}", "{PROVIDER}", credentials);

// fire it up
mechanicSms.sendSMS([{NUMBERS}], "{TEXT}")
	.then(function (results) {
		// {
		//		[
		//			status: "success|error",
		//			message: "messageid|error_text"
		//		]
		// }
	})
	.catch(function(error) {
		done(error);
	});
````