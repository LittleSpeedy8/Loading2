const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js")
const warningSchema = require("../../Models/Warnings")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Restrict a member's ability to communicate.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Add a warning to a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Selct a user")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("reason")
                        .setDescription("Provide a reason.")
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName("evidence")
                        .setDescription("Provide evidence.")
                        .setRequired(false)))

        .addSubcommand(subcommand =>
            subcommand.setName("check")
                .setDescription("Check warnings of a user")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user")
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Remove a specific warning from a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user")
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("id")
                        .setDescription("Provide the warning's id.")
                        .setRequired(false)))

        .addSubcommand(subcommand =>
            subcommand.setName("clear")
                .setDescription("Clear all warnings from a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user")
                        .setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { options, guildId, user, member, guild } = interaction;

        const sub = options.getSubcommand(["add", "check", "remove", "clear"])
        const target = options.getUser("target")
        const reason = options.getString("reason") || "No reason provided. 🤔"
        const evidence = options.getString("evidence") || "None provided."
        const warnId = options.getInteger("id") - 1
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString()

        const userTag = `${target.username}#${target.discriminator}`

        const embed = new EmbedBuilder()



        switch (sub) {
            case "add":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (error, data) => {
                    if (error) throw error

                    if (!data) {
                        data = new warningSchema({
                            GuildID: guildId,
                            UserID: target.id,
                            UserTag: userTag,
                            Content: [
                                {
                                    ExecuterID: user.id,
                                    ExecuterTag: user.tag,
                                    Reason: reason,
                                    Evidence: evidence,
                                    Date: warnDate
                                }
                            ],
                        })
                    } else {
                        const warnContent = {
                            ExecuterID: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason,
                            Evidence: evidence,
                            Date: warnDate
                        }
                        data.Content.push(warnContent)
                    }
                    data.save()
                })

                embed.setColor("Green")
                    .setDescription(`${userTag} | ||${target.id}||
                **Reason**: ${reason}
                **Evidence**: ${evidence}`)
                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL() })


                interaction.reply({ embeds: [embed] })

                try {
                    const dm = new EmbedBuilder()
                    target.send({
                        embeds: [dm.setColor("Green")
                            .setDescription(`You got warned in ${guild.name}
                    **Reason**: ${reason}
                    **Evidence**: ${evidence}
                    **Warned by**: ${user}`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL() })]
                    })
                } catch (error) {
                 console.log(`${error}`)
                }

                break;
            case "check":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (error, data) => {
                    if (error) throw error;

                    if(data){
                        embed.setColor("Green")
                        .setDescription(`${data.Content.map(
                            (w, i) =>
                            `**ID**: ${i + 1}
                            **By**: ${w.ExecuterTag}
                            **Date**: ${w.Date}
                            **Reason**: ${w.Reason}
                            **Evidence**: ${w.Evidence}\n\n`
                        ).join(" ")}`)
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL()})
                        .setTimestamp()

                        interaction.reply({embeds: [embed]})
                    } else {
                        embed.setColor("Red")
                        .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL()})
                        .setTimestamp()

                        interaction.reply({embeds: [embed]})
                    }
                })
                break;

                case "remove": 
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (error, data) => {
                    if (error) throw error;

                    if(data){
                     data.Content.splice(warnId, 1)
                     data.save()

                     embed.setColor("Green")
                     .setDescription(`${userTag}'s warning id: ${warnId + 1} has been removed.`)
                     .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL()})
                     .setTimestamp()

                     interaction.reply({embeds: [embed]})

                     try {
                        const dm = new EmbedBuilder()
                        target.send({ content: `${user} has removed your warning id: ${warnId + 1}`})
                    } catch (error) {
                        console.log("The user was not dmed")
                    }

                    } else {
                        embed.setColor("Red")
                        .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL()})
                        .setTimestamp()

                        interaction.reply({embeds: [embed]})
                    }
                })

                break;

                case "clear": 
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (error, data) => {
                    if (error) throw error;

                    if(data){
                    await warningSchema.findOneAndDelete({GuildID: guildId, UserID: target.id, UserTag: userTag})
                     embed.setColor("Green")
                     .setDescription(`${userTag} warnings have been cleared. ||${target.id}||`)
                     .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL()})
                     .setTimestamp()

                     interaction.reply({embeds: [embed]})

                     try {
                        const dm = new EmbedBuilder()
                        target.send({ content: `${user} has cleared all your warnings`})
                    } catch (error) {
                        console.log("The user was not dmed")
                    }
        
                     
                    } else {
                        embed.setColor("Red")
                        .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL()})
                        .setTimestamp()

                        interaction.reply({embeds: [embed]})
                    }
                })
        }
    }
}