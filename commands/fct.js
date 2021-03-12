const fetch = require("node-fetch");
require('dotenv').config();

module.exports = {
    name: 'fct',
    description: "Get your faceit Stats",
    execute(message, args, Discord){

            // Stats
           function fetchStats(resp, rank_resp, rank_country_resp){
            fetch(`https://open.faceit.com/data/v4/players/${resp.player_id}/stats/csgo`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
                }).then(function (res){
                    return res.json();
                }).then(stats_resp => createEmbed(resp, rank_resp, rank_country_resp, stats_resp))
           }


            // Ranking
            function fetchRankCountry(resp, rank_resp){
                fetch(`https://open.faceit.com/data/v4/rankings/games/csgo/regions/${resp.games.csgo.region.toUpperCase()}/players/${resp.player_id}?country=${resp.country}&limit=1`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                    }
                    }).then(function (res){
                        return res.json();
                    }).then(rank_country_resp => fetchStats(resp, rank_resp, rank_country_resp))
            }

            function fetchRank(resp){
                fetch(`https://open.faceit.com/data/v4/rankings/games/csgo/regions/${resp.games.csgo.region.toUpperCase()}/players/${resp.player_id}?limit=1`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                    }
                    }).then(function (res){
                        return res.json();
                    }).then(rank_resp => fetchRankCountry(resp, rank_resp))
            }

        
        // Embed
        // Recent Game
        function getRecentGame(stats_resp){
            let games = ''
            stats_resp.lifetime['Recent Results'].forEach(game => {
                if (game == 1){
                    games += ':green_circle: '
                }
                else{
                    games += ':red_circle: '
                }
            });
            return games
        }

        function createEmbed(resp, rank_resp, rank_country_resp, stats_resp){
            const embed = new Discord.MessageEmbed()
            .setTitle(resp.nickname)
            .addField("Country Rank", `:flag_${resp.country}: ${rank_country_resp.position}`, true)
            .addField("Region Rank", `:flag_${resp.games.csgo.region.toLowerCase()}: ${rank_resp.position}`, true)
            .addField("Win Rate", stats_resp.lifetime['Win Rate %'], true)
            .addField("Faceit Level", resp.games.csgo.skill_level, true)
            .addField("Elo", resp.games.csgo.faceit_elo, true)
            .addField("Average K/D", stats_resp.lifetime['Average K/D Ratio'], true)
            .addField("Headshot Percentage", stats_resp.lifetime['Average Headshots %'], true)
            .addField("Recent Games", getRecentGame(stats_resp), true)
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
        }).then(resp => fetchRank(resp))
        .catch(err => message.channel.send("Invalid user name"))

        
    }
}
