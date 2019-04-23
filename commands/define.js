module.exports = {
	name: "define",
	usage: "!sour define <word> [-h|--help]",
	description: "Defines <word> through a lookup service. At the moment, only google is supported.",
	dictionaries: {
		"google": ["Google", "https://googledictionaryapi.eu-gb.mybluemix.net/?lang=en&define="]
	},
	execute(message, args){
		if (!args.length) {
			message.channel.send('Error: not enough arguments. Provide a word or try "!sour define --help"');
			return;
		}

		if (args.length === 1) {
			if (args[0] === "-h" || args[0] === "--help") {
				message.channel.send("Usage: " + this.usage + '\n' + this.description);
				return;
			}

			//default to Google
			console.log(`Looking up '${args[0]}' through ${this.dictionaries.google[0]}...`);
			getJSON(this.dictionaries.google[1] + args[0], (error, data) => {
				if (error !== null) {
					console.error('An error has occurred:');
					console.error(error);
				} else {
					let json = JSON.parse(data);
					console.log('Data received:');
					console.log(json);
					message.channel.send(define(json));
				}
			});
		}

		function define(data){
			let message = '';
			data.forEach(element => {
				message += `Definition of '${element.word}':\n`;

				for (const wordType in element.meaning) {
					message += `(${wordType.toUpperCase()})\n`;
					for (let i = 0; i < element.meaning[wordType].length; i++) {
						let info = element.meaning[wordType][i];
						message += `    ${i+1}. ${info.definition}\n`;
						if (info.example)
							message += `    Example: ${info.example}\n`;
						message += '\n';
					}
				}
			});

			return message;
		}

		function getJSON(url, callback) {
			const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
			let request = new XMLHttpRequest();
			request.open('GET', url);
			request.responseType = 'json';
			request.onload = () => {
				if (request.readyState === 4) {
					if (request.status === 200) { //OK
						callback(null, request.responseText);
					} else {
						callback(request.status, request.responseText);
					}
				}
			}
			request.onerror = () => console.error(request.statusText);

			console.log('Attempting to retrieve data...');
			request.send();
		};
	}
};
