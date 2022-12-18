const {ChatInputCommandInteraction, ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, GuildDefaultMessageNotifications, Client } = require("discord.js")
const { createTranscript} = require("discord-html-transcripts")
const TicketSetup = require("../../Models/TicketSetup")
const ticketSchema = require("../../Models/Ticket")


module.exports = {
    name: "interactionCreate",
      /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, member, customId, channel} = interaction;
        const { ManageChannels, SendMessages, ModerateMembers, Administrator } = PermissionFlagsBits

        if(!interaction.isButton()) return;

        if(!["close", "lock", "unlock", "claim"].includes(customId)) return;
        const docs = await TicketSetup.findOne({GuildID: guild.id})
        if(!docs) return;

        if(!guild.members.me.permissions.has((r) => r.id == docs.Handlers))
        interaction.reply({ content: "I don't have permissions for this.", ephemeral: true})

        const embed = new EmbedBuilder().setColor("Aqua");

        ticketSchema.findOne({ChannelID: channel.id}, async(error, data) => {
            if(error) throw error;
            if(!data) return;

            const fetchedMember = await guild.members.cache.get(data.MemberID);

            switch(customId){
                case "close":
                    if(data.Closed == true)
                    return interaction.reply({content: `Ticket is already getting deleted....`, ephemeral: true})
                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        filename: `${member.user.username}-tickets${data.Type}-${data.TicketID}.html`
                    })

                    await ticketSchema.updateOne({ ChannelID: channel.id}, { Closed: true})

                    const transcriptProcess = new EmbedBuilder()
                    .setTitle("Saving transcript....")
                    .setDescription("Ticket will be closed in 10 seconds, enable DM's for the ticket transcript.")
                    .setColor("Red")
                    .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL()})
                    .setTimestamp()
                    var transcriptEmbed = new EmbedBuilder()
                    .setTitle(`Transcript Type: ${data.Type}\nId: ${data.TicketID}`)
                    .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL()})
                    .setTimestamp();
                    channel.send({ embeds: [transcriptEmbed]})

                    const res = await guild.channels.cache.get(docs.transcripts).send({
                        embeds: [transcriptEmbed],
                        files: [transcript],
                    })
                    var transcriptEmbed = new EmbedBuilder()
                    .setTitle(`Transcript Type: ${data.Type}\nId: ${data.TicketID}\nAccess your ticket transcript: ${res.attachments.first().proxyURL}`)
                    .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL()})
                    .setTimestamp();
                    channel.send({ embeds: [transcriptEmbed]})

                    setTimeout(function () {
                        member.send({
                            embeds: [transcriptEmbed],
                        }).catch(() => channel.send(`Couldn\'t send transcript to **Direct** Messages.`))
                        channel.delete()
                    }, 10000)
                    break;

                    case "lock":
                        if(!member.permissions.has(ManageChannels))
                        return interaction.reply({content: "You don't have permmisons for that.", ephemeral: true})

                        if(data.Locked == true)
                        return interaction.reply({content: "Ticket is already set to locked.", ephemeral: true})

                        await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: true})
                        embed.setDescription("Ticket was locked succesfully!")

                        data.MembersID.forEach((m) => {
                            channel.permissionOverwrites.edit(m, { SendMessages: false})
                        })
                        //channel.permissionOverwrites.edit(fetchedMember, { SendMessages: false})

                        return interaction.reply({embeds: [embed]})

                        case "unlock":
                            if(!member.permissions.has(ManageChannels))
                            return interaction.reply({content: "You don't have permmisons for that.", ephemeral: true})
    
                            if(data.Locked == false)
                            return interaction.reply({content: "The ticket is already unlocked!", ephemeral: true})
    
                            await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: false})
                            embed.setDescription("Ticket was unlocked succesfully!")

                            data.MembersID.forEach((m) => {
                                channel.permissionOverwrites.edit(m, { SendMessages: true})
                            })
                           // channel.permissionOverwrites.edit(fetchedMember, { SendMessages: true})
    
                            return interaction.reply({embeds: [embed]})

                            case "claim": 
                            if(!member.permissions.has(MessageChannel))
                            return interaction.reply({ content: "You don't have permissions for that"})

                            if(data.Claimed == true)
                            return interaction.reply({ content: `Ticket is already claimed by <@${data.ClaimedBy}>`, ephemeral: true})

                            await ticketSchema.updateOne({ ChannelID: channel.id}, { Claimed: true, ClaimedBy: member.id})

                            embed.setDescription(`Ticket was claimed by ${member}!`)

                            interaction.reply({embeds: [embed]})

                            break;

                            case "report":
                                console.log("error")
                                break;

            }
        })
    }
}