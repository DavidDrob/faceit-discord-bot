module.exports = {
    name: 'fcthelp',
    description: "See all the commands the bot knows",
    execute(message, Discord){
            const embed = new Discord.MessageEmbed()
            .setTitle("Available Commands")
            .addField("fcthelp", "Displays the commands you can use with this bot")
            .addField("fct <username>", "Displays your stats from Faceit")
            .addField("fctlast <username>", "Displays your stats from the last game you played on Faceit")
            .addField("fctmap <username> <mapname>", "Displays your stats on the map you entered")
            .addField("fctrole <username>", "Adds you a role on your server by your Faceit Level (only works when an admin already created roles on the server) use the command again to change your role")
            .addField("iq", "Measures your IQ")
            .setThumbnail("https://i.imgur.com/AbF0ImL.png")
            .setColor("FF5500")
            .setFooter("Feel free to contribute! https://github.com/DavidDrob/faceit-discord-bot", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png");
            
            message.channel.send(embed)
    }
}
