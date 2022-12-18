
const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("A cool music system")
        .addSubcommand(subCommand =>
            subCommand.setName("play")
                .setDescription("Play any song you like.")
                .addStringOption(option =>
                    option.setName("query")
                        .setDescription("Provide the name or url for the song.")
                        .setRequired(true)
                )),

    execute(interaction, client) {

        const { options, member, guild, channel } = interaction

        const subcommand = options.getSubcommand()
        const qurey = options.getString("query");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder()

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("Silly, you need to be in a voice channel!")
            return interaction.reply({ embeds: [embed] })
        }


        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`Silly, you can;t use the music player as it already active in <#${guild.members.me.voice.channelId}`)
            return interaction.reply({ embeds: [embed] })
        }

        try {

            switch (subcommand) {
                case "play":

                    client.distube.play(voiceChannel, qurey, { textChannel: channel, member: member })
                    return interaction.reply({ content: "🎵 Request Received." })
            }


        } catch (error) {
            embed.setDescription(`Error: ${error}`)
            interaction.reply({ embeds: [embed] })
        }

    },
};