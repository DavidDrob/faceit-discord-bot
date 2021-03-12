const fetch = require("node-fetch");
require('dotenv').config();

module.exports = {
    name: 'fctlast',
    description: "Get stats from your last game",
    execute(message, args, Discord){
        function createEmbed(resp, match_resp, stats){

            const embed = new Discord.MessageEmbed()
            .setAuthor(`${resp.nickname}'s last game`, resp.avatar, `https://www.faceit.com/en/players/${resp.nickname}`)
            .addField("Result", `${match_resp.teams.faction1.nickname} ${match_resp.results.score.faction1}:${match_resp.results.score.faction2} ${match_resp.teams.faction2.nickname}`, false)
            .addField("Kills", stats.player_stats.Kills, true)
            .addField("Deaths", stats.player_stats.Deaths, true)
            .addField("K/D", stats.player_stats['K/D Ratio'], true)
            .addField("Headshot %", stats.player_stats['Headshots %'], true)
            .addField("Assists", stats.player_stats.Assists, true)
            .addField("MVPs", stats.player_stats.MVPs, true)
            .addField("Triple Kills", stats.player_stats['Triple Kills'], true)
            .addField("Quadra Kills", stats.player_stats['Quadro Kills'], true)
            .addField("Aces", stats.player_stats['Penta Kills'], true)
            .setThumbnail(resp.avatar)
            if(resp.games.csgo.skill_level == 1){embed.setColor("CCCCCC")}
            else if(resp.games.csgo.skill_level == 2 || 3 == resp.games.csgo.skill_level){embed.setColor("37ED14")}
            else if(resp.games.csgo.skill_level >= 4 && resp.games.csgo.skill_level <= 6){embed.setColor("ECC822")}
            else if(resp.games.csgo.skill_level == 7){embed.setColor("F2C025")}
            else if(resp.games.csgo.skill_level == 8 || 9 == resp.games.csgo.skill_level){embed.setColor("EB590C")}
            else{embed.setColor("DD120C")}
            
            message.channel.send(embed)
        }

        function playerInTeam(resp, teams, match_resp, username){
            for (i in teams){
                for (j in teams[i].players){
                    if (teams[i].players[j].nickname == username){
                        createEmbed(resp, match_resp, teams[i].players[j])
                    }
                }
            }
        }
        function getMatchStats(resp, match_resp, args){
            fetch(`https://open.faceit.com/data/v4/matches/${match_resp.match_id}/stats`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
                }).then(function (res){
                    return res.json();
                }).then(match_stat_resp => playerInTeam(resp, match_stat_resp.rounds[0].teams, match_resp, args))   
                .catch(err => message.channel.send("Invalid user name"))
            }

        function getMatchHistory(resp, args){
            fetch(`https://open.faceit.com/data/v4/players/${resp.player_id}/history?game=csgo&offset=0&limit=1`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
                }).then(function (res){
                    return res.json();
                }).then(match_resp => getMatchStats(resp, match_resp.items[0], args))
                .catch(err => message.channel.send("Invalid user name"))
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
            }).then(resp => getMatchHistory(resp, args))
            .catch(err => message.channel.send("Invalid user name"))
        
    }
}