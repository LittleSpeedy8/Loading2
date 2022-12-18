const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient } = require("discord.js");

module.exports = {
    developer: false,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("pong"),
    execute(interaction) {

        
            interaction.reply({content: `Pong!`})
       
    },
};