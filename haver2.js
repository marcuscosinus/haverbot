"use strict";

const Discord = require('discord.js');
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const fs = require('fs');
const util = require("util");
const chalk = require('chalk');
const gameList = require("./gamelist.json");


const client = new Discord.Client();
const token = 'MjE3ODgyMzMyNjg0NzQ2NzUz.Cp7GmQ.WHQe9-XRTd7rXQg5om6CC0y3c9Q';


const doc = new GoogleSpreadsheet('11JoIst3gOU6LEcGsAnnXxMIRzXgYAm6bpqTx6Cz2mns');
const gwDoc = new GoogleSpreadsheet('16n1yqLrYCmEtYn8CoIfRdf-JRZTvnmSpfwpwHz4-k1M');

var sheet;

const prefix = '!';


// let roleID = message.guild.roles.find("name", "Mods").id;
// let membersWithRole = message.guild.members.filter(m=> m.roles.has(roleID))
// let listOfMembers = membersWithRole.map(m=>m.user.username).join(" ");



client.on('debug', console.log);

client.on('error', (error) => {
  console.log('error: ', error);
});


client.on('ready', () => {
  //let guild = client.guilds.get("178591941535989761");
  // let guild = client.channel.guild;

  // let ch = client.channels;
  // let chiter = ch.values();
//   for (let r of chiter){
//     if (undefined !== r.name) {
// console.log(r.name);
//     }

//   }
  //console.log(guild);
  console.log('I am ready!');
});



client.on('message', msg => {
  //if(msg.author !== client.user) return;
  if(!msg.content.startsWith(prefix)) return;
  // if the message is "ping",
  if (msg.content.startsWith(prefix+'role')) {
   // let members = msg.guild.members.size;
   //msg.author.addRole()
  //  message.guildmember.addRole()
    // send "pong" to the same channel.
    //msg.channel.sendMessage('pong');
    //console.log(members);
  }

  if (msg.content.startsWith(prefix+'admins')) {
    console.log('admin');
   //let admins = client.users.filter( a => a.members.size>100);
   let admin = msg.guild.roles.find('name','Admin');
   let admins = msg.guild.members.filter( m => m.roles.exists('name','Admin'));
   console.log(admins.size);
  }

  if (msg.content === '!roles') {
    // let roles = msg.guild.roles;
    // let guest = roles.find('name',"vendég");
    // let author = msg.author;
    // let member = msg.guild.member(msg.author);
    // let users = client.users;
    // let channels = client.channels;
    // let msgA = msg;

    //console.log(member.user.username);

    //console.log(client.channels.find("name","Iroda"));
    //console.log(msgA);
    //author.sendMessage('hi');
    //author.addRole(guest);
    //console.log(guest.color);
    // roles.map( (k,v) => {
    //   if (v == 'name') {

    //   }
    // })

  }

  if (msg.content.startsWith(prefix+'go')) {
    msg.delete();
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

                    if (r.morcimacik !== '') {
                      repl.push({name: r.morcimacik, room: 'Morci Macik'});
                    }
                    if (r.csibészcsirkék !== '') {
                      repl.push({name: r.csibészcsirkék, room: 'Csibész Csirkék'});
                    }
                    if (r.kaotikuskecskék !== '') {
                      repl.push({name: r.kaotikuskecskék, room: 'Kaotikus Kecskék'});
                    }
                    if (r.pökhendipelikánok !== '') {
                      repl.push({name: r.pökhendipelikánok, room: 'Pökhendi Pelikánok'});
                    }
                    if (r.játékosjegesmedvék !== '') {
                      repl.push({name: r.játékosjegesmedvék, room: 'Játékos Jegesmedvék'});
                    }
                    if (r.dinamikusdenevérek !== '') {
                      repl.push({name: r.dinamikusdenevérek, room: 'Dinamikus Denevérek'});
                    }
                    if (r.veszélyesvadmacskák !== '') {
                      repl.push({name: r.veszélyesvadmacskák, room: 'Veszélyes Vadmacskák'});
                    }
                    if (r.egocentrikuselefántok !== '') {
                      repl.push({name: r.egocentrikuselefántok, room: 'Egocentrikus Elefántok'});
                    }
                  }



                  for (let r of repl) {

                    let ch = client.channels.find('name',r.room);
                    let usr = client.users.find('username',r.name);
                    let role = msg.guild.roles.find('name',r.room);


                    msg.guild.member(usr).addRole(role)
                    .then(
                      msg.guild.member(usr).setVoiceChannel(ch)
                    .then(
                      util.log( chalk.blue( usr.username + ' moved to ' + ch.name) )
                      )
                    .catch(
                      error => util.log(chalk.red(error))
                      )
                    );
                  }
                  step();
              });
          }
      ]);
  }
});


client.login(token);
