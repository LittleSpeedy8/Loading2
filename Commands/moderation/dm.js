const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient, channelLink  } = require("discord.js")
const ms = require("ms");
const { user } = require("../..");

//this is just to log the dm
const webhookClient = new WebhookClient({ id: "", token: "" });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dm")
        .setDescription("Dm someone in a server")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(options => options
            .setName("user")
            .setDescription("Select the user to dm.")
            .setRequired(true))
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
        const { options, guild, member, user, bot, customId, channel } = interaction;

        interaction.deferReply()

        const User = options.getMember("user");
        const Message = options.getString("message")
        const Image = options.getAttachment("image") || guild.iconURL()

        const errorsArray = [];

        const errorsEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")

        if (!User) return interaction.reply({
            embeds: [errorsEmbed.setDescription("Member has most likely left the guild")],
            ephemeral: true
        })

        if (User.user.bot) return interaction.reply({
            embeds: [errorsEmbed.setDescription("Silly, you can't dm bots!")],
            ephemeral: true
        })// remove the semicolon here

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
            .setDescription([
                `The dm was sent!`,
                `Dm To ${User}(${User.id})`,
                `\nMessage: ${Message}`
            ].join("\n"))
            .setFooter({ text: ` Powered by ${client.user.username} | © Mr. Speedy Studios`, iconURL: user.avatarURL() })
        //The dm was send to @Mr. Speedy(541379256878366746)

        const DmLogs = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`New Dm`)
            .setDescription([
                `Dm by ${member}`,
                `Dm To ${User}(${User.id})`,
                `\nMessage: ${Message}`
            ].join("\n"))
            .setFooter({ text: ` Powered by ${client.user.username} | © Mr. Speedy Studios`, iconURL: user.avatarURL() })

       
        webhookClient.send({
            content: 'Dm Logs',
            username: 'Loading',
            avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [DmLogs],
        });

        // client.channels.get('998038535837859894').send({ embeds: [DmLogs]});

        try {
            User.send({ embeds: [DmEmbed], components: [row] }).catch(() => {
             interaction.editReply({embeds: [DmEmbed.setDescription(`There was an error while dming that user.`).setTitle("ERROR")]})
            // interaction.editReply({embeds: [DmLogs.setTitle(`New Dm(The dm faild to send)`)]})
            })
            interaction.reply({ embeds: [SentEmbed] })
        } catch (error) {
            interaction.reply({ embeds: [errorsEmbed.setDescription(`${error}`)] })
        }





    }
}//        interaction.reply({content: `Successful! `})