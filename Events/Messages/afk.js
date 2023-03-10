const { EmbedBuilder, client, Message } = require("discord.js");
const afkModel = require("../../Models/Afk");

module.exports = {
    name: "messageCreate",
/**
 * 
 *  * @param {Message} message
 * @param {Client} client  
 */
    async execute(message, client) {
     if(message.author.bot || !message.guild) return;

     afkModel.findOne({ Guild: message.guild.id, UserID: message.author.id }, async (error, data) => {
        if(data.Afk){
            data.Afk = false;
            data.save();
        }
        return;
     })

     const taggedMembers = message.mentions.users.map(msg => msg.id)

     if(taggedMembers.length > 0){
        taggedMembers.forEach(m => {
            afkModel.findOne({ Guild: message.guild.id, UserID: m}, async(error, data) => {
                if(data.Afk){
                    message.reply("This user is currently **afk**")
                }
                return;
            })
        })
     }
    }
}