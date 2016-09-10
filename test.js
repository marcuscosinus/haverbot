"use strict";
var Discord = require("discord.js");

var bot = new Discord.Client();

bot.loginWithToken("MjE3ODgyMzMyNjg0NzQ2NzUz.Cp7GmQ.WHQe9-XRTd7rXQg5om6CC0y3c9Q");

bot.on("ready", function() {
    console.log('hello');
});
