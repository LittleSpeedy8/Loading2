const {Message, Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const Logs = require("../../Models/Logs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-logs")
    .setDescription("Set up your welcome message for the discord bot.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName("channel")
        .setDescription("Channel for welcome messages.")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {channel, options, guildId} = interaction;

        const logChannel = options.getChannel("channel") || channel
        const embed = new EmbedBuilder()

        Logs.findOne({Guild: interaction.guild.id}, async (error, data) => {
            if(!data) {
             await Logs.create({
                    Guild: guildId,
                    Channel: logChannel.id
                    
                });

                embed.setDescription("Data was succesfully sent to the database.")
                .setColor("Green").setTimestamp()
            } else if(data){
             Logs.deleteOne({Guild: guildId});
                await Logs.create({
                    Guild: guildId,
                    Channel: logChannel.id
                    
                });

                embed.setDescription("Old data was succesfully replaced with the new data.")
                .setColor("Green").setTimestamp()
            }

            if(error){
                embed.setDescription("Something went wrong. Please contat the developers.").setColor("Red").setTimestamp()
            }

            interaction.reply({embeds: [embed], ephemeral: true});
        })
    }
}