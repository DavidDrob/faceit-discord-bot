module.exports = {
    name: 'iq',
    description: "what's my iq?",
    execute(message){
        // 184344205416464384
        if(message.author.id == 184344205416464384){
            message.channel.send(`You have 159 IQ`);
        }
        else{
            let iq = Math.floor(Math.random() * (10 + 120)) - 10;
            message.channel.send(`You have ${iq} IQ`);    
        
        }


    }
}