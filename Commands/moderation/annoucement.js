const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announcement")
        .setDescription("Send a announcement in any channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addChannelOption(options => options
            .setName("channel")
            .setDescription("Provide a channel for the announcement to be sent.")
            .setRequired(true))
            .addStringOption(options => options
                .setName("message")
                .setDescription("Provide a message for the announcement.")
                .setRequired(true))
                .addAttachmentOption(options => options
                    .setName("image")
                    .setDescription("Provide a image if you like.")
                    .setRequired(false))
                    .addStringOption(options => options
                        .setName("embed-color")
                        .setDescription("Select the embed color")
                        .setRequired(false)
                        .addChoices(
                            {
                                name: "Aqua",
                                value: "Aqua"
                            },
                            {
                                name: "Blue",
                                value: "Blue"
                            },
                            {
                                name: "Blurple",
                                value: "Blurple"
                            },
                            {
                                name: "DarkAqua",
                                value: "DarkAqua"
                            },
                            {
                                name: "DarkBlue",
                                value: "DarkBlue"
                            },
                             {
                                name: "DarkButNotBlack",
                                value: "DarkButNotBlack"
                            },
                            {
                                name: "DarkGold",
                                value: "DarkGold"
                            },
                            {
                                name: "DarkGreen",
                                value: "DarkGreen"
                            },
                            {
                                name: "DarkGrey",
                                value: "DarkGrey"
                            },
                            {
                                name: "DarkNavy",
                                value: "DarkNavy"
                            },
                            {
                                name: "DarkOrange",
                                value: "DarkOrange"
                            },
                            {
                                name: "DarkPurple",
                                value: "DarkPurple"
                            },
                            {
                                name: "DarkRed",
                                value: "DarkRed"
                            },
                            {
                                name: "DarkVividPink",
                                value: "DarkVividPink"
                            },
                            {
                                name: "DarkerGrey",
                                value: "DarkerGrey"
                            },
                            {
                                name: "Default",
                                value: "Default"
                            },
                            {
                                name: "Fuchsia",
                                value: "Fuchsia"
                            },
                            {
                                name: "Gold",
                                value: "Gold"
                            },
                            {
                                name: "Green",
                                value: "Green"
                            },
                            {
                                name: "Grey",
                                value: "Grey"
                            }, 
                            {
                                name: "Greyple",
                                value: "Greyple"
                            },
                            {
                                name: "LightGrey",
                                value: "LightGrey"
                            },
                            {
                                name: "LuminousVividPink",
                                value: "LuminousVividPink"
                            },
                            {
                                name: "NotQuiteBlack",
                                value: "NotQuiteBlack"
                            },
                            {
                                name: "Orange",
                                value: "Orange"
                            },
                        )),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
        const { channel, user, options, member, guild } = interaction

        const AnnouncementChannel = options.getChannel("channel") || channel
        const Message = options.getString("message")
        const Color = options.getString("embed-color") || "Random"
        const Image = options.getAttachment("image") || guild.iconURL()
        const Emoji = "✅"

         //channelTypes: ["GUILD_TEXT"],

        const Embed = new EmbedBuilder()
            // .setColor("Random")
            .setTitle(`Announcement`)
            .setDescription(`${Message}`)
            .setImage(Image.url)
            //.setAuthor({name: "Cheese", iconURL: Image.url})
            .setFooter({ text: `Announcement by ${user.username} | Powered by ${client.user.username}`, iconURL: user.avatarURL() })

            const SentEmbed = new EmbedBuilder()
            // .setColor("Random")
            .setTitle(`Successful!`)
            .setDescription(`The announcement was send in ${AnnouncementChannel}`)
            //.setAuthor({name: "Cheese", iconURL: Image.url})
            .setFooter({ text: ` Powered by ${client.user.username} | © Mr. Speedy Studios`, iconURL: user.avatarURL() })

        // AnnouncementChannel.send({embeds: [Embed]})

        switch (Color) {
            case "Aqua": {


                AnnouncementChannel.send({ embeds: [Embed.setColor("Aqua")] })
            }

                break;

                case "Blue": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("Blue")] })
                }

                break;

                // 

                case "Blurple": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("Blurple")] })
                }

                break;

                case "DarkAqua": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkAqua")] }).then(r => {
                        r.react(`${Emoji}`);
                });
                }

                break;

                case "DarkBlue": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkBlue")] })
                }

                break;

                case "DarkButNotBlack": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkButNotBlack")] })
                }

                 break;

                case "DarkGold": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkGold")] })
                }

                break;

                case "DarkGreen": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkGreen")] })
                }

                break;

                case "DarkGrey": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkGrey")] })
                }

                break;

                 case "DarkNavy": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkNavy")] })
                }

                break;

                case "DarkOrange": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkOrange")] })
                }

                break;

                case "DarkPurple": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkPurple")] })
                }

                break;

                case "DarkRed": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkRed")] })
                }

                break;

                case "DarkVividPink": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkVividPink")] })
                }

                break;

                
                
             case "DarkerGrey": {
                    AnnouncementChannel.send({ embeds: [Embed.setColor("DarkerGrey")] })
                }

                break;

                   
             case "Default": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Default")] })
            }

            break;

            case "Fuchsia": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Fuchsia")] })
            }

            break;

            case "Gold": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Gold")] })
            }

            break; 

            //

            case "Green": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Green")] })
            }

            break; 

            case "Grey": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Grey")] })
            }

            break; 

            case "Greyple": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Greyple")] })
            }

            break; 

            case "LightGrey": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("LightGrey")] })
            }

            break; 

            case "LuminousVividPink": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("LuminousVividPink")] })
            }

            break;

            case "Navy": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Navy")] })
            }

            break;

            case "NotQuiteBlack": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("NotQuiteBlack")] })
            }

            break;

            
            case "Orange": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Orange")] })
            }

            break;

            case "Purple": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Purple")] })
            }

            break;

            case "Random": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Random")] })
            }

            break;

            case "White": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("White")] })
            }

            break;

            case "Yellow": {
                AnnouncementChannel.send({ embeds: [Embed.setColor("Yellow")] })
            }

            break;


        }

        interaction.reply({embeds: [SentEmbed], ephemeral: true})
       
   //  interaction.reply({content: `✔ | Announcement was sent in ${AnnouncementChannel}`})
    }
}