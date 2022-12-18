const {Client} = require('discord.js');
const mongoose = require('mongoose');
const config = require("../../config.json");
const Levels = require("discord.js-leveling")
const ms = require("ms")

const moment = require("moment");
require("moment-duration-format");


module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log('MongoDB connection succesful.')
        }

        Levels.setURL(config.mongodb)

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        setInterval(() => {
            const ping = client.ws.ping
            const Users = client.users.cache.size
            const Servers = client.guilds.cache.size

            //name: `Ping: ${ping} ms | ${Servers}`,
            //setActivity
            client.user.setActivity({
                name: `${Users} members`,
                type: 3,
            })
        }, ms("1s"))


       client.user.setPresence({
            status: "idle"
        })

        require("../../Website/servers")
        console.log(`${client.user.username} is now online.`);
    },
};