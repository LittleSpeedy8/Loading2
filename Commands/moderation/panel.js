
const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const rrSchema = require("../../Models/ReactionRoles")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Displays reaction role panel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async  execute(interaction) {
        const { options, guildId, guild, channel } = interaction;

        try{
            const data = await rrSchema.findOne({GuildID: guildId})

            if(!data.roles.length > 0) 
            return interaction.reply({content: "This server dose not have any data."})

            const panelEmbed = new EmbedBuilder()
            .setDescription("Please select a role below")
            .setColor("Aqua")

            const options = data.roles.map(x => {
                const role = guild.roles.cache.get(x.roleId)

                return {
                    label: role.name,
                    value: role.id,
                    description: x.roleDescripton,
                    emoji: x.roleEmoji || undefined
                }
            })

            const menuCompoents = [
                new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId("reaction-roles")
                    .setMaxValues(options.length)
                    .addOptions(options),
                )
            ]

            channel.send({embeds: [panelEmbed], components: menuCompoents})
        } catch (error) {
            console.log(error)
        }
    },
};