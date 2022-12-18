const { EmbedBuilder, client } = require("discord.js");
const Levels = require("discord.js-leveling")

module.exports = {
    name: "messageCreate",
/**
 * 
 * @param {Client} client  
 */
    async execute(message, client) {
      if(!message.guild || message.author.bot) return;

    //  if(message.content.length < 4) return;

    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp)

    if(hasLeveledUp){
        const user = await Levels.fetch(message.author.id, message.guild.id)

        const levelEmbed = new EmbedBuilder()
        .setTitle("New Level!")
        .setDescription(`**GG** ${message.author}, you just levled up to level **${user.level + 1}**!`)
        .setColor("Random")
        .setTimestamp();

        const sentEmbed = await  message.channel.send({embeds: [levelEmbed]});
    }
    }
}