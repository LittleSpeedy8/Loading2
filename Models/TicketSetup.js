const { model, Schema } = require("mongoose")

module.exports = model("TicketSetup", new Schema({
    GuildID: String,
    Channel: String, 
    Category: String,
    transcripts: String,
    Handlers: String,
    Eveyone: String,
    Description: String,
    Buttons: [String]
}))