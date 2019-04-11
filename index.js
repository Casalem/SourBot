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
const fs = require('fs');
const discord = require('discord.js');
const client = new discord.Client();

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}.`);
});

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	//slice is basically substring(). '/ +/' matches 1 or more spaces
	const args = message.content.slice(config.prefix).split(/ +/);
	//shift() returns and takes out the first element of an array
	args.shift(); //gets rid of prefix
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		message.channel.send('An error occurred while trying to run that.');
		console.log(`An error occurred while trying to run '${command}':`);
		console.error(error);
	}
});

if (result.error) {
	console.log("An error occurred while loading .env:");
	throw result.error;
} else {
	console.log("Logging in...");
	client.login(process.env.DISCORD_BOT_TOKEN);
}
