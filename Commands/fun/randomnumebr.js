const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random-number")
        .setDescription("Just picks a number 1 to 1,000"),
    execute(interaction) {

        const Number = Math.floor(Math.random() * 100) + 1;
        
            interaction.reply({content: `${Number}`})
       
    },
};