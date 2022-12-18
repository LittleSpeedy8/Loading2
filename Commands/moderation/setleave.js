const {Message, Client, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const welcomeSchema = require("../../Models/Leave");
const {model, Schema} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-leave")
    .setDescription("Set up your leave message for the discord bot.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName("channel")
        .setDescription("Channel for leave messages.")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("leave-message")
        .setDescription("Enter your leave message.")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const welcomeChannel = options.getChannel("channel");
        const welcomeMessage = options.getString("leave-message");
        const roleId = options.getRole("leave-role");

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({content: "I don't have permissions for this.", ephemeral: true});
        }

        welcomeSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {
            if(!data) {
                const newleave = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessage,
                });
            }
            interaction.reply({content: 'Succesfully created a leave message', ephemeral: true});
        })
    }
}