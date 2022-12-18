const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, WebhookClient, Client, EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const { connection } = require("mongoose")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Shows the bot status"),
    /**
     * 
     * @param {Client} client 
     */
    execute(interaction, client) {
        //console.log(client.colors)

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        const Response = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Bot Status")
            .setDescription("Display the bot info status. ")
        .addFields(
            { name: 'Client', value: `🟢 ONLINE - ${client.ws.ping}ms`, inline: false },
               { name: 'Uptime', value: `${duration}`, inline: true },
                { name: 'Database', value: `${switchTo(connection.readyState)}`, inline: false },
                { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        )
            .addFields({ name: 'Users', value: `${client.users.cache.size}`, inline: false })
         .addFields({ name: 'Emojis', value: `${client.emojis.cache.size}`, inline: false })
          .addFields({ name: 'Channels', value: `${client.channels.cache.size}`, inline: false })
         //.addFields({ name: 'Presence', value: `${client.user.presence.activities || "Bot status was not set."}`, inline: false })
         .addFields({ name: 'Discord Bot Since', value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: false })
        .setFooter({ text: `Powered by ${client.user.tag} | © Blue Jay` })
         .setTimestamp()



        return interaction.reply({ embeds: [Response] })


    }
}

function switchTo(val) {
    var status = " ";
    switch (val) {
        case 0: status = `🔴 DISCONNECTED`
            break;
        case 1: status = `🟢 CONNECTED`
            break;
        case 2: status = `🟠 CONNECTING`
            break;
        case 2: status = `🟣 DISCONNECTING`
            break;
    }
    return status;
}

