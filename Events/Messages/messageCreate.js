const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageCreate",

    async execute(message) {
        if (!message.guild || message.author.bot) return;

        // anti swearing system
        let words = [
            
        ]

        let foundInText = false;

        for (let i in words) {
            if (message.content.toLowerCase().includes(words[i].toLowerCase())) foundInText = true;
        }

        if (foundInText) {
            message.delete();
            const sendmessage = message.channel.send(`${message.author}, your message was flagged for swearing!`).then(message => {
                message.delete(10000)
            })
        }
    }
}