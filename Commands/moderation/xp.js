const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, EmbedBuilder, embedLength } = require("discord.js");
const Levels = require("discord.js-leveling")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("xp")
        .setDescription("Adjust a user's xp")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
            .setDescription("Add xp to a user.")
            .addUserOption(option => 
                option.setName("target")
                .setDescription("Select a user to add xp to.")
                .setRequired(true)
                )
                .addIntegerOption(option => 
                    option.setName("amount")
                    .setDescription("Amount of xp.")
                    .setRequired(true)
                    ))
                    .addSubcommand(subcommand =>
                        subcommand.setName("remove")
                        .setDescription("Remove xp from a user.")
                        .addUserOption(option => 
                            option.setName("target")
                            .setDescription("Select a user.")
                            .setRequired(true)
                            )
                            .addIntegerOption(option => 
                                option.setName("amount")
                                .setDescription("Amount of xp.")
                                .setRequired(true)
                                )),
   async execute(interaction) {

        const { options, guildId, user} = interaction;

        const subcommand = options.getSubcommand()
        const target = options.getMember("target") || user;
        const amount = options.getInteger("amount")
        const embed = new EmbedBuilder()

        try{
            switch(subcommand){
                case "add":
                    await Levels.appendLevel(target.id, guildId, amount)
                    target.send(`${target} gave you ${amount} xp!`)
                    embed.setDescription(`Added ${amount} xp to ${target}.`).setColor("Green")
            }

        } catch (error){
            console.log(error)
            embed.setDescription(`Something went wrong. Try again later.`).setColor("Red")
        }

        interaction.reply({embeds: [embed]})
    },
};