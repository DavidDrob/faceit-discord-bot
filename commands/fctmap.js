const fetch = require("node-fetch");
require('dotenv').config();

module.exports = {
    name: 'fctmap',
    description: "Get your faceit stats on a given map",
    execute(message, args, Discord){
        let mapInput = `de_${args[1].toLowerCase()}`; 

        function createEmbed(resp, map_resp){
            const embed = new Discord.MessageEmbed()
            .setTitle(resp.nickname)
            .setAuthor(`${resp.nickname}'s average stats on ${mapInput}`, resp.avatar, `https://www.faceit.com/en/players/${resp.nickname}`)
            .addField("Map name", `${map_resp.label}`, false)
            .addField("Matches", `${map_resp.stats.Matches}`, true)
            .addField("Wins", `${map_resp.stats.Wins}`, true)
            .addField("Losses", `${map_resp.stats.Matches-map_resp.stats.Wins}`, true)
            .addField("Kills", `${map_resp.stats['Average Kills']}`, true)
            .addField("Deaths", `${map_resp.stats['Average Deaths']}`, true)
            .addField("K/D", `${map_resp.stats['Average K/D Ratio']}`, true)
            .addField("Headshot %", `${map_resp.stats['Average Headshots %']}`, true)
            .addField("Assists", `${map_resp.stats['Average Assists']}`, true)
            .addField("MVPs", `${map_resp.stats.MVPs}`, true)
            .addField("Triple Kills", `${map_resp.stats['Triple Kills']}`, true)
            .addField("Quadra Kills", `${map_resp.stats['Quadro Kills']}`, true)
            .addField("Aces", `${map_resp.stats['Penta Kills']}`, true)
            .setThumbnail(resp.avatar)
            if(resp.games.csgo.skill_level == 1){embed.setColor("CCCCCC")}
            else if(resp.games.csgo.skill_level == 2 || 3 == resp.games.csgo.skill_level){embed.setColor("37ED14")}
            else if(resp.games.csgo.skill_level >= 4 && resp.games.csgo.skill_level <= 6){embed.setColor("ECC822")}
            else if(resp.games.csgo.skill_level == 7){embed.setColor("F2C025")}
            else if(resp.games.csgo.skill_level == 8 || 9 == resp.games.csgo.skill_level){embed.setColor("EB590C")}
            else{embed.setColor("DD120C")}
            
            message.channel.send(embed)
        }

        function findMap(resp, maps){
            for (i in maps){
                if (maps[i].label == mapInput){
                    createEmbed(resp, maps[i]);
                }
            }
        }

        function getMaps(resp){
            fetch(`https://open.faceit.com/data/v4/players/${resp.player_id}/stats/csgo`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
                }).then(function (res){
                    return res.json();
                }).then(maps_resp => findMap(resp, maps_resp.segments))
                .catch(err => message.channel.send("Invalid user name"))
        }
        


        // Main
        fetch(`https://open.faceit.com/data/v4/players?nickname=${args[0]}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
        }
        }).then(function (res){
            return res.json();
        }).then(resp => getMaps(resp))
        .catch(err => message.channel.send("Invalid user name"))

        
    }
}