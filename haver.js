"use strict";
var Discord = require("discord.js");
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var fs = require('fs');
var util = require("util");
const chalk = require('chalk');
const gameList = require("./gamelist.json");


/*
*** TODO ***
- edit lfg messages to mention everyone
- gw channels monogram id
- mass moving to channels [ OK ]
- 2 parameters for !mmr
- on streaming notify everyone
- loader method for roles, members, admins
- method for google sheet
- register at the bot for guild wars events (needs constant uptime)
*/


// AUTH
var bot = new Discord.Client();
var doc = new GoogleSpreadsheet('11JoIst3gOU6LEcGsAnnXxMIRzXgYAm6bpqTx6Cz2mns');
var gwDoc = new GoogleSpreadsheet('16n1yqLrYCmEtYn8CoIfRdf-JRZTvnmSpfwpwHz4-k1M');

// HELPERS
var sheet;
var admins = {};
var havers = {};
var roles = {};
var server = {};
var channels = {};
var mmr = '!mmr';
var move = '!move';


function updateInfo() {

    //server info betöltése
    server = bot.internal.servers[0];
    util.log(chalk.green('Server info loaded'));

    // szerepek betöltése
    for (let e of server.roles) {
        let name = e.name.replace(/\s/g, "");
        name = name.toLowerCase();
        roles[name] = e;
    }

    util.log(chalk.green('Roles loaded...'));
    // visszater a role jogaival
    //console.log(roles.vendeg.serialise());


    //csatornák dinamikus betöltése
    for (let e of server.channels) {
        let name = e.name.replace(/\s/g, "");
        name = name.toLowerCase();
        channels[name] = e;
    }
    util.log(chalk.green('Channels loaded...'));

    //tagok es adminok betoltese
    for (let e of server.members) {
        let name = e.name.replace(/\s/g, "");
        name = name.toLowerCase();
        if (bot.memberHasRole(e, roles.admin)) {
            admins[name] = e;
        }
        havers[name] = e;
    }
    util.log(chalk.green('Members loaded...'));
    util.log(chalk.green('Admins saved...'));




    //random game
    var game = gameList[Math.floor((Math.random() * (gameList.length - 1)) + 0)];
    //bot.setPlayingGame('');
    bot.setStreaming(game, 'twitch.tv/nesteaapower', 1);
    util.log('Playing ' + game);

    util.log(chalk.green("Ready to begin"));
}



// LOGIN
bot.loginWithToken("MjE3ODgyMzMyNjg0NzQ2NzUz.Cp7GmQ.WHQe9-XRTd7rXQg5om6CC0y3c9Q");
util.log(chalk.green("Logging in..."));


// bot.on("message", (message) => {
//     console.log(message.author.username + " SAID " + message.content + " IN " + message.channel.name);
// });


bot.on("error", (error) => {
    util.log(chalk.bold.red('Error happened! ' + error));
});


//////////////  UPDATERS  \\\\\\\\\\\\\\\\\

bot.on("serverUpdated", (oldServer, newServer) => {
    updateInfo();
    util.log(chalk.green('SERVER UPDATED'));
});

bot.on("channelCreated", (channel) => {

// if (channel.type == 'text' || channel.type == 'voice'){
//     updateInfo();
//     let msg = 'CHANNEL CREATED - ' + channel.name;
//     util.log(chalk.green(msg));
//     bot.sendMessage(channels.botlog, msg);
// }

});


bot.on("channelDeleted", (channel) => {
    updateInfo();
    // if (channel.type == 'text' || channel.type == 'voice'){
    // let msg = 'CHANNEL DELETED - ' + channel.name;
    // util.log(chalk.red(msg));
    // bot.sendMessage(channels.botlog, msg);
    // }
});

bot.on("channelUpdated", (oldChannel, newChannel) => {
    // updateInfo();
    // if (channel.type == 'text' || channel.type == 'voice'){
    // let msg = 'CHANNEL UPDATED - [' + oldChannel.name + ']=>[' + newChannel.name + ']';
    // util.log(chalk.green(msg));
    // bot.sendMessage(channels.botlog, msg);
    // }
});

bot.on("serverRoleCreated", (role) => {
    updateInfo();
    let msg = 'ROLE CREATED - [' + role.name + ']';
    util.log(chalk.green(msg));
    bot.sendMessage(channels.botlog, msg);
});

bot.on("serverRoleDeleted", (role) => {
    updateInfo();
    let msg = 'ROLE DELETED - [' + role.name + ']';
    util.log(chalk.red(msg));
    bot.sendMessage(channels.botlog, msg);
});

bot.on("serverRoleUpdated", (oldRole, newRole) => {
    updateInfo();
    let msg = 'ROLE UPDATED - [' + oldRole.name + ']=>[' + newRole.name + ']';
    util.log(chalk.green(msg));
    bot.sendMessage(channels.botlog, msg);
});

bot.on("serverMemberRemoved", (server, member) => {
    updateInfo();
    let msg = 'MEMBER REMOVED - [' + member.username + ']';
    util.log(chalk.red(msg));
    bot.sendMessage(channels.botlog, msg);
});

bot.on("serverMemberUpdated", (server, member1, member2) => {
    updateInfo();
    console.log(member1.role);
    console.log(member2.role);
    let msg = 'MEMBER UPDATED - [' + member1.username + ']';
    util.log(chalk.green(msg));
    bot.sendMessage(channels.botlog, msg);
});

//////////////


bot.on("ready", function() {
    updateInfo();
});

bot.on('disconnected', function() {
    util.log(chalk.red('Disconnected...'));
    bot.logout();
});


bot.on('serverNewMember', (server, user) => {
    updateInfo();

    bot.sendMessage(channels.botlog, "New Member Joined the server: " + user.username);

    util.log("New Member Joined the server: " + user.username);

    let info = channels.info.toString();
    let names = [];
    for (let a in admins) {
        names.push(a.toString());
    }

    let adminNames = havers.akapitány + ' ' + havers.faruwiel + ' ' + havers.hoaxz + ' ' + havers.marcus;

    let message = "Üdv a " + server.name + " szerveren! Látogass el az " + channels.info + " szobába, kérdésekben " + adminNames + " segít. Ha vendég vagy, használd a !haver parancsot a vendég jogok megszerzéséhez";

    bot.sendMessage(user, message);


    async.series([
        function setAuth(step) {
            // see notes below for authentication instructions!
            var creds = require('./havermarcus-84fbd647383f.json');
            // OR, if you cannot save the file locally (like on heroku)
            var creds_json = {
                client_email: 'havermarcus-141313@appspot.gserviceaccount.com',
                private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUyCjrobRQsXfQ\nfj+mdTTnuhR18+djhUW8yn/RKnvzgUZ6/22GdfxF48nNmco0ooq6bDTCI7jNvWU6\n8d9m5+ynZQLe6OGwWvWXxURNjXTjg84I0/tCD5ZfRInW4ab7G/ptmv+uU/BN0lKb\nQW2LW/uc1mRNYiwULh0wysgNd5UGbOmrL6DJhXfhMUQMYSQtpxm8N4qwRUAu7lSR\nB2KBcN45Z4ws1IRmoUdj0cb5EZTr1HcIgKrbWQ9kgHDg3F0nu4Cwy531skRoSMwy\nZiIyUT12aNEUcRQ0ZgmO75Hdz1kB1ctdL0VYYl9/9Hn2u2hCZOCNdodmVHwVfb/S\nAApJ5EkNAgMBAAECggEAJ9WU+4/ZPuYKZSjNZ683iU4nuHFB1zrC9HYAebr3W33P\nIQWijnKWGMttIyVwWmw3hnDta47ecP3M7r0LMqumfSwG3o5AehB9O719bPtXb6Rk\nNPjiZ9qdLxaYq3axGP+C4XQL+6nRKfB+8HvOMzG0KAdm3anMULbVViYQT50cdAgm\nFUd2OEyCtJBhZp9haFaySAFXBaTR62E7yaDHZ6Pjp3Ydmig9EcH3QJMU7XwDSZz0\nTYOplIMynI0UscpQ1Cd20fjHRXgqA6c5ojW7MVHBpBqsV1D12lG5uUdMUR1YzgIK\nF1izourra/zVn4Fjh3WZOlTsgMQSJ8QjZH/JWiLoYQKBgQD622jWqNiQhjicFvKd\nN0CAwdLVtgoRDqG17c0r7DEZ2Gfg0+ZYZ04pH6uzbvEEFIxp+UDRXqdzXroV298h\n2s5VVZdJHZb+c9yV8higbPM5SiNUm75LqT/78K7yKkeD5fOCTksjJI3DSbpYgWi9\nhWzplDoliS+Q1U826WvxEwJ4FQKBgQDZJOrrGauReJPq7+2Du/Q9vTPW0mGV/Uic\nKFE016h8QpTbZSkyJx1Y7dIfoToGzU16Uqq4nsBGf+2unBj9p1oRQ+KTL3YyCC1r\n3d9D/KQq0aVFWERWlze/DyKF8czw5P1jQd7AKbhPMudyzmCFXvy/3nZPAgBykUe8\ntFkiqwkTGQKBgBTA/kV0JqaeVCSlyWC0Z4O/hV/k9aQ/n6VbjTPrEIzg2IdDQLVj\nppXEZwIrVYlO4ecKlhA8UoI6/g486JL2dUeeEywbZJicoU1OgDcVjHHa7l1bnTzJ\nPd/sI60pTk1dQu4u6Ax6Q7g6a05TNoUnesFAYCcm2GaVHz6dxS5msjeZAoGARIQQ\nmAQujaU1TzFLiYCZ7Y0wuT0Cy7fy3EsgbIMLx8GehKej2w5ahT/tSEuwKotHQiyp\nb72vv88H6UuZ2xeeJMp9yKF2Mw0/f8SveR1Tk6s48euLDKOEVIXrB8anOu+WQGZ9\nabcAUAUo4KHb9Nlm+Qex3vYru/q5XwKtCXJcV6kCgYAFfmk76f24vR/Vr8FjSi/P\nVHrSGZHqgcvFTffc11tAAh0vArdxrSDsEd/CUFecXKTgGVg/SUliDBwcy+4n0cKn\nVFrM4wJE6lwAVCpe8zQ8+c1cxPKzHxkop4Wse/V9p3bq6A92m3Ge/0qpuoYjoPD8\nQvsnLWWbVoerGQtniKsX0Q==\n-----END PRIVATE KEY-----\n'
            }
            gwDoc.useServiceAccountAuth(creds, step);
        },
        function getInfoAndWorksheets(step) {
            gwDoc.getInfo(function(err, info) {
                console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                sheet = info.worksheets[2];
                util.log(sheet.title + ' selected!');
                step();
            });
        },

        function workingWithCells(step) {
            sheet.getCells({
                'min-row': 2,
                'max-row': 300,
                'min-col': 1,
                'max-col': 1,
                'return-empty': true
            }, function(err, cells) {

                let i = 0;

                let keys = Object.keys(havers);
                keys.sort();
                for (let h in havers) {
                    cells[i].value = havers[keys[i]].username;
                    i++;
                }
                sheet.bulkUpdateCells(cells, function() {
                    util.log(chalk.green('Cells updated'));
                }); //async

                //console.log(cells[2]);

                if (!err) util.log('DONE');
                else util.log(err);


                step();
            });
        }




    ]);







});


bot.on("message", function(message) {

    var input = message.content;

    if (input === "!ping") {

    }
    //a help command to ask the bot for help with commands
    if (input === "!help") {

    }

    //getChannels
    if (input === "!channels") {

    }
    // force update cache
    if (input === "!update") {
        bot.deleteMessage(message);
        if (bot.memberHasRole(message.author, roles.admin)) {
            updateInfo();
            util.log('Cache updated');
        } else {
            bot.sendMessage(message.author, 'Sajnálom, nincs jogosultságod erre a parancsra!');
        }
    }

    if (input === "!haver") {

        bot.deleteMessage(message);
        bot.addMemberToRole(message.author, roles.vendég);
        let log = message.author.username + ' got ' + roles.vendég.name + ' role';
        util.log(log);
        bot.sendMessage(channels.botlog, log);
        let repl = 'Megkaptad a vendég jogot! Üdv!';
        bot.sendMessage(message.author, repl);
    }

    if (input === "!go") {
      if (bot.memberHasRole(message.author, roles.admin)) {
      bot.deleteMessage(message);
      async.series([
          function setAuth(step) {
              // see notes below for authentication instructions!
              var creds = require('./havermarcus-84fbd647383f.json');
              // OR, if you cannot save the file locally (like on heroku)
              var creds_json = {
                  client_email: 'havermarcus-141313@appspot.gserviceaccount.com',
                  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUyCjrobRQsXfQ\nfj+mdTTnuhR18+djhUW8yn/RKnvzgUZ6/22GdfxF48nNmco0ooq6bDTCI7jNvWU6\n8d9m5+ynZQLe6OGwWvWXxURNjXTjg84I0/tCD5ZfRInW4ab7G/ptmv+uU/BN0lKb\nQW2LW/uc1mRNYiwULh0wysgNd5UGbOmrL6DJhXfhMUQMYSQtpxm8N4qwRUAu7lSR\nB2KBcN45Z4ws1IRmoUdj0cb5EZTr1HcIgKrbWQ9kgHDg3F0nu4Cwy531skRoSMwy\nZiIyUT12aNEUcRQ0ZgmO75Hdz1kB1ctdL0VYYl9/9Hn2u2hCZOCNdodmVHwVfb/S\nAApJ5EkNAgMBAAECggEAJ9WU+4/ZPuYKZSjNZ683iU4nuHFB1zrC9HYAebr3W33P\nIQWijnKWGMttIyVwWmw3hnDta47ecP3M7r0LMqumfSwG3o5AehB9O719bPtXb6Rk\nNPjiZ9qdLxaYq3axGP+C4XQL+6nRKfB+8HvOMzG0KAdm3anMULbVViYQT50cdAgm\nFUd2OEyCtJBhZp9haFaySAFXBaTR62E7yaDHZ6Pjp3Ydmig9EcH3QJMU7XwDSZz0\nTYOplIMynI0UscpQ1Cd20fjHRXgqA6c5ojW7MVHBpBqsV1D12lG5uUdMUR1YzgIK\nF1izourra/zVn4Fjh3WZOlTsgMQSJ8QjZH/JWiLoYQKBgQD622jWqNiQhjicFvKd\nN0CAwdLVtgoRDqG17c0r7DEZ2Gfg0+ZYZ04pH6uzbvEEFIxp+UDRXqdzXroV298h\n2s5VVZdJHZb+c9yV8higbPM5SiNUm75LqT/78K7yKkeD5fOCTksjJI3DSbpYgWi9\nhWzplDoliS+Q1U826WvxEwJ4FQKBgQDZJOrrGauReJPq7+2Du/Q9vTPW0mGV/Uic\nKFE016h8QpTbZSkyJx1Y7dIfoToGzU16Uqq4nsBGf+2unBj9p1oRQ+KTL3YyCC1r\n3d9D/KQq0aVFWERWlze/DyKF8czw5P1jQd7AKbhPMudyzmCFXvy/3nZPAgBykUe8\ntFkiqwkTGQKBgBTA/kV0JqaeVCSlyWC0Z4O/hV/k9aQ/n6VbjTPrEIzg2IdDQLVj\nppXEZwIrVYlO4ecKlhA8UoI6/g486JL2dUeeEywbZJicoU1OgDcVjHHa7l1bnTzJ\nPd/sI60pTk1dQu4u6Ax6Q7g6a05TNoUnesFAYCcm2GaVHz6dxS5msjeZAoGARIQQ\nmAQujaU1TzFLiYCZ7Y0wuT0Cy7fy3EsgbIMLx8GehKej2w5ahT/tSEuwKotHQiyp\nb72vv88H6UuZ2xeeJMp9yKF2Mw0/f8SveR1Tk6s48euLDKOEVIXrB8anOu+WQGZ9\nabcAUAUo4KHb9Nlm+Qex3vYru/q5XwKtCXJcV6kCgYAFfmk76f24vR/Vr8FjSi/P\nVHrSGZHqgcvFTffc11tAAh0vArdxrSDsEd/CUFecXKTgGVg/SUliDBwcy+4n0cKn\nVFrM4wJE6lwAVCpe8zQ8+c1cxPKzHxkop4Wse/V9p3bq6A92m3Ge/0qpuoYjoPD8\nQvsnLWWbVoerGQtniKsX0Q==\n-----END PRIVATE KEY-----\n'
              }
              gwDoc.useServiceAccountAuth(creds, step);
          },
          function getInfoAndWorksheets(step) {
              gwDoc.getInfo(function(err, info) {
                  console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                  sheet = info.worksheets[0];
                  util.log(sheet.title + ' selected!');
                  step();
              });
          },

          function workingWithRows(step) {
              sheet.getRows({
                  offset: 1,
                  limit: 5
              }, function(err, rows) {
                  let repl = [];


                  for (let r of rows) {

                    if (r.morcimacik != '') {
                      repl.push({name: r.morcimacik, room: 'morcimacik'});
                    }
                    if (r.csibészcsirkék != '') {
                      repl.push({name: r.csibészcsirkék, room: 'csibészcsirkék'});
                    }
                    if (r.kaotikuskecskék != '') {
                      repl.push({name: r.kaotikuskecskék, room: 'kaotikuskecskék'});
                    }
                    if (r.pökhendipelikánok != '') {
                      repl.push({name: r.pökhendipelikánok, room: 'pökhendipelikánok'});
                    }
                    if (r.játékosjegesmedvék != '') {
                      repl.push({name: r.játékosjegesmedvék, room: 'játékosjegesmedvék'});
                    }
                    if (r.dinamikusdenevérek != '') {
                      repl.push({name: r.dinamikusdenevérek, room: 'dinamikusdenevérek'});
                    }
                    if (r.veszélyesvadmalacok != '') {
                      repl.push({name: r.veszélyesvadmacskák, room: 'veszélyesvadmacskák'});
                    }
                    if (r.egocentrikuselefántok != '') {
                      repl.push({name: r.egocentrikuselefántok, room: 'egocentrikuselefántok'});
                    }
                  }



                  for (let r of repl) {
                    bot.addMemberToRole(havers[r.name.toLowerCase()], roles[r.room]);
                    bot.moveMember(havers[r.name.toLowerCase()],channels[r.room], (error) => {
                      if (error) util.log(chalk.red('Error at mass moving: ' + r.name + '. ---> ' + error));
                      else util.log(chalk.blue('Successfully moved ' + r.name));
                    });
                  }

                  step();
              });
          }

      ]);
}else {
    bot.sendMessage(message.author, 'Sajnálom, nincs jogosultságod erre a parancsra!');
}


    }

    // move member with admin role
    if (input.startsWith(move)) {

        let args = message.content.split(" ").slice(1);

        let error = '';
        let warning = '';

        bot.deleteMessage(message);

        if (!havers.hasOwnProperty(args[0])) {
            error = 'Nincs ilyen haver: ' + args[0] + '... \n';

        }
        if (!bot.memberHasRole(message.author, roles.admin)) {
            error += ' Sajnálom, nincs jogosultságod erre a parancsra!';
            warning = message.author.username + ' át akarta mozgatni ' + args[0] + ' tagot a ' + args[1] + ' szobába!';
            util.log(chalk.red(message.author.username + ' HAS NO PERMISSION TO MOVE'));
        } else {
            bot.moveMember(havers[args[0]], channels[args[1]]);

            util.log(args[0] + " moving to " + args[1]);
        }

        if (error.length > 0) {
            bot.sendMessage(message.author, error);
        }
        if (warning.length > 0) {
            util.log('Admin notified!');
            bot.sendMessage(channels.botlog, warning);
        }

    }

    //mmr lekérdezés
    if (input.startsWith(mmr)) {
        bot.deleteMessage(message);

        let args = message.content.split(" ").slice(1);

        if (args.length > 0) {

            let log = args[0] + " mmr request by " + message.author.username;
            util.log(log);
            bot.sendMessage(channels.botlog, log);

            args[0] = args[0].toLowerCase();

            bot.startTyping(message.channel);


            async.series([
                function setAuth(step) {
                    // see notes below for authentication instructions!
                    var creds = require('./havermarcus-84fbd647383f.json');
                    // OR, if you cannot save the file locally (like on heroku)
                    var creds_json = {
                        client_email: 'havermarcus-141313@appspot.gserviceaccount.com',
                        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUyCjrobRQsXfQ\nfj+mdTTnuhR18+djhUW8yn/RKnvzgUZ6/22GdfxF48nNmco0ooq6bDTCI7jNvWU6\n8d9m5+ynZQLe6OGwWvWXxURNjXTjg84I0/tCD5ZfRInW4ab7G/ptmv+uU/BN0lKb\nQW2LW/uc1mRNYiwULh0wysgNd5UGbOmrL6DJhXfhMUQMYSQtpxm8N4qwRUAu7lSR\nB2KBcN45Z4ws1IRmoUdj0cb5EZTr1HcIgKrbWQ9kgHDg3F0nu4Cwy531skRoSMwy\nZiIyUT12aNEUcRQ0ZgmO75Hdz1kB1ctdL0VYYl9/9Hn2u2hCZOCNdodmVHwVfb/S\nAApJ5EkNAgMBAAECggEAJ9WU+4/ZPuYKZSjNZ683iU4nuHFB1zrC9HYAebr3W33P\nIQWijnKWGMttIyVwWmw3hnDta47ecP3M7r0LMqumfSwG3o5AehB9O719bPtXb6Rk\nNPjiZ9qdLxaYq3axGP+C4XQL+6nRKfB+8HvOMzG0KAdm3anMULbVViYQT50cdAgm\nFUd2OEyCtJBhZp9haFaySAFXBaTR62E7yaDHZ6Pjp3Ydmig9EcH3QJMU7XwDSZz0\nTYOplIMynI0UscpQ1Cd20fjHRXgqA6c5ojW7MVHBpBqsV1D12lG5uUdMUR1YzgIK\nF1izourra/zVn4Fjh3WZOlTsgMQSJ8QjZH/JWiLoYQKBgQD622jWqNiQhjicFvKd\nN0CAwdLVtgoRDqG17c0r7DEZ2Gfg0+ZYZ04pH6uzbvEEFIxp+UDRXqdzXroV298h\n2s5VVZdJHZb+c9yV8higbPM5SiNUm75LqT/78K7yKkeD5fOCTksjJI3DSbpYgWi9\nhWzplDoliS+Q1U826WvxEwJ4FQKBgQDZJOrrGauReJPq7+2Du/Q9vTPW0mGV/Uic\nKFE016h8QpTbZSkyJx1Y7dIfoToGzU16Uqq4nsBGf+2unBj9p1oRQ+KTL3YyCC1r\n3d9D/KQq0aVFWERWlze/DyKF8czw5P1jQd7AKbhPMudyzmCFXvy/3nZPAgBykUe8\ntFkiqwkTGQKBgBTA/kV0JqaeVCSlyWC0Z4O/hV/k9aQ/n6VbjTPrEIzg2IdDQLVj\nppXEZwIrVYlO4ecKlhA8UoI6/g486JL2dUeeEywbZJicoU1OgDcVjHHa7l1bnTzJ\nPd/sI60pTk1dQu4u6Ax6Q7g6a05TNoUnesFAYCcm2GaVHz6dxS5msjeZAoGARIQQ\nmAQujaU1TzFLiYCZ7Y0wuT0Cy7fy3EsgbIMLx8GehKej2w5ahT/tSEuwKotHQiyp\nb72vv88H6UuZ2xeeJMp9yKF2Mw0/f8SveR1Tk6s48euLDKOEVIXrB8anOu+WQGZ9\nabcAUAUo4KHb9Nlm+Qex3vYru/q5XwKtCXJcV6kCgYAFfmk76f24vR/Vr8FjSi/P\nVHrSGZHqgcvFTffc11tAAh0vArdxrSDsEd/CUFecXKTgGVg/SUliDBwcy+4n0cKn\nVFrM4wJE6lwAVCpe8zQ8+c1cxPKzHxkop4Wse/V9p3bq6A92m3Ge/0qpuoYjoPD8\nQvsnLWWbVoerGQtniKsX0Q==\n-----END PRIVATE KEY-----\n'
                    }
                    doc.useServiceAccountAuth(creds, step);
                },
                function getInfoAndWorksheets(step) {
                    doc.getInfo(function(err, info) {
                        console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                        sheet = info.worksheets[0];
                        console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
                        step();
                    });
                },
                function workingWithRows(step) {
                    sheet.getRows({
                        offset: 2,
                        limit: 91
                    }, function(err, rows) {
                        let repl = [];
                        console.log('Read ' + rows.length + ' rows');

                        if (!isNaN(parseFloat(args[0])) && isFinite(args[0])) {

                            for (let r of rows) {
                                if (r.belsőmmr <= parseFloat(args[0]) && r.belsőmmr !== '') {
                                    repl.push({
                                        name: r.nick,
                                        belsommr: r.belsőmmr
                                    });
                                }
                            }
                        } else {
                            for (let r of rows) {
                                let lower = r.nick.toLowerCase();
                                if (lower.search(args[0]) !== -1) {
                                    repl.push({
                                        name: r.nick,
                                        belsommr: r.belsőmmr
                                    });
                                }
                            }
                        }

                        bot.stopTyping(message.channel);

                        if (repl.length > 0) {
                            let repl2 = [];
                            repl.sort(function(a, b) {
                                if (a.belsommr > b.belsommr) {
                                    return -1;
                                }
                                if (a.belsommr < b.belsommr) {
                                    return 1;
                                }
                                // a must be equal to b
                                return 0;
                            });

                            for (let r of repl) {
                                repl2.push(r.name + ' belső mmr: ' + r.belsommr);
                            }

                            bot.sendMessage(message, repl2);
                        } else {
                            repl = 'Nincs találat...  ¯\_(ツ)_/¯';
                            bot.sendMessage(message.author, repl);
                        }
                        step();
                    });
                },
            ]);
        } else {
            bot.sendMessage(message.author, 'Nem adtál meg paramétert! Így: !mmr név ');
        }
    }




    ///////////////////////////

    if (input.startsWith('!get')) {
        bot.deleteMessage(message);


        async.series([
            function setAuth(step) {
                // see notes below for authentication instructions!
                var creds = require('./havermarcus-84fbd647383f.json');
                // OR, if you cannot save the file locally (like on heroku)
                var creds_json = {
                    client_email: 'havermarcus-141313@appspot.gserviceaccount.com',
                    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUyCjrobRQsXfQ\nfj+mdTTnuhR18+djhUW8yn/RKnvzgUZ6/22GdfxF48nNmco0ooq6bDTCI7jNvWU6\n8d9m5+ynZQLe6OGwWvWXxURNjXTjg84I0/tCD5ZfRInW4ab7G/ptmv+uU/BN0lKb\nQW2LW/uc1mRNYiwULh0wysgNd5UGbOmrL6DJhXfhMUQMYSQtpxm8N4qwRUAu7lSR\nB2KBcN45Z4ws1IRmoUdj0cb5EZTr1HcIgKrbWQ9kgHDg3F0nu4Cwy531skRoSMwy\nZiIyUT12aNEUcRQ0ZgmO75Hdz1kB1ctdL0VYYl9/9Hn2u2hCZOCNdodmVHwVfb/S\nAApJ5EkNAgMBAAECggEAJ9WU+4/ZPuYKZSjNZ683iU4nuHFB1zrC9HYAebr3W33P\nIQWijnKWGMttIyVwWmw3hnDta47ecP3M7r0LMqumfSwG3o5AehB9O719bPtXb6Rk\nNPjiZ9qdLxaYq3axGP+C4XQL+6nRKfB+8HvOMzG0KAdm3anMULbVViYQT50cdAgm\nFUd2OEyCtJBhZp9haFaySAFXBaTR62E7yaDHZ6Pjp3Ydmig9EcH3QJMU7XwDSZz0\nTYOplIMynI0UscpQ1Cd20fjHRXgqA6c5ojW7MVHBpBqsV1D12lG5uUdMUR1YzgIK\nF1izourra/zVn4Fjh3WZOlTsgMQSJ8QjZH/JWiLoYQKBgQD622jWqNiQhjicFvKd\nN0CAwdLVtgoRDqG17c0r7DEZ2Gfg0+ZYZ04pH6uzbvEEFIxp+UDRXqdzXroV298h\n2s5VVZdJHZb+c9yV8higbPM5SiNUm75LqT/78K7yKkeD5fOCTksjJI3DSbpYgWi9\nhWzplDoliS+Q1U826WvxEwJ4FQKBgQDZJOrrGauReJPq7+2Du/Q9vTPW0mGV/Uic\nKFE016h8QpTbZSkyJx1Y7dIfoToGzU16Uqq4nsBGf+2unBj9p1oRQ+KTL3YyCC1r\n3d9D/KQq0aVFWERWlze/DyKF8czw5P1jQd7AKbhPMudyzmCFXvy/3nZPAgBykUe8\ntFkiqwkTGQKBgBTA/kV0JqaeVCSlyWC0Z4O/hV/k9aQ/n6VbjTPrEIzg2IdDQLVj\nppXEZwIrVYlO4ecKlhA8UoI6/g486JL2dUeeEywbZJicoU1OgDcVjHHa7l1bnTzJ\nPd/sI60pTk1dQu4u6Ax6Q7g6a05TNoUnesFAYCcm2GaVHz6dxS5msjeZAoGARIQQ\nmAQujaU1TzFLiYCZ7Y0wuT0Cy7fy3EsgbIMLx8GehKej2w5ahT/tSEuwKotHQiyp\nb72vv88H6UuZ2xeeJMp9yKF2Mw0/f8SveR1Tk6s48euLDKOEVIXrB8anOu+WQGZ9\nabcAUAUo4KHb9Nlm+Qex3vYru/q5XwKtCXJcV6kCgYAFfmk76f24vR/Vr8FjSi/P\nVHrSGZHqgcvFTffc11tAAh0vArdxrSDsEd/CUFecXKTgGVg/SUliDBwcy+4n0cKn\nVFrM4wJE6lwAVCpe8zQ8+c1cxPKzHxkop4Wse/V9p3bq6A92m3Ge/0qpuoYjoPD8\nQvsnLWWbVoerGQtniKsX0Q==\n-----END PRIVATE KEY-----\n'
                }
                gwDoc.useServiceAccountAuth(creds, step);
            },
            function getInfoAndWorksheets(step) {
                gwDoc.getInfo(function(err, info) {
                    console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                    sheet = info.worksheets[2];
                    util.log(sheet.title + ' worksheet selected!');
                    step();
                });
            },

            function workingWithCells(step) {
                sheet.getCells({
                    'min-row': 2,
                    'max-row': 200,
                    'min-col': 1,
                    'max-col': 1,
                    'return-empty': true
                }, function(err, cells) {

                    let i = 0;

                    let keys = Object.keys(havers);
                    keys.sort();
                    for (let h in havers) {
                        cells[i].value = havers[keys[i]].username;
                        i++;
                    }
                    sheet.bulkUpdateCells(cells, function() {
                        util.log(chalk.green('Cells updated'));
                    }); //async

                    //console.log(cells[2]);

                    if (!err) util.log('DONE');
                    else util.log(err);


                    step();
                });
            }




        ]);


    }

    ///////////////////////////



});
