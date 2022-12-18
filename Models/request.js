const { model, Schema } = require("mongoose")

module.exports = model("parnter", new Schema({
    GuildID: String,
    MembersID: [String],
    PartnerID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean, 
    Type: String,
    Claimed: Boolean,
    ClaimedBy: String
}))