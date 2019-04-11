//original starter code from the Azure docs:
//https://github.com/Azure-Samples/nodejs-docs-hello-world
const http = require('http');

const server = http.createServer((request, response) => {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end("This website is solely for hosting SourBot.");
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);

//My code
const result = require('dotenv').config();
const config = require('./config.json');
const discord = require('discord.js');
const client = new discord.Client();

client.on('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}.`);
});

client.on('message', message => {
	if (message.content.startsWith(`${config.prefix} ping`)){
		message.channel.send('Pong!');
		console.log(`Ponged ${message.author.tag}.`);
	}
});

if (result.error) {
	console.log("An error occurred while loading .env:");
	throw result.error;
} else {
	console.log("Logging in...");
	client.login(process.env.DISCORD_BOT_TOKEN);
}
