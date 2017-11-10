const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const sandbox = require('./sandbox');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));

config.startString = config.startString || "%eval";

const client = new Discord.Client();

client.on('message', function(msg) {
	const content = msg.content;
	if(content && content.startsWith(config.startString)) {
		const expr = content.substring(config.startString.length);
		console.log(expr);
		let result;
		sandbox.run(expr)
		.then(function(_res) {
			result = _res;
			if(result.console && result.console.length > 0) return msg.reply(result.console.join("\n"));
		})
		.then(function() {
			return msg.reply(result.result+"");
		})
		.catch(function(err) {
			msg.reply(err+"");
		});
	}
});

client.login(config.token);
