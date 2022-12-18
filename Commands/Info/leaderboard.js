const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, EmbedBuilder } = require("discord.js");
const Levels = require("discord.js-leveling")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("See who the top rank "),
   async execute(interaction, client) {

        const { options, guildId, user} = interaction;

       const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10)

       if(rawLeaderboard.length < 1) return interaction.reply({content: "Noboy's in the leaderboard yet."})

       

       const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true)

       const lb = leaderboard.map(e => `**${e.position}**. ${e.username}#${e.discriminator}\n**Level:** ${e.level}\n**XP:** ${e.xp.toLocaleString()}`)

       const embed = new EmbedBuilder()
       .setTitle("Leaderboard")
       .setDescription(lb.join("\n\n"))
       .setTimestamp()
       
    
      // embed.setName("Leaderboard").set

        interaction.reply({embeds: [embed]})
    },
}