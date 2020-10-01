//"StAuth10065: I Marco Biundo, 000299457 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const Logger = require('./lib/logger.js');
const SlackBot = require('./lib/slack_bot.js');

let logger = new Logger();
logger.log('Hey');

let slack_bot = new SlackBot('tetra');