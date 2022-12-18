const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, EmbedBuilder, ChannelType, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ticketSchema = require("../../Models/Ticket");
const { ticketParent, everyone } = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Open a ticket for support."),
    async execute(interaction) {



        const { guild, member, customId, channel, guildId } = interaction;
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory, ModerateMembers } = PermissionFlagsBits
        const ticketId = Math.floor(Math.random() * 9000) + 10000;


        try{
            await guild.channels.create({
                name: `${member.user.username}-tickets${ticketId}`,
                type: ChannelType.GuildText,
                parent: ticketParent,
                permissionOverwrites: [
                    {
                        id: everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory]
                    }
                ]
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false, 
                    Type: customId,
                    Claimed: false
                })

                const embed = new EmbedBuilder()
                .setTitle(`${guild.name} - Ticket: ${customId}`)
                .setDescription("Our team will contact you shortly. Please describe your issue. <@&1052381695648739410>")
                .setFooter({text: `${ticketId}`, iconURL: member.displayAvatarURL()})
                .setTimestamp()
                

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId("close").setLabel("Close").setStyle(ButtonStyle.Primary).setEmoji("❌"),
                    new ButtonBuilder().setCustomId("lock").setLabel("Lock").setStyle(ButtonStyle.Secondary).setEmoji("🔐"),
                    new ButtonBuilder().setCustomId("unlock").setLabel("Unlock").setStyle(ButtonStyle.Success).setEmoji("🔓"),
                    new ButtonBuilder().setCustomId("claim").setLabel("Claim").setStyle(ButtonStyle.Secondary).setEmoji("🛄"),
                )

                channel.send({
                    embeds: ([embed]),
                    components: [
                        button
                    ]
                })

                interaction.reply({content: `Susccesfully created a ticket! ${channel}`, ephemeral: false})
            })
        } catch (error){
            return console.log(error)
        }

    },
};