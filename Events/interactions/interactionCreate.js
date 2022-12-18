const { CommandInteraction, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { CustomPlugin } = require("distube");

const ticketSchema = require("../../Models/request");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const { customId, values, guild, member, channel } = interaction; // you need to destructure values from interaction first to use it below
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({ content: "outdated command" });
      }

      //if (command.developer && interaction.user.id !== "541379256878366746") return
     // interaction.reply({content: `Silly, This command is only for the bot owner!`})

      command.execute(interaction, client);
    } else if (interaction.isButton()) {

      if (customId == "verify") {
        const role = interaction.guild.roles.cache.get("998038531404480519");
        const leaverole = interaction.guild.roles.cache.get("998401719362916474");
        return interaction.member.roles.add(role).then((member) =>
          interaction.member.roles.remove(leaverole),
          interaction.reply({
            content: `${role} has been assigned to you.`,
            ephemeral: true,
          })
        );
      }
    } if (customId == "request") {

      
      const { guild, member, customId, channel, guildId } = interaction;
      const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory, ModerateMembers } = PermissionFlagsBits
      const ticketId = Math.floor(Math.random() * 9000) + 10000;


      try{
        await guild.channels.create({
            name: `${member.user.username}-partner${ticketId}`,
            type: ChannelType.GuildText,
            parent: "998038535074496512",
            permissionOverwrites: [
                {
                    id: "998038531404480512",
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
                PartnerID: ticketId,
                ChannelID: channel.id,
                Closed: false,
                Locked: false, 
                Type: customId,
                Claimed: false
            })

            const embed = new EmbedBuilder()
            .setTitle(`${guild.name} - partner-req: ${customId}`)
            .setDescription("Our team will contact you shortly. Please describe why you would like to be partners. <@541379256878366746>")
            .setFooter({text: `${ticketId}`, iconURL: member.displayAvatarURL()})
            .setTimestamp()
            

            const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId("close").setLabel("Close").setStyle(ButtonStyle.Primary).setEmoji("❌"),
            )

            channel.send({
                embeds: ([embed]),
                components: [
                    button
                ]
            })

            interaction.reply({content: `Susccesfully created a partner request! ${channel}`, ephemeral: true})
        })
    } catch (error){
        return console.log(error)
    }

    } else {
      return;
    }
  },
};