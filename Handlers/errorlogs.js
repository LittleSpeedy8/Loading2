const { Client, EmbedBuilder } = require("discord.js")
const Logs = "ChanelID for the error"

function errorlogs(client) {
    const Embed = new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setFooter({text: "Anti-crash"})
    .setTitle("⚠ | Error Encountered")

    process.on("unhandledRejection", (reason, p) => {
        console.log(reason, p)

        const Channel = client.channels.cache.get(Logs)
        if(!Channel) return

        Channel.send({
            embeds: [
                Embed.setDescription("**Unhandled Rejection/Catch:\n\n**```" + reason + "```")
            ]
        })
    })

    process.on("uncaughtException", (err, origin) => {
        console.log(err, origin)

        const Channel = client.channels.cache.get(Logs)
        if(!Channel) return

        Channel.send({
            embeds: [
                Embed.setDescription("**Uncaught Exception/Catch:\n\n**```" + err + "\n\n" + origin.toString() + "```")
            ]
        })
    })

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, origin)

        const Channel = client.channels.cache.get(Logs)
        if(!Channel) return

        Channel.send({
            embeds: [
                Embed.setDescription("**Uncaught Exception/Catch (MONITOR):\n\n**```" + err + "\n\n" + origin.toString() + "```")
            ]
        })
    })
}

module.exports = {errorlogs};