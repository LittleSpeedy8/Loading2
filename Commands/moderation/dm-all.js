const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const ms = require("ms");
const { user } = require("../..");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dm-all")
        .setDescription("Dms everyone in the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addStringOption(options => options
            .setName("message")
            .setDescription("Provide a message for the dm")
            .setRequired(true))
        .addAttachmentOption(options => options
            .setName("image")
            .setDescription("Provide a image if you like.")
            .setRequired(false)),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, member, user, bot } = interaction;

        const Message = options.getString("message")
        const Image = options.getAttachment("image") || guild.iconURL()

        const errorsArray = [];

        const errorsEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('report')
                    .setLabel('Report')
                    .setStyle(ButtonStyle.Danger),
            )



        const DmEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Dm`)
            .setDescription(`${Message}`)
            .setImage(Image.url)
            .setTimestamp()
            .setFooter({ text: `Dm by ${user.username} | Guild: ${guild} | Powered by ${client.user.username}`, iconURL: user.avatarURL() })

        const SentEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`Successful!`)
            .setFooter({ text: ` Powered by ${client.user.username} | © Mr. Speedy Studios`, iconURL: user.avatarURL() })

       try{
        guild.members
        .fetch()
        .then(members => members.forEach(member => {
            member
                .send({ embeds: [DmEmbed], components: [row] })
                .catch(() => {
                    console.error(`Failed to send ${member.user.tag} a message`)
                })

        }))
       } catch (error) {
        interaction.reply({content: error})
       }

    }
}//        interaction.reply({content: `Successful! `})
