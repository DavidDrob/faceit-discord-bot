const fetch = require("node-fetch");
require('dotenv').config();

module.exports = {
    name: 'fctrole',
    description: "Get your Discord Role",
    execute(message, args, Discord){
        function createEmbed(resp){
            const roles = ['Level 1','Level 2','Level 3','Level 4','Level 5','Level 6','Level 7','Level 8','Level 9','Level 10'];
            const resp_role = resp.games.csgo.skill_level;
            const roleString = `Level ${resp_role}`;
            const level = message.guild.roles.cache.find(role => role.name === roleString);
            const guildMember = message.member;

            for (let i in roles){
                if (i != roles.indexOf(roleString)){
                    let lvl = message.guild.roles.cache.find(role => role.name === roles[i]);
                    guildMember.roles.remove(lvl);
                }
            }

            guildMember.roles.add(level);

            const embed = new Discord.MessageEmbed()
            .setAuthor(resp.nickname, resp.avatar, `https://www.faceit.com/en/players/${resp.nickname}`)
            .setTitle(`Your role has been changed to ${level.name}!`)
            .setDescription("If you would like to change your role after your rank changes use this command again.")
            .setThumbnail(resp.avatar)
            if(resp.games.csgo.skill_level == 1){embed.setColor("9a9a9a")}
            else if(resp.games.csgo.skill_level == 2 || 3 == resp.games.csgo.skill_level){embed.setColor("4eb338")}
            else if(resp.games.csgo.skill_level >= 4 && resp.games.csgo.skill_level <= 7){embed.setColor("d8cd42")}
            else if(resp.games.csgo.skill_level == 8 || 9 == resp.games.csgo.skill_level){embed.setColor("ca6932")}
            else{embed.setColor("c5233f")}
            
            message.channel.send(embed)
        }
        
        // Main
        fetch(`https://open.faceit.com/data/v4/players?nickname=${args}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
        }
        }).then(function (res){
            return res.json();
        }).then(resp => createEmbed(resp))
        .catch(err => message.channel.send("Invalid user name"))

        
    }
}
