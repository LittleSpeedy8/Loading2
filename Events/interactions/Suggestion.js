const { PermissionFlagsBits, EmbedBuilder, IntegrationApplication } = require("discord.js");
const Suggestion = require("../../Models/Suggestion");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const { member, guildId, customId, message, user } = interaction; // you need to destructure values from interaction first to use it below
    
    if(!interaction.isButton()) return;

    if(customId == "suggest-accept" || customId == "suggest-decline"){
        if(!member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({content: "Silly, You need **Administrator** for that!"})

        Suggestion.findOne({ GuildID: guildId, MessageID: message.id}, async(error, data) => {
            if(error) throw error;

            if(!data)
            return interaction.reply({content: "No data was found."})

            const embed = message.embeds[0]

            if(!embed)
            return interaction.reply({content: "No embed was found"})

            switch(customId){
                case "suggest-accept":
                    embed.data.fields[2] = {name: "Status", value: "Accepted", inline: true}
                    const acceptembed  = EmbedBuilder.from(embed).setColor("Green").setFooter({text: `Accepted by ${user.tag}`})

                //   user.send("EH")
                    message.edit({embeds: [acceptembed], components: []})
                    interaction.reply({content: "✅", ephemeral: true})
                    break;

                    case "suggest-decline":
                        embed.data.fields[2] = {name: "Status", value: "Declined", inline: true}
                        const declineembed  = EmbedBuilder.from(embed).setColor("Red").setFooter({text: `Declined by ${user.tag}`})
    
                        message.edit({embeds: [declineembed], components: []})
                     //   message.author.send("TEST")
                        interaction.reply({content: "✅", ephemeral: true})
                        break;
            }
        })
    }
  },
};