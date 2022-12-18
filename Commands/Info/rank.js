const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, EmbedBuilder, embedLength } = require("discord.js");
const Levels = require("discord.js-leveling")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Get infoi about somone's rank")
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("user")
            .setDescription("Select a user.")),
   async execute(interaction) {

        const { options, guildId, user} = interaction;

        const member = options.getMember("user") || user;

        const levelUser = await Levels.fetch(member.id, guildId)

        const embed = new EmbedBuilder()
       
        if(!levelUser) return interaction.reply({content: `Silly, ${user.tag} has not xp!`})

        embed.setDescription(`**${member.tag}** is currently level ${levelUser.level} and has ${levelUser.xp.toLocaleString()} xp.`).setColor("Random").setTimestamp()

        interaction.reply({embeds: [embed]})
    },
};