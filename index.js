const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const Sandbox = require('sandbox');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));

config.startString = config.startString || "%eval";

const client = new Discord.Client();

client.on('message', function(msg) {
	const content = msg.content;
	if(content && content.startsWith(config.startString)) {
		const expr = content.substring(config.startString.length);
		const s = new Sandbox();
		s.run(expr, function(result) {
			(function() {
				console.log(typeof result.console);
				if(result.console && result.console.length > 0) return msg.reply(result.console.join("\n"));
				return Promise.resolve();
			})()
			.then(function() {
				if(result.result) return msg.reply(result.result);
			});
		});
	}
});

client.login(config.token);
