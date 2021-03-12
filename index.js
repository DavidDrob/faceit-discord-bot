const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

const prefix = "";

const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activity: {
        name: "fcthelp",
        type: 0,
        }
    })
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "fcthelp"){
        client.commands.get('fcthelp').execute(message, Discord);
    }
    if (command === "iq"){
        client.commands.get('iq').execute(message);
    };
    if (command === "fct"){
        client.commands.get('fct').execute(message, args, Discord);
    };
    if (command === "fctrole"){
        client.commands.get('fctrole').execute(message, args, Discord);
    };
    if (command === "fctlast"){
        client.commands.get('fctlast').execute(message, args, Discord);
    };
    if (command === "fctmap"){
        if (args.length === 2){
            client.commands.get('fctmap').execute(message, args, Discord);
        }
        else{
            message.channel.send("Enter a map name!")
        }
    };
})


client.login(process.env.DISCORD_TOKEN);