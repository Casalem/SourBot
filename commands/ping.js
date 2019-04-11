module.exports = {
	name: "ping",
	description: "Pings the bot. Bot replies with 'Pong!'",
	execute(message, args) {
		message.channel.send('Pong!');
		console.log(`Ponged ${message.author.tag}.`);
	}
}
