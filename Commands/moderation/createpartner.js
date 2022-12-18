const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createpartner')
        .setDescription('Set your verification channel')
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Send verification embed in this channel')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const verifyEmbed = new EmbedBuilder()
            .setTitle("partner-req")
            .setDescription('Click the button to request a partner request.')
            .setColor(0x5fb041)
        let sendChannel = channel.send({
            embeds: ([verifyEmbed]),
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('request').setLabel('Request').setStyle(ButtonStyle.Success),
                ),
            ],
        });
        if (!sendChannel) {
            return interaction.reply({ content: 'There was an error! Try again later.', ephemeral: true });
        } else {
            return interaction.reply({ content: 'Request channel was succesfully set!', ephemeral: true });
        }
    },
};