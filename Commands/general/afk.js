const { SlashCommandBuilder,ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, WebhookClient, User } = require("discord.js");
const afkModel = require("../../Models/Afk");

module.exports = {
    developer: false,
    data: new SlashCommandBuilder()
        .setName("afk")
        .setDescription("Toggle your afk status"),
        /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
   async execute(interaction) {

    const { guildId, user, member } = interaction

    await afkModel.findOne({ Guild: guildId, UserID: user.id }, async(error, data) => {
        try{
            if(!data){
                await afkModel.create({
                    Guild: guildId,
                    UserID: user.id,
                    Afk: true
                })
            } else if (data.Afk){
                data.Afk = false;
                data.save();
               return interaction.reply({content: "You are **not** afk anymore."})
            } else {
                data.Afk = true,
                data.save();
            }
            return interaction.reply({content: "You are now afk."})
        } catch (e){
            console.log(e)
        }
    }).clone()
       
    },
};